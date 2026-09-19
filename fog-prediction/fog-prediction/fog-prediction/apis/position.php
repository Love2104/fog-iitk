<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  
// $result = pg_query($conn, "SELECT date_time,visibility,air_temperature,relative_humidity,wind_speed,wind_direction FROM public.meteorological_data");  
$sql = "SELECT lat_lon[0] as lat,lat_lon[1] as lng FROM public.location where station_name='".$_GET['cityid']."'";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "[]";
 exit;  
} 
    $arr = pg_fetch_assoc($result);
    $JSON = json_encode($arr);
    echo $JSON;
    
?>  
