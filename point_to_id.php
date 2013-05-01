<?php

include('connection.php');

// definition du MIME-TYPE du contenu JSON
header('Content-Type: application/json');

if ($conn !== false) {

    $lat = $_REQUEST['lat'];
    $lon = $_REQUEST['lon'];

    if (is_numeric($lat) && is_numeric($lon)) {

        // composition de la requete permettant de récupérer l'id du noeud et sa position (x,y)
        $query ="SELECT id, x(the_geom), y(the_geom) ".
                "FROM vertices_tmp ".
                "WHERE id = (".
                "SELECT id(foo.x) as id".
                " FROM ( ".
                " SELECT find_node_by_nearest_link_within_distance( ".
                "'POINT(".$lon." ".$lat.")', ".     // attention, l'opérateur à besoin d'un point formalisé en WKT
                " 0.5, ".                           // on configure un rayon de recherche du point
                "'ways')::link_point as x ".
                ") AS foo)";

        $rs = pg_query($conn, $query);
        $result = pg_fetch_assoc($rs);

        // encodage du résultat
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

?>