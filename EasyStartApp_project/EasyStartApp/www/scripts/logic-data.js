//var ServiceURL = "http://localhost:53888";
var ServiceURL = "https://easystart.conveyor.cloud";

var API = {
    GetAllowedCity: ServiceURL + "/api/adminapp/getallowedcity",
    GetCategories: ServiceURL + "/api/adminapp/getcategories",
    GetProducts: ServiceURL + "/api/adminapp/getproducts",
    GetDeliverySetting: ServiceURL + "/api/adminapp/getdeliverysetting",
    GetSetting: ServiceURL + "/api/adminapp/getsetting",
    SendOrder: ServiceURL + "/api/adminapp/sendorder"
};

var Data = {
    AllowedCity: null,
    SelectCity: null,
    Categories: null,
    Products: {}
};

var DeliverySetting = {};
var SettingBranch = {};

var ClientSetting = {
    PhoneNumber: null,
    CityId: null,
    CurrentCategory: null
};

var Basket = {
    OrderPrice: 0,
    DeliveryPrice: 0,
    Discount: 10,
    Products: {} //productId:count
};

var DaysShort = {
    1: "Пн",
    2: "Вт",
    3: "Ср",
    4: "Чт",
    5: "Пт",
    6: "Сб",
    7: "Вс",
}

var DeliveryType = {
    TakeYourSelf: 1,
    Delivery: 2
}

var BuyType = {
    Cash: 1,
    Card: 2
}

function getAPI(urlAPI, args, successFunc, errorFunc) {
    $.ajax({
        type: "GET",
        url: urlAPI,
        data: args,
        contentType: 'application/json',
        success: function success(data) {
            if (successFunc) {
                successFunc(data);
            }
        },
        error: function error(err) {
            if (errorFunc) {
                errorFunc(err);
            }
        }
    });
}

function postAPI(urlAPI, args, successFunc, errorFunc) {
    $.ajax({
        type: "POST",
        url: urlAPI,
        data: JSON.stringify(args),
        contentType: 'application/json',
        success: function success(data) {
            if (successFunc) {
                successFunc(data);
            }
        },
        error: function error(err) {
            if (errorFunc) {
                errorFunc(err);
            }
        }
    });
}

function getAllowedCityPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            Data.AllowedCity = data;

            resolve();
        };

        getAPI(API.GetAllowedCity, null, successFunc, reject);
    });
}

function getCategoriesPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            Data.Categories = processingImagePath(data);

            resolve();
        };

        getAPI(API.GetCategories, null, successFunc, reject);
    });
}

function getDeliverySetting(cityId) {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            DeliverySetting = data;

            resolve();
        };

        getAPI(API.GetDeliverySetting, { cityId: cityId }, successFunc, reject);
    });
}

function getProducts(categoryId) {
    var successFunc = function successFunc(data) {
        Data.Products[categoryId] = processingImagePath(data);

        renderPageProduct();
    };

    var renderPageProduct = function renderPageProduct() {
        render(Pages.Product);
        changePage(Pages.Product);
    };

    if (Data.Products[categoryId]) {
        renderPageProduct();
    } else {
        getAPI(API.GetProducts, { categoryId: categoryId }, successFunc);
    }
}

function getSetting(cityId) {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            SettingBranch = data;

            resolve();
        };

        getAPI(API.GetSetting, { cityId: cityId }, successFunc, reject);
    });
}

function sendOrder(data) {
    var successFunc = function successFunc(data) {
        render(Pages.CheckoutResult, data);
        changePage(Pages.CheckoutResult);
    };

    postAPI(API.SendOrder, data, successFunc);
}