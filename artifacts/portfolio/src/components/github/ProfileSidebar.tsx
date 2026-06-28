import avatarPath from "@/assets/avatar.jpg";
import { Users } from "lucide-react";

export function ProfileSidebar() {
  return (
    <div className="flex flex-col md:-mt-8">
      <div className="w-1/3 md:w-full mb-4 z-10 relative">
        <img 
          src={avatarPath} 
          alt="Artur Skrin" 
          className="rounded-full w-full aspect-square border border-[#30363d] shadow-[0_0_0_1px_rgba(255,255,255,0.1)] bg-[#0d1117] object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="flex flex-col gap-1 mb-4">
          <span className="text-2xl font-bold leading-tight text-[#e6edf3]">Artur Skrin</span>
          <span className="text-xl font-light text-[#7d8590]">ArturSkrin</span>
        </h1>
        <div className="mb-4">
          <button className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#e6edf3] rounded-md py-1.5 text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
        <div className="text-sm text-[#e6edf3] mb-4">
          System Administrator / DevOps.
        </div>
        <div className="flex items-center gap-1 text-sm text-[#7d8590] mb-4 hover:[&_a]:text-[#2f81f7] [&_a]:transition-colors">
          <Users className="w-4 h-4 mr-1" />
          <a href="#" className="font-semibold text-[#e6edf3]">2</a> followers
          <span>·</span>
          <a href="#" className="font-semibold text-[#e6edf3]">1</a> following
        </div>
      </div>
    </div>
  );
}
