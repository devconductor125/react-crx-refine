import { ShoppingItem } from "../../types/popup";
import { DAO } from "../../lib/dao";
import { getEmail } from "../../lib/content-scripts/ipc";

registerAddToCartEvent()
recordDetailsView()

async function recordDetailsView() {
    const email = await getEmail()
    console.log("Email: ")
    console.log(email)

    const item = getShoppingItem()

    await DAO.createUser(email)
    const userOpt = await DAO.getUser(email)
    if(!userOpt.hasValue()) {
        console.log("User somehow not found")
        return
    }

    const user = userOpt.value
    await DAO.storeItemView(user?.id ?? "", item)
}

async function registerAddToCartEvent() {
    const buttonSelector = "button[data-component=AddToBag]"
    const buttonNode = document.querySelector(buttonSelector)
    if(buttonNode) buttonNode.addEventListener("click", recordAddToCart)
}

async function recordAddToCart() {
    const sizeLabelSelector = "div[data-component=SizeSelectorLabel] > div"
    const sizeLabelNode = document.querySelector(sizeLabelSelector)
    const sizeLabel = sizeLabelNode?.textContent

    if(!sizeLabel) return

    const email = await getEmail()

    const item = getShoppingItem()

    await DAO.createUser(email)
    const userOpt = await DAO.getUser(email)
    if(!userOpt.hasValue()) {
        console.log("User somehow not found")
        return
    }

    const user = userOpt.value
    await DAO.storeItemAddToCart(user?.id ?? "", item)
}

function getShoppingItem(): ShoppingItem {
    const currentUrl = window.location.href
    const item: ShoppingItem = {
        url: currentUrl,
        price: getPrice(),
        title: getTitle(),
        image: getImage(),
        description: getDescription()
    }

    return item
}

function getPrice(): number {
    const priceSelector = "p[data-component=PriceLarge]"
    const priceNode = document.querySelector(priceSelector)
    if (!priceNode) return 0
    return parseFloat(priceNode.textContent?.replace("$", "") || "0")
}

function getTitle(): string {
    const titleSelector = "a[data-component=LinkGhostDark]"
    const titleNode = document.querySelector(titleSelector)
    if (!titleNode) return ""
    return titleNode.textContent || ""
}

function getImage(): string {
    const imageSelector = "button > img[data-component=Img]"
    const imageNode = document.querySelector(imageSelector)
    if (!imageNode) return ""
    return imageNode.getAttribute("src") || ""
}

function getDescription(): string {
    const descriptionSelector = "div[data-component=Body] > p[data-component=Body]"
    const descriptionNode = document.querySelector(descriptionSelector)
    if (!descriptionNode) return ""
    return descriptionNode.textContent || ""
}