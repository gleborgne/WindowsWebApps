//import the scripts you need :
//importScripts("/WinJS/js/WinJS.js");

var bgtask = this;
var AppService = Windows.ApplicationModel.AppService;
var ValueSet = Windows.Foundation.Collections.ValueSet;

(function () {
    "use strict";

    //get background task instance and activation details
    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var triggerDetails = backgroundTaskInstance.triggerDetails;
    //get deferral on background task to notify when service is done
    var bgtaskDeferral = backgroundTaskInstance.getDeferral();

    //ensure everything is closed appropriately
    function endBgTask() {
        backgroundTaskInstance.succeeded = true;
        bgtaskDeferral.complete();
        bgtask.close();
    }

    //as with any background task, it could be terminated by the system, for example to recover memory
    backgroundTaskInstance.addEventListener("canceled", function onCanceled(cancelEventArg) {
        return endBgTask();
    });

    //command processors callbacks
    var requestProcessors = {
        "CalcSum": function (request, message, endCall) {
            var result = message.Value1 + message.Value2;
            var returnMessage = new ValueSet();
            returnMessage.insert("Result", result);
            request.sendResponseAsync(returnMessage).then(endCall, endCall);
        },

        "CloseService": function (request, message, endCall) {
            endCall();
            endBgTask();
        }
    }

    //process incoming request
    function requestReceived(appServiceCall) {
        var deferral = appServiceCall.getDeferral();
        var endCall = function () {
            deferral.complete();
        }
        var request = appServiceCall.request;
        var message = appServiceCall.request.message;

        if (message.Command){
            var processor = requestProcessors[message.Command];
            if (processor){
                processor(request, message, endCall);
                return;
            }
        }
        endCall();
    }

    if (triggerDetails && triggerDetails.name == 'MyJavascriptAppService') {
        triggerDetails.appServiceConnection.onrequestreceived = function (args) {
            if (args.detail && args.detail.length) {
                requestReceived(args.detail[0]);                
            }
        }        
    }
})();