
// This category controls what is allowed , I will push and commit the code to you, apologies 

import { showPopup } from "../../lib/content-scripts/ipc";

// We need to get the current Category
const allowedCategories = ["Men's Shoes","search-alias=fashion-mens-shoes","search-alias=fashion-mens-clothing"];
const mappedCategory: any = {
    'search-alias=fashion-mens': 'mens clothing',
    'Men': 'mens clothing',
    'Men\'s Shoes': 'mens clothing',
    'search-alias=fashion-mens-shoes': 'mens clothing',
    'search-alias=fashion-mens-clothing':'mens clothing'
}

const amazonDropdownSelect = q('#searchDropdownBox') as HTMLSelectElement;
const originalFunc = amazonDropdownSelect.onchange;

const isClothingSelected = () => {
    // Get the current selected option from the select element
    const selectedCategory = amazonDropdownSelect.selectedOptions[0].value;
    if (allowedCategories.includes(selectedCategory)) {
        showPopup("amazon", mappedCategory[selectedCategory], "amazon_" + selectedCategory)
    }
};


amazonDropdownSelect.onchange = (e: Event) => {
    //  or "Mens Shirts"

    const selectedCategory = ((e.target) as HTMLSelectElement)?.selectedOptions[0].value;
    if (allowedCategories.includes(selectedCategory)) {
        showPopup("amazon", mappedCategory[selectedCategory], "amazon_" + selectedCategory)
    }


    // @ts-ignore
    originalFunc?.call(e);
}

const triggerEvent = q("#nav-hamburger-menu");
const clickFunc = triggerEvent.onclick;
triggerEvent.onclick=(e: Event)=> {
    clickFunc?.apply(e);
    // Find the left hand side of the page and bind to the link
   setTimeout(() => {
       const lefthandMenuItem = q("li a.hmenu-item",true);
       lefthandMenuItem.forEach((linkNode: HTMLElement) => {
           linkNode.onclick=(e)=> {
               const isClothingCategory = (linkNode as HTMLElement).outerText;
               if (allowedCategories.includes(isClothingCategory)) {
                    showPopup("amazon", mappedCategory[isClothingCategory], "amazon_" + isClothingCategory)
               }
           }
       });
   },2500)
}


setTimeout(() => {
    isClothingSelected();
},4000)

export function dom<K>(dom: string,attrib: any, cb?: Function){
    let domNode = document.createElement(dom);
    let key = "";
    for(key in attrib){
        domNode.setAttribute(key ,  attrib[key])
    }
    //Create a callback to allow us embed inner dom in it
    if(cb){
        return cb(domNode)
    }
    return domNode;
}

export function q(selector: string, multiElements: boolean = false, source: HTMLElement | null = null) : any{
    if(multiElements){
        return (source || document).querySelectorAll(selector);
    }
    return (source || document).querySelector(selector)
}