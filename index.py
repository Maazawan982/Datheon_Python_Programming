#!/usr/bin/env python3
"""Index entrypoint for Vercel and local execution."""
from app import app, application

if __name__ == "__main__":
    from app import GAME_SCRIPT
    import os, sys
    if os.path.isfile(GAME_SCRIPT):
        sys.path.insert(0, os.path.dirname(GAME_SCRIPT))
        with open(GAME_SCRIPT, "r", encoding="utf-8") as f:
            exec(compile(f.read(), GAME_SCRIPT, "exec"), {"__name__": "__main__"})
