  <?php 
    session_start();
    
    // echo $_SESSION['sess_id'];
    // echo session_id();
    if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } 
    else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } 
    else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    $client = $_SERVER['HTTP_USER_AGENT'];

    // echo "IP address is: ".$ip;
    // echo $client;
    $os=explode(";",$client)[1]." ";
    $browser=explode(" ",$client);
    $browser= end($browser);
    // echo "IP address is: ".$ip;
    // $ch = curl_init();
    // curl_setopt($ch, CURLOPT_URL, "http://www.geoplugin.net/json.gp?ip=".$ip);
    // curl_setopt(CURLOPT_REFERER, 'https://fog.iitk.ac.in/fog-prediction/');
    // // curl_setopt(CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)');
    // curl_setopt($ch, CURLOPT_HTTPHEADER,  array('Content-Type: application/json'));
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    // curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    // $result = curl_exec($ch);
    // curl_close($ch);
    // $params = json_decode($result);
    // echo "Continent Name: ".$params->geoplugin_continentName."<br>";
    // echo "Country Name: ".$params->geoplugin_countryName."<br>";
    // echo "Country Code: ".$params->geoplugin_countryCode."<br>";
    // echo "City Name: ".$params->geoplugin_city;
    // echo date("Y-m-d H:i:s");
    $flag=0;
    $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
    if (!$conn) { 
        //echo "An error occurred.\n"; 
        $flag=1;  
    }  
    $query="SELECT ip, last_login, date_joined, visits
	FROM public.visitor_data where ip='".$ip."';";
    
    $result = pg_query($conn, $query);
    if (!$result) { 
        //echo "An error occurred.\n"; 
        $flag=1;  
    } 
    else{
        $is_user=pg_fetch_row($result);
    }
    if($flag==0 && $_SESSION['sess_id']!=session_id()){
        $_SESSION['sess_id']=session_id();
        if(!$is_user){
            $query="INSERT INTO public.visitor_data(
                ip, last_login, date_joined, visits)
                VALUES ('".$ip."', '".date("Y-m-d H:i:s")."', '".date("Y-m-d H:i:s")."', 1);";
            $result=pg_query($conn, $query);
            // if(pg_query($conn, $query))
                // echo "New record created successfully";
            // } else {
                // echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            // }
            // $result=pg_query($conn, $query);
            // echo $result;
        }
        else{
            $query="UPDATE public.visitor_data
            SET last_login='".date("Y-m-d H:i:s")."', visits=visits+1
            WHERE ip='".$ip."'";
            $result=pg_query($conn, $query);
        }
    }
    $page='index';
    //echo $_SESSION['last_page_visited'];
    if($_SESSION['last_page_visited'] != $page ) {
        
          
        $sql = 'Select * from visits where "date"='."'".date("Y-m-d H:i:s")."'";
        $result = pg_query($conn, $sql);
        if (!$result) { 
        //echo "An error occurred.\n"; 
            $flag=1;  
        } 
        else{
            $is_user=pg_fetch_row($result);
        }
        //echo $is_user.'in';
        if(!$is_user){
            $sql='INSERT INTO public.visits(
                index, past_prediction, compare_results, iit_kanpur, about, "date")
                VALUES (0,0,0,0,0,'."'".date("Y-m-d H:i:s")."'".');';
        }
        else{
            $sql = 'UPDATE visits 
            SET "index" = "index" + 1
            WHERE "date" = '."'".date("Y-m-d H:i:s")."'";
            $result = pg_query($conn, $sql);
            if (!$result) {  
            //echo "An error occurred.\n";
                $flag=1;
            }  
            if($flag==0){
                $_SESSION['last_page_visited'] = $page;}
        }
        
    }
    pg_close($conn);
?>  

