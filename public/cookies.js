// Slapukų sutikimo valdymo skriptas

// Slapukų funkcijos
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Local Storage funkcijos
function setLocalStorage(name, value) {
  try {
    localStorage.setItem(name, value);
    return true;
  } catch (e) {
    console.error("Local storage neveikia: ", e);
    return false;
  }
}

function getLocalStorage(name) {
  try {
    return localStorage.getItem(name);
  } catch (e) {
    console.error("Local storage neveikia: ", e);
    return null;
  }
}

// Google Analytics valdymas
function enableGoogleAnalytics() {
  // Įdiegti Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-NB8G02H5G2");

  // Dinamiškai įkelti Google Analytics skriptą
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-NB8G02H5G2";
  document.head.appendChild(script);
}

// Slapukų sutikimo komponento funkcija
function initCookieConsent() {
  // Patikriname, ar vartotojas jau davė sutikimą (tikriname tiek localStorage, tiek cookies)
  const cookieConsent = getCookie("cookie_consent");
  const localStorageConsent = getLocalStorage("cookie_consent");

  if (cookieConsent !== null || localStorageConsent !== null) {
    // Jei sutikimas jau duotas bet kuriuo būdu, įjungiame Google Analytics
    enableGoogleAnalytics();
    return;
  }

  // Sukuriame slapukų sutikimo komponentą
  const cookieConsentElement = document.createElement("div");
  cookieConsentElement.className = "cookie-consent active";
  cookieConsentElement.innerHTML = `
    <div class="cookie-consent-content">
      <h3>Sveiki! 👋</h3>
      <p>Informuojame, kad šioje svetainėje naudojami slapukai (angl. Cookies) siekiant užtikrinti geriausią naršymo patirtį. Naudojame būtinus slapukus svetainės veikimui ir analitinius slapukus (Google Analytics). Savo duotą sutikimą bet kada galėsite pakeisti spustelėję „Slapukų nuostatos" puslapio apačioje.</p>
      
      <div class="cookie-consent-options">
        <div class="cookie-consent-option">
          <input type="checkbox" id="necessary-cookies" checked disabled>
          <label for="necessary-cookies">Būtinieji slapukai (privalomi)</label>
        </div>
        <div class="cookie-consent-option">
          <input type="checkbox" id="analytics-cookies" checked disabled>
          <label for="analytics-cookies">Analitiniai slapukai (Google Analytics)</label>
        </div>
      </div>
    </div>
    
    <div class="cookie-buttons">
      <button class="cookie-btn btn-policy">Žr. slapukų politiką</button>
      <button class="cookie-btn btn-accept-all">Sutinku</button>
    </div>
  `;

  // Pridedame komponentą į dokumentą
  document.body.appendChild(cookieConsentElement);

  // Pridedame mygtukų valdymą
  const acceptAllButton = cookieConsentElement.querySelector(".btn-accept-all");
  const policyButton = cookieConsentElement.querySelector(".btn-policy");
  const analyticsCookiesCheckbox =
    cookieConsentElement.querySelector("#analytics-cookies");

  // Priimti visus slapukus
  acceptAllButton.addEventListener("click", function () {
    saveCookiePreferences();
  });

  // Atidaryti slapukų politiką
  policyButton.addEventListener("click", function () {
    window.location.href = "./cookie-policy.html";
  });

  // Išsaugoti slapukų nuostatas
  function saveCookiePreferences() {
    // Analitiniai slapukai visada įjungti
    const analyticsConsent = true;

    // Išsaugome sutikimą tiek slapuke (1 metams), tiek localStorage
    setCookie(
      "cookie_consent",
      `necessary:true,analytics:${analyticsConsent}`,
      365
    );

    // Išsaugome ir į localStorage, kad veiktų stabiliau
    setLocalStorage(
      "cookie_consent",
      `necessary:true,analytics:${analyticsConsent}`
    );

    // Įjungiame Google Analytics
    enableGoogleAnalytics();

    // Paslepiame slapukų sutikimo komponentą
    cookieConsentElement.classList.remove("active");
  }
}

// Slapukų nuostatų mygtukas puslapio apačioje
function addCookieSettingsButton() {
  const footer = document.querySelector(".footer-content");
  if (!footer) return;

  const cookieSettingsButton = document.createElement("p");
  cookieSettingsButton.innerHTML =
    '<a href="#" id="cookie-settings">Slapukų nuostatos</a>';
  footer.appendChild(cookieSettingsButton);

  document
    .getElementById("cookie-settings")
    .addEventListener("click", function (e) {
      e.preventDefault();
      // Ištriname esamą sutikimą iš visų vietų
      document.cookie =
        "cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Bandome ištrinti ir iš localStorage
      try {
        localStorage.removeItem("cookie_consent");
      } catch (e) {
        console.error("Nepavyko ištrinti iš localStorage: ", e);
      }

      // Perkrauname puslapį, kad vėl parodytų sutikimo langą
      window.location.reload();
    });
}

// Inicijuojame, kai dokumentas užkrautas
document.addEventListener("DOMContentLoaded", function () {
  initCookieConsent();
  addCookieSettingsButton();
});
