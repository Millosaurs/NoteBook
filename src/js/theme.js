'use strict';

const toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const $themeBtn = document.querySelector('[data-theme-btn]');
    $themeBtn.classList.add('animate');
    setTimeout(() => {
        $themeBtn.classList.remove('animate');
    }, 500); // Adjust this value to match your animation duration
}

const storedTheme = localStorage.getItem('theme');
console.log("🚀 ~ file: theme.js:4 ~ storedTheme:", storedTheme);

const systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (systemThemeIsDark ? 'dark' : 'light');
console.log("🚀 ~ file: theme.js:6 ~ systemThemeIsDark:", systemThemeIsDark);

window.addEventListener('DOMContentLoaded', function () {
    const $themeBtn = document.querySelector('[data-theme-btn]');
    if ($themeBtn) $themeBtn.addEventListener('click', toggleTheme);
});
