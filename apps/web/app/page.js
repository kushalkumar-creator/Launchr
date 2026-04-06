import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full flex items-center px-10 py-6 border-b border-[#1a1a2e]">
        {/* BRAND */}
        <div className="text-2xl md:text-3xl font-semibold tracking-tight bg-linear-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          Launchr
        </div>

        {/* NAV LINKS */}
        <div className="ml-auto flex items-center gap-10 text-base font-medium text-gray-400">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center">
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#2a2a4a] text-[#8b8bff] text-xs px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          Open source deployment platform
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
          Deploy apps in <br />
          <span className="text-indigo-500">seconds</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-12">
          Connect your GitHub repo, click deploy, and get a live public URL
          instantly.
        </p>

        {/* CTA */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/github`}
          className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl font-semibold text-base transition"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            {" "}
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.810 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>

        {/* STEPS */}
        <div className="flex items-center gap-5 mt-12 flex-wrap justify-center text-sm text-gray-500">
          {["Connect repo", "Click deploy", "Go live"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full border border-[#2a2a4a] bg-[#1a1a2e] text-indigo-500 text-xs font-bold">
                {i + 1}
              </span>
              {step}
              {i < 2 && <span className="mx-3">→</span>}
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-6xl w-full px-4">
          {[
            {
              icon: "⚡",
              title: "Instant deploys",
              desc: "Push to GitHub, live in seconds",
            },
            {
              icon: "📋",
              title: "Live logs",
              desc: "Watch builds in real time",
            },
            {
              icon: "🌍",
              title: "Public URLs",
              desc: "Share with anyone instantly",
            },
            {
              icon: "🔒",
              title: "Secure auth",
              desc: "GitHub OAuth, zero passwords",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#111118] border border-[#222230] rounded-xl p-6 text-left hover:border-indigo-500/40 transition"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold mb-2">{f.title}</div>
              <div className="text-gray-500 text-sm leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
