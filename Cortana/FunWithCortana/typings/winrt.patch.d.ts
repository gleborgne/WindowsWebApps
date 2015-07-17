declare module Windows.ApplicationModel.VoiceCommands {
    var VoiceCommandDefinitionManager: any;
    var VoiceCommandDefinition: any;    

    export class VoiceCommandUserMessage {
        displayMessage: string;
        spokenMessage: string;
    }

    export enum VoiceCommandContentTileType {
        titleOnly = 0,
        titleWithText = 1,
        titleWith68x68Icon = 2,
        titleWith68x68IconAndText = 3,
        titleWith68x92Icon = 4,
        titleWith68x92IconAndText = 5,
        titleWith280x140Icon = 6,
        titleWith280x140IconAndText = 7
    }

    enum VoiceCommandCompletionReason {
        unknown = 0,
        communicationFailed = 1,
        resourceLimitsExceeded = 2,
        canceled = 3,
        timeoutExceeded = 4,
        appLaunched = 5,
        completed = 6
    }

    export class VoiceCommandContentTile {
        appContext: any;
        appLaunchArgument: string;
        image: Windows.Storage.IStorageFile;
        contentTileType: VoiceCommandContentTileType;
        textLine1: string;
        textLine2: string;
        textLine3: string;
        title: string;
    }

    export class VoiceCommandResponse {
        static createResponse(message: VoiceCommandUserMessage): VoiceCommandResponse;
        static createResponse(message: VoiceCommandUserMessage, tiles: VoiceCommandContentTile[]): VoiceCommandResponse;
        static createResponseForPrompt(message: VoiceCommandUserMessage, repeatMessage: VoiceCommandUserMessage): VoiceCommandResponse;
        static createResponseForPrompt(message: VoiceCommandUserMessage, repeatMessage: VoiceCommandUserMessage, tiles: VoiceCommandContentTile[]): VoiceCommandResponse;
        static maxSupportedVoiceCommandContentTiles: number;

        appLaunchArgument: string;
        message: VoiceCommandUserMessage;
        repeatMessage: VoiceCommandUserMessage;
        voiceCommandContentTiles: VoiceCommandContentTile[];        
    }

    export class VoiceCommand {
        commandName: string;
        properties: any;
        speechRecognitionResult: Windows.Media.SpeechRecognistion.SpeechRecognitionResult
    }

    export class VoiceCommandConfirmationResult {
        confirmed: boolean;
    }

    export class VoiceCommandDisambiguationResult {
        selectedItem: VoiceCommandContentTile;
    }

    export class VoiceCommandServiceConnection {
        static fromAppServiceTriggerDetails(triggerDetails): VoiceCommandServiceConnection;

        onvoicecommandcompleted: (connection: VoiceCommandServiceConnection, arg: VoiceCommandCompletedEventArgs) => void;
        language: Windows.Globalization.Language;
        getVoiceCommandAsync(): WinJS.IPromise<VoiceCommand>;
        reportFailureAsync(response: VoiceCommandResponse): WinJS.IPromise<any>;
        reportProgressAsync(response: VoiceCommandResponse): WinJS.IPromise<any>;
        reportSuccessAsync(response: VoiceCommandResponse): WinJS.IPromise<any>;
        requestAppLaunchAsync(response: VoiceCommandResponse): WinJS.IPromise<any>;
        requestConfirmationAsync(response: VoiceCommandResponse): WinJS.IPromise<VoiceCommandConfirmationResult>;
        requestDisambiguationAsync(response: VoiceCommandResponse): WinJS.IPromise<VoiceCommandDisambiguationResult>;
    }

    export class VoiceCommandCompletedEventArgs {
        reason: VoiceCommandCompletionReason;
    }
}

declare module Windows.ApplicationModel {
    var AppService: any;
}

declare module Windows.UI.WebUI {
    export interface IWebUIBackgroundTaskInstance {
        triggerDetails: any;
        getDeferral(): any;
        addEventListener(eventname: string, callback: any);
    }
}

declare module Windows.Media.SpeechRecognistion {
    export class SpeechRecognitionResult {
        confidence: any
        constraint: any;
        phraseDuration: any;
        PhraseStartTime: any;
        rawConfidence: number;
        rulePath: string[];
        semanticInterpretation: any;
        status: any;
        text: string;

        getAlternates(maxAlternates:number): SpeechRecognitionResult[];
    }
}