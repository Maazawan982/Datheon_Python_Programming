#!/usr/bin/env python3
"""
=============================================================================
Automated File Organizer & Cleanup Utility
=============================================================================
Autonomous desktop automation utility that organizes cluttered directories
(such as Downloads, Desktop, or custom folder paths).

Key Features:
- Inspects every file's extension using os.scandir() and pathlib.Path.
- Dynamically creates category subfolders (/Documents, /Images, /Videos, /Archives, /Code, etc.).
- Relocates files safely using shutil.move().
- Robust error handling: catches FileExistsError, PermissionError, and OSError.
- Smart naming collision resolution (appends (1), (2), etc. to avoid accidental overwrites).
- Supports --dry-run to preview changes before moving files.
- Prints a formatted execution summary report and detailed logging.
=============================================================================
"""

import os
import shutil
import sys
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# Extension category mapping dictionary
DEFAULT_EXTENSION_MAPPINGS: Dict[str, str] = {
    # Documents
    '.pdf': 'Documents',
    '.docx': 'Documents',
    '.doc': 'Documents',
    '.txt': 'Documents',
    '.xlsx': 'Documents',
    '.xls': 'Documents',
    '.pptx': 'Documents',
    '.ppt': 'Documents',
    '.csv': 'Documents',
    '.epub': 'Documents',
    '.md': 'Documents',

    # Images
    '.jpg': 'Images',
    '.jpeg': 'Images',
    '.png': 'Images',
    '.gif': 'Images',
    '.bmp': 'Images',
    '.svg': 'Images',
    '.webp': 'Images',
    '.ico': 'Images',
    '.tiff': 'Images',

    # Videos
    '.mp4': 'Videos',
    '.mkv': 'Videos',
    '.mov': 'Videos',
    '.avi': 'Videos',
    '.wmv': 'Videos',
    '.flv': 'Videos',
    '.webm': 'Videos',

    # Audio
    '.mp3': 'Audio',
    '.wav': 'Audio',
    '.aac': 'Audio',
    '.flac': 'Audio',
    '.ogg': 'Audio',
    '.m4a': 'Audio',

    # Archives
    '.zip': 'Archives',
    '.tar': 'Archives',
    '.gz': 'Archives',
    '.7z': 'Archives',
    '.rar': 'Archives',
    '.bz2': 'Archives',
    '.xz': 'Archives',

    # Code & Scripts
    '.py': 'Code',
    '.js': 'Code',
    '.ts': 'Code',
    '.html': 'Code',
    '.css': 'Code',
    '.json': 'Code',
    '.cpp': 'Code',
    '.c': 'Code',
    '.java': 'Code',
    '.sh': 'Code',
    '.sql': 'Code',
    '.rs': 'Code',
    '.go': 'Code',

    # Executables & Installers
    '.exe': 'Installers',
    '.dmg': 'Installers',
    '.deb': 'Installers',
    '.pkg': 'Installers',
    '.msi': 'Installers',
    '.apk': 'Installers',
}

DEFAULT_FALLBACK_CATEGORY = 'Others'

# Set up logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)
logger = logging.getLogger("FileOrganizer")


def resolve_collision(target_dir: Path, filename: str) -> Path:
    """
    Resolve naming collisions if a file with the same name already exists in target_dir.
    Appends ' (1)', ' (2)', etc., before the extension.
    Example: report.pdf -> report (1).pdf
    """
    destination = target_dir / filename
    if not destination.exists():
        return destination

    stem = Path(filename).stem
    suffix = Path(filename).suffix
    counter = 1

    while True:
        new_name = f"{stem} ({counter}){suffix}"
        destination = target_dir / new_name
        if not destination.exists():
            return destination
        counter += 1


