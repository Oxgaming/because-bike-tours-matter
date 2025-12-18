import os
import feedparser
from datetime import datetime

# Alles liegt im Hauptordner
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# HTML-Datei im gleichen Ordner
HTML_FILE = os.path.join(BASE_DIR, "labor.html")
MARKER = "<!-- POST-EINFÜGEN -->"

# Ordner für letzte Videos
LAST_DIR = os.path.join(BASE_DIR, "last_videos")
os.makedirs(LAST_DIR, exist_ok=True)

AUTO_CATEGORIES = "comm,newv"

CHANNELS = [
    {
        "id": "UC4KiQZITzjlpxZ2B8ERRP1A",
        "name": "Train Gamer",
        "endtext": "Schaut unbedingt rein und lasst Feedback da!"
    },
    {
        "id": "UCOarPgCe5BM0Nw8l4sEP1A",
        "name": "OX-Gaming",
        "endtext": "Dieses Video solltet ihr nicht verpassen!"
    },
    {
        "id": "UCwU5oERCBunenjDsAMDikqQ",
        "name": "Urban Games",
        "endtext": "Viel Spaß beim Anschauen!"
    }
]

def insert_post(html_post):
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if MARKER in line:
            lines.insert(i + 1, "\n\n" + html_post + "\n")
            break

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.writelines(lines)

def check_channel(channel):
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel['id']}"
    feed = feedparser.parse(feed_url)
    if not feed.entries:
        return

    latest = feed.entries[0]
    video_id = latest.yt_videoid
    title = latest.title
    link = latest.link

    last_file = os.path.join(LAST_DIR, f"{channel['id']}.txt")
    last_id = ""
    if os.path.exists(last_file):
        with open(last_file, "r") as f:
            last_id = f.read().strip()
    if video_id == last_id:
        return

    thumbnail = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
    date = datetime.now().strftime("%d.%m.%Y")

    html_post = f'''
<div class="post" data-categories="{AUTO_CATEGORIES}">
    <img src="{thumbnail}" alt="{channel['name']}">
    <h2>Neues Video von {channel['name']}!</h2>
    <p>
        {channel['name']} hat ein neues Video: „{title}“ hochgeladen!
        <a href="{link}" target="_blank">Hier ansehen</a>.
        {channel['endtext']}
    </p>
    <div style="display:flex">
        <div class="toggle-box">&#9829;</div>
        <div style="margin-left:20px;"><p>{date}</p></div>
    </div>
</div>
'''
    insert_post(html_post)

    with open(last_file, "w") as f:
        f.write(video_id)

    print(f"[+] Neuer Post für {channel['name']}")

if __name__ == "__main__":
    for channel in CHANNELS:
        check_channel(channel)

