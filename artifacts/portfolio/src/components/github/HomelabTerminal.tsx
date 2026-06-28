import { useEffect, useMemo, useRef, useState } from "react";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "neofetch" };

const PROXMOX_LOGO = [
  "         .://:`              `://:.",
  "       `hMMMMMMd/          /dMMMMMMh`",
  "        `sMMMMMMMd:      :mMMMMMMMs`",
  "`-/+oo+/:`.yMMMMMMMh-  -hMMMMMMMy.`:/+oo+/-`",
  "`:oooooooo/`-hMMMMMMMyyMMMMMMMh-`/oooooooo:`",
  "  `/oooooooo:`:mMMMMMMMMMMMMm:`:oooooooo/`",
  "    ./ooooooo+- +NMMMMMMMMN+ -+ooooooo/.",
  "      .+ooooooo+-`oNMMMMNo`-+ooooooo+.",
  "        -+ooooooo/.`sMMs`./ooooooo+-",
  "          :oooooooo/`..`/oooooooo:",
  "          :oooooooo/`..`/oooooooo:",
  "        -+ooooooo/.`sMMs`./ooooooo+-",
  "      .+ooooooo+-`oNMMMMNo`-+ooooooo+.",
  "    ./ooooooo+- +NMMMMMMMMN+ -+ooooooo/.",
  "  `/oooooooo:`:mMMMMMMMMMMMMm:`:oooooooo/`",
  "`:oooooooo/`-hMMMMMMMyyMMMMMMMh-`/oooooooo:`",
  "`-/+oo+/:`.yMMMMMMMh-  -hMMMMMMMy.`:/+oo+/-`",
  "        `sMMMMMMMm:      :dMMMMMMMs`",
  "       `hMMMMMMd/          /dMMMMMMh`",
  "         `://:`              `://:`",
].join("\n");

// The diamond ring (M/N/h/d/s/m/y glyphs) is white; the dotted decorations are
// Proxmox orange — matching the real `neofetch` output.
const LOGO_WHITE = new Set(["M", "N", "h", "d", "s", "m", "y"]);
const LOGO_RUNS: { c: string; white: boolean }[] = (() => {
  const runs: { c: string; white: boolean }[] = [];
  for (const ch of PROXMOX_LOGO) {
    const white = LOGO_WHITE.has(ch);
    const last = runs[runs.length - 1];
    if (last && last.white === white) last.c += ch;
    else runs.push({ c: ch, white });
  }
  return runs;
})();

const NEOFETCH_INFO: [string, string][] = [
  ["OS", "Proxmox VE 8.4.19 x86_64"],
  ["Kernel", "6.8.12-30-pve"],
  ["Uptime", "1 day, 15 hours, 4 mins"],
  ["Packages", "805 (dpkg)"],
  ["Shell", "bash 5.2.15"],
  ["Terminal", "/dev/pts/1"],
  ["CPU", "Intel Xeon E5-1650 v4 (12) @ 4.000GHz"],
  ["Memory", "13804MiB / 32002MiB"],
];

const COMMANDS: Record<string, (cmd: string) => string> = {
  lscpu: () =>
    [
      "Architecture:             x86_64",
      "  CPU op-mode(s):         32-bit, 64-bit",
      "  Address sizes:          46 bits physical, 48 bits virtual",
      "  Byte Order:             Little Endian",
      "CPU(s):                   12",
      "  On-line CPU(s) list:    0-11",
      "Vendor ID:                GenuineIntel",
      "  Model name:             Intel(R) Xeon(R) CPU E5-1650 v4 @ 3.60GHz",
      "    CPU family:           6",
      "    Model:                79",
      "    Thread(s) per core:   2",
      "    Core(s) per socket:   6",
      "    Socket(s):            1",
      "    CPU max MHz:          4000.0000",
      "    CPU min MHz:          1200.0000",
      "Caches (sum of all):",
      "  L1d: 192 KiB   L1i: 192 KiB   L2: 1.5 MiB   L3: 15 MiB",
      "Virtualization:           VT-x",
    ].join("\n"),
  ls: () => "k8s-backup.sh  pve-notes.md  iso/  dump/  snippets/  templates/",
  pwd: () => "/root",
  whoami: () => "root",
  uname: (cmd) =>
    /\s-a\b/.test(cmd)
      ? "Linux homelab 6.8.12-30-pve #1 SMP PREEMPT_DYNAMIC PVE 6.8.12-30 x86_64 GNU/Linux"
      : "Linux",
  uptime: () =>
    " 13:26:16 up 1 day, 15:04,  1 user,  load average: 0.16, 0.21, 0.19",
  free: () =>
    [
      "               total        used        free      shared  buff/cache   available",
      "Mem:            31Gi        13Gi       8.1Gi       248Mi        10Gi        17Gi",
      "Swap:          8.0Gi          0B       8.0Gi",
    ].join("\n"),
  df: () =>
    [
      "Filesystem            Size  Used Avail Use% Mounted on",
      "udev                   16G     0   16G   0% /dev",
      "/dev/mapper/pve-root  1.8T  142G  1.6T   8% /",
      "/dev/sda2             511M  328K  511M   1% /boot/efi",
      "/dev/mapper/pve-data  3.5T  1.1T  2.4T  32% /mnt/data",
    ].join("\n"),
  date: () => new Date().toString(),
  help: () =>
    [
      "Available commands:",
      "  neofetch   system info banner (Proxmox)",
      "  lscpu      CPU architecture info",
      "  ls         list directory contents",
      "  pwd        print working directory",
      "  whoami     current user",
      "  uname      kernel info (try: uname -a)",
      "  uptime     how long the host has been running",
      "  free       memory usage",
      "  df         disk usage",
      "  date       current date & time",
      "  clear      clear the screen",
    ].join("\n"),
};

