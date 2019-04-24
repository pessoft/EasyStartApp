var Pages = {
    FirstStartSettingPhone: "#firstStartSettingPhone",
    FirstStartSettingCity: "#firstStartSettingCity",
    Catalog: "#catalog",
    Basket: "#basket",
    Info: "#info",
    Hostory: "#history",
}

function renderLoadRedy() {
    if (isFirstStart()) {
        renderPageFirstStartSettingPhone();
        changePage(Pages.FirstStartSettingPhone);
    } else {
        renderPageCatalog();
        changePage(Pages.Catalog);
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
}

function renderPageProduct() {

}

function renderPageBasket() {

}

function renderPageBasket() {

}

function renderPageInfo() {

}

function renderPageHistory() {

}