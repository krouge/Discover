<?php
$json='{"parcours":[{"point":[{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"type":"1","enigme":"q1","reponses":["r1.1","r1.2"],"reponseJuste":1},"geometry":{"type":"Point","coordinates":[732293.14540394,5866558.0091388]}}]}]},{"point":[{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"type":"2","enigme":"q2","reponses":["r2.1","r2.2"],"reponseJuste":1},"geometry":{"type":"Point","coordinates":[738599.20023659,5867628.1275346]}}]}]}]} ';
$obj = json_decode($json, true);
foreach ($obj["parcours"] as $point){
   //print_r($point);
   //echo $point["point"][0]["features"][0]["geometry"]["coordinates"][0]." ";
}

foreach($point["point"][0]["features"]["0"]["properties"]["reponses"] as $reponse){
    echo $reponse;
}
?>
