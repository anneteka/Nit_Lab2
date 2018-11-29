console.log('Hello!');
console.log(`The time is ${new Date()}`);

import './scss/main.scss';
import regeneratorRuntime from "regenerator-runtime";
import $ from 'jquery';
window.$ = $;
window.jQuery = $;

var categories;
var products;
var categoriescontent = [];

async function fetchAsync() {
    // await response of fetch call
    let response = await fetch('https://nit.tron.net.ua/api/category/list');
    let responseP = await fetch('https://nit.tron.net.ua/api/product/list');
    let responseTest = await fetch('https://nit.tron.net.ua/api/product/1');
    let jsonTest = responseTest.json();
    console.log("test");
    console.log(responseTest);
    console.log(jsonTest);
    console.log("test");
    // only proceed once promise is resolved
    categories = await response.json();
    products = await responseP.json();
    // only proceed once second promise is resolved
    await fillCategories();
    await showCategory("category-All");
    for (let i = 0; i < categories.length; i++) {
        let catRequest = await fetch("https://nit.tron.net.ua/api/product/list/category/"+categories[i].id);
        let categoryProd = await catRequest.json();
        categories.push();
    }
    $(".menu-link").on('click', function() {
        console.log(event.target.id+" event");
       showCategory(event.target.id)
           .then()
           .catch(reason => console.log(reason));
    });
    console.log("here");
    return categories;
}

async function fillCategories() {
    let body = $("#category");
    let answer = body.html();
    for (let i = 0; i < categories.length; i++) {
        let category = (categories[i]);
        let titleText = category.description;
        answer += "<div class='side-menu'>";
        answer +=
            " <button class='menu-link' title='" + titleText + "' id='category-"+categories[i].id+"' >" ;
        answer += category.name;
        answer += "</button> </div>";
    }

    body.html(answer);
}

async function showProduct(id) {
    let body=$("#spa-holder");
    let prodId = id.substring(8);
    console.log(prodId);
    let request = await fetch('https://nit.tron.net.ua/api/product/1');
    let product = await request.json();
    let write="<div class='product-page'>";
    console.log(request);
    console.log(product);
    write+="<div class='image-product'>";
    write += "<img src='" + product.image_url + "' class='product-img'>";
    write+="</div>";
    write += "<span class='product-name'>" + product.name + "</span>";
    write += "<div class='price-product'>";
    if (product.special_price !== null){
        write += "<span class='price'>" + product.special_price + "</span>";
        write += "<span class='price-deprecated'><s>" + product.price + "</s></span>";
    }
    else
        write += "<span class='price'>" + product.price + "</span>";
    write+="<p class='product-description'>"+product.description+"</p>";
    write += "</div>";
    write += "</div>";

    body.html(write);

}
function buyProduct(id) {

}


async function showCategory(category) {
    console.log(category+" category");
    let catproducts;
    if (category === "category-All") {
        catproducts = products;
    }
    else {
        let categoryID = category.substring(9);
        console.log(categoryID+" id");
        let response = await fetch("https://nit.tron.net.ua/api/product/list/category/" + categoryID);
        catproducts = await response.json();

    }
    let body = $("#spa-holder");
    let write = "";
    for (let i = 0; i < catproducts.length; i++) {
        write+="<button class='product-holder-button' id='buy-"+catproducts[i].id+"'>+</button>";
        write += "<button class='product-holder' id='product-"+catproducts[i].id+"'>";
        write+="<div class='image-holder' id='imagehd-"+catproducts[i].id+"'>";
        write += "<div class='img-helper' id='imagehl-"+catproducts[i].id+"'>";
        write += "</div>";
        write += "<img src='" + catproducts[i].image_url + "' class='product-container-image' id='img-src-"+catproducts[i].id+"'>";

        write+="</div>";
        write += "<span class='product-holder-name' id='prodnam-"+catproducts[i].id+"'>" + catproducts[i].name + "</span>";
        write += "<div class='price-container' id='pricect-"+catproducts[i].id+"'>";
        if (catproducts[i].special_price !== null){
            write += "<span class='price-holder' id='pricehd-"+catproducts[i].id+"'>" + catproducts[i].special_price + "</span>";
            write += "<span class='price-holder-deprecated' id='pricedp-"+catproducts[i].id+"'><s>" + catproducts[i].price + "</s></span>";
        }
        else
            write += "<span class='price-holder' id='pricehd-"+catproducts[i].id+"'>" + catproducts[i].price + "</span>";
        write += "</div>";
        write += "</button>";

    }
    body.html(write);
    $(".product-holder").on('click', function () {
        console.log(event.target);
        showProduct(event.target.id).then(data => console.log("product load")).catch(reason => console.log(reason));
    });
    $(".product-holder-button").on('click', function () {
        buyProduct(event.target.id);
    });
}


// trigger async function
// log response or catch error of fetch promise
fetchAsync()
    .then(data => console.log("data loaded"))
    .catch(reason => console.log(reason.message));