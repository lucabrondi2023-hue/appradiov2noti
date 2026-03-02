const radio = document.getElementById("radio");
const playBtn = document.getElementById("playBtn");
let playing = false;

function togglePlay() {
  if (!playing) {
    radio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    radio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
  playing = !playing;
}

// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// BOTÓN INSTALAR
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline";
});

installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
  }
});

// ===== FONDOS ROTATIVOS =====
const fondos = [
  "fondo1.jpg",
  "fondo2.jpg"
];

let fondoActual = 0;
const bg = document.querySelector(".bg-slideshow");

function cambiarFondo() {
  bg.style.backgroundImage = `url(${fondos[fondoActual]})`;
  fondoActual = (fondoActual + 1) % fondos.length;
}

cambiarFondo();
setInterval(cambiarFondo, 8000); // cambia cada 8 segundos

// ===== VOLUMEN =====
const volumeControl = document.getElementById("volumeControl");
radio.volume = volumeControl.value / 100;

volumeControl.addEventListener("input", () => {
  radio.volume = volumeControl.value / 100;
});


// ===== MUTE =====
const muteBtn = document.getElementById("muteBtn");
let lastVolume = volumeControl.value;

function toggleMute() {
  if (radio.muted) {
    radio.muted = false;
    volumeControl.value = lastVolume;
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    radio.muted = true;
    lastVolume = volumeControl.value;
    volumeControl.value = 0;
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}


// ===============================
// ⚡ NOTIFICACIONES LOCALES AVANZADAS
// ===============================

// 🔹 CONFIGURÁ TUS HORARIOS ACÁ
const horarios = [
  { hora: "08:00", titulo: "☀ Buen día", mensaje: "Arrancamos en vivo 🎶" },
  { hora: "12:00", titulo: "🔥 Mediodía", mensaje: "Programa fuerte al aire 🎙" },
  { hora: "18:45", titulo: "🎧 Tarde", mensaje: "Seguimos acompañándote" }
];

// 🔹 Pedir permiso
async function pedirPermiso() {
  if ("Notification" in window) {
    await Notification.requestPermission();
  }
}

// 🔹 Enviar al Service Worker
function enviarAlSW(titulo, mensaje) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.controller?.postMessage({
      type: "MOSTRAR_NOTIFICACION",
      titulo,
      mensaje
    });
  }
}

// 🔹 Control anti-repetición diario
function yaEnviadoHoy(hora) {
  const hoy = new Date().toDateString();
  const registro = localStorage.getItem("notif_" + hora);
  return registro === hoy;
}

function marcarEnviado(hora) {
  const hoy = new Date().toDateString();
  localStorage.setItem("notif_" + hora, hoy);
}

// 🔹 Verificador inteligente
function verificarHorarios() {
  const ahora = new Date();
  const horaActual =
    String(ahora.getHours()).padStart(2, "0") +
    ":" +
    String(ahora.getMinutes()).padStart(2, "0");

  horarios.forEach(item => {
    if (horaActual === item.hora && !yaEnviadoHoy(item.hora)) {
      enviarAlSW(item.titulo, item.mensaje);
      marcarEnviado(item.hora);
    }
  });
}

// 🔹 Modo persistente agresivo
function iniciarSistema() {
  verificarHorarios();
  setInterval(verificarHorarios, 60000); // cada minuto
}

// 🔹 Iniciar todo
window.addEventListener("load", async () => {
  await pedirPermiso();
  iniciarSistema();

});

