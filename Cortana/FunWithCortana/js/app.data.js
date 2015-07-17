var App;
(function (App) {
    var Data;
    (function (Data) {
        var trips = [
            { nameFr: "Paris", nameEn: "Paris", date: new Date(2015, 11, 24, 23, 0) },
            { nameFr: "Londres", nameEn: "London", date: new Date(2015, 11, 24, 23, 0) },
            { nameFr: "Venise", nameEn: "Venice", date: new Date(2015, 11, 24, 23, 0) }
        ];
        function getTrips() {
            return WinJS.Promise.wrap(trips);
        }
        Data.getTrips = getTrips;
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));
//# sourceMappingURL=app.data.js.map