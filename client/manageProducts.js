//manageProducts.js
import { createAndAppendElement } from "/client/helpfulFunctions.js";



let nameInput = document.getElementById("newItemNameInput");
let priceInput = document.getElementById("newProductPriceInput");
const submitProduct = document.getElementById("submitNewProductButton");
const newProductImageLinkInput = document.getElementById("newProductImageLinkInput");
const productListElement = document.getElementById("productListElement");

let productsJsonObject = [];
let productTypes = {};

document.addEventListener("DOMContentLoaded", () =>{

    const leftColumn = document.getElementById("leftColumn");
    fetch("/productTypes")
    .then(response => response.json())
    .then(object => productTypes = object)
    .then(thingy => {
        LoadRemoteProductsJsonIntoLocalArray();
        UpdateProductsListHtml();
    })

    

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
        parentBox.style.height = "175px";
        
        const leftBox = document.createElement("div");
        parentBox.appendChild(leftBox);
        leftBox.classList.add("leftEven");
        leftBox.classList.add("container");

        const productInfoDiv = createAndAppendElement("div", "", leftBox);
        productInfoDiv.className = "leftEven";

        const productImageDiv = createAndAppendElement("div", "", leftBox);
        productImageDiv.className = "rightEven";

        createAndAppendElement("p", `${element.name}`, productInfoDiv);
        createAndAppendElement("p", `${element.price}`, productInfoDiv);
        createAndAppendElement("p", `${element.type}`, productInfoDiv);
        createAndAppendElement("button", "delete This Item", productInfoDiv).addEventListener("click", () =>{
        productsJsonObject.splice(productsJsonObject.indexOf(element), 1);
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
            
        })
        const productImage = document.createElement("img");
        productImage.src = element.image;
        productImage.className = "scaleToAvailableSpace";
        productImageDiv.appendChild(productImage);

        const rightBox = document.createElement("div");
        parentBox.appendChild(rightBox);
        rightBox.classList.add("rightEven");
        rightBox.classList.add("container");
        const namePriceLinkHalf = createAndAppendElement("div", "", rightBox);
        namePriceLinkHalf.classList.add("leftEven");
        
        // Name
        createAndAppendElement("p", `New Name`, namePriceLinkHalf).className = "closeTogether";
        const newNameInput = createAndAppendElement("input", "", namePriceLinkHalf);
        newNameInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", namePriceLinkHalf).addEventListener("click", () => {
            element.name = newNameInput.value;
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
        });

        createAndAppendElement("p", `New Price`, namePriceLinkHalf).className = "closeTogether";
        const newPriceInput = createAndAppendElement("input", "", namePriceLinkHalf);
        newPriceInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", namePriceLinkHalf).addEventListener("click", () => {
            element.price = parseFloat(newPriceInput.value) || 0;
            UpdateProductsListHtml();
        OverwriteProductsJsonObject();
        });
        
        createAndAppendElement("p", `New Image Link`, namePriceLinkHalf).className = "closeTogether";
        const newImageInput = createAndAppendElement("input", "", namePriceLinkHalf);
        newImageInput.className = "closeTogether";
        createAndAppendElement("button", "Submit", namePriceLinkHalf).addEventListener("click", () => {
            element.image = newImageInput.value;
            UpdateProductsListHtml();
            OverwriteProductsJsonObject();
        });

        const typeHalf = createAndAppendElement("div", "", rightBox);
        typeHalf.classList.add("rightEven");
        const dropDown = createAndAppendElement("select", "", typeHalf);
        dropDown.style.width = "100px";
        for(let key in productTypes){
            const option = document.createElement("option");
            option.textContent = productTypes[key];
            option.value = productTypes[key];
            dropDown.appendChild(option);
        }
        const changeTypeButton = createAndAppendElement("button", "Submit Type Change", typeHalf);
        changeTypeButton.addEventListener('click', () =>{
            element.type = dropDown.value;
            OverwriteProductsJsonObject();
            UpdateProductsListHtml();
        })


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


