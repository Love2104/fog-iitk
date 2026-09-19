<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  
// $result = pg_query($conn, "SELECT date_time,visibility,air_temperature,relative_humidity,wind_speed,wind_direction FROM public.meteorological_data");  
$sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '".$_GET['model']."' order by prediction_time asc";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "";
 exit;  
}  
// echo pg_num_rows($result);
$arr = array();
if (pg_num_rows($result) > 0) {
    while($row = pg_fetch_row($result)) {
      $row[0] = strtotime($row[0])*1000;
      $arr[$row[0]] = $row;
    }
}
if($_GET['model']==4){  $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '425' order by prediction_time asc";
  $result = pg_query($conn, $sql);
  if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[$row[0]] = $row;
        
      }
  }
  $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '420' order by prediction_time asc";
  $result = pg_query($conn, $sql);
  if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[$row[0]] = $row;
        
      }
  }
  $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '415' order by prediction_time asc";
  $result = pg_query($conn, $sql);
  if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[$row[0]] = $row;
        
      }
  }
  $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '410' order by prediction_time asc";
  $result = pg_query($conn, $sql);
  if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[$row[0]] = $row;
        
      }
  }
  $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.three_hour_fog_prediction where prediction_time >= '".$_GET['stime']."' and station_name = '".$_GET['station']."' and model_id = '405' order by prediction_time asc";
  $result = pg_query($conn, $sql);
  if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[$row[0]] = $row;
        
      }
  }}
ksort($arr);


$val = "[";    
$i=1;

      foreach($arr as $x=>$row) {
        
        // $row[0] = strtotime($row[0])*1000;
        // $arr[] = $row;
        // echo $row;
        if($i!=1)
          $val .= ',['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 0 : $row[2]).']';
        else
          $val .= '['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).']';
        $i++;
      }
      $val .= ']';
      echo $val;
    // $JSON = json_encode($arr);
    // echo $JSON;
    
?>  
