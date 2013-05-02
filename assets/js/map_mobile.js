var map;

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

    lgpx = new OpenLayers.Layer.Vector("Etapes", {
        styleMap: myStyles,
        protocol: new OpenLayers.Protocol.HTTP({
            url: "dispatcher.php?controlleur=Parcours&action=getParcours",
            format: new OpenLayers.Format.GeoJSON(),
        }),
        strategies: [new OpenLayers.Strategy.Fixed()],
        projection: new OpenLayers.Projection("EPSG:21781")

    });
    map.addLayer(lgpx);

    control = new OpenLayers.Control.SelectFeature(lgpx);
    map.addControl(control);
    control.activate();


    var watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {maximumAge: 3000, enableHighAccuracy: true});

    function successCallback(position) {

        var lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)
                .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
                );

        /*var lgpx = new OpenLayers.Layer.Vector("European cities", {
         protocol: new OpenLayers.Protocol.HTTP({
         url: "dispatcher.php?controlleur=Parcours&action=getParcours",
         format: new OpenLayers.Format.GeoJSON()
         }),
         strategies: [new OpenLayers.Strategy.Fixed()],
         projection: new OpenLayers.Projection("EPSG:4326")
         });
         map.addLayer(lgpx);*/


        var zoom = 10;
        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));
        map.setCenter(lonLat, zoom);
    }
    ;

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
    ;
    
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
    }

});

