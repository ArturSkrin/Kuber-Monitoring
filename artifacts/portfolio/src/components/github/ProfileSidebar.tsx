import avatarPath from "@/assets/avatar.jpg";
import { Users } from "lucide-react";

export function ProfileSidebar() {
  return (
    <div className="flex flex-col md:-mt-8">
      <div className="w-1/3 md:w-full mb-4 z-10 relative">
        <img
          src={avatarPath}
          alt="Artur Skrin"
          className="rounded-full w-full aspect-square border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="flex flex-col gap-1 mb-4">
          <span className="text-2xl font-bold leading-tight text-[#1f2328] dark:text-[#e6edf3]">Artur Skrin</span>
          <span className="text-xl font-light text-[#59636e] dark:text-[#7d8590]">ArturSkrin</span>
        </h1>
        <a
          href="https://github.com/ArturSkrin"
          target="_blank"
          rel="noreferrer"
          className="mb-4 w-full text-center bg-[#f6f8fa] hover:bg-[#eef1f4] dark:bg-[#21262d] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-[#1f2328] dark:text-[#e6edf3] rounded-md py-1.5 text-sm font-medium transition-colors"
        >
          Follow
        </a>
        <div className="text-sm text-[#1f2328] dark:text-[#e6edf3] mb-4">System Administrator / DevOps.</div>
        <div className="flex items-center gap-1 text-sm text-[#59636e] dark:text-[#7d8590] mb-4">
          <Users className="w-4 h-4 mr-1" />
          <a href="#" className="font-semibold text-[#1f2328] dark:text-[#e6edf3]">2</a> followers
          <span>·</span>
          <a href="#" className="font-semibold text-[#1f2328] dark:text-[#e6edf3]">1</a> following
        </div>
      </div>
    </div>
  );
}
