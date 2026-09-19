<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}
$sql = 'SELECT "Time", extract(epoch from("Time")) as "Timestamp", "L1_Humidity", "L1_Temperature", "L2_Humidity", "L2_Temperature", "L3_Humidity", "L3_Temperature", "PM_1.0", "PM_2.5", "PM_4.0", "PM_10.0", "NC_0.5", "NC_1.0", "NC_2.5", "NC_4.0", "NC_10.0", "Battery Voltage"
FROM public.metdata order by "Time" asc';
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
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        
        // $arr[] = $row;
        // echo $row;
        if($row[1]!=NULL && $row[2]!=NULL && $row[3]!=NULL && $row[4]!=NULL && $row[5]!=NULL && $row[6]!=NULL && $row[7]!=NULL && $row[8]!=NULL && $row[9]!=NULL && $row[10]!=NULL && $row[11]!=NULL){
          if(strlen($val)!=1)
          $val .= ',['.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).','.($row[17] === NULL ? "null" : $row[17]).']';
        else
          $val .= '['.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).','.($row[5] === NULL ? "null" : $row[5]).','.($row[6] === NULL ? "null" : $row[6]).','.($row[7] === NULL ? "null" : $row[7]).','.($row[8] === NULL ? "null" : $row[8]).','.($row[9] === NULL ? "null" : $row[9]).','.($row[10] === NULL ? "null" : $row[10]).','.($row[11] === NULL ? "null" : $row[11]).','.($row[12] === NULL ? "null" : $row[12]).','.($row[13] === NULL ? "null" : $row[13]).','.($row[14] === NULL ? "null" : $row[14]).','.($row[15] === NULL ? "null" : $row[15]).','.($row[16] === NULL ? "null" : $row[16]).','.($row[17] === NULL ? "null" : $row[17]).']';
      
        }
       }
    }
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;
?>