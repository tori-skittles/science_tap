var map;
function initMap() {

	var myLatLng = {lat: 39.9808732, lng: -75.1566633};
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 12
  });
  map.setMapTypeId(google.maps.MapTypeId.TERRAIN);


 var infoWindowL = new google.maps.InfoWindow({map: map});

// Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindowL.setPosition(pos);
      infoWindowL.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindowL, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindowL, map.getCenter());
  }


  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Demo Site</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Test</b>,Demo content goes in here</p>'+
      '<p>Site document: <Link></Link>, <a href="http://www.sciencetap.us/">sciencetap Home</a></p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Demo (Test Site)'
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });


  layer = new google.maps.FusionTablesLayer({
    query: {
      select: 'geometry',
      from: '1_kb24whPAZttu2FPYLAFPUAUb8f6PNnSUL48TzX7'
    },
   options: {
        styleId: 3,
        templateId: 4,
    strokeWeight: 3 
      }
  
  });
  layer.setMap(map);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindowL.setPosition(pos);
  infoWindowL.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
