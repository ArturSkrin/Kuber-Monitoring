import { BookOpen, Book, LayoutPanelLeft, Box, Star, Rocket } from "lucide-react";
import { Link } from "wouter";

export function TopNav() {
  return (
    <div className="sticky top-0 z-40 bg-[#0d1117] border-b border-[#30363d] pt-4 px-4 md:px-6 lg:px-8 flex justify-center overflow-x-auto">
      <div className="flex max-w-[1280px] w-full gap-8 md:pl-[320px]">
        <nav className="flex gap-2">
          <a href="#" className="flex items-center gap-2 px-2 py-2 border-b-2 border-[#f78166] text-[#e6edf3] text-sm font-medium">
            <BookOpen className="w-4 h-4 text-[#7d8590]" />
            Overview
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#e6edf3] hover:bg-[#161b22] rounded-t-md text-sm transition-colors">
            <Book className="w-4 h-4 text-[#7d8590]" />
            Repositories
            <span className="bg-[#161b22] text-[#e6edf3] text-xs px-2 py-0.5 rounded-full inline-block border border-[#30363d]">6</span>
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#e6edf3] hover:bg-[#161b22] rounded-t-md text-sm transition-colors">
            <LayoutPanelLeft className="w-4 h-4 text-[#7d8590]" />
            Projects
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#e6edf3] hover:bg-[#161b22] rounded-t-md text-sm transition-colors hidden sm:flex">
            <Box className="w-4 h-4 text-[#7d8590]" />
            Packages
          </a>
          <a href="#" className="flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#e6edf3] hover:bg-[#161b22] rounded-t-md text-sm transition-colors hidden sm:flex">
            <Star className="w-4 h-4 text-[#7d8590]" />
            Stars
          </a>
          <div className="flex-1" />
          <Link href="/mission-control" className="flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#e6edf3] hover:bg-[#161b22] rounded-t-md text-sm transition-colors">
            <Rocket className="w-4 h-4 text-[#7d8590]" />
            Mission Control
          </Link>
        </nav>
      </div>
    </div>
  );
}
