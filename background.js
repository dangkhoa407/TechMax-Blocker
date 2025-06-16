const apiKey = "APIKEY_GEMINI";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        if (tab.url.startsWith("chrome-extension://") || (tab.url.startsWith("devtools://"))) {
            console.log("⚠️ Bỏ qua trang nội bộ của extension:", tab.url);
            return;
        }
        checkWebsite(tabId, tab.url);
    }
});


function checkWebsite(tabId, url) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (imageBase64) => {
        if (chrome.runtime.lastError) {
            console.error("Lỗi chụp màn hình:", chrome.runtime.lastError);
            return;
        }

        sendRequest(imageBase64, tabId);
    });
}

function sendRequest(imageBase64, tabId) {
    const base64Data = imageBase64.split(",")[1];
//Prompt dui dui :))
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: "Website hay sự tìm kiếm này có phải là websie không lành mạnh hay không(web giả mạo, nội dung bạo lực, web cờ bạc,..). Nhớ kiểm tra tên miền để trách việc xác định nhầm (chỉ trả lời có hoặc không)" },
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: base64Data
                        }
                    }
                ]
            }
        ]
    };

    fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Gemini Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            const result = data.candidates[0].content.parts[0].text.trim().toLowerCase();

            if (result === "có") {
                console.log("🛡️ Chặn trang web:", tabId);
                chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") }); // Chuyển hướng về blocked.html
            }
        }
    })
    .catch(err => {
        console.error("Lỗi gửi yêu cầu đến Gemini:", err);
    });
}
