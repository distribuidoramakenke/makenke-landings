/* Comportamiento compartido de todas las landings Makenke.
   Los datos del negocio viven SOLO acá: cambiás el WhatsApp una vez y se actualizan todas. */
(function () {
  var NEGOCIO = {
    whatsapp: "5492902417768",
    tel: "+542902417768",
    instagram: "https://www.instagram.com/distribuidoramakenkecalafate",
    maps: "https://www.google.com/maps/search/?api=1&query=Av.+17+de+Octubre+1231,+El+Calafate,+Santa+Cruz"
  };

  var body = document.body;
  var slug = body.dataset.landing || "home";
  var params = new URLSearchParams(location.search);

  // Recuerda de qué campaña vino la persona aunque navegue dentro de la página
  var utm = {};
  ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
    var v = params.get(k);
    try { if (v) sessionStorage.setItem(k, v); else v = sessionStorage.getItem(k); } catch (e) {}
    if (v) utm[k] = v;
  });

  // El mensaje de WhatsApp lleva una referencia para saber qué landing y qué campaña generó la consulta
  var ref = [slug, utm.utm_source, utm.utm_campaign].filter(Boolean).join(" / ");
  var texto = (body.dataset.waText || "Hola Makenke, quiero hacer una consulta") + " (ref: " + ref + ")";
  var wa = "https://wa.me/" + NEGOCIO.whatsapp + "?text=" + encodeURIComponent(texto);

  var links = { wa: wa, tel: "tel:" + NEGOCIO.tel, ig: NEGOCIO.instagram, maps: NEGOCIO.maps };
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var h = links[a.dataset.link]; if (h) a.href = h;
  });

  // Botón flotante de WhatsApp
  var btn = document.createElement("a");
  btn.className = "wa"; btn.href = wa; btn.setAttribute("aria-label", "Escribinos por WhatsApp");
  btn.innerHTML = '<svg viewBox="0 0 32 32" fill="#fff"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8A13 13 0 1 0 16 3zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1 1.1-3.9-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.200-.2-.3 0-.5.1-.7l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.500 2 .8 2.700.9 3.700.7.6-.1 1.900-.8 2.100-1.500.3-.7.3-1.400.2-1.500l-.6-.3z"/></svg><span>Escribinos</span>';
  body.appendChild(btn);

  // Parallax del hero (fondo y contenido a distinta velocidad)
  var bg = document.querySelector("[data-parallax]"), ct = document.querySelector("[data-parallax-content]");
  if (bg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var tick = false;
    var upd = function () {
      tick = false;
      var y = window.pageYOffset || 0;
      if (y > 1200) return;
      bg.style.transform = "translate3d(0," + (y * 0.35).toFixed(1) + "px,0) scale(" + (1 + Math.min(y, 600) / 6000).toFixed(4) + ")";
      if (ct) { ct.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0)"; ct.style.opacity = Math.max(0, 1 - y / 750).toFixed(3); }
    };
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // Aparición suave al hacer scroll
  var els = document.querySelectorAll("section h2,section .sub,.card,.prod,figure,.visit");
  els.forEach(function (e) { e.classList.add("rv"); });
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (a) {
    a.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();
