﻿var ServiceURL = "http://localhost:53888";
//var ServiceURL = "https://easystart.conveyor.cloud";

var API = {
    GetAllowedCity: ServiceURL + "/api/adminapp/getallowedcity",
    GetCategories: ServiceURL + "/api/adminapp/getcategories",
    GetProducts: ServiceURL + "/api/adminapp/getproducts"
};

var Data = {
    AllowedCity: null,
    SelectCity: null,
    Categories: null,
    Products: {}
};

var ClientSetting = {
    PhoneNumber: null,
    CityId: null,
    CurrentCategory: null
};

var Basket = {
    SumCount: 0,
    Products: {} //productId:count
};

function GetAPI(urlAPI, args, successFunc, errorFunc) {
    $.ajax({
        type: "GET",
        url: urlAPI,
        data: args,
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

        GetAPI(API.GetAllowedCity, null, successFunc, reject);
    });
}

function getCategoriesPromise() {
    return new Promise(function (resolve, reject) {
        var successFunc = function successFunc(data) {
            Data.Categories = processingImagePath(data);

            resolve();
        };

        GetAPI(API.GetCategories, null, successFunc, reject);
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
        GetAPI(API.GetProducts, { categoryId: categoryId }, successFunc);
    }
}