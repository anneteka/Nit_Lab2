console.log('Hello!');
console.log(`The time is ${new Date()}`);


import regeneratorRuntime from "regenerator-runtime";
import jQuery from 'jQuery';

// async function fetchDataAsync() {
//     let categories = jQuery.get("http://nit.tron.net.ua/api/category/list");
//     return categories;
// }
//
// fetchDataAsync()
// .then(data => console.log(data))
//     .catch(reason => console.log(reason.message));

async function fetchAsync () {
    // await response of fetch call
    let response = await fetch('http://nit.tron.net.ua/api/category/list');
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// trigger async function
// log response or catch error of fetch promise
fetchAsync()
    .then(data => console.log(data))
    .catch(reason => console.log(reason.message))