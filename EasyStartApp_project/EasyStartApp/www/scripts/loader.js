function Loader(container) {
    this.container = $(container);
    var $loaderTemplate = $($("#loader").html());
    var loaderId = generateUniqId();
    $loaderTemplate.attr("id", loaderId);

    this.start = function start() {
        this.container.append($loaderTemplate);
    }

    this.stop = function start() {
        this.container.find("#" + loaderId).remove();
    }
}