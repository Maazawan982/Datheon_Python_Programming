import React, { useState } from 'react';
import { INITIAL_MESSY_FILES, SimulatedFile, CATEGORY_COLORS } from '../organizerData';
import organizerPyRaw from '../../Automated File Organizer/organizer.py?raw';
import {
  FolderArchive,
  FolderOpen,
  FolderTree,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCode,
  Image as ImageIcon,
  Video,
  Music,
  Terminal,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  FileArchive
} from 'lucide-react';

interface Task3OrganizerProps {
  onOpenDocs?: () => void;
}

export const Task3Organizer: React.FC<Task3OrganizerProps> = ({ onOpenDocs }) => {
  const [files, setFiles] = useState<SimulatedFile[]>(INITIAL_MESSY_FILES);
  const [isOrganized, setIsOrganized] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'simulator' | 'code' | 'summary'>('simulator');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  // Group files by category
  const categories = Array.from(new Set(INITIAL_MESSY_FILES.map((f) => f.category)));

  const handleRunOrganizer = (dryRunMode: boolean = isDryRun) => {
    setIsRunning(true);
    setLogs([]);

    const newLogs: string[] = [];
    newLogs.push(`[INFO] Starting Automated File Organizer (Mode: ${dryRunMode ? 'DRY-RUN PREVIEW' : 'LIVE RELOCATION'})...`);
    newLogs.push(`[INFO] Scanning directory: ~/Downloads using os.scandir()...`);

    // Process files with collision check
    const categoryFoldersCreated = new Set<string>();
    const seenNamesInDest: Record<string, number> = {};

    const updatedFiles: SimulatedFile[] = files.map((file) => {
      const cat = file.category;

      if (!categoryFoldersCreated.has(cat)) {
        categoryFoldersCreated.add(cat);
        newLogs.push(`[INFO] Checked category directory: /${cat}`);
      }

      // Check collision
      const targetKey = `${cat}/${file.name}`;
      let finalName = file.name;
      let wasCollision = false;

      if (seenNamesInDest[targetKey]) {
        seenNamesInDest[targetKey] += 1;
        const count = seenNamesInDest[targetKey] - 1;
        const ext = file.extension;
        const baseName = file.name.slice(0, file.name.lastIndexOf(ext));
        finalName = `${baseName} (${count})${ext}`;
        wasCollision = true;
        newLogs.push(
          `[WARN] Naming collision detected on '${file.name}'. Safely resolved via resolve_collision() -> '${finalName}'`
        );
      } else {
        seenNamesInDest[targetKey] = 1;
      }

      if (dryRunMode) {
        newLogs.push(`[DRY-RUN] Would move: '${file.name}' -> /${cat}/${finalName}`);
      } else {
        newLogs.push(`[INFO] shutil.move: '${file.name}' -> /${cat}/${finalName}`);
      }

      return {
        ...file,
        status: dryRunMode ? 'pending' : 'moved',
        renamedTo: wasCollision ? finalName : undefined,
      };
    });

    newLogs.push(`[SUCCESS] Completed organization. Relocated: ${updatedFiles.length} files into ${categoryFoldersCreated.size} categories.`);
    newLogs.push(`[SUMMARY] 0 errors encountered (FileExistsError & PermissionError caught safely).`);

    setTimeout(() => {
      setLogs(newLogs);
      if (!dryRunMode) {
        setFiles(updatedFiles);
        setIsOrganized(true);
      }
      setIsRunning(false);
    }, 400);
  };

  const handleReset = () => {
    setFiles(INITIAL_MESSY_FILES);
    setIsOrganized(false);
    setLogs([]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organizerPyRaw);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filtered files for display
  const displayedFiles = filterCategory === 'all'
    ? files
    : files.filter((f) => f.category === filterCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Documents':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'Images':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'Videos':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'Archives':
        return <FileArchive className="w-4 h-4 text-amber-400" />;
      case 'Code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'Audio':
        return <Music className="w-4 h-4 text-pink-400" />;
      default:
        return <FolderOpen className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Task 3 Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/80">
              Task 3
            </span>
            <span>Desktop Automation Utility</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Automated File Organizer & Cleanup Utility
          </h2>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Autonomous directory reorganization utility using Python standard libraries (<code>os.scandir()</code>, <code>shutil.move()</code>, <code>pathlib</code>). Automatically sorts cluttered files into category subfolders with collision detection and permission error recovery.
          </p>
        </div>

        {/* Action button to open Docs */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold shadow-sm transition-all hover:border-blue-500/50"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>View Python File Handling Docs</span>
            </button>
          )}

          <button
            onClick={() => handleRunOrganizer(false)}
            disabled={isRunning || isOrganized}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 ${
              isOrganized
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Organizing Files...' : isOrganized ? 'Already Organized' : 'Run Organizer Now'}</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('simulator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeView === 'simulator'
                ? 'bg-zinc-800 text-blue-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Directory Simulator</span>
          </button>

          <button
            onClick={() => setActiveView('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeView === 'code'
                ? 'bg-zinc-800 text-blue-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>organizer.py Source</span>
          </button>

          <button
            onClick={() => setActiveView('summary')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeView === 'summary'
                ? 'bg-zinc-800 text-blue-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Execution Summary & Logs</span>
          </button>
        </div>

        {activeView === 'simulator' && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDryRun}
                onChange={(e) => setIsDryRun(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span>Dry-Run Mode</span>
            </label>

            {isOrganized && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-850 px-2.5 py-1 rounded-md border border-zinc-700 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cluttered State</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main View: Directory Simulator */}
      {activeView === 'simulator' && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-400 font-mono">Directory Path</div>
              <div className="text-sm font-bold text-white font-mono mt-1">~/Downloads</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">30 loose files</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-400 font-mono">Status</div>
              <div className="flex items-center gap-1.5 text-sm font-bold mt-1">
                {isOrganized ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Organized
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Cluttered (Root)
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {isOrganized ? 'Categorized by extension' : 'Unsorted files in root'}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-400 font-mono">Category Folders</div>
              <div className="text-sm font-bold text-blue-400 font-mono mt-1">
                {categories.length} Categories
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Docs, Images, Videos, etc.</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-400 font-mono">Collision Safety</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-1">Auto-Rename</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Zero accidental overwrites</div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              All Files ({files.length})
            </button>
            {categories.map((cat) => {
              const count = files.filter((f) => f.category === cat).length;
              const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Others;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                    filterCategory === cat
                      ? `${color.bg} ${color.text} border ${color.border}`
                      : 'text-zinc-400 hover:text-white bg-zinc-900'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span>/{cat}</span>
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Filesystem Grid Display */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-zinc-950/90 px-5 py-3 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>
                  Path: ~/Downloads/
                  {isOrganized && filterCategory !== 'all' ? `${filterCategory}/` : ''}
                </span>
              </div>
              <span>{displayedFiles.length} item(s)</span>
            </div>

            <div className="divide-y divide-zinc-800/60 max-h-[480px] overflow-y-auto">
              {displayedFiles.map((file) => {
                const color = CATEGORY_COLORS[file.category] || CATEGORY_COLORS.Others;
                return (
                  <div
                    key={file.id}
                    className="p-3.5 hover:bg-zinc-850/50 flex items-center justify-between gap-4 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg border ${color.bg} ${color.border}`}>
                        {getCategoryIcon(file.category)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">
                            {file.renamedTo ? file.renamedTo : file.name}
                          </span>
                          {file.renamedTo && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800/60">
                              Collision Resolved
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>Extension: {file.extension}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isOrganized ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-500">Relocated to</span>
                          <span className={`px-2 py-1 rounded border text-[11px] font-semibold ${color.bg} ${color.text} ${color.border}`}>
                            /{file.category}/
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[11px] border border-zinc-700/50">
                          Root Folder
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* View: Source Code */}
      {activeView === 'code' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
          <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span className="font-bold">Automated File Organizer/organizer.py</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs font-mono text-zinc-200 border border-zinc-700 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-5 font-mono text-xs text-zinc-300 bg-zinc-950 overflow-x-auto max-h-[560px] overflow-y-auto leading-relaxed select-text">
            {organizerPyRaw}
          </pre>
        </div>
      )}

      {/* View: Execution Summary & Terminal Logs */}
      {activeView === 'summary' && (
        <div className="space-y-6">
          {/* Formatted Execution Summary Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 font-mono text-xs">
            <div className="text-zinc-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Execution Summary Report</span>
            </div>

            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-2 text-zinc-300">
              <div className="border-b border-zinc-800 pb-2 text-emerald-400 font-bold">
                ============================================================
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AUTOMATED FILE ORGANIZER - EXECUTION SUMMARY
                <br />
                ============================================================
              </div>
              <div>Target Directory  : /home/user/Downloads</div>
              <div>Mode              : {isDryRun ? 'DRY RUN (Preview Only)' : 'LIVE EXECUTION'}</div>
              <div>Total Entries     : {files.length}</div>
              <div>Total Relocated   : {isOrganized ? files.length : 0}</div>
              <div className="border-t border-zinc-800 pt-2 text-zinc-400">Relocations by Category:</div>
              {categories.map((cat) => {
                const count = files.filter((f) => f.category === cat).length;
                return (
                  <div key={cat} className="text-zinc-300 pl-4">
                    /{cat.padEnd(14, ' ')} : {isOrganized ? count : 0} file(s)
                  </div>
                );
              })}
              <div className="border-t border-zinc-800 pt-2 text-emerald-400">
                Status            : COMPLETED SUCCESSFULLY (0 errors, 1 collision resolved)
              </div>
            </div>
          </div>

          {/* Live Terminal Log Stream */}
          <div className="bg-black border border-zinc-800 rounded-2xl p-5 font-mono text-xs space-y-1 max-h-72 overflow-y-auto shadow-inner">
            <div className="text-zinc-500 pb-1 border-b border-zinc-900">Console Log Output:</div>
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic py-2">
                Click &quot;Run Organizer Now&quot; to inspect real-time os.scandir() and shutil.move() activity.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={
                    log.includes('[ERROR]')
                      ? 'text-rose-400'
                      : log.includes('[WARN]')
                      ? 'text-amber-300'
                      : log.includes('[SUCCESS]')
                      ? 'text-emerald-400 font-bold'
                      : 'text-zinc-400'
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
