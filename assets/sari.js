/* Sari Maron pages: the contents list marks where you are; the plan gets a labelled budget bar. Nothing else moves. */
(() => {
  /* current chapter in the contents / header nav */
  const links = [...document.querySelectorAll('body.plan > nav a[href^="#"], body.strategy header nav a[href^="#"]')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (targets.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      let current = null;
      targets.forEach((t, i) => { if (t.getBoundingClientRect().top <= innerHeight * 0.3) current = links[i]; });
      links.forEach(a => {
        const on = a === current;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
    update();
  }

  /* plan: one stacked bar under the budget total, built from the budget table itself */
  const budgetTable = document.querySelector('[aria-labelledby=budget] table');
  const total = document.querySelector('.budget-total');
  if (budgetTable && total) {
    const rows = [...budgetTable.tBodies[0].rows].slice(0, -1);
    const parse = s => Number(s.replace(/[^\d]/g, ''));
    const items = rows.map(r => ({name: r.cells[0].textContent.trim().split(' · ')[0], value: parse(r.cells[1].textContent)}));
    const sum = items.reduce((a, b) => a + b.value, 0);
    const colours = ['var(--ink)', 'var(--accent)', 'var(--data-3)', 'var(--rule)'];
    const fmt = n => n.toLocaleString('en-US');
    const box = document.createElement('figure');
    box.className = 'budget-bar';
    box.style.margin = '0';
    box.setAttribute('aria-label', 'חלוקת התקציב השנתי');
    box.innerHTML = `<div class="bar" aria-hidden="true">${items.map((it, i) => `<i style="flex:${it.value};background:${colours[i]}"></i>`).join('')}</div>
      <ul>${items.map((it, i) => `<li><i style="background:${colours[i]}"></i>${it.name}: ${fmt(it.value)} ₪ (${Math.round(it.value / sum * 100)}%)</li>`).join('')}</ul>`;
    total.after(box);
  }

  /* plan: a scroll hint above the timeline on narrow screens */
  const gscroll = document.querySelector('.gantt-scroll');
  if (gscroll) {
    const note = document.createElement('p');
    note.className = 'scroll-note';
    note.textContent = 'גללו לצדדים כדי לראות את כל החודשים ←';
    gscroll.before(note);
  }
})();
