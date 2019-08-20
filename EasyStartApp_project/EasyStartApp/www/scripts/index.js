$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    loadData();
    bindAreaDelivery()
});

function bindAreaDelivery() {
    var actionClick = function () {
        showAreaDelivery(Pages.Checkout);
    };

    $("#area-delivery").bind("click", actionClick);
}

$(document).bind('pagechange', function () {
    if ($.mobile.activePage.is(Pages.History)) {
        render(Pages.History);
    } else if ($.mobile.activePage.is(Pages.Stock)) {
        render(Pages.Stock);
    }

    if (!$.mobile.activePage.is(Pages.Checkout)) {
        Basket.Discount = 0;
    }

});

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
};

function onBackKeyDown() {
    if ($.mobile.activePage.is("#products")) {
        navigator.app.backHistory();
    }
}

$('.link').live('tap', function () {
    url = $(this).attr("rel");
    loadURL(url);
});

function loadURL(url) {
    navigator.app.loadUrl(url, { openExternal: true });
    return false;
}

function loadData() {
    setClientSettingData();

    Promise.all([
        getAllowedCityPromise(),
        getCategoriesPromise(),
        getAllProductPromise(),
        getStockPromise(),
        checkActualUserDataPromise()
    ]).then(function (results) {
        loadDataReady();
        if (!isFirstStart()) {
            loadSettings();
        }
    }).catch(function (er) {
        changePage(Pages.Logo);
    });
}

function loadDataReady() {
    renderLoadRedy();
}

function setClientSettingData() {
    ClientSetting.PhoneNumber = window.localStorage.getItem("phoneNumber");
    ClientSetting.CityId = window.localStorage.getItem("cityId");
    ClientSetting.ClientId = window.localStorage.getItem("clientId");
}

function clearClientSettingData() {
    window.localStorage.removeItem("phoneNumber");
    window.localStorage.removeItem("cityId");
    window.localStorage.removeItem("clientId");
    window.localStorage.removeItem("isFirstOrder");

    clearClientRating();
}

function clearClientRating() {
    var keys = Object.keys(window.localStorage);

    for (var index in keys) {
        var key = keys[index];

        if (key.indexOf("rating") != -1) {
            window.localStorage.removeItem(key);
        }
    }
}

function setPhoneNumber() {
    var phoneNumber = $(Pages.FirstStartSettingPhone + " input[type=text]").val();

    window.localStorage.setItem("phoneNumber", phoneNumber);
    ClientSetting.PhoneNumber = phoneNumber;

    addOrUpdateClient(phoneNumber);

    render(Pages.FirstStartSettingCity);
    changePage(Pages.FirstStartSettingCity);
}

function selectCity(e) {
    var $e = $(e);
    var $parent = $e.parents(".city-list");

    $($parent.find(".active-city-item")).removeClass("active active-city-item");
    $e.addClass("active active-city-item");

    $(Pages.FirstStartSettingCity + " button").removeAttr("disabled");
}

function setSelectCity() {
    var loader = new Loader(Pages.FirstStartSettingCity);
    loader.start();
    var cityId = $(Pages.FirstStartSettingCity + " .active-city-item").attr("city-id");

    window.localStorage.setItem("cityId", cityId);
    ClientSetting.CityId = cityId;

    var startApp = function () {
        loadSettings();

        render(Pages.Catalog);
        changePage(Pages.Catalog);

        loader.stop();
    }

    getStockPromise().then(function (result) { startApp() });
}

function inputEnterPhoneNumber() {
    var $inputPhoneNumber = $("#client-phone");
    var symbolCount = 16; //+7(999)999-99-99 - 16 symbols
    var $button = $(Pages.FirstStartSettingPhone + " button");
    var val = $inputPhoneNumber.val().replace(/_/g, "");

    if (val.length < symbolCount) {
        $button.attr("disabled", "disabled");
    }
}

function replaceImagePathPath(path) {
    return path.replace("..", ServiceURL);
}

