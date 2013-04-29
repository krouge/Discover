<?php
include('connection.php');

header('Content-Type: application/json');

if ($conn !== false) {

    $lat = $_REQUEST['lat'];
    $lon = $_REQUEST['lon'];

    if (is_numeric($lat) && is_numeric($lon)) {

        $query =" ????? ";

        $rs = pg_query($conn, $query);
        $result = pg_fetch_assoc($rs);

        if (isset($result['id']) && $result['id'] != -1) {
            echo '{"success": { "id": '.$result['id'].', "x": '.$result['x'].', "y": '.$result['y'].'}}';
        } else {
            echo '{"error": "No nearby points..."}';
        }

    } else {
        echo '{"error": "problem with lat or lon..."}';
    }
} else {
    echo '{"error": "No connexion with database..."}';
}