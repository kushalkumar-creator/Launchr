"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";
import { apiFetch } from "@/lib/api";

export default function LogsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [deploymentUrl, setDeploymentUrl] = useState(null);
  const [status, setStatus] = useState("deploying");
  const logEndRef = useRef(null);

  useEffect(() => {
    apiFetch(`/api/deployments/${id}`)
      .then((data) => {
        if (data?.logs) setLogs(data.logs);
        if (data?.url) setDeploymentUrl(data.url);
        if (data?.status === "ready") setStatus("success");
        if (data?.status === "failed") setStatus("failed");
      });

    const socket = io("http://localhost:4000");
    socket.emit("join", id);

    socket.on("log", (log) => {
      setLogs((prev) => [...prev, log]);

      if (log.toLowerCase().includes("error")) setStatus("failed");

      if (log.includes("Deployment successful")) {
        setStatus("success");
        apiFetch(`/api/deployments/${id}`)
          .then((data) => {
            if (data.url) setDeploymentUrl(data.url);
          });
      }
    });

    return () => socket.disconnect();
  }, [id]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getStatusColor = () => {
    if (status === "success") return "#22c55e";
    if (status === "failed") return "#ef4444";
    return "#facc15";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0b0f19] to-[#020617] text-white py-10">

      <div className="max-w-4xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Home
            </button>
            <span className="text-gray-700">/</span>
            <h1 className="text-lg font-semibold">Deployment Logs</h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: getStatusColor() }}
            />
            <span className="text-sm capitalize text-gray-300">{status}</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="ml-3 text-xs text-gray-400 font-mono">deployment.log</span>
          </div>

          <div className="h-96 overflow-y-auto font-mono text-sm p-5 space-y-1.5">
            {logs.length === 0 && (
              <div className="text-gray-500">Waiting for logs...</div>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.toLowerCase().includes("error")
                    ? "text-red-400"
                    : log.includes("successful")
                    ? "text-purple-400"
                    : "text-green-400"
                }
              >
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {deploymentUrl && (
          <div className="mt-8 flex justify-center">
            <a
              href={deploymentUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
              bg-linear-to-r from-purple-500 to-indigo-500
              hover:from-purple-400 hover:to-indigo-400
              transition-all duration-200 shadow-lg
              hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Visit Live App
            </a>
          </div>
        )}

      </div>
    </div>
  );
}