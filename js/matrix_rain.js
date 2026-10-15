/**
 * PWNBOX CYBER COMMAND - RED / BLUE / GREEN MATRIX RAIN CANVAS
 * High-performance, theme-aware cascading cyber matrix glyph streams.
 */

(function () {
    'use strict';

    const canvas = document.getElementById('matrix-rain-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cyber characters: Katakana, Hex, Binary, Tech symbols
    const CHARS = '0101010101ABCDEF0123456789ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ<>{}[]/*+-~#$!&?%@';
    const fontSize = 15;
    let columns = Math.floor(width / fontSize);

    // Drops state: y-coordinate of each column
    let drops = [];
    // Color palettes for each column: Red, Blue, Green
    let columnColors = [];

    const PALETTES = [
        // RED STREAM
        { lead: '#ffffff', trail: '#ff3b30', glow: '#d9291c', faint: 'rgba(217, 41, 28, 0.35)' },
        // BLUE / CYAN STREAM
        { lead: '#ffffff', trail: '#00f0ff', glow: '#0070f3', faint: 'rgba(0, 112, 243, 0.35)' },
        // GREEN STREAM
        { lead: '#ffffff', trail: '#00ff88', glow: '#10b981', faint: 'rgba(16, 185, 129, 0.35)' }
    ];

    function initColumns() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = [];
        columnColors = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Staggered drop start
            // Cycle or randomly pick Red, Blue, Green
            columnColors[i] = PALETTES[i % 3];
        }
    }

    initColumns();
    window.addEventListener('resize', initColumns);

    let lastDraw = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for authentic matrix cascade

    function draw(timestamp) {
        requestAnimationFrame(draw);

        if (timestamp - lastDraw < fpsInterval) return;
        lastDraw = timestamp;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Semi-transparent trailing clear
        ctx.fillStyle = isDark ? 'rgba(10, 13, 22, 0.1)' : 'rgba(244, 244, 240, 0.12)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'Space Mono', monospace, sans-serif`;

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            const palette = columnColors[i];

            // Leading bright head character
            ctx.fillStyle = palette.lead;
            ctx.shadowBlur = 8;
            ctx.shadowColor = palette.trail;
            ctx.fillText(char, x, y);

            // Trailing character
            if (drops[i] > 1) {
                const prevChar = CHARS[Math.floor(Math.random() * CHARS.length)];
                ctx.fillStyle = palette.trail;
                ctx.shadowBlur = 4;
                ctx.shadowColor = palette.glow;
                ctx.fillText(prevChar, x, y - fontSize);
            }

            // Reset shadow to prevent slow rendering
            ctx.shadowBlur = 0;

            // Reset drop to top randomly after leaving screen
            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
                // Alternate palette to keep red, blue, green flowing dynamically
                columnColors[i] = PALETTES[Math.floor(Math.random() * 3)];
            }

            drops[i]++;
        }
    }

    requestAnimationFrame(draw);
})();