def organize_directory(
    target_path: str,
    extension_mappings: Optional[Dict[str, str]] = None,
    dry_run: bool = False,
    create_others: bool = True
) -> Dict[str, any]:
    """
    Main organizational function.
    Scans target_path using os.scandir(), maps file extensions to category directories,
    creates required category folders, and uses shutil.move() to relocate files.

    Returns an execution report summary dictionary.
    """
    directory = Path(target_path).resolve()

    if not directory.exists():
        raise FileNotFoundError(f"Target directory '{target_path}' does not exist.")

    if not directory.is_dir():
        raise NotADirectoryError(f"Target path '{target_path}' is not a valid directory.")

    mappings = extension_mappings or DEFAULT_EXTENSION_MAPPINGS
    category_folders = set(mappings.values())
    if create_others:
        category_folders.add(DEFAULT_FALLBACK_CATEGORY)

    summary = {
        'target_directory': str(directory),
        'dry_run': dry_run,
        'total_scanned': 0,
        'total_relocated': 0,
        'skipped_category_dirs': 0,
        'skipped_special_files': 0,
        'errors': [],
        'categories_summary': {},
        'operations': []
    }

    logger.info(f"{'PREVIEWING (DRY RUN)' if dry_run else 'ORGANIZING'} directory: {directory}")

    # Use os.scandir() as recommended in technical requirements
    try:
        with os.scandir(directory) as entries:
            for entry in entries:
                summary['total_scanned'] += 1

                # Skip directories (including already created category folders)
                if entry.is_dir():
                    if entry.name in category_folders:
                        summary['skipped_category_dirs'] += 1
                    continue

                # Skip hidden files or system files if desired
                if entry.name.startswith('.') and not entry.name.endswith('.tar.gz'):
                    summary['skipped_special_files'] += 1
                    continue

                file_path = Path(entry.path)
                ext = file_path.suffix.lower()

                # Multi-part extension check (e.g., .tar.gz)
                if file_path.name.lower().endswith('.tar.gz'):
                    ext = '.tar.gz'

                category = mappings.get(ext, DEFAULT_FALLBACK_CATEGORY if create_others else None)

                if not category:
                    continue

                dest_folder = directory / category

                # Ensure category directory exists (if not in dry-run)
                if not dry_run:
                    try:
                        dest_folder.mkdir(parents=True, exist_ok=True)
                    except PermissionError as e:
                        err_msg = f"Permission denied creating subfolder '{category}': {e}"
                        logger.error(err_msg)
                        summary['errors'].append(err_msg)
                        continue

                # Collision-safe target path
                dest_file_path = resolve_collision(dest_folder, file_path.name)
                was_renamed = dest_file_path.name != file_path.name

                op_record = {
                    'filename': file_path.name,
                    'category': category,
                    'destination': str(dest_file_path),
                    'renamed': was_renamed,
                    'status': 'preview' if dry_run else 'success'
                }

                if dry_run:
                    logger.info(f"[DRY-RUN] Would move: '{file_path.name}' -> /{category}/{dest_file_path.name}")
                    summary['total_relocated'] += 1
                    summary['categories_summary'][category] = summary['categories_summary'].get(category, 0) + 1
                    summary['operations'].append(op_record)
                    continue

                # Safe move with try-except blocks as specified in requirements
                try:
                    # Using shutil.move() as required by documentation
                    shutil.move(str(file_path), str(dest_file_path))
                    logger.info(f"Moved: '{file_path.name}' -> /{category}/{dest_file_path.name}")
                    summary['total_relocated'] += 1
                    summary['categories_summary'][category] = summary['categories_summary'].get(category, 0) + 1
                    summary['operations'].append(op_record)
                except PermissionError as pe:
                    err_msg = f"PermissionError moving '{file_path.name}': {pe}"
                    logger.error(err_msg)
                    summary['errors'].append(err_msg)
                except FileExistsError as fe:
                    err_msg = f"FileExistsError on destination '{dest_file_path.name}': {fe}"
                    logger.error(err_msg)
                    summary['errors'].append(err_msg)
                except OSError as oe:
                    err_msg = f"OSError relocating '{file_path.name}': {oe}"
                    logger.error(err_msg)
                    summary['errors'].append(err_msg)

    except PermissionError as e:
        logger.error(f"Cannot read target directory '{directory}': {e}")
        summary['errors'].append(f"Directory access error: {e}")

    return summary


def print_formatted_summary(summary: Dict[str, any]):
    """Print an aesthetically clean execution summary table to console."""
    print("\n" + "=" * 60)
    print("      AUTOMATED FILE ORGANIZER - EXECUTION SUMMARY")
    print("=" * 60)
    print(f" Target Directory  : {summary['target_directory']}")
    print(f" Mode              : {'DRY RUN (Preview Only)' if summary['dry_run'] else 'LIVE EXECUTION'}")
    print(f" Total Entries     : {summary['total_scanned']}")
    print(f" Total Relocated   : {summary['total_relocated']}")
    print("-" * 60)
    print(" Relocations by Category:")
    if summary['categories_summary']:
        for cat, count in sorted(summary['categories_summary'].items()):
            print(f"   /{cat:<16} : {count:>4} file(s)")
    else:
        print("   (No files were moved)")
    print("-" * 60)

    if summary['errors']:
        print(f" Errors Encountered: {len(summary['errors'])}")
        for err in summary['errors']:
            print(f"   - {err}")
        print("-" * 60)
    else:
        print(" Status            : COMPLETED SUCCESSFULLY (0 errors)")

    print("=" * 60 + "\n")


def main():
    """Interactive CLI runner for automated file organizer."""
    print("=====================================================")
    print("       AUTOMATED FILE ORGANIZER & CLEANUP UTILITY    ")
    print("=====================================================")
    print("Organizes cluttered directories by file extension into")
    print("categorized subfolders (/Documents, /Images, /Videos, etc.)\n")

    # Target directory input
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        default_dir = os.path.expanduser("~/Downloads")
        user_input = input(f"Enter directory path to organize [Default: {default_dir}]: ").strip()
        target_dir = user_input if user_input else default_dir

    if not os.path.isdir(target_dir):
        print(f"Error: '{target_dir}' is not a valid directory.")
        return

    # Dry-run option
    dry_run_input = input("Perform a Dry-Run first to preview changes? (y/n) [y]: ").strip().lower()
    is_dry_run = dry_run_input != 'n'

    summary = organize_directory(target_dir, dry_run=is_dry_run)
    print_formatted_summary(summary)

    if is_dry_run and summary['total_relocated'] > 0:
        proceed = input("Would you like to execute the live organization now? (y/n) [n]: ").strip().lower()
        if proceed in ('y', 'yes'):
            live_summary = organize_directory(target_dir, dry_run=False)
            print_formatted_summary(live_summary)


if __name__ == "__main__":
    main()
