"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Trash2, LogOut } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState({});
  const [deploying, setDeploying] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchAll = async () => {
      const data = await apiFetch("/api/projects");
      setProjects(data);

      const map = {};
      for (const project of data) {
        const deps = await apiFetch(`/api/deployments/project/${project._id}`);
        map[project._id] = Array.isArray(deps) ? deps.slice(0, 3) : [];
      }
      setDeployments(map);
    };

    fetchAll();
  }, []);

  const deploy = async (projectId) => {
    setDeploying(projectId);
    try {
      const data = await apiFetch(`/api/deployments/${projectId}/deploy`, {
        method: "POST",
      });
      router.push(`/logs/${data.deploymentId}`);
    } catch (err) {
      console.error(err);
      setDeploying(null);
    }
  };

  const deleteProject = async (projectId) => {
    if (!confirm("Delete this project?")) return;
    await apiFetch(`/api/projects/${projectId}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  };

  const statusLabel = (status) => {
    if (status === "ready") return "✅";
    if (status === "failed") return "❌";
    if (status === "building") return "🔄";
    return "⏳";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0f19] to-[#020617] text-white">
      <nav className="w-full flex items-center px-10 py-5 border-b border-white/5">
        <div
          className="text-xl md:text-2xl font-semibold tracking-tight 
    bg-linear-to-r from-purple-500 to-indigo-500 
    bg-clip-text text-transparent cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Launchr
        </div>

        <div className="ml-auto flex items-center gap-8 text-sm text-gray-400">
          <button
            onClick={logout}
            className="hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-8 py-10">
        {/* header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              My Projects
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => router.push("/projects/new")}
            className="px-5 py-2 text-sm rounded-lg font-medium
            bg-linear-to-r from-purple-500 to-indigo-500
            hover:from-purple-400 hover:to-indigo-400
            transition-all duration-200 shadow-md"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-gray-500 text-sm mb-6">
              Create your first project and deploy in seconds
            </p>
            <button
              onClick={() => router.push("/projects/new")}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 rounded-xl text-sm font-semibold"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-7">
            {projects.map((p) => (
              <div
                key={p._id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl
                hover:bg-white/10 transition-all duration-300 hover:shadow-xl"
              >
                {/* delete */}
                <button
                  onClick={() => deleteProject(p._id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition"
                >
                  <Trash2 size={15} />
                </button>

                {/* project info */}
                <h3 className="text-base font-semibold tracking-tight mb-1 pr-6">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4 break-all leading-relaxed">
                  {p.repoUrl}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Ready to deploy</span>
                </div>

                {/* deploy button */}
                <button
                  onClick={() => deploy(p._id)}
                  disabled={deploying === p._id}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm
                  bg-linear-to-r from-purple-500 to-indigo-500
                  hover:from-purple-400 hover:to-indigo-400
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-300
                  hover:scale-[1.02] active:scale-[0.98] mb-5"
                >
                  {deploying === p._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Deploying...
                    </span>
                  ) : (
                    "Deploy"
                  )}
                </button>

                {/* recent deployments */}
                {deployments[p._id]?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider">
                      Recent deployments
                    </p>
                    <div className="space-y-2">
                      {deployments[p._id].map((dep) => (
                        <div
                          key={dep._id}
                          className="flex items-center justify-between
                          bg-white/3 border border-white/5 rounded-xl px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {statusLabel(dep.status)}
                            </span>
                            <div>
                              <p className="text-xs text-gray-300 capitalize font-medium">
                                {dep.status}
                              </p>
                              <p className="text-xs text-gray-600">
                                {timeAgo(dep.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/logs/${dep._id}`)}
                              className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded-lg hover:bg-white/10"
                            >
                              Logs
                            </button>
                            {dep.url && dep.status === "ready" && (
                              <a
                                href={dep.url}
                                target="_blank"
                                className="text-xs text-purple-400 hover:text-purple-300 transition px-2 py-1 rounded-lg hover:bg-white/10"
                              >
                                Visit →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
