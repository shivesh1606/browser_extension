document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-dark-mode');
    const modeText = document.getElementById('mode-text');
    
    // Check initial state
    chrome.storage.local.get('isDarkMode', ({ isDarkMode }) => {
        updateButtonState(isDarkMode || false);
    });

    toggleButton.addEventListener('click', () => {
        chrome.storage.local.get('isDarkMode', ({ isDarkMode }) => {
            const newState = !isDarkMode;
            chrome.storage.local.set({ isDarkMode: newState });
            updateButtonState(newState);
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "toggle",
                    state: newState 
                });
            });
        });
    });

    function updateButtonState(isDark) {
        if (isDark) {
            toggleButton.classList.add('dark');
            modeText.textContent = 'Dark Mode';
        } else {
            toggleButton.classList.remove('dark');
            modeText.textContent = 'Light Mode';
        }
    }
});
