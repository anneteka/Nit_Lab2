
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

    // only proceed once promise is resolved
    categories = await response.json();
    products = await responseP.json();
    basketProducts = [0];
    // only proceed once second promise is resolved
    await fillCategories();
    await showCategory("category-All");
    for (let i = 0; i < products.length; i++) {
        basketProducts.push(0);
    }
    for (let i = 0; i < categories.length; i++) {
        let catRequest = await fetch("https://nit.tron.net.ua/api/product/list/category/" + categories[i].id);
        let categoryProd = await catRequest.json();
        categories.push();
    }
    $(".menu-link").on('click', function () {
        showCategory(event.target.id)
            .then()
            .catch(reason => console.log(reason));
    });
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
            " <button class='menu-link' title='" + titleText + "' id='category-" + categories[i].id + "' >";
        answer += category.name;
        answer += "</button> </div>";
    }

    body.html(answer);
    $("#basket-b").on('click', async function () {
        let body2 = $("#spa-holder");
        let body = $("#spa-holder-100");
        body2.css("display", "none");
        body.css("display", "block");
        let write = "";
        basketCounter = 0;
        for (let i = 0; i < basketProducts.length; i++) {
            if (basketProducts[i] > 0) {
                basketCounter++;
                let response = await fetch('https://nit.tron.net.ua/api/product/' + i);
                let product = await response.json();
                write += "<div class='basket-product' id='basket-" + product.id + "'>";
                write += "<div class='basket-img-container'>";
                write += "<div class='image-helper'></div>"
                write += "<img src='" + product.image_url + "' class='basket-img'>"
                write += "</div>";
                write += "<div class='basket-info'>";
                write += product.name;
                write += "</div>";
                write += "<div class='plusminus-holder'>";
                write += "<div class='price-holder'>";
                write += "<span>";
                if (product.special_price !== null)
                    write += product.special_price;
                else
                    write += product.price;
                write += "</span>";
                write += "</div>";
                write += "<div class='basket-buttons'>";
                write += "<button class='minus-holder' id='minus-" + product.id + "'>-</button>";
                write += "<span id='amount-" + product.id + "'>" + basketProducts[i] + "</span>";
                write += "<button class='plus-holder' id='plus-" + product.id + "'>+</button>";
                write += "</div>";
                write += "<div>";
                write += "<button class='delete' id='delete-" + product.id + "'>Видалити</button>";
                write += "</div>";
                write += "</div>";
                write += "</div>";

            }
        }
        write += "<div class='user-data'>";
        write += "<form id='contact-form'>";
        write += "Ім\'я: <input id='name' type='text' name='name' required minlength='5'><br>";
        write += "Номер телеону: <input id='phone' type='number' name='phone' required minlength='7'><br>";
        write += "E-mail: <input id='email' type='text' name='email' required minlength='5'>";

        write += "<div class='buy-button-holder'><button id='buy-button'>ПРИДБАТИ</button></div>";
        write += "</form>";
        write += "</div>";

        if (basketCounter > 0) body.html(write);
        else body.html("<div class='empty-div'><span class='empty'>Ваш кошик пустий.</span></div>");

        $(".minus-holder").on('click', function () {
            let span = $("#amount-" + event.target.id.substring(6));
            if (parseInt(span.html()) > 0) span.html(parseInt(span.html()) - 1);
            basketProducts[parseInt(event.target.id.substring(6))] = span.html();
            if (parseInt(span.html()) === 0) {
                $("#basket-" + event.target.id.substring(6)).css('display', 'none');
                basketCounter--;
            }
            basketProducts[event.target.id.substring(6)] = parseInt(span.html());
            if (basketCounter===0)
                body.html("<div class='empty-div'><span class='empty'>Ваш кошик пустий.</span></div>")

        });
        $(".plus-holder").on('click', function () {

            let span = $("#amount-" + event.target.id.substring(5));
            span.html(parseInt(span.html()) + 1);
            basketProducts[parseInt(event.target.id.substring(5))] = span.html();
            basketProducts[event.target.id.substring(5)] = parseInt(span.html());
        });
        $(".delete").on('click', function () {
            $("#basket-" + event.target.id.substring(7)).css('display', 'none');
            basketProducts[event.target.id.substring(7)] = 0;
            basketCounter--;
            if (basketCounter===0)
                body.html("<div class='empty-div'><span class='empty'>Ваш кошик пустий.</span></div>")
        });
        $('#contact-form').submit(function () {
            formCheckout();
            return false;
        });
    });
}

