import { getEmail } from "../../lib/content-scripts/ipc";
import { DAO } from "../../lib/dao";
import { ShoppingItem } from "../../types/popup";

const button = document.getElementById("BasketGoToCheckout");

const itemsSelector = "li[data-testid='item']"
const itemElements = document.querySelectorAll(itemsSelector);

button?.addEventListener("click", async () => {
    const urls = getItemUrlsInCart()
    const products = await urlsToProducts(urls)

    const email = await getEmail()
    await DAO.createUser(email)
    const userOpt = await DAO.getUser(email)
    if(!userOpt.hasValue()) {
        console.log("User somehow not found")
        return
    }

    const user = userOpt.value

    for(let product of products) {
        await DAO.storeItemPurchase(user?.id ?? "", product)
    }
})

function getItemUrlsInCart(): Array<string> {
    const urls: Array<string> = []
    
    itemElements.forEach(itemElement => {
        const link = itemElement.querySelector("a[data-testid='item-description']")?.getAttribute("href")?.split("?")[0]
        if(link) urls.push(link)
    })

    return urls
}

async function urlsToProducts(urls: Array<string>): Promise<Array<ShoppingItem>> {
    let products: Array<ShoppingItem> = []
    
    for(let url of urls) {
        let product_result = await DAO.getProductInteractionByUrl(url)
        if(product_result.hasValue()) {
            const product_data = product_result.value!
            products.push({
                url: product_data.url,
                price: product_data.price,
                title: product_data.title,
                image: product_data.image,
                description: product_data.description,
            })
        }
    }

    return products
}