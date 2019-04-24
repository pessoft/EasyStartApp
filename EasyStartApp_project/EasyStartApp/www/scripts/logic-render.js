var Pages = {
    FerstStartSettingPhone: "#ferstStartSettingPhone",
    FerstStartSettingCity: "#ferstStartSettingCity",
    Catalog: "#catalog",
    Basket: "#basket",
    Info: "#info",
    Hostory: "#history",
}

var Test = true;

function renderLoadRedy() {
    if (isFerstStart()) {
        renderPageFerstStartSettingPhone();
        changePage(Pages.FerstStartSettingPhone);
    } else {
        renderPageCatalog();
        changePage(Pages.Catalog);
    }
}

function changePage(pageId) {
    $.mobile.changePage(pageId, { transition: "none" });
}

function isFerstStart() {
    let cityId = window.localStorage.getItem("cityId");
    let phoneNumber = window.localStorage.getItem("phoneNumber");

    //if (Test) {//to do delete
    //    return false;
    //}

    if (!cityId || !phoneNumber) {
        return true;
    }

    return false;
}

function renderPageFerstStartSettingPhone() {
    bindEvents(Pages.FerstStartSettingPhone);
}

function renderPageFerstStartSettingCity() {
    let template = "";

    for (let cityId in Data.AllowedCity) {
        template += `<div class="city-list-item" city-id="${cityId}">${Data.AllowedCity[cityId]}</div>`;
    }

    let $template = $(template);
    $template.bind("click", function () { selectCity(this) });
    $(`${Pages.FerstStartSettingCity} .city-list`).html($template);

    bindEvents(Pages.FerstStartSettingCity);
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