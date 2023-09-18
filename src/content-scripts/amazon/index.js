const departmentDropdown = document.getElementById("searchDropdownBox")
const selectedDepartment = departmentDropdown.getElementsByTagName("option")[0].innerHTML

async function load(){
    // Send a message to the background script to request the popup when the URL matches
    //chrome.runtime.sendMessage({ message: "showPopup" });

    // Inform the background script to track this tab
    chrome.runtime.sendMessage({ message: "TrackTab" });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === "PageReloaded") {
            console.log("Page reloaded, extension should open again");
            // Perform any desired actions on page reload
        }
    });

    const shoeSize = (await chrome.storage.sync.get(["shoeSize"])).shoeSize
    const shirtSize = (await chrome.storage.sync.get(["shirtSize"])).shirtSize

    const currentlyRunning = (await chrome.storage.sync.get(["currentlyRunning"])).currentlyRunning
    console.log("currentlyRunning", currentlyRunning)
    if(currentlyRunning){
        switch(selectedDepartment.trim()) {
            case "Men's Shirts".trim():
            case "Men's Casual Button-Down Shirts".trim():
                const shirtsizeSelector = `button[aria-label="${shirtSize}"]`
                const shirtsizeBtn = document.querySelector(shirtsizeSelector)
                await chrome.storage.sync.set({ ['currentlyRunning']: false });
                shirtsizeBtn.click()
                break
            case "Men's Shoes".trim():
                const sizeSelector = `button[aria-label="${shoeSize}"]`
                const sizeBtn = document.querySelector(sizeSelector)
                await chrome.storage.sync.set({ ['currentlyRunning']: false });
                sizeBtn.click()
                break
        }
    }
}

load()
chrome.runtime.onMessage.addListener(msgObj => {
    if(msgObj.message == "run") {
        run()
    }
})

function run() {
    switch(selectedDepartment.trim()) {
        case "Men's Shirts".trim():
        case "Men's Casual Button-Down Shirts".trim():
            handleMensShirts()
            break

        case "Men's Shoes".trim():
            handleMensShoes()
            break
    }
}

async function handleMensShirts() {

    const shirtSize = (await chrome.storage.sync.get(["shirtSize"])).shirtSize
    //Clear existing filters
    const clearFiltersBtnContainer = document.getElementById("s-refinements")
    const spans = clearFiltersBtnContainer.getElementsByTagName("span")
    let currentlyRunning=true

    for(let span of spans) {
        if(span.innerHTML == "Clear")
        {
            const url = span.parentElement.getAttribute('href')
                await chrome.storage.sync.set({ ['currentlyRunning']: true });
                console.log("url", url)
                window.location.href= url
                falg = !currentlyRunning //No idea why this line is here or why it is needed. Extension no longer works once this is removed
                break;
        }
    }
    if(currentlyRunning){
        await chrome.storage.sync.set({ ['currentlyRunning']: false });
        const sizeSelector = `button[aria-label="${shirtSize}"]`
        const sizeBtn = document.querySelector(sizeSelector)
        sizeBtn.click()
    }
}

async function handleMensShoes() {
    const shoeSize = (await chrome.storage.sync.get(["shoeSize"])).shoeSize
    //Clear existing filters
    const clearFiltersBtnContainer = document.getElementById("s-refinements")
    const spans = clearFiltersBtnContainer.getElementsByTagName("span")
    let currentlyRunning=true
    for(let span of spans) {
        if(span.innerHTML === "Clear")
            {
                const url = span.parentElement.getAttribute('href')
                await chrome.storage.sync.set({ ['currentlyRunning']: true });
                window.location.href= url
                falg = !currentlyRunning //No idea why this line is here or why it is needed. Extension no longer works once this is removed
                break;
            }
    }
    if(currentlyRunning){
        await chrome.storage.sync.set({ ['currentlyRunning']: false });
        const sizeSelector = `button[aria-label="${shoeSize}"]`
        const sizeBtn = document.querySelector(sizeSelector)
        sizeBtn.click()
    }

}
