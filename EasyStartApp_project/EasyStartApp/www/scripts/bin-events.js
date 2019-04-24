function bindEvents(pageId) {
    switch (pageId) {
        case Pages.FerstStartSettingPhone:
            bindEventsFerstStartSettingPhone();
            break;
        case Pages.FerstStartSettingCity:
            bindEventsFerstStartSettingCity();
            break;
    }
}

function bindEventsFerstStartSettingPhone() {
    let $button = $(`${Pages.FerstStartSettingPhone} button`);

    $button.unbind("click", setPhoneNumber);
    $button.bind("click", setPhoneNumber);
}

function bindEventsFerstStartSettingCity() {
    let $parent = $(Pages.FerstStartSettingCity);

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