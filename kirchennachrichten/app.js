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
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-teilen"/></svg><span>Teilen</span>';
    return b;
  }
  var KOPF = 'Kirchennachrichten Dresden-Blasewitz';

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

  /* Veranstaltungen: alle Beiträge mit Datumszeile */
  document.querySelectorAll('article.beitrag[id]').forEach(function (art) {
    var datum = art.querySelector(':scope > .datum');
    var h = art.querySelector('h3');
    if (!datum || !h) return;
    var titel = sauber(h.textContent);
    var b = knopf('Termin „' + titel + '“ teilen');
    b.addEventListener('click', function () {
      teile({ titel: titel, text: titel + '\n' + sauber(datum.textContent), id: art.id });
    });
    datum.insertAdjacentElement('afterend', b);
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
