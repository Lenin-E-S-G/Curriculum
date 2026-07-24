/* ============================================================
   SKILLS.JS — interacciones de la página de Habilidades
   - Revelado en scroll (Intersection Observer)
   - Efecto de texto escrito ("typed") en el subtítulo
   ============================================================ */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Revelado en scroll ---------- */
  const revealTargets = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ---------- 2. Efecto de texto escrito ---------- */
  const typedEl = document.querySelector(".typed");
  if (typedEl) {
    let words = [];
    try {
      words = JSON.parse(typedEl.getAttribute("data-words") || "[]");
    } catch (err) {
      words = [];
    }

    if (!words.length) {
      // nada que animar
    } else if (prefersReducedMotion) {
      // Sin movimiento: mostrar la primera frase de forma estática
      typedEl.textContent = words[0];
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let typingForward = true;

      const tick = () => {
        const current = words[wordIndex];
        typedEl.textContent = current.slice(0, charIndex);

        if (typingForward) {
          if (charIndex < current.length) {
            charIndex++;
          } else {
            typingForward = false;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          if (charIndex > 0) {
            charIndex--;
          } else {
            typingForward = true;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
        setTimeout(tick, typingForward ? 42 : 22);
      };
      tick();
    }
  }
})();
