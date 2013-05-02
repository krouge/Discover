<?php

require_once 'dispatcher.php';
require_once 'manager/ParcoursManager.php';

class ParcoursControlleur {

    private $parcoursManager;

    public function __construct() {
        $this->parcoursManager = new ParcoursManager();
    }

    public function findByCanton() {

        $tab = $this->parcoursManager->findByCanton();

        echo json_encode($tab);
    }

    public function enregistrerParcours() {
        $json = $_POST['json'];
        $obj = json_decode($json, true);

//        $json2 = '{"foo-bar": 12345}';
//
//        $obj = json_decode($json2);
//        echo $obj->{'foo-bar'};

        $this->parcoursManager->enregistrerParcours($_POST['nomParcours'], $_POST['lieuParcours'], $obj);
//          $latPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["geometry"]["coordinates"][0];
//          $lonPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["geometry"]["coordinates"][1];
//          $questionPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["enigme"];
//          $reponsesPoint1 = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["reponses"];
//          $numReponseJuste = $obj["parcours"][0]["point1"][0]["features"]["0"]["properties"]["reponseJuste"];
          
              //echo $latPoint1." - ".$lonPoint1." - ".$questionPoint1." - ".$reponsesPoint1." - ".$numReponseJuste." - ".$_POST['nomParcours']." - ".$_POST['lieuParcours'];
    }
    
    public function getAllParcours(){
        echo $this->parcoursManager->getAllParcours();
    }
    
    public function getParcours(){
        echo $this->parcoursManager->getParcours($_GET['id'],$_GET['numEtape']);
    }
    
    public function testPosition(){
        echo $this->parcoursManager->testPosition($_GET['lat'],$_GET['lon'],$_GET['latEtape'],$_GET['lonEtape']);
    }

}

?>
