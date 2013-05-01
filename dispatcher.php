<?php

    define('APPLICATION_PATH',dirname(__FILE__) . '/');
    set_include_path(get_include_path().PATH_SEPARATOR.APPLICATION_PATH);
    
    require_once 'controlleur/ParcoursControlleur.php';
    require_once 'manager/ParcoursManager.php';
    
    if (isset($_REQUEST['controlleur'])){
                    $nomControlleur = $_REQUEST['controlleur'];
    }else{
                    $nomControlleur = "";
    }

    if (isset($_REQUEST['action'])){
                    $action = $_REQUEST['action'];
    }else{
                    $action = "";
    }
    
    $className = $nomControlleur.'Controlleur';
    $controlleur = new $className();
    $controlleur->$action();
    
    
?>
    
    