function formCheckout() {
    let body2 = $("#spa-holder");
    let body = $("#spa-holder-100");
    body2.css("display", "none");
    body.css("display", "block");
    let name = $("#name").val();
    let number = $("#phone").val();
    let email = $("#email").val();
    let formData = "name=" + name + "&email=" + email + "&phone=" + number;
    for (let i = 0; i < basketProducts.length; i++) {
        if (basketProducts[i] > 0) {
            formData += "&products[" + i + "]=" + basketProducts[i];
        }
    }
    formData += "&token=JStANkTzg7EOSO3-F5pP";
    $.ajax({
        url: 'https://nit.tron.net.ua/api/order/add',
        method: 'post',
        data: formData,
        dataType: 'json',
        success: function (json) {
            clearBasketSuccess();
        },
    });
}

function clearBasketSuccess(){
    $("#spa-holder-100").html("<div class='empty-div'><span class='empty'>Замовлення успішно оформлене</span></div>");
    for (let i =0; i<basketProducts.length; i++)
    {
        basketProducts[i]=0;
    }
    basketCounter=0;
}

async function showProduct(id, category) {
    let body2 = $("#spa-holder");
    body2.css("display", "none");
    let body = $("#spa-holder-100");
    body.css("display", "block");
    let prodId = id.substring(8);
    console.log(prodId);
    let request = await fetch('https://nit.tron.net.ua/api/product/' + prodId);
    let product = await request.json();

    let write = "";
    write+="<div class='button-back' id='back-"+category+"' style=\" "+
         "background: url('../docs/images/backButton.png') no-repeat; height: 60px; width: 60px; background-size:60px auto;\">"+
              " </button>";
    write+="</div>";
    write+="<div class='product-page'>";
    write+="<div class='product-col'>";
    write+="<div class='prod-col-holder'>";
    write += "<div class='image-product'>";
    write += "<img src='" + product.image_url + "' class='product-img'>";
    write += "</div>";
    write += "<div class='price-product'>";
    write += "<span class='product-name'>" + product.name + "</span>";
    write+="<div class='price-prod'>";
    if (product.special_price !== null) {
        write += "<span class='price'>" + product.special_price + "</span>";
        write += "<span class='price-deprecated'><s>" + product.price + "</s></span><br>";
    }
    else
        write += "<span class='price'>" + product.price + "</span><br>";
    write+="</div>";
    write += "<button class='buy' id='buy-" + prodId + "'>Купити</button>";
    write += "</div>";
    write+="</div>";
    write+="</div>";
    write+="<div class='prod-desc-holder'>";
    write += "<p class='product-description'>" + product.description + "</p>";
    write+="</div>";
    write += "</div>";

    body.html(write);
    $(".buy").on('click', function () {
        buyProduct(event.target.id);
    });

    $(".button-back").on('click', function () {
        showCategory(event.target.id.substring(5));
    })
}

var basketCounter = 0;
var basketProducts; //так, я знаю що це максимально неефективно, але працює
function buyProduct(id) {
    let prodID = id.substring(4);
    console.log(prodID);
    basketProducts[prodID] = parseInt(basketProducts[prodID]) + 1;

}


async function showCategory(category) {
    console.log(category + " category");
    let catproducts;
    if (category === "category-All") {
        catproducts = products;
    }
    else {
        let categoryID = category.substring(9);
        console.log(categoryID + " id");
        let response = await fetch("https://nit.tron.net.ua/api/product/list/category/" + categoryID);
        catproducts = await response.json();

    }
    let body = $("#spa-holder");
    let body2 = $("#spa-holder-100");
    body2.css("display", "none");
    body.css("display", "block");

    let write = "";
    for (let i = 0; i < catproducts.length; i++) {
        write += "<div class='container'>";
        write += "<button class='product-holder-button' id='buy-" + catproducts[i].id + "'>+</button>";
        write += "<button class='product-holder' id='product-" + catproducts[i].id + "'>";

        write += "<div class='image-holder' id='imagehd-" + catproducts[i].id + "'>";
        write += "<div class='img-helper' id='imagehl-" + catproducts[i].id + "'>";
        write += "</div>";
        write += "<img src='" + catproducts[i].image_url + "' class='product-container-image' id='img-src-" + catproducts[i].id + "'>";

        write += "</div>";
        write += "<span class='product-holder-name' id='prodnam-" + catproducts[i].id + "'>" + catproducts[i].name + "</span>";
        write += "<div class='price-container' id='pricect-" + catproducts[i].id + "'>";
        if (catproducts[i].special_price !== null) {
            write += "<span class='price-holder' id='pricehd-" + catproducts[i].id + "'>" + catproducts[i].special_price + "</span>";
            write += "<span class='price-holder-deprecated' id='pricedp-" + catproducts[i].id + "'><s>" + catproducts[i].price + "</s></span>";
        }
        else
            write += "<span class='price-holder' id='pricehd-" + catproducts[i].id + "'>" + catproducts[i].price + "</span>";
        write += "</div>";
        write += "</button>";
        write += "</div>";
    }
    body.html(write);
    $(".product-holder").on('click', function () {
        showProduct(event.target.id, category).then(data => console.log("product load"));
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