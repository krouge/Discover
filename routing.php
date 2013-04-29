<?php
include('./connection.php');
include('./geojson.php');

// definition du MIME-TYPE du contenu GeoJSON
header('Content-Type: application/json');

if ($conn !== false) {

    $start = $_REQUEST['start'];
    $end = $_REQUEST['end'];

    if (is_numeric($start) && is_numeric($end)) {
        $query = "SELECT st_asgeojson(st_union(the_geom)) as geometry FROM ways where gid in (".
        "SELECT edge_id FROM shortest_path('".
        "    SELECT gid as id,".
        "        source::integer,".
        "        target::integer,".
        "        to_cost as cost,".
        "        reverse_cost".
        "        FROM ways',".
        "    ".$start.", ".
        "    ".$end.", ".
        "    false, ".
        "    false".
        ")".
        ");";

        $rs = pg_query($conn, $query);
        $result = pg_fetch_assoc($rs);
        
        //print_r($result);
        
        if (isset($result['geometry'])) {
            $fc = new FeatureCollection();
            $fc->addFeature(new Feature(0, json_decode($result['geometry']), array()));
            echo json_encode($fc);
        } else {
            echo '{"error": "No road found.."}';
        }


    } else {
        echo '{"error": "problem with start point id or end point id..."}';
    }
} else {
    echo '{"error": "No connexion with database..."}';
}


?>