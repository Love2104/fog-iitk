<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "[]";  
 exit;  
}  
if($_GET['station']!='IIT Kanpur')
$sql = "SELECT max(date_time) FROM public.meteorological_data where station = (select station_id from public.location where station_name='".$_GET['station']."')";
else{
$sql= 'SELECT max(date_trunc('."'minute'".', "Time")) FROM public.visdata';

}
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
 exit;  
}  
$val = "[";    
    $arr = array();
      while($row = pg_fetch_row($result)) {
        if($_GET['station']!='IIT Kanpur'){
        $row[0] = strtotime($row[0])*1000;
        $val .= $row[0];
        }
        else{
          
          $ar=explode(':',$row[0]);
          if((int)$ar[1]>=30)
            $val.=strtotime($ar[0].':30:00')*1000;
          else
            $val.=strtotime($ar[0].':00:00')*1000;
        }
        }
    
    $val .= ']';
    echo $val;
?>  
