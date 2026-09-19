<?php
    $plots_path = "/data/prasad/fogcast_lite/plots/feb_2025";
    $i = 0;
    while($i++<3)
    {
        $dirs = scandir($plots_path, SCANDIR_SORT_DESCENDING);
        $plots_path.="/".max($dirs);
        
    }
    $files = scandir($plots_path);
    $city_mapping = array(
        "lucknow"=>"LKO",
        "kolkata"=>"KTA",
        "gorakhpur"=>"GRK",
        "gaya"=>"GYA",
        "agra"=>"AGR",
        "amritsar"=>"AMS",
        "delhi"=>"DEL"
    );
    if(isset($_GET["cityname"]) && isset($city_mapping[strtolower($_GET["cityname"])])){
        $code=$city_mapping[strtolower($_GET["cityname"])];
        $station_files = Array();
        //$ctr=0;
        //$ext=Array();
        foreach($files as $file){
            $filel=strlen($file);
            if(substr($file,$filel-7,3)==$code){
                $imageData = file_get_contents($plots_path."/".$file);
                
                // Convert the binary data to base64
                $base64Image = base64_encode($imageData);
                $date = DateTime::createFromFormat('d_m_Y_H', substr($file,0,13))->format('Y-m-d H:i:s');
                $add = (int)substr($file, 21,3);
                $type = substr($file,25,4);
                array_push($station_files,array($date, $add, $type, $base64Image));
                //$ctr+=1;
                
            }
            //array_push($ext, substr($file,$filel-7,3));
            
            
        }
        //array_push($station_files,$ctr,$ext);
        echo json_encode($station_files);
        
    }

    echo null;

 ?>