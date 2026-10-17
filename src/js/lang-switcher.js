// 1. Функція встановлення / оновлення First-party куки
function setLangCookie(langCode) {
  const domain = window.location.hostname;
  const cookieValue = langCode === 'en' ? '/uk/en' : '/uk/uk';
  
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; SameSite=Lax; Secure`;
  document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax; Secure`;
}

// 2. Функція ініціализации Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'uk', 
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// 3. Безпечне підключення скрипта Google через head (без insertBefore)
(function() {
  const gt = document.createElement('script');
  gt.type = 'text/javascript';
  gt.async = true;
  gt.src = 'https://google.com';
  
  if (document.head) {
    document.head.appendChild(gt);
  } else {
    document.documentElement.appendChild(gt);
  }
})();

// 4. Логіка керування слайдером у хедері
document.addEventListener("DOMContentLoaded", () => {
  const radioEn = document.getElementById("lang-en");
  const radioUa = document.getElementById("lang-ua");

  if (!radioEn || !radioUa) return;

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const currentTrans = getCookie('googtrans');
  if (currentTrans && currentTrans.includes('/en')) {
    radioEn.checked = true;
  } else {
    radioUa.checked = true;
  }

  radioEn.addEventListener("change", () => {
    setLangCookie('en');
    window.location.reload();
  });

  radioUa.addEventListener("change", () => {
    setLangCookie('uk');
    window.location.reload();
  });
});
