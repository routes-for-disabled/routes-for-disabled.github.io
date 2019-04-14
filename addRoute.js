var markers = [];
var markersLatLngArr = [[]];

function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 50.469725, lng: 30.517896},
    mapTypeId: 'roadmap',
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }

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
      if(markers.length >=2){
        calculateAndDisplayRoute(directionsDisplay, directionsService, bounds, map);
        storeRoute();
      }
      deleteMarkers();
    }
  });
  directionsDisplay.setMap(map);
}

// Adds a marker to the map and push to the array.
function addMarker(location, map) {
  if (state == 3) {
    addCustomMarker(location, map);
  }
  else if(state != 1){
    addRouteMarker(location, map);
  }
}

function addCustomMarker(location, map) {
  let selectedMarker = $( "#inputGroupSelect01" ).val();

  switch (selectedMarker) {
    case 'lift':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/13.png'
      });
      break;
    case 'wc':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/12.png'
      });
      break;
    case 'parking':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/14.png'
      });
      break;
    default:

  }
}

function addRouteMarker(location, map) {
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

function storeRoute() {
  let markersLatLng = [];
  for (var i = 0; i < markers.length; i++) {
    markersLatLngArr.push({lat:markers[i].position.lat(), lng:markers[i].position.lng()});
  }
  markersLatLngArr.push(markersLatLng);
  localStorage.setItem('markersLatLngArr', JSON.stringify(markersLatLngArr));
  console.log(localStorage.getItem('markersLatLngArr'));
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, bounds, map) {
  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#4285F4',
    strokeWeight: 5,
    clickable: false
  });

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
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.WALKING,
  }, function(response, status) {
    if (status == 'OK') {
      //directionsDisplay.setDirections(response);

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

  polyline.setMap(map);
}