function processingImagePath(data) {
    for (var i = 0; i < data.length; ++i) {
        data[i].Image = replaceImagePathPath(data[i].Image);
    }

    return data;
}

function processingImagePathAndDescription(data) {
    for (var i = 0; i < data.length; ++i) {
        data[i].Image = replaceImagePathPath(data[i].Image);
        data[i].Description = data[i].Description.replace(/\n/g,"<br>")
    }

    return data;
}

function selectCategory(e) {
    var $e = $(e);

    var categoryId = $e.attr("category-id");
    var loader = new Loader($(Pages.Catalog + " .content"));
    loader.start();
    ClientSetting.CurrentCategory = categoryId;

    getProducts(categoryId, loader);
}

function getDataCategoryById(categoryId) {
    var data;

    for (var i = 0; i < Data.Categories.length; ++i) {
        if (Data.Categories[i].Id == categoryId) {
            data = Data.Categories[i];
            break;
        }
    }

    return data;
}

function getDataProductyById(productId, categoryId) {
    var data;
    var products = [];

    if (categoryId) {
        products = Data.Products[ClientSetting.CurrentCategory];
    } else {
        for (var id in Data.Products) {
            products = products.concat(Data.Products[id]);
        }
    }

    for (var i = 0; i < products.length; ++i) {
        if (products[i].Id == productId) {
            data = products[i];
            break;
        }
    }

    return data;
}

function showProductFullInfo(e) {
    var $parent = getParentProduct(e);

    var productId = $parent.attr("product-id");
    renderProductFullInfo(productId);
}

function getParentProduct(e) {
    var $parent = $(e).parents("[product-id]");

    if ($parent.length == 0) {
        if ($(e).attr("product-id") !== undefined) {
            $parent = $(e);
        }
    }

    return $parent;
}

function closeProductFullInfo() {
    var currentPage = $.mobile.activePage.attr("id");
    $("#" + currentPage + " .product-full-info").remove();
}

function showCounterAddToBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    toggleCounterAddToBasket(productId, $parent);
    render(Pages.Basket);
}

function toggleCounterAddToBasket(productId, $parent) {
    if (!Basket.Products[productId]) {
        Basket.Products[productId] = 1;
    }

    $parent.find(".product-add-basket-btn").addClass("hide");
    $parent.find(".product-add-basket-count").removeClass("hide");

    $parent.find(".basket-counter-value").html(Basket.Products[productId]);
    toggleCountProductsInBasket();
}


function minusProductFromBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    --Basket.Products[productId];

    updateBasketPage(productId);
    updateBasketCountValue($parent, Basket.Products[productId])
    toggleCountProductsInBasket();
    updateBasketProductPrice(productId);

    if (Basket.Products[productId] == 0) {
        delete (Basket.Products[productId]);
    }

}

function plusProductFromBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    if (Basket.Products[productId] != 999) {
        ++Basket.Products[productId];
    }

    updateBasketPage(productId);
    updateBasketCountValue($parent, Basket.Products[productId])
    toggleCountProductsInBasket();
    updateBasketProductPrice(productId);
}

function updateBasketCountValue($container, value) {
    if (value == 0) {
        $container.find(".product-add-basket-btn").removeClass("hide");
        $container.find(".product-add-basket-count").addClass("hide");
    } else {
        $container.find(".basket-counter-value").html(value);
    }
}

function clearBasketCountValue() {
    $(".product-add-basket-btn").removeClass("hide");
    $(".product-add-basket-count").addClass("hide");
}

function toggleCountProductsInBasket() {
    var $basketCountInfo = $(".basket-count-info");
    var countItems = 0;;

    for (var id in Basket.Products) {
        countItems += Basket.Products[id];
    }

    if (countItems == 0) {
        $basketCountInfo.addClass("hide");
        $basketCountInfo.empty();
        $(Pages.Basket + " .empty-content").removeClass("hide");
    } else {
        $(Pages.Basket + " .empty-content").addClass("hide");
        var countItemsStr = countItems + " шт";

        $basketCountInfo.removeClass("hide");
        $basketCountInfo.html(countItemsStr)

        stringsPrice = getStringsPrice();
        $(".sum-order").html(stringsPrice.SumOrder);
        $(".sum-delivery").html(stringsPrice.SumDelivery);
        //$(".sum-discount").html(stringsPrice.Discount);
        $(".sum-all").html(stringsPrice.AllSum);

        //if (Basket.Discount == 0) {
        //    $(".sum-discount").addClass("hide");
        //} else {
        //    $(".sum-discount").removeClass("hide");
        //}
    }
}

