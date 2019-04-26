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

    $button.unbind("click", setPhoneNumber);
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

    $cityItems.unbind("click", clickCityItem);
    $cityItems.bind("click", clickCityItem);

    var $button = $parent.find("button");

    $button.unbind("click", setSelectCity);
    $button.bind("click", setSelectCity);
}