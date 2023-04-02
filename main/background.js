chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureText') {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (imageDataUrl) => {
      recognizeText(imageDataUrl).then((recognizedText) => {
        sendResponse({recognizedText});
      });
    });
    return true; // Keep the message channel open for async response
  }
});

async function recognizeText(imageDataUrl) {
  // 使用OCR API识别截图中的文本
