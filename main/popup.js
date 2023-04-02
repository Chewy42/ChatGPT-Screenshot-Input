document.getElementById("capture").addEventListener("click", () => {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    // 在这里调用OCR API来识别文本
    const ocrApiUrl = "https://vision.googleapis.com/v1/images:annotate";
    const apiKey = "AIzaSyA7DgNWwtUPQ6iEFuvNkFLtnZ3ZPoGtI_k";
    const requestData = {
      url: ocrApiUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
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
    fetch(requestData)
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
