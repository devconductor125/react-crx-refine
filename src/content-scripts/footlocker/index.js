//https://www.farfetch.com/shopping/men/shoes-2/items.aspx

const sizeValuesSelector = "ol[aria-describedby=sizeMensShoes]";
const removeAllFilterSelector = "a[aria-label='Clear All Filters']";

load();

async function load() {
  // Send a message to the background script to request the popup when the URL matches
  //chrome.runtime.sendMessage({ message: "showPopup" });

  // Inform the background script to track this tab
  chrome.runtime.sendMessage({ message: "TrackTab" });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "PageReloaded") {
      console.log("Page reloaded, extension should open again");
    }
  });
}

chrome.runtime.onMessage.addListener((msgObj) => {
  if (msgObj.message == "run") {
    loadFilterAndRun();
  }
});

async function loadFilterAndRun() {
  //   console.log("Getting shoe size:");
  const value = await chrome.storage.sync.get(["shoeSize"]);
  //   console.log("Res: ");
  //   console.log(value);
  //   console.log("Value:");
  console.log(value.shoeSize);
  const shoeSize = value.shoeSize;

  selectSize(shoeSize);
}

async function selectSize(shoeSize) {
  // DeselectAll
  await delayMs();
  const deseletFilter = document.querySelector(removeAllFilterSelector);
  deseletFilter?.click();

  await delayMs(1500);

  // Open show size filter list
  const sizeBtn = document.querySelector("#sizeMens");
  const isExpanded = sizeBtn.getAttribute("aria-expanded");
  if (isExpanded == "false") sizeBtn.click();
  await delayMs();

  // Select filter
  const sizeUl = document.querySelector(sizeValuesSelector);
  const li = getLiByInnerText(sizeUl, shoeSize);
  li.click();
}

async function delayMs(delay = 500) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getLiByInnerText(ul, text) {
  const elements = ul.getElementsByTagName("li");
  let element;
  for (let i = 0; i < elements.length; i++) {
    const nameElement = elements[i].querySelector(".name");

    if (parseFloat(nameElement.innerHTML) == parseFloat(text)) {
      element = elements[i].querySelector("label");
      break;
    }
  }
  return element;
}
