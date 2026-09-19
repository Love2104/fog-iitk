<?php  
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
if (!$conn) {  
    $city = $_GET['cityid'] ?? '';
    $csvFile = __DIR__ . '/location_with_row&col.csv';
    if (file_exists($csvFile) && ($handle = fopen($csvFile, 'r')) !== FALSE) {
        fgetcsv($handle, 0, ',', '"', '\\');
        while (($data = fgetcsv($handle, 0, ',', '"', '\\')) !== FALSE) {
            if (isset($data[1]) && strcasecmp(trim($data[1]), trim($city)) === 0) {
                echo json_encode(["lat" => (string)$data[6], "lng" => (string)$data[7]]);
                fclose($handle);
                exit;
            }
        }
        fclose($handle);
    }
    echo "[]";  
    exit;  
}   
$sql = "SELECT lat_lon[0] as lat,lat_lon[1] as lng FROM public.location where station_name='".$_GET['cityid']."'";
$result = pg_query($conn, $sql);
if (!$result) {  
 echo "[]";
 exit;  
} 
    $arr = pg_fetch_assoc($result);
    $JSON = json_encode($arr);
    echo $JSON;
?>  
