#!/usr/bin/env python3
"""
Unit tests for Automated File Organizer & Cleanup Utility.
Validates directory scanning, category creation, shutil.move relocation, collision handling, and error handling.
"""

import unittest
import tempfile
import os
import shutil
from pathlib import Path

# Add project folder to sys.path
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from organizer import organize_directory, resolve_collision, DEFAULT_EXTENSION_MAPPINGS


class TestFileOrganizer(unittest.TestCase):

    def setUp(self):
        """Create a temporary messy directory structure for testing."""
        self.test_dir = tempfile.mkdtemp(prefix="test_organizer_")

        # Create dummy test files
        self.files_to_create = [
            ("sample_report.pdf", "PDF test content"),
            ("notes.docx", "Word document"),
            ("photo_1.jpg", "JPEG content"),
            ("screenshot.png", "PNG content"),
            ("clip.mp4", "Video content"),
            ("archive_data.zip", "ZIP content"),
            ("script.py", "print('hello')"),
            ("unknown_file.xyz", "mystery format"),
        ]

        for fname, content in self.files_to_create:
            fpath = os.path.join(self.test_dir, fname)
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)

    def tearDown(self):
        """Clean up temporary test directory."""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def test_dry_run_does_not_move_files(self):
        """Verify dry-run reports relocations without modifying the filesystem."""
        summary = organize_directory(self.test_dir, dry_run=True)
        self.assertEqual(summary['total_relocated'], len(self.files_to_create))

        # Files should still be in root directory
        for fname, _ in self.files_to_create:
            fpath = os.path.join(self.test_dir, fname)
            self.assertTrue(os.path.isfile(fpath), f"File {fname} should still exist in root during dry-run")

    def test_live_organization(self):
        """Verify files are moved to their respective category subfolders."""
        summary = organize_directory(self.test_dir, dry_run=False)
        self.assertEqual(summary['total_relocated'], len(self.files_to_create))
        self.assertEqual(len(summary['errors']), 0)

        # Check subfolders created and files moved
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Documents", "sample_report.pdf")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Documents", "notes.docx")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Images", "photo_1.jpg")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Images", "screenshot.png")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Videos", "clip.mp4")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Archives", "archive_data.zip")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Code", "script.py")))
        self.assertTrue(os.path.isfile(os.path.join(self.test_dir, "Others", "unknown_file.xyz")))

    def test_collision_resolution(self):
        """Verify naming collisions are resolved safely without overwriting."""
        docs_dir = Path(self.test_dir) / "Documents"
        docs_dir.mkdir(parents=True, exist_ok=True)

        # Create pre-existing file in destination
        existing_doc = docs_dir / "invoice.pdf"
        with open(existing_doc, "w") as f:
            f.write("Existing invoice")

        # Resolve collision for another file with the same name
        resolved = resolve_collision(docs_dir, "invoice.pdf")
        self.assertEqual(resolved.name, "invoice (1).pdf")

        # Create invoice (1).pdf and check next collision
        with open(resolved, "w") as f:
            f.write("Second invoice")
        resolved_2 = resolve_collision(docs_dir, "invoice.pdf")
        self.assertEqual(resolved_2.name, "invoice (2).pdf")

    def test_category_skipping(self):
        """Verify category folders themselves are not processed or moved."""
        # Run organization once
        organize_directory(self.test_dir, dry_run=False)

        # Run organization a second time (should move 0 new files)
        second_summary = organize_directory(self.test_dir, dry_run=False)
        self.assertEqual(second_summary['total_relocated'], 0)


if __name__ == "__main__":
    unittest.main()
