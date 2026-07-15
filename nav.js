/* --- NAVIGATION DRAWER --- */
const menubtn = document.getElementById("menubtn");
const mainDrawer = document.getElementById("menu");

if (menubtn && mainDrawer) {
    let savedScrollY = 0;

    // Pin the body in place. overflow:hidden alone doesn't stop touch scroll
    // on iOS Safari, so we fix the body and offset it by the current scroll.
    function lockScroll() {
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.position = "fixed";
        document.body.style.top = "-" + savedScrollY + "px";
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
    }

    function unlockScroll() {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, savedScrollY);
    }

    menubtn.addEventListener("click", () => {
        const isOpen = mainDrawer.classList.toggle("active");
        menubtn.classList.toggle("active");
        if (isOpen) lockScroll(); else unlockScroll();
    });

    mainDrawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainDrawer.classList.remove("active");
            menubtn.classList.remove("active");
            unlockScroll();
        });
    });
}

/* --- LANGUAGE SWITCHER --- */
(function () {
    const KEY = "site_lang";
    const btn = document.getElementById("langBtn");
    const langMenuDiv = document.getElementById("langMenu"); // Renamed to avoid collision
    const items = langMenuDiv ? langMenuDiv.querySelectorAll(".langdrop__item") : [];
    const nodes = () => document.querySelectorAll(".t");
    const flagSrc = { ro: "./svg/ro.svg", en: "./svg/en.svg", de: "./svg/de.svg" };

    function applyLang(lang) {
        document.documentElement.setAttribute("lang", lang);
        nodes().forEach((el) => {
            const v = el.dataset[lang];
            if (v) el.innerHTML = v;
        });
        localStorage.setItem(KEY, lang);
        if (btn) {
            btn.querySelector(".flag").src = flagSrc[lang];
            btn.querySelector(".code").textContent = lang.toUpperCase();
        }
        items.forEach((li) => (li.querySelector(".tick").textContent = li.dataset.lang === lang ? "✓" : ""));
        document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    }

    function toggle(open) {
      
      if (!langMenuDiv) return;
      const isHidden = langMenuDiv.classList.contains("hidden");
      const next = open === undefined ? !isHidden : open;
      langMenuDiv.classList.toggle("hidden", next);
      console.log(next);
    }

    applyLang(localStorage.getItem(KEY) || "ro");
    if (btn)
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggle();
        });
    items.forEach((li) =>
        li.addEventListener("click", (e) => {
            e.stopPropagation();
            applyLang(li.dataset.lang);
            toggle(false);
        }),
    );
    document.addEventListener("click", (e) =>{
      if(e.target == btn) toggle(false);
    });
})();

/* --- FOOTER YEAR --- */
(function () {
    const y = document.getElementById("footerYear");
    if (y) y.textContent = new Date().getFullYear();
})();

/* --- COOKIE CONSENT BANNER --- */
(function () {
    var KEY = "cookie_consent";
    if (localStorage.getItem(KEY)) return; // already chose

    var lang = localStorage.getItem("site_lang") || "ro";
    var T = {
        ro: { text: "Folosim cookie-uri strict necesare pentru funcționarea site-ului (ex. limba aleasă). Nu folosim cookie-uri de marketing.", more: "Detalii", accept: "Accept", reject: "Doar necesare" },
        en: { text: "We use strictly necessary cookies for the site to work (e.g. your chosen language). We do not use marketing cookies.", more: "Details", accept: "Accept", reject: "Essential only" },
        de: { text: "Wir verwenden ausschließlich notwendige Cookies für die Funktion der Website (z. B. Ihre Sprache). Keine Marketing-Cookies.", more: "Details", accept: "Akzeptieren", reject: "Nur notwendige" }
    };
    var t = T[lang] || T.ro;

    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML =
        '<p>' + t.text + ' <a href="./cookies.html">' + t.more + '</a></p>' +
        '<div class="cookie-actions">' +
        '<button class="cookie-btn reject" type="button">' + t.reject + '</button>' +
        '<button class="cookie-btn accept" type="button">' + t.accept + '</button>' +
        '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });

    function choose(value) {
        try { localStorage.setItem(KEY, value); } catch (e) {}
        banner.remove();
    }
    banner.querySelector(".accept").addEventListener("click", function () { choose("all"); });
    banner.querySelector(".reject").addEventListener("click", function () { choose("essential"); });
})();