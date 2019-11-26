/**
 * Represents a single joke about
 * Chuck Norris from icndb.com
 */
var ChuckNorrisJoke = /** @class */ (function () {
    function ChuckNorrisJoke() {
    }
    return ChuckNorrisJoke;
}());
window.onload = function () {
    var jokeBtn = document.getElementById("get-joke");
    jokeBtn.onclick = fetchJoke;
    populateCategories();
};
function fetchJoke() {
    var jokeBtn = this;
    jokeBtn.disabled = true;
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");
    var request = new XMLHttpRequest();
    request.onreadystatechange = handleJokeResponse;
    var url = "http://api.icndb.com/jokes/random";
    if (isCategorySelected()) {
        var category = getSelectedCategory();
        // .../jokes/random?limitTo=[nerdy]
        url += "?limitTo=[" + category + "]";
    }
    console.log(url);
    // Set URL to send request to
    request.open("GET", url);
    // Initiate request
    request.send();
}
function isCategorySelected() {
    var list = document.getElementById("cat-list");
    if (list.selectedIndex == 0)
        return false;
    return true;
}
/**
 * Return the single category that
 * is selected
 */
function getSelectedCategory() {
    var list = document.getElementById("cat-list");
    var index = list.selectedIndex;
    var cat = list.options[index].text;
    return cat;
}
function handleJokeResponse() {
    var request = this;
    // readyState 4 means request is finished
    // status 200 means "OK" - success
    if (request.readyState == 4 && request.status == 200) {
        // Hold the JSON response from the server
        var responseData = JSON.parse(request.responseText);
        var myJoke = responseData.value;
        displayJoke(myJoke);
        // alert(responseData.value.joke);
        // console.log(responseData);
    }
    else if (request.readyState == 4 && request.status != 200) {
        alert("Please try again later. Something happened.");
    }
}
function displayJoke(j) {
    var jokeTextPar = document.getElementById("joke-text");
    jokeTextPar.innerHTML = j.joke;
    var jokeIdPar = document.getElementById("joke-id");
    jokeIdPar.innerHTML = "Id: " + j.id.toString();
    var categoryList = document.getElementById("categories");
    // Clear out categories from any previous joke
    categoryList.innerHTML = "";
    var allCategories = j.categories;
    allCategories.sort();
    for (var i = 0; i < j.categories.length; i++) {
        var item = document.createElement("li");
        item.innerText = allCategories[i];
        // Creating HTML - <li>Nerdy</li>
        categoryList.appendChild(item);
    }
    var catDisplay = document.getElementById("category-display");
    if (allCategories.length == 0) {
        catDisplay.style.display = "none";
    }
    else {
        catDisplay.style.display = "";
    }
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.remove("loader");
    // R-enable joke button so user can get another joke
    setTimeout(function () {
        var jokBtn = document.getElementById("get-joke");
        jokBtn.disabled = false;
    }, 3000);
}
/**
 * Display categories in a dropdown list
 */
function populateCategories() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.icndb.com/categories");
    request.onreadystatechange = function () {
        // request.readyState == 4
        // request has finished (4) successfully (200)
        if (this.readyState == 4 && this.status == 200) {
            var categories = JSON.parse(this.responseText).value;
            console.log(categories);
            populateCatDropdown(categories);
        }
    };
    request.send();
}
function populateCatDropdown(categories) {
    var list = document.getElementById("cat-list");
    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.text = categories[i];
        list.appendChild(option); // add <option> to the <select>
    }
}
