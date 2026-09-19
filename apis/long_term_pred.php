<?php  
// echo $_GET['select']==1;

$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}

$sql = '  SELECT date_time,"fog_Index"
FROM public.long_prediction1 order by date_time  ';
$sql1 = ' SELECT date_time, "fog_Index6h", "fog_Index12h", "fog_Index18h", "fog_Index1d", "fog_Index30h", "fog_Index36h", "fog_Index42h", "fog_Index2d", "fog_Index54h", "fog_Index60h", "fog_Index66h", "fog_Index3d", "fog_Index78h", "fog_Index84h", "fog_Index90h", "fog_Index4d", "fog_Index102h", "fog_Index108h", "fog_Index114h", "fog_Index5d"
FROM public.long_prediction1  order by date_time desc limit 1';
// if($_GET['interval']){
//   $sql .= 'public.long_prediction where "date_time">(Select (("date_time") - INTERVAL '."'".$_GET['interval']."'".') from public.long_prediction order by "date_time" desc limit 1) and station = (select station_id from public.location where station_name='."'".$_GET['station']."'".')  order by 1;
//   ';
// }
// elseif($_GET['start_date'] && $_GET['end_date']){
  
//   $sql .= '  
//   public.long_prediction 
//   where Date("date_time")>='."'".$_GET['start_date']."'".' and Date("date_time")<='."'".$_GET['end_date']."'".' and station = (select station_id from public.location where station_name='."'".$_GET['station']."'".') order by 1;

//   ';
// }
// else{
//   $sql .= '
//   public.long_prediction
//   where "date_time">(Select (("date_time") - INTERVAL '."'1 DAY'".') from public.long_prediction order by "date_time" desc limit 1) and station = (select station_id from public.location where station_name='."'".$_GET['station']."'".') order by 1 ;
//   ';
// }

$result = pg_query($conn, $sql);
if (!$result) {  
 echo " error occurred.\n";
 exit;  
}

$result1 = pg_query($conn, $sql1);
if (!$result1) {  
 echo " error occurred.\n";
 exit;  
}

// echo pg_fetch_row($result);  
// $result=pg_fetch_result($result);
// echo pg_fetch_row($result); 
// $emparray = array();
// while($row =pg_fetch_assoc($result))
// {
//     $emparray[] = $row;
// }
// echo json_encode($emparray);
// echo pg_fetch_array($result);
// $val = "["; 
$arr=array() ; 
$arr1=array() ;
    // $arr = array();
    // if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_array($result)) {
        $fog_index=(float)$row[1];
        $y=$row[1];
        if($y>0.05 && y<=2 ){
        $y=(float)$y;
        $y=-0.05*3/log(1-$y);
        }
        else if($y>2){
          $y=2;
        }
        else{
          continue;
          $y=0.1;
        }
        if($y>2){
          $y=2;
        }
        array_push($arr,array(strtotime($row[0])*1000+3600000,$y,$fog_index));
      }
      while($row = pg_fetch_array($result1)) {
        // echo count($row).' ';
        $row[0]=strtotime($row[0])*1000;
        for ($x = 1; $x <= count($row); $x++) {
          // echo $row[$x].', ';
          if($row[$x]!=null){
            $fog_index=(float)$row[$x];
            $y=$row[$x];
            if($y>0.05 && y<=2){
            $y=(float)$y;
            $y=-0.05*3/log(1-$y);
            }
            else if($y>2){
              $y=2;
            }
            else{
              continue;
              $y=0.1;
            }
            if($y>2){
              $y=2;
            }
            array_push($arr1,array($row[0]+3600000+$x*6*3600000,$y,$fog_index));
          }
        }
        // $arr[] = $row;
        // echo $row;
        // if($row[0]!=NULL && $row[1]!=NULL && $row[2]!=NULL){
        //   if(strlen($val)!=1)
        //   $val .= ',['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).']';
        // else
        //   $val .= '['.($row[0] === NULL ? "null" : $row[0]).','.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).']';
      
        // }
       }
    // }
    // $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    // echo x$val;
    // print_r($arr);
    echo json_encode(array($arr,$arr1));