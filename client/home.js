//home.js

import { Product } from '../classes.js';
import { createAndAppendElement } from "/client/helpfulFunctions.js";


const cartCostElement = document.getElementById("orderCost");
const checkoutButton = document.getElementById("checkoutButton");

let cartCost = 0;

let orderWithMetadata = {};
let rawProductsJson = [];

returnProductsJsonAsArray()
    .then(array => {
        rawProductsJson = array;
        if(sessionStorage.getItem("cart").trim() != ""){
            orderWithMetadata = (JSON.parse(sessionStorage.getItem("cart")));
        }else{
            orderWithMetadata.time = "null";
            orderWithMetadata.cashOrCard = "null";
            orderWithMetadata.orderCost = "null";
            array.forEach(element => {
                orderWithMetadata[element.name] = 0;
            })
        }
    }).then(thingy => {
        for(let key in orderWithMetadata){
            console.log(key);
            if(key != "time" && key != "orderCost" && key != "cashOrCard"){
                let newitemButton = document.createElement('button');
                newitemButton.innerHTML = `${key}`;
                newitemButton.addEventListener("click", () => {
                orderWithMetadata[key] += 1;
                updateCartHtml();
                updateCartCost();
                })
                let elementOfList = document.createElement("li");
                elementOfList.appendChild(newitemButton);
                document.getElementById("productsList").appendChild(elementOfList);
            }
        }
    updateCartHtml();
    updateCartCost();

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

                }
            })

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
    priceElement = document.getElementById("orderCost");
    priceElement.innerHTML = cartCost;
}
