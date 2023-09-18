export function showPopup(site: string, category: string, id: string) {
  // chrome.runtime.sendMessage(
  //     {
  //         message: "showPopup",
  //         site,
  //         category,
  //         id
  //     },
  // );

  const supportedWebsites = ["farfetch", "amazon", 'footlocker'];
  const supportedCategories = ["mens clothing", "mens shoes"];

  if (supportedWebsites.includes(site) && supportedCategories.includes(category)) {

    console.log("Popup displaying");
    displayPopup();
  }
}

export async function getEmail(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: "getEmail" }, (response) => {
      resolve(response.email);
    });
  });
}

function displayPopup() {
  console.log("Popup displaying")
  const contentPopup: any = document.getElementById("crx-content-root");
  if (contentPopup) {
    contentPopup.style.display = "block";
  }
}
