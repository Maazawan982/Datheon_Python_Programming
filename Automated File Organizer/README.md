# Automated File Organizer & Cleanup Utility

An autonomous desktop automation utility that organizes cluttered directories (such as Downloads, Desktop, or custom folder paths).

---

## 📋 Task 3 Overview & Requirements

- **Module:** Python 3 standard libraries (`os`, `shutil`, `pathlib`)
- **Inspection:** Scans directories using `os.scandir()` and inspects file extensions
- **Categorization:** Dynamically maps file types into structured category subfolders:
  - `/Documents` (`.pdf`, `.docx`, `.txt`, `.xlsx`, `.pptx`, `.csv`, `.md`, etc.)
  - `/Images` (`.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`, etc.)
  - `/Videos` (`.mp4`, `.mkv`, `.mov`, `.avi`, `.webm`, etc.)
  - `/Archives` (`.zip`, `.tar`, `.gz`, `.7z`, `.rar`, etc.)
  - `/Code` (`.py`, `.js`, `.ts`, `.html`, `.css`, `.json`, `.sql`, etc.)
  - `/Audio` (`.mp3`, `.wav`, `.flac`, `.aac`, etc.)
  - `/Installers` (`.exe`, `.dmg`, `.deb`, `.pkg`, `.msi`, etc.)
  - `/Others` (unrecognized file types)
- **Safe Relocation:** Uses `shutil.move()` to relocate files
- **Error Handling:** Try-except blocks catching `PermissionError`, `FileExistsError`, and `OSError`
- **Collision Protection:** Automatically resolves file name collisions (e.g. `report.pdf` -> `report (1).pdf`) to prevent accidental data loss
- **Dry-Run Mode:** Safe preview mode to inspect moves before live execution
- **Execution Summary:** Formatted logging output detailing total files scanned, relocated, categories breakdown, and errors encountered

---

## 🚀 How to Run

### Run Organizer CLI:
```bash
python3 "Automated File Organizer/organizer.py"
```

Or pass a specific folder path directly:
```bash
python3 "Automated File Organizer/organizer.py" /path/to/my/folder
```

### Run Unit Tests:
```bash
python3 -m unittest "Automated File Organizer/test_organizer.py"
```
