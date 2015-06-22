/*
TODO: 
    refactor
    implement 3+ waypoints in html forms and submitWaypoints
    make things beautiful
    html: 
        directions title should draw from the data, not user input
    error handling
    loading animation
*/

var app = angular.module('navigation', []);

app.controller("DirectionsController", ['$http', function($http) {
    this.waypoints = ['','']; // variable for angular ng-model
    this.directions = [];
    var directionsAndWaypoints = null;
    this.submitWaypoints = function() {
        console.log("on submit:",this.waypoints);
        directionsAndWaypoints = getDirections($http, buildUrl(this.waypoints));
        this.waypoints = directionsAndWaypoints[0];
        this.directions = directionsAndWaypoints[1];
    };
}]);

// given the url, return list of directions
var getDirections = function($http, mapquestUrl) {
    console.log("sending request to ",mapquestUrl)
    var newDirections = [];
    var waypoints = [];
    $http.get(mapquestUrl).then(function(response) {
        // TODO: allow more than 2 waypoints.
        try {
            var maneuvers = response.data.route.legs[0].maneuvers;
            // todo: ditto
            for (var i=0; i<2; i++) {
                var location = response.data.route.locations[i]
                var toBeJoined = [];
                if (location.street) {
                    toBeJoined.push(location.street);
                }
                if (location.adminArea5) {
                    toBeJoined.push(location.adminArea5);
                }
                if (location.adminArea3) {
                    toBeJoined.push(location.adminArea3);
                }
                waypoints.push(toBeJoined.join(', '));
            }
            for (var i=0; i<maneuvers.length; i++) {
                newDirections.push({
                    "narrative": maneuvers[i].narrative,
                    "distance": maneuvers[i].distance.toFixed(1)
                });
            }
        } catch(err) {
            newDirections.push('Unable to find route.');
        }

    });
    // a log at this point prints an empty array.
    // the pushes within $http.get get added after the return, as evidenced by a
    // console.log within the above block.
    // but it still works?!?!?!? WHY!?!?
    // console.log(newDirections);
    return [waypoints, newDirections];
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
    baseUrl = 'http://open.mapquestapi.com/directions/v2/route?key='                                                                                                                                                            + 'Fmjtd%7Cluu821u2n5%2Crn%3Do5-94a5ha';
    subsequentLocations = '';
    for (var i=1; i<newLocationStrings.length; i++) {
        subsequentLocations += nextLocationTemp + newLocationStrings[i];
    }
    return (baseUrl+firstLocation+subsequentLocations);

};


