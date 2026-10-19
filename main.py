#!/usr/bin/env python3
"""Main entrypoint for Vercel and local execution."""
from app import app, application

if __name__ == "__main__":
    import app as app_module
    # Execute the game if run from command line
    game_script = app_module.GAME_SCRIPT
    import os, sys
    if os.path.isfile(game_script):
        sys.path.insert(0, os.path.dirname(game_script))
        with open(game_script, "r", encoding="utf-8") as f:
            exec(compile(f.read(), game_script, "exec"), {"__name__": "__main__"})
