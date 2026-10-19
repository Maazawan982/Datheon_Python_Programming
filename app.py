#!/usr/bin/env python3
"""
Vercel Python Entrypoint & Local Launcher for Hangman Word Guessing Game.
Compatible with Vercel WSGI / ASGI serverless execution and local CLI execution.
"""

import os
import sys
import mimetypes

# Base paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(ROOT_DIR, "dist")
GAME_SCRIPT = os.path.join(ROOT_DIR, "Hangman Word Guessing Game", "hangman.py")


def app(environ, start_response):
    """
    Standard WSGI handler for Vercel Python runtime.
    Serves static files from dist/ or returns the web app.
    """
    path = environ.get("PATH_INFO", "/").lstrip("/")
    if not path:
        path = "index.html"

    file_path = os.path.join(DIST_DIR, path)

    # If requested file does not exist, fallback to index.html (SPA routing)
    if not os.path.isfile(file_path):
        file_path = os.path.join(DIST_DIR, "index.html")

    if os.path.isfile(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        mime_type = mime_type or "text/html; charset=utf-8"
        if mime_type.startswith("text/") and "charset" not in mime_type:
            mime_type += "; charset=utf-8"

        try:
            with open(file_path, "rb") as f:
                content = f.read()

            status = "200 OK"
            headers = [
                ("Content-Type", mime_type),
                ("Content-Length", str(len(content))),
                ("Cache-Control", "public, max-age=3600"),
            ]
            start_response(status, headers)
            return [content]
        except Exception as e:
            status = "500 Internal Server Error"
            headers = [("Content-Type", "text/plain; charset=utf-8")]
            start_response(status, headers)
            return [f"Server Error: {e}".encode("utf-8")]

    # If dist is not yet built, serve a fallback response
    status = "200 OK"
    html = b"""<!DOCTYPE html>
<html>
<head><title>Hangman Word Guessing Game</title></head>
<body style="font-family: monospace; background: #09090b; color: #10b981; padding: 2rem; text-align: center;">
    <h1>Hangman Word Guessing Game</h1>
    <p>Please build the project using <code>npm run build</code> or deploy via Vite on Vercel.</p>
</body>
</html>"""
    headers = [("Content-Type", "text/html; charset=utf-8"), ("Content-Length", str(len(html)))]
    start_response(status, headers)
    return [html]


# Standard WSGI alias
application = app


if __name__ == "__main__":
    # If run in terminal, launch the console Hangman game
    if os.path.isfile(GAME_SCRIPT):
        # Execute the game script in the current process
        with open(GAME_SCRIPT, "r", encoding="utf-8") as f:
            code = f.read()
        # Add project folder to sys.path
        sys.path.insert(0, os.path.dirname(GAME_SCRIPT))
        exec(compile(code, GAME_SCRIPT, "exec"), {"__name__": "__main__"})
    else:
        print(f"Error: Game script not found at {GAME_SCRIPT}")
