import { profile } from "../data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-mid/50 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center font-display font-bold text-accent text-xs">
            H
          </div>
          <span className="text-sm text-text-muted">
            &copy; {year} {profile.name}. Built with React & Tailwind.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-text-muted">WebMCP Enabled</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span className="text-xs font-mono text-text-muted">AI-Agent Friendly</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </footer>
  );
}
