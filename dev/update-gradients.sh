#!/bin/sh
# Rewrites GRADIENTS/manifest.json after you add or remove images (a plain file server can't list folders).
cd "$(dirname "$0")/../GRADIENTS" && python3 -c "import os,json;json.dump(sorted(x for x in os.listdir('.') if x.lower().endswith(('.jpg','.jpeg','.png','.webp','.avif'))),open('manifest.json','w'),indent=1)" && echo "manifest updated"
