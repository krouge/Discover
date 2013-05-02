<?php

class FeatureCollection
{
	var $type;
	var $features;
	
	function FeatureCollection()
	{
		$this->type = "FeatureCollection";
		$this->features = array();
	}
	
	function addFeature($feature) {
		array_push($this->features,$feature);
	} 
}

class Feature
{
	var $type;
	var $geometry;
	var $id;
	var $properties;
	
	function Feature($id,$geom,$properties) {
		$this->type = "Feature";
		$this->geometry = $geom;
		$this->id = $id;
		$this->properties = $properties;
	}
}

class ParcoursManager {

    public function __construct() {
        
    }

    public function findByCanton() {
        $conn_string = "host=192.168.2.130 port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);

        $query = "SELECT * FROM Parcours";

        $rs = pg_query($conn, $query);

        $recu = array();

        while ($row = pg_fetch_assoc($rs)) {

            $canton = $row['canton'];

            $queryCanton = "SELECT nom,parcours_id FROM parcours WHERE canton = '$canton'";
            $rs2 = pg_query($conn, $queryCanton);

            $array = array();

            while ($row2 = pg_fetch_assoc($rs2)) {

                $tab['nom'] = $row2['nom'];
                $tab['parcours_id'] = $row2['parcours_id'];
                
                array_push($array, $tab);
            }

            $recu[$canton] = $array;
        }

        return $recu;
    }

    public function enregistrerParcours($nomParcours, $lieuParcours, $json) {
        $conn_string = "host=ogovm port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);

        $queryParcours = "INSERT INTO parcours (nom, canton) VALUES ('" . $nomParcours . "','" . $lieuParcours . "')";
        pg_query($queryParcours);

        $idParcours = pg_fetch_result(pg_query("SELECT parcours_id FROM parcours order by parcours_id desc limit 1"), 0, 0);

        foreach ($json["parcours"] as $point) {
            $queryEtape = "INSERT INTO etape (parcours_id,position) VALUES (" . $idParcours . ",ST_GeomFromText('POINT(" . $point["point"][0]["features"]["0"]["geometry"]["coordinates"][0] . " " . $point["point"][0]["features"]["0"]["geometry"]["coordinates"][1] . ")', 900913))";
            pg_query($queryEtape);
            $idEtape = pg_fetch_result(pg_query("SELECT etape_id FROM etape order by etape_id desc limit 1"), 0, 0);

            $queryEnigme = "INSERT INTO enigme (question, etape_id) VALUES ('" . $point["point"][0]["features"]["0"]["properties"]["enigme"] . "'," . $idEtape . ")";
            pg_query($queryEnigme);
            $idEnigme = pg_fetch_result(pg_query("SELECT enigme_id FROM enigme order by enigme_id desc limit 1"), 0, 0);

            $numReponse = 1;
            foreach ($point["point"][0]["features"]["0"]["properties"]["reponses"] as $reponse) {
                if ($numReponse == $point["point"][0]["features"]["0"]["properties"]["reponseJuste"]) {
                    $estCorrect = "TRUE";
                } else {
                    $estCorrect = "FALSE";
                }
                $queryReponse = "INSERT INTO reponse (enigme_id,reponse,estcorrect) VALUES (" . $idEnigme . ",'" . $reponse . "'," . $estCorrect . ")";
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

    public function getAllParcours() {
        $conn_string = "host=ogovm port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);

        $query = "select distinct on (parcours.parcours_id) parcours.parcours_id, parcours.nom, parcours.canton, (SELECT count(etape_id) from etape where parcours_id = parcours.parcours_id) as nbr_etapes ,ST_AsGeoJSON(position), etape_id from etape inner join parcours on etape.parcours_id =parcours.parcours_id order by parcours.parcours_id";  // essayez avec 'Africa'
        $result = pg_query($conn, $query);

        if (!$result) {
            echo "Oups!!! " . pg_last_error($conn);
            exit;
        }

        $fc = new FeatureCollection();
        while ($row = pg_fetch_row($result)) {
            $fc->addFeature(new Feature($row[1], json_decode($row[4]),array("nom"=>$row[1],"canton"=>$row[2],"nbrEtapes"=>$row[3])));
        }

        return json_encode($fc);
    }
    
    public function getParcours($id,$numEtape) {
        $conn_string = "host=ogovm port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);

        $query = "select etape.etape_id, enigme_id, question, ST_AsGeoJSON(position) from etape inner join enigme on etape.etape_id = enigme.etape_id where parcours_id = ".$id."limit 1 offset ".($numEtape - 1);  // essayez avec 'Africa'
        $result = pg_query($conn, $query);

        if (!$result) {
            echo "Oups!!! " . pg_last_error($conn);
            exit;
        }
        $reponses = array();
        $fc = new FeatureCollection();
        while($row = pg_fetch_row($result)){
            $queryReponse="select reponse, estcorrect from reponse where enigme_id =".$row[1];
            $resultReponse = pg_query($conn, $queryReponse);
            while($rowReponse = pg_fetch_row($resultReponse)){
                $reponse = array("reponse"=>$rowReponse[0],"estCorrect"=>$rowReponse[1]);
                array_push($reponses,$reponse);
            }
            $fc->addFeature(new Feature($row[0], json_decode($row[3]),array("question"=>$row[2],"reponses"=>$reponses)));
        }
        return json_encode($fc);
    }
    
    public function testPosition($lat,$lon){
        $conn_string = "host=ogovm port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
        $conn = pg_connect($conn_string);
        
        $query="select ST_Distance(ST_GeomFromText('POINT ".$lat." ".$lon."'),".$posEtape.")";
        $distance = pg_fetch_result($query);
        
        if($distance <= 550){
            return true;
        }else{
            return false;
        }
    }

}

?>
