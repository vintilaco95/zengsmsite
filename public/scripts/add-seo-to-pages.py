#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pentru adăugarea automată a SEO optimizat pe toate paginile HTML
"""

import os
import re
from pathlib import Path

# Configurare site
SITE_URL = "https://www.zengsm.ro"
SITE_NAME = "ZEN GSM Timișoara"
SITE_IMAGE = "https://www.zengsm.ro/images/IMG_7712.PNG"

# Meta tags de bază pentru fiecare pagină
def get_seo_meta_tags(page_title, page_description, page_url, page_image=None):
    """Generează meta tags SEO complete"""
    if not page_image:
        page_image = SITE_IMAGE
    
    # Escape pentru HTML
    title_escaped = page_title.replace('"', '&quot;')
    desc_escaped = page_description.replace('"', '&quot;')
    
    meta_tags = f'''    <meta name="description" content="{desc_escaped}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="{page_url}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{page_url}">
    <meta property="og:title" content="{title_escaped}">
    <meta property="og:description" content="{desc_escaped}">
    <meta property="og:image" content="{page_image}">
    <meta property="og:locale" content="ro_RO">
    <meta property="og:site_name" content="{SITE_NAME}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{page_url}">
    <meta name="twitter:title" content="{title_escaped}">
    <meta name="twitter:description" content="{desc_escaped}">
    <meta name="twitter:image" content="{page_image}">'''
    
    return meta_tags

# Configurare pagini
pages_config = {
    "index.html": {
        "title": "ZEN GSM - Service GSM Premium Timișoara | Reparații Telefoane și Tablete",
        "description": "Service GSM profesional în Timișoara. Reparații iPhone, Samsung, Huawei, Xiaomi. Piese originale, garanție, diagnostic gratuit. Peste 10 ani experiență. SC Ajutor Technologia SRL.",
        "url": f"{SITE_URL}/",
        "add_local_business": True
    },
    "servicii.html": {
        "title": "Servicii Reparații GSM | ZEN GSM Timișoara",
        "description": "Servicii complete de reparații telefoane: display, baterie, cameră, contact apă, software. Toate mărcile: iPhone, Samsung, Huawei, Xiaomi. Garanție inclusă.",
        "url": f"{SITE_URL}/servicii.html",
        "add_service_schema": True
    },
    "preturi.html": {
        "title": "Prețuri Reparații Telefoane | ZEN GSM Timișoara",
        "description": "Listă prețuri transparentă pentru reparații telefoane: display, baterie, cameră, software. Prețuri competitive, piese originale, garanție.",
        "url": f"{SITE_URL}/preturi.html"
    },
    "contact.html": {
        "title": "Contact ZEN GSM Timișoara | Program & Locație",
        "description": "Contactează-ne: Constantin Brâncoveanu Nr. 2, Timișoara. Telefon: 0758 060 072. Program: Luni-Vineri 9:00-18:00. Service GSM profesional.",
        "url": f"{SITE_URL}/contact.html"
    },
    "blog.html": {
        "title": "Blog & Sfaturi | ZEN GSM Timișoara",
        "description": "Sfaturi utile despre îngrijirea telefonului, cum să protejezi bateria, reparații și multe altele. Ghiduri de la experți în reparații GSM.",
        "url": f"{SITE_URL}/blog.html"
    },
    "vanzare-telefon.html": {
        "title": "Vinde Telefonul Tău | ZEN GSM Timișoara - Prețuri Corecte",
        "description": "Vinde telefonul tău la prețuri corecte. Calculare preț instant, evaluare profesională. iPhone, Samsung, Huawei, Xiaomi. Plata imediată.",
        "url": f"{SITE_URL}/vanzare-telefon.html"
    },
    "formulare.html": {
        "title": "Verifică Status Service | ZEN GSM Timișoara",
        "description": "Verifică statusul reparației telefonului tău. Introdu codul de urmărire și vezi progresul în timp real. Service GSM profesional.",
        "url": f"{SITE_URL}/formulare.html"
    },
    "despre.html": {
        "title": "Despre Noi | ZEN GSM Timișoara - Peste 10 Ani Experiență",
        "description": "ZEN GSM - Service GSM profesional în Timișoara cu peste 10 ani experiență. SC Ajutor Technologia SRL. Reparații profesionale, piese originale, garanție.",
        "url": f"{SITE_URL}/despre.html"
    },
    "galerie.html": {
        "title": "Galerie Lucrări | ZEN GSM Timișoara",
        "description": "Vezi lucrările noastre: reparații display, baterie, cameră, contact apă. Peste 10 ani experiență în reparații GSM profesionale.",
        "url": f"{SITE_URL}/galerie.html"
    },
    "intrebari-frecvente.html": {
        "title": "Întrebări Frecvente | ZEN GSM Timișoara - FAQ",
        "description": "Răspunsuri la cele mai frecvente întrebări despre reparații telefoane, garanție, prețuri, program. Service GSM profesional în Timișoara.",
        "url": f"{SITE_URL}/intrebari-frecvente.html"
    }
}

def add_seo_to_page(filepath, config):
    """Adaugă SEO la o pagină"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Generează meta tags
        meta_tags = get_seo_meta_tags(
            config["title"],
            config["description"],
            config["url"]
        )
        
        # Verifică dacă deja există meta tags SEO
        if 'og:type' in content:
            print(f"⚠️  {filepath} - SEO deja există, skip")
            return False
        
        # Găsește tag-ul title pentru a insera după el
        title_pattern = r'(<title>.*?</title>)'
        title_match = re.search(title_pattern, content, re.DOTALL)
        
        if title_match:
            # Actualizează title dacă este diferit
            old_title = title_match.group(0)
            new_title = f'<title>{config["title"]}</title>'
            if old_title != new_title:
                content = content.replace(old_title, new_title)
            
            # Inserează meta tags după title
            insert_pos = title_match.end()
            
            # Verifică dacă există deja meta description
            if not re.search(r'<meta name="description"', content):
                # Nu există, inserează tot
                content = content[:insert_pos] + '\n' + meta_tags + '\n' + content[insert_pos:]
            else:
                # Există, actualizează doar description și adaugă restul
                desc_pattern = r'(<meta name="description"[^>]*>)'
                desc_match = re.search(desc_pattern, content)
                if desc_match:
                    # Șterge vechea description și adaugă cea nouă
                    content = content.replace(desc_match.group(0), f'    <meta name="description" content="{config["description"].replace(chr(34), "&quot;")}">')
                
                # Adaugă restul de meta tags dacă nu există
                if 'og:type' not in content:
                    content = content[:insert_pos] + '\n' + meta_tags.split('\n', 2)[2] + '\n' + content[insert_pos:]
        else:
            print(f"⚠️  {filepath} - Nu s-a găsit title tag")
            return False
        
        # Adaugă Structured Data dacă e necesar
        if config.get("add_local_business"):
            # LocalBusiness schema (deja adăugat manual în index.html)
            pass
        
        # Scrie fișierul actualizat
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filepath} - SEO adăugat")
        return True
        
    except Exception as e:
        print(f"❌ Eroare la {filepath}: {e}")
        return False

if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    print("=" * 60)
    print("SEO OPTIMIZARE - ZEN GSM")
    print("=" * 60)
    print()
    
    updated = 0
    for filename, config in pages_config.items():
        filepath = os.path.join(root_dir, filename)
        if os.path.exists(filepath):
            if add_seo_to_page(filepath, config):
                updated += 1
        else:
            print(f"⚠️  {filename} - Nu există")
    
    print()
    print(f"✅ {updated} pagini actualizate cu SEO")

