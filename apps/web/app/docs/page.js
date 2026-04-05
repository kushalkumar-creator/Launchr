export default function Docs() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Launchr Docs
        </h1>

        <p className="text-gray-400 text-lg mb-12">
          Launchr is an open-source deployment platform that lets you deploy apps directly from GitHub in seconds — no configuration required.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚀 What is Launchr?</h2>
          <p className="text-gray-400 leading-relaxed">
            Launchr is a lightweight deployment platform designed for developers who want a fast and simple way to deploy applications.
            Just connect your GitHub repository, click deploy, and your app will be live with a public URL instantly.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">⚙️ How it works</h2>

          <div className="space-y-4 text-gray-400">
            <p><span className="text-white font-medium">1.</span> Connect your GitHub account using OAuth</p>
            <p><span className="text-white font-medium">2.</span> Select a repository</p>
            <p><span className="text-white font-medium">3.</span> Click deploy</p>
            <p><span className="text-white font-medium">4.</span> Launchr builds and deploys your app</p>
            <p><span className="text-white font-medium">5.</span> Get a public URL instantly</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">✨ Features</h2>

          <ul className="space-y-3 text-gray-400">
            <li>⚡ Instant deployments</li>
            <li>📋 Real-time build logs</li>
            <li>🌍 Public URLs for sharing</li>
            <li>🔒 Secure GitHub authentication</li>
            <li>🚫 No configuration required</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🧠 Why Launchr?</h2>
          <p className="text-gray-400 leading-relaxed">
            Most deployment platforms require complex setup, configuration files, or infrastructure knowledge.
            Launchr removes all of that friction and lets you focus on building your app instead of managing deployments.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">📦 Supported Apps</h2>
          <p className="text-gray-400 leading-relaxed">
            Launchr supports most modern web applications including Node.js apps, static sites, and frontend frameworks like React and Next.js.
          </p>
        </section>

        <div className="mt-16 text-center">
          <a
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Go back to Home
          </a>
        </div>

      </div>
    </div>
  );
}