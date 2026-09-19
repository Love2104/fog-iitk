<?php
session_start();
$python_script_path = 'demo.py';
$city = isset($_POST['city']) ? $_POST['city'] : null;
$long = isset($_POST['long']) ? $_POST['long'] : null;
$lat = isset($_POST['lat']) ? $_POST['lat'] : null;
$img_fog_unc= array();
try{
    if($lat!=null && $long!=null ){
        $command = escapeshellcmd("  /data/yashp/fog-php/bin/python $python_script_path $lat $long ");
        $output=shell_exec($command);
        $output=json_decode($output);
        if(is_array($output) && count($output)>2){
            $img_fog_unc[]=$output;
        }
        // else
        //     $img_fog_unc[]='null';
    }
    
    
}
catch (Exception $e) {
    //echo $e;
    //echo 'null';
    ;
}
try{
    if($city!=null){
        $command = escapeshellcmd("  /data/yashp/fog-php/bin/python $python_script_path ".'"'.$city.'" ');
        $output=shell_exec($command);
        $output=json_decode($output);
        if(is_array($output) && count($output)>2){
            $img_fog_unc[]=$output;
        }

    //     $encodedCity = urlencode($city);

    // // Nominatim API endpoint URL
    //     $apiUrl = "https://nominatim.openstreetmap.org/search?format=json&q={$encodedCity}";

    //     // Initialize curl session
    //     $curl = curl_init();

    //     // Set curl options
    //     curl_setopt_array($curl, [
    //         CURLOPT_URL => $apiUrl,
    //         CURLOPT_RETURNTRANSFER => true, // Return the response as a string
    //         CURLOPT_HTTPHEADER => [
    //             'User-Agent: megh_varta', // Set the User-Agent header
    //             'Content-Type: application/json' // Optional: Set content type if needed
    //         ]
    //     ]);

    //     // Execute curl request
    //     $response = curl_exec($curl);

    //     // Check for curl error
    //     if (curl_errno($curl)) {
    //         // echo 'Error: ' . curl_error($curl);
    //         curl_close($curl);
    //         // return null;
    //     }

    //     // Close curl session
    //     curl_close($curl);

    //     // Decode the JSON response into a PHP array
    //     $result = json_decode($response, true);

    //     if (is_array($result) && !empty($result)) {
    //         // Extract latitude and longitude from the first result (assuming it's the most relevant)
    //         $lat = $result[0]['lat'];
    //         $lon = $result[0]['lon'];

    //         return ['lat' => $lat, 'lon' => $lon];
    //     } else {
    //         // No results found
    //         return null;
    //     }


    }
}
catch (Exception $e) {
    //echo $e;
    //echo 'null';
    ;
}
echo json_encode($img_fog_unc);

?>