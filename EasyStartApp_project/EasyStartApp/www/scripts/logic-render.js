var Pages = {
    FirstStartSettingPhone: "#firstStartSettingPhone",
    FirstStartSettingCity: "#firstStartSettingCity",
    Catalog: "#catalog",
    Product: "#product",
    Basket: "#basket",
    Info: "#info",
    History: "#history"
};

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
    switch (pageId) {
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
    var cityId = window.localStorage.getItem("cityId");
    var phoneNumber = window.localStorage.getItem("phoneNumber");

    if (!cityId || !phoneNumber) {
        return true;
    }

    return false;
}

function renderPageFirstStartSettingPhone() {
    bindEvents(Pages.FirstStartSettingPhone);
}

function renderPageFirstStartSettingCity() {
    var template = "";

    for (var cityId in Data.AllowedCity) {
        template += "<div class=\"city-list-item\" city-id=\"" + cityId + "\">" + Data.AllowedCity[cityId] + "</div>";
    }

    var $template = $(template);
    $template.bind("click", function () {
        selectCity(this);
    });
    $(Pages.FirstStartSettingCity + " .city-list").html($template);

    bindEvents(Pages.FirstStartSettingCity);
}

function renderPageCatalog() {
    var $page = $("" + Pages.Catalog);

    var cityName = Data.AllowedCity[ClientSetting.CityId];
    $page.find(".header span").html(cityName);

    var getTemplateCategory = function getTemplateCategory(data) {
        return "\n            <div class=\"category\" category-id=\"" + data.Id + "\">\n                <div class=\"category-image\">\n                    <img src=\"" + data.Image + "\" />\n                </div>\n                <div class=\"category-content\">\n                    <div class=\"category-header\">" + data.Name + "</div>\n                </div>\n            </div>\n        ";
    };
    var tempateHtmlCategories = "";

    for (var i = 0; i < Data.Categories.length; ++i) {
        tempateHtmlCategories += getTemplateCategory(Data.Categories[i]);
    }

    var $tempateHtmlCategories = $(tempateHtmlCategories);
    $tempateHtmlCategories.bind("click", function () {
        selectCategory(this);
    });

    $page.find(".categories").html($tempateHtmlCategories);
}

function renderPageProduct() {
    var $page = $("" + Pages.Product);
    var category = getDataCategoryById(ClientSetting.CurrentCategory);

    $page.find(".header span").html(category.Name);

    var getTemplateProduct = function getTemplateProduct(data) {
        return "\n            <div class=\"product\" product-id=\"" + data.Id + "\">\n                <div class=\"product-image\">\n                    <img src=\"" + data.Image + "\" />\n                </div>\n                <div class=\"product-content\">\n                    <div class=\"priduct-header\">" + data.Name + "</div>\n                    <div class=\"priduct-addition-info color-dark\">" + data.AdditionInfo + "</div>\n                    <div class=\"priduct-buy\">\n                        <div class=\"priduct-price\">\n                            " + data.Price + " руб.\n                        </div>\n                        <div class=\"priduct-add-basket\">\n                            <div class=\"priduct-add-basket-btn\">\n                                <button class=\"background-color-button color-button\">\n                                    <i class=\"fal fa-shopping-basket\"></i>\n                                </button>\n                            </div>\n                            <div class=\"priduct-add-basket-count hide\">\n                                <div class=\"add-basket-counter\">\n                                    <div class=\"basket-counter-button basket-minus\">\n                                        <i class=\"fal fa-minus\"></i>\n                                    </div>\n                                    <div class=\"basket-counter-value\">\n                                          0\n                                    </div>\n                                    <div class=\"basket-counter-button basket-plus\">\n                                        <i class=\"fal fa-plus\"></i>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ";
    };
    var tempateHtmlProducts = "";
    var products = Data.Products[ClientSetting.CurrentCategory];
    for (var i = 0; i < products.length; ++i) {
        tempateHtmlProducts += getTemplateProduct(products[i]);
    }

    var $tempateHtmlProducts = $(tempateHtmlProducts);
    $tempateHtmlProducts.bind("click", function () {
        showProductFullInfo(this);
    });
    $tempateHtmlProducts.find(".priduct-add-basket-btn button").bind("click", function () {
        showCounterAddToBasket(event, this);
    });
    $tempateHtmlProducts.find(".basket-minus").bind("click", function () {
        minusProductFromBasket(event, this);
    });
    $tempateHtmlProducts.find(".basket-plus").bind("click", function () {
        plusProductFromBasket(event, this);
    });

    $page.find(".products").html($tempateHtmlProducts);
}

function renderPageBasket() { }

function renderPageInfo() { }

function renderPageHistory() { }

function renderProductFullInfo(productId) {
    var product = getDataProductyById(productId);
    var template = "\n        <div class=\"product-full-info\">\n            <div class=\"product-full-info-container\">\n                <div class=\"product-full-info-content page-background-color\">\n                    <div class=\"product-full-info-image\">\n                        <div class=\"full-info-close\">\n                            <i class=\"fal fa-times-circle\"></i>\n                        </div>\n                    </div>\n                    <div class=\"product-full-info-text\">\n                        <div class=\"product-full-info-header\">\n                            " + product.Name + "\n                        </div>\n                        <div class=\"product-full-info-adition color-dark\">\n                            " + product.AdditionInfo + "\n                        </div>\n                        <div class=\"product-full-info-price\">\n                            " + product.Price + " руб.\n                        </div>\n                        <div class=\"product-full-info-description color-dark\">\n                            " + product.Description + "\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ";

    var $template = $(template);
    $template.find(".product-full-info-image").css("background-image", "url(" + product.Image + ")");
    $template.find(".full-info-close").bind("click", closeProductFullInfo);

    $("" + Pages.Product).append($template);
}