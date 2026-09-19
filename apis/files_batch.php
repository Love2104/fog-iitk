
 <?php
//  var files =
session_start();
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

class Images {
    
    private $out;
    private $outl;
    private $done;
    private $dir;
    private $active;
    private $existing_cities;
    private $new_cities;

    public $last_date;
    
    public function __construct(array $dataArray, int $arrayLength, int $iterators, $dir, $existing_cities = [], $new_cities = [], $last) {
        $this->out = $dataArray;
        $this->outl = $arrayLength;
        $this->done = $iterators;
        $this->dir = $dir;
        $this->active = 0;
        $this->existing_cities = $existing_cities;
        $this->new_cities = $new_cities;
        $this->last_date = $last;
    }

    public function displayValues() {
        echo "Array: ";
        print_r($this->out);
        echo "Array Length: " . $this->outl . PHP_EOL;
        echo "Iterators: ";
        print_r($this->done);
    }

    function search($sdate, $edate, $cities_list = []) {
        $qu = array();
        $img_fog_unc = array();
        $flagm = 0;
        if($this->last_date < $sdate){
            $sdate = $this->last_date;
            $edate = $this->last_date + 86400;
        }
        
        // Use provided cities list or default to existing cities
        $all_cities = !empty($cities_list) ? $cities_list : $this->existing_cities;
        
        // Build cities metadata list (constant across all files)
        $cities_metadata = [];
        foreach ($all_cities as $city_info) {
            // Handle both array format [name, row, col, lat, lon] and assoc format
            if (is_array($city_info)) {
                if (isset($city_info['city'])) {
                    // Associative format from selected_cities in spatial_enhance.js
                    $cities_metadata[] = [
                        'city' => $city_info['city'],
                        'lat' => $city_info['lat'],
                        'lon' => $city_info['lon'],
                        'row' => $city_info['row'],
                        'col' => $city_info['col']
                    ];
                } else {
                    // Array format [name, row, col, lat, lon]
                    $cities_metadata[] = [
                        'city' => $city_info[0],
                        'lat' => $city_info[3],
                        'lon' => $city_info[4],
                        'row' => $city_info[1],
                        'col' => $city_info[2]
                    ];
                }
            }
        }
        
        // Collect NPY files for date range
        if($this->out)
        $all_npy_files = [];
        foreach ($this->out as $timestamp => $arr) {
            if ($timestamp <= $edate && $timestamp >= $sdate) {
                $all_npy_files[] = ["filepath" => $this->dir . $arr[0][0] . '.npy', "date" => date('Y-m-d H:i:s', $timestamp)];
                // $qu[] = $timestamp;
                // if ($flagm == 0) {
                //     $flagm = 1;
                    // $this->active = $timestamp;
                //     $img_fog_unc[] = date('Y-m-d H:i:s', $timestamp);
                //     $img_fog_unc[] = 'null';
                // }
            }
        }
        
        // Prepare all NPY files for batch processing
        // $qul = count($qu);
        // $inc = floor(count($qu) / 10);
        // if ($inc < 1) $inc = 1;
        
        // for ($ittr = 0; $ittr < $qul; $ittr += $inc) {
        //     $timestamp = $qu[$ittr];
        //     foreach ($this->out[$timestamp] as $file_info) {
        //         if (count(explode('_', $file_info[0])) == 2) {
        //             $file_path = $this->dir . $file_info[0] . '.npy';
                    
        //             $all_npy_files[] = [
        //                 'filepath' => $file_path,
        //                 'date' => date('Y-m-d H:i:s', $file_info[1])
        //             ];
        //         }
        //     }
        // }
        
        // Process all NPY files with all cities metadata in ONE batch call
        $result =[];
        if (!empty($all_npy_files) && !empty($cities_metadata)) {
            $batch_results = read_npy_batch($all_npy_files, $cities_metadata);

            // var_dump(json_decode($batch_results[0], true));
            // var_dump($batch_results[0]);

            if (count($batch_results) > 0) {

                echo json_encode(["success"=>true, "results"=>$batch_results]);
                return;
            }
        }
        
        echo json_encode(["success"=>false]);
    }

    function initial() {
        $itr = 0;
        $final = array();
        
        foreach ($this->out as $t => $files) {
            if ($itr == 0) {
                $this->active = $t;
            }
            if ($itr == 10)
                break;
            
            foreach ($files as $file_info) {
                if (count(explode('_', $file_info[0])) == 2) {
                    try {
                        $y = read_npy_file($this->dir . $file_info[0] . ".npy");
                        $z = array_merge([explode('+', date(DATE_RFC822, $file_info[1]))[0]], $y);
                        
                        if (count($z) == 3 && !is_null($y)) {
                            array_push($final, $z);
                        }
                    } catch (Exception $e) {
                        continue;
                    }
                }
            }
            $itr += 1;
        }
        echo json_encode($final);
    }
}


