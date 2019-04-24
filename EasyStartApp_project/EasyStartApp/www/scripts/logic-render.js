var Pages = {
    FirstStartSettingPhone: "#firstStartSettingPhone",
    FirstStartSettingCity: "#firstStartSettingCity",
    Catalog: "#catalog",
    Product: "#product",
    Basket: "#basket",
    Info: "#info",
    History: "#history",
}

function renderLoadRedy() {
    if (isFirstStart()) {
        render(Pages.FirstStartSettingPhone);
        changePage(Pages.FirstStartSettingPhone);
    } else {
        render(Pages.Catalog);
        changePage(Pages.Catalog);
    }
}

function render(pageId) {
    switch (pageId){
        case Pages.FirstStartSettingPhone:
            renderPageFirstStartSettingPhone();
            break;
        case Pages.FirstStartSettingCity:
            renderPageFirstStartSettingCity();
            break;
        case Pages.Catalog:
            renderPageCatalog();
            break;
        case Pages.Product:
            renderPageProduct();
            break;
        case Pages.Basket:
            renderPageBasket();
            break;
        case Pages.Info:
            renderPageInfo();
            break;
        case Pages.History:
            renderPageHistory();
            break;
    }
}

function changePage(pageId) {
    $.mobile.changePage(pageId, { transition: "none" });
}

function isFirstStart() {
    let cityId = window.localStorage.getItem("cityId");
    let phoneNumber = window.localStorage.getItem("phoneNumber");

    if (!cityId || !phoneNumber) {
        return true;
    }

    return false;
}

function renderPageFirstStartSettingPhone() {
    bindEvents(Pages.FirstStartSettingPhone);
}

function renderPageFirstStartSettingCity() {
    let template = "";

    for (let cityId in Data.AllowedCity) {
        template += `<div class="city-list-item" city-id="${cityId}">${Data.AllowedCity[cityId]}</div>`;
    }

    let $template = $(template);
    $template.bind("click", function () { selectCity(this) });
    $(`${Pages.FirstStartSettingCity} .city-list`).html($template);

    bindEvents(Pages.FirstStartSettingCity);
}

function renderPageCatalog() {
    let $page = $(`${Pages.Catalog}`);

    let cityName = Data.AllowedCity[ClientSetting.CityId];
    $page.find(".header span").html(cityName);

    let getTemplateCategory = function (data) {
        return `
            <div class="category" category-id="${data.Id}">
                <div class="category-image">
                    <img src="${data.Image}" />
                </div>
                <div class="category-content">
                    <div class="category-header">${data.Name}</div>
                </div>
            </div>
        `;
    }
    let tempateHtmlCategories = "";

    for (let category of Data.Categories) {
        tempateHtmlCategories += getTemplateCategory(category);
    }

    $page.find(".categories").html(tempateHtmlCategories);

}

function renderPageProduct() {

}

function renderPageBasket() {

}


function renderPageInfo() {

}

function renderPageHistory() {

}