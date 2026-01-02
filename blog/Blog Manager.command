#!/bin/bash
# Script pentru deschiderea automată a aplicației Blog Manager în Terminal

# Obține directorul scriptului
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Titlu și header
clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   📝 BLOG MANAGER - ZEN GSM                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Locație: $SCRIPT_DIR"
echo "🚀 Pornire aplicație..."
echo ""

# Rulează aplicația Python
python3 add-blog-article.py

# Păstrează terminalul deschis după închiderea aplicației
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Aplicația s-a închis."
echo ""
read -p "Apasă Enter pentru a închide terminalul..." 

