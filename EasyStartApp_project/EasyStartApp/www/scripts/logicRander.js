var Pages = {
    FersStart: "#ferstStart",
    Catalog: "#catalog",
    Basket: "#basket",
    Info: "#info",
    Hostory: "#history",
}

var Test = true;

function renderLoadRedy() {
    if (isFerstStart()) {
        renderPageFerstStart();
        changePage(Pages.FersStart);
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

    if (Test) {//Do to delete
        return false;
    }

    if (!selectCity || !phoneNumber) {
        return true;
    }

    return false;
}

function renderPageFerstStart() {

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