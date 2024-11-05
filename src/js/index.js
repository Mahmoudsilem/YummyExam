"use strict"


let allMeals;

const sideBarOuter = $("#sideBarOuter");

const allDataDiv = $("#data");
const homePage = $("#homePage");

const btnToggleNav = $("#btnToggleNav");
const searchBtn = $("#searchBtn");

const formContactUsNameRegex = /^[A-Z|a-z]{3,}/;
const formContactUsEmailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
const formContactUsTelRegex = /^\d{10,11}/;
const formContactUsAgeRegex = /\b(2[1-9]|[3-9][0-9]|100)\b/;
const formContactUsPasswordRegext = /^(?=.*?[A-Z])|(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
// const formContactUsREpasswordRegex = / /;

let searchByNameInput;
let searchByFirstLetterInput;

let isNavBarHidden = false


let formContactUsNameInput;
let formContactUsEmailInput;
let formContactUsTelInput;
let formContactUsAgeInput;
let formContactUsPasswordInput;
let formContactUsREpasswordInput;
let formContactUsBtn;

$(window).ready(() => {
    $("#loader").fadeOut(1000);
})
async function getMeals(key = `search.php?s=`) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/${key}`);
    const data = await response.json();
    allMeals = data.meals || [];
    return allMeals;
}
async function getCategories() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const data = await response.json();
    return data.categories || [];
}


function toggleNav() {
    if (isNavBarHidden) {
        $("nav").animate({ left: `0` });
        $(`#btnToggleNav`).html(`
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            `)
        isNavBarHidden = false
    } else {
        const sideBarInnerWidth = $("#sideBarInner").width();
        $("nav").animate({ left: `-${sideBarInnerWidth}px` });
        $(`#btnToggleNav`).html(`
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            `)
        isNavBarHidden = true
    }
}

function displayHome() {
    allMeals.forEach(meal => {
        homePage.append(`
                        <div data-meal-id="${meal.idMeal}" class="item border border-transparent rounded-xl relative">
                            <div>
                                <img class="w-full border border-transparent rounded-xl" src="${meal.strMealThumb}" alt="${meal.strMeal} image">
                            </div>
                            <div
                                class="cover absolute border border-transparent rounded-xl top-0 left-0 bottom-0 right-0 bg-slate-200 bg-opacity-75 text-3xl font-medium text-black flex content-center flex-wrap ps-3">
                                ${meal.strMeal}
                                </div>
                        </div>
            `);
    });
    // displayMoreData();
}


function displayMoreData() {
    $("#formContactUs").remove();   
    const items = Array.from(document.querySelectorAll(".item"));
    items.forEach(item => {
        item.addEventListener("click", function () {
            $("#loader").fadeIn(100);
            let tagsHtml = ``
            allMeals.forEach(meal => {
                if (meal.idMeal == this.dataset.mealId) {                    
                    const tags = [meal.strTags];
                    tags.forEach(tag => {
                        if(tag && tag != "" ){
                            tagsHtml += `<button class="btn-tags me-2">${tag}</button>`;
                        }
                    })
                    allDataDiv.html(`
                <div class="flex item-details gap-5 my-10">
                    <div class="basis-1/4">
                        <div>
                            <img class="w-full border border-transparent rounded-xl" src="${meal.strMealThumb}" alt="${meal.strMeal} image">
                        </div>
                        <h1 class="text-3xl font-medium">${meal.strMeal}</h1>
                    </div>
                    <div class="basis-[75%]">
                        <h2 class="text-3xl font-medium mb-2">Instructions</h2>
                        <p class="pb-3">${meal.strInstructions}</p>

                        <div class="text-3xl">
                            <h3 class="pb-2">Area : <span>${meal.strArea}</span></h3>
                            <h3 class="pb-2">Category : <span>${meal.strCategory}</span></h3>
                            <div class="Recipes">
                                <h3 class="pb-2">Recipes :</h3>
                                <button class="btn-Recipes">${meal.strIngredient1}</button>
                                <button class="btn-Recipes">${meal.strIngredient2}</button>
                                <button class="btn-Recipes">${meal.strIngredient3}</button>
                                <button class="btn-Recipes">${meal.strIngredient4}</button>
                                <button class="btn-Recipes">${meal.strIngredient5}</button>
                                <button class="btn-Recipes">${meal.strIngredient6}</button>
                            </div>
                            <div>
                                <div class="tags mb-4">
                                <h3 class="mb-5">Tages :</h3>
                                ${tagsHtml}
                                </div>

                                <button type="button" class="btn-green"><a href="${meal.strSource}">Source</a></button>
                                <button type="button" class="btn-red"><a href="${meal.strYoutube}">Youtube</a></button>
                            </div>
                        </div>
                    </div>
                </div>
                        `)
                }
            });
            $("#loader").fadeOut(1500);
        })

    });

}
async function searchByNameOrLetter(name, letter) {
    if (name) {
        await getMeals(`search.php?s=${name}`);
    } else if (letter) {
        await getMeals(`search.php?f=${letter}`);
    }
    homePage.html(``);
    displayHome();
    displayMoreData();
}

function displaySearch() {
    $(".search-form").remove();    
    $("#formContactUs").remove();   
    toggleNav();
    allDataDiv.parent().prepend(`
                <form class="search-form flex mt-3 ms-4 gap-2">
                    <input type="text" id="searchByNameInput" class="my-form-control" placeholder="Search by name"/>
                    <input type="text" id="searchByFirstLetterInput" maxlength="1" class="my-form-control" placeholder="Search by first letter" />
                </form>
    `)
    homePage.html(``);
    searchByNameInput = document.getElementById("searchByNameInput")
    searchByFirstLetterInput = document.getElementById("searchByFirstLetterInput");

    searchByNameInput.addEventListener("keyup", () => {
        searchByNameOrLetter(searchByNameInput.value);
    })
    searchByFirstLetterInput.addEventListener("keyup", () => {
        searchByNameOrLetter(false, searchByFirstLetterInput.value);
    })
}

async function displayCategories() {
    $(".search-form").remove();
    $("#formContactUs").remove();   
    const allCategories = await getCategories();
    toggleNav();
    homePage.html(``);

    allCategories.forEach(category => {
        homePage.append(`
                        <div data-meal-id="${category.idCategory}" class="item border border-transparent rounded-xl relative">
                            <div>
                                <img class="w-full border border-transparent rounded-xl" src="${category.strCategoryThumb}" alt="${category.strCategory} image">
                            </div>
                            <div
                                class="cover absolute border border-transparent rounded-xl top-0 left-0 bottom-0 right-0 bg-slate-200 bg-opacity-75  text-black text-center ps-3">
                                <h1 class="text-3xl font-medium">${category.strCategory}</h1>
                                <p>${category.strCategoryDescription}</p>
                                </div>
                        </div>
            `);
    });
    displayCatigoty();
}



async function getMoreInfo(endPoint) {
    return await getMeals(endPoint) || []
}
async function displayCatigoty() {
    const items = Array.from(document.querySelectorAll(".item"));

    items.forEach(item => {
        item.addEventListener("click",async function () {
            const catigoty = this.querySelector(".item .cover h1").innerHTML;
            //inner function to run async getMoreInfo
            async function getCatigotyMeals() {
                allMeals = await getMoreInfo(`filter.php?c=${catigoty}`);
            }
            //runnig inner function
            await getCatigotyMeals();
            homePage.html(``);

            // display all meals in this category
            displayHome();
            //display details
            displayMoreData();
            
        })

    });
}
//area start
async function displayAreas() {
    $(".search-form").remove();    
    $("#formContactUs").remove();   
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    const data = await response.json();
    const allAreas = data.meals;

    toggleNav();
    homePage.html(``);

    allAreas.forEach(area => {
        homePage.append(`
                    <div class="area-item text- flex flex-col content-center flex-wrap">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                        <h2>${area.strArea}</h2>
                    </div>
            `);
    });
    getMealsByAera();
}
async function getMealsByAera() {
    const areaItems = Array.from(document.querySelectorAll(".area-item"));

    areaItems.forEach(areaItem => {
        areaItem.addEventListener("click",async function () {
            const area = this.querySelector(".area-item h2").innerHTML;
            //inner function to run async getMoreInfo
            async function getCatigotyMeals() {
                allMeals = await getMoreInfo(`filter.php?a=${area}`);
            }
            //runnig inner function
            await getCatigotyMeals();
            homePage.html(``);

            // display all meals in this category
            displayHome();
            //display details            
            displayMoreData();
        })
    });
}//area end

//Ingredients start
async function displayIngredients() {
    $(".search-form").remove();   
    $("#formContactUs").remove();     
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const data = await response.json();
    const allIngredients = data.meals;

    toggleNav();
    homePage.html(``);

    allIngredients.forEach(ingredient => {
        homePage.append(`
                    <div class="ingredient-item text-center flex flex-col content-center flex-wrap">
                        <div>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                            </svg>
                        </div>
                        <h2>${ingredient.strIngredient}</h2>
                    </div>
            `);
    });

    getMealsByIngredient();
}
async function getMealsByIngredient() {
    const ingredientItems = Array.from(document.querySelectorAll(".ingredient-item"));

    ingredientItems.forEach(ingredientItem => {
        ingredientItem.addEventListener("click", async function () {
            const ingredient = this.querySelector(".ingredient-item h2").innerHTML;
            //inner function to run async getMoreInfo
            async function getCatigotyMeals() {
                allMeals = await getMoreInfo(`filter.php?i=${ingredient}`);
            }
            //runnig inner function
            await getCatigotyMeals();
            homePage.html(``);

            // display all meals in this category
            displayHome();
            //display details by id

        })

    });
}
//Ingredients end

//contactUs start
function validat(input, regex) {
    if (regex.test(input)) {
        return true;
    } else {
        return false;
    }
}
function openContactUs() {
    $(".search-form").remove();    
    $("#formContactUs").remove();    
    toggleNav();
    homePage.html(``);

    // <div></div>
    allDataDiv.append(`
             <div id="formContactUs" class="relative flex justify-center content-center">
                    <form class="grid md:grid-cols-2 gap-2 w-full">
                        <input id="formContactUsNameInput" type="text" class="my-form-control w-full" placeholder="Enter your name">
                        <input id="formContactUsEmailInput" type="email" class="my-form-control w-full" placeholder="Enter your email">
                        <input id="formContactUsTelInput" type="tel" class="my-form-control w-full" placeholder="Enter your phone number">
                        <input id="formContactUsAgeInput" type="number" class="my-form-control w-full" placeholder="Enter your age">
                        <div>
                            <input id="formContactUsPasswordInput" type="password" class="my-form-control w-full" placeholder="Enter your password">
                            <div class="warning-massege-pass hidden mt-2 text-[14px]  border border-transparent rounded-lg bg-red-400 text-red-700 p-2">
                             Enter valid password
                            </div>
                        </div>
                        <div>
                        <input id="formContactUsREpasswordInput" type="password" class="my-form-control w-full" placeholder="Repassword">
                            <div class="warning-massege-repass hidden mt-2 text-[14px]  border border-transparent rounded-lg bg-red-400 text-red-700 p-2">
                             Enter maching password 
                            </div>
                        </div>
                        <button id="formContactUsBtn" type="submit" class="btn-red-disabled w-full grid-rows-subgrid col-span-2" disabled>Submit</button>
                    </form>
                </div>
        `)
    formContactUsNameInput = $("#formContactUsNameInput");
    formContactUsEmailInput = $("#formContactUsEmailInput");
    formContactUsTelInput = $("#formContactUsTelInput");
    formContactUsAgeInput = $("#formContactUsAgeInput");
    formContactUsPasswordInput = $("#formContactUsPasswordInput");
    formContactUsREpasswordInput = $("#formContactUsREpasswordInput");
    formContactUsBtn = $("#formContactUsBtn");

    formContactUsNameInput.on("keyup", function () {
        if (validat(this.value, formContactUsNameRegex)) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
        }
        updateSubmitButtonState();
    })
    formContactUsEmailInput.on("keyup", function () {
        if (validat(this.value, formContactUsEmailRegex)) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
        }
        updateSubmitButtonState();
    })
    formContactUsTelInput.on("keyup", function () {
        if (validat(this.value, formContactUsTelRegex)) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
        }
        updateSubmitButtonState();
    })
    formContactUsAgeInput.on("keyup", function () {
        if (validat(this.value, formContactUsAgeRegex)) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
        }
        updateSubmitButtonState();
    })
    formContactUsPasswordInput.on("keyup", function () {
        if (validat(this.value, formContactUsPasswordRegext)) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
            $(".warning-massege-pass").addClass("hidden")
        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
            $(".warning-massege-pass").removeClass("hidden");
        }
        updateSubmitButtonState();
    })
    formContactUsREpasswordInput.on("keyup", function () {
        if (this.value == formContactUsPasswordInput.val()) {
            this.classList.add("form-success");
            this.classList.remove("form-error");
            $(".warning-massege-repass").addClass("hidden")

        } else {
            this.classList.remove("form-success");
            this.classList.add("form-error");
            $(".warning-massege-repass").removeClass("hidden");

        }
        updateSubmitButtonState();
    })
}
function updateSubmitButtonState() {
    const allValid = formContactUsNameInput.hasClass("form-success") &&
        formContactUsEmailInput.hasClass("form-success") &&
        formContactUsTelInput.hasClass("form-success") &&
        formContactUsAgeInput.hasClass("form-success") &&
        formContactUsPasswordInput.hasClass("form-success") &&
        formContactUsREpasswordInput.hasClass("form-success");

    if (allValid) {
        formContactUsBtn.removeClass("btn-red-disabled").addClass("btn-red").prop("disabled", false);
    } else {
        formContactUsBtn.removeClass("btn-red").addClass("btn-red-disabled").prop("disabled", true);
    }
}
//contactUs end

btnToggleNav.on("click", () => {
    toggleNav();
})

searchBtn.on("click", function () {
    $("#loader").fadeIn(100);
    displaySearch();
    $("#loader").fadeOut(1500);
})

$("#categoriesBtn").on("click", () => {
    $("#loader").fadeIn(100);
    displayCategories();
    $("#loader").fadeOut(1000);
})
$("#areaBtn").on("click", () => {
    $("#loader").fadeIn(100);
    displayAreas();
    $("#loader").fadeOut(1000);
})
$("#ingredientsBtn").on("click", () => {
    $("#loader").fadeIn(100);
    displayIngredients();
    $("#loader").fadeOut(1000);
})
$("#contactUsBtn").on("click", () => {
    $("#loader").fadeIn(100);
    openContactUs();
    $("#loader").fadeOut(1000);
})


async function startApp() {
    toggleNav();
    await getMeals();
    displayHome();
    displayMoreData();
}
startApp();