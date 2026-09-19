<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  
// $result = pg_query($conn, "SELECT date_time,visibility,air_temperature,relative_humidity,wind_speed,wind_direction FROM public.meteorological_data");  
$sql = "SELECT station_name,lat_lon[0],lat_lon[1],location.station_id FROM location,validity where location.station_id=validity.location_id and validity.status=1 order by station_name asc";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        $arr[] = $row;
        // echo $row;
        if(strlen($val)!=1)
          $val .= ',["'.($row[0]).'",'.($row[1]).','.($row[2]).',"'.($row[3]).'"]';
        else
          $val .= '["'.($row[0]).'",'.($row[1]).','.($row[2]).',"'.($row[3]).'"]';
      }
    }
    $val .= ']';
    // $JSON = json_encode($val);
    // echo $JSON;
    echo $val;
?>  
