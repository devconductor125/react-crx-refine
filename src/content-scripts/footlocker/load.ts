import { showPopup } from "../../lib/content-scripts/ipc";

let category = "";
const currentUrl = window.location.href;

setTimeout(() => {
  waitForLoad();
}, 4000);

function waitForLoad() {
  if (currentUrl.includes("https://www.footlocker.com/en/category/mens/shoes"))
    category = "mens shoes";

  if (category !== "") {
    showPopup("footlocker", category, currentUrl);
  }
}

export {};
