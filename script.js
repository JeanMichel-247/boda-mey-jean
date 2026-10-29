(() => {
  const pages = [...document.querySelectorAll(".page")];
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageCounter = document.getElementById("pageCounter");
  const openBook = document.getElementById("openBook");
  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");
  const loading = document.getElementById("loading");
  const hint = document.getElementById("gestureHint");

  let current = 0;
  let startX = null;

  const params = new URLSearchParams(window.location.search);
  const guest = params.get("invitado") || WEDDING.defaultGuest;
  const slots = Math.max(1, parseInt(params.get("lugares") || "2", 10));

  document.getElementById("guestName").textContent = guest;
  document.getElementById("guestSlots").textContent = slots;
  document.getElementById("rsvpGuest").textContent = guest;

  document.getElementById("dressCode").textContent = WEDDING.info.dressCode;
  document.getElementById("parking").textContent = WEDDING.info.parking;
  document.getElementById("extraNotes").textContent = WEDDING.info.notes;
  document.getElementById("mapsButton").href = WEDDING.event.mapsUrl;
  document.getElementById("giftMessage").textContent = WEDDING.giftMessage.trim();

  function buildGoogleCalendarUrl() {
    const start = WEDDING.event.start.replace(/[-:]/g, "").replace(".000", "");
    const end = WEDDING.event.end.replace(/[-:]/g, "").replace(".000", "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: WEDDING.event.title,
      dates: `${start}/${end}`,
      details: `Celebración de la boda de ${WEDDING.couple}.`,
      location: WEDDING.event.location
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  document.getElementById("googleCalendar").href = buildGoogleCalendarUrl();

  function downloadICS() {
    const dtStart = toICSDate(WEDDING.event.start);
    const dtEnd = toICSDate(WEDDING.event.end);
    const uid = `boda-mey-jean-${Date.now()}@github-pages`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mey y Jean//Invitacion//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toICSDate(new Date().toISOString())}`,
      `DTSTART;TZID=America/Costa_Rica:${dtStart}`,
      `DTEND;TZID=America/Costa_Rica:${dtEnd}`,
      `SUMMARY:${escapeICS(WEDDING.event.title)}`,
      `LOCATION:${escapeICS(WEDDING.event.location)}`,
      `DESCRIPTION:${escapeICS("Celebración de la boda de Mey y Jean.")}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Boda-Mey-y-Jean.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toICSDate(value) {
    return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function escapeICS(value) {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  document.getElementById("downloadIcs").addEventListener("click", downloadICS);

  function applyRSVP() {
    const button = document.getElementById("rsvpButton");
    const url = WEDDING.rsvpUrl;

    if (!url || url.includes("PEGAR_AQUI")) {
      button.href = "#";
      button.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Todavía no se ha configurado el formulario de confirmación.");
      });
      return;
    }

    // Si su formulario admite parámetros, aquí podemos añadir invitado y cantidad.
    // Para Google Forms real, conviene usar la URL de formulario prellenado.
    button.href = url;
  }

  applyRSVP();

  function updateBook() {
    pages.forEach((page, index) => {
      page.classList.toggle("flipped", index < current);
      page.style.zIndex = index < current ? index + 1 : pages.length - index;
    });

    if (current === 0) {
      pageCounter.textContent = "Portada";
    } else if (current >= pages.length) {
      pageCounter.textContent = "Fin";
    } else {
      pageCounter.textContent = `${current} / ${pages.length - 1}`;
    }

    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= pages.length;

    if (current > 0) hint.classList.add("hidden");
  }

  function next() {
    if (current < pages.length) {
      current++;
      updateBook();
      tryStartMusic();
    }
  }

  function prev() {
    if (current > 0) {
      current--;
      updateBook();
    }
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  openBook.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });

  pages.forEach((page, index) => {
    page.addEventListener("click", (e) => {
      if (e.target.closest("a,button")) return;
      if (index === current) next();
      else if (index < current) prev();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") next();
    if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
  });

  const book = document.getElementById("book");
  book.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  book.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
    startX = null;
  }, { passive: true });

  async function tryStartMusic() {
    if (!bgMusic.src || bgMusic.src.endsWith("/musica.mp3")) {
      try {
        await bgMusic.play();
        musicBtn.textContent = "🔊";
        musicBtn.setAttribute("aria-label", "Silenciar música");
      } catch (_) {
        // El navegador puede bloquear autoplay. El botón manual seguirá funcionando.
      }
    }
  }

  musicBtn.addEventListener("click", async () => {
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        musicBtn.textContent = "🔊";
      } catch (_) {
        alert("Agregue su archivo assets/musica.mp3 y vuelva a intentarlo.");
      }
    } else {
      bgMusic.pause();
      musicBtn.textContent = "🔇";
    }
  });

  window.addEventListener("load", () => {
    setTimeout(() => loading.classList.add("hidden"), 500);
    updateBook();
  });
})();
