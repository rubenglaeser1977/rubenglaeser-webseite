# Komplettanleitung rubenglaeser.de

Website veröffentlichen, E-Mail einrichten, Web-Apps und Inhalte pflegen – Schritt für Schritt.

Stand: Oktober 2026 · Domain: **rubenglaeser.de** (netcup) · Hosting: **GitHub + Netlify** · E-Mail: **Microsoft 365 / Outlook**

---

## Überblick

| Was | Wofür | Kosten |
|---|---|---|
| **GitHub** | Speichert den Code deiner Website (Versionsverwaltung) | kostenlos |
| **Netlify** | Veröffentlicht die Website aus GitHub, inkl. HTTPS-Zertifikat | Free-Plan reicht für ein Portfolio in der Regel aus |
| **netcup** | Deine Domain und die DNS-Einträge („Wegweiser“ im Internet) | bereits bezahlt |
| **Microsoft 365 Business Basic** | Postfach info@rubenglaeser.de, nutzbar in Outlook | 6,07 € / Monat bei jährlicher Zahlung bzw. 7,28 € bei monatlicher Zahlung, jeweils zzgl. MwSt.[^ms-preis] |

So hängt alles zusammen:

```
Du änderst Dateien  →  GitHub speichert sie  →  Netlify veröffentlicht automatisch
                                                       ↑
Besucher tippt rubenglaeser.de  →  netcup-DNS zeigt auf Netlify
E-Mail an info@rubenglaeser.de  →  netcup-DNS (MX) zeigt auf Microsoft 365  →  Outlook
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

## Teil 2 – E-Mail info@rubenglaeser.de mit Outlook

### Welche Lösung?

Outlook ist das **Programm** – das **Postfach** braucht einen Anbieter. Outlook.com Premium unterstützt seit dem 28.02.2021 keine eigenen Domains mehr.[^ms-premium] Die passende Microsoft-Lösung ist **Microsoft 365 Business Basic**: echtes Exchange-Postfach, Outlook im Web, auf Mac und iPhone, Kalender und Kontakte synchron.

| Tarif | Preis (zzgl. MwSt.) |
|---|---|
| Business Basic – jährliche Zahlung | 6,07 € pro Benutzer / Monat |
| Business Basic – monatliche Zahlung | 7,28 € pro Benutzer / Monat |
| Business Basic EWR (ohne Teams) – jährlich | 4,67 € pro Benutzer / Monat |

Quelle: Microsoft, Stand Oktober 2026.[^ms-preis] Es gibt einen kostenlosen Testmonat; danach verlängert sich das Abo automatisch, falls du nicht kündigst.

<div class="tip"><strong>Spartipp:</strong> Du brauchst nur <strong>eine</strong> Lizenz. Weitere Adressen wie <code>ruben@rubenglaeser.de</code> oder <code>kontakt@rubenglaeser.de</code> legst du kostenlos als <strong>Alias</strong> an – sie landen im selben Postfach.</div>

### Schritt 2.1 – Microsoft 365 Business Basic buchen

1. Öffne [microsoft.com/de-de/microsoft-365/business/microsoft-365-business-basic](https://www.microsoft.com/de-de/microsoft-365/business/microsoft-365-business-basic) → **Kostenlos testen** oder **Jetzt kaufen**.
2. Gib eine bestehende E-Mail-Adresse (z. B. deine iCloud-Adresse) für die Kontoerstellung an und folge dem Assistenten (Firmenname: z. B. „Ruben Gläser“, Adresse: Sickingenstraße 6, 01309 Dresden).
3. Microsoft erzeugt eine Startdomain wie `rubenglaeser.onmicrosoft.com`.[^ms-preis] Wähle als Benutzernamen z. B. `ruben@rubenglaeser.onmicrosoft.com` und ein sicheres Passwort. Das ist dein **Administrator-Konto**.
4. Zahlungsdaten eingeben und abschließen.

### Schritt 2.2 – Domain bei Microsoft hinzufügen und bestätigen

<div class="alt"><strong>Hinweis:</strong> Microsoft benennt Menüpunkte gelegentlich um. Die englischen Bezeichnungen stehen jeweils in Klammern – damit findest du den Punkt auch, wenn der deutsche Text leicht abweicht.</div>

1. Öffne das **Microsoft 365 Admin Center**: [admin.microsoft.com](https://admin.microsoft.com).
2. Links **… Alle anzeigen → Einstellungen → Domänen → + Domäne hinzufügen** (engl. *Show all → Settings → Domains → + Add domain*).[^ms-adddomain]
3. `rubenglaeser.de` eingeben → **Diese Domäne verwenden** (*Use this domain*).
4. Bei *Bestätigen Sie, dass Sie Besitzer der Domäne sind* die Methode **TXT-Eintrag hinzufügen** wählen. Microsoft zeigt einen Wert wie `MS=ms12345678`.
5. Bei netcup (CCP → Domains → Lupe → DNS/CloudDNS) neuen Eintrag anlegen:

| Host | Typ | Ziel |
|---|---|---|
| `@` | **TXT** | `MS=ms12345678` *(deinen Wert aus dem Admin Center kopieren)* |

6. Speichern, ca. 10 Minuten warten, dann im Admin Center **Überprüfen** (*Verify*) klicken. Die Bestätigung kann bis zu 10 Minuten, bei manchen Registraren bis zu 48 Stunden dauern.[^ms-adddomain]

### Schritt 2.3 – Postfach info@rubenglaeser.de anlegen

Mach `info@rubenglaeser.de` zur **Hauptadresse** deines Kontos – dann sendest und empfängst du automatisch mit dieser Adresse.

1. Admin Center → **Benutzer → Aktive Benutzer** → dein Konto (Ruben Gläser) anklicken.
2. Registerkarte **Konto** → **Benutzernamen und E-Mail verwalten**.
3. Bei *Primäre E-Mail-Adresse und Benutzername* auf das Stift-Symbol: Benutzername `info`, Domäne `rubenglaeser.de` → **Fertig** → **Änderungen speichern**.
4. Optional unter **Aliase**: `ruben` @ `rubenglaeser.de` hinzufügen.
5. Melde dich danach neu an – ab jetzt mit **info@rubenglaeser.de**.

<div class="alt"><strong>Lieber ruben@ als Hauptadresse?</strong> Dann setze <code>ruben@rubenglaeser.de</code> als primäre Adresse und <code>info@</code> als Alias. Beides landet im selben Postfach.</div>

### Schritt 2.4 – E-Mail-DNS-Einträge bei netcup setzen

1. Admin Center → **Einstellungen → Domänen** → `rubenglaeser.de` → **DNS-Einträge → DNS verwalten** → **Weiter**.[^ms-dns]
2. Bei *DNS-Einträge hinzufügen* **Exchange und Exchange Online Protection** auswählen. Unter **Erweiterte Optionen** zusätzlich **DomainKeys Identified Mail (DKIM)** anhaken (empfohlen).
3. Klappe **MX-Einträge**, **CNAME-Einträge** und **TXT-Einträge** auf. Microsoft zeigt dir die genauen Werte – **übernimm immer die Werte aus dem Admin Center**.
4. Bei netcup **zuerst alte MX-Einträge löschen** (netcup legt oft eigene an) und einen eventuell vorhandenen alten SPF-Eintrag (`v=spf1 …`) entfernen bzw. ersetzen. Es darf nur **einen** SPF-Eintrag geben.[^ms-dns]
5. Dann diese Einträge anlegen:

| Host | Typ | Priorität | Ziel |
|---|---|---|---|
| `@` | **MX** | `0` (oder `10`) | Wert aus dem Admin Center, meist im Format `rubenglaeser-de.mail.protection.outlook.com` |
| `autodiscover` | **CNAME** | – | `autodiscover.outlook.com`[^ms-autodiscover] |
| `@` | **TXT** | – | `v=spf1 include:spf.protection.outlook.com -all`[^ms-dns] |
| `selector1._domainkey` | **CNAME** | – | erster DKIM-Wert aus dem Admin Center |
| `selector2._domainkey` | **CNAME** | – | zweiter DKIM-Wert aus dem Admin Center |
| `_dmarc` | **TXT** | – | `v=DMARC1; p=none; rua=mailto:info@rubenglaeser.de` |

6. Speichern, ca. 10–30 Minuten warten, im Admin Center **Weiter / Überprüfen** klicken. Bei Erfolg erscheint **Die Domäneneinrichtung ist abgeschlossen** → **Fertig**.

<div class="warn"><strong>Wichtig:</strong> Den A-Eintrag <code>@ → 75.2.60.5</code> und den CNAME <code>www</code> aus Teil 1 <strong>nicht löschen</strong> – sie gehören zur Website. Der TXT-Eintrag <code>MS=ms…</code> darf bestehen bleiben.</div>

**DKIM einschalten (empfohlen):** Nachdem die beiden `selector`-CNAMEs gesetzt sind, im Microsoft Defender Portal ([security.microsoft.com](https://security.microsoft.com)) unter **E-Mail & Zusammenarbeit → Richtlinien und Regeln → Bedrohungsrichtlinien → E-Mail-Authentifizierungseinstellungen → DKIM** die Domain `rubenglaeser.de` wählen und **Mit DKIM-Signaturen signieren** aktivieren. DKIM und DMARC verbessern die Zustellbarkeit deiner Mails deutlich (weniger Spam-Ordner).

### Schritt 2.5 – Outlook auf Mac, iPhone und im Web

**Outlook im Browser:** [outlook.office.com](https://outlook.office.com) → mit `info@rubenglaeser.de` anmelden.

**Outlook für Mac:**

1. Outlook öffnen → Menü **Outlook → Einstellungen → Konten** → **+** → **Neues Konto**.
2. `info@rubenglaeser.de` eingeben → **Weiter** → mit dem Microsoft-Passwort anmelden.
3. Outlook erkennt das Exchange-Konto automatisch (dank `autodiscover`).

**iPhone – Outlook-App:** App „Microsoft Outlook“ aus dem App Store → **Konto hinzufügen** → `info@rubenglaeser.de` → anmelden.

**iPhone – Apple Mail (alternativ):** **Einstellungen → Apps → Mail → Mail-Accounts → Account hinzufügen → Microsoft Exchange** → `info@rubenglaeser.de` → **Anmelden**.

### Schritt 2.6 – Testen

1. Schicke von deiner iCloud-Adresse eine Mail an `info@rubenglaeser.de` und antworte darauf.
2. Prüfe die Einträge auf [mxtoolbox.com](https://mxtoolbox.com) → *MX Lookup* `rubenglaeser.de` – dort sollte `…mail.protection.outlook.com` stehen.
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
| `content/grafik.js` | Seite **Grafik** – Kacheln, Filter, Detailansicht |
| `content/fotografie.js` | Seite **Fotografie** – Galerie, Filter, Großansicht |
| `content/web-apps.js` | Seite **Web-Apps** (siehe Teil 3) |
| `index.html` | Texte der Startseite (Hero, Über mich, Kontakt) |
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

## Anhang A – Alle DNS-Einträge bei netcup auf einen Blick

| Host | Typ | Priorität | Ziel | Zweck |
|---|---|---|---|---|
| `@` | A | – | `75.2.60.5` | Website (Netlify) |
| `www` | CNAME | – | `rubenglaeser.netlify.app` | Website (Netlify) |
| `@` | TXT | – | `MS=ms…` (aus Admin Center) | Domain-Bestätigung Microsoft |
| `@` | MX | 0 | `rubenglaeser-de.mail.protection.outlook.com` (aus Admin Center) | E-Mail-Empfang |
| `autodiscover` | CNAME | – | `autodiscover.outlook.com` | Automatische Outlook-Einrichtung |
| `@` | TXT | – | `v=spf1 include:spf.protection.outlook.com -all` | SPF – Absender-Schutz |
| `selector1._domainkey` | CNAME | – | aus Admin Center | DKIM |
| `selector2._domainkey` | CNAME | – | aus Admin Center | DKIM |
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
- [ ] Microsoft 365 Business Basic gebucht
- [ ] Domain bei Microsoft bestätigt (TXT)
- [ ] `info@rubenglaeser.de` als Hauptadresse gesetzt
- [ ] MX, autodiscover, SPF, DKIM, DMARC bei netcup gesetzt
- [ ] DKIM im Defender-Portal aktiviert
- [ ] Outlook auf Mac und iPhone eingerichtet, Test-Mail OK
- [ ] Impressum und Datenschutz final geprüft
- [ ] Platzhalter in `grafik.js` und `fotografie.js` durch echte Arbeiten ersetzt

## Quellen

[^ms-preis]: Microsoft – Microsoft 365 Business Basic, Preise zzgl. MwSt.: <https://www.microsoft.com/de-de/microsoft-365/business/microsoft-365-business-basic>
[^ms-premium]: Microsoft Support – Premium-Features in Outlook.com haben sich geändert: <https://support.microsoft.com/de-de/office/premium-features-in-outlook-com-haben-sich-ge%C3%A4ndert-f4a6107f-6e07-4020-afbb-639fbcf0466f>
[^ms-adddomain]: Microsoft Learn – Add a domain to Microsoft 365: <https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide>
[^ms-dns]: Microsoft Learn – Add DNS records to connect your domain: <https://learn.microsoft.com/en-us/microsoft-365/admin/get-help-with-domains/create-dns-records-at-any-dns-hosting-provider?view=o365-worldwide>
[^ms-autodiscover]: Microsoft Support – Benutzerdefiniertes E-Mail-Domänenkonto in Outlook konfigurieren (autodiscover): <https://support.microsoft.com/de-de/outlook/configure-a-custom-email-domain-account-as-an-exchange-account-in-outlook>
[^nl-import]: Netlify Docs – Deploy from a repository: <https://docs.netlify.com/start/quickstarts/deploy-from-repository/>
[^nl-extdns]: Netlify Docs – Configure external DNS: <https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/>
[^nl-privat]: Netlify Changelog – Start with private project URLs (28.07.2026): <https://www.netlify.com/changelog/2026-07-28-start-with-private-project-urls/>
[^nl-visibility]: Netlify Docs – Project visibility: <https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/>
[^netcup-dns]: netcup Helpcenter – DNS-Einstellungen: <https://www.netcup.com/de/helpcenter/dokumentation/domain/dns-einstellungen>
[^netcup-cloud]: netcup Helpcenter – DNS-Einstellungen (CloudDNS): <https://www.netcup.com/de/helpcenter/dokumentation/domain/dns-einstellungen-cloud-dns>
