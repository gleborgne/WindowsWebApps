module App.Data {
    export interface Trip {
        nameEn: string;
        nameFr: string;
        date: Date;
    }

    var trips: Trip[] = [
        { nameFr: "Paris", nameEn: "Paris", date: new Date(2015, 11, 24, 23, 0) },
        { nameFr: "Londres", nameEn: "London", date: new Date(2015, 11, 24, 23, 0) },
        { nameFr: "Venise", nameEn: "Venice", date: new Date(2015, 11, 24, 23, 0) }
    ];

    export function getTrips(): WinJS.IPromise<Trip[]> {
        return WinJS.Promise.wrap(trips);
    }
}