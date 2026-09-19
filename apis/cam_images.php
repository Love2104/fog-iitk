var files = <?php $out = array();
foreach (glob('/data/roshan_datas/images_live/Datas/Images/Cam2/Input/*.jpg') as $filename) {
    $p = pathinfo($filename);
    $out[] = $p['filename'];
    
}
// $out2=array();
// $type="small_output";
// $month="JAN";
// foreach ($out as $val) {
//     $mn=substr($val,strlen($type)+2,3);
//     if( strlen($val)>10 and substr($val,0,strlen($type))==$type and substr($val,strlen($type)+2,3)==$month) {
//         $out2[] = $val;
//     }
// }
$y=0;
for ($x = count($out)-1; $x>count($out)-4; $x--) {
    copy("/data/roshan_datas/images_live/Datas/Images/Cam2/Input/".$out[$x].".png","/var/www/html/fog-prediction/sample_fog_images/Cam2/".$y.".png");
    $y+=1;
}
echo json_encode(array_slice($out,-3)); ?>;