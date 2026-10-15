/* =========================================================
   UI: nav, typing effect, reveals, counters, 3D tilt,
   project cards + modal, lightbox, screenshot placeholders
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- screenshot slots: show a placeholder if file missing ---------- */
  function placeholderFor(img) {
    const src = img.getAttribute("src") || "";
    const ph = document.createElement("div");
    ph.className = "ph " + (img.className || "");
    ph.innerHTML =
      '<div class="ph-inner"><span class="ph-ico">＋</span>' +
      '<span class="ph-title">' + (img.dataset.hint || "Add your screenshot") + "</span>" +
      '<code class="ph-path">' + src + "</code></div>";
    return ph;
  }
  function guard(img) {
    const fail = () => { if (img.isConnected) img.replaceWith(placeholderFor(img)); };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail, { once: true });
  }
  $$("img.slot").forEach(guard);

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open"); burger.classList.remove("open");
  }));

  /* ---------- typing effect ---------- */
  const roles = ["Data Engineer", "BI Developer", "ETL & Pipeline Builder", "Power BI Specialist", "Python Automation"];
  const typed = $("#typed");
  if (typed && !reduceMotion) {
    let r = 0, c = roles[0].length, del = true;
    setTimeout(function step() {
      const word = roles[r];
      let wait = del ? 45 : 85;
      if (del) {
        c--;
        if (c === 0) { del = false; r = (r + 1) % roles.length; wait = 300; }
      } else {
        c++;
        if (c === word.length) { del = true; wait = 1800; }
      }
      typed.textContent = word.slice(0, c);
      setTimeout(step, wait);
    }, 2200);
  }

  /* ---------- counters ---------- */
  function countUp(el) {
    const to = +el.dataset.to, suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = to + suf; return; }
    const start = performance.now(), dur = 1400;
    (function f(now) {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(f);
    })(start);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".counter", e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.14 });
  const observeReveals = () => $$(".reveal:not(.in), .hero-stats").forEach(el => io.observe(el));

  /* ---------- 3D scene shape per section + active nav link ---------- */
  const sections = $$("[data-scene]");
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const shape = e.target.dataset.scene;
      if (window.setSceneShape) window.setSceneShape(shape);
      document.body.dataset.section = e.target.id;
      $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => sectionIO.observe(s));

  /* ---------- 3D tilt on cards ---------- */
  function addTilt(el) {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(0)`;
      el.style.setProperty("--mx", (x + 0.5) * 100 + "%");
      el.style.setProperty("--my", (y + 0.5) * 100 + "%");
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }

  /* ---------- projects ---------- */
  const grid = $("#projectsGrid");
  const projects = window.PROJECTS || [];
  const catLabel = { engineering: "Data Engineering", bi: "BI", ml: "ML / NLP" };

  grid.innerHTML = projects.map((p, i) => `
    <article class="project glass reveal tilt" data-cat="${p.category.join(" ")}" data-id="${p.id}" tabindex="0" style="--d:${i * 80}ms">
      <div class="project-media">
        <img class="slot" src="${p.cover}" alt="${p.title}" loading="lazy" data-hint="Cover image">
        <div class="project-tags">${p.category.map(c => `<span>${catLabel[c] || c}</span>`).join("")}</div>
      </div>
      <div class="project-body">
        <p class="project-meta mono">${p.year} · ${p.team}</p>
        <h3>${p.title}</h3>
        <p class="project-sub">${p.subtitle}</p>
        <p class="project-sum">${p.summary}</p>
        <div class="project-metrics">${p.metrics.map(m => `<div><strong>${m.v}</strong><span>${m.l}</span></div>`).join("")}</div>
        <span class="project-open mono">Open case study →</span>
      </div>
    </article>`).join("");

  $$(".project img.slot", grid).forEach(guard);
  $$(".tilt").forEach(addTilt);
  observeReveals();

  // filters
  $$("#filters button").forEach(btn => btn.addEventListener("click", () => {
    $$("#filters button").forEach(b => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    $$(".project", grid).forEach(card => {
      const show = f === "all" || card.dataset.cat.split(" ").includes(f);
      card.classList.toggle("hidden", !show);
    });
  }));

  /* ---------- modal ---------- */
  const modal = $("#modal"), body = $("#modalBody");
  let lastFocus = null;

  function openProject(id) {
    const p = projects.find(x => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    body.innerHTML = `
      <p class="kicker mono">${p.year} · ${p.team}</p>
      <h2 class="h2">${p.title}</h2>
      <p class="lead">${p.subtitle}</p>
      <div class="project-metrics big">${p.metrics.map(m => `<div><strong>${m.v}</strong><span>${m.l}</span></div>`).join("")}</div>
      <p>${p.summary}</p>
      <h3 class="h3">How it works</h3>
      <ul class="bullets">${p.details.map(d => `<li>${d}</li>`).join("")}</ul>
      <div class="chips">${p.stack.map(s => `<span>${s}</span>`).join("")}</div>
      <h3 class="h3">Screenshots</h3>
      <div class="gallery">${p.images.map(im => `
        <figure>
          <img class="slot zoomable" src="${im.src}" alt="${im.caption}" loading="lazy">
          <figcaption class="mono">${im.caption}</figcaption>
        </figure>`).join("")}</div>
      ${p.links.length ? `<div class="socials">${p.links.map(l => `<a class="btn btn-ghost" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join("")}</div>` : ""}
    `;
    $$("img.slot", body).forEach(guard);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    $(".modal-panel", modal).scrollTop = 0;
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener("click", e => {
    const card = e.target.closest(".project");
    if (card) openProject(card.dataset.id);
  });
  grid.addEventListener("keydown", e => {
    const card = e.target.closest(".project");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(card.dataset.id); }
  });
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox");
  body.addEventListener("click", e => {
    const img = e.target.closest("img.zoomable");
    if (!img) return;
    $("img", lb).src = img.src;
    $("p", lb).textContent = img.alt;
    lb.classList.add("open");
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (lb.classList.contains("open")) lb.classList.remove("open");
    else if (modal.classList.contains("open")) closeModal();
  });

  /* ---------- misc ---------- */
  $("#year").textContent = new Date().getFullYear();
  document.documentElement.classList.add("ready");
})();