<?php 
    // session_start();
    
    // echo $_SESSION['sess_id'];
    // echo session_id();
    if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } 
    else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } 
    else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    $client = $_SERVER['HTTP_USER_AGENT'];
    // echo $client;
    // echo "IP address is: ".$ip." ";
     
    $os = trim(explode(";",$client)[1]," ");
    $browser = trim(trim(end(explode(" ",$client))," "),"\"");
    // echo $client;
    // $ch = curl_init();
    // curl_setopt($ch, CURLOPT_URL, "http://www.geoplugin.net/json.gp?ip=".$ip);
    // curl_setopt($ch, CURLOPT_REFERER, 'https://fog.iitk.ac.in/fog-prediction/');
    // curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)');
    // // curl_setopt($ch, CURLOPT_HTTPHEADER,  array('Content-Type: application/json'));
    // // curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    // // curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    // $result = curl_exec($ch);
    // curl_close($ch);
    // $params = json_decode($result);
    // echo result;
    // echo "Continent Name: ".$params->geoplugin_continentName."<br>";
    // echo "Country Name: ".$params->geoplugin_countryName."<br>";
    // echo "Country Code: ".$params->geoplugin_countryCode."<br>";
    // echo "City Name: ".$params->geoplugin_city;
    // echo date("Y-m-d H:i:s");
    $flag=0;
    $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
    if (!$conn) { 
        //echo "An error occurred.\n"; 
        $flag=1;  
    }  
    $query="SELECT ip, last_login, date_joined, visits,os,browser
	FROM public.visitor_data where ip='".$ip."';";
    
    $result = pg_query($conn, $query);
    if (!$result) { 
        //echo "An error occurred.\n"; 
        $flag=1;  
    } 
    else{
        $is_user=pg_fetch_row($result);
    }
    if($flag==0 && $_SESSION['sess_id']!=session_id()){
        $_SESSION['sess_id']=session_id();
        if(!$is_user){
            $query="INSERT INTO public.visitor_data(
                ip, last_login, date_joined, visits, os, browser)
                VALUES ('".$ip."', '".date("Y-m-d H:i:s")."', '".date("Y-m-d H:i:s")."', 1,'{".$os."}','{".$browser."}');";
            echo $query;
            // $result=pg_query($conn, $query);
            // if(pg_query($conn, $query))
                // echo "New record created successfully";
            // } else {
                // echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            // }
            // $result=pg_query($conn, $query);
            // echo $result;
        }
        else{
            
            $browsers = explode(',',substr($is_user[5],1,strlen($is_user[5])-2));
            
            $bro_in=1;
            for($i=0;$i<count($browsers);$i++){
                // echo $browsers[$i].' '.$browser.',';
                if(trim($browsers[$i],"\"")==$browser){
                    $bro_in=0;
                }
            }
            $oss = explode(",",substr($is_user[4],1,strlen($is_user[4])-2));
            $os_in=1;
            for($i=0;$i<count($oss);$i++){
                // echo $oss[$i].' '.$os.',';
                if(trim($oss[$i],"\"")==$os){
                    $os_in=0;
                }
            }
            // echo $bro_in.$os_in;
            // echo $browser.$os;
            // echo PHP_EOL.json_decode($is_user[4]). PHP_EOL.json_decode($is_user[5]);
            $query="UPDATE public.visitor_data
            SET last_login='".date("Y-m-d H:i:s")."', visits=visits+1 ";
            if($bro_in==1)
                $query.=",browser=array_append(browser,'".$browser."') ";
            if($os_in==1)
                $query.=",os=array_append(os,'".$os."') ";
            $query.="WHERE ip='".$ip."'";
            // echo $query;
            $result=pg_query($conn, $query);
        }
    }
    // $page='index';
    // if($_SESSION['last_page_visited'] != $page ) {
        
          
        
    //     $sql = 'UPDATE visits 
    //     SET "index" = "index" + 1
    //     WHERE "id" = 1';
    //     $result = pg_query($conn, $sql);
    //     if (!$result) {  
    //      //echo "An error occurred.\n";
    //      $flag=1;
    //     }  
    //     if($flag==0){
    //     $_SESSION['last_page_visited'] = $page;}
        
    // }
    $page='index';
    // echo $_SESSION['last_page_visited'];
    if($_SESSION['last_page_visited'] != $page ) {
        
          
        $sql = 'Select * from visits where "date"='."'".date("Y-m-d")."'";
        $result = pg_query($conn, $sql);
        
        if (!$result) { 
        //echo "An error occurred.\n"; 
            $flag=1;  
        } 
        else{
            $is_user=pg_fetch_row($result);
        }
        // echo $is_user.'in';
        if(!$is_user){
            
            $sql='INSERT INTO public.visits(
                index, past_prediction, compare_results, iit_kanpur, about, "date")
                VALUES (0,0,0,0,0,'."'".date("Y-m-d")."'".');';
            $result = pg_query($conn, $sql);
            if (!$result) {  
            //echo "An error occurred.\n";
                $flag=1;
            }  
            if($flag==0){
                $_SESSION['last_page_visited'] = $page;}
        }
        else{
            $sql = 'UPDATE visits 
            SET "index" = "index" + 1
            WHERE "date" = '."'".date("Y-m-d")."'";
            $result = pg_query($conn, $sql);
            if (!$result) {  
            //echo "An error occurred.\n";
                $flag=1;
            }  
            if($flag==0){
                $_SESSION['last_page_visited'] = $page;}
        }
        
    }
    pg_close($conn);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Fog Prediction</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap" rel="stylesheet"> 

    <script type="text/javascript" src="./amcharts4/ammap.js"></script>
    
    <script type="text/javascript" src="./geodata/indiaHigh.js"></script>
    <script type="text/javascript" src="./geodata/india2019High.js"></script>
    <script src="https://www.amcharts.com/lib/3/maps/js/indiaLow.js"></script>
    
    <!-- <script src="https://code.highcharts.com/stock/modules/export-data.js"></script> -->


    <style>
        .autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            /*position the autocomplete items to be the same width as the container:*/
            top: 100%;
            left: 0;
            right: 0;
            max-height: 300px;
            overflow-x: hidden;
            overflow-y: auto;
            text-align: justify;
        }
        
        .autocomplete-items div {
            padding: 10px;
            cursor: pointer;
            font: outline;
            color: azure;
            background: radial-gradient(rgb(235, 119, 235), rgb(108, 108, 238));
            border-bottom: 2px solid #d4d4d4;
        }
        /*when hovering an item:*/
        
        .autocomplete-items div:hover {
            background: radial-gradient(rgb(28, 226, 160), rgb(61, 214, 241));
        }
        /*when navigating through the items using the arrow keys:*/
        .highcharts-credits{
            display:none;
        }
        .autocomplete-active {
            background: radial-gradient(rgb(28, 226, 160), rgb(61, 214, 241)) !important;
            color: #ffffff;
        }
    </style>
