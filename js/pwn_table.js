/**
 * PWNBOX CYBER COMMAND - REUSABLE DATA TABLE COMPONENT
 * Features:
 * - Instant click-to-sort column headers with ascending/descending toggle
 * - Smart numeric vs alphanumeric detection
 * - Client-side pagination bar with custom page-size
 * - Zero dependency vanilla JS compatible with all Pwnbox tables
 */

(function () {
    'use strict';

    const PwnDataTable = {
        attach: function (table, options = {}) {
            if (typeof table === 'string') {
                table = document.querySelector(table);
            }
            if (!table) return;
            if (table._pwnTableInstance) return table._pwnTableInstance;
            table.dataset.pwnTableInit = 'true';

            const pageSize = options.pageSize || (table.dataset.pageSize ? parseInt(table.dataset.pageSize, 10) : 0);
            let currentPage = 1;
            let currentSortCol = -1;
            let currentSortAsc = true;

            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');
            if (!thead || !tbody) return;

            const headers = Array.from(thead.querySelectorAll('th'));
            table.classList.add('pwn-table-enhanced');

            // 1. Column Sorting Setup
            headers.forEach((th, colIdx) => {
                if (th.classList.contains('no-sort')) return;
                th.classList.add('pwn-sortable-th');
                th.style.cursor = 'pointer';
                th.style.userSelect = 'none';

                const indicator = document.createElement('span');
                indicator.className = 'pwn-sort-indicator';
                indicator.style.marginLeft = '6px';
                indicator.style.fontSize = '0.7em';
                indicator.style.opacity = '0.5';
                indicator.innerHTML = '⇅';
                th.appendChild(indicator);

                th.addEventListener('click', () => {
                    if (currentSortCol === colIdx) {
                        currentSortAsc = !currentSortAsc;
                    } else {
                        currentSortCol = colIdx;
                        currentSortAsc = true;
                    }

                    headers.forEach(h => {
                        const ind = h.querySelector('.pwn-sort-indicator');
                        if (ind) {
                            ind.innerHTML = '⇅';
                            ind.style.opacity = '0.5';
                            ind.style.color = '';
                        }
                    });

                    indicator.innerHTML = currentSortAsc ? '▲' : '▼';
                    indicator.style.opacity = '1';
                    indicator.style.color = 'var(--bauhaus-yellow, #eab308)';

                    sortRows(colIdx, currentSortAsc);
                    if (pageSize > 0) renderPagination();
                });
            });

            function sortRows(colIdx, asc) {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((a, b) => {
                    const cellA = a.children[colIdx] ? a.children[colIdx].innerText.trim() : '';
                    const cellB = b.children[colIdx] ? b.children[colIdx].innerText.trim() : '';

                    const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
                    const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

                    const isNumeric = !isNaN(numA) && !isNaN(numB) && cellA.match(/\d/);
                    if (isNumeric) {
                        return asc ? numA - numB : numB - numA;
                    }
                    return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });

                rows.forEach(r => tbody.appendChild(r));
            }

            // 2. Pagination Setup
            let paginationBar = null;
            function renderPagination() {
                if (pageSize <= 0) return;
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const totalPages = Math.ceil(rows.length / pageSize) || 1;
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;

                rows.forEach((r, idx) => {
                    const start = (currentPage - 1) * pageSize;
                    const end = start + pageSize;
                    r.style.display = (idx >= start && idx < end) ? '' : 'none';
                });

                if (!paginationBar) {
                    paginationBar = document.createElement('div');
                    paginationBar.className = 'pwn-table-pagination-bar';
                    paginationBar.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-family:"Space Mono", monospace; font-size:0.75rem;';
                    table.parentNode.insertBefore(paginationBar, table.nextSibling);
                }

                paginationBar.innerHTML = `
                    <span style="color:var(--text-muted, #888);">Showing page ${currentPage} of ${totalPages} (${rows.length} total entries)</span>
                    <div style="display:flex; gap:6px;">
                        <button class="pwn-pag-btn prev" ${currentPage === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : 'style="cursor:pointer;"'}>◀ PREV</button>
                        <button class="pwn-pag-btn next" ${currentPage === totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : 'style="cursor:pointer;"'}>NEXT ▶</button>
                    </div>
                `;

                const prevBtn = paginationBar.querySelector('.pwn-pag-btn.prev');
                const nextBtn = paginationBar.querySelector('.pwn-pag-btn.next');
                if (prevBtn && currentPage > 1) {
                    prevBtn.onclick = () => { currentPage--; renderPagination(); };
                }
                if (nextBtn && currentPage < totalPages) {
                    nextBtn.onclick = () => { currentPage++; renderPagination(); };
                }
            }

            if (pageSize > 0) {
                renderPagination();
            }

            const instance = {
                sort: (col, asc) => sortRows(col, asc),
                setPage: (p) => { currentPage = p; renderPagination(); },
                refresh: () => { if (pageSize > 0) renderPagination(); }
            };
            table._pwnTableInstance = instance;
            return instance;
        },

        initAll: function () {
            const targets = document.querySelectorAll('.pwn-table, .sortable-table, .career-table, .leaderboard-table');
            targets.forEach(t => PwnDataTable.attach(t));
        }
    };

    window.PwnDataTable = PwnDataTable;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', PwnDataTable.initAll);
    } else {
        PwnDataTable.initAll();
    }
})();
