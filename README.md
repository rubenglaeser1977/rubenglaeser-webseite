# ruben gläser/ – Portfolio

> Ausführliche Schritt-für-Schritt-Anleitung (Veröffentlichen, E-Mail, Apps, Inhalte): siehe **ANLEITUNG.md**.

Statische Website (HTML, CSS, JavaScript) ohne Build-Schritt. Gehostet über GitHub und Netlify.

## Struktur

```
index.html          Startseite (Hero, Bereiche, Über mich, Kontakt)
grafik.html         Grafik-Arbeiten mit Filter und Detailansicht
fotografie.html     Foto-Galerie mit Großansicht
web-apps.html       Übersicht der Web-Apps
app.html            App-Player: app.html?id=<id> bettet eine App ein
impressum.html      Vorlage – bitte ausfüllen
datenschutz.html    Vorlage – bitte prüfen
404.html            Fehlerseite

content/            HIER pflegst du die Inhalte
  site.js           E-Mail, Social-Media-Links
  grafik.js         Grafik-Projekte
  fotografie.js     Fotos
  web-apps.js       Web-Apps

apps/               Eigene Web-Apps (je ein Ordner mit index.html)
assets/img/         Bilder (grafik/, fotografie/, apps/)
assets/fonts/       Gemunu Libre, lokal gehostet (DSGVO)
assets/img/logo.svg Logo als Vektor (auch logo-weiss.svg)
netlify.toml        Netlify-Einstellungen
```

## Inhalte ergänzen

1. Bild nach `assets/img/grafik/` bzw. `assets/img/fotografie/` legen (JPG oder WebP, lange Kante ca. 2000 px).
2. In `content/grafik.js` oder `content/fotografie.js` den Pfad bei `bild:` eintragen und Titel/Text anpassen.
3. Solange `bild` leer ist, zeigt die Seite einen Platzhalter im Markenstil.

Kategorien bzw. Serien werden automatisch zu Filtern.

## Web-App hinzufügen

- Eigene App: Ordner nach `apps/mein-projekt/` kopieren (braucht eine `index.html`).
  Bei Vite/React vorher bauen und den Inhalt von `dist/` kopieren. Wichtig: relative Pfade
  verwenden (in Vite: `base: "./"`).
- Externe App: einfach die vollständige URL eintragen. Die App muss Einbetten erlauben
  (kein `X-Frame-Options: DENY`). Sonst funktioniert nur „Neuer Tab".
- Eintrag in `content/web-apps.js` ergänzen. Aufruf danach über `app.html?id=mein-projekt`.

Optional: Apps können auf das Hell/Dunkel-Design der Hauptseite reagieren:

```js
addEventListener("message", (e) => {
  if (e.data?.type === "theme") document.documentElement.dataset.theme = e.data.theme;
});
```

## Veröffentlichen mit GitHub + Netlify

1. Neues Repository auf GitHub anlegen (z. B. `rubenglaeser-website`) und diesen Ordner hochladen:
   ```bash
   git init
   git add .
   git commit -m "Erste Version"
   git branch -M main
   git remote add origin https://github.com/<benutzername>/rubenglaeser-website.git
   git push -u origin main
   ```
   Alternativ: Auf GitHub „Add file → Upload files" und alle Dateien hineinziehen.
2. Bei [Netlify](https://app.netlify.com) „Add new site → Import an existing project → GitHub" wählen und das Repository auswählen.
3. Build-Einstellungen leer lassen (Build command leer, Publish directory `.`) – steht bereits in `netlify.toml`.
4. „Deploy" klicken. Ab jetzt wird jede Änderung auf GitHub automatisch veröffentlicht.

## Eigene Domain (später)

In Netlify unter „Domain management → Add a domain" die Domain eintragen. Beim Domain-Anbieter dann:

| Typ   | Name | Wert                          |
| ----- | ---- | ----------------------------- |
| A     | @    | `75.2.60.5` (Netlify Load Balancer) |
| CNAME | www  | `<deine-seite>.netlify.app`   |

Die aktuell gültigen Werte zeigt Netlify bei der Domain-Einrichtung an – diese haben Vorrang. HTTPS (Let's Encrypt) aktiviert Netlify automatisch.

## Vor dem Livegang

- [ ] `content/site.js`: E-Mail und Social-Links eintragen
- [ ] `impressum.html` und `datenschutz.html` prüfen
- [ ] Erste Grafiken und Fotos eintragen
- [ ] Beispiel-Apps behalten oder durch eigene ersetzen

## Styleguide

Laut „kreativbergwerk Master 2026“:

- Indigo `#312783` (C100 M100 Y0 K0)
- Magenta `#E6007E` (C0 M100 Y0 K0)
- Hellblau `#ACDDF9` (C36 M0 Y0 K0)
- Schrift: Gemunu Libre – ExtraBold für Headlines, Regular für Text
