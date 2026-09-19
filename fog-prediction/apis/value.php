<?php
	$db_host = 'localhost';
	$db_name = 'fog';
	$db_user = 'local';
	$db_pass = 'password';
	$conn = new mysqli($db_host,$db_user,$db_pass,$db_name);
	if($conn->connect_error){
		printf("Connect failed: %s\n",$conn->connect_error);
		exit;
    }
    $sql = "SELECT * FROM datatest WHERE city_id = "  
    $result = $conn->query($sql);
    $val = "[";    
    $arr = array();
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $arr[] = $row;
        if(strlen($val)!=1)
          $val .= ',['.$row['timevalue'].','.$row['fog'].','.$row['temperature'].','.$row['humidity'].','.$row['wind'].','.$row['wind_direction'].']';
          else
          $val .= '['.$row['timevalue'].','.$row['fog'].','.$row['temperature'].','.$row['humidity'].','.$row['wind'].','.$row['wind_direction'].']';
      }
    }
    $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    echo $val;
?>