(function (_global) {
    'use strict';
    var appcache = _global.applicationCache;
    
    _global.appCacheReadyPromise = {
        initialized: false,
        closed: false,
        messageContentBuffer : [],
        loader: null,
        progressCursor: null,
        messageContent: null,
        callbacks: [],
        status: [],
        then: function (callback) {
            this.callbacks.push(callback);
        }
    }

    function checking(arg) {
        setMessage("checking cache");
    }

    function updateready(arg) {        
        setMessage("update ready");
        appcache.swapCache();
        closeCacheLoader();
    }

    function downloading(arg) {
        setMessage("downloading");
    }

    function noupdate(arg) {
        setMessage("no update");
        closeCacheLoader();
    }

    function cached(arg) {
        setMessage("cached");
        setTimeout(function () {
            closeCacheLoader();
        }, 3000);
    }

    function progress(arg) {
        if (_global.appCacheReadyPromise && _global.appCacheReadyPromise.progressCursor) {
            _global.appCacheReadyPromise.progressCursor.style.width = ((100 * arg.loaded / arg.total) >> 0) + '%';
        }
        setMessage("progress");
    }

    function obsolete(arg) {
        setMessage("obsolete");
    }

    function error(arg) {
        setMessage("error");
    }

    function setMessage(text) {
        if (_global.appCacheReadyPromise && !_global.appCacheReadyPromise.initialized)
            initCache();

        _global.appCacheReadyPromise.status.push(text);
        if (_global.appCacheReadyPromise.messageContent) {
            if (_global.appCacheReadyPromise.messageContentBuffer.length) {
                var buf = _global.appCacheReadyPromise.messageContentBuffer;
                _global.appCacheReadyPromise.messageContentBuffer = [];
                buf.forEach(function (t) {
                    setMessage(t);
                })
            }
            var m = document.createElement("DIV");
            m.className = "txt";
            m.innerText = text;
            _global.appCacheReadyPromise.messageContent.appendChild(m);
        } else if (_global.appCacheReadyPromise) {
            _global.appCacheReadyPromise.messageContentBuffer.push(text);
        }
    }

    function registerAppCacheEvents() {
        appcache.addEventListener("checking", checking);
        appcache.addEventListener("updateready", updateready);
        appcache.addEventListener("downloading", downloading);
        appcache.addEventListener("noupdate", noupdate);
        appcache.addEventListener("cached", cached);
        appcache.addEventListener("progress", progress);
        appcache.addEventListener("error", error);
        appcache.addEventListener("obsolete", obsolete);
    }

    function unregisterAppCacheEvents() {
        appcache.removeEventListener("checking", checking);
        appcache.removeEventListener("updateready", updateready);
        appcache.removeEventListener("downloading", downloading);
        appcache.removeEventListener("noupdate", noupdate);
        appcache.removeEventListener("cached", cached);
        appcache.removeEventListener("progress", progress);
        appcache.removeEventListener("error", error);
        appcache.removeEventListener("obsolete", obsolete);
    }

    function initCache() {
        if (_global.appCacheReadyPromise && !_global.appCacheReadyPromise.initialized) {
            _global.appCacheReadyPromise.initialized = true;
            document.removeEventListener("DOMContentLoaded", initCache);
            console.log("init loader");
            document.onreadystatechange = null;

            var loader = _global.document.createElement("DIV");
            _global.appCacheReadyPromise.loader = loader;
            loader.className = "appcache-loader";
            var message = _global.document.createElement("DIV");
            message.className = "message";

            var messageTitle = _global.document.createElement("DIV");
            messageTitle.className = "title";
            messageTitle.innerText = "loading ressources"
            message.appendChild(messageTitle);

            var messageProgress = _global.document.createElement("DIV");
            messageProgress.className = "progress";
            messageProgress.style.minHeight = "2px";
            message.appendChild(messageProgress);
            
            var messageProgressCursor = _global.document.createElement("DIV");
            _global.appCacheReadyPromise.progressCursor = messageProgressCursor;
            messageProgressCursor.className = "cursor";
            messageProgressCursor.style.height = "100%";
            messageProgressCursor.style.width = "0%";
            messageProgress.appendChild(messageProgressCursor);

            var messageContent = _global.document.createElement("DIV");
            _global.appCacheReadyPromise.messageContent = messageContent;
            messageContent.className = "content";
            message.appendChild(messageContent);
            loader.appendChild(message);
            document.body.appendChild(loader);
        }
    }

    function closeCacheLoader() {
        if (_global.appCacheReadyPromise && !_global.appCacheReadyPromise.closed) {
            _global.appCacheReadyPromise.closed = true;
            console.log("cache close");
            unregisterAppCacheEvents();
            document.body.removeChild(_global.appCacheReadyPromise.loader);
            _global.appCacheReadyPromise.callbacks.forEach(function (c) {
                c(_global.appCacheReadyPromise.status);
            })
            
            _global.appCacheReadyPromise = null;
        }
    }

    if (appcache) {
        registerAppCacheEvents();
        //document.addEventListener("DOMContentLoaded", initCache);
    }
})(this);

