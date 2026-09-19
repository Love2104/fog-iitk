<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  
// $result = pg_query($conn, "SELECT date_time,visibility,air_temperature,relative_humidity,wind_speed,wind_direction FROM public.meteorological_data");  
$sql = "SELECT max(date_time) FROM public.meteorological_data where station = (select station_id from public.location where station_name='".$_GET['station']."')";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;  
}  
$val = "[";    
    $arr = array();
      while($row = pg_fetch_row($result)) {
        $row[0] = strtotime($row[0])*1000;
        $val .= $row[0];
        }
    
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;
?>  
