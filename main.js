var polyline_arr = [];
var markers = [];

function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 37.77, lng: -122.447}
  });
  var bounds = new google.maps.LatLngBounds();
  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
  });
  map.addListener('click', function(event) {
          addMarker(event.latLng, map);
          console.log(event.latLng.lat());
          console.log(event.latLng.lng());
  });
  $(document).on('click', '.deleteMarkers', function(){
    deleteMarkers();
  });
  $(document).on('click', '.calculateAndDisplayRoute', function(){
    //calculateAndDisplayRoute(directionsService, directionsDisplay, bounds, polyline);
  });
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay, bounds, polyline);

  polyline.setMap(map);
  polyline_arr.push(polyline)
  map.fitBounds(bounds);
}

// Adds a marker to the map and push to the array.
function addMarker(location, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, bounds, polyline) {
  var first = new google.maps.LatLng(50.464072, 30.516374); //waypoints
  var selectedMode = "WALKING";

  console.log(selectedMode);
  directionsService.route({
    origin: {lat: 50.462796, lng: 30.519026},
    destination: {lat: 50.465255, lng: 30.516446},
    waypoints: [{location: first, stopover: false}],
    // origin: origin,
    // destination: destination,
    // waypoints: waypoints,
    // Note that Javascript allows us to access the constant
    // using square brackets and a string value as its
    // "property."
    travelMode: google.maps.TravelMode[selectedMode]
  }, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response);

      var legs = response.routes[0].legs;
      for (i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (j=0;j<steps.length;j++) {
          var nextSegment = steps[j].path;
          for (k=0;k<nextSegment.length;k++) {
            polyline.getPath().push(nextSegment[k]);
            bounds.extend(nextSegment[k]);
          }
        }
      }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
