function bindEvents(pageId) {
    switch (pageId) {
        case Pages.FirstStartSettingPhone:
            bindEventsFirstStartSettingPhone();
            break;
        case Pages.FirstStartSettingCity:
            bindEventsFirstStartSettingCity();
            break;
    }
}

function bindEventsFirstStartSettingPhone() {
    var $button = $(Pages.FirstStartSettingPhone + " button");

    $button.unbind("click");
    $button.bind("click", setPhoneNumber);

    var $inputPhoneNumber = $("#client-phone");

    $inputPhoneNumber.mask("+7(999)999-99-99", {
        completed: function completed() {
            $button.removeAttr("disabled");
        }
    });
    $inputPhoneNumber.keydown(inputEnterPhoneNumber);
}

function bindEventsFirstStartSettingCity() {
    var $parent = $(Pages.FirstStartSettingCity);

    var $cityItems = $parent.find(".city-list-item");
    var clickCityItem = function clickCityItem() {
        selectCity(this);
    };

    $cityItems.unbind("click");
    $cityItems.bind("click", clickCityItem);

    var $button = $parent.find("button");

    $button.unbind("click");
    $button.bind("click", setSelectCity);
}

function bindCheckout() {
    var $parent = $(Pages.Basket);
    var $button = $parent.find(".basket-finished button");

    $button.unbind("click");
    $button.bind("click", goCheckoutPage);
}

function bindCheckoutCashBackSwith() {
    var $parent = $(Pages.Checkout);
    var $switch = $parent.find("[is-cash-back]");
    var func = function () {
        swithCheckoutCashBack(this);
    }

    $switch.unbind("click");
    $switch.bind("click", func);
}

function bindCheckoutBuyType() {

    var func = function () {
        changeCheckoutBuyType(this);
    }

    $("[name=delivery-buy-type]").unbind("change", func);
    $("[name=delivery-buy-type]").bind("change", func);
}

function bindCheckoutDeliveryType() {

    var func = function () {
        changeCheckoutDeliveryType(this);
    }

    $("[name=delivery-type]").unbind("change", func);
    $("[name=delivery-type]").bind("change", func);
}

function bindCheckoutFinished() {
    var func = function () {
        var loader = new Loader($(Pages.Checkout + " .content"));
        loader.start();
        if (checkoutValid()) {
            var data = getDataOrderCheckout();
            sendOrder(data, loader);
        } else {
            loader.stop();
        }
    };

    $(".order-collect-finished button").unbind("click");
    $(".order-collect-finished button").bind("click", func);
}

function binCheckoutResultOk() {
    var $button = $(Pages.CheckoutResult + " .checkout-result-footer button");
    var func = function () {
        emptyOrderDetails();
        render(Pages.Catalog);
        changePage(Pages.Catalog);
    }

    $button.unbind("click");
    $button.bind("click", func);
}

function bindCatalotChangeCityAndPhone() {
    var $header = $(Pages.Catalog + " .header");
    var func = function () {
        render(Pages.FirstStartSettingPhone);
        changePage(Pages.FirstStartSettingPhone);
    }

    $header.unbind("click");
    $header.bind("click", func);
}

function bindToggleOrderHistoryInfo(e) {
    var $e = $(e);
    var func = function () {
        var $orderContent = $e.find(".history-order-content");

        if ($orderContent.is(":visible")) {
            $orderContent.hide();
        } else {
            $orderContent.show();
        }
    }

    $e.find(".history-order-header").unbind("click");
    $e.find(".history-order-header").bind("click", func);

}
