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
