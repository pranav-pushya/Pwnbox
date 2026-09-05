document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;

    const sidebar = document.querySelector('.sidebar');
    const sidebarResizer = document.getElementById('sidebarResizer');
    
    const detailsPanel = document.querySelector('.details-panel');
    const panelResizer = document.getElementById('panelResizer');
    const chatPanel = document.querySelector('.chat-panel');
    const contentSplit = document.querySelector('.content-split');

    let isResizingSidebar = false;
    let isResizingPanel = false;

    if (sidebarResizer) {
        sidebarResizer.addEventListener('mousedown', (e) => {
            isResizingSidebar = true;
            document.body.style.cursor = 'col-resize';
            sidebarResizer.classList.add('dragging');
        });
    }

    if (panelResizer) {
        panelResizer.addEventListener('mousedown', (e) => {
            isResizingPanel = true;
            document.body.style.cursor = 'col-resize';
            panelResizer.classList.add('dragging');
            
            // Convert flex ratios to fixed percentages to make dragging smooth
            const totalWidth = contentSplit.getBoundingClientRect().width - panelResizer.offsetWidth;
            const detailsWidth = detailsPanel.getBoundingClientRect().width;
            const chatWidth = chatPanel.getBoundingClientRect().width;
            
            detailsPanel.style.flex = 'none';
            chatPanel.style.flex = 'none';
            detailsPanel.style.width = `${(detailsWidth / totalWidth) * 100}%`;
            chatPanel.style.width = `${(chatWidth / totalWidth) * 100}%`;
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (!isResizingSidebar && !isResizingPanel) return;

        if (isResizingSidebar) {
            // Constrain sidebar width between 200px and 500px
            let newWidth = e.clientX;
            if (newWidth < 200) newWidth = 200;
            if (newWidth > 500) newWidth = 500;
            sidebar.style.width = `${newWidth}px`;
            sidebar.style.flex = 'none';
        }

        if (isResizingPanel) {
            // Get the bounding box of the content split container
            const containerRect = contentSplit.getBoundingClientRect();
            // Calculate the mouse position relative to the container
            let offset = e.clientX - containerRect.left;
            
            // Constrain
            if (offset < 200) offset = 200;
            if (offset > containerRect.width - 300) offset = containerRect.width - 300; // chat min width ~300

            const totalWidth = containerRect.width - panelResizer.offsetWidth;
            const detailsPercent = (offset / totalWidth) * 100;
            const chatPercent = 100 - detailsPercent;

            detailsPanel.style.width = `${detailsPercent}%`;
            chatPanel.style.width = `${chatPercent}%`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizingSidebar) {
            isResizingSidebar = false;
            sidebarResizer.classList.remove('dragging');
            document.body.style.cursor = '';
        }
        if (isResizingPanel) {
            isResizingPanel = false;
            panelResizer.classList.remove('dragging');
            document.body.style.cursor = '';
        }
    });
});
