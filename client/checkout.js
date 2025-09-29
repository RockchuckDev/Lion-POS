//checkout.js
import { returnDate } from "./helpfulFunctions.js";
import { returnTime } from "./helpfulFunctions.js";


const cartCostElement = document.getElementById("cartCost");
const oneButton = document.getElementById("oneButton");
const fiveButton = document.getElementById("fiveButton");
const tenButton = document.getElementById("tenButton");
const twentyButton = document.getElementById("twentyButton");
const fiftyButton = document.getElementById("fiftyButton");
const hundredButton = document.getElementById("hundredButton");
const changeDisplay = document.getElementById("changeDisplay");
const newOrderButton = document.getElementById("newOrder");
const cardButton = document.getElementById("cardButton");

let orderWithMetadata = [];

document.addEventListener('DOMContentLoaded', () => {

    orderWithMetadata = JSON.parse(sessionStorage.getItem("cart"));
    orderWithMetadata.orderCost = sessionStorage.getItem("cartCost");
    orderWithMetadata.cashOrCard = "cash";
    cartCostElement.innerHTML = `$${sessionStorage.getItem("cartCost")}`;

    const buttons = [
        { element: oneButton, value: 1 },
        { element: fiveButton, value: 5 },
        { element: tenButton, value: 10 },
        { element: twentyButton, value: 20 },
        { element: fiftyButton, value: 50 },
        { element: hundredButton, value: 100 }
        ];

        //setup each button so change display updates based on button value
        buttons.forEach(button =>{
            button.element.addEventListener("click", () =>{
                let change = button.value - sessionStorage.getItem("cartCost");
                changeDisplay.innerHTML =  `$${change.toFixed(2)}`;
                orderWithMetadata.cashOrCard = "cash";
            })
        })
        
        //sets changeDisplay to 0
        cardButton.addEventListener("click", () =>{
            changeDisplay.innerHTML = "0";
            orderWithMetadata.cashOrCard = "card";       
        })

        newOrderButton.addEventListener('click', () =>{
            orderWithMetadata.time = returnTime();

            fetch("http://localhost:3000/postOrder", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(orderWithMetadata)
            })
            .then(res => {
                sessionStorage.setItem("cart", []);
                sessionStorage.setItem("cartCost", 0);
                window.location.href='/';
            })

        })
})



