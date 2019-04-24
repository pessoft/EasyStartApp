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
        renderLoadRedy();
    });
}


function setPhoneNumber() {
    let phoneNumber = $(`${Pages.FirstStartSettingPhone} input[type=text]`).val();

    window.localStorage.setItem("phoneNumber", phoneNumber);
    ClientSetting.PhoneNumber = phoneNumber;

    renderPageFirstStartSettingCity();
    changePage(Pages.FirstStartSettingCity);
}

function selectCity(e) {
    let $e = $(e);
    let $parent = $e.parents(".city-list");

    $($parent.find(".active-city-item")).removeClass("active active-city-item");
    $e.addClass("active active-city-item");
}

function setSelectCity() {
    let cityId = $(`${Pages.FirstStartSettingCity} .active-city-item`).attr("city-id");

    window.localStorage.setItem("cityId", cityId);
    ClientSetting.CityId = cityId;

    renderPageCatalog();
    changePage(Pages.Catalog);
}