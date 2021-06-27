#!/usr/bin/env python3

import os
import http.server
import socketserver

PORT = 8080
DIRECTORY = "www/"


Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map[".wasm"] = "application/wasm"

os.chdir(DIRECTORY)
with socketserver.TCPServer(("localhost", PORT), Handler) as httpd:
  print("serving at port", PORT)
  httpd.serve_forever()
