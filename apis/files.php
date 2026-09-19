var files = <?php $out = array();
$type="small_output";
$month="JAN";

$files = glob('/data/prasad/fog_detection_bnn/small_png/small_output*.png');
// usort($files, function ($a, $b) {

//     // Extract date using regex
//     preg_match('/(\d{2}[A-Z]{3}\d{4})/', $a, $matchA);
//     preg_match('/(\d{2}[A-Z]{3}\d{4})/', $b, $matchB);

//     // Convert to timestamp
//     $dateA = DateTime::createFromFormat('dMY', $matchA[1])->getTimestamp();
//     $dateB = DateTime::createFromFormat('dMY', $matchB[1])->getTimestamp();

//     // DESC order
//     return $dateB <=> $dateA;
// });
// foreach (glob('/data/prasad/fog_detection_bnn/small_png/small_output*.png') as $filename) {
//     $p = pathinfo($filename);
//     $val = $p['filename'];
//     if( strlen($val)>10){
//         $mn=substr($val,strlen($type)+2,3);
//         if(substr($val,0,strlen($type))==$type and substr($val,strlen($type)+2,3)==$month) 
//         {
//             $out[] = $val;

//         }
//     }
    
// }
// $outl = count($out);

// $out2=array();



// for($i=$outl-1; $i>0;$i-=1){
//     $val=$out[$i];
//     $mn=substr($val,strlen($type)+2,3);
//     if( strlen($val)>10 and substr($val,0,strlen($type))==$type and substr($val,strlen($type)+2,3)==$month) {
//         $out2[] = $val;
//     }
// }
// $names = array();
// for ($x = 0; $x<4; $x++) {
//     $file = $files[$x];
//     $name = explode('/',$file);
//     $name = $name[count($name)-1];
//     array_push($names, $name);
//     copy($file,"/var/www/html/fog-prediction/prashad/26DEC2019_0200PNG/".$name);
// }

$dates = [];

// Step 1: Extract dates
foreach ($files as $file) {
    if (preg_match('/(\d{2}[A-Z]{3}\d{4})_(\d{4})/', $file, $m)) {
        $datetime = DateTime::createFromFormat('dMY Hi', $m[1] . ' ' . $m[2]);
        $timestamp = $datetime->getTimestamp();

        $dates[$file] = $timestamp;
    }
}

// Step 2: Find latest date
$latestDate = max($dates);

// Step 3: Get only files with latest date
// $latestFiles = array_keys(
//     array_filter($dates, fn($d) => $d === $latestDate)
// );
$latestFiles = array();
foreach ($dates as $file => $timestamp) {
    if($timestamp === $latestDate){
        //array_push($latestFiles,$file);
        $name = explode('/',$file);
        $name = $name[count($name)-1];
        array_push($latestFiles, $name);
        copy($file,"/var/www/html/fog-prediction/prashad/26DEC2019_0200PNG/".$name);
        
    }
}
echo json_encode( $latestFiles); 
?>;