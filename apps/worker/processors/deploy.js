const Redis = require("ioredis");
const pub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined
});

const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const express = require("express");
const ngrok = require("@ngrok/ngrok");
const Deployment = require("@launchr/db/models/Deployment");

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });
  });
}

async function pushLog(deploymentId, log) {
  console.log(log);
  await Deployment.findByIdAndUpdate(deploymentId, {
    $push: { logs: log },
  });
  await pub.publish(
    "deployment-logs",
    JSON.stringify({ deploymentId, log })
  );
}

async function deployProcessor({ deploymentId, repoUrl, buildCmd }) {
  console.log("🚀 Deploying deployment:", deploymentId);
  const startTime = Date.now();
  const port = 5000 + Math.floor(Math.random() * 1000);

  try {
    const projectPath = path.join(__dirname, "../../temp", deploymentId);

    await pushLog(deploymentId, "🚀 Deployment started");

    // cleanup old folder
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    fs.mkdirSync(projectPath, { recursive: true });

    // clone repo
    await pushLog(deploymentId, "📥 Cloning repository...");
    await execPromise(`git clone ${repoUrl} ${projectPath}`);

    // install dependencies
    await pushLog(deploymentId, "📦 Installing dependencies...");
    await execPromise("npm install", { cwd: projectPath });

    // read package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found");
    }
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    );

    let finalUrl = null;

    // =====================================
    // STATIC APP (React / Vite / CRA)
    // =====================================
    if (packageJson.scripts?.build) {
      await pushLog(deploymentId, "⚛️ React/Vite app detected");
      await pushLog(deploymentId, "🏗️ Building project...");

      await execPromise(buildCmd || "npm run build", { cwd: projectPath });

      // find build output folder
      const distPath = path.join(projectPath, "dist");
      const buildPath = path.join(projectPath, "build");

      let staticPath = null;
      if (fs.existsSync(distPath)) staticPath = distPath;
      else if (fs.existsSync(buildPath)) staticPath = buildPath;

      if (!staticPath) throw new Error("Build folder not found (dist/ or build/)");

      await pushLog(deploymentId, "📦 Static build detected");

      // serve static files
      const app = express();

      app.use("/", express.static(staticPath));

      // SPA fallback — all routes return index.html
      app.use("/", (req, res) => {
        res.sendFile(path.join(staticPath, "index.html"));
      });

      // start server
      await new Promise((resolve, reject) => {
        app.listen(port, (err) => {
          if (err) reject(err);
          else {
            console.log(`🌐 Static app running on port ${port}`);
            resolve();
          }
        });
      });

      await pushLog(deploymentId, `🌐 Local URL: http://localhost:${port}`);

      // create ngrok tunnel for this port
      await pushLog(deploymentId, "🔗 Creating public URL...");
      const listener = await ngrok.forward({
        addr: port,
        authtoken: process.env.NGROK_AUTHTOKEN,
      });

      finalUrl = listener.url();
    }

    // =====================================
    // NODE APP
    // =====================================
    else if (packageJson.scripts?.start) {
      await pushLog(deploymentId, "🔥 Node app detected");

      const child = spawn(packageJson.scripts.start, {
        cwd: projectPath,
        env: { ...process.env, PORT: port },
        shell: true,
      });

      child.stdout.on("data", (data) => {
        pushLog(deploymentId, data.toString().trim());
      });

      child.stderr.on("data", (data) => {
        pushLog(deploymentId, `❌ ${data.toString().trim()}`);
      });

      child.on("close", (code) => {
        console.log(`App exited with code ${code}`);
      });

      // wait for server to start
      await new Promise((r) => setTimeout(r, 4000));

      await pushLog(deploymentId, `🚀 Local URL: http://localhost:${port}`);

      // create ngrok tunnel
      await pushLog(deploymentId, "🔗 Creating public URL...");
      const listener = await ngrok.forward({
        addr: port,
        authtoken: process.env.NGROK_AUTHTOKEN,
      });

      finalUrl = listener.url();
    }

    // =====================================
    // SAVE FINAL URL + STATUS
    // =====================================
    if (!finalUrl) throw new Error("Could not generate public URL");

    await pushLog(deploymentId, `🌍 Public URL: ${finalUrl}`);

    const endTime = Date.now();

    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "ready",
      url: finalUrl,
      port: port,
      finishedAt: new Date(),
      buildDuration: endTime - startTime,
    });

    await pushLog(deploymentId, "✅ Deployment successful 🚀");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    await pushLog(deploymentId, `❌ Error: ${error.toString()}`);
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "failed",
      error: error.toString(),
      finishedAt: new Date(),
    });
  }
}

module.exports = { deployProcessor };