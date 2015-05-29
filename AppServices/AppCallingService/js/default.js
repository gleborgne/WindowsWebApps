// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	
	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				// TODO: This application has been newly launched. Initialize your application here.
			} else {
				// TODO: This application has been reactivated from suspension.
				// Restore application state here.
			}
			args.setPromise(WinJS.UI.processAll());
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();

	WinJS.Utilities.ready(function () {
	    var calcBtn = document.getElementById('btnCalc');
	    calcBtn.addEventListener('click', function () {
	        calcSum().then(function success(message) {
	            console.log('app service respond ' + message.Result);
	        }, function error(err) {
	            console.error(err);
	        });
	    });

	    var closeBtn = document.getElementById('btnClose');
	    closeBtn.addEventListener('click', function () {
	        closeService().then(function success(message) {
	            console.log('app service closed');
	        }, function error(err) {
	            console.error(err);
	        });
	    });
	});

	var AppService = Windows.ApplicationModel.AppService;
	var ValueSet = Windows.Foundation.Collections.ValueSet;
	var serviceConnection = null;

	function calcSum() {
	    var d = new Date();
	    var key = 'calling sum ' + d.toISOString();
	    console.time(key);
	    var endcall = function () {
	        console.timeEnd(key);
	    }

	    return getServiceConnection().then(function (connection) {
	        var message = new ValueSet();
	        var val1 = document.getElementById('txtValue1').value;
	        var val2 = document.getElementById('txtValue2').value;

	        if (!val1 || !val2) {
	            document.getElementById('result').innerHTML = "it works better with inputs";
	            return;
	        }

	        message.insert("Command", "CalcSum");
	        message.insert("Value1", parseFloat(val1));
	        message.insert("Value2", parseFloat(val2));

	        return connection.sendMessageAsync(message).then(function (response) {
	            var e = response;
	            if (response.status === AppService.AppServiceResponseStatus.success) {
	                document.getElementById('result').innerHTML = 'calculated ' + response.message.Result;
	                
	                return response.message;
	            }
	        });
	    }).then(function (r) {
	        endcall();
	        return r;
	    }, function (err) {
	        endcall();
	        return WinJS.Promise.wrapError(err);
	    });
	}

	function closeService() {
	    return getServiceConnection().then(function (connection) {
	        var message = new ValueSet();	        

            //for doing this, you could also call connection.close() but it's not as fun :-)

	        message.insert("Command", "CloseService");

	        return connection.sendMessageAsync(message).then(function (response) {
	            var e = response;
	            if (response.status === AppService.AppServiceResponseStatus.success) {
	                document.getElementById('result').innerHTML = 'service closed';
	                return response.message;
	            }
	        });
	    })
	}

	function getServiceConnection() {
	    if (serviceConnection) {
	        return WinJS.Promise.wrap(serviceConnection);
	    }

	    var connection = new AppService.AppServiceConnection();
        
	    serviceConnection = connection;

	    // See the appx manifest of the AppServicesDemp app for this value
	    connection.appServiceName = "MyJavascriptAppService";
	    // The package family name (PFN) is available at Windows.ApplicationModel.Package.current.id.familyName API 
        // start the other app to get it and copy/paste here
	    connection.packageFamilyName = "1267a157-6c04-4178-86d2-d57c00c3207b_0yq8da09mhzv6";
        
	    return connection.openAsync().then(function(connectionStatus){
	        if (connectionStatus == AppService.AppServiceConnectionStatus.success) {
	            connection.onserviceclosed = serviceClosed;
	            return connection;
	        }
	        else {
	            //Drive the user to store to install the app that provides 
	            //the app service 
	            return WinJS.Promise.wrapError({ message: 'service not available' });
	        }
	    })
	    
	    
	}

	function serviceClosed() {
	    console.log('service was closed');
	    serviceConnection = null;
	}
})();
