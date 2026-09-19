<?php
    $plots_path = "/data/yashp/leadtime/";
    $i = 0;
    if(isset($_GET["startdate"])  && isset($_GET["leadtime"])){//&& isset($_GET["enddate"])
        $plots_path.=$_GET["leadtime"];
        $files = scandir($plots_path);
        $start_date = $_GET["startdate"];
        $station_files = Array();
        
        $ctr=0;
        $ctr2=0;
        $files2=Array();
        foreach($files as $file){
            if(strlen($file)>13){
                $date = DateTime::createFromFormat('d_m_Y_H',  substr($file,0,13));
                // $date->add(new DateInterval('PT6H00M'));
            }
            else
                continue;
            
            array_push($files2,array("file"=>$file,"date"=>$date->format("Y-m-d H:i:s"), "compdate"=>$date));
           

        }
        
        function compareDates($a, $b) {
            $dateA = $a['compdate'];
            //echo $dateA;
            $dateB = $b['compdate'];
            
            if ($dateA == $dateB) {
               return 0;
            } elseif ($dateA > $dateB) {
               return 1;
            } else {
               return -1;
            }
        }
        // print_r($prev_date);
        usort($files2, 'compareDates');
        $fliesL = count($files2);
        $last_date = $files2[$fliesL-1]["compdate"];
        $last_date->setTime(0, 0, 0);
        $last = $last_date->format("Y-m-d H:i:s");

        // echo $last. "\n";
        if($start_date>$last){
            $start_date=$last;
        }
        $prev_date=$start_date;
        // echo $start_date. "\n";
        foreach($files2 as $filedata){
            $date = $filedata['date'];
            $file = $filedata['file'];
            if(explode(" ", $date)[0]==explode(" ", $start_date)[0] && substr($file,$filel-7,3)=="AGR" ){ // && $date<=$_GET["enddate"]
                // print_r($_GET["startdate"]."\n");
                // print_r($prev_date."\n");
                // print_r($date."\n");
                // print_r($file."\n");
                if($date>$prev_date){
                    $prev_date = $date;
                    $ctr+=1;

                }
                $imageData = file_get_contents($plots_path."/".$file);
                //echo $imageData;
                // Convert the binary data to base64
                $base64Image = base64_encode($imageData);
                // $date = DateTime::createFromFormat('d_m_Y_H', substr($file,0,13))->format('Y-m-d H:i:s');
                $add = (int)substr($file, 21,3);
                $type = substr($file,25,4);
                array_push($station_files,array($date, $add, $type, $base64Image));
            }
            
        }
        echo json_encode($station_files);
        
    }

    echo null;

 ?>