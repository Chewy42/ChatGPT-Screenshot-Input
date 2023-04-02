document.getElementById("capture").addEventListener("click", () => {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    // 在这里调用OCR API来识别文本
    const ocrApiUrl = "https://vision.googleapis.com/v1/images:annotate";
    const apiKey = "AIzaSyD1eOkchyfZu1BZ2gtIk1R7aph6m4_cPjA"; // 请替换为您的实际API密钥
    const requestData = {
      url: ocrApiUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${apiKey}`,
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: dataUrl.split(",")[1],
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      }),
    };
    fetch(requestData.url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body,
    })
      .then((response) => response.json())
      .then((ocrResult) => {
        const extractedText = ocrResult["responses"][0]["textAnnotations"][0]["description"];
        // 将提取到的文本插入到ChatGPT输入框
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const code = `
            document.querySelector('.input-container textarea').value = \`${extractedText}\`;
          `;
          chrome.tabs.executeScript(tabs[0].id, { code });
        });
      })
      .catch((error) => console.error("Error:", error));
  });
});
