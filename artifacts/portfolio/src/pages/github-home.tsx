import { useState, useEffect } from "react";
import { ProfileSidebar } from "@/components/github/ProfileSidebar";
import { TopNav } from "@/components/github/TopNav";
import { ReadmeIntro } from "@/components/github/ReadmeIntro";
import { PinnedRepos } from "@/components/github/PinnedRepos";
import { HomelabMonitoring } from "@/components/github/HomelabMonitoring";

function getInitialDark(): boolean {
  try {
    const t = localStorage.getItem("gh-theme");
    if (t === "light") return false;
    if (t === "dark") return true;
  } catch {
    /* ignore */
  }
  return true; // default to dark to preserve the original look
}

export default function GithubHome() {
  const [dark, setDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("gh-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-[#1f2328] dark:text-[#e6edf3] font-sans selection:bg-[#0969da]/20 dark:selection:bg-[#2f81f7]/30 pb-20">
      <TopNav dark={dark} onToggleTheme={() => setDark((d) => !d)} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-[296px] shrink-0">
            <ProfileSidebar />
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <ReadmeIntro />
            <PinnedRepos />
            <HomelabMonitoring />
          </div>
        </div>
      </div>
    </div>
  );
}
