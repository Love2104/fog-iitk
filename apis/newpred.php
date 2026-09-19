<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {
    echo "[]";
    exit;
}
if($_GET['status']){
  $table="three_hour_fog_prediction";
}
else{
  $table="non_winter_month_vis_prediction";
}
// public.".$table."
// $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$_GET['model']."' order by prediction_time asc";
// $result = pg_query($conn, $sql);
// if (!$result) {  
//  echo "";
//  exit;  
// }
// $arr = array();
// if (pg_num_rows($result) > 0) {
//     while($row = pg_fetch_row($result)) {
//       $row[0] = strtotime($row[0])*1000;
//       $arr[$row[0]] = $row;
//     }
// }
// if($_GET['station']=="IIT Kanpur"){
//   echo $_GET['stime'];
// }
$arr = array();

if($_GET['model']==4){ 
  
  $mn=$_GET['model']; 
  $mods=[ "05","10","15","20","25","","60","60","60","60","60","60"];
  $start=strtotime('+30 minutes'.$_GET['stime']);
  // strtotime('+30 minutes',$start);
  $end=$start;
  foreach ($mods as $mod) {
    // echo $mod."\n";
    // echo date('Y-m-d H:i:s', $start).date('Y-m-d H:i:s', $end)."\n"; ".$table."
    if($_GET['station']=='IIT Kanpur')
      $sql = 'select date_trunc('."'hour'".', "prediction_time") AS Time5, (extract(minute FROM "prediction_time")::int / 30) AS slot, avg(predicted_vis) from fog_prediction_iitk  where prediction_time >='."'".date('Y-m-d H:i:s', $start)."' and prediction_time <= '".date('Y-m-d H:i:s', $end)."'  and model_id = ".$mn.$mod." group by 1,2 order by 1,2 asc";
    else
      $sql = "SELECT prediction_time,predicted_vis  FROM public.".$table." where prediction_time >= '".date('Y-m-d H:i:s', $start)."' and prediction_time <= '".date('Y-m-d H:i:s', $end)."' and station_name = '".$_GET['station']."' and model_id = ".$mn.$mod." order by prediction_time asc";
    $result = pg_query($conn, $sql);
    if (pg_num_rows($result) > 0) {
      if($_GET['station']=='IIT Kanpur'){
        while($row = pg_fetch_row($result)) {
          
          $row[0] = (strtotime($row[0])+1800*$row[1])*1000 ;
          

          // $arr[$row[0]] = $row;
          
          array_push($arr, [$row[0],$row[2]+0]);
          // echo json_encode($row);
          $start=strtotime('+30 minutes',$start);

          
        }

      }
      else{
        while($row = pg_fetch_row($result)) {
          
          $row[0] = strtotime($row[0])*1000;
          // $arr[$row[0]] = $row;
          
          array_push($arr, [$row[0],$row[1]+0]);
          // echo json_encode($row);
          $start=strtotime('+30 minutes',$start);

          
        }
      }
    }
    $end=strtotime('+30 minutes',$end);
    // $start->modify("+30 minutes");
    
  
  }
}
echo json_encode($arr);
    
//     $start->modify("+30 minutes");
//   }

//   exit();
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."60' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."25' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."20' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."15' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."10' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }
//   $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.".$table." where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."05' order by prediction_time asc";
//   $result = pg_query($conn, $sql);
//   if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0])*1000;
//         $arr[$row[0]] = $row;
        
//       }
//   }}
//   if($_GET['model']==6){ 
//     $mn=4; 
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."' order by prediction_time asc";
//       $result = pg_query($conn, $sql);
//       if (!$result) {  
//       echo "";
//       exit;  
//       }
//       $arr = array();
//       if (pg_num_rows($result) > 0) {
//           while($row = pg_fetch_row($result)) {
//             $row[0] = strtotime($row[0])*1000;
//             $arr[$row[0]] = $row;
//           }
//       }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."60' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."25' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."20' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."15' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."10' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
//     $sql = "SELECT prediction_time,visibility_km,fog_type  FROM public.prediction_rolling_mean where prediction_time >= '".$_GET['stime']."' and prediction_time <= '".$_GET['etime']."' and station_name = '".$_GET['station']."' and model_id = '".$mn."05' order by prediction_time asc";
//     $result = pg_query($conn, $sql);
//     if (pg_num_rows($result) > 0) {
//         while($row = pg_fetch_row($result)) {
          
//           $row[0] = strtotime($row[0])*1000;
//           $arr[$row[0]] = $row;
          
//         }
//     }
// ksort($arr);
// }
// echo json.encode(arr);
// $val = "[";    
// $i=1;

//       foreach($arr as $x=>$row) {
//         if($i!=1)
//           $val .= ',['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 0 : $row[2]).']';
//         else
//           $val .= '['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).']';
//         $i++;
//       }
//       $val .= ']';
//       echo $val;
  
?>  
