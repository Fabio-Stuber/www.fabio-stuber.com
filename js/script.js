function updateTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    };
}
updateTheme();

fetch('elements/navigation.html')
    .then(response => response.text())
    .then(data => {
        const navContainer = document.getElementById('navigation');
        navContainer.innerHTML = data;
        navContainer.classList.add('sticky', 'top-0', 'z-50', 'shadow-sm');
        initHeaderScripts();
    });

function initHeaderScripts() {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "index.html" || currentPage === "index" || currentPage === undefined) {
        currentPage = "/";
    };

    const activeLinks = document.querySelectorAll(`#navigation nav a[href="${currentPage}"]`);
    activeLinks.forEach(link => {
        link.classList.remove('text-gray-500', 'dark:text-gray-400');
        link.classList.add('text-teal-500', 'dark:text-teal-400', 'font-bold');
    });

    const activeLinks2 = document.querySelectorAll(`#navigation li a[href="${currentPage}"]`);
    activeLinks2.forEach(link => {
        link.classList.remove('text-gray-500', 'dark:text-gray-400');
        link.classList.add('text-teal-500', 'dark:text-teal-400', 'font-bold');
    });

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('hidden');
        });
    };

    // Dunkelmodus-Knopf Logik
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                localStorage.theme = 'light';
            } else {
                localStorage.theme = 'dark';
            }
            updateTheme();
        });
    };
};

// Fusszeile (Footer) laden
fetch('elements/footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('footer');
        footerContainer.innerHTML = data;
        initFooterScripts();
    });