function read_npy_file($file_path, $row = 0, $col = 0, $cities_list = []) {
    $python_script_path = 'read_npy_batch.py';
    
    // If cities list is provided, process all cities for this file
    if (!empty($cities_list)) {
        // Build cities metadata from cities list
        $cities_metadata = [];
        foreach ($cities_list as $city_info) {
            if (is_array($city_info)) {
                if (isset($city_info['city'])) {
                    // Associative format
                    $cities_metadata[] = [
                        'city' => $city_info['city'],
                        'lat' => $city_info['lat'],
                        'lon' => $city_info['lon'],
                        'row' => $city_info['row'],
                        'col' => $city_info['col']
                    ];
                } else {
                    // Array format [name, row, col, lat, lon]
                    $cities_metadata[] = [
                        'city' => $city_info[0],
                        'lat' => $city_info[3],
                        'lon' => $city_info[4],
                        'row' => $city_info[1],
                        'col' => $city_info[2]
                    ];
                }
            }
        }
        
        // Create single NPY file entry
        $npy_files = [[
            'filepath' => $file_path,
            'date' => basename($file_path, '.npy')
        ]];
        
        // Convert to JSON and call batch processor
        $npy_json = escapeshellarg(json_encode($npy_files));
        $cities_json = escapeshellarg(json_encode($cities_metadata));
        $command = "/data/yashp/fog-php/bin/python {$python_script_path} batch {$npy_json} {$cities_json}";
        
        $output = [];
        exec($command, $output);
        
        if (!empty($output)) {
            $batch_result = json_decode($output[0], true);
            
            if ($batch_result && isset($batch_result['results'])) {
                $city_results = [];
                
                // Process results for all cities
                foreach ($batch_result['results'] as $item) {
                    if ($item['success']) {
                        // Generate image overlay
                        $image_path = generate_fog_image($item['filepath'], $item['row'], $item['col']);
                        $image_data = file_get_contents($image_path);
                        $base64_image = base64_encode($image_data);
                        
                        $city_results[] = [
                            'city' => $item['city'],
                            'lat' => $item['lat'],
                            'lon' => $item['lon'],
                            'image' => $base64_image,
                            'values' => $item['values']
                        ];
                    }
                }
                
                return $city_results;
            }
        }
        
        return [];
    }
    
    // Original behavior for single file without cities list
    if ($row == 0 && $col == 0) {
        $command = "/data/yashp/fog-php/bin/python  $python_script_path $file_path";
        exec($command, $output);
        $output = json_decode($output[0]);
        
        if (!empty($output)) {
            $imageData = file_get_contents($output[0]);
            $base64Image = base64_encode($imageData);
            return [$base64Image, $output[1]];
        }
    } else {
        $command = "/data/yashp/fog-php/bin/python $python_script_path $row $col  $file_path";
        exec($command, $output);
        
        if (!empty($output)) {
            $output = json_decode($output[0]);
            $imageData = file_get_contents($output[0]);
            $base64Image = base64_encode($imageData);
            return array($base64Image, $output[1], $output[2], $output[3], $output[4]);
        }
    }
    
    return null;
}

function read_npy_batch($npy_files_list, $cities_metadata_list) {
    $python_script_path = 'read_npy_batch.py';
    
    // Prepare two JSON arrays: one for NPY files, one for cities metadata
    $npy_json = escapeshellarg(json_encode($npy_files_list));
    $cities_json = escapeshellarg(json_encode($cities_metadata_list));
    $command = "/data/yashp/fog-php/bin/python {$python_script_path} batch {$npy_json} {$cities_json}";
    // echo $command."\n";
    $output = [];
    exec($command, $output);
    // echo $output;
    if (!empty($output)) {
        $batch_result = json_decode($output[0], true);
        
        if ($batch_result && isset($batch_result['results'])) {
            $output_data = [];
            
            // Process results and generate image overlays
            foreach ($batch_result['results'] as $item) {
                
                    // Generate image overlay for each result
                    // $image_path = generate_fog_image($item['filepath'], $item['row'], $item['col']);
                    $image_data = file_get_contents($item['filepath']);
                    $base64_image = base64_encode($image_data);
                    
                    // Add flattened result
                    $output_data[] = [
                        'date' => $item['date'],
                        'image' => $base64_image,
                        'values' => $item['city_values'], 
                    ];
                
            }
            return $output_data;
        }
    }
    
    return [];
}

