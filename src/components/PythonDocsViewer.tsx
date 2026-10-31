import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Code2,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

export const PythonDocsViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showScreenshot, setShowScreenshot] = useState(false);

  const docSections = [
    {
      id: 'shutil-move',
      name: 'shutil.move(src, dst, copy_function=copy2)',
      module: 'shutil',
      summary: 'Recursively move a file or directory (src) to another location (dst) and return the destination.',
      details:
        'If the destination is an existing directory, then src is moved inside that directory. If the destination already exists in that directory, an error is raised unless handled. If the destination is on the current filesystem, os.rename is used. Otherwise, src is copied to dst using copy_function and then removed.',
      example: `import shutil
from pathlib import Path

source = "Downloads/document.pdf"
destination = "Downloads/Documents/document.pdf"

try:
    shutil.move(source, destination)
    print("File moved successfully")
except FileExistsError:
    print("File already exists in destination")
except PermissionError:
    print("Access denied")`,
      tags: ['move', 'shutil', 'relocate', 'rename', 'copy_function']
    },
    {
      id: 'os-scandir',
      name: 'os.scandir(path=".")',
      module: 'os',
      summary: 'Return an iterator of os.DirEntry objects corresponding to the entries in the directory given by path.',
      details:
        'Using os.scandir() instead of os.listdir() can significantly increase the performance of code that also needs file type or file attribute information, because os.DirEntry objects expose this information if the operating system provides it when scanning the directory.',
      example: `import os

with os.scandir("/path/to/folder") as entries:
    for entry in entries:
        if entry.is_file():
            print(f"File: {entry.name}, Size: {entry.stat().st_size} bytes")`,
      tags: ['scandir', 'os', 'directory', 'iterator', 'performance', 'stat']
    },
    {
      id: 'pathlib-path',
      name: 'pathlib.Path(path)',
      module: 'pathlib',
      summary: 'Object-oriented filesystem paths providing convenient properties like .suffix, .stem, and .mkdir().',
      details:
        'Path.suffix yields the file extension including the dot (e.g. ".pdf"). Path.mkdir(parents=True, exist_ok=True) ensures subfolders are created smoothly without throwing if they already exist.',
      example: `from pathlib import Path

p = Path("Downloads/report.pdf")
print("Extension:", p.suffix)  # '.pdf'
print("File name:", p.stem)    # 'report'

# Safely create directory:
(p.parent / "Documents").mkdir(parents=True, exist_ok=True)`,
      tags: ['pathlib', 'Path', 'suffix', 'mkdir', 'stem', 'extension']
    },
    {
      id: 'exceptions',
      name: 'Exception Handling: PermissionError & FileExistsError',
      module: 'builtins',
      summary: 'Handling filesystem exceptions prevents automation crashes during batch operations.',
      details:
        'PermissionError occurs when a process lacks permissions to read, write, or move a file. FileExistsError occurs when creating a directory or moving a file where the destination already exists without collision resolution.',
      example: `try:
    shutil.move(src, dst)
except PermissionError as pe:
    logger.error(f"Permission denied: {pe}")
except FileExistsError as fe:
    logger.error(f"File already exists: {fe}")
except OSError as oe:
    logger.error(f"OS level error: {oe}")`,
      tags: ['error', 'PermissionError', 'FileExistsError', 'OSError', 'exceptions']
    },
    {
      id: 'shutil-copy2',
      name: 'shutil.copy2(src, dst, *, follow_symlinks=True)',
      module: 'shutil',
      summary: 'Identical to copy() except that copy2() also attempts to preserve all file metadata (timestamps, flags).',
      details:
        'copy2() uses copystat() to copy the file metadata. On POSIX systems, this includes file access and modification times, permissions, and extended attributes where supported.',
      example: `import shutil

shutil.copy2("source.txt", "backup/source.txt")`,
      tags: ['copy2', 'metadata', 'timestamps', 'shutil']
    }
  ];

  const filteredSections = docSections.filter((sec) => {
    const q = searchQuery.toLowerCase();
    return (
      sec.name.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Python 3 Standard Library Documentation</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Python File Handling &amp; shutil Documentation
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Reference guide for high-level file operations, directory scanning, and exception recovery.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowScreenshot(!showScreenshot)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-mono text-zinc-200 border border-zinc-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span>{showScreenshot ? 'Hide Doc Screenshot' : 'View Original Screenshot'}</span>
          </button>

          <a
            href="https://docs.python.org/3/library/shutil.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white shadow-md shadow-blue-600/20 transition-colors"
          >
            <span>docs.python.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Screenshot Modal / Viewer if toggled */}
      {showScreenshot && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-mono text-zinc-400">
            <span>Attachment: screencapture-docs-python-org-3-library-shutil-html.png</span>
            <span className="text-blue-400">docs.python.org/3/library/shutil.html</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-zinc-800 max-h-[500px] overflow-y-auto bg-white">
            <img
              src="/assets/aistudio/screencapture-docs-python-org-3-library-shutil-html-2026-10-31-11_56_28_6e863cb0.png"
              alt="Python shutil Documentation Screenshot"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search docs (e.g., shutil.move, os.scandir, PermissionError, collision)..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Documentation Cards */}
      <div className="space-y-4">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800/60">
                  {sec.module}
                </span>
                <h3 className="font-mono font-bold text-base text-white">{sec.name}</h3>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {sec.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm font-medium text-zinc-200">{sec.summary}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{sec.details}</p>

            <div className="mt-3 bg-zinc-950 rounded-xl p-4 border border-zinc-800 font-mono text-xs">
              <div className="text-[11px] text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Usage Pattern in organizer.py:</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto leading-relaxed select-text">
                {sec.example}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
