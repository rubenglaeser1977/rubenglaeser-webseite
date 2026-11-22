(function () {
  'use strict';
  var rubriken = Array.prototype.slice.call(document.querySelectorAll('section.rubrik[id]'));

  /* ---------- Inhaltsverzeichnis aus den Rubriken erzeugen ---------- */
  function baueToc(mitUnterpunkten) {
    var ul = document.createElement('ul');
    ul.className = 'toc';
    rubriken.forEach(function (sec) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.dataset.ziel = sec.id;
      a.textContent = sec.dataset.titel || sec.querySelector('h2').textContent;
      li.appendChild(a);
      if (mitUnterpunkten) {
        var unter = sec.querySelectorAll('article[id], .gruppe[id]');
        if (unter.length) {
          var sub = document.createElement('ul');
          unter.forEach(function (el) {
            var h = el.querySelector('h3');
            if (!h) return;
            var sli = document.createElement('li');
            var sa = document.createElement('a');
            sa.href = '#' + el.id;
            sa.textContent = h.textContent.replace(/\s+/g, ' ').trim();
            sli.appendChild(sa);
            sub.appendChild(sli);
          });
          if (sub.children.length) li.appendChild(sub);
        }
      }
      ul.appendChild(li);
    });
    return ul;
  }
  document.getElementById('toc-nav').appendChild(baueToc(true));
  document.getElementById('menue-nav').appendChild(baueToc(true));

  /* ---------- Menü ---------- */
  var menue = document.getElementById('menue');
  var auf = document.getElementById('menue-auf');
  function setzeMenue(offen) {
    menue.dataset.offen = offen ? 'true' : 'false';
    auf.setAttribute('aria-expanded', offen ? 'true' : 'false');
    document.body.style.overflow = offen ? 'hidden' : '';
    if (offen) {
      var aktiv = menue.querySelector('a[aria-current="true"]');
      (aktiv || menue.querySelector('a')).focus({ preventScroll: false });
    } else {
      auf.focus({ preventScroll: true });
    }
  }
  auf.addEventListener('click', function () { aktualisiere(); setzeMenue(true); });
  menue.addEventListener('click', function (e) {
    if (e.target.closest('[data-zu]')) setzeMenue(false);
    else if (e.target.closest('a[href^="#"]')) setzeMenue(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menue.dataset.offen === 'true') setzeMenue(false);
  });

  /* ---------- Gottesdienst-Filter ---------- */
  document.querySelectorAll('.filter').forEach(function (gruppe) {
    var liste = document.querySelector('.gd-liste[data-liste="' + gruppe.dataset.filter + '"]');
    gruppe.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      var k = btn.dataset.k;
      gruppe.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
      liste.querySelectorAll('.gd').forEach(function (gd) {
        var sichtbar = 0;
        gd.querySelectorAll('.gd__ort').forEach(function (ort) {
          var zeigen = k === 'alle' || ort.dataset.k === k;
          ort.hidden = !zeigen;
          if (zeigen) sichtbar++;
        });
        gd.hidden = sichtbar === 0;
      });
    });
  });

  /* ---------- Aktuelle Rubrik im Kopf + Menü markieren ---------- */
  var anzeige = document.getElementById('aktuelle-rubrik');
  var standard = anzeige.textContent;
  var hoch = document.getElementById('hoch');
  var tick = false;
  function aktualisiere() {
    tick = false;
    var y = window.scrollY + 120;
    var aktiv = null;
    for (var i = 0; i < rubriken.length; i++) {
      if (rubriken[i].offsetTop <= y) aktiv = rubriken[i];
    }
    anzeige.textContent = aktiv ? (aktiv.dataset.titel || standard) : standard;
    document.querySelectorAll('.toc > li > a').forEach(function (a) {
      a.setAttribute('aria-current', aktiv && a.dataset.ziel === aktiv.id ? 'true' : 'false');
    });
    hoch.classList.toggle('sichtbar', window.scrollY > 900);
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(aktualisiere); }
  }, { passive: true });
  aktualisiere();
  hoch.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
})();

