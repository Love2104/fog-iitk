<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
} 
$sql='SELECT date_time, "fog_Index", "fog_Index6h", "fog_Index1d", "fog_Index3d", "fog_Index5d"
FROM public.long_prediction1 order by date_time;'; 

$result = pg_query($conn, $sql);
if (!$result) {  
 echo "error";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        $row[0] = strtotime($row[0])*1000;
        
        if($_GET['station']=='IIT Kanpur'){
          // echo $row[0].",".$row[1].",".$row[2]."\n";
          
          
          // if($row[1]==1)
          //   $row[0]+=1800000;
          
          $row[1]=$row[2];
        }
        // $row[0] = strtotime($row[0])*1000;
        $arr[] = $row;
        // echo $row;
        if(strlen($val)!=1)
          
          $val .= ',['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).','.($row[3] === NULL ? 1.00 : $row[3]).','.($row[4] === NULL ? 1.00 : $row[4]).','.($row[5] === NULL ? 1.00 : $row[5]).']';
        else
          $val .= '['.($row[0]).','.($row[1] === NULL ? 1.00 : $row[1]).','.($row[2] === NULL ? 1.00 : $row[2]).','.($row[3] === NULL ? 1.00 : $row[3]).','.($row[4] === NULL ? 1.00 : $row[4]).','.($row[5] === NULL ? 1.00 : $row[5]).']';
        
      }
      $val .= ']';
      echo $val;
    }
    
?>  
