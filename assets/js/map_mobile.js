var map;

$(document).ready(function() {
    
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: 'm'
    });

    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);
   
    var watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {maximumAge: 3000, enableHighAccuracy: true });
 
    function successCallback(position){
        
        console.log(position.coords.longitude)
        console.log(position.coords.latitude)
        
        var lonLat = new OpenLayers.LonLat( position.coords.longitude ,position.coords.latitude )
            .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
        );
            
        var zoom = 16;
        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));
        map.setCenter (lonLat, zoom);
    }; 

    function errorCallback(error){
        switch(error.code){
            case error.PERMISSION_DENIED:
              alert("L'utilisateur n'a pas autorisé l'accès à sa position");
              break;     
            case error.POSITION_UNAVAILABLE:
              alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
              break;
            case error.TIMEOUT:
              alert("Le service n'a pas répondu à temps");
              break;
        }
    };
    /*
    function stopWatch(){
        navigator.geolocation.clearWatch(watchId);
    } 
    */
    
    
    

});



