
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    const newTheme = (currentTheme === 'dark' || currentTheme === 'matrix' || currentTheme === 'cyberpunk' || currentTheme === 'synthwave') ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Global Hotkey: Press 'T' or 't' anywhere on the website to toggle between dark and light mode
document.addEventListener('keydown', function (e) {
    if (e.key === 't' || e.key === 'T') {
        // Do not trigger if user is holding modifier keys (Ctrl, Alt, Meta/Command)
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        // Do not trigger if typing in an input field, textarea, select box, or contenteditable element
        const activeEl = document.activeElement;
        const activeTag = activeEl ? activeEl.tagName : '';
        const isEditable = activeEl ? (activeEl.isContentEditable || activeEl.getAttribute('contenteditable') === 'true') : false;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || isEditable) return;

        toggleTheme();
    }
});

