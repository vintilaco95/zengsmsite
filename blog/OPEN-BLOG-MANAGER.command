#!/bin/bash
# Versiune alternativă - deschide în terminal nou

# Obține directorul scriptului
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Deschide Terminal în folder-ul blog și rulează aplicația
osascript -e "tell application \"Terminal\"
    activate
    do script \"cd '$SCRIPT_DIR' && clear && echo '📝 BLOG MANAGER - ZEN GSM' && echo '' && python3 add-blog-article.py\"
end tell"

