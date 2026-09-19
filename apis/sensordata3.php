<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {
    echo "[]";
    exit;  
}
if($_GET['select']==1){
  $sql = '  Select
  extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time5,
  (extract(minute FROM "Time")::int / 30) AS slot,
  avg("L1_Humidity") as L1_Humidity,
  avg("L1_Temperature") as L1_Temperature,
  avg("L2_Humidity") as L2_Humidity,
  avg("L2_Temperature") as L2_Temperature,
  avg("L3_Humidity") as L3_Humidity,
  avg("L3_Temperature") as L3_Temperature,
  avg("PM_1.0") as PM_1,
  avg("PM_2.5") as PM_2,
  avg("PM_4.0") as PM_4,
  avg("PM_10.0") as PM_10,
  avg("NC_0.5") as NC_0,
  avg("NC_1.0") as NC_1,
  avg("NC_2.5") as NC_2,
  avg("NC_4.0") as NC_4,
  avg("NC_10.0") as NC_10

  FROM';
if($_GET['interval']){
  $sql .= '
  public.metdata  
  where "Time">(Select (("Time") - INTERVAL '."'".$_GET['interval']."'".') from public.metdata order by "Time" desc limit 1) and "PM_2.5" is not NULL and "PM_2.5"<2000 and "NC_2.5" is not NULL and "NC_2.5"<6000 
  GROUP BY 1,2 order by 1,2;
  ';
}
elseif($_GET['start_date'] && $_GET['end_date']){
  $sql .= '  
  public.metdata  
  where Date("Time")>='."'".$_GET['start_date']."'".' and Date("Time")<='."'".$_GET['end_date']."'".' and "PM_2.5"<2000
  GROUP BY 1,2 order by 1,2;

  ';
}
else{
  $sql .= '
  public.metdata  
  where "Time">(Select (("Time") - INTERVAL '."'1 DAY'".') from public.metdata order by "Time" desc limit 1) and "PM_2.5"<2000
  GROUP BY 1,2 order by 1,2;
  ';
}
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "result error\n";
 exit;
}
// $emparray = array();
// while($row =pg_fetch_assoc($result))
// {
//     $emparray[] = $row;
// }
// echo json_encode($emparray);
$val = "[";    
    // $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        // $arr[] = $row;
        // echo $row;
        if($row[0]!=NULL && $row[1]!=NULL && $row[2]!=NULL){
          if(strlen($val)!=1)
          $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).']';
        else
          $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).']';
      
        }
       }
    }
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;

}
  elseif($_GET['select']==0 or $_GET['select']==4){

    $sql1 = '  SELECT
    extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time5,
    (extract(minute FROM "Time")::int / 30) AS slot,
    avg("MOR_avg") as MOR_avg,
    avg("MOR_instantaneous") as MOR_instantaneous,
    avg("TEXCO") as TEXCO

    FROM';
    if($_GET['interval']){
      $sql1.='
      public.visdata 
      where "Time">(Select (("Time") - INTERVAL '."'".$_GET['interval']."'".') from public.visdata order by "Time" desc limit 1)
      GROUP BY 1,2 order by 1,2

      ';
    }
    elseif($_GET['start_date'] && $_GET['end_date']){
      $sql1 .= '  
      public.visdata 
      where Date("Time")>='."'".$_GET['start_date']."'".' and Date("Time")<='."'".$_GET['end_date']."'".'
      GROUP BY 1,2 order by 1,2;
    
      ';
    }
    else{
      $sql1 .= '
      public.visdata
      where "Time">(Select (("Time") - INTERVAL '."'1 DAY'".') from public.visdata order by "Time" desc limit 1)
      GROUP BY 1,2 order by 1,2;
      ';
    }
    $result1 = pg_query($conn, $sql1);
    if (!$result1) {  
    echo "[]\n";
    exit;
    }
    // $emparray = array();
    // while($row =pg_fetch_assoc($result))
    // {
    //     $emparray[] = $row;
    // }
    // echo json_encode($emparray);
    $val1 = "[";    
      // $arr = array();
      if (pg_num_rows($result1) > 0) {
        while($row = pg_fetch_row($result1)) {
          
          // $arr[] = $row;
          // echo $row;
          if($row[0]!=NULL && $row[1]!=NULL){
            if(strlen($val1)!=1)
            $val1 .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).']';
          else
            $val1 .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).']';
        
          }
        }
      }
      $val1 .= ']';
      echo $val1;
    }
  elseif($_GET['select']==2){
    $sql = '  Select
    extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time5,
    (extract(minute FROM "Time")::int / 30) AS slot,
    avg("S_Moisture") as S_Moisture,
    avg("BECwTC") as BECwTC,
    avg("Temp_C") as Temp_C,
    avg("Temp_F") as Temp_F,
    avg("BEC") as BEC,
    avg("RDP_1") as RDP_1,
    avg("RDP_2") as RDP_2,
    avg("IDP_1") as IDP_1,
    avg("IDP_2") as IDP_2
    
    FROM';
    

    if($_GET['interval']){
      $sql.='
      public.hydraprobe
      where "Time">(Select (("Time") - INTERVAL '."'".$_GET['interval']."'".') from public.hydraprobe order by "Time" desc limit 1)
      GROUP BY 1,2 order by 1,2;
      
      ';
    }
    elseif($_GET['start_date'] && $_GET['end_date']){
      $sql .= '  
      public.hydraprobe 
      where Date("Time")>='."'".$_GET['start_date']."'".' and Date("Time")<='."'".$_GET['end_date']."'".'
      GROUP BY 1,2 order by 1,2;
    
      ';
    } 
    else{
      $sql .= '
      public.hydraprobe
      where "Time">(Select (("Time") - INTERVAL '."'1 DAY'".') from public.hydraprobe order by "Time" desc limit 1)
      GROUP BY 1,2 order by 1,2;
      ';
    }
    $result = pg_query($conn, $sql);
    if (!$result) {  
     echo "result error\n";
     exit;
    }
    // $emparray = array();
    // while($row =pg_fetch_assoc($result))
    // {
    //     $emparray[] = $row;
    // }
    // echo json_encode($emparray);
    $val = "[";    
        // $arr = array();
        if (pg_num_rows($result) > 0) {
          while($row = pg_fetch_row($result)) {
            
            // $arr[] = $row;
            // echo $row;
            if($row[0]!=NULL && $row[1]!=NULL && $row[2]!=NULL){
              if(strlen($val)!=1)
              $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
            else
              $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
          
            }
           }
        }
        $val .= ']';
        // $JSON = json_encode($arr);
        // echo $JSON;
        echo $val;
    
      }
      if($_GET['select']==4){
        $sql = " SELECT
        date_trunc('hour', date_time) AS date_time,
        (extract(minute FROM date_time)::int / 30) AS slot,
        avg(max_temp) as max_temp,
        avg(min_temp) as min_temp,
        sum(rain) as rain,
        avg(min_humidity) as min_humidity,
        avg(max_humidity) as max_humidity,
        avg(wind_speed) as wind_speed,
        avg(wind_direction) as wind_direction,
        avg(sunshine) as sunshine,
        avg(atmospheric_pressure) as atmospheric_pressure
        
        
        FROM ";
    
        
        if($_GET['interval']){
            
            $sql.="public.aws_table where date_time>(Select ((date_time) - INTERVAL '".$_GET['interval']."') from public.aws_table order by date_time desc limit 1) and max_temp>-100
            GROUP BY 1,2 order by 1,2";
        }
        elseif($_GET['start_date'] && $_GET['end_date']){
            
            $sql.="public.aws_table where Date(date_time) >= '".$_GET['start_date']."' and Date(date_time) <= '".$_GET['end_date']."' and max_temp>-100
            GROUP BY 1,2 order by 1,2";
            // echo $sql;
            
        }
        else{
            $sql.="public.aws_table where date_time>(Select ((date_time) - INTERVAL '1 DAY') from public.aws_table order by date_time desc limit 1) and max_temp>-100
            GROUP BY 1,2 order by 1,2";
        }
        // echo $sql;
       
        $result = pg_query($conn, $sql);
        if (!$result) {  
        echo "An error occurred.\n";
        exit;
        
        }
        $val = "[";    
        // $arr = array();
        if (pg_num_rows($result) > 0) {
          while($row = pg_fetch_row($result)) {
            
            // $arr[] = $row;
            // echo $row;
            if($row[0]!=NULL && $row[1]!=NULL && $row[2]!=NULL){
              $date = new DateTime($row[0]);
              $date=$date->format('U');
              // echo $row[7];
              //$difference_in_seconds = $date1->format('U') - $now->format('U');
              if(strlen($val)!=1)
              $val .= ',['.($date).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
            else
              $val .= '['.($date).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).']';
          
            }
           }
        }
        $val .= ']';
        // $JSON = json_encode($arr);
        // echo $JSON;
        echo ';'.$val;
      }
      
    // echo $val.';'.$val1;
?>