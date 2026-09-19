var files = <?php
session_start();
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

class Images {
    private $out;
    private $outl;
    private $done;
    private $dir;
    private $active;
    public function __construct(array $dataArray, int $arrayLength, int $iterators, $dir) {
        $this->out = $dataArray;
        $this->outl = $arrayLength;
        $this->done = $iterators;
        $this->dir = $dir;
        $this->active=0;
    }

    public function displayValues() {
        echo "Array: ";
        print_r($this->out);
        echo "Array Length: " . $this->outl . PHP_EOL;
        echo "Iterators: ";
        print_r($this->done);
    }
    // public function get_item($method){
    //     try {
    //     // $done=$GLOBALS['done'];
    //     // $outl=$GLOBALS['outl'];
        
    //     if($method=='Prev' ){
            
    //         $done=($this->done+7)>=$this->outl?$this->done+7-$this->outl:$this->done+7;
    //         $this->done=($this->done+1)>=$this->outl?$this->done+1-$this->outl:$this->done+1;
    //     }
    //     elseif($method=='Next' ){
            
    //         $this->done=($this->done-1)<0?$this->outl+$this->done-1:$this->done-1;
    //         $done=$this->done;
            
            
    //     }
    //     else{
    //         return False;
    //     }
        
       
    //     $path=$this->out[$done][0];
    //     $date=$this->out[$done][1];
    //     //echo $date;
    //     $file="/data/roshan_datas/images_live/Datas/Images/".$this->dir.$path.".jpg";
    //     //    echo $file;
    //     //    copy("/data/roshan_datas/images_live/Datas/Images/Cam2/Input/".$out[$x].".jpg","/var/www/html/fog-prediction/sample_fog_images/Cam2/".$y.".jpg");

    //         // $fp = fopen($file, 'rb');
    //     //    echo file_exists($file);
    //         $imageData = file_get_contents($file);
            
    //         // Convert the binary data to base64
    //         $base64Image = base64_encode($imageData);
            
    //         // header("Content-Type: image/png");
    //         // header("Content-Length: " . filesize($file));
    //         if(filesize($file)){
    //             //value="'.strtotime($date).'"
    //         echo '<div class="carousel-item '.(($this->active==3)?"active":"").'">
    //                     <div class="carousel-caption" style="font-size:2vw;" > 
    //                         '.(string)$date.'
    //                     </div> 
    //                     <div class="carousel-counter w-25" style="font-size:1vw;" >
    //                         '.(string)($this->outl - $done).'/'.$this->outl.'
    //                     </div> 
    //                     <div>
    //                     <img class="theimage img-fluid w-100" src="data:image/png;base64,'.$base64Image.'"  alt="Image" >
    //                     </div>
                        
