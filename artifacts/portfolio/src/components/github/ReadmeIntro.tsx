import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import profileGif from "@/assets/profile.gif";
import {
  SiDocker,
  SiMysql,
  SiPostgresql,
  SiPython,
  SiLinux,
  SiGit,
  SiGnubash,
  SiAnsible,
  SiGrafana,
  SiKubernetes,
  SiArgo,
  SiHelm,
  SiPrometheus,
  SiNginx,
  SiCloudflare,
  SiGithubactions,
} from "react-icons/si";

type Tech = { Icon: IconType; name: string; color: string; dark?: string };

const tech: Tech[] = [
  { Icon: SiDocker, name: "Docker", color: "#2496ed" },
  { Icon: SiMysql, name: "MySQL", color: "#4479a1", dark: "#5b9bd5" },
  { Icon: SiPostgresql, name: "PostgreSQL", color: "#4169e1", dark: "#6f8ff0" },
  { Icon: SiPython, name: "Python", color: "#3776ab", dark: "#5a9fd4" },
  { Icon: SiLinux, name: "Linux", color: "#e9b800" },
  { Icon: SiGit, name: "Git", color: "#f05032" },
  { Icon: SiGnubash, name: "Bash", color: "#4eaa25" },
  { Icon: SiAnsible, name: "Ansible", color: "#ee0000", dark: "#ff4d4d" },
  { Icon: SiKubernetes, name: "Kubernetes", color: "#326ce5", dark: "#5b8def" },
  { Icon: SiHelm, name: "Helm", color: "#0f1689", dark: "#6b7fe8" },
  { Icon: SiArgo, name: "ArgoCD", color: "#ef7b4d" },
  { Icon: SiGithubactions, name: "GitHub Actions", color: "#2088ff" },
  { Icon: SiPrometheus, name: "Prometheus", color: "#e6522c" },
  { Icon: SiGrafana, name: "Grafana", color: "#f46800" },
  { Icon: SiNginx, name: "NGINX", color: "#009639", dark: "#2bbd63" },
  { Icon: SiCloudflare, name: "Cloudflare", color: "#f38020" },
];

export function ReadmeIntro() {
  return (
    <div className="border border-[#d0d7de] dark:border-[#30363d] rounded-[6px] bg-white dark:bg-[#0d1117] mb-6 overflow-hidden">
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20%, 60% { transform: rotate(-25deg); }
          40%, 80% { transform: rotate(10deg); }
        }
        .animate-wave { animation: wave 2.5s infinite; }
      `}</style>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] text-[#1f2328] dark:text-[#e6edf3] text-sm">
        <span className="font-semibold">ArturSkrin</span>
        <span className="text-[#59636e] dark:text-[#7d8590]">/</span>
        <span>README.md</span>
      </div>

      <div className="p-6 md:p-8 bg-white dark:bg-[#0d1117]">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start">
          {/* Animated GIF */}
          <div className="w-2/3 sm:w-1/3 shrink-0">
            <img
              src={profileGif}
              alt=""
              className="w-full rounded-[6px] border border-[#d0d7de] dark:border-[#30363d]"
            />
          </div>

          {/* Greeting + bio */}
          <div className="flex-1 min-w-0 space-y-4">
            <h2 className="text-2xl font-semibold text-[#1f2328] dark:text-[#e6edf3] flex items-center gap-2">
              Hi there! <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
            </h2>
            <p className="text-sm leading-relaxed text-[#1f2328] dark:text-[#e6edf3]">
              🔧 I'm a <strong>System Administrator</strong>.
            </p>
            <p className="text-sm leading-relaxed text-[#1f2328] dark:text-[#e6edf3]">
              ✍️ Currently diving deep into the fields of <strong>system administration</strong> and{" "}
              <strong>DevOps</strong>.
            </p>
            <p className="text-sm leading-relaxed text-[#1f2328] dark:text-[#e6edf3]">
              🚀 Always learning and experimenting with new technologies to enhance my workflow,
              infrastructure reliability, and automation skills.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[#1f2328] dark:text-[#e6edf3] border-b border-[#d0d7de] dark:border-[#30363d] pb-2 mt-8 mb-5">
          🛠️ Tech Stack
        </h3>
        <div className="flex flex-wrap gap-x-5 gap-y-6 justify-center">
          {tech.map(({ Icon, name, color, dark }) => (
            <div key={name} className="flex flex-col items-center gap-1.5 w-16">
              <Icon
                title={name}
                style={{ "--ic": color, "--icd": dark ?? color } as CSSProperties}
                className="w-10 h-10 transition-transform hover:scale-110 text-[color:var(--ic)] dark:text-[color:var(--icd)]"
              />
              <span className="text-[10px] text-[#59636e] dark:text-[#7d8590] text-center leading-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