function getStringsPrice() {
    var sumOrder = 0;


    for (var id in Basket.Products) {
        var product = getDataProductyById(id);
        sumOrder += product.Price * Basket.Products[id];
    }

    var minPriceDelivery = getMinAreaDelivery();
    var sumDelivery = sumOrder >= minPriceDelivery ? 0 : DeliverySetting.PriceDelivery;
    var orderPrice = (sumOrder - (sumOrder * Basket.Discount / 100));
    var stringsPrice = {
        Discount: "Скидка: " + Basket.Discount + "%",
        SumOrder: "Заказ: " + getPriceValid(sumOrder) + " руб.",
        SumDelivery: "Доставка: " + (sumDelivery == 0 ? "бесплатно" : getPriceValid(sumDelivery) + " руб."),
        AllSum: "К оплате: " + getPriceValid(orderPrice + sumDelivery) + " руб."
    };

    return stringsPrice;
}



function calcOrderPrice() {
    var sumOrder = 0;

    for (var id in Basket.Products) {
        var product = getDataProductyById(id);
        sumOrder += product.Price * Basket.Products[id];
    }

    var sumDelivery = sumOrder >= getMaxAreaDelivery() ? 0 : DeliverySetting.PriceDelivery;

    Basket.OrderPrice = sumOrder;
    Basket.DeliveryPrice = sumDelivery;
}

function updateBasketPage(productId) {
    var $page = $(Pages.Basket);
    var $product = $($page.find("[product-id=" + productId + "]"));
    var poructCountBasket = Basket.Products[productId];

    updateBasketCountValue($product, poructCountBasket);

    if (poructCountBasket == 0) {
        $product.remove();
    }
}

function updateBasketProductPrice(productId) {
    var $page = $(Pages.Basket);
    var $product = $($page.find("[product-id=" + productId + "]"));
    var poructCountBasket = Basket.Products[productId];
    var productData = getDataProductyById(productId);
    var strSum = (poructCountBasket * productData.Price).toString() + " руб.";
    var strDetail = poructCountBasket + " х " + productData.Price + " руб.";

    $product.find(".basket-product-sum-price").html(strSum);
    $product.find(".basket-product-detail-price").html(strDetail);
}

function removeProductFromBasket(event, e) {
    event.stopPropagation();

    var $parent = $(e).parents(".product-basket");
    var productId = $parent.attr("product-id");

    delete (Basket.Products[productId]);
    $parent.remove();

    toggleCountProductsInBasket();
}

//function loadDeliverySetting() {
//    if ($.isEmptyObject(DeliverySetting)) {
//        getDeliverySetting(ClientSetting.CityId);
//    }
//}

function loadSettings() {
    Promise.all([
        getDeliverySetting(ClientSetting.CityId),
        getSetting(ClientSetting.CityId),
    ]).then(function (results) {
        var dataInfo = getDataInfo();
        render(Pages.Info, dataInfo);
    });
}

function getWorkTime() {
    var workDays = {};
    var freeDays = [];

    for (var dayId in DeliverySetting.TimeDelivery) {
        var timePeriod = DeliverySetting.TimeDelivery[dayId];

        if (timePeriod == null ||
            timePeriod.length != 2) {
            freeDays.push(DaysShort[dayId]);
        } else {
            var periodStr = timePeriod.join(" - ");

            if (!workDays[periodStr]) {
                workDays[periodStr] = [];
            }

            workDays[periodStr].push(DaysShort[dayId]);
        }
    }

    var workDaysStr = [];

    for (var period in workDays) {
        var str = workDays[period].join() + ": " + period;
        workDaysStr.push(str);
    }

    var freeDaysResult = "";
    var workDaysResult = "";

    if (freeDays.length != 0) {
        freeDaysResult = freeDays.join() + ": " + "выходной";
    }

    if (workDaysStr.length != 0) {
        workDaysResult = workDaysStr.join("<br>");
    }

    var resultStr = workDaysResult +
        (freeDaysResult ? "<br>" + freeDaysResult : "");

    return resultStr;
}

