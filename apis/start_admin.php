<?php 
    session_start();
    if(isset($_GET["isadmmin"]) )
    {
        if( $_GET["isadmmin"]=="777"){
            $_SESSION["admin"]=777;
        }
        else if($_GET["isadmmin"]=="333")
        {
            $_SESSION["admin"]=333;
        }
    }
    $admin = false;
    if(isset($_SESSION["admin"]))
    {
        if($_SESSION["admin"]==777){
            $admin=true;
        }
        elseif($_SESSION["admin"] == 333)
        {
            $admin=false;
        }
    }
?>