    //         </div>';
    //         if($this->active<=3){
    //             $this->active+=1;
    //         }
    //         return True;
    //         }
           
            
    //     }catch (Exception $e) {
    //        ;
    //         // echo 'Caught exception: ',  $e->getMessage(), "\n";
    //     }
    //     return FALSE;
    // }
    function search($sdate,$edate,$city,$lat=0,$long=0) {
        // $ctr=0;
        $qu=array();
        // $final_ctr=0;
        $img_fog_unc=array();
        $flagm=0;
        // echo $sdate. ' '. $edate.' ';
        foreach ($this->out as $timestamp=>$arr) {
            // $qu[]=$timestamp;
            // if($ctr>=10){
            //     array_shift($qu);
            // }
            // else{
            //     $ctr+=1;
            // }

            if($timestamp<=$edate && $timestamp>=$sdate){
                $qu[]=$timestamp;
                if($flagm==0){
                    $flagm=1;
                }
                else{
                    continue;
                }
                // echo $timestamp.' ';
                // if($final_ctr==0){
                    $this->active=$timestamp;
                    $activateEnvCommand = "source /data/yashp/fog-php/bin/activate";
                    $python_script_path = 'demo.py';
                    foreach( $arr as $file_info){
                        if(count(explode('_',$file_info[0]))==2){
                            
                            $file_path=$this->dir.$file_info[0].'.npy'; 
                            
                            // $command = "python3 $python_script_path $city $file_path";
                            try{
                            if($lat!=0 && $long!=0 && $city=='')
                                $command = escapeshellcmd("  /data/yashp/fog-php/bin/python $python_script_path $lat $long ");
                            else
                                $command = escapeshellcmd("  /data/yashp/fog-php/bin/python $python_script_path ".'"'.$city.'" ');
                             //echo $command." ";
                            // exec($command, $output);
                            $output=shell_exec($command);
                            // print_r($output);
                            // array_push($output);
                            $img_fog_unc[]=explode('+',date(DATE_RFC822,$timestamp))[0];
                            
                            $output=json_decode($output);
                            
                            //echo is_array($output) && count($output)>2;
                            if(is_array($output) && count($output)>2){
                                $img_fog_unc[]=$output;
                                //print_r(json_decode($output));
                            }
                            else
                                $img_fog_unc[]='null';
                            }
                            
                            catch (Exception $e) {
                                //echo $e;
                                if(count($img_fog_unc)<2){
                                    $img_fog_unc[]='null';
                                }
                            }

                            
                            //echo json_encode($img_fog_unc);
                            // print_r($output);
                            // if (!empty($output)) {
                            //     echo $output[0];
                            // }
                            
                        }
                        elseif($timestamp<$sdate){
                            break;
                        }
                    // }
                    
                }
                
                
                // if($final_ctr<5){
                //     $final_ctr+=1;
                // } 
                // else{
                //     if($ctr>=10) 
                //         break;
                // }
            }
            
        }
        $row=0;
        $col=0;
        if($img_fog_unc[1]!='null' && count($img_fog_unc[1])>=4){
            $row=$img_fog_unc[1][3];$col=$img_fog_unc[1][4];
        }
        //print_r($qu);
        //$img_fog_unc[]=count($qu);
        // $final=array();
        $qul=count($qu);
        $inc=floor(count($qu)/10);
        if($inc<1) $inc=1;
        // foreach($qu as $timestamp ){
        for($ittr=0;$ittr<$qul;$ittr+=$inc){
            $timestamp=$qu[$ittr];
            foreach( $this->out[$timestamp] as $file_info){
                if(count(explode('_'
                ,$file_info[0]))==2){
                    try{
                    $file_path=$this->dir.$file_info[0].'.npy';
                    // echo $file_path;
                    
                    //echo $row.' , '.$col;
                    // if(!(is_int($row) && $row>=400  && $row<=750 )){
                    //     $row=0;
                    // }
                    // if(!(is_int($col) && $col>=600  && $col<=1250 )){
                    //     $col=0;
                    // }
                    
                    $y=read_npy_file($file_path,$row,$col);
                    
                    //echo $y;
                    //$command = escapeshellcmd("  /data/yashp/fog-php/bin/python $python_script_path $row $col $file_path");
                    //echo $command;
                    // $output=json_decode(shell_exec($command));

                    $z=array_merge([explode('+',date(DATE_RFC822,$file_info[1]))[0]],$y);
                    //$img_fog_unc[]=[explode('+',date(DATE_RFC822,$file_info[1]))[0]];
                    if(count($z)>=3 && !is_null($y)){
                       //print_r($z);
                        array_push($img_fog_unc,$z);
                    }
                    }
                    catch (Exception $e) {
                        continue;
                    }
                    // $img_fog_unc[]=array_slice($y,1);
                }
            }

        }
        echo json_encode($img_fog_unc);
       
    
        
    }
    function initial(){
       
        $itr=0;
        $final=array();
        foreach ($this->out as $t=>$files) {
            if($itr==0)
            {
                $this->active=$t;
            }
            if($itr==10)
                break;
            foreach( $files as $file_info){
                
                if(count(explode('_',$file_info[0]))==2){
                    try{
                        //  echo $this->dir.$file_info[0].".npy";
                        $y=read_npy_file($this->dir.$file_info[0].".npy");

                        $z=array_merge([explode('+',date(DATE_RFC822,$file_info[1]))[0]],$y);

                        // print_r($z);
                        //echo $z;
                        if(count($z)==3 && !is_null($y)){
                        array_push($final,$z);
                        
                        }
                    }
                    catch (Exception $e) {
                        continue;
                    }
                }
            }
            $itr+=1;
    
        }
        echo json_encode($final);
    }
}

