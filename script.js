document.addEventListener('DOMContentLoaded', () => {
  /* =======================
     HERO SLIDER (index only)
  ======================== */
  const slide1 = document.getElementById("slide1");
  const slide2 = document.getElementById("slide2");
  const shortinfo1 = document.getElementById("shortinfo1");
  const shortinfo2 = document.getElementById("shortinfo2");
  const gallery1 = document.getElementsByClassName("gallery1");
  const gallery2 = document.getElementsByClassName("gallery2");
  const vila1 = document.getElementById("vila1");
  const vila2 = document.getElementById("vila2");

  if (slide1 && slide2 && vila1 && vila2) {
    // Initial State
    slide2.classList.add("off");
    slide1.classList.remove("off");

    function showSlide1() {
      vila2.classList.remove("active");
      vila1.classList.add("active");
      slide2.classList.add("off");
      slide1.classList.remove("off");
    }
    function showSlide2() {
      vila1.classList.remove("active");
      vila2.classList.add("active");
      slide1.classList.add("off");
      slide2.classList.remove("off");
    }
    function showShortInfo(index){
      if (!shortinfo1 || !shortinfo2) return;
      if(index === 1) {
        shortinfo1.classList.remove("off"); shortinfo1.classList.add("on");
        shortinfo2.classList.add("off");    shortinfo2.classList.remove("on");
      } else {
        shortinfo2.classList.remove("off"); shortinfo2.classList.add("on");
        shortinfo1.classList.add("off");    shortinfo1.classList.remove("on");
      }
    }
    function showGallery(index){
      if (!gallery1[0] || !gallery2[0]) return; // galleries optional
      if(index === 1) {
        gallery1[0].classList.remove("off"); gallery1[0].classList.add("on");
        gallery2[0].classList.add("off");     gallery2[0].classList.remove("on");
      } else {
        gallery2[0].classList.remove("off"); gallery2[0].classList.add("on");
        gallery1[0].classList.add("off");    gallery1[0].classList.remove("on");
      }
    }

    vila1.addEventListener("click", ()=>{
      showSlide1(); showShortInfo(1); showGallery(1);
    });
    vila2.addEventListener("click", ()=>{
      showSlide2(); showShortInfo(2); showGallery(2);
    });
  }

  /* =======================
     IMAGE SHOWCASES (if any)
  ======================== */
  document.querySelectorAll(".house-showcase").forEach((showcase) => {
    const imagesContainer = showcase;
    const images = Array.from(imagesContainer.querySelectorAll(".slider-image"));
    const dotsContainer = showcase.parentElement.querySelector(".dots-container");
    if (!images.length || !dotsContainer) return;

    let currentIndex = 0;

    const prevBtn = document.createElement("button");
    prevBtn.className = "slider-btn prev";
    prevBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

    const nextBtn = document.createElement("button");
    nextBtn.className = "slider-btn next";
    nextBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

    imagesContainer.appendChild(prevBtn);
    imagesContainer.appendChild(nextBtn);

    const updateDots = () => {
      dotsContainer.innerHTML = "";
      images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === currentIndex) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    };

    const updateSlides = (fromIndex, toIndex) => {
      images.forEach((img, i) => {
        img.style.transition = "none";
        if (i === toIndex) {
          img.style.left = fromIndex < toIndex ? "100%" : "-100%";
          setTimeout(() => {
            img.style.transition = "left 0.5s ease";
            img.style.left = "0";
          }, 10);
        } else if (i === fromIndex) {
          img.style.transition = "left 0.5s ease";
          img.style.left = fromIndex < toIndex ? "-100%" : "100%";
        } else {
          img.style.left = "100%";
        }
      });
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle("active", i === toIndex);
      });
    };

    const goToSlide = (index) => {
      const targetIndex = (index + images.length) % images.length;
      if (targetIndex !== currentIndex) {
        const previousIndex = currentIndex;
        currentIndex = targetIndex;
        updateSlides(previousIndex, currentIndex);
      }
    };

    prevBtn.onclick = () => goToSlide(currentIndex - 1);
    nextBtn.onclick = () => goToSlide(currentIndex + 1);

    updateDots();
    updateSlides(0, currentIndex);

    // swipe
    let startX = 0, isDragging = false;
    const start = (e) => { isDragging = true; startX = e.touches ? e.touches[0].clientX : e.clientX; };
    const move  = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = x - startX;
      if (deltaX > 50) { goToSlide(currentIndex - 1); isDragging = false; }
      else if (deltaX < -50) { goToSlide(currentIndex + 1); isDragging = false; }
    };
    const end = () => { isDragging = false; };

    showcase.addEventListener("mousedown", start);
    showcase.addEventListener("mousemove", move);
    showcase.addEventListener("mouseup", end);
    showcase.addEventListener("mouseleave", end);
    showcase.addEventListener("touchstart", start);
    showcase.addEventListener("touchmove", move);
    showcase.addEventListener("touchend", end);
  });

  /* =======================
     LANG SWITCH (if present)
  ======================== */
  

  /* =======================
     ABOUT VIDEO (click-to-play, saves data)
  ======================== */
  (function () {
    const media = document.querySelector(".about-media");
    const video = media ? media.querySelector(".about-video") : null;
    const playBtn = media ? media.querySelector(".video-play-btn") : null;
    if (!media || !video || !playBtn) return;

    playBtn.addEventListener("click", () => {
      media.classList.add("playing");        // instant feedback: reveal player, hide poster button/overlay
      video.setAttribute("controls", "");     // native controls as a fallback if autoplay is blocked
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });

    // Play once: when it finishes, return to the poster + play button (no looping,
    // no background buffering). load() resets to the poster and, thanks to
    // preload="none", downloads nothing again until the visitor taps play.
    video.addEventListener("ended", () => {
      media.classList.remove("playing");
      video.removeAttribute("controls");
      video.load();
    });
  })();

  /* =======================
     RESERVATION (if present)
  ======================== */
  const calendarEl = document.getElementById("calendar");
  let fpInstance = null;

  // Minimal inline Romanian locale so months/weekdays always read in RO
  // (primary audience) without an extra network request.
  const roLocale = {
    weekdays: {
      shorthand: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"],
      longhand: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"]
    },
    months: {
      shorthand: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
      longhand: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
    },
    firstDayOfWeek: 1,
    rangeSeparator: " – "
  };

  function nightsBetween(inD, outD) {
    const a = new Date(inD); a.setHours(0, 0, 0, 0);
    const b = new Date(outD); b.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((b - a) / 86400000));
  }

  function updateSummary() {
    const summary = document.getElementById("resSummary");
    if (!summary) return;
    const lang = document.documentElement.getAttribute("lang") || "ro";
    const adults = getCount("adults");
    const children = getCount("children");

    const L = {
      ro: { nights: n => `${n} ${n === 1 ? "noapte" : "nopți"}`, adults: n => `${n} ${n === 1 ? "adult" : "adulți"}`, kids: n => `${n} ${n === 1 ? "copil" : "copii"}`, pickDates: "Selectează perioada dorită" },
      en: { nights: n => `${n} ${n === 1 ? "night" : "nights"}`, adults: n => `${n} ${n === 1 ? "adult" : "adults"}`, kids: n => `${n} ${n === 1 ? "child" : "children"}`, pickDates: "Select your dates above" },
      de: { nights: n => `${n} ${n === 1 ? "Nacht" : "Nächte"}`, adults: n => `${n} ${n === 1 ? "Erwachsener" : "Erwachsene"}`, kids: n => `${n} ${n === 1 ? "Kind" : "Kinder"}`, pickDates: "Wählen Sie oben Ihren Zeitraum" }
    }[lang] || null;
    const t = L || { nights: n => `${n} nights`, adults: n => `${n} adults`, kids: n => `${n} children`, pickDates: "Select dates" };

    const sel = fpInstance ? fpInstance.selectedDates : [];
    let parts = [];
    if (sel.length === 2) {
      const n = nightsBetween(sel[0], sel[1]);
      parts.push("🗓 " + t.nights(n));
    }
    parts.push("👥 " + t.adults(adults) + (children > 0 ? " + " + t.kids(children) : ""));
    summary.textContent = parts.join("  ·  ");
    summary.classList.add("show");
  }

  if (window.flatpickr && calendarEl) {
    fpInstance = flatpickr(calendarEl, {
      mode: "range",
      dateFormat: "d-m-Y",
      inline: true,
      minDate: "today",
      showMonths: 1,
      locale: roLocale,
      onChange: (selectedDates, dateStr) => {
        const hidden = document.getElementById("dateRange");
        if (hidden) hidden.value = dateStr;
        updateSummary();
      }
    });
  }

  /* ---- Guest steppers (adults / children) ---- */
  function getCount(id) {
    const el = document.getElementById(id);
    return el ? parseInt(el.textContent, 10) || 0 : 0;
  }
  document.querySelectorAll(".stepper-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      const dir = parseInt(btn.dataset.dir, 10);
      const el = document.getElementById(target);
      if (!el) return;
      const min = target === "adults" ? 1 : 0;
      const max = 40;
      let val = parseInt(el.textContent, 10) || 0;
      val = Math.min(max, Math.max(min, val + dir));
      el.textContent = val;
      updateSummary();
    });
  });

  // Keep the summary in sync when the language changes.
  document.addEventListener("langchange", updateSummary);
  if (calendarEl) updateSummary();

  window.sendToWhatsApp = function () {
    const nameEl = document.getElementById("name");
    if (!nameEl) return;
    const lang = document.documentElement.getAttribute("lang") || "ro";
    const name = nameEl.value.trim();
    const adults = getCount("adults");
    const children = getCount("children");
    const sel = fpInstance ? fpInstance.selectedDates : [];

    const alerts = {
      ro: { dates: "Vă rugăm selectați perioada (intrare și ieșire).", name: "Vă rugăm introduceți numele." },
      en: { dates: "Please select your dates (check-in and check-out).", name: "Please enter your name." },
      de: { dates: "Bitte wählen Sie Ihren Zeitraum (An- und Abreise).", name: "Bitte geben Sie Ihren Namen ein." }
    }[lang] || { dates: "Please select your dates.", name: "Please enter your name." };

    if (sel.length < 2) { alert(alerts.dates); return; }
    if (!name) { nameEl.focus(); alert(alerts.name); return; }

    const fmt = (d) => window.flatpickr ? flatpickr.formatDate(d, "d-m-Y") : d.toLocaleDateString();
    const checkin = fmt(sel[0]);
    const checkout = fmt(sel[1]);
    const nights = nightsBetween(sel[0], sel[1]);

    const guestsPhrase = {
      ro: `${adults} ${adults === 1 ? "adult" : "adulți"}${children > 0 ? ` și ${children} ${children === 1 ? "copil" : "copii"}` : ""}`,
      en: `${adults} ${adults === 1 ? "adult" : "adults"}${children > 0 ? ` and ${children} ${children === 1 ? "child" : "children"}` : ""}`,
      de: `${adults} ${adults === 1 ? "Erwachsener" : "Erwachsene"}${children > 0 ? ` und ${children} ${children === 1 ? "Kind" : "Kinder"}` : ""}`
    }[lang];

    const messages = {
      ro: `Bună ziua! Aș dori să verific disponibilitatea la Vila dintre Brazi în perioada ${checkin} – ${checkout} (${nights} ${nights === 1 ? "noapte" : "nopți"}), pentru ${guestsPhrase}. Numele meu este ${name}. Mulțumesc!`,
      en: `Hello! I'd like to check availability at Vila dintre Brazi for ${checkin} – ${checkout} (${nights} ${nights === 1 ? "night" : "nights"}), for ${guestsPhrase}. My name is ${name}. Thank you!`,
      de: `Hallo! Ich möchte die Verfügbarkeit in der Vila dintre Brazi vom ${checkin} bis ${checkout} (${nights} ${nights === 1 ? "Nacht" : "Nächte"}) für ${guestsPhrase} anfragen. Mein Name ist ${name}. Danke!`
    };
    const msg = messages[lang] || messages.ro;

    const phone = "40745306009"; // no +
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  /* =======================
     TRAILS (activities only)
  ======================== */
  (function(){
    const track = document.querySelector('#trails .t-track');
    if (!track) return;

    const prev = document.querySelector('#trails .t-prev');
    const next = document.querySelector('#trails .t-next');
    const dotsWrap = document.querySelector('#trails .t-dots');
    const cards = Array.from(track.querySelectorAll('.t-card'));
    if (!cards.length) return;

    const gap = 18;
    const cardWidth = () => cards[0].getBoundingClientRect().width + gap;
    const scrollToIndex = (i) => track.scrollTo({ left: i * cardWidth(), behavior: 'smooth' });

    const pages = Math.max(1, Math.ceil((cards.length * cardWidth() - track.clientWidth) / cardWidth()) + 1);
    for (let i=0;i<pages;i++){
      const d = document.createElement('div');
      d.className = 'dot' + (i===0?' active':'');
      d.addEventListener('click', ()=>scrollToIndex(i));
      dotsWrap && dotsWrap.appendChild(d);
    }
    const setActiveDot = () => {
      const idx = Math.round(track.scrollLeft / cardWidth());
      dotsWrap && dotsWrap.querySelectorAll('.dot').forEach((el,i)=>el.classList.toggle('active', i===idx));
    };
    track.addEventListener('scroll', () => requestAnimationFrame(setActiveDot));

    prev && prev.addEventListener('click', ()=>scrollToIndex(Math.max(0, Math.round(track.scrollLeft / cardWidth()) - 1)));
    next && next.addEventListener('click', ()=>scrollToIndex(Math.min(pages-1, Math.round(track.scrollLeft / cardWidth()) + 1)));

    const modal = document.getElementById('trail-modal');
    const closeBtn = modal ? modal.querySelector('.t-modal__close') : null;
    const titleEl = document.getElementById('trail-title');
    const iframeEl = document.getElementById('trail-iframe');
    const descEl = document.getElementById('trail-desc');

    if (!modal || !titleEl || !iframeEl || !descEl) return;

    track.addEventListener('click', (e)=>{
      const btn = e.target.closest('.t-btn');
      if (!btn) return;
      titleEl.textContent = btn.dataset.title || '';
      iframeEl.src = btn.dataset.iframe || '';
      descEl.textContent = btn.dataset.desc || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      modal.classList.remove('open');
      iframeEl.src = '';
      document.body.style.overflow = '';
    };
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  })();

  
});



