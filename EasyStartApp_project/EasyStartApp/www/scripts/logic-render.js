var Pages = {
    Logo: "#logo-load",
    FirstStartSettingPhone: "#firstStartSettingPhone",
    FirstStartSettingCity: "#firstStartSettingCity",
    Catalog: "#catalog",
    Product: "#product",
    Stock: "#stock",
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
        case Pages.Stock:
            renderPageStock();
            break;
    }
}

function changedPage(pageId) {
    switch (pageId) {
        case Pages.Checkout:
            scrollTop($(pageId + " .order-collect-info"));
            break;
        case Pages.Product:
            scrollTop($(pageId + " .products"));
            break;
    }
}

function changePage(pageId) {
    $.mobile.changePage(pageId, { transition: "none" });
    changedPage(pageId);
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

    var tempateHtmlCategories = [];
    for (var i = 0; i < Data.Categories.length; ++i) {
        var category = Data.Categories[i];
        var $template = $(getTemplateCategory(category));

        $template.bind("click", function () {
            selectCategory(this);
        });

        tempateHtmlCategories[category.OrderNumber - 1] = $template;
    }

    var newArr = [];
    for (var id in tempateHtmlCategories) {
        newArr.push(tempateHtmlCategories[id]);
    }
    $categories = $page.find(".categories");

    $categories.empty();
    $categories.append(newArr)
    bindCatalotChangeCityAndPhone();
}

function renderPageProduct() {
    var $page = $("" + Pages.Product);
    var category = getDataCategoryById(ClientSetting.CurrentCategory);

    $page.find(".header span").html(category.Name);

    var getTemplateProduct = function getTemplateProduct(data) {
        var $templateProduct = $($("#item-product").html());

        if (data.ProductType != 0) {
            var $productType = $($("#" + ProductType[data.ProductType]).html());

            $templateProduct.find(".product-addition-info-container").append($productType);
        }

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
        var product = products[i];
        var $productItem = getTemplateProduct(product);

        $productItem.bind("click", function () {
            showProductFullInfo(this);
        });
        $productItem.find(".product-add-basket-btn button").bind("click", function () {
            showCounterAddToBasket(event, this);
        });
        $productItem.find(".basket-minus").bind("click", function () {
            minusProductFromBasket(event, this);
        });
        $productItem.find(".basket-plus").bind("click", function () {
            plusProductFromBasket(event, this);
        });

        tempateHtmlProducts[product.OrderNumber - 1] = $productItem;
    }

    var newArr = [];

    for (var id in tempateHtmlProducts) {
        newArr.push(tempateHtmlProducts[id]);
    }

    var $products = $page.find(".products");

    $products.empty();
    $products.append(newArr);

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
    var uniqId = generateUniqId();
    var $template = $($("#product-full-info").html());

    $template.attr("id", uniqId);
    $template.attr("product-id", product.Id);
    $template.find(".product-full-info-header").html(product.Name);
    $template.find(".product-full-info-adition ").html(product.AdditionInfo);
    $template.find(".product-full-info-price ").html(product.Price + " руб.");
    $template.find(".product-full-info-description ").html(product.Description);

    $template.find(".product-full-info-image").css("background-image", "url(" + product.Image + ")");
    $template.find(".full-info-close").bind("click", closeProductFullInfo);

    var sendProductReviewFunc = function () {
        sendProductReview(uniqId, product.Id);
    }

    $template.find("#send-product-review").bind("click", sendProductReviewFunc);

    var isReadOnly = isReadOnlyRating(product.Id);

    $template.find("#rating").raty({
        score: product.Rating,
        showHalf: true,
        path: "images/rating",
        targetKeep: true,
        precision: true,
        readOnly: isReadOnly,
        click: function (score) {
            score = parseInt(score);
            setReadOnlyRating(product.Id);
            var newRating = calcRating(product.VotesSum, score, product.VotesCount);
            product.Rating = newRating.Rating;
            product.VotesCount = newRating.VotesCount;
            updateProducRating(product.Id, score);

            var $rating = $("#rating");
            $rating.raty('score', product.Rating);
            $rating.raty('readOnly', true);

            var ratingText = renderRatingText(product.Rating, product.VotesCount);
            $("#rating-text").html(ratingText);
        }
    });
    var ratingText = renderRatingText(product.Rating, product.VotesCount);
    $template.find("#rating-text").html(ratingText);

    var $reviewContainer = $template.find(".product-full-info-review-list");
    var loader = new Loader($reviewContainer);

    loader.start();

    var callback = function () {
        loader.stop();

        renderReviews($reviewContainer, product.Id);

        var currentPage = $.mobile.activePage.attr("id");
        $("#" + currentPage).append($template);
    }

    if (ProductReview[product.Id] &&
        ProductReview[product.Id].length > 0) {
        renderReviews($reviewContainer, product.Id);
    } else {
        getProductReviews(product.Id, callback);
    }

    var currentPage = $.mobile.activePage.attr("id");
    $("#" + currentPage).append($template);
}