function read_npy_file($file_path,$row=0,$col=0) {
    
    $python_script_path = 'read_npy.py';
    // $python_script_path = 'demo.py';
    if($row==0 && $col==0){
        $command = "/data/yashp/fog-php/bin/python  $python_script_path $file_path";
        // echo $command."\n";
    // $command="source /data/yashp/fog-php/bin/activate && python demo.py kanpur /data/prasad/fog_detection_bnn/29FEB2024_0730.npy";
        exec($command, $output);
        // print_r($output);
        $output=json_decode($output[0]);
        
        if (!empty($output)) {
            // Convert JSON output to PHP array
            
            $imageData = file_get_contents($output[0]);
                    
                    // Convert the binary data to base64
            $base64Image = base64_encode($imageData);
            return [$base64Image,$output[1]];
            //$values_array = json_decode($output[0], true);
            // if (isset($values_array['error'])) {
            //     // Handle error
            //     //echo "Error: " . $values_array['error'];
            //     ;
            // } else {
            //     // Output values array
            //     //echo $values_array;
            // }
        }
    }
    else{
        $command = "/data/yashp/fog-php/bin/python $python_script_path $row $col  $file_path";
        exec($command, $output);
        
        

        if (!empty($output)) {
            // print_r(json_decode($output[0]));
            $output=json_decode($output[0]);
            
            // print_r($output);
            // Convert JSON output to PHP array
            // echo $output[0];
            $imageData = file_get_contents($output[0]);
                    
                    // Convert the binary data to base64
            $base64Image = base64_encode($imageData);
            //echo count(chunk_split($base64Image));
           // echo $base64Image.','; 
            return array($base64Image,$output[1],$output[2],$output[3],$output[4]);
        }
    }
    //$data = file_get_contents($file_path);
   
    
    return null;
    // Parse the header to get metadata
    

    //return $values;
}
function getDatetime($date_string){
    // $day = substr($date_string, 0, 2);
    // $month = substr($date_string, 2, 3); // assuming month is always 3 characters
    // $year = substr($date_string, 5, 4);
    // $hour = substr($date_string, 10,2);

    // $minute = substr($date_string, 12,2);

    // // Convert month abbreviation to its corresponding numeric representation
    // $month_names = [
    //     'JAN' => '01',
    //     'FEB' => '02',
    //     'MAR' => '03',
    //     'APR' => '04',
    //     'MAY' => '05',
    //     'JUN' => '06',
    //     'JUL' => '07',
    //     'AUG' => '08',
    //     'SEP' => '09',
    //     'OCT' => '10',
    //     'NOV' => '11',
    //     'DEC' => '12'
    // ];
    // $month_numeric = $month_names[$month];

    // // Form the date string in a format suitable for DateTime
    // $date_time_string = "$year-$month_numeric-$day $hour:$minute";
    // //echo $date_time_string
    // // Create a DateTime object
    // $date_time = DateTime::createFromFormat('Y-m-d H:i', $date_time_string);
    $date_time1 = DateTime::createFromFormat('!dMY_Hi', $date_string );
    $date_time1->add(new DateInterval('PT5H30M'));
    // if( $date_time1 === false) {
    //     // Handle error
    //     echo $date_string;
    // }
    // print_r($date_time1);
    // print_r("\n");
    // print_r($date_time1->getTimestamp());

    return $date_time1->getTimestamp();
    // 
    // return $date_time->getTimestamp();
}
function sortByDate($a,$b){
    print_R($a);
    $dateA = $a[1];
    $dateB = $b[1];
    //$dateA = $a[1];
    //$dateB = $b[1];

    return  $dateB - $dateA ;

}
// Example usage
// $file_path = 'your_file.npy';
// $values = read_npy_file($file_path);
// if ($values !== false) {
//     print_r($values);
// } else {
//     echo "Failed to read .npy file.";
// }
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    $out = array();
    $base_dir = "/data/prasad/fog_detection_bnn/npy/2026/";
    foreach (glob($base_dir.'*.npy') as $filename) {
        
        $p = pathinfo($filename);
        if(count(explode('_',$p['filename']))!=2){
            continue;
        }
        $date = getDatetime($p['filename']);
        //  echo $p['filename'].' '.$date.' '.array_key_exists($date,$out).'   ';
        if(array_key_exists($date,$out)){
            //echo $p['filename'].'\n';
            
            $file_data=[$p['filename'],getDatetime($p['filename'])];
            array_push($out[$date],$file_data);
        }
        else{
            $out[$date]=[[$p['filename'],getDatetime($p['filename'])]];
        }

        
    }


    krsort($out);

    $_SESSION['spatial_images']=new Images($out, count($out), 0, $base_dir);
    $_SESSION['spatial_images']->initial();
}
else{
    $sdate = isset($_POST['sdate']) ? $_POST['sdate'] : null;
    $edate = isset($_POST['edate']) ? $_POST['edate'] : null;
    $city = isset($_POST['city']) ? $_POST['city'] : null;
    $long = isset($_POST['long']) ? $_POST['long'] : null;
    $lat = isset($_POST['lat']) ? $_POST['lat'] : null;
    // echo $sdate.' '.$edate.' '.$city; 
    if($sdate && $edate && $city){
        // echo $date.' '.$city;
        $_SESSION['spatial_images']->search($sdate,$edate,$city);
    }
    elseif($sdate && $edate && $lat && $long){
        $_SESSION['spatial_images']->search($sdate,$edate,'',$lat,$long);
    }
}
// print_r($out);
// exit();


//echo explode('+',date(DATE_RFC822,$out[0][1]))[0];
// $out2=array();
// $type="";
// //$month="FEB";
// foreach ($out as $val) {
//     //$mn=substr($val,strlen($type)+2,3);
//     if(count(explode('_', $val))==2){
//         $out2[] = $val;
//     }
// }
// print_r($out2);
// $out2=array();

// exit();
// for ($x = 0; $x<10; $x++) {
    //echo $out[$x][0].'\n';
    
    // if(is_null($y)){
    //     ;
    // }
    // else{
    //     ;
    //     //$out2 = array_merge($out2, $y);
    // }
    //copy("/data/prasad/fog_detection_bnn/small_png/".$out2[$x].".png","/var/www/html/fog-prediction/prashad/26DEC2019_0200PNG/".$out2[$x].".png");
// }
//echo json_encode($out2); 
?>;