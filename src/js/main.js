'use strict';

// Мобільна навігація. Стан кнопки синхронізується з aria-expanded.
const menuToggle = document.querySelector('[data-nav-toggle]');
const navigation = document.querySelector('[data-navigation]');

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Відкрити меню');
    navigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Відкрити меню' : 'Закрити меню');
    navigation.classList.toggle('is-open', !isOpen);
  });

  // Закриваємо мобільне меню після переходу за посиланням або натискання Escape.
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Повертаємо стан меню до desktop-режиму при збільшенні вікна.
  window.matchMedia('(min-width: 48rem)').addEventListener('change', closeMenu);
}

// Автоматично оновлюємо рік у футері.
const yearElement = document.querySelector('[data-current-year]');
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
