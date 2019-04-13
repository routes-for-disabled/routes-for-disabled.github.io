$(document).on('click', '.addRoutes', function(){
  showAddRoutes();
});
$(document).on('click', '.addMarkers', function(){
  showaddMarkers();
});

function showAddRoutes(){
  $( "body" ).empty();
  $( "body" ).append( '<div id="map"></div><div class="container align-middle fixed-bottom"><div class="row my-4"><div class="col-6 text-center deleteMarkers"><i class="fas fa-trash-alt" style="font-size: 40px;"></i></div><div class="col-6 text-center calculateAndDisplayRoute disabled"><i class="fas fa-route" style="font-size: 40px;"></i></div></div></div>    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAl5uffklpEe9XBJTBNXkIp87KNfxhgn9Y&libraries=geometry&callback=initMap"async defer></script>' );
}

function showaddMarkers(){
  $( "body" ).empty();
  $( "body" ).append( '<div id="map"></div>    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAl5uffklpEe9XBJTBNXkIp87KNfxhgn9Y&libraries=geometry&callback=initMap"async defer></script>' );
}
