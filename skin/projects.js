/* ============================================================
   PROJECTS.JS — interacciones del portafolio
   - Revelado en scroll (Intersection Observer)
   - Carga diferida de dashboards de Power BI (click-to-load)
   - Modal de pantalla completa para dashboards
   - Modal nativo <dialog> para "ver todos los certificados"
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

  /* ---------- 2. Carga diferida de dashboards Power BI ---------- */
  // Cada visor arranca como un "poster" ligero; el iframe pesado de Power BI
  // solo se inyecta cuando la persona decide verlo, para no penalizar el rendimiento.
  document.querySelectorAll(".dash-embed").forEach((embed) => {
    const loadBtn = embed.querySelector("[data-load-dashboard]");
    const fullscreenBtn = embed
      .closest(".dash-card")
      ?.querySelector("[data-fullscreen-dashboard]");

    const loadIframe = () => {
      if (embed.querySelector("iframe")) return;
      const src = embed.dataset.src;
      const title = embed.dataset.title || "Dashboard de Power BI";
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("frameborder", "0");
      const poster = embed.querySelector(".dash-poster");
      if (poster) poster.remove();
      embed.appendChild(iframe);
      if (fullscreenBtn) fullscreenBtn.disabled = false;
    };

    loadBtn?.addEventListener("click", loadIframe);
  });

  /* ---------- 3. Modal de pantalla completa para dashboards ---------- */
  const pbiModal = document.getElementById("pbiFullscreenModal");
  const pbiFrameWrap = pbiModal?.querySelector(".pbi-frame-wrap");
  const pbiModalTitle = document.getElementById("pbiFullscreenTitle");

  document.querySelectorAll("[data-fullscreen-dashboard]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!pbiModal || !pbiFrameWrap) return;
      const src = btn.dataset.src;
      const title = btn.dataset.title || "Dashboard de Power BI";
      pbiFrameWrap.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = title;
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("frameborder", "0");
      pbiFrameWrap.appendChild(iframe);
      if (pbiModalTitle) pbiModalTitle.textContent = title;
      pbiModal.showModal();
    });
  });

  pbiModal?.addEventListener("close", () => {
    // Detener la carga del iframe al cerrar para liberar recursos.
    if (pbiFrameWrap) pbiFrameWrap.innerHTML = "";
  });

  /* ---------- 4. Modal genérico (cerrar con botón / backdrop) ---------- */
  document.querySelectorAll("dialog.app-modal").forEach((dialog) => {
    dialog.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => dialog.close());
    });
    // Cerrar al hacer click en el backdrop
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const insideDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!insideDialog) dialog.close();
    });
  });

  /* ---------- 5. Abrir modal "ver todos los certificados" ---------- */
  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = document.getElementById(trigger.dataset.openModal);
      target?.showModal();
    });
  });
})();
