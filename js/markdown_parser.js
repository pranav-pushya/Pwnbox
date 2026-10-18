/**
 * Centralized Markdown & Rich Text Parser for PwnBox
 * 
 * Provides unified, safe, high-performance Markdown rendering with:
 * - Fenced code blocks with language badges & copy triggers (Windows CRLF & POSIX compatible)
 * - Tables, blockquotes, horizontal dividers
 * - Ordered, unordered, and interactive task checklists
 * - Inline bold, italic, strikethrough, inline code, and URLs
 * - Built-in XSS sanitization via HTML entity escaping
 */

/**
 * Escape HTML special characters to prevent XSS injection.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Parse markdown table syntax into clean HTML table.
 * @param {string} text
 * @returns {string}
 */
function parseTables(text) {
    const lines = text.split('\n');
    const result = [];
    let i = 0;

    const isDivider = (line) => /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line);
    const splitCells = (line) => {
        let trimmed = line.trim();
        if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
        if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
        return trimmed.split('|').map(c => c.trim());
    };

    while (i < lines.length) {
        const line = lines[i].trim();
        if (i + 1 < lines.length && line.includes('|')) {
            const nextLine = lines[i + 1].trim();
            if (isDivider(nextLine)) {
                const headerCells = splitCells(line);
                let tableHtml = '<div class="oracle-table-wrapper"><table class="oracle-table"><thead><tr>';
                headerCells.forEach(cell => {
                    tableHtml += `<th>${cell}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';

                i += 2;
                while (i < lines.length && lines[i].trim().includes('|') && !isDivider(lines[i].trim())) {
                    const rowCells = splitCells(lines[i]);
                    tableHtml += '<tr>';
                    rowCells.forEach(cell => {
                        tableHtml += `<td>${cell}</td>`;
                    });
                    tableHtml += '</tr>';
                    i++;
                }

                tableHtml += '</tbody></table></div>';
                result.push(tableHtml);
                continue;
            }
        }
        result.push(lines[i]);
        i++;
    }

    return result.join('\n');
}

/**
 * Parse unordered lists, ordered lists, and checklists.
 * @param {string} text
 * @returns {string}
 */
function parseLists(text) {
    const lines = text.split('\n');
    const result = [];
    let inUl = false;
    let inOl = false;

    lines.forEach(line => {
        const trimmed = line.trim();

        // Task Checklists: - [ ] or - [x]
        if (/^[-*]\s+\[ \]\s+(.*)$/i.test(trimmed)) {
            if (inUl) { result.push('</ul>'); inUl = false; }
            if (inOl) { result.push('</ol>'); inOl = false; }
            const content = trimmed.replace(/^[-*]\s+\[ \]\s+/, '');
            result.push(`<div class="markdown-checklist-item"><input type="checkbox" disabled> <span>${content}</span></div>`);
            return;
        }
        if (/^[-*]\s+\[x\]\s+(.*)$/i.test(trimmed)) {
            if (inUl) { result.push('</ul>'); inUl = false; }
            if (inOl) { result.push('</ol>'); inOl = false; }
            const content = trimmed.replace(/^[-*]\s+\[x\]\s+/i, '');
            result.push(`<div class="markdown-checklist-item"><input type="checkbox" checked disabled> <span class="strikethrough">${content}</span></div>`);
            return;
        }

        // Unordered lists: - item or * item
        if (/^[-*]\s+(.*)$/.test(trimmed)) {
            if (inOl) { result.push('</ol>'); inOl = false; }
            if (!inUl) { result.push('<ul class="markdown-list">'); inUl = true; }
            const content = trimmed.replace(/^[-*]\s+/, '');
            result.push(`<li>${content}</li>`);
            return;
        }

        // Ordered lists: 1. item
        if (/^\d+\.\s+(.*)$/.test(trimmed)) {
            if (inUl) { result.push('</ul>'); inUl = false; }
            if (!inOl) { result.push('<ol class="markdown-ordered-list">'); inOl = true; }
            const content = trimmed.replace(/^\d+\.\s+/, '');
            result.push(`<li>${content}</li>`);
            return;
        }

        if (inUl) { result.push('</ul>'); inUl = false; }
        if (inOl) { result.push('</ol>'); inOl = false; }
        result.push(line);
    });

    if (inUl) result.push('</ul>');
    if (inOl) result.push('</ol>');

    return result.join('\n');
}

/**
 * Core Markdown parsing function.
 * 
 * @param {string} text - Raw Markdown string
 * @param {Object} [options]
 * @param {'oracle'|'terminal'|'standard'} [options.style='standard']
 * @returns {string} Rendered HTML string
 */
function parseMarkdown(text, options = {}) {
    if (!text || typeof text !== 'string') return '';
    const style = options.style || 'standard';

    // 1. Stash fenced code blocks before escaping HTML
    const codeBlocks = [];
    let processed = text.replace(/```([^\n\r]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
        const displayLang = (lang && lang.trim()) ? lang.trim().toUpperCase() : 'CODE';
        const rawCode = code.trim();
        const escapedCode = escapeHtml(rawCode);
        const encodedCode = encodeURIComponent(rawCode);

        let blockHtml = '';
        if (style === 'terminal') {
            blockHtml = `
                <div class="terminal-code-box">
                    <div class="terminal-code-header">
                        <div class="terminal-dots">
                            <span class="terminal-dot t-dot-red"></span>
                            <span class="terminal-dot t-dot-yellow"></span>
                            <span class="terminal-dot t-dot-green"></span>
                        </div>
                        <span class="terminal-lang-badge">${displayLang}</span>
                        <button class="terminal-copy-btn" onclick="window.copyCodeSnippet ? window.copyCodeSnippet(decodeURIComponent('${encodedCode}'), this) : navigator.clipboard.writeText(decodeURIComponent('${encodedCode}')).then(() => this.innerText = '✅ COPIED!')">
                            📋 COPY CODE
                        </button>
                    </div>
                    <pre><code>${escapedCode}</code></pre>
                </div>
            `;
        } else {
            // Standard / Oracle styling
            blockHtml = `
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <span class="code-lang-tag">${displayLang}</span>
                        <button class="code-copy-btn" onclick="window.copyCodeSnippet ? window.copyCodeSnippet(this) : (window.copyFloatingCode ? window.copyFloatingCode(this) : navigator.clipboard.writeText(decodeURIComponent('${encodedCode}')).then(() => this.innerText = 'COPIED!'))" title="Copy Code Snippet">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span>COPY</span>
                        </button>
                    </div>
                    <pre><code>${escapedCode}</code></pre>
                </div>
            `;
        }

        codeBlocks.push(blockHtml);
        return `%%%CODE_BLOCK_${codeBlocks.length - 1}%%%`;
    });

    // 2. Escape HTML entities while preserving safe tags
    processed = processed
        .replace(/&/g, "&amp;")
        .replace(/<br\s*\/?>/gi, "%%%BR_TAG%%%")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/%%%BR_TAG%%%/g, "<br>");

    // 3. Blockquotes
    processed = processed.replace(/^&gt;\s*(.*$)/gim, '<blockquote class="oracle-blockquote">$1</blockquote>');

    // 4. Horizontal dividers
    processed = processed.replace(/^(\s*[-*_]\s*){3,}$/gm, '<hr class="oracle-divider">');

    // 5. Headings
    processed = processed.replace(/^#### (.*$)/gim, '<div class="oracle-h4" style="font-weight:700;margin:6px 0;">$1</div>');
    processed = processed.replace(/^### (.*$)/gim, '<div class="oracle-h3" style="font-weight:700;margin:8px 0;">$1</div>');
    processed = processed.replace(/^## (.*$)/gim, '<div class="oracle-h2" style="font-weight:800;margin:10px 0;">$1</div>');
    processed = processed.replace(/^# (.*$)/gim, '<div class="oracle-h1" style="font-weight:800;font-size:1.25rem;margin:12px 0;">$1</div>');

    // 6. Tables & Lists
    processed = parseTables(processed);
    processed = parseLists(processed);

    // 7. Inline Formatting
    processed = processed
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/~~([^~]+)~~/g, '<span class="strikethrough">$1</span>');

    // 8. Line breaks & paragraphs
    processed = processed.replace(/\n{2,}/g, '<br><br>');
    processed = processed.replace(/\n/g, '<br>');

    // Clean up excessive <br> surrounding block tags
    processed = processed
        .replace(/<br\s*\/?>\s*(<(?:div|table|thead|tbody|tr|th|td|blockquote|hr|ul|ol|li)[^>]*>)/gi, '$1')
        .replace(/(<\/(?:div|table|thead|tbody|tr|th|td|blockquote|hr|ul|ol|li)>)\s*<br\s*\/?>/gi, '$1')
        .replace(/(<div class="oracle-table-wrapper">[\s\S]*?<\/div>)<br\s*\/?>/gi, '$1');

    // 9. Restore stashed code blocks
    codeBlocks.forEach((block, idx) => {
        processed = processed.replace(`%%%CODE_BLOCK_${idx}%%%`, block);
    });

    return processed;
}

// Global browser exposures
if (typeof window !== 'undefined') {
    window.PwnMarkdown = {
        escapeHtml,
        parseMarkdown
    };
    // Aliases for backward compatibility
    window.renderMarkdown = parseMarkdown;
    window.formatMarkdown = parseMarkdown;
}

// CommonJS / ES module support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        parseMarkdown
    };
}
