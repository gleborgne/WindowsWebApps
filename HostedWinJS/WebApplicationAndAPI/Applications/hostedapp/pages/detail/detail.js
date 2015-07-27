(function () {
    "use strict";

    WinJS.UI.Pages.define(rootUrl + "pages/detail/detail.html", {
        processed: function (element, options) {
            console.log("detail loaded");
            this.message.innerText = "you picked " + options.item.Name;
        },

        ready: function (element, options) {
            var page = this
            console.log("detail ready");
        },

        unload: function () {
            var page = this;
            
        }
    });
})();
