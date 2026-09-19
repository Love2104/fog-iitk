<?php
   /* $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
    if (!$conn) {  
     echo "An error occurred.\n";  
     exit;  
    }   
    $sql = "SELECT lat_lon[0] as lat,lat_lon[1] as lng FROM public.location where station_name='".$_GET['address']."'";
    $result = pg_query($conn, $sql);
    if (!$result) {  
     echo "[]";
     exit;  
    } 
        $arr = pg_fetch_assoc($result);
        $JSON = json_encode($arr);
        echo $JSON;
    exit;*/ 
    $val = $_GET['address'];

    exec("python3 ../process/demo.py $val",$output);
    // $output=var_dump($output);
    echo $output[0]." ; ".$output[1]; 
    // echo $output[0]; 
?> 