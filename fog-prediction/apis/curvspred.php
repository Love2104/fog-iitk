<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
} 
$sql=""; 
// $result = pg_query($conn, "SELECT date_time,visibility,air_temperature,relative_humidity,wind_speed,wind_direction FROM public.meteorological_data");  
if($_GET['status']==1){
  $sql = "select prediction_time,visibility_km from three_hour_fog_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==0){
  $sql = "select date_time,visibility_miles from meteorological_data where station=(select station_id from location where station_name='".$_GET['station']."') and date_time >='".$_GET['stime']."' and date_time <='".$_GET['etime']."' order by date_time asc";
}
else if($_GET['status']==2){
  $sql = "select prediction_time,visibility_km from six_hour_fog_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "[]";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[] = $row;
        // echo $row;
        if(strlen($val)!=1)
          $val .= ',['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).']';
        else
          $val .= '['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).']';
        
      }
      $val .= ']';
      echo $val;
    }
    // $JSON = json_encode($arr);
    // echo $JSON;
    
?>  
