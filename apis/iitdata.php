<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
$select = $_GET['select'];
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}
// $sql;
// if($_GET['interval']!="ALL"){
//   $sql = 'SELECT
//   extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time30,
//   (extract(minute FROM "Time")::int / 30) AS slot,
//   avg("MOR_avg") as MOR_avg,
//   avg("MOR_instantaneous") as MOR_instantaneous,
//   avg("TEXCO") as TEXCO
//   FROM
//   public.visdata 
//   where "Time">(Select (("Time") - INTERVAL '."'".$_GET['interval']."'".') from public.visdata order by "Time" desc limit 1)
//   GROUP BY 1,2 order by 1,2';
// }
// else{
//     $sql = 'SELECT
//   extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time30,
//   (extract(minute FROM "Time")::int / 30) AS slot,
//   avg("MOR_avg") as MOR_avg,
//   avg("MOR_instantaneous") as MOR_instantaneous,
//   avg("TEXCO") as TEXCO
//   FROM
//   public.visdata 

//   GROUP BY 1,2 order by 1,2';}
    // $sql="chaman";
    // echo $sql;

$sql = 'SELECT
    extract(epoch from(date_trunc('."'hour'".', "Time"))) AS Time30,
    (extract(minute FROM "Time")::int / 30) AS slot,
    avg("MOR_avg") as MOR_avg

    FROM
    public.visdata ';

if($_GET['interval']){
  $sql .= '  
  where "Time">(Select (("Time") - INTERVAL '."'".$_GET['interval']."'".') from public.visdata order by "Time" desc limit 1)
  GROUP BY 1,2 order by 1,2;
  ';
}
elseif($_GET['start_date'] && $_GET['end_date']){
  $sql .= '  
  
  where "Time">='."'".$_GET['start_date']."'".' and "Time"<='."'".$_GET['end_date']."'".'
  GROUP BY 1,2 order by 1,2;

  ';
}

else{
  $sql .= '
  
  where "Time">(Select (("Time") - INTERVAL '."'1 DAY'".') from public.visdata order by "Time" desc limit 1)
  GROUP BY 1,2 order by 1,2;
  ';
}
// echo $sql;
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;
}
// where "Time">= '."'".$_GET['stime']."'".' and "Time"<= '."'".$_GET['etime']."'".'
// $emparray = array();
// while($row =pg_fetch_assoc($result))
// {
//     $emparray[] = $row;
// }
// echo json_encode($emparray);

$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        // $arr[] = $row;
        // echo $row;
        if($row[0]!=NULL && $row[2]!=NULL){
          if(strlen($val)!=1)
          $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).']';
        else
          $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).']';
      
        }
       }
    }
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;


?>