var map, pointLayer1, pointLayer2, lineLayer, control, gpxLayer, baseurl;

var layerNum = 1;
$(document).ready(function() {
    
    // A CONFIGURER !!!
    baseurl = "http://ogovm/discover/";
    
    // initialisation de la Map en SRS EPSG:900913
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: 'm'
    });

    // ajout d'une baselayer OSM
    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);

    // définition du style des points départ/arrivée
    // (style partagé grace à un context par les deux couches pointLayer1 et pointLayer2)
    var myStyles = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style({
            externalGraphic: "${getIcon}",
            strokeColor: "#FF0000",
            graphicHeight: 40,
            graphicYOffset: -43
        }, {
            context: {
                getIcon: function(feature) {
                    switch(feature.attributes.type){
                        case "1":
                            var img ='dot_1.png';
                            break;
                        case "2":
                            var img ='dot_2.png';
                            break;
                    }
                    //var img = (feature.attributes.type == '1') ? 'dot_1.png' : 'dot_2.png';
                    var path = 'assets/img/';
                    return path + img;
                }
            }
        })
    });

    // création des deux couches de saisie des points départ/arrivée
    pointLayer1 = new OpenLayers.Layer.Vector("Point Layer 1", {
        styleMap: myStyles
    });
    pointLayer2 = new OpenLayers.Layer.Vector("Point Layer 2", {
        styleMap: myStyles
    });

    // activation du controle de saisie de point (d'abord sur la couche de saisie du départ)
    control = new OpenLayers.Control.DrawFeature(pointLayer1, OpenLayers.Handler.Point);
    map.addControl(control);
    control.activate();

    // enregistrement d'un écouteur sur l'événement beforefeatureadded (avant insertion) :
    // - on vide la couche pointLayer1
    // - on vide la couche itinéraire (si une recherche d'itinéraire avait déjà été faite)
    // - on "tague" au passage l'entité qui sera ajoutée avec un attribut type de valeur 'start'
    pointLayer1.events.register('beforefeatureadded', control, function(e) {
        pointLayer1.removeAllFeatures();
        lineLayer.removeAllFeatures();
        e.feature.attributes.type = '1';
    });
    // idem, enregistrement d'un écouteur sur l'événement beforefeatureadded sur pointLayer2
    // (on vide les couches et on tague avec la valeur 'end')
    pointLayer2.events.register('beforefeatureadded', control, function(e) {
        pointLayer2.removeAllFeatures();
        lineLayer.removeAllFeatures();
        e.feature.attributes.type = '2';
    });
    
    // création de la couche pour accueillir le résultat du calcul d'itinéraire
    // (elle est vide au départ par l'utilisation d'un flux GeoJSON de taille 0)
    lineLayer = new OpenLayers.Layer.Vector("Roads", {
        protocol: new OpenLayers.Protocol.HTTP({
            url: baseurl + "assets/nofeature.json",
            format: new OpenLayers.Format.GeoJSON()
        }),
        projection: new OpenLayers.Projection("EPSG:4326"),
        strategies: [new OpenLayers.Strategy.Fixed()],
        styleMap: new OpenLayers.StyleMap({
            "default":new OpenLayers.Style({
                strokeWidth: "5"
            })
        })
    });

    // ajout de couches
    map.addLayers([pointLayer1, pointLayer2, lineLayer]);

    // centrage de la carte
    map.setCenter(new OpenLayers.LonLat(740663,5865507),12);    

    // fonction d'appel du service de recherche du noeud de réseau le plus proche du point saisie par l'utilisateur
    function point_suivant(e) {
        if(layerNum >= 5){
            layerNum++;
            control.layer = eval("pointLayer"+layerNum);
        }

    }
    pointLayer1.events.register('featureadded', control, point_suivant);
    pointLayer2.events.register('featureadded', control, point_suivant);


    /*$(document).on('click', '#point_selector .btn', function() {
        $(this).toggleClass('active');

        if ($(this).hasClass('start')) {
            $('#point_selector .btn.end').toggleClass('active');
            control.layer = pointLayer1;
        } else {
            $('#point_selector .btn.start').toggleClass('active');
            control.layer = pointLayer2;
        }
    });*/

   /* $(document).on('click', '#search', function() {
        if (pointLayer1.features.length == 1) {
            if (pointLayer2.features.length == 1) {
                if (pointLayer1.features[0].attributes.id && pointLayer2.features[0].attributes.id) {
                    
                    qs = jQuery.param({
                        start: pointLayer1.features[0].attributes.id,
                        end: pointLayer2.features[0].attributes.id
                    });

                    lineLayer.protocol.options.url = baseurl + "routing.php?" + qs;
                    lineLayer.refresh();

                } else {
                    alert("A point has not been encoded...");
                }
            } else {
                alert("You have to define a destination");
            }
        } else {
            alert("You have to define a start");
        }
    })*/
});