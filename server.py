"""Tiny static file server for Spotifly.

The app is a pure static site (HTML/CSS/JS + mp3 files). We ship
this small launcher so you can just double-click `start.cmd` or
run `python server.py`.

It serves the current directory on http://localhost:5500/ and
opens your browser automatically. The handler supports HTTP
Range requests, which makes <audio> seeking inside the MP3 files
fast and reliable.
"""

from __future__ import annotations

import http.server
import os
import re
import socketserver
import sys
import threading
import webbrowser
from pathlib import Path

PORT = 5500
ROOT = Path(__file__).parent.resolve()
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler that understands HTTP Range requests."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".mp3": "audio/mpeg",
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
    }

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("[spotifly] " + (fmt % args) + "\n")

    def send_head(self):
        # If no Range header is present, fall back to the default behaviour.
        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()

        try:
            file = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        try:
            file_size = os.fstat(file.fileno()).st_size
            match = RANGE_RE.match(range_header)
            if not match:
                self.send_error(400, "Invalid Range header")
                file.close()
                return None

            start_s, end_s = match.groups()
            if start_s == "" and end_s == "":
                self.send_error(400, "Invalid Range header")
                file.close()
                return None

            if start_s == "":
                # Suffix range: last N bytes
                length = int(end_s)
                if length <= 0:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    file.close()
                    return None
                start = max(0, file_size - length)
                end = file_size - 1
            else:
                start = int(start_s)
                end = int(end_s) if end_s else file_size - 1

            if start >= file_size or end >= file_size or start > end:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{file_size}")
                self.end_headers()
                file.close()
                return None

            content_length = end - start + 1
            ctype = self.guess_type(path)

            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(content_length))
            self.end_headers()

            file.seek(start)
            self._send_range(file, content_length)
            file.close()
            return None
        except Exception:
            file.close()
            raise

    def _send_range(self, file, length: int) -> None:
        chunk_size = 64 * 1024
        remaining = length
        while remaining > 0:
            chunk = file.read(min(chunk_size, remaining))
            if not chunk:
                break
            try:
                self.wfile.write(chunk)
            except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                return
            remaining -= len(chunk)


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main() -> None:
    os.chdir(ROOT)
    with ReusableTCPServer(("127.0.0.1", PORT), RangeHandler) as httpd:
        url = f"http://localhost:{PORT}/"
        print(f"Spotifly is running at {url}")
        print("Press Ctrl+C to stop.")
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping...")


if __name__ == "__main__":
    main()
