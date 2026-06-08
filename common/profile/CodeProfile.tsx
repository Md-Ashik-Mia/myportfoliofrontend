const coderData = {
  name: "Zane Whitaker",
  role: "Frontend Developer",
  seniority: "Mid-Level",
  location: "Bangladesh",
  skills: [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "TailwindCSS",
    "CSS",
    "Figma",
    "GitHub",
    "HTML",
    "Astro",
    "Node.js",
    "Express",
    "MongoDB",
    "Firebase",
    "Git",
  ],
};

export default function CodeProfile() {
  return (
    <section className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#05060d] via-[#080b17] to-[#0a0d2d] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-cyan-400" />

      <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs text-white/45">coder.js</span>
      </div>

      <div className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-0">
          <div className="hidden select-none font-mono text-xs text-white/35 lg:block">
            {Array.from({ length: 12 }, (_, index) => (
              <div key={index} className="h-[22px] text-right leading-[22px]">
                {index + 1}
              </div>
            ))}
          </div>

          <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-6 text-white/90 sm:text-xs lg:text-sm">
            <code>
              <div>
                <span className="text-pink-400">const</span>{" "}
                <span className="text-violet-400">coder</span>{" "}
                <span className="text-pink-400">=</span>{" "}
                <span className="text-white/50">{`{`}</span>
              </div>
              <div className="pl-6">
                <span className="text-white">name:</span>{" "}
                <span className="text-white/50">{`'`}</span>
                <span className="text-emerald-400">{coderData.name}</span>
                <span className="text-white/50">{`'`},</span>
              </div>
              <div className="pl-6">
                <span className="text-white">role:</span>{" "}
                <span className="text-white/50">{`'`}</span>
                <span className="text-emerald-400">{coderData.role}</span>
                <span className="text-white/50">{`'`},</span>
              </div>
              <div className="pl-6">
                <span className="text-white">seniority:</span>{" "}
                <span className="text-white/50">{`'`}</span>
                <span className="text-emerald-400">{coderData.seniority}</span>
                <span className="text-white/50">{`'`},</span>
              </div>
              <div className="pl-6">
                <span className="text-white">location:</span>{" "}
                <span className="text-white/50">{`'`}</span>
                <span className="text-emerald-400">{coderData.location}</span>
                <span className="text-white/50">{`'`},</span>
              </div>
              <div className="pl-6">
                <span className="text-white">skills:</span>{" "}
                <span className="text-white/50">[</span>
                <div className="mt-1 flex flex-wrap gap-x-1 gap-y-1 pl-6">
                  {coderData.skills.map((skill, index) => (
                    <span key={skill}>
                      <span className="text-white/50">{`'`}</span>
                      <span className="text-cyan-400">{skill}</span>
                      <span className="text-white/50">{`'`}</span>
                      {index < coderData.skills.length - 1 ? (
                        <span className="text-white/50">, </span>
                      ) : null}
                    </span>
                  ))}
                </div>
                <span className="text-white/50">],</span>
              </div>
              <div>
                <span className="text-white/50">{`};`}</span>
              </div>
            </code>
          </pre>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 font-mono text-xs text-white/35 sm:px-6 lg:px-8">
        <span>UTF-8</span>
        <span>JavaScript</span>
        <span>Ln 12, Col 2</span>
      </div>
    </section>
  );
}
