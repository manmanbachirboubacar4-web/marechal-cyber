/* Chat WhatsApp intégré — Maréchal
   Usage : tout élément avec l'attribut data-wa-open ouvre la fenêtre de chat sur la page.
   Le message envoyé ouvre ensuite WhatsApp avec le texte déjà écrit. */
(function () {
  // ====== À MODIFIER ======
  const CONFIG = {
    numero: "22789780233",
    nom: "Maman Bachir",
    photo: "images/illustration-1.jpg",
    accueil: "Salut ! 👋 Je suis Maman Bachir. Dis-moi ce dont tu as besoin, je te réponds sur WhatsApp.",
    suggestions: ["Création de site web", "Réseau / Systèmes", "Vidéo publicitaire", "Infographie / Affiche"],
    prefill: "Bonjour ! J'ai vu ton portfolio 🔥"
  };
  // ========================

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const avatar = CONFIG.photo
    ? `<img class="wa-avatar" src="${esc(CONFIG.photo)}" alt="${esc(CONFIG.nom)}">`
    : `<div class="wa-avatar">${esc(CONFIG.nom[0])}</div>`;

  const box = document.createElement("div");
  box.className = "wa-chat";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Discuter sur WhatsApp");
  box.innerHTML = `
    <div class="wa-head">${avatar}
      <div><div class="wa-name">${esc(CONFIG.nom)}</div><div class="wa-status">En ligne</div></div>
      <button class="wa-close" aria-label="Fermer">×</button></div>
    <div class="wa-body"></div>
    <div class="wa-quick">${CONFIG.suggestions.map(s => `<button type="button">${esc(s)}</button>`).join("")}</div>
    <form class="wa-form"><input type="text" placeholder="Écris ton message…" autocomplete="off"><button aria-label="Envoyer">➤</button></form>`;
  document.body.appendChild(box);

  const body = box.querySelector(".wa-body");
  const input = box.querySelector("input");
  let started = false;

  function add(text, cls) {
    const d = document.createElement("div");
    d.className = "wa-msg " + cls; d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function open() {
    box.classList.add("open");
    if (!started) {
      started = true;
      const t = document.createElement("div");
      t.className = "wa-typing"; t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t);
      setTimeout(() => { t.remove(); add(CONFIG.accueil, "wa-in"); input.value = CONFIG.prefill; input.focus(); }, 900);
    } else input.focus();
  }
  const close = () => box.classList.remove("open");

  function send(text) {
    text = text.trim(); if (!text) return;
    add(text, "wa-out");
    setTimeout(() => {
      window.open("https://wa.me/" + CONFIG.numero + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }, 500);
    input.value = "";
  }

  box.querySelector(".wa-close").onclick = close;
  box.querySelector("form").onsubmit = e => { e.preventDefault(); send(input.value); };
  box.querySelectorAll(".wa-quick button").forEach(b => b.onclick = () => send("Bonjour, je suis intéressé par : " + b.textContent));
  document.addEventListener("click", e => { if (e.target.closest("[data-wa-open]")) { e.preventDefault(); open(); } });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();
