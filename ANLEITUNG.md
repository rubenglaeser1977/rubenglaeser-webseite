# Komplettanleitung rubenglaeser.de

Website veröffentlichen, E-Mail einrichten, Web-Apps und Inhalte pflegen – Schritt für Schritt.

Stand: Oktober 2026 · Domain: **rubenglaeser.de** (netcup) · Hosting: **GitHub + Netlify** · E-Mail: **iCloud+ / Outlook**

---

## Überblick

| Was | Wofür | Kosten |
|---|---|---|
| **GitHub** | Speichert den Code deiner Website (Versionsverwaltung) | kostenlos |
| **Netlify** | Veröffentlicht die Website aus GitHub, inkl. HTTPS-Zertifikat | Free-Plan reicht für ein Portfolio in der Regel aus |
| **netcup** | Deine Domain und die DNS-Einträge („Wegweiser“ im Internet) | bereits bezahlt |
| **iCloud+** | Postfach info@rubenglaeser.de, nutzbar in Apple Mail und Outlook | ab 0,99 € / Monat (50 GB), eigene Domain ohne Aufpreis[^icloud-preis] |

So hängt alles zusammen:

```
Du änderst Dateien  →  GitHub speichert sie  →  Netlify veröffentlicht automatisch
                                                       ↑
Besucher tippt rubenglaeser.de  →  netcup-DNS zeigt auf Netlify
E-Mail an info@rubenglaeser.de  →  netcup-DNS (MX) zeigt auf iCloud  →  Mail / Outlook
```

<div class="tip"><strong>Reihenfolge-Tipp:</strong> Erst Teil 1 komplett abschließen (Website online), dann Teil 2 (E-Mail). Beide Teile ändern DNS-Einträge bei netcup, stören sich aber nicht gegenseitig.</div>

Am Ende der Anleitung findest du im **Anhang A** eine Übersicht aller DNS-Einträge auf einen Blick.

---

## Teil 1 – Website mit GitHub und Netlify veröffentlichen

### Schritt 1.1 – GitHub-Konto anlegen