function isFirstStart() {
    var cityId = window.localStorage.getItem("cityId");
    var phoneNumber = window.localStorage.getItem("phoneNumber");

    if (!cityId || !phoneNumber) {
        return true;
    }

    return false;
}

function getFullAddressStr() {
    var str =
        "г." +
        SettingBranch.City +
        ", ул." +
        SettingBranch.Street +
        ", д." +
        SettingBranch.HomeNumber;

    return str;
}

function getPhonesStr() {
    var str = SettingBranch.PhoneNumber +
        (SettingBranch.PhoneNumberAdditional ?
            "<br>" + SettingBranch.PhoneNumberAdditional :
            "");

    return str;
}

function getMinAreaDelivery() {
    var minPrice = 999999;

    for (var i = 0; i < DeliverySetting.AreaDeliveries.length; ++i) {
        if (minPrice > DeliverySetting.AreaDeliveries[i].MinPrice) {
            minPrice = DeliverySetting.AreaDeliveries[i].MinPrice;
        }
    }

    return minPrice;
}

function getMaxAreaDelivery() {
    var maxPrice = 0;

    for (var i = 0; i < DeliverySetting.AreaDeliveries.length; ++i) {
        if (maxPrice < DeliverySetting.AreaDeliveries[i].MinPrice) {
            maxPrice = DeliverySetting.AreaDeliveries[i].MinPrice;
        }
    }

    return maxPrice;
}

function getPriceDeliveryStr() {
    var minPriceDelivery = getMinAreaDelivery();
    var str = "Бесплатная доставка при заказе на сумму от " +
        getPriceValid(minPriceDelivery) + " руб.<br>" +
        "Стоимость доставки: " + DeliverySetting.PriceDelivery + " руб."

    return str;
}

function getTypesBuy() {
    var str = (DeliverySetting.PayCard ? "Банковской картой<br>" : "") +
        "Наличиными";
    return str;
}

function getDataInfo() {
    var info = {
        Address: getFullAddressStr(),
        Phones: getPhonesStr(),
        WorkTime: getWorkTime(),
        PriceDelivery: getPriceDeliveryStr(),
        TypesBuy: getTypesBuy(),
        Vkontakte: getLinkSocilaNetwork(SettingBranch.Vkontakte, "vk.com"),
        Instagram: getLinkSocilaNetwork(SettingBranch.Instagram, "instagram.com"),
        Facebook: getLinkSocilaNetwork(SettingBranch.Facebook, "facebook.com"),
        Email: SettingBranch.Email
    };

    return info;
}

function getLinkSocilaNetwork(link, socialDomain) {
    if (!link) {
        return null;
    }

    if (link.indexOf("http") == -1) {
        link = "https://" + link.trim();
    }

    var template = "<span class='link' rel='" + link + "'>" + socialDomain + "</span>"

    return template;
}

function isWorkTime() {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var day = currentDate.getDay();
    day = day == 0 ? 7 : day;

    var workDayTime = DeliverySetting.TimeDelivery[day];
    var workTime = getWorkTime();
    workTime = "Режим работы:<br>" + workTime;

    if (workDayTime != null &&
        hours >= workDayTime[0] &&
        hours < workDayTime[1]) {
        return true;
    } else {
        showErrorMessage([workTime]);
        return false;
    }
}

function goCheckoutPage() {
    if (isWorkTime()) {
        calcOrderPrice();
        render(Pages.Checkout);
        changePage(Pages.Checkout);
    }
}

