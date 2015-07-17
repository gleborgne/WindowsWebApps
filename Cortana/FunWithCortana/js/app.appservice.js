//import the scripts you need :
importScripts("/WinJS/js/base.js");
importScripts("/js/app.data.js");
var bgtask = this;
var AppService = Windows.ApplicationModel.AppService;
var ValueSet = Windows.Foundation.Collections.ValueSet;
var VoiceCommands = Windows.ApplicationModel.VoiceCommands;
var _global = this;
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
        "whenIsTripToDestination": function (connection, command) {
            App.Data.getTrips().then(function (trips) {
                try {
                    var destination = command.properties.destination;
                    var commandMessage = new Windows.ApplicationModel.VoiceCommands.VoiceCommandUserMessage();
                    commandMessage.displayMessage = "choose your trip";
                    commandMessage.spokenMessage = "choose your trip";
                    var commandTiles = [];
                    trips.forEach(function (trip) {
                        var tile = new Windows.ApplicationModel.VoiceCommands.VoiceCommandContentTile();
                        tile.title = trip.nameEn;
                        tile.textLine1 = "tetst";
                        tile.contentTileType = 1 /* titleWithText */;
                        tile.appLaunchArgument = "destination=" + trip.nameEn;
                        commandTiles.push(tile);
                    });
                    var response = Windows.ApplicationModel.VoiceCommands.VoiceCommandResponse.createResponse(commandMessage, commandTiles);
                    response.appLaunchArgument = "destination=" + destination;
                    connection.reportSuccessAsync(response).then(function (arg) {
                        var e = arg;
                    }, function (err) {
                        console.error(err);
                    });
                }
                catch (exception) {
                    console.error(exception);
                }
            }, function (err) {
                console.error(err);
            });
        }
    };
    //process incoming request
    function requestReceived(connection, command) {
        var processor = requestProcessors[command.commandName];
        if (processor) {
            return processor(connection, command);
        }
        else {
            var commandMessage = new Windows.ApplicationModel.VoiceCommands.VoiceCommandUserMessage();
            commandMessage.displayMessage = "youpi";
            commandMessage.spokenMessage = "youpi";
            var response = Windows.ApplicationModel.VoiceCommands.VoiceCommandResponse.createResponse(commandMessage);
            return connection.reportSuccessAsync(response);
        }
    }
    if (triggerDetails && triggerDetails.name == 'FunWithCortanaAppService') {
        var voiceServiceConnection = Windows.ApplicationModel.VoiceCommands.VoiceCommandServiceConnection.fromAppServiceTriggerDetails(triggerDetails);
        voiceServiceConnection.onvoicecommandcompleted = function (connection, arg) {
            endBgTask();
        };
        voiceServiceConnection.getVoiceCommandAsync().then(function (command) {
            return requestReceived(voiceServiceConnection, command);
        });
    }
})();
//# sourceMappingURL=app.appservice.js.map