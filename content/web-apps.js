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
