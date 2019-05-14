var ServiceURL = "http://localhost:53888";
//var ServiceURL = "https://easystart.conveyor.cloud";

var API = {
    GetAllowedCity: ServiceURL + "/api/adminapp/getallowedcity",
    GetCategories: ServiceURL + "/api/adminapp/getcategories",
    GetProducts: ServiceURL + "/api/adminapp/getproducts",
    GetAllProducts: ServiceURL + "/api/adminapp/getallproducts",
    GetDeliverySetting: ServiceURL + "/api/adminapp/getdeliverysetting",
    GetSetting: ServiceURL + "/api/adminapp/getsetting",
    SendOrder: ServiceURL + "/api/adminapp/sendorder",
    GetHistoryOrder: ServiceURL + "/api/adminapp/gethistoryorder",
    UpdateProducRating: ServiceURL + "/api/adminapp/updateproducrating",
};

var Data = {
    AllowedCity: null,
    SelectCity: null,
    Categories: null,
    Products: {},
    HistoryOrder: []
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

function getAllProductPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            for (var categoryId in data) {
                var products = data[categoryId];
                Data.Products[categoryId] = processingImagePath(products);
            }

            resolve();
        };

        getAPI(API.GetAllProducts, null, successFunc, reject);
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

function getProducts(categoryId, loader) {
    var successFunc = function successFunc(data) {
        Data.Products[categoryId] = processingImagePath(data);

        renderPageProduct();
    };

    var renderPageProduct = function renderPageProduct() {
        render(Pages.Product);
        loader.stop();
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

function sendOrder(order, loader) {
    var successFunc = function successFunc(resultData) {
        var data = {
            Order: order,
            ResultData: resultData
        }
        render(Pages.CheckoutResult, data);
        loader.stop();
        changePage(Pages.CheckoutResult);
    };

    var errFunc = function () {
        var data = {
            ResultData: {
                Success: false
            }
        };

        render(Pages.CheckoutResult, data);
        loader.stop();
        changePage(Pages.CheckoutResult);
    }

    postAPI(API.SendOrder, order, successFunc, errFunc);
}

function GetHistoryOrder(renderSuccessHistoryOrder, renderErrorHistoryOrder) {
    var successFunc = function successFunc(resultData) {
        Data.HistoryOrder = resultData;

        if (renderSuccessHistoryOrder) {
            renderSuccessHistoryOrder();
        }

    };

    if (Data.HistoryOrder &&
        Data.HistoryOrder.length != 0) {
        renderSuccessHistoryOrder();

        return;
    }

    getAPI(API.GetHistoryOrder, { phoneNumber: ClientSetting.PhoneNumber }, successFunc, renderErrorHistoryOrder);
}

function updateProducRating(productId, score) {
    postAPI(API.UpdateProducRating, { ProductId: productId, Score: score }, null, null);
}