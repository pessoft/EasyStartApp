$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    loadData();
});

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
};

function onBackKeyDown() {
    if ($.mobile.activePage.is("#products")) {
        navigator.app.backHistory()
    }
}

function loadData() {
    Promise.all([
        getAllowedCityPromise(),
        getCategoriesPromise()
    ]).then(results => {
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
    let phoneNumber = $(`${Pages.FirstStartSettingPhone} input[type=text]`).val();

    window.localStorage.setItem("phoneNumber", phoneNumber);
    ClientSetting.PhoneNumber = phoneNumber;

    render(Pages.FirstStartSettingCity);
    changePage(Pages.FirstStartSettingCity);
}

function selectCity(e) {
    let $e = $(e);
    let $parent = $e.parents(".city-list");

    $($parent.find(".active-city-item")).removeClass("active active-city-item");
    $e.addClass("active active-city-item");

    $(`${Pages.FirstStartSettingCity} button`).removeAttr("disabled");
}

function setSelectCity() {
    let cityId = $(`${Pages.FirstStartSettingCity} .active-city-item`).attr("city-id");

    window.localStorage.setItem("cityId", cityId);
    ClientSetting.CityId = cityId;

    render(Pages.Catalog );
    changePage(Pages.Catalog);
}

function inputEnterPhoneNumber() {
    let $inputPhoneNumber = $(`#client-phone`);
    let symbolCount = 16;//+7(999)999-99-99 - 16 symbols
    let $button = $(`${Pages.FirstStartSettingPhone} button`);
    let val = $inputPhoneNumber.val().replace(/_/g, "");

    if (val.length < symbolCount) {
        $button.attr("disabled", "disabled");
    }
}

function processingImagePath(data) {
    for (let item of data) {
        item.Image = item.Image.replace("..", ServiceURL);
    }

    return data;
}

function selectCategory(e) {
    let $e = $(e);

    let categoryId = $e.attr("category-id");
    ClientSetting.CurrentCategory = categoryId;

    getProducts(categoryId);
}

function getDataCategoryById(categoryId) {
    let data;

    for (let category of Data.Categories) {
        if (category.Id == categoryId) {
            data = category;
            break;
        }
    }

    return data;
}

function getDataProductyById(productId) {
    let data;

    for (let product of Data.Products[ClientSetting.CurrentCategory]) {
        if (product.Id == productId) {
            data = product;
            break;
        }
    }

    return data;
}

function showProductFullInfo(e) {
    let $parent = getParentProduct(e);

    let productId = $parent.attr("product-id");
    renderProductFullInfo(productId);
}

function getParentProduct(e) {
    let $parent = $(e).parents(".product");

    if ($parent.length == 0) {
        if ($(e).hasClass("product")) {
            $parent = $(e);
        }
    }

    return $parent;
}

function closeProductFullInfo() {
    $(`${Pages.Product} .product-full-info`).remove();
}

function showCounterAddToBasket(event, e) {
    event.stopPropagation();

    let $parent = getParentProduct(e);
    let productId = $parent.attr("product-id");

    Basket.Products[productId] = 1;
    $parent.find(".priduct-add-basket-btn").addClass("hide");
    $parent.find(".priduct-add-basket-count").removeClass("hide");

    $parent.find(".basket-counter-value").html(Basket.Products[productId]);
}

function minusProductFromBasket(event, e) {
    event.stopPropagation();

    let $parent = getParentProduct(e);
    let productId = $parent.attr("product-id");

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

    let $parent = getParentProduct(e);
    let productId = $parent.attr("product-id");

    if (Basket.Products[productId] != 999) {
        ++Basket.Products[productId];
    }

    $parent.find(".basket-counter-value").html(Basket.Products[productId]);
}