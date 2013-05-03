var map, pointLayer1, pointLayer2, lineLayer, control, gpxLayer, baseurl, feature, geoJSONText;

var actualLayer = 1;
var nbrPoints = 0;

function addQuestion() {
    $(".enigmeContent").append('<span class="reponseContent"><div style="float:left; width:400px"><input type="text" name="rep1" id="rep1" /></div><div style="float:left; width:100px; text-align:center"><input type="radio" name="reponses" value="1"/></div></span>');

}
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
        "default": new OpenLayers.Style({
            externalGraphic: "${getIcon}",
            strokeColor: "#FF0000",
            graphicHeight: 40,
            graphicYOffset: -43
        }, {
            context: {
                getIcon: function(feature) {
                    switch (feature.attributes.type) {
                        case "1":
                            var img = 'dot_1.png';
                            break;
                        case "2":
                            var img = 'dot_2.png';
                            break;
                        case "3":
                            var img = 'dot_3.png';
                            break;
                        case "4":
                            var img = 'dot_4.png';
                            break;
                        case "5":
                            var img = 'dot_5.png';
                            break;
                    }
                    //var img = (feature.attributes.type == '1') ? 'dot_1.png' : 'dot_2.png';
                    var path = '../assets/img/';
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
    pointLayer3 = new OpenLayers.Layer.Vector("Point Layer 3", {
        styleMap: myStyles
    });
    pointLayer4 = new OpenLayers.Layer.Vector("Point Layer 4", {
        styleMap: myStyles
    });
    pointLayer5 = new OpenLayers.Layer.Vector("Point Layer 5", {
        styleMap: myStyles
    });

    // activation du controle de saisie de point (d'abord sur la couche de saisie du départ)
    control = new OpenLayers.Control.DrawFeature(pointLayer1, OpenLayers.Handler.Point);
    map.addControl(control);
    control.activate();

    /*selectControl = new OpenLayers.Control.SelectFeature(pointLayer1, {click: true});
     map.addControl(selectControl);
     selectControl.activate();*/

    // enregistrement d'un écouteur sur l'événement beforefeatureadded (avant insertion) :
    // - on vide la couche pointLayer1
    // - on vide la couche itinéraire (si une recherche d'itinéraire avait déjà été faite)
    // - on "tague" au passage l'entité qui sera ajoutée avec un attribut type de valeur 'start'
    pointLayer1.events.register('beforefeatureadded', control, function(e) {
        pointLayer1.removeAllFeatures();
        e.feature.attributes.type = '1';
    });

    // idem, enregistrement d'un écouteur sur l'événement beforefeatureadded sur pointLayer2
    // (on vide les couches et on tague avec la valeur 'end')
    pointLayer2.events.register('beforefeatureadded', control, function(e) {
        pointLayer2.removeAllFeatures();
        e.feature.attributes.type = '2';
    });
    pointLayer3.events.register('beforefeatureadded', control, function(e) {
        pointLayer3.removeAllFeatures();
        e.feature.attributes.type = '3';
    });
    pointLayer4.events.register('beforefeatureadded', control, function(e) {
        pointLayer4.removeAllFeatures();
        e.feature.attributes.type = '4';
    });
    pointLayer5.events.register('beforefeatureadded', control, function(e) {
        pointLayer5.removeAllFeatures();
        e.feature.attributes.type = '5';
    });

    pointLayer1.events.register('featureadded', control, point_suivant);
    pointLayer1.events.register("featureadded", control, onFeatureAdd);
    pointLayer1.events.register("featureunselected", control, onFeatureUnselect);

    pointLayer2.events.register('featureadded', control, point_suivant);
    pointLayer2.events.register("featureadded", control, onFeatureAdd);
    pointLayer2.events.register("featureunselected", control, onFeatureUnselect);

    pointLayer3.events.register('featureadded', control, point_suivant);
    pointLayer3.events.register("featureadded", control, onFeatureAdd);
    pointLayer3.events.register("featureunselected", control, onFeatureUnselect);

    pointLayer4.events.register('featureadded', control, point_suivant);
    pointLayer4.events.register("featureadded", control, onFeatureAdd);
    pointLayer4.events.register("featureunselected", control, onFeatureUnselect);

    pointLayer5.events.register('featureadded', control, point_suivant);
    pointLayer5.events.register("featureadded", control, onFeatureAdd);
    pointLayer5.events.register("featureunselected", control, onFeatureUnselect);


    // ajout de couches
    map.addLayers([pointLayer1, pointLayer2, pointLayer3, pointLayer4, pointLayer5]);

    // centrage de la carte
    map.setCenter(new OpenLayers.LonLat(740663, 5865507), 12);

    // fonction appelée lorsqu'on ajoute un point
    function point_suivant(e) {
        if (map.popups.length != 0) {
            onPopupClose();
        }
        console.log(nbrPoints);
        if (nbrPoints < 5 && $(".content." + actualLayer).length == 0) {
            $("#etapes").append('<div class="content ' + actualLayer + '"><img src="../assets/img/dot_' + actualLayer + '.png" /> <a href="#" class="replace" name="' + actualLayer + '">replacer</a> - <a href="#" class="edit" name="' + actualLayer + '">modifier les infos</a></div></span>');
            if (actualLayer < 5) {
                console.log("set layer suivant");
                control.layer = eval("pointLayer" + (actualLayer + 1));
            }
            if (actualLayer == 1) {
                $("#remove").css("visibility", "visible");
                $("#save").css("visibility", "visible");
            }
            actualLayer++;
        }
        if (nbrPoints < 5) {
            nbrPoints++;
        }

    }

    // Editer les informations de l'étape
    $(document).on('click', '.edit', function() {
        if (map.popups.length != 0) {
            map.removePopup(map.popups[0]);
        }

        //************** Problème ici **************//
        control.layer = eval("pointLayer" + ($(this).attr("name")));
        console.log("Layer sous controle: pointLayer" + ($(this).attr("name")));
        //************** Problème ici **************//

        newPopup(eval("pointLayer" + ($(this).attr("name"))).features[0]);
    });

    // Déplacer l'étape
    $(document).on('click', '.replace', function() {
        if (map.popups.length != 0) {
            map.removePopup(map.popups[0]);
        }
        actualLayer = ($(this).attr("name"));
        control.layer = eval("pointLayer" + ($(this).attr("name")));
    });

    // Supprimer la dernière étape
    $("#remove").click(function() {
        if (map.popups.length != 0) {
            map.removePopup(map.popups[0]);
        }
        eval("pointLayer" + nbrPoints).removeAllFeatures();
        //console.log("pointLayer" + nbrPoints);
        $(".content." + nbrPoints).remove();
        control.layer = eval("pointLayer" + nbrPoints);
        if (nbrPoints == 1) {
            $("#remove").css("visibility", "hidden");
            $("#save").css("visibility", "hidden");
        }
        nbrPoints--;
        actualLayer--;
    });

    // Ouvre la popup
    function newPopup(feature) {
        var affichageReponses = new Array();
        var checked;
        if (feature.attributes.reponses != null) {
            for (var i = 0; i < feature.attributes.reponses.length; i++) {
                if (feature.attributes.reponseJuste == (i + 1)) {
                    checked = "checked";
                } else {
                    checked = "";
                }
                affichageReponses += '<span class="reponseContent"><div style="float:left; width:400px"><input type="text" name="rep1" id="rep1" value="' + feature.attributes.reponses[i] + '" /></div><div style="float:left; width:100px; text-align:center"><input type="radio" name="reponses" value="1" ' + checked + '/></div></span>';
                if (i == 0) {
                    affichageReponses += '<a href="#" class="addQuestion" onclick="addQuestion();"><img src="../assets/img/add.png" /></a></span>';
                }
            }
        } else {
            affichageReponses = '<span class="reponseContent"><div style="float:left; width:400px"><input type="text" name="rep1" id="rep1" /></div><div style="float:left; width:100px; text-align:center"><input type="radio" name="reponses" value="1"/></div></div><a href="#" class="addQuestion" onclick="addQuestion();"><img src="../assets/img/add.png" /></a></span>';
        }
        //affichageReponses += '</div>';
        popup = new OpenLayers.Popup.AnchoredBubble("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(550, 250),
                '<div class="enigmeContent"><label for="enigme">Enigme</label><textarea name="enigme" class="enigme" cols="50">' + feature.attributes.enigme + '</textarea><br/>' +
                '<div style="float:left; width:400px">Reponses</div><div style="float:left; width:100px; text-align:center">Correcte</div><br/>' +
                affichageReponses,
                null,
                true,
                onPopupClose
                );

        feature.popup = popup;
        popup.feature = feature;
        map.addPopup(popup);
    }

    // Ferme la popup
    function onPopupClose(evt) {
        // 'this' is the popup.
        var reponses = new Array();
        var reponseJuste;
        var i = 0;
        popup.feature.attributes["enigme"] = $(".enigme").val();
        $('.reponseContent').each(function() {
            reponses[i] = $('input[type="text"]', this).val();
            //console.log($('input[type="radio"]',this).val());
            if ($('input[type="radio"]', this).is(':checked')) {
                reponseJuste = (i + 1);
            }
            i++;
        });
        popup.feature.attributes["reponses"] = reponses;
        popup.feature.attributes["reponseJuste"] = reponseJuste;
        //console.log(reponses);
        console.log(pointLayer1.features);
        //popup.feature = null;
        map.removePopup(popup);
    }

    function onFeatureAdd(evt) {
        feature = evt.feature;
        newPopup(feature);
    }

    function onFeatureUnselect(evt) {
        alert("test");
        feature = evt.feature;
        if (feature.popup) {
            popup.feature = null;
            map.removePopup(feature.popup);
            //feature.popup.destroy();
            //feature.popup = null;
        }
    }
    $(document).on('click', '.addQuestion', function() {
        alert("test");
        $(".enigmeContent").append('<div style="float:left; width:400px"><input type="text" name="rep1" id="rep1" /></div><div style="float:left; width:100px; text-align:center"><input type="radio" /></div><img src="../assets/img/add.png" />');

    });


    $("#save").click(function() {
        $("#saveBox").css("visibility", "visible");
        $("#saveContent").css("visibility", "visible");
        var geoJSON = new OpenLayers.Format.GeoJSON();
        var text = '{"parcours":[';
        geoJSONText = text;
        geoJSONText += '{"point":[';
        geoJSONText += geoJSON.write(pointLayer1.features);
        geoJSONText += ']}'
        if (pointLayer2.features != "") {
            geoJSONText += ',{"point":[';
            geoJSONText += geoJSON.write(pointLayer2.features);
            geoJSONText += ']}'
        }
        if (pointLayer3.features != "") {
            geoJSONText += ',{"point":[';
            geoJSONText += geoJSON.write(pointLayer3.features);
            geoJSONText += ']}'
        }
        if (pointLayer4.features != "") {
            geoJSONText += ',{"point":[';
            geoJSONText += geoJSON.write(pointLayer4.features);
            geoJSONText += ']}'
        }
        if (pointLayer5.features != "") {
            geoJSONText += ',{"point":[';
            geoJSONText += geoJSON.write(pointLayer5.features);
            geoJSONText += ']}'
        }
        geoJSONText += ']}';

        console.log(geoJSONText);
    });

    $("#annuler").click(function() {
        $("#saveBox").css("visibility", "hidden");
        $("#saveContent").css("visibility", "hidden");
    });

    $("#ajouter").click(function() {
        if($("#nomParcours").val() == ""){
            alert("Vous devez entrer un nom de parcours");
        }else{
            $.post("dispatcher.php",
                    {
                        controlleur: "Parcours",
                        action: "enregistrerParcours",
                        json: geoJSONText,
                        nomParcours: $("#nomParcours").val(),
                        lieuParcours: $("#lieuParcours").val()
                    },
            function(data) {
                console.log(data);
            });
        }
    });
});