$(document).ready(function () {
    setTimeout(function () { $.mobile.changePage("#catalog", { transition: "none" }) }, 500);
    document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
};

function onBackKeyDown() {
    if ($.mobile.activePage.is("#products")) {
        navigator.app.backHistory()
    }
}