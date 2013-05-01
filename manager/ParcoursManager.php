<?php

class ParcoursManager{
    
    public function __construct() {
        
    }
    
    public function findByCanton(){
        $conn_string = "host=192.168.2.130 port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);
        
        $query ="SELECT * FROM Parcours";

        $rs = pg_query($conn, $query);
        
        $recu = array();
        
        while ($row = pg_fetch_assoc($rs)) {
            
            $canton=$row['canton'];
            
            $queryCanton = "SELECT nom FROM parcours WHERE canton = '$canton'";
            $rs2 = pg_query($conn, $queryCanton);
            
            $array = array();
            
            while ($row2 = pg_fetch_assoc($rs2)) {
               
                $tab['nom'] = $row2['nom'];
                array_push($array, $tab); 
                
            }

            $recu[$canton] = $array;
        }
        
        return $recu;
    }
    
    public function enregistrerParcours($nomParcours, $lieuParcours, $json){
        $conn_string = "host=ogovm port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);
        
        $queryParcours ="INSERT INTO parcours (nom, canton) VALUES ('".$nomParcours."','".$lieuParcours."')";
        pg_query($queryParcours);
        
        $idParcours = pg_fetch_result(pg_query("SELECT parcours_id FROM parcours order by parcours_id desc limit 1"),0,0);
        
        foreach ($json["parcours"] as $point){
            $queryEtape = "INSERT INTO etape (parcours_id,position) VALUES (".$idParcours.",ST_GeomFromText('POINT(".$point["point"][0]["features"]["0"]["geometry"]["coordinates"][0]." ".$point["point"][0]["features"]["0"]["geometry"]["coordinates"][1].")', 900913))";
            pg_query($queryEtape);
            $idEtape = pg_fetch_result(pg_query("SELECT etape_id FROM etape order by etape_id desc limit 1"),0,0);
            
            $queryEnigme = "INSERT INTO enigme (question, etape_id) VALUES ('".$point["point"][0]["features"]["0"]["properties"]["enigme"]."',".$idEtape.")";
            pg_query($queryEnigme);
            $idEnigme = pg_fetch_result(pg_query("SELECT enigme_id FROM enigme order by enigme_id desc limit 1"),0,0);
            
            $numReponse = 1;
            foreach($point["point"][0]["features"]["0"]["properties"]["reponses"] as $reponse){
                if($numReponse == $point["point"][0]["features"]["0"]["properties"]["reponseJuste"]){
                    $estCorrect ="TRUE";
                }else{
                    $estCorrect ="FALSE";
                }
                $queryReponse = "INSERT INTO reponse (enigme_id,reponse,estcorrect) VALUES (".$idEnigme.",'".$reponse."',".$estCorrect.")";
                pg_query($queryReponse);
                $numReponse++;
            }
            
        }
                
//         $latPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["geometry"]["coordinates"][0];
//          $lonPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["geometry"]["coordinates"][1];
//          $questionPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["enigme"];
//          $reponsesPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["reponses"];
//          $numReponseJuste = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["reponseJuste"];
        
    }
}

?>
