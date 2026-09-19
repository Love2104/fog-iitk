<?php
$servername = "localhost";
$username = "chaman";
$password = "chaman123";
$dbname = "fogprediction";

$conn = pg_connect("host=".$servername." dbname=".$dbname." user=".$username." password=".$password);

$stmt = pg_query($conn,"SELECT * FROM meteorological_data where station='VILK' and date_time>='2010-01-01' and date_time<=now()"); 
//$stmt->execute();

$filename = 'test_postgres.csv';

header('Content-type: application/csv');
header('Content-Disposition: attachment; filename=' . $filename);
header("Content-Transfer-Encoding: UTF-8");

//$head = fopen($filename, 'w');

//$headers = pg_fetch_row($stmt);
//fputcsv($head, array_keys($headers));

//fclose($head);

$data = fopen($filename, 'w');
//fputcsv($data,array_keys($headers));
$val=""  
while ($row = pg_fetch_row($stmt)) {
	for($i=0;$i<sizeof($row)-1;$i++){
		$val .= "".$row[i].",";	
			//
			}
	  // fputcsv($data, $row);
	$val .= "".$row[28]."\n";

    }
echo $val;
fclose($data);

?>

