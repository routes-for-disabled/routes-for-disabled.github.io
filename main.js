var state = 0;

$(document).on('click', '.main', function(){
  state = 0;
  $("#map").addClass("d-none");
  $(".controls").addClass("fullscreen");
  showMain();
});

$(document).on('click', '.showMap', function(){
  state = 1;
  $("#map").removeClass("d-none");
  $(".controls").removeClass("fullscreen");
  showMap();
});

$(document).on('click', '.addRoutes', function(){
  state = 2;
  $("#map").removeClass("d-none");
  $(".controls").removeClass("fullscreen");
  showAddRoutes();
});

$(document).on('click', '.addMarkers', function(){
  state = 3;
  $("#map").removeClass("d-none");
  $(".controls").removeClass("fullscreen");
  showAddMarkers();
});

function showMap(){
  $( ".controls" ).empty();
  $( ".controls" ).append( '     <div class="container align-middle fixed-bottom py-3"><div class="row my-4"><div class="col"><button type="button" class="btn btn-dark main">Back</button></div></div></div>    ' );
}

function showMain(){
  $( ".controls" ).empty();
  $( ".controls" ).append( '<div class="row align-items-center mx-5" style="height: 100%;"><div class="col-12 mt-3"><h1 class="text-center">Routes for disabled</h1></div><div class="col-md-5"><img src="https://routes-for-disabled.github.io/img/maps_scale_2x.png" class="responsive" alt="..."></div><div class="col"><button type="button" class="btn btn-outline-secondary btn-lg btn-block showMap">Show map</button><button type="button" class="btn btn-outline-secondary btn-lg btn-block addRoutes">Add routes</button><button type="button" class="btn btn-outline-secondary btn-lg btn-block addMarkers">Add markers</button></div></div>' );
}

function showAddRoutes(){
  $( ".controls" ).empty();
  $( ".controls" ).append( '<div class="container align-middle fixed-bottom"><div class="row my-4 align-items-center"><div class="col"><button type="button" class="btn btn-dark main">Back</button></div><div class="col-auto bg-light rounded-pill py-3"><div class="row"><div class="col text-center deleteMarkers px-4"><i class="fas fa-trash-alt" style="font-size: 40px;"></i></div><div class="col text-center calculateAndDisplayRoute disabled px-4"><i class="fas fa-route" style="font-size: 40px;"></i></div></div></div><div class="col"></div></div></div>    ' );
}

function showAddMarkers(){
  $( ".controls" ).empty();
  $( ".controls" ).append( '            <div class="container align-middle fixed-bottom"><div class="row my-4"><div class="col-2 mr-2"><button type="button" class="btn btn-dark main">Back</button></div><div class="col-8 text-center"><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect01">Markers</label></div><select class="custom-select" id="inputGroupSelect01"><option value="1" selected>Lift</option><option value="2">WC</option><option value="3">Parking</option></select></div></div></div></div>   ' );
}
