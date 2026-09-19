<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
} 
$sql=""; 
if($_GET['status']==0){
    $sql = "Select date_time,visibility_miles from public.meteorological_data where station=(select station_id from public.location where station_name='".$_GET['station']."') and date_time >='".$_GET['stime']."' and date_time <='".$_GET['etime']."' order by date_time asc;";
    $result = pg_query($conn, $sql);
    if (!$result) {  
    echo "[]";
    exit;  
    }  
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
            
            $row[0] = strtotime($row[0])*1000;
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
}
else{
  $sql = "SELECT date_time, vis1, vis2, vis3, vis4, vis5, vis6, vis7, vis8, vis9, vis10, vis11, vis12
  FROM public.lstm_vis order by date_time asc";

$result = pg_query($conn, $sql);
if (!$result) {  
 echo "[]";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        $row[0] = strtotime($row[0])*1000;
        $arr[] = $row;
        // echo $row;
        if(strlen($val)!=1)
          $val .= ',['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).','.($row[3] === NULL ? 1.00 : $row[3]).','.($row[4] === NULL ? 1.00 : $row[4]).','.($row[5] === NULL ? 1.00 : $row[5]).','.($row[6] === NULL ? 1.00 : $row[6]).','.($row[7] === NULL ? 1.00 : $row[7]).','.($row[8] === NULL ? 1.00 : $row[8]).','.($row[9] === NULL ? 1.00 : $row[9]).','.($row[10] === NULL ? 1.00 : $row[10]).','.($row[11] === NULL ? 1.00 : $row[11]).','.($row[12] === NULL ? 1.00 : $row[12]).']';
        else
          $val .= '['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).','.($row[3] === NULL ? 1.00 : $row[3]).','.($row[4] === NULL ? 1.00 : $row[4]).','.($row[5] === NULL ? 1.00 : $row[5]).','.($row[6] === NULL ? 1.00 : $row[6]).','.($row[7] === NULL ? 1.00 : $row[7]).','.($row[8] === NULL ? 1.00 : $row[8]).','.($row[9] === NULL ? 1.00 : $row[9]).','.($row[10] === NULL ? 1.00 : $row[10]).','.($row[11] === NULL ? 1.00 : $row[11]).','.($row[12] === NULL ? 1.00 : $row[12]).']';
        
      }
      $val .= ']';
      echo $val;
    }
} 
?>  
