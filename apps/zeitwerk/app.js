(() => {
  'use strict';

  // Lokale Speicherung im Browser (für statisches Hosting wie Netlify)
  const STORE_KEY = 'zeitwerk-data-v1';
  const API = '';
  const COLORS = ['#E5484D', '#F76B15', '#E2A336', '#46A758', '#12A594', '#3E86E0', '#6E56CF', '#D6409F', '#8D6E63', '#5B6B7A'];
  const RING_LEN = 2 * Math.PI * 88;

  const $ = (id) => document.getElementById(id);
  const el = {
    root: document.documentElement,
    projectsRow: $('projectsRow'), elsewhere: $('elsewhere'), elsewhereText: $('elsewhereText'), elsewhereGo: $('elsewhereGo'),
    ringProgress: $('ringProgress'), ticks: $('ticks'), ringProject: $('ringProject'), time: $('timeDisplay'), ringSub: $('ringSub'),
    task: $('taskInput'), suggestions: $('taskSuggestions'), mainBtn: $('mainBtn'), mainLabel: $('mainBtnLabel'),
    logTitle: $('logTitle'), editProject: $('editProjectBtn'), addEntry: $('addEntryBtn'), csv: $('csvBtn'),
    statToday: $('statToday'), statWeek: $('statWeek'), statTotal: $('statTotal'), logList: $('logList'),
    themeBtn: $('themeBtn'), toast: $('toast'),
    pDialog: $('projectDialog'), pForm: $('projectForm'), pTitle: $('projectDialogTitle'), pName: $('projectName'), pColors: $('colorPicker'), pDelete: $('deleteProjectBtn'),
    eDialog: $('entryDialog'), eForm: $('entryForm'), eTitle: $('entryDialogTitle'), eTask: $('entryTask'), eDate: $('entryDate'), eStart: $('entryStart'), eEnd: $('entryEnd'), eError: $('entryError'), eDelete: $('deleteEntryBtn'),
    cDialog: $('confirmDialog'), cTitle: $('confirmTitle'), cText: $('confirmText'),
  };

  const state = {
    projects: [],
    running: null,
    selectedId: null,
    entries: [],
    skew: 0, // Serverzeit - Clientzeit
    editingProjectId: null,
    editingEntry: null,
    pickedColor: COLORS[0],
    busy: false,
  };

  // ---------- Helfer ----------
  function loadDb() {
    try { const d = JSON.parse(localStorage.getItem(STORE_KEY)); if (d && d.projects && d.entries) return d; } catch (_) {}
    return { projects: [], entries: [], seq: 1 };
  }
  function saveDb(d) { localStorage.setItem(STORE_KEY, JSON.stringify(d)); }
  const clone = (o) => (o ? JSON.parse(JSON.stringify(o)) : o);

  async function api(method, path, body) {
    const d = loadDb();
    const t = Date.now();
    const fail = (m) => { throw new Error(m); };
    let m;
    if (method === 'GET' && path === '/api/state') {
      const projects = d.projects.map((p) => {
        const es = d.entries.filter((e) => e.project_id === p.id);
        const last = es.length ? Math.max(...es.map((e) => e.start)) : null;
        return { ...p, entry_count: es.length, total_ms: es.reduce((a, e) => a + (e.end != null ? e.end - e.start : 0), 0), last_used: last };
      }).sort((x, y) => (y.last_used ?? y.created) - (x.last_used ?? x.created));
      const running = d.entries.filter((e) => e.end == null).sort((x, y) => y.start - x.start)[0] || null;
      return { projects, running: clone(running), now: t };
    }
    if (method === 'POST' && path === '/api/projects') {
      const name = (body.name || '').trim(); if (!name) fail('Name fehlt');
      const p = { id: d.seq++, name, color: body.color || '#E5484D', created: t };
      d.projects.push(p); saveDb(d); return clone(p);
    }
    if ((m = path.match(/^\/api\/projects\/(\d+)\/entries$/))) {
      const id = Number(m[1]);
      return d.entries.filter((e) => e.project_id === id).sort((x, y) => y.start - x.start).map(clone);
    }
    if ((m = path.match(/^\/api\/projects\/(\d+)$/))) {
      const id = Number(m[1]);
      if (method === 'DELETE') { d.projects = d.projects.filter((p) => p.id !== id); d.entries = d.entries.filter((e) => e.project_id !== id); saveDb(d); return { deleted: id }; }
      const p = d.projects.find((x) => x.id === id); if (!p) fail('Projekt nicht gefunden');
      if (body.name && body.name.trim()) p.name = body.name.trim();
      if (body.color) p.color = body.color;
      saveDb(d); return clone(p);
    }
    if (method === 'POST' && path === '/api/timer/start') {
      d.entries.forEach((e) => { if (e.end == null) e.end = t; });
      const e = { id: d.seq++, project_id: body.project_id, task: (body.task || '').trim(), start: t, end: null };
      d.entries.push(e); saveDb(d); return clone(e);
    }
    if (method === 'POST' && path === '/api/timer/stop') {
      const e = d.entries.filter((x) => x.end == null).sort((x, y) => y.start - x.start)[0];
      if (!e) return null; e.end = t; saveDb(d); return clone(e);
    }
    if (method === 'POST' && path === '/api/entries') {
      if (body.end <= body.start) fail('Ende muss nach dem Start liegen');
      const e = { id: d.seq++, project_id: body.project_id, task: (body.task || '').trim(), start: body.start, end: body.end };
      d.entries.push(e); saveDb(d); return clone(e);
    }
    if ((m = path.match(/^\/api\/entries\/(\d+)$/))) {
      const id = Number(m[1]);
      if (method === 'DELETE') { d.entries = d.entries.filter((e) => e.id !== id); saveDb(d); return { deleted: id }; }
      const e = d.entries.find((x) => x.id === id); if (!e) fail('Eintrag nicht gefunden');
      if (body.task != null) e.task = body.task.trim();
      if (body.start != null) e.start = body.start;
      if (body.end != null) e.end = body.end;
      saveDb(d); return clone(e);
    }
    fail('Unbekannte Aktion');
  }

  function exportCsv(p) {
    const d = loadDb();
    const pad2 = (n) => String(n).padStart(2, '0');
    const q = (v) => /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    const rows = [['Datum', 'Start', 'Ende', 'Dauer (h:mm)', 'Dauer (Std.)', 'Aufgabe']];
    d.entries.filter((e) => e.project_id === p.id && e.end != null).sort((x, y) => x.start - y.start).forEach((e) => {
      const s = new Date(e.start), en = new Date(e.end), mins = Math.round((e.end - e.start) / 60000);
      rows.push([`${pad2(s.getDate())}.${pad2(s.getMonth() + 1)}.${s.getFullYear()}`, `${pad2(s.getHours())}:${pad2(s.getMinutes())}`, `${pad2(en.getHours())}:${pad2(en.getMinutes())}`,
        `${Math.floor(mins / 60)}:${pad2(mins % 60)}`, (mins / 60).toFixed(2).replace('.', ','), e.task || '']);
    });
    const csv = '\ufeff' + rows.map((r) => r.map((v) => q(String(v))).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = `zeitwerk_${p.name.replace(/[^\wäöüÄÖÜß -]/g, '').trim().replace(/\s+/g, '_') || 'projekt'}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const now = () => Date.now() + state.skew;
  const pad = (n) => String(n).padStart(2, '0');

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }
  function fmtDur(ms) {
    const mins = Math.round(Math.max(0, ms) / 60000);
    return `${Math.floor(mins / 60)}:${pad(mins % 60)}`;
  }
  function fmtDurLong(ms) {
    const mins = Math.round(Math.max(0, ms) / 60000);
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h === 0) return `${m} Min.`;
    return m ? `${h} Std. ${m} Min.` : `${h} Std.`;
  }
  const fmtTime = (t) => new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  function dayKey(t) { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function dayLabel(t) {
    const d = new Date(t), today = new Date(now());
    const y = new Date(today); y.setDate(today.getDate() - 1);
    if (dayKey(d) === dayKey(today)) return 'Heute';
    if (dayKey(d) === dayKey(y)) return 'Gestern';
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'long', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  }
  function startOfDay(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function startOfWeek(t) { const d = new Date(startOfDay(t)); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return d.getTime(); }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  const project = (id) => state.projects.find((p) => p.id === id);
  const selected = () => project(state.selectedId);

  // ---------- Theme ----------
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  let dark = mq.matches;
  function applyTheme() {
    el.root.classList.toggle('dark', dark);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#17110F' : '#FBF6F2');
  }
  el.themeBtn.addEventListener('click', () => { dark = !dark; applyTheme(); });
  mq.addEventListener?.('change', (e) => { dark = e.matches; applyTheme(); });
  applyTheme();

  // ---------- Ring-Ticks ----------
  (function buildTicks() {
    let html = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const r1 = i % 5 === 0 ? 72 : 75, r2 = 78;
      html += `<line x1="${100 + r1 * Math.cos(a)}" y1="${100 + r1 * Math.sin(a)}" x2="${100 + r2 * Math.cos(a)}" y2="${100 + r2 * Math.sin(a)}" ${i % 5 === 0 ? '' : 'opacity=".5"'} />`;
    }
    el.ticks.innerHTML = html;
  })();
  el.ringProgress.style.strokeDasharray = RING_LEN;

  // ---------- Laden ----------
  async function loadState() {
    const s = await api('GET', '/api/state');
    state.skew = s.now - Date.now();
    state.projects = s.projects;
    state.running = s.running;
    if (!project(state.selectedId)) {
      state.selectedId = state.running ? state.running.project_id : (state.projects[0]?.id ?? null);
    }
  }
  async function loadEntries() {
    state.entries = state.selectedId ? await api('GET', `/api/projects/${state.selectedId}/entries`) : [];
  }
  async function refresh() {
    await loadState();
    await loadEntries();
    render();
  }

  // ---------- Rendern ----------
  function render() {
    const p = selected();
    el.root.style.setProperty('--proj', p ? p.color : COLORS[0]);
    renderProjects();
    renderTimer();
    renderLog();
  }

  function renderProjects() {
    const runPid = state.running?.project_id;
    el.projectsRow.innerHTML = state.projects.map((p) => `
      <button class="pill ${p.id === state.selectedId ? 'active' : ''}" role="tab" aria-selected="${p.id === state.selectedId}"
        style="--c:${p.color}" data-id="${p.id}" data-testid="button-project-${p.id}">
        ${p.id === runPid ? '<span class="live" aria-label="läuft"></span>' : '<span class="pdot"></span>'}
        ${esc(p.name)}
      </button>`).join('') +
      `<button class="pill add" id="addProjectPill" data-testid="button-add-project" aria-label="Neues Projekt">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Projekt
      </button>`;
  }

  function renderTimer() {
    const p = selected();
    const r = state.running;
    const runningHere = r && p && r.project_id === p.id;
    const runningElsewhere = r && (!p || r.project_id !== p.id);

    el.ringProject.textContent = p ? p.name : 'Kein Projekt';
    el.mainBtn.disabled = !p;
    el.mainBtn.classList.toggle('running', !!runningHere);
    el.mainLabel.textContent = runningHere ? 'Stopp' : (runningElsewhere ? 'Hier starten' : 'Start');

    if (runningElsewhere) {
      const rp = project(r.project_id);
      el.elsewhere.hidden = false;
      el.elsewhere.style.setProperty('--run-c', rp?.color || COLORS[0]);
      el.elsewhereGo.dataset.id = r.project_id;
    } else {
      el.elsewhere.hidden = true;
    }

    // Aufgabenfeld: beim laufenden Timer hier den Task zeigen (außer der Nutzer tippt gerade)
    if (runningHere && document.activeElement !== el.task) el.task.value = r.task || '';

    // Vorschläge aus bisherigen Aufgaben
    const seen = new Set();
    el.suggestions.innerHTML = state.entries.filter((e) => e.task && !seen.has(e.task) && seen.add(e.task)).slice(0, 12)
      .map((e) => `<option value="${esc(e.task)}"></option>`).join('');

    tick();
  }

  function tick() {
    const p = selected();
    const r = state.running;
    const runningHere = r && p && r.project_id === p.id;
    let elapsed = 0;
    if (runningHere) {
      elapsed = now() - r.start;
      const hourFrac = (elapsed % 3600000) / 3600000;
      el.ringProgress.style.strokeDashoffset = RING_LEN * (1 - hourFrac);
      el.ringProgress.style.opacity = 1;
      el.ringSub.textContent = r.task ? r.task : `seit ${fmtTime(r.start)} Uhr`;
      document.title = `${fmtClock(elapsed)} · ${p.name}`;
    } else {
      el.ringProgress.style.strokeDashoffset = RING_LEN;
      el.ringProgress.style.opacity = 0;
      el.ringSub.textContent = p ? (state.entries.length ? `Heute: ${fmtDurLong(todayMs())}` : 'Bereit') : 'Lege ein Projekt an';
      document.title = r ? `${fmtClock(now() - r.start)} · ${project(r.project_id)?.name || ''}` : 'Zeitwerk';
    }
    const txt = fmtClock(elapsed);
    el.time.textContent = txt;
    el.time.classList.toggle('long', txt.length > 5);

    if (r && (!p || r.project_id !== p.id)) {
      const rp = project(r.project_id);
      el.elsewhereText.textContent = `Läuft: ${rp ? rp.name : 'Projekt'} · ${fmtClock(now() - r.start)}`;
    }
    // Live-Eintrag im Protokoll aktualisieren
    const liveDur = document.querySelector('.entry.live .entry-dur');
    if (liveDur && runningHere) liveDur.textContent = fmtClock(elapsed);
    if (runningHere) updateStats();
  }

  function entryDur(e) { return (e.end ?? now()) - e.start; }
  function todayMs() {
    const t0 = startOfDay(now());
    return state.entries.filter((e) => e.start >= t0).reduce((a, e) => a + entryDur(e), 0);
  }
  function updateStats() {
    const t0 = startOfDay(now()), w0 = startOfWeek(now());
    let d = 0, w = 0, all = 0;
    for (const e of state.entries) {
      const ms = entryDur(e);
      all += ms;
      if (e.start >= w0) w += ms;
      if (e.start >= t0) d += ms;
    }
    el.statToday.textContent = fmtDur(d);
    el.statWeek.textContent = fmtDur(w);
    el.statTotal.textContent = fmtDur(all);
  }

  function renderLog() {
    const p = selected();
    el.logTitle.textContent = p ? p.name : 'Protokoll';
    el.editProject.hidden = !p;
    el.addEntry.hidden = !p;
    el.csv.hidden = !p || !state.entries.some((e) => e.end);
    updateStats();

    if (!p) {
      el.logList.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/></svg>
          <strong>Noch keine Projekte</strong>
          Tippe oben auf „+ Projekt“, um loszulegen.
        </div>`;
      return;
    }
    if (!state.entries.length) {
      el.logList.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          <strong>Noch keine Einträge</strong>
          Starte den Timer – jede Session erscheint hier im Protokoll.
        </div>`;
      return;
    }

    const groups = new Map();
    for (const e of state.entries) {
      const k = dayKey(e.start);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(e);
    }
    let html = '';
    for (const [, list] of groups) {
      const sum = list.reduce((a, e) => a + entryDur(e), 0);
      html += `<div class="day"><div class="day-head"><span>${esc(dayLabel(list[0].start))}</span><span class="sum">${fmtDur(sum)} h</span></div>`;
      for (const e of list) {
        const live = e.end == null;
        html += `
          <button class="entry ${live ? 'live' : ''}" data-id="${e.id}" data-testid="row-entry-${e.id}">
            <span class="entry-task ${e.task ? '' : 'none'}">${e.task ? esc(e.task) : 'Ohne Aufgabe'}</span>
            <span class="entry-dur">${live ? fmtClock(entryDur(e)) : fmtDur(entryDur(e))}</span>
            <span class="entry-time">${fmtTime(e.start)} – ${live ? 'jetzt' : fmtTime(e.end)}</span>
          </button>`;
      }
      html += '</div>';
    }
    el.logList.innerHTML = html;
  }

  // ---------- Aktionen ----------
  el.projectsRow.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    if (btn.id === 'addProjectPill') return openProjectDialog(null);
    await selectProject(Number(btn.dataset.id));
  });

  async function selectProject(id) {
    if (id === state.selectedId) return;
    state.selectedId = id;
    if (!state.running || state.running.project_id !== id) el.task.value = '';
    render();
    await loadEntries();
    render();
  }
  el.elsewhereGo.addEventListener('click', () => selectProject(Number(el.elsewhereGo.dataset.id)));

  el.mainBtn.addEventListener('click', async () => {
    const p = selected();
    if (!p || state.busy) return;
    state.busy = true;
    try {
      const runningHere = state.running && state.running.project_id === p.id;
      if (runningHere) {
        const e = await api('POST', '/api/timer/stop');
        toast(`Gespeichert: ${fmtDurLong(e.end - e.start)}`);
        el.task.value = '';
      } else {
        await api('POST', '/api/timer/start', { project_id: p.id, task: el.task.value });
      }
      await refresh();
    } catch (err) {
      toast(err.message);
    } finally {
      state.busy = false;
    }
  });

  // Aufgabe während laufendem Timer ändern
  let taskTimer;
  el.task.addEventListener('input', () => {
    const r = state.running, p = selected();
    if (!r || !p || r.project_id !== p.id) return;
    clearTimeout(taskTimer);
    taskTimer = setTimeout(async () => {
      try {
        const upd = await api('PATCH', `/api/entries/${r.id}`, { task: el.task.value });
        state.running = upd;
        const le = state.entries.find((e) => e.id === upd.id);
        if (le) le.task = upd.task;
        renderLog(); tick();
      } catch (_) {}
    }, 500);
  });
  el.task.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.task.blur(); if (!(state.running && state.running.project_id === state.selectedId)) el.mainBtn.click(); } });

  // Dialog schließen via [data-close]
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  function confirmAsk(title, text) {
    el.cTitle.textContent = title;
    el.cText.textContent = text;
    el.cDialog.returnValue = '';
    el.cDialog.showModal();
    return new Promise((res) => el.cDialog.addEventListener('close', () => res(el.cDialog.returnValue === 'yes'), { once: true }));
  }

  // Projekt-Dialog
  function renderColors() {
    el.pColors.innerHTML = COLORS.map((c) => `<button type="button" class="color-opt" role="radio" aria-checked="${c === state.pickedColor}" aria-label="Farbe ${c}" style="--c:${c}" data-c="${c}"></button>`).join('');
  }
  el.pColors.addEventListener('click', (e) => {
    const b = e.target.closest('.color-opt'); if (!b) return;
    state.pickedColor = b.dataset.c; renderColors();
  });
  function openProjectDialog(p) {
    state.editingProjectId = p ? p.id : null;
    el.pTitle.textContent = p ? 'Projekt bearbeiten' : 'Neues Projekt';
    el.pName.value = p ? p.name : '';
    const used = new Set(state.projects.map((x) => x.color));
    state.pickedColor = p ? p.color : (COLORS.find((c) => !used.has(c)) || COLORS[state.projects.length % COLORS.length]);
    el.pDelete.hidden = !p;
    renderColors();
    el.pDialog.showModal();
    setTimeout(() => el.pName.focus(), 50);
  }
  el.editProject.addEventListener('click', () => { const p = selected(); if (p) openProjectDialog(p); });
  el.pForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = el.pName.value.trim();
    if (!name) return;
    try {
      if (state.editingProjectId) {
        await api('PATCH', `/api/projects/${state.editingProjectId}`, { name, color: state.pickedColor });
      } else {
        const p = await api('POST', '/api/projects', { name, color: state.pickedColor });
        state.selectedId = p.id;
        el.task.value = '';
      }
      el.pDialog.close();
      await refresh();
    } catch (err) { toast(err.message); }
  });
  el.pDelete.addEventListener('click', async () => {
    const p = project(state.editingProjectId); if (!p) return;
    el.pDialog.close();
    const ok = await confirmAsk('Projekt löschen?', `„${p.name}“ und alle ${p.entry_count} Einträge werden dauerhaft gelöscht.`);
    if (!ok) return;
    await api('DELETE', `/api/projects/${p.id}`);
    state.selectedId = null;
    await refresh();
    toast('Projekt gelöscht');
  });

  // Eintrag-Dialog
  const toDateInput = (t) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const toTimeInput = (t) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  function combine(date, time) { const [y, m, d] = date.split('-').map(Number); const [h, mi] = time.split(':').map(Number); return new Date(y, m - 1, d, h, mi).getTime(); }

  function openEntryDialog(entry) {
    state.editingEntry = entry;
    el.eError.hidden = true;
    const live = entry && entry.end == null;
    el.eTitle.textContent = entry ? (live ? 'Laufender Eintrag' : 'Eintrag bearbeiten') : 'Zeit nachtragen';
    const t = now();
    el.eTask.value = entry ? entry.task : '';
    el.eDate.value = toDateInput(entry ? entry.start : t - 3600000);
    el.eStart.value = toTimeInput(entry ? entry.start : t - 3600000);
    el.eEnd.value = entry && entry.end ? toTimeInput(entry.end) : toTimeInput(t);
    el.eEnd.disabled = !!live;
    el.eDelete.hidden = !entry;
    el.eDialog.showModal();
  }
  el.addEntry.addEventListener('click', () => openEntryDialog(null));
  el.csv.addEventListener('click', (e) => { e.preventDefault(); const p = selected(); if (p) exportCsv(p); });
  // Änderungen aus anderen Tabs übernehmen
  window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) refresh().catch(() => {}); });
  el.logList.addEventListener('click', (e) => {
    const b = e.target.closest('.entry'); if (!b) return;
    const entry = state.entries.find((x) => x.id === Number(b.dataset.id));
    if (entry) openEntryDialog(entry);
  });
  el.eForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entry = state.editingEntry;
    const live = entry && entry.end == null;
    const start = combine(el.eDate.value, el.eStart.value);
    let end = live ? null : combine(el.eDate.value, el.eEnd.value);
    if (end != null && end <= start) end += 86400000; // über Mitternacht
    if (live && start > now()) { el.eError.textContent = 'Der Start darf nicht in der Zukunft liegen.'; el.eError.hidden = false; return; }
    if (end != null && end - start > 86400000) { el.eError.textContent = 'Ein Eintrag darf höchstens 24 Stunden dauern.'; el.eError.hidden = false; return; }
    try {
      if (entry) {
        const body = { task: el.eTask.value, start };
        if (!live) body.end = end;
        await api('PATCH', `/api/entries/${entry.id}`, body);
      } else {
        await api('POST', '/api/entries', { project_id: state.selectedId, task: el.eTask.value, start, end });
      }
      el.eDialog.close();
      await refresh();
      toast('Gespeichert');
    } catch (err) { el.eError.textContent = err.message; el.eError.hidden = false; }
  });
  el.eDelete.addEventListener('click', async () => {
    const entry = state.editingEntry; if (!entry) return;
    el.eDialog.close();
    const ok = await confirmAsk('Eintrag löschen?', `${entry.task || 'Ohne Aufgabe'} · ${fmtDurLong(entryDur(entry))}`);
    if (!ok) return;
    await api('DELETE', `/api/entries/${entry.id}`);
    if (entry.end == null) el.task.value = '';
    await refresh();
    toast('Eintrag gelöscht');
  });

  // ---------- Start ----------
  setInterval(tick, 1000);
  // Andere Geräte synchronisieren
  setInterval(() => { if (!document.hidden && !document.querySelector('dialog[open]')) refresh().catch(() => {}); }, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh().catch(() => {}); });

  refresh().catch(() => {
    el.logList.innerHTML = `<div class="empty"><strong>Verbindung fehlgeschlagen</strong>Der Browser-Speicher ist nicht verfügbar (z. B. im privaten Modus). Bitte öffne die Seite in einem normalen Fenster.</div>`;
  });
})();
