<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
$select = $_GET['select'];
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}

$sql = 'SELECT "Time",extract(epoch from("Time")) as "Timestamp", "MOR_avg", "MOR_instantaneous", "TEXCO" FROM public.visdata order by "Timestamp" asc';
    // $sql="chaman";
    //echo $sql;
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "An error occurred.\n";
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
        if($row[1]!=NULL && $row[2]!=NULL){
          if(strlen($val)!=1)
          $val .= ',['.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).']';
        else
          $val .= '['.($row[1] === NULL ? "null" : $row[1]).','.($row[2] === NULL ? "null" : $row[2]).','.($row[3] === NULL ? "null" : $row[3]).','.($row[4] === NULL ? "null" : $row[4]).']';
      
        }
       }
    }
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;


?>