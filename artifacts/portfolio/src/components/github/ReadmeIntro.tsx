import { SiKubernetes, SiArgo, SiPrometheus, SiGrafana, SiDocker, SiLinux, SiReact, SiTypescript, SiNodedotjs, SiExpress, SiTailwindcss, SiPython, SiGit, SiVite } from "react-icons/si";

export function ReadmeIntro() {
  return (
    <div className="border border-[#30363d] rounded-md bg-[#0d1117] mb-6 overflow-hidden">
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20%, 60% { transform: rotate(-25deg); }
          40%, 80% { transform: rotate(10deg); }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
        }
      `}</style>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#30363d] bg-[#0d1117] text-[#e6edf3] text-sm font-medium">
        <span>ArturSkrin</span>
        <span className="text-[#7d8590]">/</span>
        <span>README.md</span>
      </div>
      <div className="p-6 md:p-8 space-y-6 bg-[#0d1117]">
        <h2 className="text-2xl font-semibold text-[#e6edf3] border-b border-[#30363d] pb-2 flex items-center gap-2">
          Hi there! <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h2>
        <p className="text-[#e6edf3] leading-relaxed">
          I'm a System Administrator. Currently diving deep into system administration and DevOps. Always learning and experimenting with new technologies to improve workflow, infrastructure reliability, and automation.
        </p>

        <h3 className="text-xl font-semibold text-[#e6edf3] border-b border-[#30363d] pb-2 mt-8 flex items-center gap-2">
          Tech Stack 🔧
        </h3>
        <div className="flex flex-wrap gap-4 text-[#7d8590]">
          <SiKubernetes className="w-8 h-8 hover:text-[#326ce5] transition-colors" title="Kubernetes" />
          <SiArgo className="w-8 h-8 hover:text-[#ef7b4d] transition-colors" title="ArgoCD" />
          <SiPrometheus className="w-8 h-8 hover:text-[#e6522c] transition-colors" title="Prometheus" />
          <SiGrafana className="w-8 h-8 hover:text-[#f46800] transition-colors" title="Grafana" />
          <SiDocker className="w-8 h-8 hover:text-[#2496ed] transition-colors" title="Docker" />
          <SiLinux className="w-8 h-8 hover:text-[#fcc624] transition-colors" title="Linux" />
          <SiPython className="w-8 h-8 hover:text-[#3776ab] transition-colors" title="Python" />
          <SiTypescript className="w-8 h-8 hover:text-[#3178c6] transition-colors" title="TypeScript" />
          <SiReact className="w-8 h-8 hover:text-[#61dafb] transition-colors" title="React" />
          <SiNodedotjs className="w-8 h-8 hover:text-[#339933] transition-colors" title="Node.js" />
          <SiExpress className="w-8 h-8 hover:text-[#000000] dark:hover:text-[#ffffff] transition-colors" title="Express" />
          <SiTailwindcss className="w-8 h-8 hover:text-[#06b6d4] transition-colors" title="Tailwind CSS" />
          <SiGit className="w-8 h-8 hover:text-[#f05032] transition-colors" title="Git" />
          <SiVite className="w-8 h-8 hover:text-[#646cff] transition-colors" title="Vite" />
        </div>
      </div>
    </div>
  );
}
