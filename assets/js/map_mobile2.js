var map;
var newPersonne;
var lon, lat, valeurCache, watchId, currentLon, currentLat;
var exitApplication=true;
var markersId = new Object();
var personnesSelected = new Array();
var personnes = new Array("Yann");
var selfIsSelected=false;
var firstPosition=true;
var interval;
var lonLat;
var markers;
var marker;


$(document).ready(function() {

    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: 'm'
    });

    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);


    onMapLoaded();
    setInterval('changePosition();',1000)
});
    


    function onMapLoaded() {


            navigator.geolocation.getCurrentPosition(currentPositionSuccess, errorCallback, {
                enableHighAccuracy : true, 
                timeout:3000, 
                maximumAge:0

        });

    }


    /**
     * Fonction appelée lorsque l'annonce de la position a correctement fonctionné
     */ 
    function currentPositionSuccess(location) { 

        currentLat = location.coords.latitude;
        currentLon = location.coords.longitude;

        lonLat = new OpenLayers.LonLat(currentLon, currentLat)
                .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
                );


        var zoom = 18;
        markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        marker = new OpenLayers.Marker(lonLat);
        markers.addMarker(marker);
        map.setCenter(lonLat, zoom);

        changePosition();

    }



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
    }


    function changePosition(){    
            
            markers.removeMarker(marker);
            
            currentLat += 0.00003;
            currentLon += 0.00002;
            
            lonLat = new OpenLayers.LonLat(currentLon, currentLat)
                .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
                );
            
            marker = new OpenLayers.Marker(lonLat);

            markers.addMarker(marker);

            map.addLayer(markers);

            


    }
    
    

    

/**
 * Fonction faisant bouger l'utilisateur virtuel Yann
 */ 



    
    
    
    
    
    
    /*
    lgpx.events.register("featureselected", lgpx, onFeatureSelect);
    lgpx.events.register("featureunselected", lgpx, onFeatureUnselect);
    
    function onPopupClose(evt) {
                // 'this' is the popup.
                control.unselect(this.feature);
            }
    function onFeatureSelect(evt) {
        feature = evt.feature;
        popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100, 100),
                "<h2>" + feature.attributes.cntry_name + "</h2>" +
                feature.attributes.wup_capit,
                null,
                true,
                onPopupClose
                );
        feature.popup = popup;
        popup.feature = feature;
        map.addPopup(popup);
    }

    function onFeatureUnselect(evt) {
        feature = evt.feature;
        if (feature.popup) {
            popup.feature = null;
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        }
    }*/


