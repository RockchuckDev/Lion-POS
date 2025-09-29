//server.js
import { Product } from '../classes.js';
import { readFile, writeFile, writeFileSync, existsSync } from 'fs';
import { readFileSync  } from 'fs';
import express, { response } from 'express';
import path from 'path';
import http, { request } from 'http';
import crypto from 'crypto';
import { stripTypeScriptTypes } from 'module';
import { json } from 'stream/consumers';
import { returnDate } from '../client/helpfulFunctions.js';

const app = express();

app.use(express.json());

const date = new Date().toISOString().split("T")[0];


app.use(express.static("/home/rockchucksuper/VSCode Projects/Javascript/Lion POS"));

app.get("/productsJSON", (request, response) => {
    readFile("server/products.json", "utf-8", (err, json) => 
        {
        if(err){
            response.status(500).send("Error loading products.json");
        }else{
            response.send(json);
        }
        })
    })


app.get('/checkout', (req, res) =>{
    readFile("client/checkout.html", "utf-8", (err, html) => {
        if(err){
            res.status(500).send("Error");
        }else{
            res.send(html);
        }    
    })
})


app.get('/', (request, response) => {

    readFile("client/home.html", "utf-8", (err, html) => {
        if(err){
            response.status(500).send("Error");
        }else{
            response.send(html);
        }
    
    })
})

app.get('/manageProducts', (request, response) =>{

    readFile("client/manageProducts.html", "utf-8", (err, html) =>{
        if(err){
            response.status(500).send("Error");
        }else{
            response.send(html);
        }
    })

})

//JUST LET ME PUSH TO MAIN!!!

app.get('/ordersJson', (req, res) =>{

    readFile("server/orders.json", "utf-8", (err, json) =>{
        if(err){
            response.status(500).send("Error");
        }else{
            response.send(json);
        }
    })
    
})

//update products list
app.post("/overwriteProductsJson", (requestData, responseData) => {

    const newJson = requestData.body;
    try{

        writeFileSync("/home/rockchucksuper/VSCode Projects/Javascript/Lion POS/server/products.json", JSON.stringify(newJson, null, 2));
        responseData.send("Success Writing file");
    }catch (err){
        responseData.status(500).send("Error writing file");
    }
})

//add order
app.post('/postOrder', (req, res) =>{
    console.log(req.body);

    let currentFileContents = [];

    if(existsSync(`server/${returnDate()}.json`)){
        currentFileContents = JSON.parse(readFileSync(`server/${returnDate()}.json`, "utf-8"));
    }
    
    currentFileContents.push(req.body);
    console.log(req.body);
    
    writeFileSync(`server/${returnDate()}.json`, JSON.stringify(currentFileContents, null, 2));
    res.send("Success!!!");

})

app.get('/updateOrderTemplate', (req, res) =>{

    let template = [];
    let productsJson = JSON.parse(readFileSync("server/products.json", "utf8"));

    productsJson.forEach(element => {
        template.push({[element.name] : 0})
    })   
        

    console.log(template);

    try{
        writeFileSync("server/orderTemplate.json", JSON.stringify(template, null, 2));
        res.send("Success writing file");
    }catch (err){
        res.status(500).send("Error writing file");
    }

})

app.get("/orderTemplateJson", (req, res) =>{
    
    try{
        res.send(readFileSync("/server/orderTemplate.json", "utf8"));
    }catch{
        res.status(500).send("Error reading orderTemplate.json");
    }
})

app.listen(3000, () => console.log("Available on localhost:3000"));