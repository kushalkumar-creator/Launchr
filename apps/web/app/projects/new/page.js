"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function NewProject() {
  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name, repoUrl }),
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0f19] to-[#020617] flex items-center justify-center px-6">

      <div className="w-full max-w-xl 
        bg-linear-to-b from-white/10 to-white/5 
        border border-white/10 
        backdrop-blur-2xl 
        rounded-3xl 
        p-10 shadow-2xl">

        <h1 className="text-2xl font-semibold text-white mb-8 tracking-tight">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Project Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Project Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-app"
              className="w-full bg-white/5 border border-white/10 
              px-4 py-3 rounded-xl text-base 
              placeholder:text-gray-500 
              focus:outline-none focus:border-white/30 focus:bg-white/10 
              transition"
            />
          </div>

          {/* Repo URL */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Repository URL
            </label>
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full bg-white/5 border border-white/10 
              px-4 py-3 rounded-xl text-base 
              placeholder:text-gray-500 
              focus:outline-none focus:border-white/30 focus:bg-white/10 
              transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 text-base rounded-xl font-semibold 
            bg-linear-to-r from-purple-500 to-indigo-500 
            hover:from-purple-400 hover:to-indigo-400
            transition-all duration-200 
            shadow-lg hover:shadow-xl"
          >
            Create Project →
          </button>
        </form>
      </div>
    </div>
  );
}