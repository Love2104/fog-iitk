<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// The legacy file establishes $conn but also prints its own API response.
// Buffer and discard that output so this endpoint returns one valid JSON body.
ob_start();
$previousErrorReporting = error_reporting();
error_reporting($previousErrorReporting & ~E_NOTICE);
require_once __DIR__ . '/database1.php';
error_reporting($previousErrorReporting);
ob_end_clean();
if (!isset($conn)) {
    http_response_code(503);
    echo json_encode(['error' => 'Database connection is unavailable']);
    exit;
}

function fail_response(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

function finite_number($value, string $field): float
{
    if ($value === null || !is_numeric($value)) {
        fail_response(503, "Latest observation is missing {$field}");
    }
    $number = (float) $value;
    if (is_nan($number) || is_infinite($number)) {
        fail_response(503, "Latest observation has invalid {$field}");
    }
    return $number;
}

function convert_observation(array $row): array
{
    $temperatureF = finite_number($row['air_temperature_fahrenheit'], 'temperature');
    $dewPointF = finite_number($row['dew_point_temperature_fahrenheit'], 'dew point');

    return [
        'tmpc' => ($temperatureF - 32.0) * 5.0 / 9.0,
        'dwpc' => ($dewPointF - 32.0) * 5.0 / 9.0,
        'relh' => finite_number($row['relative_humidity_percentage'], 'humidity'),
        'drct' => finite_number($row['wind_direction_degrees'], 'wind direction'),
        'wspeedkm' => finite_number($row['wind_speed_knots'], 'wind speed') * 1.852,
        'pressure' => finite_number($row['pressure_altimeter_inches'], 'pressure') / 0.00029530,
        'vsbykm' => finite_number($row['visibility_miles'], 'visibility') * 1.60934,
    ];
}

$station = isset($_GET['station']) ? trim((string) $_GET['station']) : 'VIKI';
if ($station === '' || strlen($station) > 20 || !preg_match('/^[A-Za-z0-9_-]+$/', $station)) {
    fail_response(400, 'Invalid station');
}

$sql = <<<'SQL'
SELECT date_time,
       visibility_miles,
       air_temperature_fahrenheit,
       dew_point_temperature_fahrenheit,
       relative_humidity_percentage,
       pressure_altimeter_inches,
       wind_speed_knots,
       wind_direction_degrees
FROM public.meteorological_data
WHERE station = $1
ORDER BY date_time DESC
LIMIT 3
SQL;

$result = pg_query_params($conn, $sql, [$station]);
if ($result === false) {
    fail_response(503, 'Unable to read current weather observations');
}

$rows = pg_fetch_all($result);
if ($rows === false || count($rows) < 3) {
    fail_response(503, 'Three recent observations are not available');
}

try {
    $currentTime = new DateTime($rows[0]['date_time']);
    $lag30Time = new DateTime($rows[1]['date_time']);
    $lag60Time = new DateTime($rows[2]['date_time']);
} catch (Exception $exception) {
    fail_response(503, 'Observation timestamps are invalid');
}

$observationAge = time() - $currentTime->getTimestamp();
if ($observationAge < -300) {
    fail_response(503, 'Latest observation timestamp is in the future');
}
if ($observationAge > 7200) {
    fail_response(503, 'Latest weather observation is older than two hours');
}

$observationMonth = (int) $currentTime->format('n');
if (!in_array($observationMonth, [11, 12, 1, 2], true)) {
    fail_response(422, 'This model is currently validated only for November through February');
}

$gap30 = $currentTime->getTimestamp() - $lag30Time->getTimestamp();
$gap60 = $lag30Time->getTimestamp() - $lag60Time->getTimestamp();
if (abs($gap30 - 1800) > 300 || abs($gap60 - 1800) > 300) {
    fail_response(503, 'Latest observations are not consecutive 30-minute records');
}

$payload = [
    'station' => $station,
    'timestamp' => $currentTime->format('Y-m-d\TH:i:s'),
    'current' => convert_observation($rows[0]),
    'lag30m' => convert_observation($rows[1]),
    'lag60m' => convert_observation($rows[2]),
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nConnection: close\r\n",
        'content' => json_encode($payload),
        'timeout' => 15,
        'ignore_errors' => true,
    ],
]);
$body = @file_get_contents('http://127.0.0.1:5001/predict', false, $context);
$status = 0;
if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
    $status = (int) $match[1];
}

if ($body === false || $status === 0) {
    fail_response(503, 'Prediction API is unavailable');
}
if ($status < 200 || $status >= 300) {
    error_log('Fog prediction API error response=' . $body);
    fail_response(502, 'Prediction API rejected the observation');
}

http_response_code(200);
echo $body;
