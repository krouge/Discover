<?php

    define('APPLICATION_PATH',dirname(__FILE__) . '/');
    set_include_path(get_include_path().PATH_SEPARATOR.APPLICATION_PATH);
    
    require_once 'controlleur/ParcoursControlleur.php';
    require_once 'manager/ParcoursManager.php';
    
    if (isset($_GET['controlleur'])){
                    $nomControlleur = $_GET['controlleur'];
    }else{
                    $nomControlleur = "";
    }

    if (isset($_GET['action'])){
                    $action = $_GET['action'];
    }else{
                    $action = "";
    }
    
    $className = $nomControlleur.'Controlleur';
    $controlleur = new $className();
    $controlleur->$action();
    
?>
    
    