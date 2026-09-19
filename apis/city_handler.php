<?php
/**
 * Cities Handler API
 * 
 * This script acts as a wrapper to call demo.py and handle city/coordinate queries.
 * It accepts either a city name or latitude/longitude and returns city data with NPY indices.
 * 
 * Parameters:
 * - city: City name (string)
 * - lat: Latitude (float)
 * - lon: Longitude (float)
 */

header('Content-Type: application/json');

try {
    // Get parameters from request
    $city = isset($_POST['city']) ? trim($_POST['city']) : null;
    $lat = isset($_POST['lat']) ? floatval($_POST['lat']) : null;
    $lon = isset($_POST['lon']) ? floatval($_POST['lon']) : null;

    // Python executable path
    $python_path = '/data/yashp/fog-php/bin/python';
    
    // Path to demo.py
    $demo_py_path = __DIR__ . '/demo.py';

    // Validate inputs
    if (!$city && (!$lat || !$lon)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please provide either a city name or coordinates (lat, lon)'
        ]);
        exit;
    }

    // Build command based on input type
    if ($city) {
        // Query by city name
        $command = escapeshellcmd("$python_path $demo_py_path $city");
    } else {
        // Query by coordinates
        $command = escapeshellcmd("$python_path $demo_py_path $lat $lon");
    }

    // Execute demo.py and capture output
    $output = shell_exec($command . ' 2>&1');

    // Parse JSON output from demo.py
    if ($output) {
        // Remove any leading/trailing whitespace
        $output = trim($output);
        
        // Parse the JSON response
        $result = json_decode($output, true);

        if ($result === null) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid response from demo.py',
                'raw_output' => $output
            ]);
            exit;
        }

        // Check if result is an array
        if (is_array($result)) {
            // demo.py returns [name/null, lat, lon, row, col]
            $city_name = $result[0] ?? null;
            $latitude = $result[1] ?? null;
            $longitude = $result[2] ?? null;
            $row = intval($result[3] ?? 0);
            $col = intval($result[4] ?? 0);

            // Validate response data
            if ($row === 0 && $col === 0) {
                // Location is out of study range
                echo json_encode([
                    'success' => false,
                    'message' => 'Location is outside the study area',
                    'city' => $city_name,
                    'lat' => $latitude,
                    'lon' => $longitude
                ]);
                exit;
            }

            // Return success response with city data and NPY indices
            echo json_encode([
                'success' => true,
                'city' => $city_name ?? ($city ?? 'Location'),
                'lat' => floatval($latitude),
                'lon' => floatval($longitude),
                'row' => $row,
                'col' => $col
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Unexpected response format from demo.py'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to execute demo.py'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
