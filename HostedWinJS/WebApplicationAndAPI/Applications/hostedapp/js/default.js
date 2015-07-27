/// <reference path="_references.js" />

(function (_global) {
    "use strict";

    var activation = _global.Windows ? _global.Windows.ApplicationModel.Activation : null;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;

    app.addEventListener("activated", function (args) {
        var launchArguments = null;

        if (args.detail.arguments)
            launchArguments = JSON.parse(args.detail.arguments);

        console.log("app activated ", args.detail);
        var preparepage = WinJS.UI.processAll().then(function () {
            return _global.appCacheReadyPromise;
        }).then(function(){
            return WinJS.Navigation.navigate(rootUrl + "pages/home/home.html");
        }).then(function () {
            var c = true;
        });

        args.setPromise(preparepage);
    });

    app.addEventListener("checkpoint", function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;

    });

    app.start();        
})(this);
