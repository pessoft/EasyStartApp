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
    let $button = $(`${Pages.FirstStartSettingPhone} button`);

    $button.unbind("click", setPhoneNumber);
    $button.bind("click", setPhoneNumber);
}

function bindEventsFirstStartSettingCity() {
    let $parent = $(Pages.FirstStartSettingCity);

    let $cityItems = $parent.find(".city-list-item");
    let clickCityItem = function () {
        selectCity(this);
    }

    $cityItems.unbind("click", clickCityItem);
    $cityItems.bind("click", clickCityItem);

    let $button = $parent.find("button");

    $button.unbind("click", setSelectCity);
    $button.bind("click", setSelectCity);
}