(function () {
  "use strict";
  var S = window.SITIO;
  var $ = function (id) { return document.getElementById(id); };

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function enlaceWa(mensaje) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(mensaje);
  }

  function botonWa(mensaje, texto, clase) {
    var a = crear("a", clase, texto);
    a.href = enlaceWa(mensaje);
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  // Datos generales
  document.title = S.nombre + " | Servicio técnico en " + S.ciudad;
  document.querySelectorAll("[data-nombre]").forEach(function (el) { el.textContent = S.nombre; });
  document.querySelectorAll("[data-ciudad]").forEach(function (el) { el.textContent = S.ciudad; });
  document.querySelectorAll("[data-wa]").forEach(function (el) { el.href = enlaceWa(el.dataset.wa); });
  $("anio").textContent = new Date().getFullYear();
  $("aviso-config").hidden = Boolean(S.whatsapp);

  // Visitas: una por persona cada vez que abre la página. No cuenta las pruebas en esta PC o en la red local.
  (function () {
    var local = location.protocol === "file:" || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
    if (!S.contarVisitas || !S.seguimientoUrl || local) return;
    try {
      if (sessionStorage.getItem("visita-contada")) return;
      sessionStorage.setItem("visita-contada", "1");
    } catch (err) {
      // Sin almacenamiento del navegador igual se cuenta la visita.
    }
    fetch(S.seguimientoUrl + "?visita=1", { mode: "no-cors", keepalive: true }).catch(function () {});
  })();

  // Estadísticas de Cloudflare (país, origen y equipo de las visitas). Tampoco cuenta las pruebas locales.
  (function () {
    var local = location.protocol === "file:" || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
    if (!S.cloudflareToken || local) return;
    var cf = document.createElement("script");
    cf.defer = true;
    cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: S.cloudflareToken }));
    document.head.appendChild(cf);
  })();

  // Menú móvil
  var botonMenu = document.querySelector(".menu-boton");
  var menu = $("menu");
  function fijarMenu(abierto) {
    menu.classList.toggle("abierto", abierto);
    botonMenu.setAttribute("aria-expanded", String(abierto));
    botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  }
  botonMenu.addEventListener("click", function () { fijarMenu(!menu.classList.contains("abierto")); });
  menu.addEventListener("click", function (e) {
    if (!e.target.closest("a")) return;
    fijarMenu(false);
    if (document.activeElement) document.activeElement.blur();
  });

  // Cabecera al bajar
  var cabecera = document.querySelector(".cabecera");
  function marcarScroll() { cabecera.classList.toggle("con-scroll", window.scrollY > 40); }
  window.addEventListener("scroll", marcarScroll, { passive: true });
  marcarScroll();

  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hayObservador = "IntersectionObserver" in window;

  // Iconos flotantes de la portada
  var ICONOS = [
    ["#ff8a3d", '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'],
    ["#ffffff", '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>'],
    ["#ff8a3d", '<path d="M6 9V3h12v6M6 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1"/><path d="M6 14h12v7H6z"/>'],
    ["#ffc9a3", '<path d="M2 9a15 15 0 0 1 20 0M5.500 12.500a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.500h.01"/>'],
    ["#ffffff", '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
    ["#ffffff", '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 14h18M7 17h.01"/>'],
    ["#ff8a3d", '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 2v5M14 2v5M10 17v5M14 17v5M2 10h5M2 14h5M17 10h5M17 14h5"/>'],
    ["#ff8a3d", '<path d="M14.700 6.300a1 1 0 0 0 0 1.400l1.600 1.600a1 1 0 0 0 1.400 0l3.770-3.770a6 6 0 0 1-7.940 7.940l-6.910 6.910a2.120 2.120 0 0 1-3-3l6.910-6.910a6 6 0 0 1 7.940-7.940z"/>'],
    ["#ffc9a3", '<path d="M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4.500 4.500 0 0 1-.5 9z"/>']
  ];
  ICONOS.forEach(function (ic, i) {
    var f = crear("div", "ficha");
    f.style.setProperty("--c", ic[0]);
    f.style.animationDelay = (-i * 0.7) + "s";
    f.innerHTML = '<svg viewBox="0 0 24 24">' + ic[1] + "</svg>";
    $("orbe-iconos").appendChild(f);
  });

  // Título que se escribe y se borra solo
  if (!reducido) {
    var frases = ["PC y notebook", "Hogar y oficina", "Comercio", "Red y WiFi", "Impresora"];
    var textoEscrito = $("escritura-texto");
    var frase = 0;
    var letras = frases[0].length;
    var borrando = true;
    var escribir = function () {
      textoEscrito.textContent = frases[frase].slice(0, letras);
      var espera = borrando ? 40 : 85;
      if (borrando && letras === 0) {
        borrando = false;
        frase = (frase + 1) % frases.length;
        espera = 300;
      } else if (!borrando && letras === frases[frase].length) {
        borrando = true;
        espera = 1900;
      } else {
        letras += borrando ? -1 : 1;
      }
      setTimeout(escribir, espera);
    };
    setTimeout(escribir, 2200);
  }

  // Servicios
  var ICONOS_SERVICIO = {
    pc: ICONOS[7][1],
    software: ICONOS[0][1],
    impresoras: ICONOS[2][1],
    redes: ICONOS[3][1],
    empresas: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h6v6H9z"/>',
    sistemas: '<path d="M5 3v18l2.500-1.500L10 21l2-1.500 2 1.500 2.500-1.500L19 21V3l-2.500 1.500L14 3l-2 1.500L10 3 7.500 4.500z"/><path d="M8.500 9h7M8.500 13h7"/>'
  };
  var COLORES_SERVICIO = { pc: "#ff8a3d", software: "#ff8a3d", impresoras: "#ff8a3d", redes: "#ffc9a3", empresas: "#ffffff", sistemas: "#ffffff" };
  function icono(trazos, clase) {
    var d = crear("div", "icono " + clase);
    d.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + trazos + "</svg>";
    return d;
  }
  function fijarServicio(art, abierto) {
    art.classList.toggle("abierto", abierto);
    var b = art.querySelector(".servicio-ver");
    b.setAttribute("aria-expanded", String(abierto));
    b.firstChild.textContent = abierto ? "Ocultar trabajos " : "Ver trabajos ";
  }
  S.servicios.forEach(function (s) {
    var art = crear("article", "servicio");
    art.id = "servicio-" + s.id;
    var enlaceMega = crear("a");
    enlaceMega.href = "#" + art.id;
    enlaceMega.appendChild(crear("b", "", s.titulo));
    enlaceMega.appendChild(crear("small", "", s.resumen));
    $("mega").appendChild(enlaceMega);
    var iconoServicio = icono(ICONOS_SERVICIO[s.id] || ICONOS[7][1], "servicio-icono");
    iconoServicio.style.setProperty("--c", COLORES_SERVICIO[s.id] || "#ff8a3d");
    art.appendChild(iconoServicio);
    art.appendChild(crear("h3", "", s.titulo));
    art.appendChild(crear("p", "", s.resumen));
    var detalle = crear("div", "servicio-detalle");
    detalle.id = "detalle-" + s.id;
    var ul = crear("ul");
    s.items.forEach(function (it) { ul.appendChild(crear("li", "", it.nombre)); });
    detalle.appendChild(ul);
    art.appendChild(detalle);
    var acciones = crear("div", "servicio-acciones");
    var ver = crear("button", "servicio-ver", "Ver trabajos ");
    ver.type = "button";
    ver.setAttribute("aria-expanded", "false");
    ver.setAttribute("aria-controls", detalle.id);
    var flechaVer = crear("span", "", "↓");
    flechaVer.setAttribute("aria-hidden", "true");
    ver.appendChild(flechaVer);
    ver.addEventListener("click", function () { fijarServicio(art, !art.classList.contains("abierto")); });
    acciones.appendChild(ver);
    if (s.id === "empresas" && S.abonos) {
      var verAbonos = crear("a", "servicio-enlace", "Ver abonos mensuales →");
      verAbonos.href = "#abonos";
      acciones.appendChild(verAbonos);
    }
    if (s.id === "sistemas" && S.sistemaGestion) {
      var conocer = crear("a", "servicio-enlace", "Conocé el sistema →");
      conocer.href = "#sistema-gestion";
      acciones.appendChild(conocer);
    }
    acciones.appendChild(botonWa("Hola, quiero consultar por: " + s.titulo + ".", "Consultar por WhatsApp →", "servicio-enlace"));
    art.appendChild(acciones);
    $("lista-servicios").appendChild(art);
  });
  // Un enlace a un servicio (menú o pie) también abre su lista de trabajos
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#servicio-"]') : null;
    var destino = a && document.querySelector(a.getAttribute("href"));
    if (destino) fijarServicio(destino, true);
  });

  // Motivos
  var ICONOS_MOTIVO = [
    ["#c74b04", '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.300-4.300"/>'],
    ["#0c3c6c", '<path d="M12 2H4a2 2 0 0 0-2 2v8l10 10 10-10z"/><path d="M7 7h.01"/>'],
    ["#c74b04", ICONOS[4][1]],
    ["#0c3c6c", '<path d="M21 11.500a8.500 8.500 0 0 1-12.600 7.450L3 21l2.050-5.400A8.500 8.500 0 1 1 21 11.500z"/>']
  ];
  S.motivos.forEach(function (m, i) {
    var li = crear("li");
    var im = ICONOS_MOTIVO[i % ICONOS_MOTIVO.length];
    var imEl = icono(im[1], "motivo-icono");
    imEl.style.setProperty("--c", im[0]);
    li.appendChild(imEl);
    li.appendChild(crear("h3", "", m.titulo));
    li.appendChild(crear("p", "", m.texto));
    $("lista-motivos").appendChild(li);
  });

  // Cotizador
  var cuerpo = $("asistente-cuerpo");
  var titulo = $("asistente-titulo");
  var atras = $("asistente-atras");
  var marcas = document.querySelectorAll(".pasos li");
  var elegido = { categoria: null, item: null };
  var interaccion = false;

  function pintarPaso(n, texto) {
    marcas.forEach(function (m, i) { m.classList.toggle("activo", i < n); });
    titulo.textContent = "";
    titulo.appendChild(crear("span", "solo-lector", "Paso " + n + " de 3: "));
    titulo.appendChild(document.createTextNode(texto));
    cuerpo.textContent = "";
    atras.hidden = n === 1;
    atras.onclick = n === 2 ? paso1 : paso2;
    if (interaccion) titulo.focus({ preventScroll: true });
    interaccion = true;
  }

  function opcion(texto, alElegir, trazos) {
    var b = crear("button", "opcion icono");
    b.type = "button";
    if (trazos) b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + trazos + "</svg>";
    b.appendChild(document.createTextNode(texto));
    b.addEventListener("click", alElegir);
    cuerpo.appendChild(b);
  }

  function paso1() {
    pintarPaso(1, "¿Qué tipo de servicio necesitás?");
    S.servicios.forEach(function (s) {
      opcion(s.titulo, function () { elegido.categoria = s; paso2(); }, ICONOS_SERVICIO[s.id] || ICONOS[7][1]);
    });
  }

  function paso2() {
    pintarPaso(2, "¿Qué trabajo necesitás?");
    elegido.categoria.items.forEach(function (it) {
      opcion(it.nombre, function () { elegido.item = it; paso3(); });
    });
  }

  function paso3() {
    pintarPaso(3, "Enviá tu consulta");
    var it = elegido.item;
    cuerpo.appendChild(crear("p", "resultado-detalle", elegido.categoria.titulo + " · " + it.nombre));
    if (it.precio) {
      cuerpo.appendChild(crear("p", "resultado-precio", it.precio));
      cuerpo.appendChild(crear("p", "resultado-nota", "Precio orientativo. Se confirma al revisar el equipo."));
    } else {
      cuerpo.appendChild(crear("p", "resultado-nota", "Te pasamos el precio por WhatsApp según tu caso."));
    }
    var msg = "Hola, quiero pedir un presupuesto.\nServicio: " + elegido.categoria.titulo + "\nTrabajo: " + it.nombre;
    cuerpo.appendChild(botonWa(msg, "Pedir presupuesto por WhatsApp", "boton boton-wa"));
  }

  interaccion = false;
  paso1();

  // Números (solo si hay datos reales)
  if (S.estadisticas.length) {
    $("bloque-numeros").hidden = false;
    var ICONOS_NUMERO = [
      '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6"/>',
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
      '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
      '<path d="M12 3l2.800 5.700 6.200.900-4.500 4.400 1.100 6.200L12 17.300 6.400 20.200l1.100-6.200L3 9.600l6.200-.900z"/>'
    ];
    S.estadisticas.forEach(function (e, i) {
      var d = crear("div");
      d.appendChild(icono(ICONOS_NUMERO[i % ICONOS_NUMERO.length], "numero-icono"));
      var fuerte = crear("strong");
      fuerte.dataset.valor = e.valor;
      fuerte.appendChild(crear("span", "numero-cifra", e.valor));
      if (e.sufijo) fuerte.appendChild(crear("small", "", e.sufijo));
      d.appendChild(fuerte);
      d.appendChild(crear("span", "numero-texto", e.texto));
      $("lista-numeros").appendChild(d);
    });
    if (!reducido && hayObservador) {
      var contar = function (el) {
        var meta = Number(el.dataset.valor);
        if (!isFinite(meta)) return;
        var inicio = performance.now();
        var paso = function (ahora) {
          var t = Math.min((ahora - inicio) / 1600, 1);
          var suave = 1 - Math.pow(1 - t, 3);
          el.querySelector(".numero-cifra").textContent = Math.round(meta * suave);
          if (t < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      };
      new IntersectionObserver(function (entradas, obs) {
        if (!entradas[0].isIntersecting) return;
        obs.disconnect();
        document.querySelectorAll("#lista-numeros strong").forEach(contar);
      }, { threshold: 0.3 }).observe($("bloque-numeros"));
    }
  }

  // Opiniones (solo si hay datos reales)
  if (S.opiniones.length) {
    $("bloque-opiniones").hidden = false;
    if (S.googlePerfil) {
      $("opiniones-google").hidden = false;
      $("opiniones-google").firstChild.href = S.googlePerfil;
    }
    var carrusel = $("lista-opiniones");
    S.opiniones.forEach(function (o) {
      var f = crear("figure", "opinion");
      if (o.estrellas) {
        var est = crear("div", "estrellas", "★".repeat(o.estrellas));
        est.setAttribute("aria-label", o.estrellas + " de 5 estrellas");
        f.appendChild(est);
      }
      f.appendChild(crear("blockquote", "", "“" + o.texto + "”"));
      var pie = crear("figcaption");
      var iniciales = o.autor.split(" ").map(function (p) { return p.charAt(0); }).join("").slice(0, 2).toUpperCase();
      var avatar = crear("span", "avatar", iniciales);
      avatar.setAttribute("aria-hidden", "true");
      pie.appendChild(avatar);
      var quien = crear("span", "", o.autor);
      if (o.detalle) quien.appendChild(crear("small", "", o.detalle));
      pie.appendChild(quien);
      f.appendChild(pie);
      carrusel.appendChild(f);
      $("opinion-puntos").appendChild(crear("i"));
    });
    var puntos = $("opinion-puntos").children;
    var tarjetasOpinion = carrusel.children;
    var opinionActual = function () {
      var paso = tarjetasOpinion.length > 1 ? tarjetasOpinion[1].offsetLeft - tarjetasOpinion[0].offsetLeft : 1;
      return Math.round(carrusel.scrollLeft / paso);
    };
    var marcarPunto = function () {
      var actual = opinionActual();
      Array.prototype.forEach.call(puntos, function (p, i) { p.classList.toggle("activo", i === actual); });
    };
    var irAOpinion = function (n) {
      var total = tarjetasOpinion.length;
      var i = (n + total) % total;
      if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 2 && n > opinionActual()) i = 0;
      carrusel.scrollTo({ left: tarjetasOpinion[i].offsetLeft - tarjetasOpinion[0].offsetLeft, behavior: reducido ? "auto" : "smooth" });
    };
    carrusel.addEventListener("scroll", marcarPunto, { passive: true });
    $("opinion-anterior").addEventListener("click", function () { irAOpinion(opinionActual() - 1); });
    $("opinion-siguiente").addEventListener("click", function () { irAOpinion(opinionActual() + 1); });
    marcarPunto();
    if (!reducido) {
      var enPausa = false;
      var zona = carrusel.parentNode;
      zona.addEventListener("mouseenter", function () { enPausa = true; });
      zona.addEventListener("mouseleave", function () { enPausa = false; });
      zona.addEventListener("focusin", function () { enPausa = true; });
      zona.addEventListener("focusout", function () { enPausa = false; });
      setInterval(function () { if (!enPausa && !document.hidden) irAOpinion(opinionActual() + 1); }, 5000);
    }
  }

  // Cobertura
  $("cobertura-titulo").textContent = S.cobertura.zonaCorta;
  if (S.direccion) {
    var mapaGoogle = crear("iframe");
    mapaGoogle.title = "Mapa con la ubicación del local";
    mapaGoogle.loading = "lazy";
    mapaGoogle.referrerPolicy = "no-referrer-when-downgrade";
    mapaGoogle.src = "https://www.google.com/maps?q=" + encodeURIComponent(S.direccion) + "&z=15&output=embed";
    $("cobertura-mapa").appendChild(mapaGoogle);
  } else {
    $("cobertura-mapa").hidden = true;
  }
  $("cobertura-presencial").textContent = S.cobertura.presencial;
  $("cobertura-remoto").textContent = S.cobertura.remoto;
  S.cobertura.zonas.forEach(function (z) { $("cobertura-zonas").appendChild(crear("li", "", z)); });

  // Datos de contacto
  var ICONOS_CONTACTO = {
    whatsapp: '<path d="M21 11.500a8.500 8.500 0 0 1-12.600 7.450L3 21l2.050-5.400A8.500 8.500 0 1 1 21 11.500z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    correo: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    zona: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    google: '<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z"/>',
    remoto: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4M9 10.500h6M12.500 8l2.500 2.500-2.500 2.500"/>'
  };
  var mapa = S.direccion ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.direccion) : "";
  var datosContacto = [
    ["whatsapp", "WhatsApp", S.telefonoVisible, enlaceWa("Hola, necesito ayuda con un equipo.")],
    ["pin", "Dirección", S.direccion, mapa],
    ["correo", "Correo electrónico", S.email, "mailto:" + S.email],
    ["reloj", "Horario de atención", S.horario, ""],
    ["google", "Google", S.googlePerfil ? "Ver el perfil y dejar una opinión" : "", S.googlePerfil],
    ["zona", "Zona de cobertura", S.cobertura.zonaCorta, ""],
    ["remoto", "Soporte remoto", S.cobertura.remotoCorto, ""]
  ];
  function enlaceODato(valor, href) {
    var el = crear(href ? "a" : "span", "", valor);
    if (href) {
      el.href = href;
      if (href.indexOf("http") === 0) {
        el.target = "_blank";
        el.rel = "noopener";
      }
    }
    return el;
  }
  datosContacto.forEach(function (d) {
    if (!d[2]) return;
    var li = crear("li", "contacto-tarjeta");
    var icono = crear("div", "contacto-icono");
    icono.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONOS_CONTACTO[d[0]] + "</svg>";
    li.appendChild(icono);
    var texto = crear("div");
    texto.appendChild(crear("b", "", d[1]));
    texto.appendChild(enlaceODato(d[2], d[3]));
    li.appendChild(texto);
    $("datos-contacto").appendChild(li);
    if (d[0] === "reloj") {
      var estadoContacto = crear("small", "contacto-estado");
      estadoContacto.id = "estado-contacto";
      texto.appendChild(estadoContacto);
    }
    if (d[0] === "remoto" || d[0] === "zona" || d[0] === "google") return;
    var enPie = crear("li");
    enPie.appendChild(enlaceODato(d[2], d[3]));
    $("pie-contacto").appendChild(enPie);
  });

  // Servicios en el pie
  S.servicios.forEach(function (s) {
    var li = crear("li");
    li.appendChild(enlaceODato(s.titulo, "#servicio-" + s.id));
    $("pie-servicios").appendChild(li);
  });

  // Redes
  [["Facebook", S.facebook], ["Instagram", S.instagram], ["Google", S.googlePerfil]].forEach(function (r) {
    if (!r[1]) return;
    var a = crear("a", "", r[0]);
    a.href = r[1];
    a.target = "_blank";
    a.rel = "noopener";
    $("pie-redes").appendChild(a);
  });

  // Abonos de mantenimiento
  (function () {
    var A = S.abonos;
    if (!A || !A.planes || !A.planes.length) return;
    $("abonos").hidden = false;
    A.planes.forEach(function (p) {
      var art = crear("article", "plan" + (p.destacado ? " plan-destacado" : ""));
      if (p.etiqueta) art.appendChild(crear("span", "plan-etiqueta", p.etiqueta));
      art.appendChild(crear("h3", "", p.nombre));
      var precio = crear("p", "plan-precio");
      if (p.precio) {
        precio.appendChild(crear("strong", "", p.precio));
        precio.appendChild(crear("span", "", " / mes"));
      } else {
        precio.appendChild(crear("strong", "plan-consultar", "Consultá el precio"));
      }
      art.appendChild(precio);
      var ul = crear("ul");
      p.items.forEach(function (it) { ul.appendChild(crear("li", "", it)); });
      art.appendChild(ul);
      art.appendChild(botonWa("Hola, quiero información sobre el " + p.nombre + " de mantenimiento para mi negocio.", "Quiero este plan", "boton " + (p.destacado ? "boton-wa" : "boton-linea-oscura")));
      $("lista-planes").appendChild(art);
    });
    (A.comparativa || []).forEach(function (fila) {
      var tr = crear("tr");
      fila.forEach(function (celda, i) {
        var td = crear(i === 0 ? "th" : "td", celda === "Sí" ? "si" : celda === "—" ? "no" : "", celda === "—" ? "—" : celda);
        if (i === 0) td.scope = "row";
        if (celda === "—") td.setAttribute("aria-label", "No incluido");
        tr.appendChild(td);
      });
      $("tabla-abonos").appendChild(tr);
    });
    if (!A.comparativa || !A.comparativa.length) document.querySelector(".comparativa").hidden = true;
    (A.adicionales || []).forEach(function (t) { $("abonos-adicionales").appendChild(crear("li", "", t)); });
    (A.condiciones || []).forEach(function (t) { $("abonos-condiciones").appendChild(crear("li", "", t)); });
  })();

  // Sistema de gestión para comercios
  (function () {
    var G = S.sistemaGestion;
    if (!G) return;
    $("sistema-gestion").hidden = false;
    $("gestion-titulo").textContent = G.titulo;
    $("gestion-texto").textContent = G.texto;
    (G.puntos || []).forEach(function (p) { $("gestion-puntos").appendChild(crear("li", "", p)); });
    var ICONOS_GESTION = {
      caja: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4M7 8h4M7 11h7"/>',
      stock: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
      factura: '<path d="M5 3v18l2.5-1.5L10 21l2-1.5 2 1.5 2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5z"/><path d="M8.5 9h7M8.5 13h7"/>',
      reportes: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      presupuesto: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
      clientes: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>'
    };
    (G.funciones || []).forEach(function (f) {
      var li = crear("li", "gestion-funcion");
      li.appendChild(icono(ICONOS_GESTION[f.icono] || ICONOS_GESTION.caja, "gestion-icono"));
      li.appendChild(crear("h3", "", f.titulo));
      li.appendChild(crear("p", "", f.texto));
      $("gestion-funciones").appendChild(li);
    });
    (G.rubros || []).forEach(function (r) { $("gestion-rubros").appendChild(crear("li", "", r)); });
    (G.pasos || []).forEach(function (p, i) {
      var li = crear("li", "gestion-paso");
      li.appendChild(crear("span", "gestion-numero", String(i + 1)));
      li.appendChild(crear("h4", "", p.titulo));
      li.appendChild(crear("p", "", p.texto));
      $("gestion-lista-pasos").appendChild(li);
    });
    if (G.equipos) $("gestion-equipos").textContent = G.equipos;
    else $("gestion-equipos-caja").hidden = true;

    // Capturas del sistema: cambian solas y con los botones
    var fotos = document.querySelectorAll("#capturas img");
    var botonesFoto = document.querySelectorAll(".capturas-botones button");
    var fotoActual = 0;
    var mostrarFoto = function (n) {
      fotoActual = n % fotos.length;
      Array.prototype.forEach.call(fotos, function (f, i) { f.classList.toggle("activa", i === fotoActual); });
      $("capturas-marco").href = fotos[fotoActual].getAttribute("src");
      Array.prototype.forEach.call(botonesFoto, function (b, i) { b.setAttribute("aria-pressed", i === fotoActual ? "true" : "false"); });
    };
    var pausaFotos = false;
    Array.prototype.forEach.call(botonesFoto, function (b) {
      b.addEventListener("click", function () { pausaFotos = true; mostrarFoto(Number(b.dataset.captura)); });
    });
    if (!reducido) setInterval(function () { if (!pausaFotos && !document.hidden) mostrarFoto(fotoActual + 1); }, 5000);
  })();

  // Abierto o cerrado según el horario, en hora de Argentina
  var NOMBRES_DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  function minutos(hhmm) { var p = hhmm.split(":"); return Number(p[0]) * 60 + Number(p[1]); }
  function ahoraArgentina() {
    var partes = {};
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires", hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short"
    }).formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      fecha: partes.year + "-" + partes.month + "-" + partes.day,
      dia: dias[partes.weekday],
      min: Number(partes.hour) * 60 + Number(partes.minute)
    };
  }
  function sumarDias(fecha, n) {
    var d = new Date(fecha + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function tramosDelDia(dia, fecha) {
    if ((S.diasCerrado || []).indexOf(fecha) >= 0) return [];
    return (S.horarios || []).filter(function (h) { return h.dias.indexOf(dia) >= 0; })
      .map(function (h) { return [minutos(h.desde), minutos(h.hasta), h.desde, h.hasta]; })
      .sort(function (a, b) { return a[0] - b[0]; });
  }
  function estadoLocal() {
    var a = ahoraArgentina();
    var hoy = tramosDelDia(a.dia, a.fecha);
    for (var i = 0; i < hoy.length; i++) {
      if (a.min >= hoy[i][0] && a.min < hoy[i][1]) return { abierto: true, texto: "Abierto ahora · hasta las " + hoy[i][3] };
    }
    for (var j = 0; j < hoy.length; j++) {
      if (a.min < hoy[j][0]) return { abierto: false, texto: "Cerrado · abrimos hoy a las " + hoy[j][2] };
    }
    for (var n = 1; n <= 14; n++) {
      var dia = (a.dia + n) % 7;
      var tramos = tramosDelDia(dia, sumarDias(a.fecha, n));
      if (tramos.length) {
        var cuando = n === 1 ? "mañana" : "el " + NOMBRES_DIA[dia];
        return { abierto: false, texto: "Cerrado · abrimos " + cuando + " a las " + tramos[0][2] };
      }
    }
    return null;
  }
  function pintarEstado() {
    var e = estadoLocal();
    var marca = $("estado-local");
    var enContacto = $("estado-contacto");
    if (!e) { marca.hidden = true; if (enContacto) enContacto.hidden = true; return; }
    marca.hidden = false;
    marca.classList.toggle("abierto", e.abierto);
    $("estado-texto").textContent = e.texto;
    if (enContacto) {
      enContacto.textContent = e.texto;
      enContacto.classList.toggle("abierto", e.abierto);
    }
  }
  if (S.horarios && S.horarios.length && window.Intl) {
    pintarEstado();
    setInterval(pintarEstado, 60000);
  }

  // Preguntas frecuentes
  var conRespuesta = (S.preguntas || []).filter(function (p) { return p.respuesta; });
  if (conRespuesta.length) {
    $("preguntas").hidden = false;
    conRespuesta.forEach(function (p, i) {
      var det = crear("details");
      if (i === 0) det.open = true;
      var sum = crear("summary");
      sum.appendChild(crear("span", "", p.pregunta));
      sum.appendChild(crear("span", "pregunta-signo"));
      det.appendChild(sum);
      det.appendChild(crear("p", "", p.respuesta));
      $("lista-preguntas").appendChild(det);
    });
  }

  // Formulario: arma el mensaje y abre WhatsApp
  var selector = $("f-servicio");
  var sinElegir = crear("option", "", "Seleccionar servicio…");
  sinElegir.value = "";
  selector.appendChild(sinElegir);
  S.servicios.forEach(function (s) { selector.appendChild(crear("option", "", s.titulo)); });
  selector.appendChild(crear("option", "", "Otro"));
  $("formulario").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var telefono = f.telefono.value.trim();
    var msg = "Hola, soy " + f.nombre.value.trim() + "." +
      (telefono ? "\nTeléfono: " + telefono : "") +
      "\nServicio: " + f.servicio.value +
      "\nProblema: " + f.problema.value.trim();
    window.open(enlaceWa(msg), "_blank", "noopener");
  });

  // Seguir reparación
  var ETAPAS = [
    ["ingresado", "Ingresado"],
    ["diagnosticado", "Diagnosticado"],
    ["autorizado", "Autorizado"],
    ["en_proceso", "En reparación"],
    ["listo", "Listo para retirar"],
    ["entregado", "Entregado"]
  ];
  var resultado = $("resultado-seguimiento");
  var formSeguimiento = $("form-seguimiento");

  function avisoSeguimiento(texto, conWhatsapp, folio) {
    resultado.textContent = "";
    var caja = crear("div", "seguimiento-aviso");
    caja.appendChild(crear("p", "", texto));
    if (conWhatsapp) {
      var consulta = "Hola, quiero consultar por mi reparación." + (folio ? " Orden: " + folio + "." : "");
      caja.appendChild(botonWa(consulta, "Consultar por WhatsApp", "boton boton-wa"));
    }
    resultado.appendChild(caja);
  }

  function formatearFecha(valor) {
    var f = new Date(valor);
    if (isNaN(f.getTime())) return "";
    return f.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  }

  function mostrarOrden(o) {
    var posicion = ETAPAS.map(function (e) { return e[0]; }).indexOf(o.estado);
    if (posicion === -1 && o.estado !== "cancelado") {
      avisoSeguimiento("No pudimos leer el estado de tu orden. Escribinos y lo vemos.", true, o.folio);
      return;
    }
    resultado.textContent = "";
    var datos = crear("div", "seguimiento-datos");
    var izquierda = crear("div");
    izquierda.appendChild(crear("strong", "", "Orden " + o.folio));
    if (o.tipo) izquierda.appendChild(crear("span", "", o.tipo.length <= 3 ? o.tipo.toUpperCase() : o.tipo.charAt(0).toUpperCase() + o.tipo.slice(1).toLowerCase()));
    datos.appendChild(izquierda);
    var fecha = formatearFecha(o.actualizado);
    if (fecha) datos.appendChild(crear("span", "", "Última novedad: " + fecha));
    resultado.appendChild(datos);

    if (o.estado === "cancelado") {
      var aviso = crear("div", "seguimiento-aviso");
      aviso.appendChild(crear("p", "", "Esta orden figura como cancelada. Si tenés dudas, escribinos."));
      aviso.appendChild(botonWa("Hola, quiero consultar por la orden " + o.folio + ".", "Consultar por WhatsApp", "boton boton-wa"));
      resultado.appendChild(aviso);
      return;
    }

    var linea = crear("ol", "linea-estados");
    ETAPAS.forEach(function (etapa, i) {
      var cerrada = o.estado === "entregado";
      var li = crear("li", i < posicion || (cerrada && i === posicion) ? "hecho" : i === posicion ? "actual" : "");
      if (i === posicion) li.setAttribute("aria-current", "step");
      li.appendChild(crear("i", "", i < posicion || (cerrada && i === posicion) ? "✓" : ""));
      li.appendChild(document.createTextNode(etapa[1]));
      linea.appendChild(li);
    });
    resultado.appendChild(linea);

    if (typeof o.presupuesto === "number" && o.presupuesto > 0) {
      var monto = o.presupuesto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
      resultado.appendChild(crear("p", "seguimiento-presupuesto", "Presupuesto: " + monto));
    }
  }

  formSeguimiento.addEventListener("submit", function (e) {
    e.preventDefault();
    var folio = formSeguimiento.folio.value.trim();
    var codigo = formSeguimiento.codigo.value.trim().toUpperCase();
    if (!folio || !codigo) {
      avisoSeguimiento("Completá el número de orden y el código.");
      return;
    }
    if (!S.seguimientoUrl) {
      avisoSeguimiento("La consulta en línea todavía no está disponible. Escribinos y te contamos cómo va.", true, folio);
      return;
    }
    var boton = formSeguimiento.querySelector("button");
    boton.disabled = true;
    boton.textContent = "Consultando…";
    resultado.textContent = "";
    var controlador = new AbortController();
    var limite = setTimeout(function () { controlador.abort(); }, 25000);
    fetch(S.seguimientoUrl + "?folio=" + encodeURIComponent(folio) + "&codigo=" + encodeURIComponent(codigo), { signal: controlador.signal })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.ok && r.orden) {
          mostrarOrden(r.orden);
        } else if (r.error === "demasiados_intentos") {
          avisoSeguimiento("Hubo demasiados intentos con esa orden. Probá de nuevo en 15 minutos o escribinos.", true, folio);
        } else {
          avisoSeguimiento("No encontramos una orden con esos datos. Revisá el número y el código en tu nota de ingreso.", true, folio);
        }
      })
      .catch(function () {
        avisoSeguimiento("No pudimos hacer la consulta. Probá de nuevo en un rato o escribinos.", true, folio);
      })
      .finally(function () {
        clearTimeout(limite);
        boton.disabled = false;
        boton.textContent = "Consultar";
      });
  });

  if (reducido || !hayObservador) return;

  // Aparición al bajar por la página
  var observadorRevelar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      var el = entrada.target;
      observadorRevelar.unobserve(el);
      el.classList.add("visible");
      setTimeout(function () {
        el.classList.remove("revelar", "visible");
        el.style.transitionDelay = "";
      }, 1100);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    ".seccion .insignia, .seccion h2, .encabezado > p:last-child, .contacto-titulo > p:last-child, .servicio, .motivos li, .asistente, .seguimiento-caja, .cobertura-mapa, .cobertura-info, .formulario, .contacto-tarjeta, .numeros > div, .carrusel-zona, .preguntas details, .gestion-texto, .gestion-ilustracion, .gestion-funcion, .gestion-paso, .gestion-rubros, .plan, .abonos-extra > div"
  ).forEach(function (el) {
    var hermanos = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.classList.add("revelar");
    el.style.transitionDelay = (hermanos % 3) * 90 + "ms";
    observadorRevelar.observe(el);
  });

  // Menú: marca la sección que se está viendo
  var enlacesMenu = document.querySelectorAll('.menu > a[href^="#"], .menu-grupo > a');
  var observadorMenu = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      enlacesMenu.forEach(function (a) {
        a.classList.toggle("activa", a.getAttribute("href") === "#" + entrada.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "servicios", "cotizador", "seguimiento", "cobertura", "contacto"].forEach(function (id) {
    observadorMenu.observe($(id));
  });
})();
