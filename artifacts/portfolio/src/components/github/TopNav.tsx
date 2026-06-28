import { BookOpen, Book, LayoutPanelLeft, Box, Star, Rocket, Sun, Moon } from "lucide-react";
import { Link } from "wouter";

export function TopNav({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const tab =
    "flex items-center gap-2 px-2 py-2 border-b-2 border-transparent text-[#1f2328] dark:text-[#e6edf3] hover:bg-[#f6f8fa] dark:hover:bg-[#161b22] rounded-t-md text-sm transition-colors";
  const icon = "w-4 h-4 text-[#59636e] dark:text-[#7d8590]";

  return (
    <div className="sticky top-0 z-40 bg-[#f6f8fa] dark:bg-[#0d1117] border-b border-[#d0d7de] dark:border-[#30363d] pt-4 px-4 md:px-6 lg:px-8 flex justify-center overflow-x-auto">
      <div className="flex max-w-[1280px] w-full md:pl-[320px]">
        <nav className="flex gap-2 w-full items-center">
          <a
            href="#"
            className="flex items-center gap-2 px-2 py-2 border-b-2 border-[#fd8c73] dark:border-[#f78166] text-[#1f2328] dark:text-[#e6edf3] text-sm font-medium"
          >
            <BookOpen className={icon} />
            Overview
          </a>
          <a href="#" className={tab}>
            <Book className={icon} />
            Repositories
            <span className="bg-[#eaeef2] dark:bg-[#161b22] text-[#1f2328] dark:text-[#e6edf3] text-xs px-2 py-0.5 rounded-full inline-block border border-[#d0d7de] dark:border-[#30363d]">
              6
            </span>
          </a>
          <a href="#" className={`${tab} hidden sm:flex`}>
            <LayoutPanelLeft className={icon} />
            Projects
          </a>
          <a href="#" className={`${tab} hidden md:flex`}>
            <Box className={icon} />
            Packages
          </a>
          <a href="#" className={`${tab} hidden md:flex`}>
            <Star className={icon} />
            Stars
          </a>
          <div className="flex-1" />
          <button
            onClick={onToggleTheme}
            aria-label="Toggle light/dark theme"
            title={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex items-center justify-center w-9 h-9 mb-1 rounded-full border border-[#d0d7de] dark:border-[#30363d] text-[#59636e] dark:text-[#7d8590] hover:bg-[#eef1f4] dark:hover:bg-[#161b22] hover:text-[#1f2328] dark:hover:text-[#e6edf3] transition-colors shrink-0"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/mission-control" className={`${tab} shrink-0`}>
            <Rocket className={icon} />
            <span className="hidden sm:inline">Mission Control</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