//$(document).ready(function () {
//    var appCache = window.applicationCache;
//    if (appCache) {

//        // Manually ask the cache to update.
//        //appCache.update();


//        // Bind to online/offline events.
//        $(window).bind(
//                    "online offline",
//                    function (event) {
//                        // Update the online status.
//                        //appStatus.text(navigator.onLine ? "Online" : "Offline");
//                    }
//                );

//        // List for checking events. This gets fired when the browser
//        // is checking for an udpated manifest file or is attempting
//        // to download it for the first time.
//        $(appCache).bind(
//                    "checking",
//                    function (event) {
//                        $('#main-notifications').text("Lecture du manifeste");
//                    }
//                );

//        // This gets fired when new cache files have been downloaded
//        // and are ready to replace the *existing* cache. The old
//        // cache will need to be swapped out.
//        $(appCache).bind(
//                "updateready",
//                    function (event) {
//                        $('#main-notifications').text('cache mis à jour');
//                        appCache.swapCache();
//                        if (confirm('Une nouvelle version est disponible, voulez vous la charger ?')) {
//                            window.location.reload();
//                        }
//                    }
//                );
//        // This gets fired when the browser is downloading the files
//        // defined in the cache manifest.
//        $(appCache).bind(
//                    "downloading",
//                    function (event) {
//                        // Get the total number of files in our manifest.
//                        //getTotalFiles();
//                        $('#main-notifications').text('démarrage du téléchargement...');
//                    }
//                );

//        // This gets fired if there is no update to the manifest file
//        // that has just been checked.
//        $(appCache).bind(
//                    "noupdate",
//                    function (event) {
//                        //logEvent("No cache updates");
//                        $('#main-notifications').text(version + ', pas de mise à jour');
//                    }
//                );

//        // This gets fired when all cached files have been
//        // downloaded and are available to the application cache.
//        $(appCache).bind(
//                    "cached",
//                    function (event) {
//                        $('#main-notifications').text("Sur certains appareils, vous pouvez installer ce site en tant qu'application !");
//                        //logEvent("All files downloaded");
//                    }
//                );

//        // This gets fired for every file that is downloaded by the
//        // cache update.
//        $(appCache).bind(
//                    "progress",
//                    function (event) {
//                        $('#main-notifications').text('téléchargement en cours...');
//                        //logEvent("File downloaded");
//                        // Show the download progress.
//                        //displayProgress();
//                    }
//                );

//        // This gets fired when the cache manifest cannot be found.
//        $(appCache).bind(
//                    "obsolete",
//                    function (event) {
//                        $('#main-notifications').text("Manifeste non trouvé");
//                    }
//                );


//        // This gets fired when an error occurs
//        $(appCache).bind(
//                    "error",
//                    function (event) {
//                        $('#main-notifications').html("Erreur de cache");
//                    }
//                );

//    }
//});