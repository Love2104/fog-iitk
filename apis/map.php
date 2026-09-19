<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
    $csvFile = __DIR__ . '/location_with_row&col.csv';
    if (file_exists($csvFile) && ($handle = fopen($csvFile, 'r')) !== FALSE) {
        fgetcsv($handle, 0, ',', '"', '\\'); // skip header
        $val = "[";
        while (($data = fgetcsv($handle, 0, ',', '"', '\\')) !== FALSE) {
            if (isset($data[0], $data[1], $data[6], $data[7])) {
                if (strlen($val) != 1) $val .= ',';
                $val .= '["' . addslashes(trim($data[1])) . '",' . floatval($data[6]) . ',' . floatval($data[7]) . ',"' . addslashes(trim($data[0])) . '"]';
            }
        }
        fclose($handle);
        $val .= ']';
        echo $val;
        exit;
    }
    echo "[]";
    exit;  
}  
$sql = "SELECT station_name,lat_lon[0],lat_lon[1],location.station_id FROM location,validity where location.station_id=validity.location_id and validity.status=1 order by station_name asc";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "[]";
 exit;  
}  
$val = "[";    
    $arr = array();
    if (pg_num_rows($result) > 0) {
      while($row = pg_fetch_row($result)) {
        $arr[] = $row;
        if(strlen($val)!=1)
          $val .= ',["'.($row[0]).'",'.($row[1]).','.($row[2]).',"'.($row[3]).'"]';
        else
          $val .= '["'.($row[0]).'",'.($row[1]).','.($row[2]).',"'.($row[3]).'"]';
      }
    }
    $val .= ']';
    echo $val;
?>  
