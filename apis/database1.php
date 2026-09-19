<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "[];[]";  
 exit;  
}  
// $sql;
// $asach ="ALL";
// $interval=trim($_GET['interval']);
// echo($_GET['interval'])
// if($interval == $asach){
//   $sql = "SELECT date_time,visibility_miles,air_temperature_fahrenheit,relative_humidity_percentage,wind_speed_knots,wind_direction_degrees  FROM public.meteorological_data 
//   where date_time > '2010-01-01 00:00:00' station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";
// }
// else{

$sql = "SELECT date_time,visibility_miles,air_temperature_fahrenheit,relative_humidity_percentage,wind_speed_knots,wind_direction_degrees  FROM public.meteorological_data ";
if($_GET['interval']){
  $sql.="where date_time>(Select ((date_time) - INTERVAL '".$_GET['interval']."') from public.meteorological_data order by date_time desc limit 1) and station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";
}
elseif($_GET['start_date'] && $_GET['end_date']){
  
  $sql.="where date_time>='".$_GET['start_date']."' and date_time<='".$_GET['end_date']."' and station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";
  // echo $sql;
}
else{
  $sql.="where date_time>(Select ((date_time) - INTERVAL '1 DAY') from public.meteorological_data order by date_time desc limit 1) and station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";

}
// echo $sql;
// echo $_GET['start_date'] ;
// echo $_GET['end_date'];
// }
// if($interval == $asach){
// echo $sql;}
$result = pg_query($conn, $sql);
if (!$result) {  
 echo " error occurred.\n";
 exit;  
}

$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[] = $row;
        // echo $row;
        if($row[1]!=NULL && $row[2]!=NULL && $row[3]!=NULL){
          if(strlen($val)!=1)
          $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? 0 : $row[5]).']';
        else
          $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? 0 : $row[5]).']';
      
        }
       }
    }
    $val .= ']';

    $sql = "SELECT extract(epoch from(date_trunc('hour', date_time))) AS Time5,
    (extract(minute FROM date_time)::int /30 ) AS slot,
    sum(rainfall) as rainfall
    FROM
    public.rainfall_data
    where district = UPPER('".$_GET['station']."') ";
    if($_GET['interval']){
      $sql.=" and date_time>(Select ((date_time) - INTERVAL '".$_GET['interval']."') from public.rainfall_data order by date_time desc limit 1)
      GROUP BY 1 ,2 order by 1,2;";
    }
    elseif($_GET['start_date'] && $_GET['end_date']){
      $sql.=" and date_time>= '".$_GET['start_date']."' and date_time <= '".$_GET['end_date']."'
      GROUP BY 1 ,2 order by 1,2;";
    }
    else{
      $sql.=" and date_time>(Select ((date_time) - INTERVAL '1 DAY') from public.rainfall_data order by date_time desc limit 1)
      GROUP BY 1 ,2 order by 1,2;";
    }
    // echo $sql;
    $result = pg_query($conn, $sql);
    if (!$result) {  
     echo "An error occurred.\n";
     exit;  
    }  
    $val2 = "[";    
        $arr = array();
        if (pg_num_rows($result) > 0) {
          while($row = pg_fetch_row($result)) {
            
            // $row[0] = strtotime($row[0])*1000;
            $row[0] = ($row[0]+ $row[1]*1800)*1000;
            $arr[] = $row;
            // echo $row;
            if($row[2]!=NULL){
              if(strlen($val2)!=1)
              $val2 .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[2]).']';
            else
              $val2 .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[2]).']';
          
            }
           }
        }
        $val2 .= ']';
    // echo $val;
    echo $val.';'.$val2;
    // echo var_dump($interval,$asach);
?>  
