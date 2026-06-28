export function PinnedRepos() {
  const repos = [
    {
      name: "Kuber-Monitoring",
      desc: "Kubernetes homelab monitoring dashboard (this site).",
      lang: "TypeScript",
      langColor: "#3178c6",
      tags: ["React", "Kubernetes", "Express"],
      url: "https://github.com/ArturSkrin/Kuber-Monitoring",
    },
    {
      name: "urbackup-monitoring",
      desc: "A docker-compose stack for UrBackup + Grafana + Prometheus monitoring.",
      lang: "Python",
      langColor: "#3572A5",
      tags: ["Docker", "Grafana", "Prometheus"],
      url: "https://github.com/ArturSkrin/urbackup-monitoring",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base text-[#1f2328] dark:text-[#e6edf3] font-normal">Pinned</h2>
        <a
          href="https://github.com/ArturSkrin?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#59636e] dark:text-[#7d8590] hover:text-[#0969da] dark:hover:text-[#2f81f7]"
        >
          Customize your pins
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.name}
            className="flex flex-col border border-[#d0d7de] dark:border-[#30363d] rounded-[6px] p-4 bg-white dark:bg-[#0d1117] hover:border-[#afb8c1] dark:hover:border-[#8b949e] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#59636e] dark:text-[#7d8590] fill-current"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
              </svg>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#0969da] dark:text-[#2f81f7] font-semibold hover:underline text-sm break-all"
              >
                {repo.name}
              </a>
              <span className="ml-auto border border-[#d0d7de] dark:border-[#30363d] text-[#59636e] dark:text-[#7d8590] text-xs px-2 py-0.5 rounded-full">
                Public
              </span>
            </div>
            <p className="text-xs text-[#59636e] dark:text-[#7d8590] mb-4 flex-1">{repo.desc}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#59636e] dark:text-[#7d8590] mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.langColor }}></span>
                <span>{repo.lang}</span>
              </div>
              {repo.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="self-start text-xs font-medium border border-[#d0d7de] dark:border-[#30363d] rounded-md px-3 py-1.5 text-[#1f2328] dark:text-[#e6edf3] hover:bg-[#f6f8fa] dark:hover:bg-[#161b22] transition-colors"
            >
              Open Repository
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
