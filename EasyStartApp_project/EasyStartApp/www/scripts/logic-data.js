var ServiceURL = "http://localhost:53888";
//var ServiceURL = "https://easystart.conveyor.cloud";
//var ServiceURL = "http://easy-start-test.site";

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
    SetProductReviews: ServiceURL + "/api/adminapp/setproductreviews",
    GetProductReviews: ServiceURL + "/api/adminapp/getproductreviews",
    GetStock: ServiceURL + "/api/adminapp/getstocks",
    AddOrUpdateClient: ServiceURL + "/api/adminapp/addorupdateclient",
    CheckActualUserData: ServiceURL + "/api/adminapp/checkactualuserdata",
};

var Data = {
    AllowedCity: null,
    SelectCity: null,
    Categories: null,
    Products: {},
    HistoryOrder: [],
    Stock: []
};

var DeliverySetting = {};
var SettingBranch = {};
var ProductReview = {};

var ClientSetting = {
    PhoneNumber: null,
    CityId: null,
    CurrentCategory: null
};

var Discount = {
    FirstOrderDiscount: 0,
    TakeYorselfDiscount: 0
}

var Basket = {
    OrderPrice: 0,
    DeliveryPrice: 0,
    Discount: 0,
    Products: {} //productId:count
};

var StockType = {
    Custom: 0,
    FirstOrder: 1,
    OrderTakeYourself: 2
}

var ProductType = {
    0: "",
    1: "product-type-new",
    2: "product-type-hit",
    3: "product-type-stock",
    4: "product-type-hot",
    5: "product-type-veg"
}

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

function getStockPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            Basket.Discount = 0;
            Discount.FirstOrderDiscount = 0;
            Discount.TakeYorselfDiscount = 0;
            Data.Stock = [];
            Data.Stock = processingImagePathAndDescription(data);

            var isFirstOrder = window.localStorage.getItem("isFirstOrder") == "true";
            var firstOrderDiscount = getStockByType(StockType.FirstOrder);
            var takeYourselfDiscount = getStockByType(StockType.OrderTakeYourself);

            if (firstOrderDiscount && !isFirstOrder) {
                Discount.FirstOrderDiscount = firstOrderDiscount.Discount;
            }

            if (takeYourselfDiscount) {
                Discount.TakeYorselfDiscount = takeYourselfDiscount.Discount;
            }

            resolve();
        };

        getAPI(API.GetStock, { cityId: ClientSetting.CityId }, successFunc, reject);
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
                Data.Products[categoryId] = processingImagePathAndDescription(products);
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

        window.localStorage.setItem("isFirstOrder", true);
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

    getAPI(API.GetHistoryOrder, { clientId: ClientSetting.ClientId }, successFunc, renderErrorHistoryOrder);
}

function updateProducRating(productId, score) {
    postAPI(API.UpdateProducRating, { ProductId: productId, Score: score }, null, null);
}

function setProductReview(review) {
    postAPI(API.SetProductReviews, review, null, null);
}

function getProductReviews(producId, callback) {
    var successFunc = function (data) {
        ProductReview[producId] = data;

        if (callback) {
            callback();
        }
    }

    getAPI(API.GetProductReviews, { productId: producId }, successFunc, null);
}

function addOrUpdateClient(phoneNumber) {
    var successFun = function (data) {
        window.localStorage.setItem("clientId", data.Id);
        ClientSetting.ClientId = data.Id;
    }
    var clientId = window.localStorage.getItem("clientId");
    if (!clientId) {
        clientId = 0;
    }
    postAPI(API.AddOrUpdateClient, { PhoneNumber: phoneNumber, Id: clientId }, successFun, null);
}

function checkActualUserDataPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            if (!data.Data === true) {
                clearClientSettingData();
            }

            resolve();
        };

        var userDataExist = ClientSetting.PhoneNumber && ClientSetting.CityId && ClientSetting.ClientId;

        if (!userDataExist) {
            resolve();
        } else {
            postAPI(API.CheckActualUserData, {
                phoneNumber: ClientSetting.PhoneNumber,
                cityId: ClientSetting.CityId,
                clientId: ClientSetting.ClientId
            },
                successFunc, reject);
        }
    });
}