</head>

<body class="index-page" style="font-family: 'Libre Baskerville', serif;" >

    <!-- Navigation bar starts -->

    <nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
        <div class="container">
            <div class="row">
                <div class="col">
                    <a class="navbar-brand  w-100" href="/fog-prediction/"><img class="img-fluid" src="./assets/img/fps1.png" style="height:60px;min-width: 150px;"></a>
                </div>
                <div class="col ">
                    <button class="navbar-toggler mt-2" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                
                    <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        
            <div class="collapse navbar-collapse" id="navbar-default">
                <div class="navbar-collapse-header">
                    <div class="row">
                        <div class="col collapse-brand">

                        </div>
                        <div class="col collapse-close">
                            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                        </button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav ml-lg-auto">
                    <li>
                        <div class="container w-100">
                      
                            <form role="form" autocomplete="off" method="GET">
                                <div class="form-group">
                                    <div class="autocomplete input-group">
                                        <div class="container pt-3">
                                        <div class="d-flex flex-row justify-content-center">
                                            <div class="">
                                            <input id="myInput" class="form-control" placeholder="Select a location" type="text" style="min-width: 100px;">
                                            </div>
                                            <div class="" >
                                            <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="Go" onclick="loaddata(4)">
                                            </div>
                                        <!--<a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                                            <span class="nav-link-inner--text"><button type="button" class="btn btn-primary dropdown-toggle" id="model-choose">Choose Model</button></span>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-left" aria-labelledby="navbar-default_dropdown_1">-->
                                            <!--<a class="dropdown-item" modelno="1" onclick="checkModel(this)" href="#">Gradient Boosting Multiclassifier</a>-->
                                            <!--<a class="dropdown-item" modelno="2" onclick="checkModel(this)" href="#" style="pointer-events: none;cursor:default">Multilayer Perceptron (MLP)</a>
                                            <a class="dropdown-item" modelno="3" onclick="checkModel(this)" href="#" style="pointer-events: none;cursor:default">Gradient Boosting 1</a>-->
                                           <!-- <a class="dropdown-item" modelno="4" onclick="loaddata(this)" href="#">Gradient Boosting Regressor</a>
                                            <a class="dropdown-item" modelno="5" onclick="loaddata(this)" href="#" style="cursor:default">Model 5</a>-->
                                        <!--</div>-->
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
                    <!--<li class="nav-item ">
                        <a class="nav-link" href="sensordata.php" target="_blank" style="font-size:medium;font-weight: bold;">
                        IIT Kanpur
                        </a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link" href="spatial.html" target="_blank" style="font-size:medium;font-weight: bold;">
                        Spatial Fog
                        </a>
                    </li>
                    
                    
                        <li class="nav-item ">
                            <a class="nav-link" href="pastprediction.php" target="_blank" style="font-size:medium;font-weight: bold;">
                            Past Predictions
                            </a>
                        </li>
                         <li class="nav-item ">
                        <a class="nav-link" href="images.php" target="_blank" style="font-size:medium;font-weight: bold;">
                        Image Visibility
                        </a>
                    </li> 
                    <li class="nav-item">
                        <a class="nav-link" href="comparedata.php" target="_blank" style="font-size:medium;font-weight: bold;">
                        Compare Results
                        </a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link" href="about.php" target="_blank" style="font-size:medium;font-weight: bold;">
                        About
                        </a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link" href="contact_us.php" target="_blank" style="font-size:medium;font-weight: bold;">
                        Contact Us
                        </a>
                    </li>-->
                    
                    <li class="nav-item">
                        <a class="nav-link" href="spatial.html" target="_blank" style="font-size:medium;font-weight: bold;">Spatial Fog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="sensordata.php" target="_blank" style="font-size:medium;font-weight: bold;">IIT Kanpur</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pastprediction.php" target="_blank" style="font-size:medium;font-weight: bold;">Past Predictions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="images.php" target="_blank" style="font-size:medium;font-weight: bold;">Image Visibility</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="meteorologicalDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size:medium;font-weight: bold;">
                            Long-Term<br> Prediction
                        </a>
                        <div class="dropdown-menu" aria-labelledby="meteorologicalDropdown">
                            <a class="dropdown-item" href="long_term.php" target="_blank" >Long-Term Prediction</a>
                            
                            <a class="dropdown-item" href="long_pred_comp.html" target="_blank">Past Predicton</a>
                            
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="comparedata.php" target="_blank" style="font-size:medium;font-weight: bold;">Compare Results</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size:medium;font-weight: bold;">
                            About
                        </a>
                        <div class="dropdown-menu" aria-labelledby="aboutDropdown">
                            <a class="dropdown-item" href="about.php" target="_blank" >About Us</a>
                            <!-- <a class="dropdown-item" href="publication.php" target="_blank" >Paper Publication</a> -->
                            <a class="dropdown-item" href="contact_us.php" target="_blank" >Contact Us</a>
                            
                        </div>
                    </li>
                    <!-- <li class="nav-item">
                        
                    </li>
                    <li class="nav-item">
                        
                    </li> -->
                    
                    <!-- <li class="nav-item dropdown">
                        <a href="#" class="nav-link" data-toggle="dropdown" role="button">
                            <span class="nav-link-inner--text"><button type="button" class="btn btn-secondary dropdown-toggle">More</button></span>
                        </a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_2">
                            <a class="dropdown-item" href="comparedata.html" target="_blank">Compare Results</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="pastprediction.html" target="_blank">Past Predictions</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="about.html" target="_blank">Credits</a>
                        </div>
                    </li> -->
                </ul>

            </div>
        </div>
    </nav>


    <!-- Navigation bar ends -->


    <div class="wrapper container-fluid">
        <section class="section section-shaped rounded" style="padding-bottom:2rem;">
            <div class="shape shape-primary" style="height: 100px;">
            </div>
        </section>
    </div>

  <div id="page">
    <section class="section  pb-0" id="other-section" style="padding-top:1rem;">
        <section class="section  pb-0" style="padding-top:1rem;">
            <div class="container-fluid">
                <div class="card shadow">
                    <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;height: ; display:none;">
                        <div class="row">
                            <div class="container">
                                <div class="col-md data-column">
                                    <h1>WELCOME TO IIT KANPUR REAL-TIME FOG PREDICTION WEBSITE.</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>
    <section class="secton pb-0" id="mapFog-section" style="padding-top:1rem;display: none">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="container-fluid">
                        <div class="row justify-content-center">
                            <div class="col-lg  map-data d-flex justify-content-center">
                                <div id="map1" style="width: 100%;height: 500px"></div>
                                <!-- <img src="img/cords.jpg" alt="Map" style="height:90%;max-height: 532px;" > -->
                            </div>
                        </div>
                    </div>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md">
                                <h3 id="cityname">Location: Select a location</h3><span id="latlong" style="visibility: hidden;"></span>
                            </div>
                            <div class="col-md-10" id="data-detail">
                                Loading....
                            </div>


                        </div>

                    </div>
                </div>
                
                    
                <div id="unique" class="col-md-8 margin-top">
                   <div style="height:30px"></div>
                    <div class="container pt-3" style="font-size:21px;">
                       
                        Visibility below 1 km indicates presence of fog.
                    </div>
                    <section class="section  pb-0" id="" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:1rem">
                                        <div class="row">
                                            <div class="container-fluid" style="padding:">
                                                <p class="">
                                                    To view the data of certain period of time select the start and end date
                                                </p>
                                                <div class="form-group row">
                                                    <div class="col">
                                                        <label>Start Date</label>
                                                        <div >
                                                            <input type="date" class="form-control form-control-lg w-75 " id="start_date" type="text" placeholder="dd/mm/yyyy">
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="col">
                                                        <label>End Date</label>
                                                        <div>
                                                            <input type="date" class="form-control form-control-lg w-75 " id="end_date" type="text" placeholder="dd/mm/yyyy">
                                                        </div>
                                                    </div>
                                                
                                                    <div class="col">
                                                        <button type="submit" onclick="sub()" class="btn btn-primary h-50 mt-4 ">Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Visibility-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;" >
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="Visibility"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Visibility-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="0hr"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Temperature-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="Temperature"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Humidity-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="Humidity"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Wind-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="Wind"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section class="section  pb-0" id="Rainfall-section" style="padding-top:0">
                        <section class="section  pb-0" style="padding-top:1rem;">
                            <div class="container-fluid">
                                <div class="card shadow">
                                    <div class="card-body rounded " style="padding:0">
                                        <div class="row">
                                            <div class="container-fluid">
                                                <div class="col-md data-column">
                                                    <div id="Rainfall"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <div class="container" style="font-size: 25px;color: red; margin-top: 20px;">
                        <a href="./moremodel.html" target="_blank" >Want to explore different Prediction models? Click here</a>
                    
                    </div>
                    </div>
                </div>
            </div>
            
    </section>
        <!-- <div id="loading" style="height: 500px;"></div> -->
  </div>
    



    <section class="section pb-0" style="padding-top:1rem;margin-bottom:1rem">
        <div class="container-fluid">
            <div class="card shadow">
                <div class="card-body bg-gradient-primary rounded ">
                    <div class="row justify-content-center" style="color:white;">
                        <a href="./about.html" target="_blank" style="color: #ffffff;"><p>© Fog Prediction , IIT Kanpur. All rights reserved.</p></a>
                    </div>
                    <div class="row justify-content-center" style="color:white;">    
                        <?php 
                        $flag=0;
                        $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
                        if (!$conn) { 
                            // echo "An error occurred.\n"; 
                            $flag=1;  
                        }  
                        if($flag==0){
                            $sql = 'Select sum(index) from visits ';
                            $result = pg_query($conn, $sql);
                            
                            if (!$result) { 
                            // echo "An error occurred 2.\n"; 
                                $flag=1;  
                            } 
                            else{
                                $count=pg_fetch_row($result);
                                echo "<p >Total Visitors: {$count[0]}</p>";
                            }

                            
                        }
                        
                        
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script src="./assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
    <script src="./assets/js/core/jquery.min.js" type="text/javascript"></script>
    <script src="./assets/js/core/popper.min.js" type="text/javascript"></script>
    <script src="./assets/js/core/bootstrap.min.js" type="text/javascript"></script>
    <script src="./assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
    <script src="./assets/js/plugins/bootstrap-switch.js"></script>

    <script src="./assets/js/plugins/nouislider.min.js" type="text/javascript"></script>
    <script src="./assets/js/plugins/moment.min.js"></script>
    <script src="./assets/js/plugins/datetimepicker.js" type="text/javascript"></script>

    <script src="./assets/js/plugins/bootstrap-datepicker.min.js"></script>
    <script src="./assets/js/argon-design-system.min.js?v=1.2.0" type="text/javascript"></script>

    <script src="./assets/chart-library/core.js"></script>
    <script src="./assets/chart-library/charts.js"></script>
    <script src="./assets/chart-library/themes/material.js"></script>
    <script src="./assets/chart-library/themes/animated.js"></script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script src="js/long_tem_test.js"></script>
                    
    <script>
     
        document.getElementById('myInput').value = 'Lucknow';
        loaddata(4);
    </script>
</body>

</html>