/* ---------- Teilen einzelner Termine ---------- */
(function () {
  'use strict';
  var hinweis = document.getElementById('hinweis');
  var hinweisTimer;
  function zeige(text) {
    hinweis.textContent = text;
    hinweis.classList.add('sichtbar');
    clearTimeout(hinweisTimer);
    hinweisTimer = setTimeout(function () { hinweis.classList.remove('sichtbar'); }, 2600);
  }
  function sauber(t) { return (t || '').replace(/\s+/g, ' ').trim(); }
  function slug(t) {
    return sauber(t).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function knopf(label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'teilen';
    b.setAttribute('aria-label', label);
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-teilen"/></svg>';
    b.title = 'Teilen';
    return b;
  }
  var KOPF = 'Kirchennachrichten Dresden-Blasewitz';
  window.KINA = { zeige: zeige, sauber: sauber, slug: slug };

  /* Gottesdienste: ein Knopf pro Tag */
  document.querySelectorAll('.gd').forEach(function (gd) {
    var kopf = gd.querySelector('.gd__kopf');
    var datum = sauber(kopf.querySelector('b').textContent);
    var anlass = kopf.querySelector('span') ? sauber(kopf.querySelector('span').textContent) : '';
    if (!gd.id) gd.id = 'gd-' + slug(datum);
    var b = knopf('Gottesdienste am ' + datum + ' teilen');
    b.addEventListener('click', function () {
      var zeilen = [];
      gd.querySelectorAll('.gd__ort').forEach(function (ort) {
        if (ort.hidden) return;
        var on = ort.querySelector('.gd__ortname');
        var kirche = on.querySelector('small') ? sauber(on.querySelector('small').textContent) : '';
        var stadtteil = sauber(on.textContent.replace(kirche, ''));
        ort.querySelectorAll('.feier').forEach(function (f) {
          var was = f.querySelector('.feier__was').cloneNode(true);
          var wer = was.querySelector('.feier__wer');
          var kigo = was.querySelector('.kigo');
          var werText = wer ? sauber(wer.textContent) : '';
          if (wer) wer.remove();
          if (kigo) kigo.remove();
          var z = sauber(f.querySelector('.feier__zeit').textContent) + ' – ' + sauber(was.textContent) +
            ' (' + kirche + (stadtteil ? ', ' + stadtteil : '') + ')';
          if (werText) z += ', ' + werText;
          if (kigo) z += ', mit Kindergottesdienst';
          zeilen.push(z);
        });
      });
      teile({
        titel: 'Gottesdienst ' + datum,
        text: datum + (anlass ? ' · ' + anlass : '') + '\n' + zeilen.join('\n'),
        id: gd.id
      });
    });
    kopf.appendChild(b);
  });

  /* Beiträge: jeder Beitrag bekommt oben rechts ein Teilen-Symbol */
  document.querySelectorAll('article.beitrag[id]').forEach(function (art) {
    var h = art.querySelector('h3');
    var sek = art.closest('section.rubrik');
    var titel = sauber(h ? h.textContent : '') || sauber((art.querySelector('h4') || {}).textContent) || (sek ? sek.dataset.titel : KOPF);
    var datum = art.querySelector('.datum, .wann');
    var b = knopf('Beitrag „' + titel + '“ teilen');
    b.classList.add('teilen--rund');
    b.addEventListener('click', function () {
      teile({ titel: titel, text: titel + (datum ? '\n' + sauber(datum.textContent) : ''), id: art.id });
    });
    art.classList.add('hat-teilen');
    art.insertBefore(b, art.firstChild);
  });

  function teile(t) {
    var url = location.origin + location.pathname + '#' + t.id;
    var text = t.text + '\n\n' + KOPF;
    if (navigator.share) {
      navigator.share({ title: t.titel, text: text, url: url }).catch(function () {});
      return;
    }
    var alles = text + '\n' + url;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(alles).then(function () {
        zeige('Link kopiert – jetzt einfügen und senden.');
      }, function () { manuell(alles); });
    } else { manuell(alles); }
  }
  function manuell(alles) {
    var ta = document.createElement('textarea');
    ta.value = alles; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    zeige(ok ? 'Link kopiert – jetzt einfügen und senden.' : 'Kopieren nicht möglich.');
  }

  /* Geteilten Termin beim Öffnen hervorheben */
  function markiere() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || !(el.classList.contains('gd') || el.classList.contains('beitrag'))) return;
    el.classList.remove('markiert'); void el.offsetWidth; el.classList.add('markiert');
  }
  window.addEventListener('hashchange', markiere);
  markiere();
  if (location.hash) {
    var ziel = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (ziel) requestAnimationFrame(function () { ziel.scrollIntoView(); });
  }

  /* ---------- Als App speichern ---------- */
  var knoepfe = document.querySelectorAll('[data-app-installieren]');
  var istApp = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (istApp) knoepfe.forEach(function (k) { k.hidden = true; });
  var aufschub = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); aufschub = e; });
  window.addEventListener('appinstalled', function () {
    knoepfe.forEach(function (k) { k.hidden = true; });
    zeige('Gespeichert – die Kirchennachrichten liegen jetzt auf dem Startbildschirm.');
  });
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var hilfe = document.getElementById('ios-hilfe');
  knoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      if (aufschub) {
        aufschub.prompt();
        aufschub.userChoice.finally(function () { aufschub = null; });
      } else if (ios) {
        hilfe.hidden = false;
        hilfe.querySelector('[data-ios-zu]').focus();
      } else {
        zeige('Im Browsermenü (⋮) „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.');
      }
    });
  });
  hilfe.addEventListener('click', function (e) {
    if (e.target === hilfe || e.target.closest('[data-ios-zu]')) hilfe.hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hilfe.hidden = true; });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js'); });
  }
})();

