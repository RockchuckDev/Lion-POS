//manageProducts.js
import { createAndAppendElement } from "/client/helpfulFunctions.js";



let nameInput = document.getElementById("newItemNameInput");
let priceInput = document.getElementById("newProductPriceInput");
const submitProduct = document.getElementById("submitNewProductButton");
const newProductImageLinkInput = document.getElementById("newProductImageLinkInput");
const productListElement = document.getElementById("productListElement");

let productsJsonObject = [];

document.addEventListener("DOMContentLoaded", () =>{

    const leftColumn = document.getElementById("leftColumn");
    

    LoadRemoteProductsJsonIntoLocalArray();
    UpdateProductsListHtml();

})


submitProduct.addEventListener("click", () => {

    addNewProduct();
})


function addNewProduct(){
        let newJson = productsJsonObject;
        newJson.push({"name":`${nameInput.value}`, "price": parseFloat(priceInput.value), "image": `${newProductImageLinkInput.value}`});

        OverwriteProductsJsonObject();

        LoadRemoteProductsJsonIntoLocalArray();    
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
        const parentBox = document.createElement("div");
        productListElement.appendChild(parentBox);
        parentBox.classList.add("container");
        parentBox.classList.add("product");
        
        const leftBox = document.createElement("div");
        parentBox.appendChild(leftBox);
        leftBox.classList.add("leftEven");
        leftBox.classList.add("container");

        const itemInfoDiv = createAndAppendElement("div", "", leftBox);
        itemInfoDiv.className = "leftEven";

        const itemImageDiv = createAndAppendElement("div", "", leftBox);
        itemImageDiv.className = "rightEven";

        const rightBox = document.createElement("div");
        parentBox.appendChild(rightBox);
        rightBox.className = "rightEven";

        createAndAppendElement("p", `${element.name}`, itemInfoDiv);
        createAndAppendElement("p", `${element.price}`, itemInfoDiv);
        createAndAppendElement("button", "delete This Item", itemInfoDiv).addEventListener("click", () =>{
        productsJsonObject.splice(productsJsonObject.indexOf(element), 1);
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
            
        })
        

        
        // Name
        createAndAppendElement("p", `New Name`, rightBox).className = "closeTogether";
        const newNameInput = createAndAppendElement("input", "", rightBox);
        newNameInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", rightBox).addEventListener("click", () => {
            element.name = newNameInput.value;
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
        });

        createAndAppendElement("p", `New Price`, rightBox).className = "closeTogether";
        const newPriceInput = createAndAppendElement("input", "", rightBox);
        newPriceInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", rightBox).addEventListener("click", () => {
            element.price = parseFloat(newPriceInput.value) || 0;
            UpdateProductsListHtml();
        OverwriteProductsJsonObject();
        });
        
        createAndAppendElement("p", `New Image Link`, rightBox).className = "closeTogether";
        const newImageInput = createAndAppendElement("input", "", rightBox);
        newImageInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", rightBox).addEventListener("click", () => {
            element.image = newImageInput.value;
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
        });


    });
}

function OverwriteProductsJsonObject(){
    fetch("/overwriteProductsJson", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(productsJsonObject)
        });
}

function LoadRemoteProductsJsonIntoLocalArray(){
    fetch('/productsJSON')
    .then(fetchedData => fetchedData.json())
    .then(jsonObject => {
        productsJsonObject = jsonObject;
        UpdateProductsListHtml();
    })
}


