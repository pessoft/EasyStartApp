var Pages = {
    FersStartSettingPhone: "#ferstStartSettingPhone",
    FersStartSettingCity: "#ferstStartSettingCity",
    Catalog: "#catalog",
    Basket: "#basket",
    Info: "#info",
    Hostory: "#history",
}

var Test = true;

function renderLoadRedy() {
    if (isFerstStart()) {
        renderPageFerstStartSettingPhone();
    } else {
        renderPageCatalog();
        changePage(Pages.Catalog);
    }
}

function changePage(pageId) {
    $.mobile.changePage(pageId, { transition: "none" });
}

function isFerstStart() {
    let selectCity = window.localStorage.getItem("selectCity");
    let phoneNumber = window.localStorage.getItem("phoneNumber");

    if (Test) {//to do delete
        return false;
    }

    if (!selectCity || !phoneNumber) {
        return true;
    }

    return false;
}

function renderPageFerstStartSettingPhone() {
    changePage(Pages.FersStartSettingPhone);
}

function renderPageFerstStartSettingCity() {
    //template = 
}

function renderPageCatalog() {

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