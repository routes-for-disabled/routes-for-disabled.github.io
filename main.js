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

$(document).on('click', '.saveMarker', function(){
  submitCustomMarker();
});

$(document).on('click', '.deleteCustomMarker', function(){
  deleteCustomMarker();
});

$(document).on('click', '.saveRoute', function(){
  submitRoute();
});

function showMap(){
  $( ".controls" ).empty();
  $( "nav" ).empty();
  $( ".controls" ).append( '<div class="container align-middle fixed-bottom"><div class="row my-4"><div class="col-2 mr-2"><button type="button" class="btn btn-dark main">Back</button></div><div class="col-8 text-center"><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text" for="inputGroupSelect02">Show markers:</label></div><select class="custom-select selectCustom" id="inputGroupSelect02"><option value="all" selected>All</option><option value="lift">Lift</option><option value="wc">WC</option><option value="parking">Parking</option></select></div></div></div></div>' );
}

function showMain(){
  if (cMarker) {
    cMarker.setMap(null);
    cMarker = 0;
  }
  deleteMarkers();
  deleteRoute();
  $( ".controls" ).empty();
  $( "nav" ).empty();
  $( "nav" ).append( '<nav class="navbar navbar-light fixed-top d-flex justify-content-end"><button type="button" class="btn btn-success mr-1 btn-sm">Sign in</button><button type="button" class="btn btn-warning ml-1 text-white btn-sm">Sign up</button></nav>' );
  $( ".controls" ).append( '    <nav class="navbar navbar-light fixed-top d-flex justify-content-end"><button type="button" class="btn btn-success mr-1 btn-sm">Sign in</button><button type="button" class="btn btn-warning ml-1 text-white btn-sm">Sign up</button></nav>   <div class="controls fullscreen"><div class="row align-items-center mx-5" style="height: 100%;"><div class="col-12 mt-5"><h1 class="text-center">Routes for wheelchairs</h1></div><div class="col-md-5"><img src="https://routes-for-disabled.github.io/img/maps_scale_2x.png" class="responsive" alt="..."></div><div class="col"><button type="button" class="btn btn-outline-secondary btn-lg btn-block showMap">Show map</button><button type="button" class="btn btn-outline-secondary btn-lg btn-block addRoutes">Add routes</button><button type="button" class="btn btn-outline-secondary btn-lg btn-block addMarkers">Add markers</button></div></div></div>' );
}

function showAddRoutes(){
  $( ".controls" ).empty();
  $( "nav" ).empty();
  $( ".controls" ).append( '<div class="col fixed-top mt-5 mx-0 pr-2"><div class="row mb-2 mt-3"><div class="col"></div><div class="col-auto"><button type="button" class="btn btn-success px-5 saveRoute">Save</button></div></div></div>          <div class="container align-middle fixed-bottom"><div class="row my-4 align-items-center"><div class="col"><button type="button" class="btn btn-dark main">Back</button></div><div class="col-auto bg-light rounded-pill py-3"><div class="row"><div class="col text-center deleteMarkers px-4"><i class="fas fa-trash-alt" style="font-size: 40px;"></i></div><div class="col text-center calculateAndDisplayRoute disabled px-4"><i class="fas fa-route" style="font-size: 40px;"></i></div></div></div><div class="col"></div></div></div>    ' );
}

function showAddMarkers(){
  $( ".controls" ).empty();
  $( "nav" ).empty();
  $( ".controls" ).append( '<div class="col fixed-top mt-5 mx-0 pr-2"><div class="row mb-2 mt-3"><div class="col"></div><div class="col-auto"><button type="button" class="btn btn-success px-5 saveMarker">Save</button></div></div></div><div class="container align-middle fixed-bottom"><div class="row mb-4"><div class="col-2 mr-2"><button type="button" class="btn btn-dark main">Back</button></div><div class="col-2 mr-3"><div class="col text-center px-4 deleteCustomMarker"><i class="fas fa-trash-alt" style="font-size: 35px;"></i></div></div><div class="col-6 text-center pr-4"><div class="input-group mb-3"><div class="input-group-prepend"></div><select class="custom-select" id="inputGroupSelect01"><option value="lift" selected>Lift</option><option value="wc">WC</option><option value="parking">Parking</option></select></div></div></div></div>' );
}
