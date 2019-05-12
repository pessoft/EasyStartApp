var Pages = {
    Logo: "#logo-load",
    FirstStartSettingPhone: "#firstStartSettingPhone",
    FirstStartSettingCity: "#firstStartSettingCity",
    Catalog: "#catalog",
    Product: "#product",
    Basket: "#basket",
    Info: "#info",
    History: "#history",
    Checkout: "#checkout",
    CheckoutResult: "#checkout-result",
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

function render(pageId, data) {
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
            renderPageInfo(data);
            break;
        case Pages.History:
            renderPageHistory();
            break;
        case Pages.Checkout:
            renderPageCheckout();
            break;
        case Pages.CheckoutResult:
            renderPageCheckoutResult(data);
            break;
    }
}

function changePage(pageId) {
    $.mobile.changePage(pageId, { transition: "none" });
}

function renderPageFirstStartSettingPhone() {
    var phoneNumber = window.localStorage.getItem("phoneNumber");

    if (phoneNumber) {
        $(Pages.FirstStartSettingPhone + " input[type=text]").val(phoneNumber);
        $(Pages.FirstStartSettingPhone + " button").removeAttr("disabled");
    }

    bindEventsFirstStartSettingPhone();
}

function renderPageFirstStartSettingCity() {
    var template = "";

    for (var cityId in Data.AllowedCity) {
        template += "<div class='city-list-item' city-id='" + cityId + "'>" + Data.AllowedCity[cityId] + "</div>";
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
        return "\n            <div class='category' category-id='" + data.Id + "'>\n                <div class='category-image'>\n                    <img src='" + data.Image + "' />\n                </div>\n                <div class='category-content'>\n                    <div class='category-header'>" + data.Name + "</div>\n                </div>\n            </div>\n        ";
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
    bindCatalotChangeCityAndPhone();
}

function renderPageProduct() {
    var $page = $("" + Pages.Product);
    var category = getDataCategoryById(ClientSetting.CurrentCategory);

    $page.find(".header span").html(category.Name);

    var getTemplateProduct = function getTemplateProduct(data) {
        var $templateProduct = $($("#item-product").html());

        $templateProduct.attr("product-id", data.Id);
        $templateProduct.find("img").attr("src", data.Image);
        $templateProduct.find(".product-header").html(data.Name);
        $templateProduct.find(".product-addition-info").html(data.AdditionInfo);
        $templateProduct.find(".product-price").html(data.Price + " руб.");

        return $templateProduct;
    };

    var tempateHtmlProducts = [];
    var products = Data.Products[ClientSetting.CurrentCategory];
    for (var i = 0; i < products.length; ++i) {
        var productItem = getTemplateProduct(products[i]);

        productItem.bind("click", function () {
            showProductFullInfo(this);
        });
        productItem.find(".product-add-basket-btn button").bind("click", function () {
            showCounterAddToBasket(event, this);
        });
        productItem.find(".basket-minus").bind("click", function () {
            minusProductFromBasket(event, this);
        });
        productItem.find(".basket-plus").bind("click", function () {
            plusProductFromBasket(event, this);
        });

        tempateHtmlProducts.push(productItem);
    }

    var $products = $page.find(".products");

    $products.empty();
    $products.append(tempateHtmlProducts);

    if (!jQuery.isEmptyObject(Basket.Products)) {
        for (var id in Basket.Products) {
            if (Basket.Products[id]) {
                $product = $products.find("[product-id=" + id + "]")
                toggleCounterAddToBasket(id, $product);
            }
        }
    }
}

function renderPageBasket() {
    var $page = $(Pages.Basket);

    var getTemplateProduct = function getTemplateProduct(data) {
        var $templateBasketProduct = $($("#basket-product").html());

        $templateBasketProduct.attr("product-id", data.Id);
        $templateBasketProduct.find("img").attr("src", data.Image);
        $templateBasketProduct.find(".basket-product-header").html(data.Name);
        $templateBasketProduct.find(".basket-product-addition-info").html(data.Description);

        var poructCountBasket = Basket.Products[data.Id];
        var strSum = (poructCountBasket * data.Price).toString() + " руб.";
        var strDetail = poructCountBasket + " х " + data.Price + " руб.";

        $templateBasketProduct.find(".basket-product-sum-price").html(strSum);
        $templateBasketProduct.find(".basket-product-detail-price").html(strDetail);

        return $templateBasketProduct;
    };
    var tempateHtmlProducts = [];
    var products = [];

    for (var id in Basket.Products) {
        products.push(getDataProductyById(id))
    }

    for (var i = 0; i < products.length; ++i) {
        var tmp = getTemplateProduct(products[i]);

        tmp.bind("click", function () {
            showProductFullInfo(this);
        });
        tmp.find(".product-add-basket-btn button").bind("click", function () {
            showCounterAddToBasket(event, this);
        });
        tmp.find(".basket-minus").bind("click", function () {
            minusProductFromBasket(event, this);
        });
        tmp.find(".basket-plus").bind("click", function () {
            plusProductFromBasket(event, this);
        });
        tmp.find(".product-remove-basket").bind("click", function () {
            removeProductFromBasket(event, this);
        });

        tempateHtmlProducts.push(tmp);
    }


    var $products = $page.find(".products");
    $products.empty();
    $products.append(tempateHtmlProducts)

    bindCheckout();

    if (!jQuery.isEmptyObject(Basket.Products)) {
        for (var id in Basket.Products) {
            if (Basket.Products[id]) {
                $product = $products.find("[product-id=" + id + "]")
                toggleCounterAddToBasket(id, $product);
            }
        }
    }
}

function renderPageInfo(data) {
    $("#info-address .info-item-content").html(data.Address);
    $("#info-phone .info-item-content").html(data.Phones);
    $("#info-work-time .info-item-content").html(data.WorkTime);
    $("#info-price-delivery .info-item-content").html(data.PriceDelivery);
    $("#info-buy .info-item-content").html(data.TypesBuy);

    var additionalInfo = function (id, content) {
        if (content) {
            $("#" + id + " .info-item-content").html(content);
            $("#" + id).removeClass("hide");
        } else {
            $("#" + id).addClass("hide");
        }
    }

    additionalInfo("info-email", data.Email);
    additionalInfo("info-vk", data.Vkontakte);
    additionalInfo("info-instagram", data.Instagram);
    additionalInfo("info-facebook", data.Facebook);
}

function renderHistoryOrderItem(order) {
    var $template = $($("#history-order").html());
    var getStrDataOrder = function () {
        var orderNumber = "№ " + order.Id;
        var productCount = Object.keys(order.ProductCount).length;
        var wordDeclension = num2str(productCount, ["блюдо", "блюда", "блюд"]);
        productCount = productCount + " " + wordDeclension;
        var price = getPriceValid(order.AmountPay) + " руб."
        var date = getDateFormatted(order.Date);
        var products = [];

        for (var productId in order.ProductCount) {
            var count = order.ProductCount[productId];
            var product = getDataProductyById(productId);
            var priceItemProduct = count + " х " + getPriceValid(product.Price) + " руб.";
            var itemProductHistory = {
                Image: product.Image,
                Name: product.Name,
                Price: priceItemProduct
            };

            products.push(itemProductHistory);
        }

        return {
            OrderNumber: orderNumber,
            ProductCount: productCount,
            Price: price,
            Date: date,
            Products: products
        };
    }
    var data = getStrDataOrder();
    var orderInfo = data.ProductCount + ", " + data.Price;

    $template.find(".history-order-number-header").html(data.OrderNumber);
    $template.find(".history-order-header-main-info").append(orderInfo);
    $template.find(".history-order-header-date").html(data.Date);

    var productsRender = [];
    for (var id in data.Products) {
        var $templeteProduct = $($("#history-order-product-item").html());
        var product = data.Products[id];

        $templeteProduct.find("img").attr("src", product.Image);
        $templeteProduct.find(".order-product-item-name").html(product.Name);
        $templeteProduct.find(".order-product-price-info").html(product.Price);

        productsRender.push($templeteProduct);
    }

    $template.find(".history-order-content").html(productsRender);

    bindToggleOrderHistoryInfo($template);

    return $template;
}

function renderPageHistory() {
    var $page = $(Pages.History + " .content");
    var loader = new Loader($page);

    loader.start();
    var funcRenderPageHistory = function () {
        if (Data.HistoryOrder &&
            Data.HistoryOrder.length > 0) {
            var itemsRender = [];
            for (var i = Data.HistoryOrder.length - 1; i >= 0; --i) {
                var order = Data.HistoryOrder[i];
                itemsRender.push(renderHistoryOrderItem(order));
            }

            $page.find(".history-list").html(itemsRender);
            $page.find(".empty-content").addClass("hide");
        } else {
            $page.find(".empty-content").removeClass("hide");
        }

        loader.stop();
    }

    var renderErrorHistoryOrder = function (message) {
        loader.stop();
        $page.find(".empty-content").removeClass("hide");
    }

    GetHistoryOrder(funcRenderPageHistory, renderErrorHistoryOrder);
}

function renderProductFullInfo(productId) {
    var product = getDataProductyById(productId);
    var $template = $($("#product-full-info").html());

    $template.find(".product-full-info-header").html(product.Name);
    $template.find(".product-full-info-adition ").html(product.AdditionInfo);
    $template.find(".product-full-info-price ").html(product.Price + " руб.");
    $template.find(".product-full-info-description ").html(product.Description);

    $template.find(".product-full-info-image").css("background-image", "url(" + product.Image + ")");
    $template.find(".full-info-close").bind("click", closeProductFullInfo);

    var currentPage = $.mobile.activePage.attr("id");
    $("#" + currentPage).append($template);
}

function clearPgeCheckout() {
    var $page = $(Pages.Checkout);

    $page.find(".order-collect-info").scrollTop(0);
    $page.find("input[type=text]").val("");
    $page.find("textarea").val("");
    $page.find("#take-yourself-radio").attr("checked", "checked");
    $page.find("#collect-delivery-radio").removeAttr("checked");
    $page.find("#collect-buy-cash-radio").attr("checked", "checked");
    $page.find("#collect-buy-card-radio").removeAttr("checked");
    $page.find("[is-cash-back=true]").removeClass("delivery-cash-back-switch-active");
    $page.find("[is-cash-back=false]").addClass("delivery-cash-back-switch-active");
    $page.find("#delivery-cash-back").addClass("hide");
}

function renderPageCheckout() {
    clearPgeCheckout();

    bindCheckoutCashBackSwith();
    bindCheckoutBuyType();
    bindCheckoutDeliveryType();
    bindCheckoutFinished();

    var $phoneNumber = $("#collect-item-phone-number");
    $phoneNumber.mask("+7(999)999-99-99");
    $phoneNumber.val(ClientSetting.PhoneNumber)

    $("#collect-item-sum-price .result-price-item-value").html(getPriceValid(Basket.OrderPrice) + " руб.");

    var $disount = $("#collect-item-discount-price");
    $disount.find(".result-price-item-value").html(Basket.Discount + "%");

    if (Basket.Discount == 0) {
        $disount.addClass("hide");
    } else {
        $disount.removeClass("hide");
    }

    var $delivery = $("#collect-item-delivery-price");
    $delivery.find(".result-price-item-value").html(getPriceValid(Basket.DeliveryPrice) + " руб.");

    if (Basket.DeliveryPrice == 0) {
        $delivery.addClass("hide");
    } else {
        $delivery.removeClass("hide");
    }

    $("#collect-item-result-sum-price .result-price-item-value").html(getAmountPayWithDiscountDelivery() + " руб.");
}

function renderPageCheckoutResult(data) {
    var msg = "";

    if (data.ResultData.Success) {
        msg = "Заказ №" + data.ResultData.Data + " оформлен";

        $(".checkout-result-failure").addClass("hide");
        $(".checkout-result-success").removeClass("hide");

        $(".checkout-result-success").find("span").html(msg);

        if (Data.HistoryOrder &&
            Data.HistoryOrder.length != 0) {
            data.Order["Id"] = data.ResultData.Data;
            data.Order["ProductCount"] = JSON.parse(data.Order["ProductCountJSON"]);

            Data.HistoryOrder.push(data.Order);
        }

    } else {
        msg = "В ходе оформления заказа что то пошло не так";

        $(".checkout-result-success").addClass("hide");
        $(".checkout-result-failure").removeClass("hide");

        $(".checkout-result-failure").find("span").html(msg);
    }

    binCheckoutResultOk();
}