function swithCheckoutCashBack(e) {
    var $e = $(e);
    var isCashBack = $e.attr("is-cash-back") == "true";

    $(".delivery-cash-back-switch div").removeClass("delivery-cash-back-switch-active");
    $e.addClass("delivery-cash-back-switch-active");

    if (isCashBack) {
        $("#delivery-cash-back").removeClass("hide");
    } else {
        $("#delivery-cash-back").addClass("hide");
    }

}

function changeCheckoutBuyType(e) {
    var $e = $(e);
    if ($e.attr("id") == "collect-buy-cash-radio" &&
        $e.is(":checked")) {
        $(".delivery-cash-back").removeClass("hide");
    } else {
        $(".delivery-cash-back").addClass("hide");
    }
}

function changeCheckoutDiscountType(e) {
    var $e = $(e);
    var isFirstOrder = window.localStorage.getItem("isFirstOrder") == "true";

    Basket.Discount = 0;

    if ($e.attr("id") == "collect-delivery-radio" &&
        $e.is(":checked") &&
        !isFirstOrder) {
        Basket.Discount = Discount.FirstOrderDiscount;

    } else if ($e.attr("id") == "take-yourself-radio" &&
        $e.is(":checked")) {
        Basket.Discount = Discount.TakeYorselfDiscount;
    }
}

function changeCheckoutDeliveryType(e) {
    var $e = $(e);
    var amount = 0;

    if ($e.attr("id") == "collect-delivery-radio" &&
        $e.is(":checked")) {
        $("#address-order-delivery").removeClass("hide");
        $("#collect-item-delivery-price").removeClass("hide");
        amount = getAmountPayWithDiscountDelivery();

    } else {
        $("#address-order-delivery").addClass("hide");
        $("#collect-item-delivery-price").addClass("hide");
        amount = getAmountPayWithDiscount();
    }

    amountCheckoutRecalc(amount);
}

function changeDeliveryPrice() {
    $("#collect-item-delivery-price .result-price-item-value").html(getPriceValid(Basket.DeliveryPrice) + " руб.");
}

function amountCheckoutRecalc(amount) {
    $("#collect-item-result-sum-price .result-price-item-value").html(amount + " руб.");
    changeCheckoutDiscountInfo();
}

function changeCheckoutDiscountInfo() {
    if (Basket.Discount == 0) {
        $("#collect-item-discount-price").addClass("hide");

        return;
    }

    var $discount = $("#collect-item-discount-price");
    $discount.removeClass("hide");
    $discount.find(".result-price-item-value").html(Basket.Discount + "%");
}

function showErrorMessage(messages) {
    var msgStr = "";
    var activePageId = "#" + $.mobile.activePage.attr("id");

    for (var id in messages) {
        msgStr += "<span>" + messages[id] + "</span>";
    }

    $(activePageId + " .error-messages .messages-list").html(msgStr);

    $(activePageId + " .error-messages").show("slow");
    setTimeout(function () {
        $(activePageId + " .error-messages").hide("slow");
        $(activePageId + " .error-messages .messages-list").empty()
    }, 5000);
}

