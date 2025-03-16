(function () {
    let darkModeStyle = null;

    function createDarkModeStyle() {
        const style = document.createElement('style');
        style.id = 'dark-mode-style';
        style.textContent = `
            html {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
            
            /* Invert back images, videos, and iframes */
            img, video, iframe, canvas {
                filter: invert(100%) hue-rotate(180deg) !important;
            }

            /* Special handling for sites that are already dark */
            [data-theme="dark"] {
                filter: none !important;
            }
            
            /* Fix for specific dark-themed websites */
            body[class*="dark"], 
            html[class*="dark"],
            [data-color-mode="dark"] {
                filter: none !important;
            }
        `;
        return style;
    }

    function toggleDarkMode(enable) {
        if (enable) {
            if (!darkModeStyle) {
                darkModeStyle = createDarkModeStyle();
                document.head.appendChild(darkModeStyle);
            }
        } else {
            if (darkModeStyle) {
                darkModeStyle.remove();
                darkModeStyle = null;
            }
        }
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "toggle") {
            toggleDarkMode(message.state);
        }
    });

    // Check initial state when page loads
    chrome.storage.local.get('isDarkMode', ({ isDarkMode }) => {
        if (isDarkMode) {
            toggleDarkMode(true);
        }
    });
})();
