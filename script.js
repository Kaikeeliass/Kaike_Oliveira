document.querySelectorAll("[id='year'], .js-year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── TEMA CLARO / ESCURO ── */
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

/* ── NAVBAR scroll + hamburger ── */
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

/* ── CURSOR PERSONALIZADO ── */
const cursor = document.getElementById("cursor");
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
    cursor.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorRing.style.opacity = "1";
  });
}

/* ── INTERSECTION OBSERVER — reveal + skill bars + counters ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("visible");

    el.querySelectorAll(".skill-fill").forEach(bar => {
      bar.style.width = (bar.dataset.width || "0") + "%";
    });

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

document.querySelectorAll(
  ".services-grid .service-card, .projects-grid .project-card, .proj-grid .proj-card"
).forEach((el, i) => { el.style.transitionDelay = (i * 0.08) + "s"; });

/* ── EFEITO DIGITAÇÃO — hero portfólio ── */
const typingTarget = document.getElementById("typing-target");
if (typingTarget) {
  const texts = [
    "Transformo ideias em sistemas reais — do banco de dados à interface.",
    "Desenvolvedor Full-Stack em formação no IFSP.",
    "Criador da startup Nexus.",
    "Empreendedor movido por tecnologia e impacto.",
  ];
  let ti = 0, ci = 0, del = false, paused = false, started = false;

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
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          type();
        }
      });
    }, { threshold: 0.5 }).observe(heroEl);
  } else {
    type();
  }
}

/* ── TABS hard/soft skills ── */
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

/* ── FILTRO DE PROJETOS ── */
const filterBtns = document.querySelectorAll(".filter-btn");
const projCards = document.querySelectorAll(".proj-card[data-cat]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;

    projCards.forEach((card, i) => {
      const show = f === "all" || card.dataset.cat === f;
      if (show) {
        card.style.display = "";
        card.classList.remove("visible");
        card.style.transitionDelay = (i * 0.06) + "s";
        void card.offsetWidth;
        revealObs.observe(card);
      } else {
        card.style.display = "none";
      }
    });
  });
});

/* ── TOAST ── */
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
  t.style.cssText = `background:#161d30;color:#fff;padding:.75rem 1.25rem;border-radius:10px;font-size:14px;max-width:290px;border-left:3px solid ${colors[type] || colors.info};opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s;pointer-events:auto;`;
  wrap.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; });
  setTimeout(() => {
    t.style.opacity = "0"; t.style.transform = "translateY(10px)";
    setTimeout(() => t.remove(), 380);
  }, 3600);
}

/* ── LINK ATIVO NA NAVBAR por scroll ── */
const allSections = document.querySelectorAll("section[id], header[id]");
const allNavLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

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

/* ── SCROLL SUAVE — âncoras na mesma página ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const tgt = document.querySelector(anchor.getAttribute("href"));
    if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

/* ── BOTÃO VOLTAR AO TOPO ── */
document.querySelectorAll(".back-top").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ── MODE BANNER — esconde ao chegar no footer ── */
const banner = document.querySelector(".mode-banner");
const footer = document.querySelector(".footer");
if (banner && footer) {
  new IntersectionObserver(
    ([entry]) => { banner.classList.toggle("hidden", entry.isIntersecting); },
    { threshold: 0.1 }
  ).observe(footer);
}

