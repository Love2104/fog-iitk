<?php
ini_set('display_errors', '0');
$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {
    echo "[]";
    exit;
}

$sql = "SELECT station_name, lat_lon[0] as lat, lat_lon[1] as lon FROM public.location";
$result = pg_query($conn, $sql);

if (!$result) {
    echo "[]";
    exit;
}

$data = array();
while ($row = pg_fetch_assoc($result)) {
    $data[] = array($row['station_name'], (float)$row['lat'], (float)$row['lon']);
}

echo json_encode($data);
?>