function initFooterScripts() {
    const yearSpan = document.getElementById('copyrightYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    };

    const mailLinks = document.querySelectorAll('.secureMail');
    const telLinks = document.querySelectorAll('.secureTel');

    const mUser = "Fabio.Stuber";
    const mDomain = "outlook.com";
    const tFull = "+41797300926";

    mailLinks.forEach(link => {
        link.addEventListener('mouseover', () => { link.href = "mailto:" + mUser + "@" + mDomain; });
        link.addEventListener('touchstart', () => { link.href = "mailto:" + mUser + "@" + mDomain; });
    });

    telLinks.forEach(link => {
        link.addEventListener('mouseover', () => { link.href = "tel:" + tFull; });
        link.addEventListener('touchstart', () => { link.href = "tel:" + tFull; });
    });
};

// Cookie-Banner laden
fetch('elements/Cookie-banner.html')
    .then(response => response.text())
    .then(data => {
        const cookieContainer = document.getElementById('cookieBanner');
        cookieContainer.innerHTML = data;
        cookieContainer.classList.add('fixed', 'bottom-4', 'left-4', 'right-4', 'md:left-auto', 'md:max-w-md', 'bg-gray-100', 'dark:bg-gray-900', 'border', 'border-gray-200', 'dark:border-gray-800', 'p-6', 'rounded-lg', 'shadow-xl', 'z-50', 'transition-all', 'duration-300', 'transform', 'translate-y-0');
        initCookieScripts();
    });

function initCookieScripts() {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");
    const declineBtn = document.getElementById("declineCookies");

    if (banner && acceptBtn && declineBtn) {
        if (localStorage.getItem("cookieBannerDecision")) {
            banner.classList.add("hidden");
        } else {
            banner.classList.remove("hidden");
        }

        // In deiner js/script.js bei initCookieScripts():
        acceptBtn.addEventListener("click", function () {
            localStorage.setItem("cookieBannerDecision", "accepted");
            banner.classList.add("hidden");
            loadGoogleAnalytics(); // Startet Google Analytics nach Zustimmung
        });

        // Wenn die Entscheidung schon früher "accepted" war, direkt laden:
        if (localStorage.getItem("cookieBannerDecision") === "accepted") {
            loadGoogleAnalytics();
        }

        // Neue Funktion zum dynamischen Laden von Google Analytics
        function loadGoogleAnalytics() {
            // Ersetze 'G-XXXXXXXXXX' mit deiner echten Google Analytics ID
            const gaId = 'G-8D4W3TJ3YZ';

            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script1);

            const script2 = document.createElement('script');
            script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { 'anonymize_ip': true });
    `;
            document.head.appendChild(script2);
        }

        declineBtn.addEventListener("click", function () {
            localStorage.setItem("cookieBannerDecision", "declined");
            banner.classList.add("hidden");
        });
    };
};
// HINTERGRUND-ELEMENTE
function initDynamicBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.className = "hidden md:block fixed inset-0 pointer-events-none opacity-20 select-none z-[-10] overflow-hidden";

    const colors = ['text-teal-400', 'text-white', 'text-teal-500', 'text-gray-500', 'text-teal-300', 'text-gray-400'];

    // Etwas weniger Elemente (z.B. 40-70) reichen oft fuer einen tollen Effekt und sparen viel Leistung
    const anzahlDinger = Math.floor(Math.random() * 30) + 40;
    const parallaxElemente = [];

    for (let i = 0; i < anzahlDinger; i++) {
        const shape = document.createElement('div');
        // 'will-change' sagt dem Browser, dass dieses Teil sich bewegen wird -> schaltet den Turbo ein
        shape.className = 'absolute transition-opacity duration-300 will-change-transform';
        shape.textContent = '⭓';

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomLeft = Math.random() < 0.5 ? (Math.random() * 25) : (75 + Math.random() * 25);

        const randomTop = Math.floor(Math.random() * 100);
        const randomSize = Math.random() * (3.0 - 0.8) + 0.8;

        const scrollGeschwindigkeit = Math.random() * 2.5 - 1.0;
        const drehGeschwindigkeit = (Math.random() * 2 - 1) * 0.5;
        const startRotation = Math.floor(Math.random() * 360);

        shape.classList.add(randomColor);
        shape.style.top = randomTop + '%';
        shape.style.left = randomLeft + '%';
        shape.style.fontSize = randomSize + 'rem';
        shape.style.transform = `translate3d(0, 0, 0) rotate(${startRotation}deg)`;

        bgContainer.appendChild(shape);

        parallaxElemente.push({
            element: shape,
            speed: scrollGeschwindigkeit,
            rotSpeed: drehGeschwindigkeit,
            startRot: startRotation
        });
    }

    document.body.appendChild(bgContainer);

    // Optimiertes Scrollen
    window.addEventListener('scroll', () => {
        const scrollAbstand = window.scrollY;

        parallaxElemente.forEach(punkt => {
            const bewegung = scrollAbstand * punkt.speed * 0.4;
            const drehung = punkt.startRot + (scrollAbstand * punkt.rotSpeed);

            // 'translate3d' nutzt die Grafikkarte des Rechners, das laeuft viel fluessiger
            punkt.element.style.transform = `translate3d(0, ${bewegung}px, 0) rotate(${drehung}deg)`;
        });
    });
}

// SCROLL-ANIMATIONEN
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-16');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, {
        rootMargin: "-10% 0px",
        threshold: 0.05
    });

    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        if (section.classList.contains('relative') && section.querySelector('h1')) {
            return;
        }

        if (section.classList.contains('no-scroll-anim')) {
            return;
        }

        section.classList.add('transition-all', 'duration-1000', 'ease-out', 'opacity-0', 'translate-y-16');
        observer.observe(section);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDynamicBackground();
    initScrollAnimations();
});

// Funktion fuer das Kreativ-Koffein-Barometer
function initKoffeinBarometer() {
    const coffeeCountEl = document.getElementById('coffee-count');
    const weatherStatusEl = document.getElementById('weather-status');
    const kreativStatusEl = document.getElementById('kreativ-status');

    if (!coffeeCountEl || !weatherStatusEl || !kreativStatusEl) return;

    const apiKey = '7015fce581324669ac5ce71c9ae0c359';
    const city = 'Herzogenbuchsee,CH';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`;

    let wetterBonus = 0;
    let wetterBeschreibung = "Sonne (geschätzt)";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Netzwerk-Fehler');
            return response.json();
        })
        .then(data => {
            wetterBeschreibung = data.weather[0].description;
            const wetterHauptgruppe = data.weather[0].main.toLowerCase();
            const temp = Math.round(data.main.temp);

            weatherStatusEl.textContent = `${wetterBeschreibung} bei ${temp}°C`;

            if (wetterHauptgruppe.includes('rain') || wetterHauptgruppe.includes('drizzle') || wetterHauptgruppe.includes('snow')) {
                wetterBonus = 3;
            } else if (wetterHauptgruppe.includes('clouds')) {
                wetterBonus = 1;
            }

            berechneStatus(wetterBonus, wetterBeschreibung);
        })
        .catch(error => {
            console.log('Wetter-API konnte nicht geladen werden, nutze Standardwerte.');
            weatherStatusEl.textContent = "Gemütlich warm im Büro";
            berechneStatus(0, "Zimmertemperatur");
        });

    function berechneStatus(bonus, beschreibung) {
        const jetzt = new Date();
        const stunde = jetzt.getHours();
        let kaffees = 0;
        let statusText = "";

        if (stunde >= 5 && stunde < 9) {
            kaffees = 1 + Math.floor((stunde - 5) * 0.5) + bonus;
            statusText = `Guten Morgen! Der Tag erwacht in Herzogenbuchsee. Der Koffeinspiegel wird gerade hochgefahren, um die ersten kreativen Layouts des Tages zu skizzieren.`;
        } else if (stunde >= 9 && stunde < 14) {
            kaffees = 4 + Math.floor((stunde - 9) * 1) + bonus;
            statusText = `E Guete! Die Hälfte des Tages ist geschafft. Webseiten werden gebaut, der Code fliesst und der Kaffee löscht die kreativen Denkblockaden.`;
        } else if (stunde >= 14 && stunde < 19) {
            kaffees = 8 + Math.floor((stunde - 14) * 1.2) + bonus;
            statusText = `Endspurt oder bereits im Fürabe! Perfekte Zeit für finale Design-Schliffe oder die Vorbereitungen für das nächste Event.`;
        } else {
            kaffees = 12 + bonus;
            statusText = `Nachtmodus aktiv. Entweder läuft ein Server-Update, ein kreatives Spätprojekt oder ich schlafe bereits, während die Kaffeemaschine sich für morgen regeneriert.`;
        }

        if (bonus > 0) {
            statusText += ` Wegen dem heutigen Wetter (${beschreibung}) gibt es heute einen automatischen Extra-Koffein-Bonus!`;
        }

        coffeeCountEl.textContent = `${kaffees} Tassen Kaffee`;
        kreativStatusEl.textContent = statusText;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initKoffeinBarometer();
});


