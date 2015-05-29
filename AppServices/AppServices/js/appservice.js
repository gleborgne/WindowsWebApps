//importScripts("/WinJS/js/WinJS.js");

var bgtask = this;
var AppService = Windows.ApplicationModel.AppService;
var ValueSet = Windows.Foundation.Collections.ValueSet;

(function () {
    "use strict";

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var deferral = backgroundTaskInstance.getDeferral();
    var triggerDetails = backgroundTaskInstance.triggerDetails;

    function endTask() {
        backgroundTaskInstance.succeeded = true;
        deferral.complete();
        bgtask.close();
    }

    backgroundTaskInstance.addEventListener("canceled", function onCanceled(cancelEventArg) {
        return endTask();
    });

    if (triggerDetails && triggerDetails.name == 'MyJavascriptAppService') {
        triggerDetails.appServiceConnection.onrequestreceived = function (args) {
            if (args.detail && args.detail.length) {
                var appServiceCall = args.detail[0];
                var deferral = appServiceCall.getDeferral();
                var endCall = function () {
                    deferral.complete();
                }
                var request = appServiceCall.request;
                var message = appServiceCall.request.message;

                if (message.Command && message.Command === 'CalcSum') {
                    var result = message.Value1 + message.Value2;
                    var returnMessage = new ValueSet();
                    returnMessage.insert("Result", result);
                    request.sendResponseAsync(returnMessage).then(endCall, endCall);
                } else {
                    endCall();
                }
            }
        }

        triggerDetails.appServiceConnection.onserviceclosed = function (args) {
            endTask();
        }
    }
})();