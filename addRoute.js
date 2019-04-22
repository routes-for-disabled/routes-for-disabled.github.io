var markers = [];
var customMarkers = [];
var cMarker;
var polylineArr = [];
var currentRoute = 0;

function initMap() {
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 50.469725, lng: 30.517896},
    mapTypeId: 'roadmap',
  });

  //hide customMarkers
  google.maps.event.addListener(map, 'zoom_changed', function() {
    console.log('zoom');
    var zoom = map.getZoom();
    // iterate over markers and call setVisible
    for (i = 0; i < customMarkers.length; i++) {
        customMarkers[i].setVisible(zoom > 13);
    }
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
    deleteRoute();
  });
  $(document).on('click', '.calculateAndDisplayRoute', function(){
    if (!$(".calculateAndDisplayRoute").hasClass("disabled"))
    {
      if(markers.length >=2){
        calculateAndDisplayRoute(directionsDisplay, directionsService, bounds, map);
      }
    }
  });
  directionsDisplay.setMap(map);

  getMarkersFromDB(map);
  getRoutesFromDB(directionsDisplay, directionsService, bounds, map);
}

function getMarkersFromDB(map){
  db.collection("Markers")
    .find({}, {limit: 1000})
    .toArray()
    .then(docs => {
      const html = docs;
      for (var i = 0; i < html.length; i++) {
        addCustomMarker({lat: html[i].lat, lng: html[i].lng}, map, html[i].type);
        customMarkers.push(cMarker);
      }
      cMarker = 0;
      setMapCustomOnAll(map);
    });
}

// function getRoutesFromDB(directionsDisplay, directionsService, bounds, map){
//   //var nMarkers = [];
//   db.collection("route")
//     .find({}, {limit: 1000})
//     .toArray()
//     .then(docs => {
//       const html = docs;
//       for (let i = 0; i < html.length; i++) {
//         let parsedArr = JSON.parse(html[i].markersArr);
//         for (let j = 0; j < parsedArr.length; j++) {
//           var tempMarker = new google.maps.Marker({
//             position: {lat: parsedArr[j].lat, lng: parsedArr[j].lng},
//             map: map,
//             type: 'default'
//           });
//           markers.push(tempMarker);
//         }
//         calculateAndDisplayRoute(directionsDisplay, directionsService, bounds, map);
//         deleteMarkers();
//       }
//     });
// }

function getRoutesFromDB(directionsDisplay, directionsService, bounds, map){
  //var nMarkers = [];
  db.collection("route")
    .find({}, {limit: 1000})
    .toArray()
    .then(docs => {
      const html = docs;
      for (let i = 0; i < html.length; i++) {
        let parsedArr = JSON.parse(html[i].markersArr);
        var polyline = new google.maps.Polyline({
          path: parsedArr,
          strokeColor: '#4285F4',
          strokeWeight: 5,
          clickable: false
        });
        polyline.setMap(map);
      }
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location, map) {
  if (state == 3 && !cMarker) {
    let selectedMarker = $( "#inputGroupSelect01" ).val();
    addCustomMarker(location, map, selectedMarker);
  }
  else if(state != 1 && !cMarker){
    addRouteMarker(location, map);
  }
}

function addCustomMarker(location, map, selectedMarker) {
  switch (selectedMarker) {
    case 'lift':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/2.png',
        type: selectedMarker
      });
      cMarker = marker;
      break;
    case 'wc':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/1.png',
        type: selectedMarker,
        scaledSize: new google.maps.Size(50, 50)
      });
      cMarker = marker;
      break;
    case 'parking':
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: 'https://routes-for-disabled.github.io/img/3.png',
        type: selectedMarker
      });
      cMarker = marker;
      break;
  }
}

function addRouteMarker(location, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    type: 'default'
  });
  markers.push(marker);
  checkAmountOfMarkers();
}

function submitCustomMarker(){
  if (cMarker) {
    db.collection("Markers")
    .insertOne({ lat : cMarker.position.lat(), lng: cMarker.position.lng(), type: cMarker.type})
    .then(pushCMarker);
  }
}

// function submitRoute(){
//   console.log('saveroute');
//   let markersLatLngArr = [];
//   for (var i = 0; i < markers.length; i++) {
//     markersLatLngArr.push({lat:markers[i].position.lat(), lng:markers[i].position.lng()});
//   }
//
//   console.log(markersLatLngArr);
//
//   if (markersLatLngArr.length > 0) {
//     db.collection("route")
//     .insertOne({markersArr: JSON.stringify(markersLatLngArr)})
//     .then();
//   }
//   deleteMarkers();
// }

function submitRoute(){
  if (polylineArr.length > 0) {
    db.collection("route")
    .insertOne({markersArr: JSON.stringify(polylineArr)})
    .then();
  }
  deleteMarkers();
  polylineArr = [];
  currentRoute = 0;
}

function pushCMarker(){
  customMarkers.push(cMarker);
  cMarker = 0;
  alert( "Marker added" );
  db.collection("Markers")
    .find({}, {limit: 1000})
    .toArray()
    .then(docs => {
      const html = docs;
      console.log(html);
    });
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

function setMapCustomOnAll(map) {
  for (var i = 0; i < customMarkers.length; i++) {
    customMarkers[i].setMap(map);
  }
}

function deleteRoute(){
  console.log(currentRoute);
  if (currentRoute) {
    currentRoute.setMap(null);
  }
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
            polylineArr.push({lat:nextSegment[k].lat(), lng:nextSegment[k].lng()}); //to store
            bounds.extend(nextSegment[k]);
          }
        }
      }
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  polyline.setMap(map);
  currentRoute = polyline;
}
