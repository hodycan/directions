/*TODO: 
    refactor
    implement 3+ waypoints in html forms and submitWaypoints
    make things beautiful
*/

var app = angular.module('navigation', []);

MAPQUESTKEY = 'Fmjtd%7Cluu821u2n5%2Crn%3Do5-94a5ha'

app.controller("DirectionsController", ['$http', function($http) {
    this.waypoints = ["here", "there"];
    this.newWaypoints = ['',''];
    this.directions = ['turn right', 'turn left', 'go straight']
    var directionsPreload = this.newDirections;
    // having the whole property and newProperty thing might be redundant
    // (i forgot why i did it)
    // but it's 5 am and i don't care
    // yet

    this.submitWaypoints = function() {
        this.waypoints = this.newWaypoints;
        this.newWaypoints = [];
        var mapquestUrl = buildUrl(this.waypoints);
        this.directions = getDirections($http, mapquestUrl);
    };
}]);

var getDirections = function($http, mapquestUrl) {
    var directionsPreload = [];
    $http.get(mapquestUrl).then(function(response) {
        // TODO: allow more than 2 waypoints.
        var maneuvers = response.data.route.legs[0].maneuvers;
        console.log('maneuvers array ' + maneuvers);
        for (var i=0; i<maneuvers.length; i++) {
            console.log('narrative ' + maneuvers[i].narrative)
            directionsPreload.push(maneuvers[i].narrative)
        }
    }); 
    return directionsPreload;
}

// returns a mapquest api call url
var buildUrl = function(locationStrings) {
    newLocationStrings = [];
    for (var i=0; i<locationStrings.length; i++) {
        newLocationString = locationStrings[i].replace(/\s/g, '+');
        newLocationStrings.push(newLocationString);
    }
    firstLocation = "&from=" + newLocationStrings[0];
    nextLocationTemp = "&to=";
    baseUrl = 'http://open.mapquestapi.com/directions/v2/route?key=' + MAPQUESTKEY;
    subsequentLocations = '';
    for (var i=1; i<newLocationStrings.length; i++) {
        subsequentLocations += nextLocationTemp + newLocationStrings[i];
    }
    return (baseUrl+firstLocation+subsequentLocations);

};


