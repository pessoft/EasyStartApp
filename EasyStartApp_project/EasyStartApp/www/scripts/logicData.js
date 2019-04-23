var ServiceURL = "http://localhost:53888";

var API = {
    GetAllowedCity: ServiceURL + "/api/adminapp/getallowedcity",
    GetCategories: ServiceURL + "/api/adminapp/getcategories",
    GetProducts: ServiceURL + "",
};

var Data = {
    AllowedCity: null,
    SelectCity: null,
    Categories: null,
    Products: null
}

function GetAPI(urlAPI, successFunc, errorFunc) {
    $.ajax({
        type: 'GET',
        url: urlAPI,
        success: function (data) {
            if (successFunc) {
                successFunc(data);
            }
        },
        error: function (err) {
            if (errorFunc) {
                errorFunc(err);
            }
        }
    });
}

function getAllowedCityPromise() {
    return new Promise(function (resolve, reject) {
        let successFunc = function (data) {
            Data.AllowedCity = data;

            resolve();
        }

        GetAPI(API.GetAllowedCity, successFunc, reject);
    });
}


function getCategoriesPromise() {
    return new Promise(function (resolve, reject) {
        let successFunc = function (data) {
            Data.Categories = data;

            resolve();
        }

        GetAPI(API.GetCategories, successFunc, reject);
    });
}

function getProducts(idCategory) {

}
