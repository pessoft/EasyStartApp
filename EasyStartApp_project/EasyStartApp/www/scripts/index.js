$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    loadData();
});

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
};

function onBackKeyDown() {
    if ($.mobile.activePage.is("#products")) {
        navigator.app.backHistory();
    }
}

function loadData() {
    Promise.all([
        getAllowedCityPromise(),
        getCategoriesPromise()
    ]).then(function (results) {
        loadDataReady();
    });
}

function loadDataReady() {
    setClientSettingData();
    renderLoadRedy();
}

function setClientSettingData() {
    ClientSetting.PhoneNumber = window.localStorage.getItem("phoneNumber");
    ClientSetting.CityId = window.localStorage.getItem("cityId");
}

function setPhoneNumber() {
    var phoneNumber = $(Pages.FirstStartSettingPhone + " input[type=text]").val();

    window.localStorage.setItem("phoneNumber", phoneNumber);
    ClientSetting.PhoneNumber = phoneNumber;

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
    var cityId = $(Pages.FirstStartSettingCity + " .active-city-item").attr("city-id");

    window.localStorage.setItem("cityId", cityId);
    ClientSetting.CityId = cityId;

    render(Pages.Catalog);
    changePage(Pages.Catalog);
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

function processingImagePath(data) {
    for (var i = 0; i < data.length; ++i) {
        data[i].Image = data[i].Image.replace("..", ServiceURL);
    }

    return data;
}

function selectCategory(e) {
    var $e = $(e);

    var categoryId = $e.attr("category-id");
    ClientSetting.CurrentCategory = categoryId;

    getProducts(categoryId);
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

function getDataProductyById(productId) {
    var data;
    var products = Data.Products[ClientSetting.CurrentCategory]
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
    var $parent = $(e).parents(".product");

    if ($parent.length == 0) {
        if ($(e).hasClass("product")) {
            $parent = $(e);
        }
    }

    return $parent;
}

function closeProductFullInfo() {
    $(Pages.Product + " .product-full-info").remove();
}

function showCounterAddToBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    Basket.Products[productId] = 1;
    $parent.find(".priduct-add-basket-btn").addClass("hide");
    $parent.find(".priduct-add-basket-count").removeClass("hide");

    $parent.find(".basket-counter-value").html(Basket.Products[productId]);
}

function minusProductFromBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    --Basket.Products[productId];

    if (Basket.Products[productId] == 0) {
        $parent.find(".priduct-add-basket-btn").removeClass("hide");
        $parent.find(".priduct-add-basket-count").addClass("hide");
    } else {
        $parent.find(".basket-counter-value").html(Basket.Products[productId]);
    }
}

function plusProductFromBasket(event, e) {
    event.stopPropagation();

    var $parent = getParentProduct(e);
    var productId = $parent.attr("product-id");

    if (Basket.Products[productId] != 999) {
        ++Basket.Products[productId];
    }

    $parent.find(".basket-counter-value").html(Basket.Products[productId]);
}