import tkinter as tk
from tkinter import scrolledtext, messagebox
from datetime import datetime
from tkinterweb import HtmlFrame
import os

# =========================
# KONFIGURATION
# =========================
html_file_path = "website/labor.html"
marker = "<!-- POST-EINFÜGEN -->"

categories = {
    "news": "News",
    "tpf2": "Transport Fever 2",
    "tpf3": "Transport Fever 3",
    "told": "Epoche 1",
    "tmid": "Epoche 2",
    "tnew": "Epoche 3",
    "tuto": "Tutorials",
    "mods": "Mods",
    "modd": "Modding",
    "spec": "LAB-Specials",
    "comm": "Community",
    "schb": "Schönbau",
    "wirt": "Wirtschaftlich",
    "maps": "Karten & Spielstände",
    "infr": "Infrastruktur",
    "mech": "Spielmechanik",
    "verg": "Vergleiche & Tests"
}

# =========================
# FUNKTIONEN
# =========================
def refresh_preview():
    try:
        with open(html_file_path, "r", encoding="utf-8") as f:
            html = f.read()

        with open(css_file_path, "r", encoding="utf-8") as f:
            css = f.read()

        preview_html = html.replace(
            "</head>",
            f"<style>{css}</style></head>"
        )

        preview.load_html(preview_html)
    except Exception as e:
        print("Preview-Fehler:", e)

def generate_post():
    img_src = entry_img.get()
    title = entry_title.get()
    text = text_content.get("1.0", tk.END).strip()

    selected_codes = [code for code, var in check_vars.items() if var.get()]
    if not selected_codes:
        messagebox.showwarning("Fehler", "Bitte mindestens eine Kategorie auswählen!")
        return

    categories_str = ",".join(selected_codes)
    current_date = datetime.now().strftime("%d.%m.%Y")

    html_post = f'''
<div class="post" data-categories="{categories_str}">
    <img src="{img_src}" alt="T">
    <h2>{title}</h2>
    <p>{text}</p>
    <p>{current_date}</p>
    <div style="display: flex">
        <div class="toggle-box">&#9829;</div>
        <div style="margin-left: 20px;"><p></p></div>
    </div>
</div>
'''

    try:
        with open(html_file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        messagebox.showerror("Fehler", f"Datei nicht gefunden:\n{html_file_path}")
        return

    for i, line in enumerate(lines):
        if marker in line:
            insert_index = i
            break
    else:
        messagebox.showerror("Fehler", "Marker nicht gefunden!")
        return

    lines.insert(insert_index + 1, "\n\n" + html_post + "\n")

    with open(html_file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    output_text.delete("1.0", tk.END)
    output_text.insert(tk.END, html_post)

    refresh_preview()
    messagebox.showinfo("Erfolg", "Post wurde erfolgreich eingefügt!")

# =========================
# GUI
# =========================
root = tk.Tk()
root.title("Transport Fever Lab – Post Generator")
root.geometry("900x900")

tk.Label(root, text="Bild-Link:").pack(anchor="w", padx=10)
entry_img = tk.Entry(root, width=120)
entry_img.pack(padx=10)

tk.Label(root, text="Überschrift:").pack(anchor="w", padx=10)
entry_title = tk.Entry(root, width=120)
entry_title.pack(padx=10)

tk.Label(root, text="Text:").pack(anchor="w", padx=10)
text_content = tk.Text(root, height=6)
text_content.pack(padx=10)

tk.Label(root, text="Kategorien:").pack(anchor="w", padx=10)
frame_checks = tk.Frame(root)
frame_checks.pack(padx=10, anchor="w")

check_vars = {}
for i, (code, name) in enumerate(categories.items()):
    var = tk.BooleanVar()
    chk = tk.Checkbutton(frame_checks, text=name, variable=var)
    chk.grid(row=i//3, column=i%3, sticky="w", padx=5)
    check_vars[code] = var

tk.Button(root, text="Post generieren", command=generate_post).pack(pady=10)

tk.Label(root, text="Generierter HTML-Code:").pack(anchor="w", padx=10)
output_text = scrolledtext.ScrolledText(root, height=10)
output_text.pack(fill="x", padx=10)

tk.Label(root, text="Live-Vorschau (echtes HTML + CSS):").pack(anchor="w", padx=10)
preview = HtmlFrame(root, horizontal_scrollbar="auto")
preview.pack(fill="both", expand=True, padx=10, pady=10)

refresh_preview()

root.mainloop()