const ANSI_COLORS = ["#e06c75", "#98c379", "#d19a66", "#61afef", "#c678dd", "#56b6c2", "#abb2bf", "#ffffff"];

function Prompt() {
  return (
    <span className="select-none">
      <span className="text-[#3fb950] font-semibold">root@homelab</span>
      <span className="text-[#7d8590]">:</span>
      <span className="text-[#2f81f7]">~</span>
      <span className="text-[#7d8590]">#</span>
    </span>
  );
}

function Neofetch() {
  return (
    <div className="flex flex-col md:flex-row md:gap-6 gap-1 my-1">
      <pre className="leading-[1.05] text-[9px] sm:text-[10px] md:text-[11px]">
        {LOGO_RUNS.map((r, i) => (
          <span key={i} className={r.white ? "text-[#f0f6fc]" : "text-[#e57000]"}>
            {r.c}
          </span>
        ))}
      </pre>
      <div className="text-[12px] md:text-[13px]">
        <div>
          <span className="text-[#e57000] font-bold">root</span>
          <span className="text-[#c9d1d9]">@</span>
          <span className="text-[#e57000] font-bold">homelab</span>
        </div>
        <div className="text-[#7d8590]">------------</div>
        {NEOFETCH_INFO.map(([k, v]) => (
          <div key={k}>
            <span className="text-[#39c5cf] font-bold">{k}</span>
            <span className="text-[#c9d1d9]">: {v}</span>
          </div>
        ))}
        <div className="flex gap-1 mt-2">
          {ANSI_COLORS.map((c) => (
            <span key={c} className="w-5 h-2.5 rounded-[1px]" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomelabTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [bootText, setBootText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const histPos = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loginLine = useMemo(() => {
    const d = new Date();
    const [wd, mon, day, year] = d.toDateString().split(" ");
    const time = d.toTimeString().slice(0, 8);
    return `Last login: ${wd} ${mon} ${day} ${time} ${year} on tty1`;
  }, []);

  // Auto-type `neofetch` on entry, then print the Proxmox banner.
  useEffect(() => {
    const cmd = "neofetch";
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      i++;
      setBootText(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(interval);
        timeout = setTimeout(() => {
          setLines([{ kind: "cmd", text: cmd }, { kind: "neofetch" }]);
          setBooted(true);
          setBootText("");
        }, 400);
      }
    }, 95);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, booted, bootText]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  function run() {
    const raw = input;
    const cmd = raw.trim();
    const name = cmd.split(/\s+/)[0];

    if (cmd !== "") setHistory((h) => [...h, cmd]);
    histPos.current = -1;

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    const next: Line[] = [...lines, { kind: "cmd", text: raw }];
    if (cmd === "") {
      // just a fresh prompt
    } else if (name === "neofetch") {
      next.push({ kind: "neofetch" });
    } else if (COMMANDS[name]) {
      next.push({ kind: "out", text: COMMANDS[name](cmd) });
    } else {
      next.push({ kind: "out", text: `bash: ${name}: command not found — da-da-da, schas...` });
    }
    setLines(next);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      histPos.current = histPos.current < 0 ? history.length - 1 : Math.max(0, histPos.current - 1);
      setInput(history[histPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPos.current < 0) return;
      histPos.current += 1;
      if (histPos.current >= history.length) {
        histPos.current = -1;
        setInput("");
      } else {
        setInput(history[histPos.current]);
      }
    }
  }

  return (
    <div className="mt-6 rounded-[6px] overflow-hidden border border-[#d0d7de] dark:border-[#30363d] shadow-sm">
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <span className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </span>
        <span className="text-xs text-[#7d8590] font-mono mx-auto select-none">root@homelab: ~</span>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="bg-[#0d1117] text-[#c9d1d9] font-mono text-xs md:text-[13px] leading-relaxed p-4 h-[440px] overflow-auto cursor-text"
      >
        <div className="text-[#7d8590] select-none">{loginLine}</div>

        {lines.map((line, idx) => {
          if (line.kind === "cmd") {
            return (
              <div key={idx} className="whitespace-pre-wrap break-all">
                <Prompt /> <span className="text-[#c9d1d9]">{line.text}</span>
              </div>
            );
          }
          if (line.kind === "neofetch") return <Neofetch key={idx} />;
          return (
            <pre key={idx} className="whitespace-pre-wrap break-words text-[#c9d1d9] my-0.5">
              {line.text}
            </pre>
          );
        })}

        {booted ? (
          <div className="flex items-center">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal input"
              className="flex-1 ml-1.5 bg-transparent border-0 outline-none text-[#c9d1d9] font-mono caret-[#3fb950]"
            />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            <Prompt /> <span className="text-[#c9d1d9]">{bootText}</span>
            <span className="inline-block w-2 h-4 -mb-0.5 ml-0.5 bg-[#c9d1d9] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
