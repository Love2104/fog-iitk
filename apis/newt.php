<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  

$sql = "SELECT *  FROM public.feedback order by date_time desc";
$result = pg_query($conn, $sql);
while($row = pg_fetch_row($result)) {
    echo implode(",          ",$row)."<br><br>";
} 
?>
