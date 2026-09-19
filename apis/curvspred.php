<?php  

function standard_deviation($aValues)
{
    $fMean = array_sum($aValues) / count($aValues);
    $fVariance = 0.0;
    foreach ($aValues as $i)
    {
        $fVariance += pow($i - $fMean, 2);
    }
    $fVariance /= count($aValues) ;
    $fStd=sqrt($fVariance);
    return array(((float) $fMean-$fStd)>0? ((float) $fMean-$fStd):0 , (float)$fMean, (float)$fMean+$fStd)  ;
}

$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
} 
$sql=""; 
if($_GET['status']==1){
  if($_GET['station']=='IIT Kanpur'){
    $sql = "select prediction_time,predicted_vis from fog_prediction_iitk where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";

  }
  else{
    $sql = "select prediction_time,predicted_vis from three_hour_fog_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
  }
}
else if($_GET['status']==0 ){
  if($_GET['station']=='IIT Kanpur'){
    // $sql='SELECT
    // extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time5,
    // (extract(minute FROM "Time")::int / 30) AS slot,
    // avg("MOR_avg") as MOR_avg FROM public.visdata 
    // where "Time" >='."'".$_GET['stime']."'".' and "Time" <='."'".$_GET['etime']."' group by 1,2 order by 1,2 ";
    $sql='SELECT  date_trunc('."'hour'".', "Time") AS Time5, (extract(minute FROM "Time")::int /5 ) AS slot , Avg("MOR_avg")
    FROM public.visdata where "Time" >='."'".$_GET['stime']."'".' and "Time" <='."'".$_GET['etime']."' group by 1,2 order by 1,2 ";
    //echo $sql;
  }
  else{
    $sql = "select date_time,visibility_miles from meteorological_data where station=(select station_id from location where station_name='".$_GET['station']."') and date_time >='".$_GET['stime']."' and date_time <='".$_GET['etime']."' order by date_time asc";
  }
  
}

else if($_GET['status']==2){
  $sql = "select prediction_time,visibility_km from six_hour_fog_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==3){
  $sql = "select prediction_time,visibility_km from prediction_rolling_mean where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==4){
  $sql = "select prediction_time,visibility_km from lgbm_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==5){
  $sql = "select prediction_time,visibility_km from ensemble_prediction where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==6){
  $sql = "select prediction_time,visibility_km from gbr_non_winter_month where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
}
else if($_GET['status']==8){
  //echo $sql;
}
else if($_GET['status']==7){
  $tables=array("three_hour_fog_prediction","lgbm_prediction","ensemble_prediction","gbr_non_winter_month");
  $arr = array();
  foreach ($tables as $val) {
    if($val!="three_hour_fog_prediction")
      $sql = "select prediction_time,visibility_km from ".$val." where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";
    else
      $sql = "select prediction_time,predicted_vis from ".$val." where station_name='".$_GET['station']."' and prediction_time <= '".$_GET['etime']."' and model_id=".$_GET['modelno']." order by prediction_time asc";

      $result = pg_query($conn, $sql);
    if (!$result) {  
    echo "error";
    exit;  
    }  
    
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        if($row[1] !== NULL){
          $row[0] = strtotime($row[0])*1000;
          //echo array_key_exists($row[0], $arr)." ". $arr." ".$row[0]." \n"; 
          if(array_key_exists($row[0], $arr)){
            array_push($arr[$row[0]],floatval($row[1]));
          }
          else
            $arr[$row[0]] = array(floatval($row[1]));
            
        }
      }
      
    }
  }
  $vals=array();
  foreach($arr as $x => $val) {
    // echo "$x = $val<br>";
    $stds=standard_deviation($val);
    array_push($vals,array($x,$stds[0],$stds[1],$stds[2]));


  }
  echo json_encode($vals);
  
  exit;
}

$result = pg_query($conn, $sql);
if (!$result) {  
 echo "error";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        //$row[0] = strtotime($row[0])*1000;
        $row[0] = ((int)strtotime($row[0]))*1000;
        if($_GET['station']=='IIT Kanpur' && $_GET['status']==0){
          // echo $row[0].",".$row[1].",".$row[2]."\n";
          
          
          //if((int)$row[1]==1)
          //echo $row[0];
          $row[0]=((int)$row[0])+(300000*((int)$row[1]));
          //echo $row[0];
          $row[1]=$row[2];
        }
       
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
    
?>  
