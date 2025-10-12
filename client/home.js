//home.js
import { createAndAppendElement } from "/client/helpfulFunctions.js";
import { returnProductsJsonAsArray } from "/client/helpfulFunctions.js";


const cartCostElement = document.getElementById("orderCost");
const checkoutButton = document.getElementById("checkoutButton");

let cartCost = 0;

let orderWithMetadata = {};
let rawProductsJson = [];
let currentProductPage = 0;
let productTypes = [];
const productsListElement = document.getElementById('productsList');
let productTypeParentElements = [];
let productTypeButtonsParentElement = document.getElementById("productTypeButtonsParent");
let activeProductTypeDivId = "";



returnProductsJsonAsArray()
    .then(array => {
        //set rawProductsJson and build out orderWithMetadata
        rawProductsJson = array;
        if(sessionStorage.getItem("cart") != null && sessionStorage.getItem("cart").trim() != ""){
            orderWithMetadata = (JSON.parse(sessionStorage.getItem("cart")));
        }else{
            orderWithMetadata.time = "null";
            orderWithMetadata.cashOrCard = "null";
            orderWithMetadata.orderCost = "null";
            rawProductsJson.forEach(element => {
                orderWithMetadata[element.name] = 0;
                console.log(element.name);
            })
        }
    }).then(thingy1 =>{

        //fetch product types and store it in producTypes variable
        fetch("/productTypes")
        .then(responseObject => responseObject.json())
        .then(jsonObject => productTypes = jsonObject)
        .then(thingy => {
            for(let i = 0; i < productTypes.length; i++){
                const button = document.createElement("button");
                productTypeButtonsParentElement.appendChild(button);
                button.innerHTML = `${productTypes[i]}`;
                button.addEventListener("click", () =>{
                    activeProductTypeDivId = productTypes[i];
                    updateItemGrid();
                })
                button.className = "equalFlex";
                button.style.height ="50px";
                button.style.fontSize = (50 * 0.8) + "px";
                
            }
            activeProductTypeDivId = productTypes[0];
            updateItemGrid();
            updateCartHtml();
    })
})

checkoutButton.addEventListener("click", () =>{
    sessionStorage.setItem("cartCost", cartCost);
    sessionStorage.setItem("cart", JSON.stringify(orderWithMetadata));
    window.location.href = '/checkout';

})


function updateCartHtml(){
    const cartElement = document.getElementById("cartList");

    for(let i = cartElement.children.length - 1; i >= 0; i--){
        cartElement.children[i].remove();
    }

    for(let key in orderWithMetadata){
        if(orderWithMetadata[key] > 0){
            const box = document.createElement("div");
            cartElement.appendChild(box);
            box.className = "product";
            let itemPrice = 0;

            rawProductsJson.forEach(element => {
                if(element.name == key){
                    itemPrice = element.price;
                    createAndAppendElement("p", `${key}`, box).className = "itemNames";
                    createAndAppendElement("p", `${itemPrice}`, box).className = "itemCost";
                    createAndAppendElement("p", `In Cart: ${orderWithMetadata[key]}`, box);
                    createAndAppendElement("button", "Remove All", box).addEventListener("click", () =>
                        {
                            orderWithMetadata[key] = 0;
                            updateCartHtml();
                        })
            
                    createAndAppendElement("button", "-1", box).addEventListener("click", () =>
                        {
                            orderWithMetadata[key]-=1;
                            updateCartHtml();
                        })

                    createAndAppendElement("button", "+1", box).addEventListener("click", () =>
                        {
                            orderWithMetadata[key]+=1;
                            updateCartHtml();
                        })
                }
            })            
        }
    }
    updateCartCost();
}


function updateCartCost(){
    const priceElement = document.getElementById("orderCost");
    cartCost = 0;
    for(let key in orderWithMetadata){
        if(key != "time" && key != "orderCost" && key != "cashOrCard"){
            let itemPrice = 0;
            rawProductsJson.forEach(element => {
                if(element.name == key){
                    itemPrice = element.price;
                }
            })
            cartCost += orderWithMetadata[key] * itemPrice;
        }
    }
    priceElement.innerHTML = cartCost;
}

function updateItemGrid(){
    while(productsListElement.firstChild) productsListElement.removeChild(productsListElement.firstChild);
    rawProductsJson.forEach(product => {
        if(product.type == activeProductTypeDivId){
            const box = document.createElement("button");
            productsListElement.appendChild(box);
            const image = document.createElement("img");
            image.src = product.image;
            image.width = "175";
            image.height = "175";
            box.appendChild(image);
            createAndAppendElement("p", `${product.name}`, box);
            box.addEventListener("click", () => {
                orderWithMetadata[product.name] += 1;
                updateCartHtml();
            })
        }
    })
}

