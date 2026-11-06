// ─────────────────────────────────────────────────────────────
//  DATOS DE TU NEGOCIO: todo lo que hay que cambiar está acá.
//  Los campos vacíos ("") y las listas vacías ([]) no se muestran.
// ─────────────────────────────────────────────────────────────
window.SITIO = {
  nombre: "Facundo MT Computación",
  ciudad: "Barranqueras, Chaco",

  // Solo números, con código de país. Ejemplo Argentina: "5493624000000"
  whatsapp: "5493624168183",
  telefonoVisible: "362 416-8183",
  email: "facundomt.st@gmail.com",
  horario: "Lunes a viernes de 09:00 a 12:30 y de 17:00 a 20:30",
  direccion: "Diagonal Eva Perón 251, Barranqueras, Chaco",
  facebook: "https://www.facebook.com/facundo.facundomt",  // enlace completo, por ejemplo "https://www.facebook.com/tu.pagina"
  instagram: "https://www.instagram.com/facundomt.st/",  // enlace completo, por ejemplo "https://www.instagram.com/tu.usuario"
  googlePerfil: "",    // enlace a tu perfil de Google Maps (en Maps: Compartir > Copiar vínculo)

  // Horario para el aviso "Abierto ahora". Días: 1 lunes ... 6 sábado, 0 domingo.
  horarios: [
    { dias: [1, 2, 3, 4, 5], desde: "09:00", hasta: "12:30" },
    { dias: [1, 2, 3, 4, 5], desde: "17:00", hasta: "20:30" }
  ],
  // Días que no abrís aunque sean hábiles (feriados, vacaciones), en formato "AAAA-MM-DD".
  diasCerrado: [],

  // Estadísticas de Cloudflare Web Analytics: pegá acá el token que te da Cloudflare.
  cloudflareToken: "c3c14911f4b14156b93fa971e0f0cea5",

  // Dirección del puente de seguimiento (termina en /exec). Ver D:\ReparaTech\seguimiento\INSTRUCCIONES.md
  seguimientoUrl: "https://script.google.com/macros/s/AKfycbypOuSRglwsY4zZB-_UbFHSWqwTMpdwi1Syx1xfxmSnYklmQL5IWlndYkE7E5Qs4Bmh/exec",

  // Cuenta visitas en la hoja "Visitas" de la planilla del puente. Solo lo ves vos.
  contarVisitas: true,

  cobertura: {
    zonaCorta: "Barranqueras y alrededores",
    remotoCorto: "Para todo el país, sin mover el equipo",
    presencial: "Atención en taller y a domicilio en Barranqueras y alrededores.",
    remoto: "Soporte remoto para todo el país, sin que tengas que mover el equipo.",
    zonas: []            // ["Centro", "Zona norte", "Barrio X"]
  },

  // Se muestran solo si completás números reales.
  // Ejemplo: { valor: 500, sufijo: "+", texto: "Equipos reparados" }
  estadisticas: [
    { valor: 3600, sufijo: "+", texto: "Clientes atendidos" },
    { valor: 26, sufijo: "", texto: "Años de experiencia" },
    { valor: 6500, sufijo: "+", texto: "Servicios realizados" }
  ],

  // Se muestran solo si cargás opiniones reales de tus clientes.
  // Ejemplo: { texto: "Me recuperaron todas las fotos.", autor: "María G.", detalle: "Clienta", estrellas: 5 }
  opiniones: [],

  // "precio" es opcional. Si lo dejás vacío, el cotizador ofrece
  // pedir el precio por WhatsApp. Ejemplo: precio: "$20.000 a $35.000"
  servicios: [
    {
      id: "pc", titulo: "PC y notebooks",
      resumen: "Si no prende, va lento o hace ruidos raros, lo revisamos y te decimos qué tiene.",
      items: [
        { nombre: "Diagnóstico de fallas", precio: "" },
        { nombre: "Limpieza y cambio de pasta térmica", precio: "" },
        { nombre: "Ampliación de RAM y cambio a disco SSD", precio: "" },
        { nombre: "Cambio de pantalla, teclado o batería", precio: "" },
        { nombre: "Armado de PC a medida", precio: "" },
        { nombre: "Recuperación de datos", precio: "" }
      ]
    },
    {
      id: "software", titulo: "Software y soporte remoto",
      resumen: "Muchos problemas se resuelven sin mover el equipo: nos conectamos y lo vemos juntos.",
      items: [
        { nombre: "Instalación de Windows y programas", precio: "" },
        { nombre: "Eliminación de virus", precio: "" },
        { nombre: "Copias de seguridad", precio: "" },
        { nombre: "Soporte remoto", precio: "" },
        { nombre: "Puesta a punto de un equipo lento", precio: "" }
      ]
    },
    {
      id: "impresoras", titulo: "Impresoras",
      resumen: "Inkjet, láser y térmicas (comanderas): reparación, mantenimiento, recargas y configuración.",
      items: [
        { nombre: "Reparación de impresoras inkjet y láser", precio: "" },
        { nombre: "Reparación de impresoras térmicas (comanderas)", precio: "" },
        { nombre: "Mantenimiento preventivo y correctivo", precio: "" },
        { nombre: "Limpieza de cabezales y sistemas de impresión", precio: "" },
        { nombre: "Recarga de cartuchos y tóners", precio: "" },
        { nombre: "Solución de problemas de impresión", precio: "" },
        { nombre: "Reparación de mecanismos de alimentación de papel", precio: "" },
        { nombre: "Cambio de rodillos, fusores y componentes", precio: "" },
        { nombre: "Instalación y configuración de impresoras", precio: "" },
        { nombre: "Configuración de comanderas para sistemas POS", precio: "" },
        { nombre: "Configuración de conexiones USB, Ethernet, Wi-Fi y Bluetooth", precio: "" },
        { nombre: "Diagnóstico de fallas electrónicas", precio: "" }
      ]
    },
    {
      id: "redes", titulo: "Redes y WiFi",
      resumen: "Internet estable en toda la casa o la oficina, con el cableado bien hecho.",
      items: [
        { nombre: "Configuración de router y WiFi", precio: "" },
        { nombre: "Mejora de señal en zonas sin cobertura", precio: "" },
        { nombre: "Cableado estructurado", precio: "" },
        { nombre: "Compartir archivos e impresoras", precio: "" }
      ]
    },
    {
      id: "empresas", titulo: "Empresas y comercios",
      resumen: "Un técnico de confianza para que tu negocio no se frene por un problema de sistemas.",
      items: [
        { nombre: "Mantenimiento mensual", precio: "" },
        { nombre: "Puesta en marcha de puestos de trabajo", precio: "" },
        { nombre: "Servidores y respaldos", precio: "" },
        { nombre: "Visita técnica programada", precio: "" }
      ]
    },
    {
      id: "sistemas", titulo: "Sistemas de gestión y facturación de comercios",
      resumen: "Ordená las ventas, el stock y la facturación electrónica con ARCA en un solo sistema.",
      items: [
        { nombre: "Sistema de gestión para tu comercio", precio: "" },
        { nombre: "Facturación electrónica con ARCA (ex AFIP)", precio: "" },
        { nombre: "Control de stock y ventas", precio: "" },
        { nombre: "Instalación y capacitación", precio: "" }
      ]
    }
  ],

  // Preguntas frecuentes. Las que tienen la respuesta vacía no se muestran.
  preguntas: [
    { pregunta: "¿Cuánto cuesta revisar mi equipo?", respuesta: "" },
    { pregunta: "¿Me dicen el precio antes de reparar?", respuesta: "Sí. Primero revisamos el equipo y te pasamos el presupuesto. No hacemos ningún trabajo hasta que lo apruebes." },
    { pregunta: "¿Cuánto tarda una reparación?", respuesta: "" },
    { pregunta: "¿Van a domicilio?", respuesta: "Sí. Atendemos en el taller y a domicilio en Barranqueras y alrededores." },
    { pregunta: "¿Se puede resolver sin llevar el equipo?", respuesta: "Muchos problemas de software se resuelven con soporte remoto: nos conectamos a tu equipo por internet, desde cualquier lugar del país." },
    { pregunta: "¿El trabajo tiene garantía?", respuesta: "Sí. Si la misma falla vuelve, revisamos el equipo de nuevo." },
    { pregunta: "¿Cómo sé cómo va mi reparación?", respuesta: "Entrá en «Seguir reparación» con el número de orden y el código de tu nota de ingreso. Además te avisamos por WhatsApp cuando esté listo." },
    { pregunta: "¿Qué formas de pago aceptan?", respuesta: "" },
    { pregunta: "¿Instalan sistemas de facturación para comercios?", respuesta: "Sí. Instalamos sistemas de gestión con facturación electrónica de ARCA, control de stock y ventas, y te enseñamos a usarlos." }
  ],

  // Revisá que puedas cumplir cada una de estas promesas.
  motivos: [
    { titulo: "Primero el diagnóstico", texto: "Te explicamos qué tiene el equipo, sin vueltas y sin palabras raras." },
    { titulo: "Precio antes de reparar", texto: "No tocamos nada hasta que apruebes el presupuesto." },
    { titulo: "Garantía del trabajo", texto: "Si la misma falla vuelve, la revisamos de nuevo." },
    { titulo: "Seguimiento por WhatsApp", texto: "Te avisamos cómo va tu equipo y cuándo lo podés retirar." }
  ]
};
