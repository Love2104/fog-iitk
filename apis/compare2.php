<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  
if($_GET['station']=='IIT Kanpur'){
 $sql=' SELECT *
FROM
(SELECT  date_trunc('."'hour'".', "Time") AS Time5, (extract(minute FROM "Time")::int /5 ) AS slot , 
Avg("MOR_avg") from public.visdata 
 group by 1,2 order by 1,2) as vis
Inner join
(Select date_trunc('."'hour'".', date_time) AS Time5,
        (extract(minute FROM date_time)::int / 30) AS slot,
        avg(max_temp) as max_temp,
        avg(min_temp) as min_temp,
        avg(min_humidity) as min_humidity,
        avg(max_humidity) as max_humidity,
        avg(wind_speed) as wind_speed,
        avg(wind_direction) as wind_direction
    FROM   public.aws_table where max_temp>-128  group by 1,2 order by 1,2) as aws 
on vis.Time5=aws.Time5 and vis.slot=aws.slot';
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = (strtotime($row[0])+$row[1]*1800)*1000;
        $arr[] = $row;
        if(strlen($val)!=1)
          $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[2] === NULL ? "null" : $row[2]).','.(($row[5] === NULL || $row[6]===NULL)? "null" : ((int)$row[5]+$row[6])/2).','.(($row[7] === NULL || $row[8]===NULL)? "null" : ($row[5]+$row[6])/2).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
        else
          $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[2] === NULL ? "null" : $row[2]).','.(($row[5] === NULL || $row[6]===NULL)? "null" : ($row[5]+$row[6])/2).','.(($row[7] === NULL || $row[8]===NULL)? "null" : ($row[5]+$row[6])/2).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
      }
      
    }
    $val .= ']';
    echo $val;

}
else{
$sql = "SELECT date_time,visibility_miles,air_temperature_fahrenheit,relative_humidity_percentage,wind_speed_knots,wind_direction_degrees  FROM public.meteorological_data where date_time > '2019-01-01 00:00:00' and station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[] = $row;
        if(strlen($val)!=1)
          $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).']';
        else
          $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).']';
      }
      
    }
    $val .= ']';
    echo $val;
}
?>  
