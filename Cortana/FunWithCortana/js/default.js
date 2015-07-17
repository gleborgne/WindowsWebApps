/// <reference path="_references.js" />

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var isRunning = false;

    function bootstrapApplication() {
        if (!isRunning) {
            return App.Cortana.register().then(function () {
                isRunning = true;
            });
        }
    }

    function processVoiceCommands(args) {
        console.log(args);
    }

    app.onactivated = function (args) {
        if (args)
            console.log(args.detail);

        args.setPromise(WinJS.UI.processAll().then(function () {
            return bootstrapApplication();
        }).then(function () {
            return WinJS.Navigation.navigate('/pages/home/home.html');
        }));
        

        //var rootPromise = WinJS.Promise.wrap();

        //if (!isRunning) {
        //    rootPromise = WinJS.UI.processAll().then(function () {
        //        return bootstrapApplication();
        //    })
        //}

        //if (args.detail.kind === activation.ActivationKind.launch) {
        //    if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
        //        // TODO: This application has been newly launched. Initialize your application here.
        //    } else {
        //        // TODO: This application has been reactivated from suspension.
        //        // Restore application state here.
        //    }
        //    args.setPromise(rootPromise.then(function () {
        //        return WinJS.Navigation.navigate('/pages/home/home.html');
        //    }));
        //} else if (args.detail.kind === activation.ActivationKind.voiceCommand) {
        //    console.log(args.detail);
        //    args.setPromise(rootPromise.then(function () {
        //        return WinJS.Navigation.navigate('/pages/home/home.html');
        //    }));
        //} else {
        //    args.setPromise(rootPromise.then(function () {
        //        return WinJS.Navigation.navigate('/pages/home/home.html');
        //    }));
        //}
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };

    app.start();
})();