1. Öffne [github.com/signup](https://github.com/signup) und registriere dich mit deiner E-Mail-Adresse.
2. Wähle einen Benutzernamen, z. B. `rubenglaeser`.
3. Bestätige die E-Mail und richte die **Zwei-Faktor-Authentifizierung** ein (Profilbild → *Settings* → *Password and authentication*).

### Schritt 1.2 – GitHub Desktop installieren (empfohlen)

Mit der kostenlosen App **GitHub Desktop** lädst du Änderungen später mit zwei Klicks hoch – ohne Kommandozeile.

1. Lade GitHub Desktop für macOS herunter: [desktop.github.com](https://desktop.github.com).
2. Starte die App und melde dich mit deinem GitHub-Konto an (*Sign in to GitHub.com*).

<div class="tip"><strong>Zum Bearbeiten der Dateien</strong> empfehle ich zusätzlich den kostenlosen Editor <strong>Visual Studio Code</strong> (<a href="https://code.visualstudio.com">code.visualstudio.com</a>). Er färbt den Code ein und zeigt Tippfehler an. TextEdit funktioniert zur Not auch – dann aber unter <em>Format → In reinen Text umwandeln</em>.</div>

### Schritt 1.3 – Projekt als Repository anlegen und hochladen

1. Entpacke `rubenglaeser-website.zip`. Du erhältst den Ordner **rubenglaeser**.
2. Verschiebe den Ordner an einen festen Ort, z. B. `Dokumente/Websites/rubenglaeser`.
3. In GitHub Desktop: **File → Add Local Repository…** → Ordner auswählen.
4. Die App meldet „This directory does not appear to be a Git repository“. Klicke auf **create a repository**.
    - Name: `rubenglaeser-website`
    - Git ignore / License: *None*
    - **Create Repository**
5. Klicke oben auf **Publish repository**.
    - Haken bei *Keep this code private* darfst du setzen – Netlify funktioniert auch mit privaten Repositories.
    - **Publish Repository**

Fertig: Dein Code liegt jetzt unter `github.com/<benutzername>/rubenglaeser-website`.

<div class="alt"><strong>Alternative ohne App:</strong> Auf github.com oben rechts <em>+ → New repository</em>, Name <code>rubenglaeser-website</code>, <em>Create repository</em>. Dann auf <em>uploading an existing file</em> klicken und den <strong>Inhalt</strong> des Ordners rubenglaeser (nicht den Ordner selbst) ins Browserfenster ziehen → <em>Commit changes</em>. Versteckte Dateien wie <code>.gitignore</code> zeigt der Finder mit <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>.</kbd> an.</div>

### Schritt 1.4 – Netlify-Konto anlegen und Projekt importieren

1. Öffne [app.netlify.com/signup](https://app.netlify.com/signup) und wähle **Sign up with GitHub**. So sind beide Konten direkt verbunden.
2. Im Dashboard: **Add new project → Import an existing project**.[^nl-import]
3. Wähle **GitHub** und erlaube Netlify den Zugriff (*Authorize*). Bei der Frage nach den Repositories kannst du *Only select repositories* → `rubenglaeser-website` wählen.
4. Wähle das Repository `rubenglaeser-website`.
5. Einstellungen prüfen – alles kann so bleiben, weil die Datei `netlify.toml` die Werte vorgibt:

| Feld | Wert |
|---|---|
| Branch to deploy | `main` |
| Build command | *leer lassen* |
| Publish directory | `.` (Punkt) oder leer |

6. Klicke auf **Deploy** bzw. **Publish**. Nach etwa einer Minute ist die Seite unter einer Zufallsadresse wie `fancy-name-123.netlify.app` erreichbar.

### Schritt 1.5 – Projektnamen festlegen

1. Im Projekt: **Project configuration → General → Project details → Change project name**.
2. Trage `rubenglaeser` ein → **Save**.
3. Deine Netlify-Adresse lautet nun `rubenglaeser.netlify.app`. Ist der Name vergeben, nimm z. B. `rubenglaeser-de`. **Diesen Namen brauchst du gleich für den DNS-Eintrag.**

### Schritt 1.6 – Projekt öffentlich schalten (wichtig)

Neue Netlify-Teams im Free-, Personal- oder Pro-Plan sind seit Juli 2026 standardmäßig **privat** – Besucher sähen sonst eine Anmeldeseite.[^nl-privat]

- Klicke im Projekt auf **Make public**, **oder**
- **Project configuration → General → Visitor access → Project visibility** → **public** → **Save**.[^nl-visibility]

### Schritt 1.7 – Domain in Netlify hinzufügen

1. Im Projekt links: **Domain management → Production domains → Add a domain**.
2. Wähle **Add a domain you already own** und gib `rubenglaeser.de` ein → **Verify** → **Add domain**.
3. Netlify fügt automatisch auch `www.rubenglaeser.de` hinzu.[^nl-extdns]
4. Bei der Frage nach dem DNS wählst du **externes DNS** (*Use a third-party external DNS provider*) – deine DNS bleibt bei netcup.
5. Neben der Domain steht jetzt **Pending DNS verification**. Klicke darauf: Netlify zeigt dir die passenden Werte an. Sie entsprechen der Tabelle in Schritt 1.8.

### Schritt 1.8 – DNS bei netcup eintragen

1. Melde dich im **Customer Control Panel (CCP)** an: [customercontrolpanel.de](https://www.customercontrolpanel.de).
2. Menü **Domains** → bei `rubenglaeser.de` auf das **Lupen-Symbol** klicken.
3. Registerkarte **DNS** öffnen. Bei neu registrierten Domains heißt sie **CloudDNS**.[^netcup-cloud]
4. **Alte Einträge entfernen**, die die Website betreffen:
    - A-Einträge mit Host `@` (Standard-Parkseite von netcup)
    - **AAAA-Einträge** mit Host `@` oder `www` – falls vorhanden, unbedingt löschen
    - A- oder CNAME-Einträge mit Host `www`
    - MX-Einträge **jetzt noch nicht anfassen** (kommt in Teil 2)
5. **Neue Einträge anlegen:**

| Host | Typ | Ziel (Destination) |
|---|---|---|
| `@` | **A** | `75.2.60.5` |
| `www` | **CNAME** | `rubenglaeser.netlify.app` |

6. Speichern: **DNS Records speichern** bzw. bei CloudDNS **Änderungen anwenden**. Ein grüner Kasten bestätigt die Eingabe, die Übernahme dauert bei netcup meist ca. 10 Minuten.[^netcup-dns]

<div class="warn"><strong>Hinweise:</strong> netcup unterstützt für die Hauptdomain keinen CNAME – deshalb der A-Eintrag auf die Netlify-IP <code>75.2.60.5</code>.[^nl-extdns] Ein CNAME für <code>www</code> geht nur, wenn für <code>www</code> kein anderer Eintrag existiert.[^netcup-dns] Meckert netcup beim CNAME-Ziel, trage es mit Punkt am Ende ein: <code>rubenglaeser.netlify.app.</code></div>

### Schritt 1.9 – HTTPS und Hauptdomain

1. Zurück in Netlify unter **Domain management**: Sobald die DNS-Einträge greifen, verschwindet *Pending DNS verification*. Das kann einige Minuten, in seltenen Fällen bis zu 24 Stunden dauern.[^nl-extdns]
2. Weiter unten im Bereich **HTTPS** stellt Netlify automatisch ein kostenloses Let's-Encrypt-Zertifikat aus. Falls nicht: **Verify DNS configuration** und danach **Provision certificate** klicken.
3. Stelle sicher, dass `rubenglaeser.de` die **Primary domain** ist (Menü *Options* neben der Domain → *Set as primary domain*). `www.rubenglaeser.de` leitet dann automatisch auf `rubenglaeser.de` weiter.

### Schritt 1.10 – Testen

- Öffne `https://rubenglaeser.de` und `https://www.rubenglaeser.de` – beide sollten deine Seite mit Schloss-Symbol zeigen.
- Ob die DNS weltweit angekommen ist, prüfst du auf [dnschecker.org](https://dnschecker.org) (Typ A für `rubenglaeser.de`, Typ CNAME für `www.rubenglaeser.de`).

<div class="tip"><strong>Ab jetzt gilt:</strong> Jede Änderung, die du zu GitHub hochlädst, veröffentlicht Netlify automatisch in ca. 30–60 Sekunden. Unter <em>Deploys</em> siehst du jede Version und kannst eine ältere mit <em>Publish deploy</em> jederzeit wiederherstellen.</div>

---

## Teil 2 – E-Mail info@rubenglaeser.de mit iCloud+

### Welche Lösung?

**Microsoft 365 Single reicht dafür leider nicht:** Seit dem 30.11.2023 können Abonnenten von Microsoft 365 Single/Personal und Family keine neuen Adressen mit eigener Domain mehr in Outlook.com anlegen.[^ms-personal] Eine Microsoft-Lösung ginge nur mit einem zusätzlichen Business-Abo.

**Einfacher und günstiger ist iCloud+:** Du hast schon einen Apple Account. Mit iCloud+ kannst du deine eigene Domain kostenlos dazunehmen. iCloud+ gibt es ab 0,99 € im Monat für 50 GB.[^icloud-preis] Wenn du schon mehr iCloud-Speicher gebucht hast, ist iCloud+ bereits enthalten.

| Was | Details |
|---|---|
| Voraussetzungen | iCloud+-Abo, Zwei-Faktor-Authentifizierung, eine iCloud-Mail-Adresse (@icloud.com) als Hauptadresse[^icloud-add] |
| Adressen | bis zu 3 aktive Adressen pro Person und Domain, z. B. `info@`, `ruben@` und `kontakt@`[^icloud-add] |
| Nutzung | Mail auf Mac, iPhone und iCloud.com – **und weiter in Outlook**, das in deinem Microsoft 365 Single enthalten ist |
| Kosten | keine Zusatzkosten zum iCloud+-Abo |

<div class="tip"><strong>Gut zu wissen:</strong> Dein Outlook bleibt dein Mailprogramm. Das Postfach liegt bei Apple, gelesen und geschrieben wird in Outlook (oder Apple Mail). Microsoft 365 Single brauchst du dafür nicht zu ändern.</div>

### Schritt 2.1 – iCloud+ prüfen oder buchen

1. iPhone: **Einstellungen → [dein Name] → iCloud**. Steht dort *iCloud+*, bist du fertig.
2. Falls nicht: **iCloud-Speicher verwalten / Upgrade auf iCloud+** → 50 GB wählen.
3. Prüfe unter **Einstellungen → [dein Name] → Anmelden und Sicherheit**, ob die **Zwei-Faktor-Authentifizierung** aktiv ist.

### Schritt 2.2 – Domain bei iCloud hinzufügen

1. Am Mac im Browser [icloud.com/icloudplus](https://www.icloud.com/icloudplus) öffnen und anmelden.
2. **Eigene E-Mail-Domain** → **Eine Domain hinzufügen, die du besitzt**.[^icloud-add]
3. **Nur du** wählen → `rubenglaeser.de` eingeben → **Fortfahren**.
4. Frage nach vorhandenen Adressen: **Keine E-Mail-Adressen** wählen (die Domain ist neu).
5. Bei *Einträge deines Domain-Registrars aktualisieren* auf **Anzeigen** klicken. Apple zeigt dir jetzt alle Einträge, darunter deinen **persönlichen TXT-Eintrag** (`apple-domain=…`). Lass das Fenster offen.

### Schritt 2.3 – E-Mail-DNS-Einträge bei netcup setzen

1. netcup **CCP → Domains → Lupe bei rubenglaeser.de → DNS** bzw. **CloudDNS**.
2. **Alle vorhandenen MX-Einträge löschen** (netcup legt oft eigene an) und einen eventuell vorhandenen alten SPF-Eintrag (`v=spf1 …`) entfernen. Es darf nur **einen** SPF-Eintrag geben.[^icloud-dns]
3. Diese Einträge anlegen (Werte immer mit der Anzeige bei iCloud abgleichen):

| Host | Typ | Priorität | Ziel |
|---|---|---|---|
| `@` | **MX** | `10` | `mx01.mail.icloud.com.` |
| `@` | **MX** | `10` | `mx02.mail.icloud.com.` |
| `@` | **TXT** | – | `apple-domain=…` *(dein persönlicher Wert von iCloud)* |
| `@` | **TXT** | – | `v=spf1 include:icloud.com ~all` |
| `sig1._domainkey` | **CNAME** | – | `sig1.dkim.rubenglaeser.de.at.icloudmailadmin.com.` |
| `_dmarc` | **TXT** | – | `v=DMARC1; p=none; rua=mailto:info@rubenglaeser.de` |

4. **Änderungen anwenden** / speichern. Die MX- und CNAME-Werte stammen direkt von Apple.[^icloud-dns] Lehnt netcup den Punkt am Ende oder die Anführungszeichen ab, lass sie weg. Bei TTL `3600` eintragen, falls gefragt.[^icloud-dns]

<div class="warn"><strong>Wichtig:</strong> Den A-Eintrag <code>@ → 75.2.60.5</code> und den CNAME <code>www</code> aus Teil 1 <strong>nicht löschen</strong> – sie gehören zur Website. E-Mail (MX) und Website (A/CNAME) laufen unabhängig voneinander.</div>

5. Ca. 10–30 Minuten warten, dann bei iCloud **Bestätigen** (*Verify*) klicken. Klappt es nicht sofort, später noch einmal versuchen. Den Status siehst du jederzeit unter icloud.com/icloudplus → **Eigene E-Mail-Domain → Verwalten**.[^icloud-dns]

### Schritt 2.4 – Adresse info@rubenglaeser.de anlegen

1. Bei iCloud **Einrichtung abschließen** und den Anweisungen folgen.
2. Neue Adresse **info@rubenglaeser.de** anlegen. Optional bis zu zwei weitere, z. B. `ruben@rubenglaeser.de`.
3. Als **Standardadresse zum Senden** `info@rubenglaeser.de` wählen. Das kannst du später in den Mail-Einstellungen auf iCloud.com ändern.[^icloud-add]

<div class="alt"><strong>Hinweis:</strong> Eine Adresse mit eigener Domain kann nicht als Anmeldename für einen Apple Account verwendet werden. Du meldest dich weiter mit deinem bisherigen Apple Account an.[^icloud-add]</div>

### Schritt 2.5 – Mail auf Mac, iPhone und im Web

**Apple Mail (Mac und iPhone):** Funktioniert automatisch, sobald *Mail* in den iCloud-Einstellungen aktiv ist.[^icloud-use] Beim Schreiben im Feld **Von** `info@rubenglaeser.de` auswählen.

**Im Browser:** [icloud.com/mail](https://www.icloud.com/mail).

**Outlook (Mac und iPhone)** – Outlook braucht ein **app-spezifisches Passwort**:[^ms-icloud]

1. [account.apple.com](https://account.apple.com) → **Anmelden und Sicherheit → App-spezifische Passwörter → App-spezifisches Passwort erstellen**, Name z. B. „Outlook“.[^apple-asp]
2. Das Passwort (Format `xxxx-xxxx-xxxx-xxxx`) kopieren.
3. Outlook für Mac: **Outlook → Einstellungen → Konten → + → Neues Konto**. Outlook-App auf dem iPhone: **Konto hinzufügen**.
4. Deine **@icloud.com-Adresse** eingeben (nicht info@ – das Konto ist dein iCloud-Postfach) und das app-spezifische Passwort einfügen.
5. Damit Outlook mit info@ sendet: in den Kontoeinstellungen bei **Absender / Von** bzw. **Alias** `info@rubenglaeser.de` hinzufügen und beim Schreiben auswählen.

### Schritt 2.6 – Testen

1. Schicke von einer anderen Adresse (z. B. Gmail oder dienstlich) eine Mail an `info@rubenglaeser.de` und antworte darauf.
2. Prüfe die Einträge auf [mxtoolbox.com](https://mxtoolbox.com) → *MX Lookup* `rubenglaeser.de` – dort sollten `mx01.mail.icloud.com` und `mx02.mail.icloud.com` stehen.
3. Die Website verlinkt bereits auf `info@rubenglaeser.de` (Kontakt, Impressum, Datenschutz).

---

## Teil 3 – Programmierte Web-Apps einpflegen

Auf der Seite **Web-Apps** werden alle Apps aus der Datei `content/web-apps.js` angezeigt. Mit **Ausprobieren** öffnet sich die App im App-Player (`app.html?id=…`) – mit Desktop-, Tablet- und Mobil-Ansicht, Fokus-Modus und „Neuer Tab“.

### Drei Arten von Apps

| Art | Beispiel | Was du tust |
|---|---|---|
| **A – Einfache App** | Ordner mit `index.html` (+ CSS/JS), z. B. von Perplexity Computer erstellt | Ordner nach `apps/` kopieren |
| **B – Gebaute App** | React/Vite-Projekt | erst bauen, dann den Inhalt von `dist/` nach `apps/` kopieren |
| **C – Externe App** | läuft schon woanders, z. B. `https://meine-app.netlify.app` | nur die Adresse eintragen |

### Schritt 3.1 – App-Dateien ablegen (Art A und B)

1. Lege im Projektordner unter `apps/` einen neuen Ordner an, z. B. `apps/eventplaner/`. Nur Kleinbuchstaben, Bindestriche, keine Umlaute und Leerzeichen.
2. Kopiere die App-Dateien hinein. Ganz wichtig: Die Startdatei muss **`index.html`** heißen.
3. **Nur bei Art B (Vite/React):** In `vite.config.js` `base: "./"` setzen, dann `npm run build` und den **Inhalt** von `dist/` in den Ordner kopieren.

Die Struktur sieht dann so aus:

```
apps/
  farbwandler/
    index.html
  zeichenzaehler/
    index.html
  eventplaner/        ← neu
    index.html
    style.css
    app.js
```

### Schritt 3.2 – App in der Liste eintragen

Öffne `content/web-apps.js` und füge innerhalb der eckigen Klammern `[ … ]` einen neuen Block hinzu. Kopiere am einfachsten einen bestehenden Block und passe ihn an:

```js
  {
    id: "eventplaner",              // eindeutiger Kurzname
    titel: "Eventplaner",
    kurz: "Ablaufpläne für Veranstaltungen in Minuten erstellen.",
    url: "apps/eventplaner/",       // Art C: "https://…"
    vorschau: "assets/img/apps/eventplaner.jpg",   // optional
    status: "Beta",                 // Live, Beta, Prototyp
    tags: ["Events", "Planung"],
    jahr: "2026"
  },
```

<div class="warn"><strong>Die drei häufigsten Fehler:</strong> 1. Komma zwischen zwei Blöcken vergessen (<code>},</code>). 2. Anführungszeichen nicht geschlossen. 3. Typografische Anführungszeichen („ “) statt gerader (<code>" "</code>) – passiert gern in Word oder TextEdit. Wenn plötzlich gar keine App mehr angezeigt wird, liegt es fast immer daran.</div>

### Schritt 3.3 – Vorschaubild (optional)

- Format **16 : 9**, z. B. 1600 × 900 px, als JPG oder WebP.
- Ablegen unter `assets/img/apps/` und bei `vorschau:` eintragen.
- Ohne Bild erscheint automatisch eine Kachel im Markenstil mit den Initialen der App.

<div class="tip"><strong>Hell/Dunkel übernehmen:</strong> Apps können auf den Design-Schalter der Website reagieren. Dazu in der App einfügen:<br><code>addEventListener("message", e =&gt; { if (e.data?.type === "theme") document.documentElement.dataset.theme = e.data.theme; });</code></div>

### Schritt 3.4 – Hochladen und testen

1. GitHub Desktop öffnen: links siehst du alle geänderten Dateien.
2. Unten links eine kurze Beschreibung eintragen, z. B. `App Eventplaner hinzugefügt` → **Commit to main**.
3. Oben **Push origin** klicken.
4. Nach ca. einer Minute: `https://rubenglaeser.de/web-apps` öffnen → **Ausprobieren**.

### Fehlerbehebung Apps

| Problem | Ursache und Lösung |
|---|---|
| App zeigt eine weiße Fläche | Die App nutzt absolute Pfade wie `/assets/app.js`. Ändern in relative Pfade `./assets/app.js` (bei Vite: `base: "./"`). |
| Externe App: „Verbindung abgelehnt“ | Die fremde Seite verbietet das Einbetten (`X-Frame-Options` bzw. `frame-ancestors`). Bei eigenen Netlify-Apps in deren `netlify.toml` erlauben: `Content-Security-Policy = "frame-ancestors 'self' https://rubenglaeser.de"`. Sonst bleibt nur „Neuer Tab“. |
| App braucht Login, Datenbank oder geheime API-Schlüssel | Geht in einer statischen Website nicht sicher. Solche Apps separat hosten (z. B. eigenes Netlify-Projekt mit Functions) und als Art C einbinden. |

---

## Teil 4 – Inhalte auf den Unterseiten pflegen

Alle Inhalte stehen in einfachen Textdateien im Ordner **`content/`**. Bilder liegen in **`assets/img/`**. Du musst kein HTML anfassen.

| Datei | Steuert |
|---|---|
| `content/site.js` | E-Mail-Adresse, Social-Media-Links (Footer) |
| `content/grafik.js` | Seite **Grafik** – Kacheln, Filter, Detailansicht. `freigestellt: true` für Motive ohne Hintergrund, `link` für einen Button (z. B. zu Videos) |
| `content/fotografie.js` | Seite **Fotografie** – Galerie, Filter, Großansicht |
| `content/web-apps.js` | Seite **Web-Apps** (siehe Teil 3) |
| `index.html` | Texte der Startseite (Hero, Über mich kurz, Kontakt) |
| `ueber-mich.html` | Seite **Über mich** – Intro, Schwerpunkte, Projekte, Werkzeuge |
| `impressum.html`, `datenschutz.html` | Rechtstexte |

### Schritt 4.1 – Bilder vorbereiten (Lightroom)

Exporteinstellungen in Lightroom (**Datei → Exportieren**):

| Einstellung | Grafik | Fotografie |
|---|---|---|
| Format | JPEG | JPEG |
| Farbraum | sRGB | sRGB |
| Qualität | 80 | 75–80 |
| Größe (lange Kante) | 1600–2000 px | 2000 px |
| Metadaten | Nur Copyright | Nur Copyright (entfernt GPS-Daten) |
| Ziel-Dateigröße | möglichst unter 500 KB | möglichst unter 600 KB |

**Dateinamen:** nur Kleinbuchstaben, Zahlen und Bindestriche – keine Leerzeichen, Umlaute oder ß. Beispiel: `plakat-ausbildung-2026.jpg`, `radio-kampagne-01.jpg`, `portrait-dresden-03.jpg`.

Grafiken für die Kacheln wirken am besten im Format **4 : 3** (z. B. 1600 × 1200 px). Fotos dürfen jedes Format haben – die Galerie passt sich an.

### Schritt 4.2 – Grafik-Projekt hinzufügen

1. Bild in den Ordner `assets/img/grafik/` kopieren.
2. `content/grafik.js` öffnen und einen Block anlegen bzw. einen Platzhalter-Block überschreiben:

```js
  {
    titel: "Imagekampagne Radio Dresden",
    kategorie: "Kampagne",          // wird automatisch zum Filter
    jahr: "2019",
    bild: "assets/img/grafik/radio-kampagne-01.jpg",
    alt: "Plakatmotiv mit Moderatorin am Mikrofon",  // Bildbeschreibung
    kunde: "Radio Beispiel",
    leistung: "Konzept, Gestaltung, Druckvorstufe",
    beschreibung: "Ziel, Zielgruppe und Idee in zwei, drei Sätzen."
  },
```

3. Die **Reihenfolge** in der Datei ist die Reihenfolge auf der Seite – Neues am besten nach oben.
4. **Platzhalter entfernen:** Die Beispiel-Blöcke („Projekttitel …“) einfach komplett löschen – inklusive `{` bis `},`.

<div class="tip"><strong>Ältere Projekte und Branchen:</strong> Mit <code>kategorie</code> sortierst du nach Art der Arbeit (Plakat, Kampagne, Corporate Design …). Die Branche (Radio, Touristik, Logistik, Gesundheit) schreibst du am besten in <code>kunde</code> oder <code>beschreibung</code>. So bleiben die Filter übersichtlich.</div>

### Schritt 4.3 – Foto hinzufügen

1. Foto in `assets/img/fotografie/` kopieren.
2. In `content/fotografie.js` einen Block ergänzen:

```js
  {
    titel: "Abendstimmung an der Elbe",
    serie: "Landschaft",            // wird automatisch zum Filter
    ort: "Dresden",
    jahr: "2026",
    bild: "assets/img/fotografie/elbe-abend-01.jpg",
    alt: "Elbufer im Abendlicht mit Altstadtsilhouette",
    kamera: "Kamera / Objektiv (optional)",
    beschreibung: "Optionaler Text für die Großansicht."
  },
```

Das Feld `format` ("hoch", "quer", "quadrat") brauchst du nur für Platzhalter ohne Bild – sobald `bild` gefüllt ist, nimmt die Galerie das echte Seitenverhältnis.

### Schritt 4.4 – Texte, Kontakt und Social Media

- **Social-Media-Links:** In `content/site.js` bei `url:` die Adresse eintragen, z. B. `url: "https://www.linkedin.com/in/…"`. Leere Links werden automatisch ausgeblendet.
- **Startseite:** In `index.html` stehen die Texte direkt lesbar zwischen den Tags, z. B. `<h1>Gesehen und verstanden werden…</h1>` oder im Abschnitt `id="ueber-mich"`. Nur den Text zwischen `>` und `<` ändern.
- **Branchen und Leistungen** (Schlagworte unter „Über mich“): in `index.html` jeweils ein `<li>…</li>` pro Begriff.

### Schritt 4.5 – Änderungen veröffentlichen

**Mit GitHub Desktop (empfohlen):**

1. Dateien im Projektordner ändern und speichern.
2. GitHub Desktop zeigt die Änderungen an → Beschreibung eintragen → **Commit to main** → **Push origin**.
3. Nach ca. einer Minute ist alles online.

**Direkt im Browser (für Kleinigkeiten):**

1. Auf github.com im Repository die Datei öffnen, z. B. `content/grafik.js` → **Stift-Symbol** (*Edit this file*).
2. Ändern → **Commit changes…** → **Commit changes**.
3. Bilder hochladen: in den Ordner `assets/img/grafik` navigieren → **Add file → Upload files** → Bilder hineinziehen → **Commit changes**.

<div class="alt"><strong>Lokal vorschauen:</strong> Du kannst <code>index.html</code> im Projektordner einfach per Doppelklick im Browser öffnen und deine Änderungen prüfen, bevor du sie hochlädst.</div>

### Fehlerbehebung Inhalte

| Problem | Lösung |
|---|---|
| Seite Grafik/Fotografie ist plötzlich leer | Tippfehler in der `.js`-Datei (Komma, Anführungszeichen). In Safari: **Entwickler → JavaScript-Konsole einblenden** zeigt die Zeile mit dem Fehler. (Menü „Entwickler“ aktivieren unter *Safari → Einstellungen → Erweitert*.) |
| Bild wird nicht angezeigt | Pfad und Dateiname prüfen – Groß-/Kleinschreibung zählt: `Bild.JPG` ≠ `bild.jpg`. |
| Änderung ist nicht online | In Netlify unter **Deploys** prüfen, ob der letzte Deploy *Published* ist. Im Browser mit <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> neu laden. |
| Etwas ist kaputt | Netlify → **Deploys** → letzte funktionierende Version anklicken → **Publish deploy**. Damit ist der alte Stand sofort wieder online. |

---

## Anhang A – Alle DNS-Einträge auf einen Blick

| Host | Typ | Priorität | Ziel | Zweck |
|---|---|---|---|---|
| `@` | A | – | `75.2.60.5` | Website (Netlify) |
| `www` | CNAME | – | `rubenglaeser.netlify.app` | Website (Netlify) |
| `@` | MX | 10 | `mx01.mail.icloud.com.` | E-Mail-Empfang |
| `@` | MX | 10 | `mx02.mail.icloud.com.` | E-Mail-Empfang |
| `@` | TXT | – | `apple-domain=…` (von iCloud) | Domain-Bestätigung Apple |
| `@` | TXT | – | `v=spf1 include:icloud.com ~all` | SPF – Absender-Schutz |
| `sig1._domainkey` | CNAME | – | `sig1.dkim.rubenglaeser.de.at.icloudmailadmin.com.` | DKIM |
| `_dmarc` | TXT | – | `v=DMARC1; p=none; rua=mailto:info@rubenglaeser.de` | DMARC |

**Zu löschen:** netcup-Standard-A/AAAA-Einträge für `@` und `www`, alte MX-Einträge, alte SPF-Einträge.

## Anhang B – Checkliste

- [ ] GitHub-Konto + GitHub Desktop
- [ ] Repository `rubenglaeser-website` veröffentlicht
- [ ] Netlify-Projekt importiert, Name `rubenglaeser`
- [ ] Projekt auf **public** gestellt
- [ ] Domain `rubenglaeser.de` in Netlify hinzugefügt
- [ ] netcup: A `@` und CNAME `www` gesetzt, Altes gelöscht
- [ ] HTTPS aktiv, `rubenglaeser.de` ist Primary domain
- [ ] iCloud+ aktiv, Zwei-Faktor-Authentifizierung an
- [ ] Domain bei icloud.com/icloudplus hinzugefügt
- [ ] netcup: alte MX gelöscht, 2 × MX, TXT apple-domain, SPF, DKIM, DMARC gesetzt
- [ ] Domain bei iCloud bestätigt, `info@rubenglaeser.de` als Standardadresse
- [ ] App-spezifisches Passwort erstellt, Outlook auf Mac und iPhone eingerichtet
- [ ] Test-Mail empfangen und beantwortet
- [ ] Impressum und Datenschutz final geprüft
- [ ] Platzhalter in `grafik.js` und `fotografie.js` durch echte Arbeiten ersetzt

## Quellen

[^ms-personal]: Microsoft Support – Personalisierte E-Mail-Adresse in Microsoft 365 (seit 30.11.2023 keine neuen Adressen): <https://support.microsoft.com/en-gb/onedrive/changes-to-microsoft-365-email-features-and-storage>
[^icloud-preis]: Apple – iCloud+ (Preise Deutschland): <https://www.apple.com/de/icloud/>
[^icloud-add]: Apple Support – Eigene Domain bei iCloud Mail hinzufügen: <https://support.apple.com/de-de/guide/icloud/mma473945269/icloud>
[^icloud-dns]: Apple Support – Set up an existing domain with iCloud Mail (DNS-Einträge): <https://support.apple.com/en-us/102374>
[^icloud-use]: Apple Support – Eigene E-Mail-Domain in iCloud Mail verwenden: <https://support.apple.com/de-de/guide/icloud/mm772b937369/icloud>
[^ms-icloud]: Microsoft Support – iCloud-E-Mail-Konto in Outlook hinzufügen: <https://support.microsoft.com/de-de/outlook/getstarted/add-or-manage-an-icloud-email-account-in-outlook>
[^apple-asp]: Apple Support – App-spezifische Passwörter: <https://support.apple.com/de-de/102654>
[^nl-import]: Netlify Docs – Deploy from a repository: <https://docs.netlify.com/start/quickstarts/deploy-from-repository/>
[^nl-extdns]: Netlify Docs – Configure external DNS: <https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/>
[^nl-privat]: Netlify Changelog – Start with private project URLs (28.07.2026): <https://www.netlify.com/changelog/2026-07-28-start-with-private-project-urls/>
[^nl-visibility]: Netlify Docs – Project visibility: <https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/>
[^netcup-dns]: netcup Helpcenter – DNS-Einstellungen: <https://www.netcup.com/de/helpcenter/dokumentation/domain/dns-einstellungen>
[^netcup-cloud]: netcup Helpcenter – DNS-Einstellungen (CloudDNS): <https://www.netcup.com/de/helpcenter/dokumentation/domain/dns-einstellungen-cloud-dns>
