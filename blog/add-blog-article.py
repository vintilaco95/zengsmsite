#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pentru gestionarea articolelor de blog (adaugare și ștergere)
Folosește: python3 add-blog-article.py
"""

import os
import re
from datetime import datetime
import sys
import glob

def slugify(text):
    """Convertește textul într-un slug URL-friendly"""
    text = text.lower()
    text = re.sub(r'[ăâîșț]', lambda m: {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't'
    }[m.group(0)], text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

def create_blog_article():
    """Creează un nou articol de blog"""
    
    print("=" * 60)
    print("ADĂUGARE ARTICOL DE BLOG - ZEN GSM")
    print("=" * 60)
    print()
    
    # Colectare date
    title = input("📝 Titlul articolului: ").strip()
    if not title:
        print("❌ Titlul este obligatoriu!")
        return
    
    excerpt = input("📄 Excerpt/Descriere scurtă: ").strip()
    if not excerpt:
        excerpt = title
    
    icon = input("🎨 Iconiță emoji (ex: 💧, 🔋, 📱): ").strip() or "📱"
    
    reading_time = input("⏱️  Timp de citire (ex: 5 min citire, 3 min): ").strip() or "5 min citire"
    
    date_input = input("📅 Data (format: DD MM YYYY sau Enter pentru azi): ").strip()
    if date_input:
        try:
            date_obj = datetime.strptime(date_input, "%d %m %Y")
            date_str = date_obj.strftime("%d %b %Y")
        except:
            print("⚠️  Format invalid, folosesc data de azi")
            date_str = datetime.now().strftime("%d %b %Y")
    else:
        date_str = datetime.now().strftime("%d %b %Y")
    
    print()
    print("📝 Conținutul articolului:")
    print("   Scrieți HTML-ul pentru conținut.")
    print("   Pentru a termina, scrieți 'END' pe o linie nouă sau apăsați Ctrl+D")
    print("   Exemplu: <p>Paragraf 1</p><h2>Titlu</h2><p>Paragraf 2</p>")
    print()
    
    content_lines = []
    print("Conținut (scrie 'END' pentru a termina):")
    try:
        while True:
            try:
                line = input()
                if line.strip().upper() == 'END':
                    break
                content_lines.append(line)
            except EOFError:
                # Ctrl+D sau Ctrl+Z
                break
    except KeyboardInterrupt:
        print("\n⚠️  Citirea conținutului a fost întreruptă")
        return
    
    content = "\n".join(content_lines)
    if not content.strip():
        content = "<p>Conținutul articolului va fi adăugat aici. Editează acest fișier pentru a adăuga conținutul complet.</p>"
    
    # Generare slug
    slug = slugify(title)
    filename = f"blog-{slug}.html"
    
    # Setăm calea relativă la directorul curent (blog/)
    # Folosim __file__ pentru a determina directorul scriptului
    try:
        blog_dir = os.path.dirname(os.path.abspath(__file__))
    except NameError:
        # Fallback pentru când rulezi direct scriptul sau în modul interactiv
        blog_dir = os.path.dirname(os.path.abspath(sys.argv[0])) if sys.argv else os.getcwd()
    
    # Verificare dacă fișierul există deja
    filepath = os.path.join(blog_dir, filename)
    if os.path.exists(filepath):
        overwrite = input(f"⚠️  Fișierul {filename} există deja. Suprascrie? (y/n): ").strip().lower()
        if overwrite != 'y':
            print("❌ Operațiune anulată")
            return
    
    # Citire template
    template_path = os.path.join(blog_dir, "blog-template.html")
    if not os.path.exists(template_path):
        print(f"❌ Template-ul {template_path} nu există!")
        print(f"   Verifică că fișierul blog-template.html există în folder-ul blog/.")
        return
    
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
    except Exception as e:
        print(f"❌ Eroare la citirea template-ului: {e}")
        return
    
    # Înlocuire placeholder-uri
    template = template.replace("{{TITLE}}", title)
    template = template.replace("{{DESCRIPTION}}", excerpt)
    template = template.replace("{{READING_TIME}}", reading_time)
    template = template.replace("{{DATE}}", date_str)
    template = template.replace("{{ICON}}", icon)
    template = template.replace("{{EXCERPT}}", excerpt)
    template = template.replace("{{CONTENT}}", content)
    
    # Scriere fișier
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(template)
        print()
        print("✅ Articol creat cu succes!")
        print(f"📄 Fișier: blog/{filename}")
        print()
    except Exception as e:
        print(f"❌ Eroare la scrierea fișierului: {e}")
        return
    
    # Actualizare blog.html
    update_main_blog = input("📝 Actualizează pagina blog.html cu noul articol? (y/n): ").strip().lower()
    if update_main_blog == 'y':
        update_blog_page(filename, title, excerpt, icon, reading_time, date_str, blog_dir)
    
    print()
    print("🎉 Gata! Articolul este pregătit.")
    print(f"   📄 Pagina: {filename}")
    print(f"   ✏️  Editează conținutul în fișierul de mai sus pentru a personaliza articolul")

def update_blog_page(filename, title, excerpt, icon, reading_time, date_str, blog_dir='.'):
    """Actualizează blog.html cu noul articol"""
    
    # blog.html este în directorul părinte (root)
    if blog_dir == '.':
        parent_dir = '..'
    else:
        parent_dir = os.path.dirname(blog_dir)
    
    blog_file = os.path.join(parent_dir, "blog.html")
    
    # Normalizăm calea absolută pentru a evita probleme
    if not os.path.isabs(blog_file):
        blog_file = os.path.abspath(blog_file)
    
    if not os.path.exists(blog_file):
        print(f"⚠️  {blog_file} nu există, nu pot actualiza")
        return
    
    try:
        with open(blog_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Escapăm caracterele speciale pentru HTML
        escaped_title = title.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
        escaped_excerpt = excerpt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
        
        # Path-ul către articol este relativ de la blog.html (care e în root)
        article_path = f"blog/{filename}"
        
        new_article = f'''                <article class="blog-card">
                    <div class="blog-image">
                        <div class="blog-placeholder">{icon}</div>
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span>🕒 {reading_time}</span>
                            <span>📅 {date_str}</span>
                        </div>
                        <h3>{escaped_title}</h3>
                        <p>{escaped_excerpt}</p>
                        <a href="{article_path}" class="blog-read-more">Citește →</a>
                    </div>
                </article>

'''
        
        # Găsește locația pentru inserare
        # În primul rând, încercăm să găsim blog-grid
        blog_grid_pattern = r'(<div class="blog-grid">\s*)'
        blog_grid_match = re.search(blog_grid_pattern, content, re.DOTALL)
        
        if not blog_grid_match:
            raise ValueError("Nu s-a găsit <div class=\"blog-grid\"> în blog.html")
        
        # Verificăm dacă există deja articole în grid
        # Căutăm orice <article în grid
        after_grid_pos = blog_grid_match.end()
        content_after_grid = content[after_grid_pos:]
        
        # Găsește articolul featured complet (non-greedy pentru a lua doar primul)
        featured_pattern = r'(<article class="blog-card featured">.*?</article>\s*)'
        featured_match = re.search(featured_pattern, content_after_grid, re.DOTALL)
        
        if featured_match:
            # Inserează după primul articol featured
            insert_pos = after_grid_pos + featured_match.end()
            content = content[:insert_pos] + new_article + content[insert_pos:]
            print("✅ Articol inserat după articolul featured")
        else:
            # Caută orice articol existent în grid
            any_article_match = re.search(r'(</article>\s*)', content_after_grid, re.DOTALL)
            if any_article_match:
                # Inserează după ultimul articol găsit
                insert_pos = after_grid_pos + any_article_match.end()
                content = content[:insert_pos] + new_article + content[insert_pos:]
                print("✅ Articol inserat după ultimul articol existent")
            else:
                # Grid-ul este gol - inserăm direct după deschiderea blog-grid
                insert_pos = after_grid_pos
                content = content[:insert_pos] + new_article + content[insert_pos:]
                print("✅ Articol inserat în grid-ul gol (primul articol)")
        
        # Scrie fișierul actualizat
        with open(blog_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {blog_file} actualizat cu succes!")
        print(f"   Articolul '{title}' a fost adăugat în listă")
        
    except Exception as e:
        print(f"⚠️  Eroare la actualizarea {blog_file}: {e}")
        import traceback
        traceback.print_exc()
        print()
        print("   Articolul a fost creat, dar nu a fost adăugat în blog.html")
        print("   Poți adăuga manual articolul în blog.html sau încerca din nou")

def list_blog_articles(blog_dir='.'):
    """Listează toate articolele de blog disponibile"""
    try:
        if blog_dir == '.':
            try:
                blog_dir = os.path.dirname(os.path.abspath(__file__))
            except NameError:
                blog_dir = os.path.dirname(os.path.abspath(sys.argv[0])) if sys.argv else os.getcwd()
        
        # Găsește toate fișierele blog-*.html
        pattern = os.path.join(blog_dir, "blog-*.html")
        articles = glob.glob(pattern)
        
        # Excludem template-ul
        articles = [a for a in articles if 'template' not in os.path.basename(a)]
        
        if not articles:
            return []
        
        # Sortează după nume
        articles.sort()
        
        return articles
    except Exception as e:
        print(f"⚠️  Eroare la listarea articolelor: {e}")
        return []

def delete_blog_article():
    """Șterge un articol de blog"""
    
    print("=" * 60)
    print("ȘTERGERE ARTICOL DE BLOG - ZEN GSM")
    print("=" * 60)
    print()
    
    # Determină directorul blog/
    try:
        blog_dir = os.path.dirname(os.path.abspath(__file__))
    except NameError:
        blog_dir = os.path.dirname(os.path.abspath(sys.argv[0])) if sys.argv else os.getcwd()
    
    # Listează articolele
    articles = list_blog_articles(blog_dir)
    
    if not articles:
        print("❌ Nu există articole de blog de șters!")
        return
    
    print(f"📋 Articole disponibile ({len(articles)}):")
    print()
    
    article_list = []
    for idx, article_path in enumerate(articles, 1):
        filename = os.path.basename(article_path)
        # Extrage titlul din fișier dacă e posibil
        try:
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()
                title_match = re.search(r'<title>(.*?)\s*\|\s*Blog', content, re.IGNORECASE)
                if title_match:
                    title = title_match.group(1).strip()
                else:
                    # Dacă nu găsește în title, caută în h1 sau h3
                    h_match = re.search(r'<h[13][^>]*>(.*?)</h[13]>', content, re.DOTALL | re.IGNORECASE)
                    if h_match:
                        title = re.sub(r'<[^>]+>', '', h_match.group(1)).strip()
                    else:
                        title = filename.replace('blog-', '').replace('.html', '').replace('-', ' ').title()
            article_list.append((idx, filename, title, article_path))
            print(f"   {idx}. {title}")
            print(f"      📄 {filename}")
        except Exception as e:
            article_list.append((idx, filename, filename, article_path))
            print(f"   {idx}. {filename}")
    
    print()
    
    try:
        choice = input("🔢 Introdu numărul articolului de șters (sau 'q' pentru a anula): ").strip()
        
        if choice.lower() == 'q':
            print("❌ Operațiune anulată")
            return
        
        choice_idx = int(choice)
        
        if choice_idx < 1 or choice_idx > len(article_list):
            print(f"❌ Număr invalid! Alege între 1 și {len(article_list)}")
            return
        
        selected = article_list[choice_idx - 1]
        filename, title, article_path = selected[1], selected[2], selected[3]
        
        print()
        print(f"⚠️  Ești sigur că vrei să ștergi articolul:")
        print(f"   📝 {title}")
        print(f"   📄 {filename}")
        
        confirm = input("\n❓ Confirmă ștergerea (scrie 'DA' pentru confirmare): ").strip()
        
        if confirm.upper() != 'DA':
            print("❌ Ștergerea a fost anulată")
            return
        
        # Șterge fișierul HTML
        try:
            if os.path.exists(article_path):
                os.remove(article_path)
                print(f"✅ Fișier șters: {article_path}")
            else:
                print(f"⚠️  Fișierul nu există: {article_path}")
        except Exception as e:
            print(f"❌ Eroare la ștergerea fișierului: {e}")
            return
        
        # Șterge card-ul din blog.html
        remove_from_blog_page(filename, blog_dir)
        
        print()
        print("🎉 Articol șters cu succes!")
        print(f"   ✅ Fișierul {filename} a fost șters")
        print(f"   ✅ Card-ul a fost eliminat din blog.html")
        
    except ValueError:
        print("❌ Număr invalid!")
    except KeyboardInterrupt:
        print("\n\n❌ Operațiune anulată de utilizator")
    except Exception as e:
        print(f"\n❌ Eroare: {e}")
        import traceback
        traceback.print_exc()

def remove_from_blog_page(filename, blog_dir='.'):
    """Elimină card-ul articolului din blog.html"""
    
    # blog.html este în directorul părinte (root)
    if blog_dir == '.':
        parent_dir = '..'
    else:
        parent_dir = os.path.dirname(blog_dir)
    
    blog_file = os.path.join(parent_dir, "blog.html")
    
    # Normalizăm calea absolută
    if not os.path.isabs(blog_file):
        blog_file = os.path.abspath(blog_file)
    
    if not os.path.exists(blog_file):
        print(f"⚠️  {blog_file} nu există, nu pot elimina card-ul")
        return
    
    try:
        with open(blog_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Path-ul către articol în blog.html
        article_path = f"blog/{filename}"
        escaped_path = re.escape(article_path)
        
        # Pattern pentru a găsi întregul card al articolului
        # Include spațiile albe înainte de <article> și căută link-ul către articol
        # Pattern 1: Caută exact path-ul în href
        pattern1 = rf'(\s*<article[^>]*class="blog-card"[^>]*>.*?<a[^>]*href="{escaped_path}"[^>]*>.*?</a>.*?</article>\s*)'
        
        # Pattern 2: Caută doar filename-ul în link (mai flexibil)
        pattern2 = rf'(\s*<article[^>]*class="blog-card"[^>]*>.*?{re.escape(filename)}.*?</article>\s*)'
        
        match = None
        
        # Încearcă pattern 1 (mai specific)
        match = re.search(pattern1, content, re.DOTALL | re.IGNORECASE)
        
        if not match:
            # Încearcă pattern 2 (mai general)
            match = re.search(pattern2, content, re.DOTALL | re.IGNORECASE)
        
        if match:
            # Elimină card-ul (inclusiv spațiile albe de dinainte)
            content = content[:match.start()] + content[match.end():]
            print(f"✅ Card eliminat din blog.html")
        else:
            print(f"⚠️  Nu s-a găsit card-ul pentru {filename} în blog.html")
            print(f"   Verifică manual dacă există link-ul către blog/{filename}")
            print(f"   Poți șterge manual card-ul din blog.html")
            return
        
        # Scrie fișierul actualizat
        with open(blog_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ blog.html actualizat cu succes!")
        
    except Exception as e:
        print(f"⚠️  Eroare la actualizarea {blog_file}: {e}")
        import traceback
        traceback.print_exc()
        print()
        print("   Fișierul articolului a fost șters, dar card-ul nu a putut fi eliminat automat")
        print("   Poți șterge manual card-ul din blog.html")

def show_main_menu():
    """Afișează meniul principal"""
    print("=" * 60)
    print("GESTIONARE ARTICOLE BLOG - ZEN GSM")
    print("=" * 60)
    print()
    print("Alege o opțiune:")
    print("  1. ➕ Adaugă un articol nou")
    print("  2. 🗑️  Șterge un articol existent")
    print("  3. ❌ Ieșire")
    print()

if __name__ == "__main__":
    try:
        show_main_menu()
        
        while True:
            choice = input("🔢 Alege opțiunea (1-3): ").strip()
            
            if choice == '1':
                print()
                create_blog_article()
                print()
                input("Apasă Enter pentru a continua...")
                print("\n" * 2)
                show_main_menu()
            elif choice == '2':
                print()
                delete_blog_article()
                print()
                input("Apasă Enter pentru a continua...")
                print("\n" * 2)
                show_main_menu()
            elif choice == '3':
                print("\n👋 La revedere!")
                break
            else:
                print("❌ Opțiune invalidă! Alege 1, 2 sau 3")
                print()
                
    except KeyboardInterrupt:
        print("\n\n❌ Operațiune anulată de utilizator")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Eroare: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
