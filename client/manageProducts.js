//manageProducts.js
import { createAndAppendElement } from "/client/helpfulFunctions.js";



let nameInput = document.getElementById("newItemNameInput");
let priceInput = document.getElementById("newProductPriceInput");
const submitProduct = document.getElementById("submitNewProductButton");
const newProductImageLinkInput = document.getElementById("newProductImageLinkInput");

let productsJsonObject = [];

document.addEventListener("DOMContentLoaded", () =>{

    const leftColumn = document.getElementById("leftColumn");
    const productListElement = document.getElementById("productListElement");

    UpdateLocalProductArray();
    UpdateProductsListHtml();

})


submitProduct.addEventListener("click", () => {

    addNewProduct();
})


function addNewProduct(){
        let newJson = productsJsonObject;
        newJson.push({"name":`${nameInput.value}`, "price": parseFloat(priceInput.value), "image": `${newProductImageLinkInput.value}`});

        fetch("http://localhost:3000/overwriteProductsJson", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newJson)
        });

        UpdateLocalProductArray();    
}


function UpdateProductsListHtml(){

    if(productListElement.children.length > 0)
        {
            for(let i = productListElement.children.length - 1; i >= 0; i--)
                {
                     
                    productListElement.children[i].remove();
                }
        }

    productsJsonObject.forEach(element => {
        

        const box = document.createElement("div");
        productListElement.appendChild(box);
        box.className = "product";

        createAndAppendElement("p", `${element.name}`, box);
        createAndAppendElement("p", `${element.price}`, box);
        createAndAppendElement("button", "delete This Item", box).addEventListener("click", () =>{
        productsJsonObject.splice(productsJsonObject.indexOf(element), 1);
            fetch("http://localhost:3000/updateOrderTemplate", {});
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
            
        })     
    });
}

function OverwriteProductsJsonObject(){
    fetch("http://localhost:3000/overwriteProductsJson", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(productsJsonObject)
        });
}

function UpdateLocalProductArray(){
    fetch('http://localhost:3000/productsJSON')
    .then(fetchedData => fetchedData.json())
    .then(jsonObject => {
        productsJsonObject = jsonObject;
        UpdateProductsListHtml();
    })
}


