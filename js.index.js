document.addEventListener("DOMContentLoaded", () => {
                const checkboxes = document.querySelectorAll('#filterForm input[type="checkbox"]');
                const cards = document.querySelectorAll('.card');
                const noToursMessage = document.getElementById('noToursMessage');
                const clearBtn = document.getElementById("clearCategories");
                const toggleBtn = document.getElementById("toggleFilters");
                const filterForm = document.getElementById("filterForm");

                const lengthButtons = [
                    document.getElementById('categoriebox1'), // short
                    document.getElementById('categoriebox2'), // medium
                    document.getElementById('categoriebox3'), // long
                    document.getElementById('categoriebox4')  // extreme
                ];

                function updateCards() {
                    // Alle aktiven Kategorien aus den Filter-Checkboxen
                    const activeCategories = Array.from(checkboxes)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);

                    // Aktive Längenbuttons
                    const activeLengths = lengthButtons
                        .filter(btn => btn.checked)
                        .map(btn => btn.id === 'categoriebox1' ? 'short' :
                                    btn.id === 'categoriebox2' ? 'medium' :
                                    btn.id === 'categoriebox3' ? 'long' :
                                    'extreme');

                    let anyVisible = false;

                    cards.forEach(card => {
                        const cardCats = card.dataset.categories.split(',').map(c => c.trim());
                        let cardLength = null;
                            if (card.classList.contains('short')) cardLength = 'short';
                            else if (card.classList.contains('medium')) cardLength = 'medium';
                            else if (card.classList.contains('long')) cardLength = 'long';
                            else if (card.classList.contains('extreme')) cardLength = 'extreme';

                        // Karte anzeigen, wenn:
                        // 1) alle Checkbox-Kategorien in data-categories enthalten sind UND
                        // 2) die Karte zu einem aktiven Längenbutton gehört (oder kein Längenbutton aktiv)
                        const matchesCategories = activeCategories.every(cat => cardCats.includes(cat));
                        const matchesLength = activeLengths.length === 0 || activeLengths.includes(cardLength);

                        if ((activeCategories.length === 0 && activeLengths.length === 0) || (matchesCategories && matchesLength)) {
                            card.style.display = 'block';
                            anyVisible = true;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    noToursMessage.style.display = anyVisible ? 'none' : 'block';
                }

                // Checkboxen und Buttons beobachten
                checkboxes.forEach(cb => cb.addEventListener('change', updateCards));
                lengthButtons.forEach(btn => btn.addEventListener('change', updateCards));

                // Clear Button
                clearBtn.addEventListener("click", () => {
                    checkboxes.forEach(cb => cb.checked = false);
                    lengthButtons.forEach(btn => btn.checked = false);
                    updateCards();
                });

                // Toggle Filter Form
                toggleBtn.addEventListener("click", () => {
                    filterForm.classList.toggle("show");
                    toggleBtn.setAttribute("aria-expanded", filterForm.classList.contains("show"));
                });

                // Collapsible Fieldsets
                document.querySelectorAll(".collapsible legend").forEach(legend => {
                    legend.addEventListener("click", () => {
                        const fieldset = legend.parentElement;
                        fieldset.classList.toggle("open");
                        const isOpen = fieldset.classList.contains("open");
                        legend.innerHTML = legend.textContent.replace(/▾|▴/, "") + (isOpen ? " ▴" : " ▾");
                    });
                });

                // Initial einmal ausführen
                updateCards();

                // Jahr automatisch setzen
                const yearElement = document.getElementById('year');
                const currentYear = new Date().getFullYear();
                yearElement.textContent = currentYear;

                // Suche
                const searchInput = document.getElementById('search');
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    let anyVisible = false;

                    cards.forEach(card => {
                        const textContent = card.querySelector('.cardheader').textContent.toLowerCase();
                        if (textContent.includes(searchTerm)) {
                            card.style.display = 'block';
                            anyVisible = true;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    noToursMessage.style.display = anyVisible ? 'none' : 'block';
                });
            });

            (() => {

            const STORAGE_KEY = "soundsEnabled";

            const sounds = [
                "audio/bell.01.mp3",
                "audio/bell.02.mp3",
                "audio/bell.03.mp3",
                "audio/bell.04.mp3",
                "audio/bell.05.mp3"
            ];

            let soundsEnabled =
                localStorage.getItem(STORAGE_KEY) !== "false";

            function playRandomSound() {
                if (!soundsEnabled) return;

                const audio = new Audio(
                sounds[Math.floor(Math.random() * sounds.length)]
                );
                audio.volume = 0.4;
                audio.play().catch(() => {});
            }

            function toggleSounds(btn) {
                soundsEnabled = !soundsEnabled;
                localStorage.setItem(STORAGE_KEY, soundsEnabled);
                btn.textContent = soundsEnabled ? "🔊 Sound an" : "🔇 Sound aus";
            }

            // Alle Sound-Buttons automatisch finden
            document.addEventListener("click", (e) => {

                // sound-button-1, sound-button-2, ...
                if (e.target.id && e.target.id.startsWith("sound-button-")) {
                playRandomSound();
                }

                if (e.target.id === "sound-toggle") {
                toggleSounds(e.target);
                }

            });

            })();

            const settingsButton = document.getElementById("settings-button");
                const settingsPage = document.getElementById("settings-page");
                const closeButton = document.getElementById("close-settings");

                settingsButton.addEventListener("click", () => {
                    settingsPage.style.display = "flex";
                });

                closeButton.addEventListener("click", () => {
                    settingsPage.style.display = "none";
                });

                const deFlag = document.getElementById("de-flag");
                const enFlag = document.getElementById("en-flag");

                function setLanguage(lang) {
                if (lang === "de") {
                    deFlag.classList.add("active");
                    enFlag.classList.remove("active");
                } else {
                    enFlag.classList.add("active");
                    deFlag.classList.remove("active");
                }

                // Speichern im localStorage
                localStorage.setItem("selectedLanguage", lang);

                // Optional: Texte übersetzen
                translatePage(lang);
                }

                // Event Listener
                deFlag.addEventListener("click", () => setLanguage("de"));
                enFlag.addEventListener("click", () => setLanguage("en"));

                // Beim Laden die gespeicherte Sprache übernehmen
                const savedLang = localStorage.getItem("selectedLanguage") || "de";
                setLanguage(savedLang);

                // Beispiel-Funktion zum Übersetzen (kann dein vorheriges data-Attribut-System nutzen)
                function translatePage(lang) {
                document.querySelectorAll("[data-en]").forEach(el => {
                    el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-de");
                });
                }

                const translations = {
                    "de": {
                        "Länge": "Length",
                        "Höhenmeter": "Elevation",
                        "Rückfahrt": "Return",
                        "Checkpoints": "Checkpoints",
                        "Download": "Download"
                    },
                    "en": {
                        "Länge": "Länge",
                        "Höhenmeter": "Höhenmeter",
                        "Rückfahrt": "Rückfahrt",
                        "Checkpoints": "Checkpoints",
                        "Download": "Download"
                    }
                };

                function translateTextWords(lang) {
                    const allTextNodes = document.querySelectorAll(".cardcontent, .cardheader, button, label");
                    
                    allTextNodes.forEach(el => {
                        Object.keys(translations[lang]).forEach(word => {
                            const regex = new RegExp(`\\b${word}\\b`, "g");
                            el.innerHTML = el.innerHTML.replace(regex, translations[lang][word]);
                        });
                    });
                }

                function setLanguage(lang) {
                deFlag.classList.toggle("active", lang === "de");
                enFlag.classList.toggle("active", lang === "en");

                localStorage.setItem("selectedLanguage", lang);

                translatePage(lang);      // bestehende Übersetzung via data-en
                translateTextWords(lang); // Übersetzung der festen Wörter
            }

            function translatePage(lang) {
                // Übersetze alle Elemente mit data-en / data-de
                document.querySelectorAll("[data-en]").forEach(el => {
                    if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                        el.placeholder = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-de");
                    } else {
                        el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-de");
                    }
                });
            }


           const button = document.getElementById('toggleFilters');
            const form = document.getElementById('pageopening');

            button.addEventListener('click', () => {
                form.classList.toggle('hidden'); // Klasse ein-/ausschalten
                const expanded = form.classList.contains('hidden') ? 'false' : 'true';
                button.setAttribute('aria-expanded', expanded);
            });