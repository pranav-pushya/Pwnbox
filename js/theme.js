
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark' || currentTheme === 'matrix' || currentTheme === 'cyberpunk' || currentTheme === 'synthwave') ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
