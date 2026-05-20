/* ═══════════════════════════════════════════════════════════
   KAIKE ELIAS · OLIVEIRA — script.js unificado
   Funciona em: portfolio (index.html) + comercial (servicos.html)
   + projetos (projetos.html)
═══════════════════════════════════════════════════════════ */

/* ─── 1. ANO NO RODAPÉ ─── */
document.querySelectorAll("[id='year'], .js-year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ─── 2. TEMA CLARO / ESCURO (portfólio usa data-theme no <html>) ─── */
const html = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
html.setAttribute("data-theme", savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ─── 3. NAVBAR scroll + hamburger ─── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ─── 4. CURSOR PERSONALIZADO ─── */
const cursor    = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  (function ring() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ring);
  })();

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0"; cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1"; cursorRing.style.opacity = "1";
  });
}

/* ─── 5. INTERSECTION OBSERVER — reveal + skill bars + counters ─── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("visible");

    /* Barras de habilidade (site comercial) */
    el.querySelectorAll(".skill-fill").forEach(bar => {
      bar.style.width = (bar.dataset.width || "0") + "%";
    });

    /* Contadores animados (site comercial) */
    el.querySelectorAll("[data-count]").forEach(counter => {
      const target = +counter.dataset.count;
      const isPercent = target === 100;
      let current = 0;
      const step = target / 50;
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        counter.textContent = Math.round(current) + (isPercent ? "%" : (target >= 5 ? "+" : ""));
        if (current >= target) clearInterval(iv);
      }, 28);
    });

    revealObs.unobserve(el);
  });
}, { threshold: 0.13, rootMargin: "0px 0px -36px 0px" });

document.querySelectorAll(".reveal, .timeline-item").forEach(el => revealObs.observe(el));

/* Stagger em grids */
document.querySelectorAll(
  ".services-grid .service-card, .projects-grid .project-card, .proj-grid .proj-card"
).forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + "s"; });

/* ─── 6. EFEITO DIGITAÇÃO — hero portfólio ─── */
const typingTarget = document.getElementById("typing-target");
if (typingTarget) {
  const texts = [
    "Transformo ideias em sistemas reais — do banco de dados à interface.",
    "Desenvolvedor Full-Stack em formação no IFSP.",
    "Criador da startup GRAI EcoSystems.",
    "Empreendedor movido por tecnologia e impacto.",
  ];
  let ti = 0, ci = 0, del = false, paused = false;

  const type = () => {
    if (paused) return;
    const cur = texts[ti];
    if (!del) {
      typingTarget.textContent = cur.substring(0, ci + 1);
      ci++;
      if (ci === cur.length) {
        del = true; paused = true;
        setTimeout(() => { paused = false; setTimeout(type, 60); }, 2400);
        return;
      }
    } else {
      typingTarget.textContent = cur.substring(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(type, del ? 44 : 68);
  };

  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) type(); });
    }, { threshold: 0.5 }).observe(heroEl);
  } else { type(); }
}

/* ─── 7. TABS hard/soft skills (portfólio) ─── */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(`tab-${btn.dataset.tab}`);
    if (target) {
      target.classList.add("active");
      target.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObs.observe(el));
    }
  });
});

/* ─── 8. FILTRO DE PROJETOS (projetos.html) ─── */
const filterBtns  = document.querySelectorAll(".filter-btn");
const projCards   = document.querySelectorAll(".proj-card[data-cat]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    projCards.forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      card.style.display = show ? "" : "none";
      if (show) {
        card.classList.remove("visible");
        requestAnimationFrame(() => revealObs.observe(card));
      }
    });
  });
});

