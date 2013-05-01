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
}

?>
