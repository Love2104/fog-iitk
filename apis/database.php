<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "[[],[]]";  
 exit;  
}  
$sql = "SELECT date_time,visibility_miles,air_temperature_fahrenheit,relative_humidity_percentage,wind_speed_knots,wind_direction_degrees  FROM public.meteorological_data where date_time > '2010-01-01 00:00:00' and station = (select station_id from public.location where station_name='".$_GET['station']."') order by date_time asc";
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
        
// $arr[] = $row;
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

    $sql = "SELECT date_time,rainfall  FROM public.rainfall_data where district = UPPER('".$_GET['station']."')  order by date_time asc;";
    $result = pg_query($conn, $sql);
    if (!$result) {  
     echo "An error occurred.\n";
     exit;  
    }  
    $val2 = "[";    
        $arr = array();
        if (pg_num_rows($result) > 0) {
          while($row = pg_fetch_row($result)) {
            
            $row[0] = strtotime($row[0])*1000;
            // $arr[] = $row;
            // echo $row;
            if($row[1]!=NULL){
              if(strlen($val2)!=1)
              $val2 .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).']';
            else
              $val2 .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).']';
          
            }
           }
        }
        $val2 .= ']';
    // echo $val;
    echo '['.$val.','.$val2.']';
?>  
