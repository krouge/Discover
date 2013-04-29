var map, startPointLayer, endPointLayer, lineLayer, control;

$(document).ready(function() {
    // Init map
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: 'm'
    });

    // Add OSM layer
    var osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);

    // Set a style
    var myStyles = new OpenLayers.StyleMap({
        "default":new OpenLayers.Style({
            externalGraphic: "${getIcon}",
            strokeColor: "#FF0000",
            graphicHeight: 40,
            graphicYOffset: -43
        }, {
            context: {
                getIcon: function(feature) {
                    // Based on the attribute "type" of the current feature
                    // we can set dot_1.png or dot_2.png as external graphic
                    // ??
                }
            }
        })
    });

    // Init layers
    // @note: We simplify the logic by having two layers.
    //        - One will be used to store the start point
    //        - One will be used to store the end point
    //        They share the same style and use the context to render
    //        different graphic

    startPointLayer = new OpenLayers.Layer.Vector("Start Point Layer", {
        styleMap: myStyles
    });
    endPointLayer = new OpenLayers.Layer.Vector("Endp Point Layer", {
        styleMap: myStyles
    });

    // Enable a draw control
    // At the beginning the draw control works on the startPointLayer
    control = new OpenLayers.Control.DrawFeature(startPointLayer, OpenLayers.Handler.Point);
    map.addControl(control);
    control.activate();


    startPointLayer.events.register('beforefeatureadded', control, function(e) {
        e.feature.attributes.type = 'start';
        // ???
    });
    endPointLayer.events.register('beforefeatureadded', control, function(e) {
        e.feature.attributes.type = 'end';
        // ???
    });





    // Is the road layer
    lineLayer = new OpenLayers.Layer.Vector("Roads", {
        protocol: new OpenLayers.Protocol.HTTP({
            url: "assets/js/empty.json",
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


    map.addLayers([startPointLayer, endPointLayer, lineLayer]);

    // Center map
    map.setCenter(
        new OpenLayers.LonLat(740663.94355243,5865507.8656118),
        12
    );

    // Define the function called when a feature is added
    // on a "point layer"
    function correct_point(e) {
        $.ajax({
            url: 'point_to_id.php',
            data: {
                // ???
            },
            success: function(data, textStatus, jqXHR) {
                // ????
            },
            error: function(data) {
                e.object.removeAllFeatures();
                alert('Meh... Something failed...');
            }
        });
    }
    // Call the function correct_point on featureadded event
    endPointLayer.events.register('featureadded', control, correct_point);
    startPointLayer.events.register('featureadded', control, correct_point);

    // Toggle button and activate drawcontrol on correct layer
    $(document).on('click', '#point_selector .btn', function() {
        $(this).toggleClass('active');

        if ($(this).hasClass('start')) {
            $("#point_selector .btn.end").toggleClass('active');
            // ???
        } else {
            $("#point_selector .btn.start").toggleClass('active');
            // ???
        }
    });





    $(document).on('click', '#search', function() {
        if (startPointLayer.features.length == 1) {
            if (endPointLayer.features.length == 1) {
                if (startPointLayer.features[0].attributes.id &&
                    endPointLayer.features[0].attributes.id) {

                    // ????
                } else {
                    alert("A point has not been encoded...");
                }
            } else {
                alert("You have to define a destination");
            }
        } else {
            alert("You have to define a start");
        }
    });
});