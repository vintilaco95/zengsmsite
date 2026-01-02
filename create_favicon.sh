#!/bin/bash
# Creează un favicon.ico simplu folosind sips (tool nativ macOS)

PNG_SOURCE="images/IMG_7712.PNG"
FAVICON_ICO="favicon.ico"

if [ -f "$PNG_SOURCE" ]; then
    # Creează o copie redimensionată pentru favicon
    sips -z 32 32 "$PNG_SOURCE" --out temp_favicon_32.png 2>/dev/null
    
    if [ -f "temp_favicon_32.png" ]; then
        # Copiază ca favicon.ico (macOS acceptă PNG ca ICO)
        cp temp_favicon_32.png "$FAVICON_ICO"
        rm -f temp_favicon_32.png
        echo "✅ Creat favicon.ico în rădăcina site-ului"
    else
        echo "⚠️  Sips nu a putut crea favicon, folosind PNG direct"
    fi
else
    echo "❌ Nu există $PNG_SOURCE"
fi
