<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
$select = $_GET['select'];
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}
// echo $_GET['interval'];
if($select==1){
    $sql = " SELECT
    date_trunc('hour', date_time) AS date_time,
    (extract(minute FROM date_time)::int / 30) AS slot,
    avg(max_temp) as max_temp,
    avg(min_temp) as min_temp,
    avg(rain) as rain,
    avg(min_humidity) as min_humidity,
    avg(max_humidity) as max_humidity,
    avg(wind_speed) as wind_speed,
    avg(wind_direction) as wind_direction,
    avg(sunshine) as sunshine,
    avg(atmospheric_pressure) as atmospheric_pressure
    
    
    FROM ";

    
    if(isset($_GET['interval']) && $_GET['interval']){
        
        $sql.="public.aws_table where date_time>(Select ((date_time) - INTERVAL '".$_GET['interval']."') from public.aws_table order by date_time desc limit 1) and max_temp>-100
        GROUP BY 1,2 order by 1,2";
    }
    elseif(isset($_GET['start_date']) && isset($_GET['end_date']) && $_GET['start_date'] && $_GET['end_date']){
        
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
    $emparray = array();
    while($row =pg_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
    echo json_encode($emparray);
}
else if($select == 2){
    $sql = "SELECT *  FROM public.data where ".'data."Timestamp" >'.$_GET['stime']." order by ".'data."Timestamp" asc';
    // $sql="chaman";
    // echo $sql;
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;
}
$emparray = array();
while($row =pg_fetch_assoc($result))
{
    $emparray[] = $row;
}
echo json_encode($emparray);
}

?>