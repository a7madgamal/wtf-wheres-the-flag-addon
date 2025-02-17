// Listen for tab updates to confirm extension is working
chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
  if (changeInfo.status === "complete") {
    // Attempt to inject script manually
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: () => {
          // console.log("🚩 FLAGS: Manual script injection confirmed")
          // alert("Flags Extension is ACTIVE!");
        }
      })
      .catch((error) => {
        console.error("🚨FLAGS: Script injection failed", error)
      })
  }
})

// // Log extension installation
// chrome.runtime.onInstalled.addListener(() => {
//   console.error("🎉 LINKEDIN FLAGS: Extension INSTALLED")

// })
