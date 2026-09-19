<?php 
session_start();
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
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
        public function get_item($method){
            try {
            // $done=$GLOBALS['done'];
            // $outl=$GLOBALS['outl'];
            
            if($method=='Prev' ){
                
                $done=($this->done+7)>=$this->outl?$this->done+7-$this->outl:$this->done+7;
                $this->done=($this->done+1)>=$this->outl?$this->done+1-$this->outl:$this->done+1;
            }
            elseif($method=='Next' ){
                
                $this->done=($this->done-1)<0?$this->outl+$this->done-1:$this->done-1;
                $done=$this->done;
                
                
            }
            else{
                return False;
            }
            
           
            $path=$this->out[$done][0];
            $date=$this->out[$done][1];
            //echo $date;
            $file="/data/roshan_datas/images_live/Datas/Images/".$this->dir.$path.".jpg";
            //    echo $file;
            //    copy("/data/roshan_datas/images_live/Datas/Images/Cam2/Input/".$out[$x].".jpg","/var/www/html/fog-prediction/sample_fog_images/Cam2/".$y.".jpg");
    
                // $fp = fopen($file, 'rb');
            //    echo file_exists($file);
                $imageData = file_get_contents($file);
                
                // Convert the binary data to base64
                $base64Image = base64_encode($imageData);
                
                // header("Content-Type: image/png");
                // header("Content-Length: " . filesize($file));
                if(filesize($file)){
                    //value="'.strtotime($date).'"
                echo '<div class="carousel-item '.(($this->active==3)?"active":"").'">
                            <div class="carousel-caption" style="font-size:2vw;" > 
                                '.(string)$date.'
                            </div> 
                            <div class="carousel-counter w-25" style="font-size:1vw;" >
                                '.(string)($this->outl - $done).'/'.$this->outl.'
                            </div> 
                            <div>
                            <img class="theimage img-fluid w-100" src="data:image/png;base64,'.$base64Image.'"  alt="Image" >
                            </div>
                            
                </div>';
                if($this->active<=3){
                    $this->active+=1;
                }
                return True;
                }
               
                
            }catch (Exception $e) {
               ;
                // echo 'Caught exception: ',  $e->getMessage(), "\n";
            }
            return FALSE;
        }
        function search($target) {
            $target=strtotime(explode('+',date_format($target,DATE_RFC822))[0]);
            //$target=$target->getTimestamp();
            $arr=$this->out;
            $arrl=$this->outl;
            $fdate=strtotime($arr[1][1]);
            $ldate=strtotime($arr[$arrl-6][1]);
            
            $ind=$arrl+2;
            // echo $fdate."  ".$target."  ".$ldate;
            if($target>=$fdate){
                $ind=0;
                // echo "in";
            }
            else if($target<=$ldate){
                $ind=$arrl+2;
                // echo "inn";
            }
            else{
                // echo "innn";
                $left = 0;
                $right = count($arr) - 1;
                while ($left <= $right) {
                    $mid = floor(($left + $right) / 2);
                    $date=strtotime($arr[$mid][1]);
                    $prevdate=strtotime($arr[$mid+1][1]);
                    
            
                    if ($target<=$date && $target>=$prevdate) {
                        $ind=$mid+1; // DateTime found, return its index
                        break;
                    }
                    if ($date < $target) {
                        $right = $mid - 1;
                    } else {
                        $left = $mid + 1;
                    }
                }
            }

                
            $this->done=($ind-3>4)?$ind-3:4;
            $this->active=0;
            //echo $ind;
            // echo "  ";
            // echo $this->done;
            for ($x = 0; $x<6 ; $x++) {
                // echo $out[$x][1];
                // continue;
                // echo $out[$x][0];
                $item=$this->get_item('Next');
                
                
                
                    // dump the picture and stop the script
                    //fpassthru($fp);
                    // copy("/data/roshan_datas/images_live/Datas/Images/Cam2/Input/".$out[$x].".png","/var/www/html/fog-prediction/sample_fog_images/Cam2/".$y.".png");
                
            

                
            }
            echo '@@';

        
            
        }
    }
    function sortByDate($a,$b){
        // $dateA = strtotime($a[1]);
        // $dateB = strtotime($b[1]);
        $dateA = $a[2];
        $dateB = $b[2];

        return  $dateB - $dateA ;

    }
    

    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        
        $_SESSION['tcam1']=null;$_SESSION['tcam2']=null;
        $_SESSION['fcam1']=null;$_SESSION['fcam2']=null;
        //foreach ([['Cam1',&$_SESSION['cam1']],['Cam2',&$_SESSION['cam2']]] as $camera){
        foreach ([['Cam1/Classified/',&$_SESSION['tcam1']],['Cam2/Classified/',&$_SESSION['tcam2']],['Cam1/MisClassified/',&$_SESSION['fcam1']],['Cam2/MisClassified/',&$_SESSION['fcam2']]] as $camera){
            $out = array();
            $dates=array();
            
            foreach (glob('/data/roshan_datas/images_live/Datas/Images/'.$camera[0].'*.jpg') as $filename) {
                $p = pathinfo($filename);
                
                $te = $p['filename'];
                $temp=explode("_",$te);
                //echo str_replace("-",":", $temp[3]);
                $date=date_create($temp[2]." ".str_replace("-",":", $temp[3]));//explode("-", $temp[3])[0].':00:00'
                //echo explode('+',date_format($date,DATE_RFC822))[0];
                $date = explode('+',date_format($date,DATE_RFC822))[0];
                $out[]=[$te,$date,strtotime($date)];
                
                
            }
            usort($out, 'sortByDate');
            // $outl=count($out);
            // $done=0;
            
            $camera[1]=new Images($out,count($out),6,$camera[0]);
            for ($x = 0; $x<6; $x++) {
                // echo $out[$x][1];
                // continue;
                // echo $out[$x][0];
                $item=$camera[1]->get_item('Next');
                
                
                
                   // dump the picture and stop the script
                   //fpassthru($fp);
                   // copy("/data/roshan_datas/images_live/Datas/Images/Cam2/Input/".$out[$x].".png","/var/www/html/fog-prediction/sample_fog_images/Cam2/".$y.".png");
                
            } 

               echo '@@';
        }
        
    }    
    else{
        $method = isset($_POST['method']) ? $_POST['method'] : null;
        if($method=='Date'){
            if(isset($_POST['date'])){
                $date=date_create($_POST['date']);
                // echo date_format($date,DATE_RFC822);
                
                foreach([&$_SESSION['tcam1'],&$_SESSION['tcam2'],&$_SESSION['fcam1'],&$_SESSION['fcam2']] as $camera){
                    //$camera->displayValues();
                    $camera->search($date);
                    continue;
                }
                

            }

        }
        else if(($method=='Next' || $method=='Prev') && isset($_POST['cam'])){
            if($_POST['cam'] == 'Cam1,Classified')
                $cam=$_SESSION['tcam1'] ;
            else if($_POST['cam'] =='Cam1,MisClassified')
                $cam=$_SESSION['fcam1'];
            else if($_POST['cam'] =='Cam2,Classified')
                $cam=$_SESSION['tcam2'];
            else if($_POST['cam'] =='Cam2,MisClassified')
                $cam=$_SESSION['fcam2'];
            else    
                $cam=null;
            if($cam){
                $cam->get_item($method);
            }
        }
        
        

        


        
        //echo $cam;
        
        //echo $_SESSION['cam1'];
        
    }
    
        
    // echo date_format($date,DATE_RFC822);
    // echo $out[0][0];
    
    
?>