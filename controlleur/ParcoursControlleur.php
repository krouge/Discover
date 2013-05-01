<?php

require_once 'dispatcher.php';
require_once 'manager/ParcoursManager.php';

class ParcoursControlleur{
    
    private $parcoursManager;
     
    public function __construct(){
         $this->parcoursManager = new ParcoursManager();
    }
    
    public function findByCanton(){ 
        
        $tab = $this->parcoursManager->findByCanton();  
        
        echo json_encode($tab);
        
    }




}

?>