function checkoutValid() {
    var messages = [];

    var nameValid = $("#collect-item-name").val().length != 0;

    if (!nameValid) {
        messages.push("Укажите ваше имя");
    }

    var symbolCount = 16; //+7(999)999-99-99 - 16 symbols
    var $inputPhoneNumber = $("#collect-item-phone-number");
    var val = $inputPhoneNumber.val().replace(/_/g, "");

    if (val.length < symbolCount) {
        messages.push("Укажите номер телефона");
    }

    if ($("#collect-delivery-radio").is(":checked")) {
        var areaSelected = $("#area-delivery").attr("selected") == "selected";
        var streetValid = $("#collect-item-street").val().length != 0;
        var homeNumberValid = $("#collect-item-home-number").val().length != 0;
        var entranceNumberValid = $("#collect-item-entrance-number").val().length != 0;
        var apartamentNumberValid = $("#collect-item-apartament").val().length != 0;

        if (!areaSelected) {
            messages.push("Укажите район доставки");
        }
        if (!streetValid) {
            messages.push("Укажите улицу");
        }
        if (!homeNumberValid) {
            messages.push("Укажите номер дома");
        }
        if (!entranceNumberValid) {
            messages.push("Укажите номер подъезда");
        }
        if (!apartamentNumberValid) {
            messages.push("Укажите номер квартиры (офиса)");
        }
    }

    if ($("#collect-buy-cash-radio").is(":checked") &&
        $("[is-cash-back=true]").hasClass("delivery-cash-back-switch-active")) {
        var cashBack = $("#delivery-cash-back").val();
        var cashBackValid = cashBack.length != 0;
        var takeYourselfDelivery = $("#take-yourself-radio").is(":checked");
        var amountPayDiscountDelivery = takeYourselfDelivery ? getAmountPayWithDiscount() : getAmountPayWithDiscountDelivery();

        cashBack = cashBack - 0;
        if (!cashBackValid) {
            messages.push("Укажите с какой суммы нужна сдача");
        } else if (cashBack <= amountPayDiscountDelivery) {
            messages.push("Размер суммы для сдачи должен быть больше " + amountPayDiscountDelivery + " руб.");
        }
    }

    if (messages.length == 0) {
        return true;
    } else {
        showErrorMessage(messages);

        return false;
    }
}

function getDataOrderCheckout() {
    var name = $("#collect-item-name").val();
    var phoneNumber = $("#collect-item-phone-number").val();

    var deliveryTypeName = $("[name=delivery-type]:checked").attr("delivery-type");
    var deliverType = DeliveryType[deliveryTypeName];

    var street = $("#collect-item-street").val();
    var home = $("#collect-item-home-number").val();
    var entrance = $("#collect-item-entrance-number").val();
    var apartament = $("#collect-item-apartament").val();
    var level = $("#collect-item-level").val();
    var intercomCode = $("#collect-item-intercom-code").val();
    intercomCode = intercomCode.trim() || apartament;

    var buyTypeName = $("[name=delivery-buy-type]:checked").attr("buy-type");
    var buyType = BuyType[buyTypeName];

    var comment = $("#collect-item-comment").val()
    var cashBack = $("#delivery-cash-back").val();
    var needCashBack = $(".delivery-cash-back-switch .delivery-cash-back-switch-active").attr("is-cash-back") == "true";

    var takeYourselfDelivery = $("#take-yourself-radio").is(":checked");
    var amountPayDiscountDelivery = takeYourselfDelivery ? getAmountPayWithDiscount() : getAmountPayWithDiscountDelivery();

    return {
        Name: name,
        PhoneNumber: phoneNumber,
        ClientId: ClientSetting.ClientId,
        DeliveryPrice: deliverType == DeliveryType.Delivery ? Basket.DeliveryPrice : 0,
        DeliveryType: deliverType,
        Street: street,
        HomeNumber: home,
        EntranceNumber: entrance,
        ApartamentNumber: apartament,
        Level: level,
        IntercomCode: intercomCode,
        BuyType: buyType,
        Comment: comment,
        ProductCountJSON: JSON.stringify(Basket.Products),
        Discount: Basket.Discount,
        CashBack: cashBack,
        NeedCashBack: needCashBack,
        BranchId: SettingBranch.BranchId,
        CityId: ClientSetting.CityId,
        Date: new Date(),
        AmountPay: getAmountPay(),
        AmountPayDiscountDelivery: amountPayDiscountDelivery
    }
}

function emptyOrderDetails() {
    Basket.OrderPrice = 0;
    Basket.DeliveryPrice = 0;
    Basket.Discount = 0;
    Basket.Products = {};

    toggleCountProductsInBasket();
    clearBasketCountValue();
}

/**
 * Цена без учета скидки и доставка
 */
function getAmountPay() {
    var amountPay = getPriceValid(Basket.OrderPrice);

    return amountPay;
}


/**
 * Цена с учетом скидки
 */
