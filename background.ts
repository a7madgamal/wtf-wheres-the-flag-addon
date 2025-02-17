// Listen for tab updates to confirm extension is working
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("linkedin.com")) {
    console.error("🚩 FLAGS: Tab updated on LinkedIn");

    // Attempt to inject script manually
    chrome.scripting
      .executeScript({
        target: {tabId: tabId},
        func: () => {
          console.error("🚩 FLAGS: Manual script injection confirmed");
          window.alert("Flags Extension is ACTIVE!");
        },
      })
      .catch((error) => {
        console.error("🚨FLAGS: Script injection failed", error);
      });
  }
});

// // Log extension installation
// chrome.runtime.onInstalled.addListener(() => {
//   console.error("🎉 LINKEDIN FLAGS: Extension INSTALLED")

// })
