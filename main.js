var polyline_arr = [[]];
var markers = [];

function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 50.449522, lng: 30.528850},
    mapTypeId: 'hybrid',
  });
  var bounds = new google.maps.LatLngBounds();
  map.addListener('click', function(event) {
          addMarker(event.latLng, map);
  });
  $(document).on('click', '.deleteMarkers', function(){
    deleteMarkers();
  });
  $(document).on('click', '.calculateAndDisplayRoute', function(){
    if (!$(".calculateAndDisplayRoute").hasClass("disabled"))
    {
      calculateAndDisplayRoute(directionsService, directionsDisplay, bounds, map);
      deleteMarkers();
    }
  });

  directionsDisplay.setMap(map);

  //map.fitBounds(bounds);
}

// Adds a marker to the map and push to the array.
function addMarker(location, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  checkAmountOfMarkers();
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function checkAmountOfMarkers() {
  if(markers.length >=2){
    $( ".calculateAndDisplayRoute" ).removeClass("disabled");
  }
  else {
    $( ".calculateAndDisplayRoute:disabled" ).addClass("disabled");
  }
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

function calculateAndDisplayRoute(directionsService, directionsDisplay, bounds, map) {
  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: 'indigo',
    strokeWeight: 5
  });

  var polyline_LatLng_arr = [];

  var selectedMode = "WALKING";

  var origin = {lat: markers[0].position.lat(), lng: markers[0].position.lng()};
  var destination = {lat: markers[markers.length-1].position.lat(), lng: markers[markers.length-1].position.lng()};
  var waypoints = [];
  for (var i = 1; i < markers.length-1; i++) {
    var point = new google.maps.LatLng(markers[i].position.lat(), markers[i].position.lng());
    var waypoint = {location: point, stopover: false};
    waypoints.push(waypoint);
  }

  directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: waypoints,
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

            //store LatLng
            // var obj = {};
            // obj['lat'] = nextSegment[k].lat();
            // obj['lng'] = nextSegment[k].lng();
            // polyline_LatLng_arr.push(JSON.stringify(obj));
          }
        }
      }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  //polyline_arr.push(polyline_LatLng_arr);
  //localStorage.setItem("polyline_arr", polyline_arr);
  polyline.setMap(map);
}
