(function () {
    "use strict";

    WinJS.UI.Pages.define(rootUrl + "pages/home/home.html", {
        init: function () {
            console.log("requesting " + rootApiUrl + 'data/list');
            this.dataPromise = WinJS.xhr({
                url: rootApiUrl + 'data/list'
            }).then(function (r) {
                try{
                    return JSON.parse(r.responseText);
                } catch (exception) {
                    console.error(exception);
                }
            }, function (error) {
                console.error(error);
            });
        },

        processed: function () {
            var page = this;
            page.WinRTStatus.innerText = 'this code cannot access WinRT';
            if (window.Windows) {
                page.WinRTStatus.innerText = 'this code has access to WinRT';
            }

            return this.dataPromise.then(function (data) {
                if (data) {
                    console.log("data loaded");
                    page.listView.itemDataSource = new WinJS.Binding.List(data).dataSource;
                    page.listView.forceLayout();
                    page.listView.oniteminvoked = function (arg) {
                        arg.detail.itemPromise.then(function (item) {
                            WinJS.Navigation.navigate(rootUrl + 'pages/detail/detail.html', { item: item.data });
                        });
                    }
                }
            })
        },

        ready: function (element, options) {
            var page = this
            console.log("home page ready");
        },

        unload: function () {
            var page = this;
            
        }
    });
})();