/* ── FORMULÁRIO DE CONTATO — EmailJS ── */
(function initContactForm() {
  const EMAILJS_PUBLIC_KEY = "uikqMZyeHWmzNWxR6";
  const EMAILJS_SERVICE_ID = "service_ucfvv6i";
  const EMAILJS_TEMPLATE_ID = "template_kffjf4m";

  function waitForEmailJS(cb, tries = 0) {
    if (typeof emailjs !== "undefined") {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      cb();
    } else if (tries < 20) {
      setTimeout(() => waitForEmailJS(cb, tries + 1), 150);
    } else {
      console.warn("EmailJS SDK não carregou.");
    }
  }

  waitForEmailJS(() => {
    const form = document.getElementById("formContato");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn?.querySelector(".btn-text");
    const btnIcon = submitBtn?.querySelector(".btn-icon");
    const btnLoading = submitBtn?.querySelector(".btn-loading");

    const pills = form.querySelectorAll(".budget-pill");
    const budgetHidden = document.getElementById("orcamento");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("selected"));
        pill.classList.add("selected");
        if (budgetHidden) budgetHidden.value = pill.dataset.value;
      });
    });

    const assuntoSel = document.getElementById("assunto");
    const budgetGroup = document.getElementById("budget-group");
    const prazoGroup = document.getElementById("prazo-group");

    assuntoSel?.addEventListener("change", () => {
      const isProject = assuntoSel.value === "Projeto Freelance";
      if (budgetGroup) budgetGroup.style.display = isProject ? "" : "none";
      if (prazoGroup) prazoGroup.style.display = isProject ? "" : "none";
    });

    const textarea = document.getElementById("mensagem");
    const charCount = document.getElementById("char-count");
    const charWrap = form.querySelector(".char-counter");
    const MAX_CHARS = 800;

    textarea?.addEventListener("input", () => {
      const len = textarea.value.length;
      if (charCount) charCount.textContent = len;
      if (charWrap) {
        charWrap.classList.toggle("warn", len > MAX_CHARS * 0.85 && len <= MAX_CHARS);
        charWrap.classList.toggle("over", len > MAX_CHARS);
      }
    });

    const phoneInput = document.getElementById("telefone");
    const MAX_PHONE_DIGITS = 11;

    if (phoneInput) {
      phoneInput.addEventListener("keydown", (e) => {
        const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
        if (allowed.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) { e.preventDefault(); return; }
        if (phoneInput.value.replace(/\D/g, "").length >= MAX_PHONE_DIGITS) {
          e.preventDefault();
        }
      });

      phoneInput.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text");
        const onlyDigits = pasted.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS);
        const current = phoneInput.value.replace(/\D/g, "");
        phoneInput.value = (current + onlyDigits).slice(0, MAX_PHONE_DIGITS);
      });

      phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS);
      });
    }

    function setError(fieldId, errId, msg) {
      const field = document.getElementById(fieldId);
      const err = document.getElementById(errId);
      if (field) field.classList.add("invalid");
      if (err) { err.textContent = msg; err.classList.add("visible"); }
      return false;
    }
    function clearError(fieldId, errId) {
      const field = document.getElementById(fieldId);
      const err = document.getElementById(errId);
      if (field) field.classList.remove("invalid");
      if (err) { err.textContent = ""; err.classList.remove("visible"); }
    }
    function clearAllErrors() {
      [
        ["nome", "err-nome"],
        ["email", "err-email"],
        ["telefone", "err-telefone"],
        ["assunto", "err-assunto"],
        ["mensagem", "err-mensagem"],
      ].forEach(([fId, eId]) => clearError(fId, eId));
    }

    ["nome", "email", "mensagem", "telefone"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", () => clearError(id, `err-${id}`));
    });
    assuntoSel?.addEventListener("change", () => clearError("assunto", "err-assunto"));

    function validate() {
      clearAllErrors();
      let valid = true;

      const nome = document.getElementById("nome")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const assunto = assuntoSel?.value;
      const msg = textarea?.value.trim();
      const phone = phoneInput?.value.trim();

      if (!nome)
        valid = setError("nome", "err-nome", "Por favor, informe seu nome.");

      if (!email) {
        valid = setError("email", "err-email", "Por favor, informe seu e-mail.") && valid;
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        const blockedDomains = [
          "mailinator.com", "tempmail.com", "guerrillamail.com",
          "10minutemail.com", "throwam.com", "yopmail.com",
          "trashmail.com", "sharklasers.com", "dispostable.com",
        ];
        const domain = email.split("@")[1]?.toLowerCase();

        if (!emailRegex.test(email)) {
          valid = setError("email", "err-email", "E-mail inválido.") && valid;
        } else if (email.includes("..")) {
          valid = setError("email", "err-email", "E-mail inválido (pontos consecutivos).") && valid;
        } else if (email.startsWith(".") || email.includes(".@")) {
          valid = setError("email", "err-email", "E-mail inválido.") && valid;
        } else if (blockedDomains.includes(domain)) {
          valid = setError("email", "err-email", "Por favor, use um e-mail real.") && valid;
        }
      }

      if (phone && phone.length > 0) {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11) {
          valid = setError("telefone", "err-telefone", "Telefone inválido (10 ou 11 dígitos com DDD).") && valid;
        } else if (digits.length === 11 && digits[2] !== "9") {
          valid = setError("telefone", "err-telefone", "Celular com 11 dígitos deve ter 9 após o DDD.") && valid;
        }
      }

      if (!assunto)
        valid = setError("assunto", "err-assunto", "Selecione o tipo de assunto.") && valid;

      if (!msg || msg.length < 10)
        valid = setError("mensagem", "err-mensagem", "Mensagem muito curta (mín. 10 caracteres).") && valid;
      else if (msg.length > MAX_CHARS)
        valid = setError("mensagem", "err-mensagem", `Máximo de ${MAX_CHARS} caracteres.`) && valid;

      return valid;
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      if (btnText) btnText.style.display = on ? "none" : "";
      if (btnIcon) btnIcon.style.display = on ? "none" : "";
      if (btnLoading) btnLoading.style.display = on ? "" : "none";
    }

    function showSuccess() {
      form.style.display = "none";

      const el = document.createElement("div");
      el.className = "contact-form form-success show";
      el.innerHTML = `
        <div class="success-icon">✅</div>
        <h3>Mensagem enviada!</h3>
        <p>Obrigado pelo contato, ${document.getElementById("nome")?.value.trim().split(" ")[0] || ""}!<br>
           Responderei em até 24h nos dias úteis.</p>
        <button class="btn-reset" type="button">Enviar outra mensagem</button>
      `;
      form.parentNode.insertBefore(el, form.nextSibling);

      el.querySelector(".btn-reset")?.addEventListener("click", () => {
        el.remove();
        form.reset();
        if (charCount) charCount.textContent = "0";
        if (budgetHidden) budgetHidden.value = "";
        pills.forEach(p => p.classList.remove("selected"));
        if (budgetGroup) budgetGroup.style.display = "none";
        if (prazoGroup) prazoGroup.style.display = "none";
        clearAllErrors();
        form.style.display = "";
      });
    }

    function fallbackWhatsApp(params) {
      const txt = [
        `📩 *Contato pelo Portfólio!*`,
        ``,
        `*Nome:* ${params.from_name}`,
        `*E-mail:* ${params.reply_to}`,
        params.company && params.company !== "—" ? `*Empresa:* ${params.company}` : null,
        params.phone && params.phone !== "—" ? `*Telefone:* ${params.phone}` : null,
        `*Assunto:* ${params.subject_type}`,
        params.budget && params.budget !== "—" ? `*Orçamento:* ${params.budget}` : null,
        params.deadline && params.deadline !== "—" ? `*Prazo:* ${params.deadline}` : null,
        params.source && params.source !== "—" ? `*Origem:* ${params.source}` : null,
        ``,
        `*Mensagem:*`,
        params.message,
      ].filter(l => l !== null).join("\n");

      window.open(`https://wa.me/5517981568889?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);

      const templateParams = {
        from_name: document.getElementById("nome")?.value.trim() || "",
        reply_to: document.getElementById("email")?.value.trim() || "",
        company: document.getElementById("empresa")?.value.trim() || "—",
        phone: phoneInput?.value.trim() || "—",
        subject_type: assuntoSel?.value || "—",
        budget: budgetHidden?.value || "—",
        deadline: document.getElementById("prazo")?.value || "—",
        source: document.getElementById("origem")?.value || "—",
        message: textarea?.value.trim() || "",
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        setLoading(false);
        showSuccess();
        showToast("Mensagem enviada! 🎉", "success");
      } catch (err) {
        setLoading(false);
        console.error("EmailJS error:", err);
        showToast("E-mail falhou — redirecionando para WhatsApp 📱", "warning");
        setTimeout(() => fallbackWhatsApp(templateParams), 900);
      }
    });

  });
})();

(function initExpFilter() {
  const expFilterBtns = document.querySelectorAll(".exp-filter-btn");
  const tlItems = document.querySelectorAll(".tl-item[data-cat]");
  if (!expFilterBtns.length || !tlItems.length) return;
  expFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      expFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      tlItems.forEach(item => {
        const show = f === "all" || item.dataset.cat === f;
        if (show) {
          item.classList.remove("hidden");
          if (!item.classList.contains("visible")) {
            revealObs.observe(item);
          }
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
})();