/* ---------- Termine im Kalender speichern ---------- */
(function () {
  'use strict';
  var H = window.KINA;
  var ORTE = {
    hg: 'Heilig-Geist-Kirche, Berggartenstraße 22a, 01277 Dresden',
    bk: 'Bethlehemkirche, Marienberger Str. 65, 01279 Dresden',
    vk: 'Versöhnungskirche, Schandauer Str. 35, 01277 Dresden',
    vksaal: 'Großer Saal, Gemeindehaus der Versöhnungskirche, Schandauer Str. 35, 01277 Dresden',
    gh: 'Gemeindehaus, Sebastian-Bach-Str. 13, 01277 Dresden',
    bbz: 'Begegnungs- und Beratungszentrum der Ökumenischen Seniorenhilfe, Seidnitz Center (EG), Dresden'
  };
  var KIRCHE = { 'Heilig-Geist-Kirche': 'hg', 'Bethlehemkirche': 'bk', 'Versöhnungskirche': 'vk' };
  var MONATE = { januar: 1, februar: 2, 'märz': 3, april: 4, mai: 5, juni: 6, juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12 };
  function zwei(n) { return (n < 10 ? '0' : '') + n; }
  function plusMinuten(iso, min) {
    var d = new Date(iso + ':00Z'); d.setUTCMinutes(d.getUTCMinutes() + min);
    return d.toISOString().slice(0, 16);
  }
  function plusTag(tag) {
    var d = new Date(tag + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  function knopf(titel) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'kal';
    b.setAttribute('aria-label', '„' + titel + '“ im Kalender speichern');
    b.title = 'Im Kalender speichern';
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-kal-plus"/></svg>';
    return b;
  }
  function anker(el) { var a = el.closest('[id]'); return a ? a.id : ''; }

  var termine = [];
  /* 1. Gottesdienste aus der Kartenstruktur */
  document.querySelectorAll('.gd').forEach(function (gd) {
    var m = H.sauber(gd.querySelector('.gd__kopf b').textContent).match(/(\d+)\.\s*(\S+)/);
    if (!m) return;
    var monat = MONATE[m[2].toLowerCase()];
    var jahr = monat === 12 ? 2026 : 2027;
    var tag = jahr + '-' + zwei(monat) + '-' + zwei(+m[1]);
    gd.querySelectorAll('.gd__ort').forEach(function (ort) {
      var kirche = H.sauber((ort.querySelector('.gd__ortname small') || {}).textContent);
      ort.querySelectorAll('.feier').forEach(function (f) {
        var z = H.sauber(f.querySelector('.feier__zeit').textContent).match(/(\d+)\.(\d+)/);
        if (!z) return;
        var was = f.querySelector('.feier__was').cloneNode(true);
        var wer = was.querySelector('.feier__wer'), kigo = was.querySelector('.kigo');
        var werT = wer ? H.sauber(wer.textContent) : '';
        if (wer) wer.remove(); if (kigo) kigo.remove();
        var start = tag + 'T' + zwei(+z[1]) + ':' + z[2];
        var titel = H.sauber(was.textContent) + ' – ' + kirche;
        termine.push({
          el: f, ziel: f.querySelector('.feier__was'), titel: titel, start: start, ende: plusMinuten(start, 60),
          ort: ORTE[KIRCHE[kirche]] || kirche,
          info: [werT, kigo ? 'mit Kindergottesdienst' : ''].filter(Boolean).join(', '),
          id: gd.id
        });
      });
    });
  });
  /* 2. Veranstaltungen mit hinterlegten Daten */
  document.querySelectorAll('[data-kal-start]').forEach(function (el) {
    var art = el.closest('article');
    var h = art && art.querySelector('h3');
    var titel = el.dataset.kalTitel || H.sauber(h ? h.textContent : '');
    var ort = el.dataset.kalOrt || '';
    termine.push({
      el: el, ziel: el, titel: titel, start: el.dataset.kalStart,
      ende: el.dataset.kalEnde || el.dataset.kalStart, ort: ORTE[ort] || ort,
      rrule: el.dataset.kalRrule || '', info: '', id: anker(el)
    });
  });

  var vergeben = {};
  termine.forEach(function (t) {
    var d = kompakt(t.start).slice(0, 13).replace('T', '-') + '-' + H.slug(t.titel).slice(0, 40).replace(/-$/, '');
    while (vergeben[d]) d += '-2';
    vergeben[d] = 1; t.datei = d;
  });
  termine.forEach(function (t) {
    var b = knopf(t.titel);
    b.addEventListener('click', function () { oeffne(t); });
    if (t.ziel.matches('.feier__was')) t.el.appendChild(b);
    else if (t.ziel.matches('li')) { var z = t.ziel.querySelector('.zeit'); (z || t.ziel).appendChild(b); }
    else if (t.ziel.matches('.datum')) {
      var zeile = document.createElement('div'); zeile.className = 'datum-zeile';
      t.ziel.parentNode.insertBefore(zeile, t.ziel); zeile.appendChild(t.ziel); zeile.appendChild(b);
    }
    else t.ziel.appendChild(b);
  });

  /* Auswahl: Gerätekalender oder Google */
  var blatt = document.getElementById('kal-blatt');
  var aktuell = null;
  function oeffne(t) {
    aktuell = t;
    blatt.querySelector('[data-kal-was]').textContent = t.titel;
    blatt.hidden = false;
    blatt.querySelector('[data-kal-ics]').focus();
  }
  function schliesse() { blatt.hidden = true; }
  blatt.addEventListener('click', function (e) {
    if (e.target === blatt || e.target.closest('[data-kal-zu]')) return schliesse();
    if (e.target.closest('[data-kal-ics]')) { ics(aktuell); schliesse(); }
    if (e.target.closest('[data-kal-google]')) { google(aktuell); schliesse(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') schliesse(); });

  function ganztags(t) { return t.start.length === 10; }
  var BASIS = 'https://rubenglaeser.de/kirchennachrichten/';
  function link(t) { return BASIS + (t.id ? '#' + t.id : ''); }
  function beschreibung(t) {
    return (t.info ? t.info + '\n' : '') + 'Kirchennachrichten der Ev.-Luth. Kirchgemeinde Dresden-Blasewitz\n' + link(t);
  }
  function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function kompakt(iso) { return iso.replace(/[-:]/g, ''); }
  function falte(z) {
    var out = [], s = z;
    while (s.length > 70) { out.push(s.slice(0, 70)); s = ' ' + s.slice(70); }
    out.push(s); return out.join('\r\n');
  }
  function icsText(t) {
    var z = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kirchgemeinde Dresden-Blasewitz//Kirchennachrichten//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', 'TZID:Europe/Berlin',
      'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
      'END:VTIMEZONE', 'BEGIN:VEVENT',
      'UID:' + t.datei + '@kina-blasewitz', 'DTSTAMP:20261122T120000Z'];
    if (ganztags(t)) {
      z.push('DTSTART;VALUE=DATE:' + kompakt(t.start), 'DTEND;VALUE=DATE:' + kompakt(plusTag(t.ende)));
    } else {
      z.push('DTSTART;TZID=Europe/Berlin:' + kompakt(t.start) + '00', 'DTEND;TZID=Europe/Berlin:' + kompakt(t.ende) + '00');
    }
    if (t.rrule) z.push('RRULE:' + t.rrule);
    z.push('SUMMARY:' + esc(t.titel));
    if (t.ort) z.push('LOCATION:' + esc(t.ort));
    z.push('DESCRIPTION:' + esc(beschreibung(t)), 'URL:' + link(t), 'END:VEVENT', 'END:VCALENDAR');
    return z.map(falte).join('\r\n') + '\r\n';
  }
  /* Für die Erzeugung der statischen Dateien (kal/*.ics) */
  window.KINA_ICS = function () { return termine.map(function (t) { return { datei: t.datei, text: icsText(t) }; }); };

  function ics(t) {
    /* Echte Datei vom Server: funktioniert auf iPhone/iPad (Safari bietet „Hinzufügen“ an),
       auf Android und am Computer wird sie geladen und mit dem Kalender geöffnet. */
    var url = 'kal/' + t.datei + '.ics';
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) { window.location.href = url; return; }
    var a = document.createElement('a'); a.href = url; a.download = t.datei + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    H.zeige('Termin-Datei geladen – zum Übernehmen öffnen.');
  }
  function google(t) {
    var dates = ganztags(t)
      ? kompakt(t.start) + '/' + kompakt(plusTag(t.ende))
      : kompakt(t.start) + '00/' + kompakt(t.ende) + '00';
    var p = new URLSearchParams({ action: 'TEMPLATE', text: t.titel, dates: dates, ctz: 'Europe/Berlin', details: beschreibung(t), location: t.ort });
    if (t.rrule) p.set('recur', 'RRULE:' + t.rrule);
    window.open('https://calendar.google.com/calendar/render?' + p.toString(), '_blank', 'noopener');
  }
})();
