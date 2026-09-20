<?php
ini_set('display_errors', '0');
header('Content-Type: application/json');

$conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$data = [
    "timestamp" => null,
    "visibility" => null,
    "temperature" => null,
    "humidity" => null,
    "wind_speed" => null,
    "pressure" => null,
    "pm25" => null
];

// 1. VISIBILITY (from visdata)
$sql_vis = 'SELECT "Time", "MOR_instantaneous" FROM public.visdata ORDER BY "Time" DESC LIMIT 1';
$res_vis = pg_query($conn, $sql_vis);
if ($res_vis && pg_num_rows($res_vis) > 0) {
    $row = pg_fetch_assoc($res_vis);
    $data['timestamp'] = $row['Time']; // Use visdata as the primary timestamp indicator
    $data['visibility'] = $row['MOR_instantaneous'];
}

// 2. AWS (Temperature, Humidity, Wind, Pressure)
$sql_aws = 'SELECT date_time, max_temp, max_humidity, wind_speed, atmospheric_pressure FROM public.aws_table ORDER BY date_time DESC LIMIT 1';
$res_aws = pg_query($conn, $sql_aws);
if ($res_aws && pg_num_rows($res_aws) > 0) {
    $row = pg_fetch_assoc($res_aws);
    $data['temperature'] = $row['max_temp'];
    $data['humidity'] = $row['max_humidity'];
    $data['wind_speed'] = $row['wind_speed'];
    $data['pressure'] = $row['atmospheric_pressure'];
    if (!$data['timestamp']) $data['timestamp'] = $row['date_time'];
}

// 3. METDATA (PM2.5)
$sql_met = 'SELECT "PM_2.5" FROM public.metdata WHERE "PM_2.5" < 2000 ORDER BY "Time" DESC LIMIT 1';
$res_met = pg_query($conn, $sql_met);
if ($res_met && pg_num_rows($res_met) > 0) {
    $row = pg_fetch_assoc($res_met);
    $data['pm25'] = $row['PM_2.5'];
}

echo json_encode($data);
@pg_close($conn);
?>
