<?php
include('connection.php');

header('Content-Type: application/json');

if ($conn !== false) {

    $start = $_REQUEST['start'];
    $end = $_REQUEST['end'];

    if (is_numeric($start) && is_numeric($end)) {

        $query = "???";

        $rs = pg_query($conn, $query);
        $result = pg_fetch_assoc($rs);

        if (isset($result['geometry'])) {
            // Generate and return geojson
            // ???

        } else {
            echo '{"error": "No road found.."}';
        }


    } else {
        echo '{"error": "Problem with start point id or end point id..."}';
    }
} else {
    echo '{"error": "No connexion with database..."}';
}