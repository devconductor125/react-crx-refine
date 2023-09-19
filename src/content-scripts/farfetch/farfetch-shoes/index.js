//https://www.farfetch.com/shopping/men/shoes-2/items.aspx

const sizeBtnSelector = "p[data-testid=sizeHeader]";
const sizeValuesSelector = "ul[data-testid=sizeValues]";
const closeBtnSelector = "button[aria-label='Close Drawer']";

const selectedBorderColor = "#222222";
const deselectedBorderColor = "#e6e6e6";

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
  console.log("Getting shoe size:");
  const value = await chrome.storage.sync.get(["shoeSize"]);
  console.log("Res: ");
  console.log(value);
  console.log("Value:");
  console.log(value.shoeSize);
  const shoeSize = value.shoeSize;

  selectSize(shoeSize);
}

async function selectSize(shoeSize) {
  await delayMs();

  const expandFiltersBtn = getButtonByPartialInnerText("All Filters");
  expandFiltersBtn.click();
  await delayMs();

  const sizeBtn = document.querySelector(sizeBtnSelector);
  sizeBtn.click();

  await delayMs();
  deselectAllShoeSizes();

  await delayMs();
  const sizeUl = document.querySelector(sizeValuesSelector);
  const li = getLiByInnerText(sizeUl, shoeSize);
  li.click();

  await delayMs();
  const closeBtn = document.querySelector(closeBtnSelector);
  closeBtn.click();
}

async function delayMs(delay = 500) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getLiByInnerText(ul, text) {
  const elements = ul.getElementsByTagName("li");
  for (let element of elements) {
    console.log(getBorderColor(element) == selectedBorderColor);
  }
  let element;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerHTML * 1 == text * 1) {
      element = elements[i];
      break;
    }
  }
  return element;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getBorderColor(element) {
  let raw_rgb_str = getComputedStyle(element).borderColor;
  let rgb_str = raw_rgb_str
    .replace("rgb", "")
    .replace("(", "")
    .replace(")", "");
  let rgb_arr = rgb_str.split(", ").map((a) => parseFloat(a));

  return rgbToHex(rgb_arr[0], rgb_arr[1], rgb_arr[2]);
}

function isShoeSizeSelected(element) {
  return getBorderColor(element) == selectedBorderColor;
}

async function deselectAllShoeSizes() {
  const sizeUl = document.querySelector(sizeValuesSelector);
  const elements = sizeUl.getElementsByTagName("li");
  for (let element of elements) {
    if (isShoeSizeSelected(element)) {
      console.log("Deselecting: " + element.innerHTML);
      element.click();
      await delayMs(1500);
    }
  }
}

function getButtonByInnerText(text) {
  const buttons = document.getElementsByTagName("button");

  let button;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerText == text) {
      button = buttons[i];
      break;
    }
  }
  if (typeof button === undefined || typeof button === null) {
    button = getButtonByPartialInnerText(text);
  }

  return button;
}

function getButtonByPartialInnerText(text) {
  const buttons = document.getElementsByTagName("button");
  let button;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerText.includes(text)) {
      button = buttons[i];
      break;
    }
  }
  return button;
}
