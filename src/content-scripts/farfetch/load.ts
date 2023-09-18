import { showPopup } from "../../lib/content-scripts/ipc";

let category = "";
const currentUrl = window.location.href;

setTimeout(() => {
  waitForLoad();
}, 4000);

function waitForLoad() {
  if (currentUrl.includes("https://www.farfetch.com/shopping/men/clothing-2")) category = "mens clothing";
  if (currentUrl.includes("https://www.farfetch.com/shopping/men/shoes-2")) category = "mens shoes";

  if (category !== "") {
    showPopup("farfetch", category, currentUrl);
  }
}

export {};