// AUTOMATISCHE INTEGRATION DER BLOG-BEITRÄGE
function initAutomaticBlog() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    // 1. Sitemap.xml laden, um alle vorhandenen Links zu finden
    fetch('sitemap.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const urls = Array.from(data.querySelectorAll('url'));
            const blogUrls = [];

            urls.forEach(url => {
                const loc = url.querySelector('loc').textContent;
                // Filtern: Nur Links, die im Ordner /blog/ liegen und auf .html enden
                if (loc.includes('/blog/') && loc.endsWith('.html')) {
                    // Letzte Änderung aus der Sitemap als Fallback-Datum nutzen
                    const lastmod = url.querySelector('lastmod') ? url.querySelector('lastmod').textContent : new Date().toISOString();
                    blogUrls.push({ url: loc, date: new Date(lastmod) });
                }
            });

            // Nach Datum sortieren (neueste zuerst)
            blogUrls.sort((a, b) => b.date - a.date);

            if (blogUrls.length === 0) {
                container.innerHTML = '<div class="col-span-full text-center py-12 font-mono text-gray-500">Noch keine Blogbeitraege verfuegbar.</div>';
                return;
            }

            container.innerHTML = ''; // Lade-Text entfernen

            // 2. Fuer jeden Blog-Link die echten HTML-Inhalte für Titel & Beschreibung auslesen
            blogUrls.forEach(blogItem => {
                fetch(blogItem.url)
                    .then(res => res.text())
                    .then(htmlStr => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlStr, 'text/html');

                        // Daten aus den Meta-Tags oder Fallbacks holen
                        const title = doc.querySelector('title')?.textContent.split('|')[0].trim() || 'Blogbeitrag';
                        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'Klicke hier, um den ganzen Beitrag zu lesen.';

                        // Optionales Beitragsbild aus OpenGraph Meta-Tag auslesen (falls vorhanden)
                        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;

                        // Datum schoen formatieren
                        const formatiertesDatum = blogItem.date.toLocaleDateString('de-CH', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        });

                        // Blog-Karte erstellen
                        const article = document.createElement('article');
                        article.className = "bg-gray-100 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 rounded-xl overflow-hidden hover:border-teal-500/20 dark:hover:border-teal-400/20 transition duration-300 relative group flex flex-col justify-between";

                        // HTML-Struktur der Karte (Wechselt zwischen Bild oder Muster-Icon, falls kein Bild da ist)
                        let imageHtml = `
                            <div class="absolute -right-8 -top-8 text-gray-200 dark:text-gray-800/40 text-9xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">⭓</div>
                        `;

                        if (image) {
                            imageHtml = `
                                <div class="w-full h-48 overflow-hidden relative border-b border-gray-200/30 dark:border-gray-800/30">
                                    <img src="${image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                                </div>
                            `;
                        }

                        article.innerHTML = `
                            ${imageHtml}
                            <div class="p-6 flex flex-col justify-between h-full grow">
                                <div>
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase">${formatiertesDatum}</span>
                                        <span class="text-gray-300 dark:text-gray-700">•</span>
                                        <span class="text-xs font-mono text-gray-500 dark:text-gray-400">Beitrag</span>
                                    </div>
                                    <h2 class="text-xl font-black tracking-tight uppercase text-gray-800 dark:text-white leading-tight mb-3">
                                        ${title}
                                    </h2>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans text-justify mb-4">
                                        ${description}
                                    </p>
                                </div>
                                <div>
                                    <hr class="border-gray-200 dark:border-gray-800/80 my-3" />
                                    <div class="pt-1">
                                        <a href="${blogItem.url}" class="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-bold uppercase tracking-wider text-xs group/link transition-colors">
                                            Beitrag lesen
                                            <span class="inline-block transition-transform duration-300 group-hover/link:translate-x-2 text-sm leading-none">➔</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `;

                        container.appendChild(article);
                    });
            });
        })
        .catch(err => {
            console.error('Fehler beim Laden der Blogbeitraege:', err);
            container.innerHTML = '<div class="col-span-full text-center py-12 font-mono text-gray-500">Fehler beim Laden der Blog-Uebersicht.</div>';
        });
}

// Event-Listener zum Starten hinzufügen
document.addEventListener("DOMContentLoaded", () => {
    initAutomaticBlog();
});