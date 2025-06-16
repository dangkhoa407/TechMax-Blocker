document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle");
    const statusText = document.getElementById("status");

    chrome.storage.local.get("isBlocking", function (data) {
        const isBlocking = data.isBlocking !== false;
        updateUI(isBlocking);
    });

    toggleButton.addEventListener("click", function () {
        chrome.storage.local.get("isBlocking", function (data) {
            const isBlocking = !data.isBlocking;
            chrome.storage.local.set({ isBlocking: isBlocking }, function () {
                updateUI(isBlocking);
            });
        });
    });

  
});