/* ─── 9. FORMULÁRIO PORTFÓLIO → WhatsApp ─── */
const formPortfolio = document.getElementById("formContato");
if (formPortfolio) {
  formPortfolio.addEventListener("submit", e => {
    e.preventDefault();
    const nome     = document.getElementById("nome")?.value.trim();
    const email    = document.getElementById("email")?.value.trim();
    const mensagem = document.getElementById("mensagem")?.value.trim();
    if (!nome || !email || !mensagem) return showToast("Preencha todos os campos.", "warning");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("E-mail inválido.", "warning");

    const txt = `📩 *Contato pelo Portfólio!*\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Mensagem:* ${mensagem}`;
    window.open(`https://wa.me/5517997208457?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
    formPortfolio.reset();
    showToast("Abrindo WhatsApp... 🚀", "success");
  });
}

/* ─── 10. FORMULÁRIO COMERCIAL → WhatsApp ─── */
const formComercial = document.getElementById("contactForm");
if (formComercial) {
  formComercial.addEventListener("submit", e => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");

    /* Coleta campos com suporte ao select */
    const fields = {};
    formComercial.querySelectorAll("[name]").forEach(f => { fields[f.name] = f.value.trim(); });

    const nome     = fields.nome     || formComercial.querySelector("input[type=text]")?.value.trim();
    const email    = fields.email    || formComercial.querySelector("input[type=email]")?.value.trim();
    const empresa  = fields.empresa  || "";
    const tipo     = fields.tipo     || formComercial.querySelector("select")?.value || "";
    const mensagem = fields.mensagem || formComercial.querySelector("textarea")?.value.trim();

    if (!nome || !email || !mensagem) return showToast("Preencha nome, e-mail e mensagem.", "warning");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("E-mail inválido.", "warning");

    const txt = `💼 *Proposta de Projeto!*\n\n*Nome:* ${nome}\n*E-mail:* ${email}${empresa ? `\n*Empresa:* ${empresa}` : ""}${tipo ? `\n*Tipo:* ${tipo}` : ""}\n*Mensagem:* ${mensagem}\n\n_Enviado pelo site de serviços_`;
    window.open(`https://wa.me/5517997208457?text=${encodeURIComponent(txt)}`, "_blank", "noopener");

    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "✓ Enviado com sucesso!";
      btn.style.background = "#22c55e";
      setTimeout(() => { btn.textContent = orig; btn.style.background = ""; formComercial.reset(); }, 3200);
    } else {
      formComercial.reset();
    }
    showToast("Abrindo WhatsApp! 🚀", "success");
  });
}

/* ─── 11. TOAST ─── */
function showToast(msg, type = "info") {
  let wrap = document.getElementById("_toast_wrap");
  if (!wrap) {
    wrap = Object.assign(document.createElement("div"), { id: "_toast_wrap" });
    wrap.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(wrap);
  }
  const colors = { success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" };
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `background:#161d30;color:#fff;padding:.75rem 1.25rem;border-radius:10px;font-size:14px;max-width:290px;border-left:3px solid ${colors[type]||colors.info};opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;pointer-events:auto;`;
  wrap.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; });
  setTimeout(() => {
    t.style.opacity = "0"; t.style.transform = "translateY(10px)";
    setTimeout(() => t.remove(), 380);
  }, 3600);
}

/* ─── 12. LINK ATIVO NA NAVBAR por scroll ─── */
const allSections = document.querySelectorAll("section[id], header[id]");
const allNavLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      allNavLinks.forEach(a => {
        const h = a.getAttribute("href") || "";
        a.classList.toggle("active", h === `#${id}` || h.endsWith(`#${id}`));
      });
    }
  });
}, { threshold: 0.38 }).observe(document.body.firstElementChild || document.body);

allSections.forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      allNavLinks.forEach(a => {
        const h = a.getAttribute("href") || "";
        a.classList.toggle("active", h === `#${id}` || h.endsWith(`#${id}`));
      });
    });
  }, { threshold: 0.42 }).observe(s);
});

/* ─── 13. SCROLL SUAVE — âncoras na mesma página ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const tgt = document.querySelector(anchor.getAttribute("href"));
    if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

/* ─── 14. BOTÃO VOLTAR AO TOPO (site comercial usa .back-top e footer > a) ─── */
document.querySelectorAll(".back-top").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
