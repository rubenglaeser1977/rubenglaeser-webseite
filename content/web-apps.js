/* =========================================================
   WEB-APPS
   Jede App erscheint auf web-apps.html und kann über
   app.html?id=<id> direkt auf der Seite ausprobiert werden.

   - id:       kurzer, eindeutiger Name ohne Leerzeichen
   - url:      entweder eine App in diesem Repository
               (Ordner unter /apps, z. B. "apps/farbwandler/")
               oder eine externe Adresse (z. B. "https://meine-app.netlify.app")
               Externe Apps lassen sich nur einbetten, wenn sie das erlauben
               (kein "X-Frame-Options: DENY"). Sonst: Button "Neuer Tab".
   - vorschau: optionales Vorschaubild, z. B. "assets/img/apps/farbwandler.jpg"
   - status:   z. B. "Live", "Beta", "Prototyp"
   ========================================================= */
window.WEBAPPS = [
  {
    id: "zeitreise",
    titel: "Zeitreise",
    kurz: "Was war an diesem Tag? Nummer-eins-Hit, Ereignisse und Geburtstage zu jedem Datum.",
    beschreibung: "Datum wählen und auf Zeitreise gehen: Die App zeigt, wie viele Tage seitdem vergangen sind, den Nummer-eins-Hit der Woche sowie Ereignisse und Geburtstage – live aus Wikipedia.",
    url: "apps/zeitreise/",
    vorschau: "assets/img/apps/zeitreise.jpg",
    status: "Live",
    tags: ["Geschichte", "Musik", "Wikipedia"],
    jahr: "2026"
  },
  {
    id: "zeitwerk",
    titel: "Zeitwerk",
    kurz: "Zeittracker für Projekte und Aufgaben – mit Tages- und Wochenübersicht.",
    beschreibung: "Projekte anlegen, Timer starten, fertig: Zeitwerk protokolliert die Arbeitszeit pro Projekt und Aufgabe, zeigt Heute, Woche und Gesamt und exportiert alles als CSV. Die Daten bleiben im eigenen Browser.",
    url: "apps/zeitwerk/",
    vorschau: "assets/img/apps/zeitwerk.jpg",
    status: "Live",
    tags: ["Produktivität", "Zeiterfassung", "CSV"],
    jahr: "2026"
  },
  {
    id: "pomodoro",
    titel: "Pomodoro Timer",
    kurz: "Konzentriert arbeiten in Phasen – nach Dauer oder bis zu einer Zielzeit.",
    beschreibung: "Arbeitsphasen und Pausen frei einstellen oder eine Zielzeit vorgeben: Der Timer plant die Phasen, zeigt den Ablauf und meldet sich mit Tönen. Läuft auch als App auf dem Handy.",
    url: "apps/pomodoro/",
    vorschau: "assets/img/apps/pomodoro.jpg",
    status: "Live",
    tags: ["Produktivität", "Timer", "Fokus"],
    jahr: "2026"
  },
  {
    id: "farbwandler",
    titel: "Farbwandler",
    kurz: "CMYK, RGB und HEX umrechnen – mit Kontrastprüfung für Text auf Farbe.",
    beschreibung: "Werkzeug für den Alltag zwischen Druck und Web: CMYK-Werte eingeben, HEX/RGB kopieren und direkt prüfen, ob weiße oder dunkle Schrift auf der Farbe lesbar ist.",
    url: "apps/farbwandler/",
    vorschau: "",
    status: "Live",
    tags: ["Design", "Print", "Werkzeug"],
    jahr: "2026"
  },
  {
    id: "zeichenzaehler",
    titel: "Zeichenzähler",
    kurz: "Texte für Instagram, LinkedIn und Google Ads gegen die Zeichengrenzen prüfen.",
    beschreibung: "Ein Text, alle Kanäle: zeigt live, ob Caption, Post, Anzeigentitel und Beschreibung in die jeweiligen Zeichenlimits passen.",
    url: "apps/zeichenzaehler/",
    vorschau: "",
    status: "Beta",
    tags: ["Social Media", "Ads", "Text"],
    jahr: "2026"
  }
];
