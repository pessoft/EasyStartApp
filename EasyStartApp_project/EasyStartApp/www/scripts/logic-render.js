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

    let $tempateHtmlCategories = $(tempateHtmlCategories);
    $tempateHtmlCategories.bind("click", function () { selectCategory(this) });

    $page.find(".categories").html($tempateHtmlCategories);

}

function renderPageProduct() {
    let $page = $(`${Pages.Product}`);
    let category = getDataCategoryById(ClientSetting.CurrentCategory);

    $page.find(".header span").html(category.Name);

    let getTemplateProduct = function (data) {
        return `
            <div class="product" product-id="${data.Id}">
                <div class="product-image">
                    <img src="${data.Image}" />
                </div>
                <div class="product-content">
                    <div class="priduct-header">${data.Name}</div>
                    <div class="priduct-addition-info color-dark">${data.AdditionInfo}</div>
                    <div class="priduct-buy">
                        <div class="priduct-price">
                            ${data.Price} руб.
                        </div>
                        <div class="priduct-add-basket">
                            <div class="priduct-add-basket-btn">
                                <button class="background-color-button color-button">
                                    <i class="fal fa-shopping-basket"></i>
                                </button>
                            </div>
                            <div class="priduct-add-basket-count hide">
                                <div class="add-basket-counter">
                                    <div class="basket-counter-button basket-minus">
                                        <i class="fal fa-minus"></i>
                                    </div>
                                    <div class="basket-counter-value">
                                          0
                                    </div>
                                    <div class="basket-counter-button basket-plus">
                                        <i class="fal fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    let tempateHtmlProducts = "";
    let products = Data.Products[ClientSetting.CurrentCategory];
    for (let product of products) {
        tempateHtmlProducts += getTemplateProduct(product);
    }

    let $tempateHtmlProducts = $(tempateHtmlProducts);
    $tempateHtmlProducts.bind("click", function () { showProductFullInfo(this) });
    $tempateHtmlProducts.find(".priduct-add-basket-btn button").bind("click", function () { showCounterAddToBasket(event, this) });
    $tempateHtmlProducts.find(".basket-minus").bind("click", function () { minusProductFromBasket(event, this) });
    $tempateHtmlProducts.find(".basket-plus").bind("click", function () { plusProductFromBasket(event, this) });

    $page.find(".products").html($tempateHtmlProducts);
}

function renderPageBasket() {

}


function renderPageInfo() {

}

function renderPageHistory() {

}

function renderProductFullInfo(productId) {
    let product = getDataProductyById(productId);
    let template = `
        <div class="product-full-info">
            <div class="product-full-info-container">
                <div class="product-full-info-content page-background-color">
                    <div class="product-full-info-image">
                        <div class="full-info-close">
                            <i class="fal fa-times-circle"></i>
                        </div>
                    </div>
                    <div class="product-full-info-text">
                        <div class="product-full-info-header">
                            ${product.Name}
                        </div>
                        <div class="product-full-info-adition color-dark">
                            ${product.AdditionInfo}
                        </div>
                        <div class="product-full-info-price">
                            ${product.Price} руб.
                        </div>
                        <div class="product-full-info-description color-dark">
                            ${product.Description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    let $template = $(template);
    $template.find(".product-full-info-image").css("background-image", `url(${product.Image})`);
    $template.find(".full-info-close").bind("click", closeProductFullInfo);

    $(`${Pages.Product}`).append($template);
}