function getDatetime($date_string) {
    $date_time1 = DateTime::createFromFormat('!dMY_Hi', $date_string);
    if ($date_time1) {
        $date_time1->add(new DateInterval('PT5H30M'));
        return $date_time1->getTimestamp();
    }
    return 0;
}

function sortByDate($a, $b) {
    $dateA = $a[1];
    $dateB = $b[1];
    return $dateB - $dateA;
}

// Existing cities array - same structure as before
$existing_cities = [
    ['Ahmedabad', 725, 746, 23.07724, 72.63465],
    ['Bhuj', 719, 667, 23.2862, 69.6719],
    ['Bhopal', 719, 870, 23.2875, 77.3374],
    // ... add all other existing cities
];
if(!isset($_SESSION['spatial_images'])){
    
    $out = array();
    // Existing cities array - same structure as before
    $existing_cities = [
        ['Ahmedabad', 725, 746, 23.07724, 72.63465],
        ['Bhuj', 719, 667, 23.2862, 69.6719],
        ['Bhopal', 719, 870, 23.2875, 77.3374],
        // ... add all other existing cities
    ];
    $base_dir = "/data/prasad/fog_detection_bnn/npy/2026/";
    foreach (glob($base_dir . '*.npy') as $filename) {
        $p = pathinfo($filename);
        if (count(explode('_', $p['filename'])) != 2) {
            continue;
        }
        
        $date = getDatetime($p['filename']);
        if (array_key_exists($date, $out)) {
            $file_data = [$p['filename'], getDatetime($p['filename'])];
            array_push($out[$date], $file_data);
        } else {
            $out[$date] = [[$p['filename'], getDatetime($p['filename'])]];
        }
    }
    
    
    krsort($out);
    foreach ($out as $key => $value) {
        $last_key = $key;
        break;
    }
    $last = (new DateTime())
    ->setTimestamp($last_key)
    ->setTime(0, 0, 0)
    ->getTimestamp();
    $_SESSION['spatial_images'] = new Images($out, count($out), 0, $base_dir, $existing_cities, [], $last);
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    
    // GET request: initialize with all files
    // $out = array();
    // $base_dir = "/data/prasad/fog_detection_bnn/npy/2026/";
    
    // foreach (glob($base_dir . '*.npy') as $filename) {
    //     $p = pathinfo($filename);
    //     if (count(explode('_', $p['filename'])) != 2) {
    //         continue;
    //     }
        
    //     $date = getDatetime($p['filename']);
    //     if (array_key_exists($date, $out)) {
    //         $file_data = [$p['filename'], getDatetime($p['filename'])];
    //         array_push($out[$date], $file_data);
    //     } else {
    //         $out[$date] = [[$p['filename'], getDatetime($p['filename'])]];
    //     }
    // }
    
    // krsort($out);
    
    // $_SESSION['spatial_images'] = new Images($out, count($out), 0, $base_dir, $existing_cities, []);
    $_SESSION['spatial_images']->initial();
} else {
    // POST request: handle batch search with selected_cities
    $sdate = isset($_POST['sdate']) ? intval($_POST['sdate']) : null;
    // echo ($sdate !== null) ? "set" : "notset";
    
    $edate = isset($_POST['edate']) ? intval($_POST['edate']) : null;
    $selected_cities_json = isset($_POST['selected_cities']) ? $_POST['selected_cities'] : null;
    if($sdate == null || $sdate > $_SESSION['spatial_images']->last_date){
        $sdate = $_SESSION['spatial_images']->last_date;
        $edate = $sdate + 86400;
    }
    if ($sdate && $edate) {
        // Parse selected_cities JSON from spatial_enhance.js
        $selected_cities = [];
        if ($selected_cities_json) {
            $selected_cities = json_decode($selected_cities_json, true);
            if (!is_array($selected_cities)) {
                $selected_cities = [];
            }
        }
        
        // Load all NPY files
        // $out = array();
        // $base_dir = "/data/prasad/fog_detection_bnn/npy/2026/";
        
        // foreach (glob($base_dir . '*.npy') as $filename) {
        //     $p = pathinfo($filename);
        //     if (count(explode('_', $p['filename'])) != 2) {
        //         continue;
        //     }
            
        //     $date = getDatetime($p['filename']);
        //     if (array_key_exists($date, $out)) {
        //         $file_data = [$p['filename'], getDatetime($p['filename'])];
        //         array_push($out[$date], $file_data);
        //     } else {
        //         $out[$date] = [[$p['filename'], getDatetime($p['filename'])]];
        //     }
        // }
        
        // krsort($out);
        
        // // Create Images instance and perform batch search
        // $_SESSION['spatial_images'] = new Images($out, count($out), 0, $base_dir, $existing_cities, []);
        $_SESSION['spatial_images']->search($sdate, $edate, $selected_cities);
    }
}
?>