function renderNewReview(containerId, data) {
    var $container = $("#" + containerId).find(".product-full-info-review-list");
    var $template = renderReviewItem(data);

    if ($container.find("i").length == 0) {
        $container.prepend($template);
    } else {
        $container.html($template);
    }
}

function renderReviewItem (data) {
    var $template = $($("#review-item").html());
    var userName = "Клиент: " + data.PhoneNumber;

    $template.find(".review-item-username").html(userName);
    $template.find(".review-item-text").html(data.ReviewText);

    return $template;
}

function renderReviews(container, productId) {
    var $container = $(container);
    var reviews = ProductReview[productId];
    var templateReviewImtes = [];

    if (reviews &&
        reviews.length != 0) {
        for (id in reviews) {
            var review = reviews[id];

            templateReviewImtes.push(renderReviewItem(review));
        }

        $container.html(templateReviewImtes);
    } else {
        var $emptyReview = $($("#review-item-empty").html());
        $container.html($emptyReview);
    }
}

function renderRatingText(rating, votesCount) {
    var votesCountStr = num2str(votesCount, ["голос", "голоса", "голосов"]);
    var result = "Оценка: " + rating.toFixed(1) + " - " + votesCount + " " + votesCountStr

    return result;
}

function scrollTop(e) {
    $(e).scrollTop(0);
}

function clearPageCheckout() {
    var $page = $(Pages.Checkout);

    $page.find("#area-delivery").html("Район доставки *");
    $page.find("#area-delivery").removeAttr("selected");
    $page.find("#delivery-cash-back").val("");
    $page.find(".delivery-cash-back").removeClass("hide");
    $page.find("input[type=text]").val("");
    $page.find("textarea").val("");
    $page.find("#take-yourself-radio").attr("checked", "checked");
    $page.find("#collect-delivery-radio").removeAttr("checked");
    $page.find("#collect-buy-cash-radio").attr("checked", "checked");
    $page.find("#collect-buy-card-radio").removeAttr("checked");
    $page.find("[is-cash-back=true]").removeClass("delivery-cash-back-switch-active");
    $page.find("[is-cash-back=false]").addClass("delivery-cash-back-switch-active");
    $page.find("#delivery-cash-back").addClass("hide");
    $page.find("#address-order-delivery").addClass("hide");
}

function renderPageCheckout() {
    clearPageCheckout();

    bindCheckoutCashBackSwith();
    bindCheckoutBuyType();
    bindCheckoutDeliveryType();
    bindCheckoutFinished();

    var $phoneNumber = $("#collect-item-phone-number");
    $phoneNumber.mask("+7(999)999-99-99");
    $phoneNumber.val(ClientSetting.PhoneNumber)

    $("#collect-item-sum-price .result-price-item-value").html(getPriceValid(Basket.OrderPrice) + " руб.");

    var $delivery = $("#collect-item-delivery-price");
    $delivery.find(".result-price-item-value").html(getPriceValid(Basket.DeliveryPrice) + " руб.");

    var takeYourselfDelivery = $("#take-yourself-radio").is(":checked");
    changeCheckoutDiscountType($("#take-yourself-radio"));
    if (Basket.DeliveryPrice == 0 || takeYourselfDelivery) {
        $delivery.addClass("hide");
    } else {
        $delivery.removeClass("hide");
    }

    var discount = $("#collect-item-discount-price");
    discount.find(".result-price-item-value").html(Basket.Discount + "%");

    if (Basket.Discount == 0) {
        discount.addClass("hide");
    } else {
        discount.removeClass("hide");
    }

    var amount = takeYourselfDelivery ? getAmountPayWithDiscount() : getAmountPayWithDiscountDelivery();

    $("#collect-item-result-sum-price .result-price-item-value").html(amount + " руб.");
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

function renderPageStock() {
    if (!Data.Stock ||
        Data.Stock.length == 0) {
        $(Pages.Stock + " .empty-content").removeClass("hide");

        return;
    }

    var $page = $(Pages.Stock);
    $page.find(".stocks").empty();

    $page.find(".empty-content").addClass("hide");
    var templats = [];
    var renderItemFunc = function (data) {
        var $template = $($("#stock-item-template").html());

        $template.find("img").attr("src", data.Image);
        $template.find(".stock-item-name").html(data.Name);

        $template.bind("click", function () {
            renderDescriptionFunc(data);
        });
        templats.push($template);
    }

    var renderDescriptionFunc = function (data) {
        var $template = $($("#stock-item-description-template").html());
        var id = generateUniqId();

        $template.attr("id", id);
        $template.find(".stock-item-description-text").html(data.Description);
        $template.find(".stock-description-close").bind("click", function () {
            $("#" + id).remove();
        });

        $page.append($template);

    }

    for (var id in Data.Stock) {
        var stock = Data.Stock[id];

        renderItemFunc(stock);
    }

    $page.find(".stocks").append(templats)
}