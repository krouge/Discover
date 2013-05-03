var map;
var newPersonne;
var lon, lat, valeurCache, watchId, currentLon, currentLat;
var exitApplication = true;
var markersId = new Object();
var personnesSelected = new Array();
var personnes = new Array("Yann");
var selfIsSelected = false;
var firstPosition = true;
var interval;
var lonLat;
var lonLat2;
var markers;
var marker;
var lgpx;
var latEtape;
var lonEtape;
var refreshIntervalId;
var aReponduQuestion = false;
var pointInterval = 0;

function areYouSure(callback) {
  $("#sure .sure-1").text(lgpx.features[0].attributes.question);
  for (var i=0;i<lgpx.features[0].attributes.reponses.length;i++){
      if(lgpx.features[0].attributes.reponses[i].estcorrect == (i-1)){
      var a = $('<a href="#" data-role="button" data-theme="c" data-rel=""/>');
      }else{
      var a = $('<a href="#" data-role="button" data-theme="c" data-rel="back" id="estCorrect" />');
      }
      a.html(lgpx.features[0].attributes.reponses[i].reponse);
      //console.log(reponse);
      $("#sureContent").append(a);
  }
  $.mobile.changePage("#sure");
}

$(document).on('click', '#estCorrect', function() {
        alert("Bravo, la réponse est correcte!");
        pointInterval = 0;
        aReponduQuestion = true;
        refreshIntervalId = setInterval('changePosition();', 1000);
        
    });

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

$(document).ready(function() {

    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: 'm'
    });


    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);

    var myStyles = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({
            externalGraphic: "assets/img/dot_1.png",
            strokeColor: "#FF0000",
            graphicHeight: 40,
            graphicYOffset: -43,
        })
    });


    lgpx = new OpenLayers.Layer.Vector("Etape", {
        styleMap: myStyles,
        protocol: new OpenLayers.Protocol.HTTP({
            url: "dispatcher.php",
            params: {
                controlleur: "Parcours",
                action: "getParcours",
                id: GetURLParameter('id'),
                numEtape: 1
            },
            format: new OpenLayers.Format.GeoJSON()
        }),
        strategies: [new OpenLayers.Strategy.Fixed()],
        projection: new OpenLayers.Projection("EPSG:21781")

    });
    map.addLayer(lgpx);
    //console.log(lgpx);
    //console.log(lgpx.features.0);


    onMapLoaded();
    refreshIntervalId = setInterval('changePosition();', 1000);
});



function onMapLoaded() {


    navigator.geolocation.getCurrentPosition(currentPositionSuccess, errorCallback, {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0

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

}



function errorCallback(error) {
    switch (error.code) {
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


function changePosition() {

    if (lgpx.features[0] != undefined) {
        console.log(lgpx);
        lonLat2 = new OpenLayers.LonLat(lgpx.features[0].geometry.x, lgpx.features[0].geometry.y)
                .transform(map.getProjectionObject()
                , new OpenLayers.Projection("EPSG:4326") // transform from WGS 1984
                // to Spherical Mercator Projection
                );

        if (getDistanceFromLatLonInKm(currentLat, currentLon, lonLat2.lat, lonLat2.lon) >= 0.07 || aReponduQuestion == true) {
            
            pointInterval++;
            if(pointInterval >= 6){
                aReponduQuestion = false;
            }
            //Fonction de base faisant une requête vers le serveur, qui va calculer la distance via ST_Distance. Comme le serveur est trop lent,
            //une alternative en javascript est utilisée pour la démo

            /*$.get("dispatcher.php", {
             controlleur: "Parcours",
             action: "testPosition",
             lat: lonLat.lat,
             lon: lonLat.lon,
             latEtape: lgpx.features[0].geometry.y,
             lonEtape: lgpx.features[0].geometry.x,
             },
             function(data) {*/
            /*console.log(data);
             console.log(lgpx.features[0].geometry.x);
             console.log(data);*/
            markers.removeMarker(marker);

            currentLat += 0.00030;
            currentLon += 0.00012;

            lonLat = new OpenLayers.LonLat(currentLon, currentLat)
                    .transform(
                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                    map.getProjectionObject() // to Spherical Mercator Projection
                    );



            marker = new OpenLayers.Marker(lonLat);
            //console.log(lgpx.features[0].geometry.x);

            markers.addMarker(marker);

            map.addLayer(markers);
            map.setCenter(lonLat, 18);
            console.log(lgpx.features[0].attributes.reponses[0].reponse)
        }else{
            /*
                feature = lgpx.features[0];
                popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100, 100),
                '<h2>' + feature.attributes.nom + '</h2>' +
                'Canton de départ: '+feature.attributes.canton+'<br />'+
                'Nombre d\'étapes: '+feature.attributes.nbrEtapes+'<br />'+
                '<a href="mobile_map.html?id='+feature.fid+'">Jouer!<h2></a>',
                null,
                true,
                onPopupClose
                ); 
        map.addPopup(popup);*/
            clearInterval(refreshIntervalId);
            areYouSure(function() {
  // user has confirmed, do stuff
});
        }
    }

}
   function onPopupClose(evt) {
                map.removePopup(map.popups[0])
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


