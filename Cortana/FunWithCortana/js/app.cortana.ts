module App.Cortana {
    function trackError(err) {
        console.error(err);
    }

    export function register() {
        return Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("VoiceCommands.xml").then(function(voiceCommandsFile) {
            return Windows.ApplicationModel.VoiceCommands.VoiceCommandDefinitionManager.installCommandDefinitionsFromStorageFileAsync(voiceCommandsFile).then(function (arg) {
                return updatePhraseList();
            }, trackError);
        }, trackError);
    }

    export function updatePhraseList() {
        return App.Data.getTrips().then(function (trips) {
            try
            {
                // Update the destination phrase list, so that Cortana voice commands can use destinations added by users.
                // When saving a trip, the UI navigates automatically back to this page, so the phrase list will be
                // updated automatically.

                var definitions = Windows.ApplicationModel.VoiceCommands.VoiceCommandDefinitionManager.installedCommandDefinitions;
                if (definitions.hasKey("CommandSet_en-us")) {
                    var commandDefinitionsEnUs = definitions["CommandSet_en-us"];
                    var destinations = trips.map(function (trip) {
                        return trip.nameEn;
                    });
                    commandDefinitionsEnUs.setPhraseListAsync("destination", destinations);
                }
                if (definitions.hasKey("CommandSet_fr-fr")) {
                    var commandDefinitionsEnUs = definitions["CommandSet_fr-fr"];
                    var destinations = trips.map(function (trip) {
                        return trip.nameFr;
                    });
                    commandDefinitionsEnUs.setPhraseListAsync("destination", destinations);
                }
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
}