function getAmountPayWithDiscount() {
    var orderPrice = (Basket.OrderPrice - (Basket.OrderPrice * Basket.Discount / 100));
    var amountPay = getPriceValid(orderPrice);

    return amountPay;
}

/**
 * Цена с учетом доставки
 */
function getAmountPayWithDelivery() {
    var amountPay = getPriceValid(Basket.OrderPrice + Basket.DeliveryPrice);

    return amountPay;
}

/**
 * Цена с учетом скидки и доставки
 */
function getAmountPayWithDiscountDelivery() {
    var orderPrice = (Basket.OrderPrice - (Basket.OrderPrice * Basket.Discount / 100));
    var amountPay = getPriceValid(orderPrice + Basket.DeliveryPrice);

    return amountPay;
}

function sendProductReview(containerId, productId) {
    var $container = $("#" + containerId);
    var $textarea = $container.find("textarea");
    var textReview = $textarea.val();

    if (!textReview.trim()) {
        $textarea.val("");
        return;
    }

    $textarea.val("");

    var review = {
        ProductId: productId,
        PhoneNumber: ClientSetting.PhoneNumber,
        CityId: ClientSetting.CityId,
        ReviewText: textReview
    }

    var reviewClone = {
        ProductId: productId,
        PhoneNumber: ClientSetting.PhoneNumber,
        ReviewText: textReview
    }

    var productReviews = ProductReview[productId];
    if (productReviews &&
        productReviews.length > 0) {

        var userName = ""
        for (var i = 0; i < review.PhoneNumber.length; ++i) {
            var chr = review.PhoneNumber[i];

            if (i == 11 ||
                i == 12) {
                chr = "*";
            }

            userName += chr;
        }

        reviewClone.PhoneNumber = userName;

        productReviews.unshift(reviewClone);
    }

    renderNewReview(containerId, reviewClone);

    setProductReview(review);
}

function getStockByType(type) {
    if (Data.Stock) {
        for (var id in Data.Stock) {
            if (Data.Stock[id].StockType == type) {
                return Data.Stock[id];
            }
        }
    }

    return null;
}

function showAreaDelivery(pageId) {
    var $dialog = $($("#dialog-template").html());
    var items = [];

    $dialog.find(".dialog-header").html("Район доставки");

    for (var id in DeliverySetting.AreaDeliveries) {
        var $item = $($("#area-delivery-item-template").html());
        var area = DeliverySetting.AreaDeliveries[id];
        var templateText = "Бесплатная доставка при заказе от " + getPriceValid(area.MinPrice) + " руб."

        $item.attr("id", area.UniqId);
        $item.find(".area-name").html(area.NameArea);
        $item.find(".area-price").html(templateText);

        $item.bind("click", function () { selectArea(this) });

        items.push($item);
    }

    $dialog.find(".dialog-content").append(items);
    bindCloseDialog($dialog);
    $(pageId).append($dialog);
}

function bindCloseDialog($dialog) {
    $dialog.find(".dialog-close").bind("click", function () { dialogClose($dialog) });
}

function dialogClose($dialog) {
    $dialog.remove()
}

function selectArea(e) {
    var $e = $(e);
    var uniqId = $e.attr("id");
    var area = getAreaDeliveryByUniqId(uniqId);
    var $area = $("#area-delivery");

    $area.html(area.NameArea);
    $area.attr("selected", true)

    if (area.MinPrice < Basket.OrderPrice) {
        Basket.DeliveryPrice = 0;
    } else {
        Basket.DeliveryPrice = DeliverySetting.PriceDelivery
    }

    changeDeliveryPrice();
    amountCheckoutRecalc(getAmountPayWithDiscountDelivery());

    dialogClose($e.parents(".backdoor"));
}

function getAreaDeliveryByUniqId(uniqId) {
    for (var id in DeliverySetting.AreaDeliveries) {
        if (DeliverySetting.AreaDeliveries[id].UniqId == uniqId) {
            return DeliverySetting.AreaDeliveries[id];
        }
    }
}