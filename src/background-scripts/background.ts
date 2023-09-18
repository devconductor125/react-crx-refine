import { ShowPopupEvent } from "../types/background";
import { IPC } from "../lib/ipc";

//Better solution should probably be used, but the previous url and current url must be initialized to different values
let previousUrl = "foo";
let currentUrl = "bar";
let poppedUpOnPreviousTab = false;

const supportedWebsites = ['farfetch', 'amazon', 'footlocker']
const supportedCategories = ['mens clothing', 'mens shoes']


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && /^http/.test(tab.url!)) {
//       chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         files: ["src/content-scripts/footlocker/index.js"]
//       })
//     }
//   })




// Listen for messages from the content script
chrome.runtime.onMessage.addListener(
    async (message: ShowPopupEvent, sender, sendResponse) => {

        console.log ("from extension:", message);


        if (message.message === "showPopup" &&
            (supportedWebsites.includes(message.site)) &&
            (supportedCategories.includes(message.category))) {
            handlePopup(message.id)
        }
    });


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log ("from extension:", request.message);
    if (request.message === "runScript") {
        chrome.tabs.query({}, function (tabs) {
        console.log("tabs", tabs);
        tabs.forEach((tab) => {
        console.log(tab);
        if (tab.id) {
            IPC.sendMessage(tab.id, { message: "run" });
        }
        });
    });
      sendResponse({ message: "Received your message in background script" });
     }
});

async function handlePopup(id: string) {
    previousUrl = currentUrl
    currentUrl = id

    /*
    console.log("==========================")
    console.log("Previous URL: " + previousUrl)
    console.log("Current URL: " + currentUrl)
    */

    if ((previousUrl !== currentUrl) || !poppedUpOnPreviousTab) {
        // Display the HTML popup
        chrome.windows.create({
            type: "popup",
            url: "index.html",
            width: 450,
            height: 500
        }).then();

        poppedUpOnPreviousTab = true;
    } else {
        poppedUpOnPreviousTab = false;
    }
}

let email = ""
chrome.identity.getProfileUserInfo(function(info) { email = info.email; });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.message === "getEmail") {
        sendResponse({ email })
    }
});