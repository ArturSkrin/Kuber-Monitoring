import { ProfileSidebar } from "@/components/github/ProfileSidebar";
import { TopNav } from "@/components/github/TopNav";
import { ReadmeIntro } from "@/components/github/ReadmeIntro";
import { PinnedRepos } from "@/components/github/PinnedRepos";
import { HomelabMonitoring } from "@/components/github/HomelabMonitoring";

export default function GithubHome() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-[#2f81f7]/30 pb-20">
      <TopNav />
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
