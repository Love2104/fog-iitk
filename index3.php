<?php 
    session_start();
    $page='index';
    if($_SESSION['last_page_visited'] != $page ) {
        $flag=0;
        $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
        if (!$conn) { 
            //echo "An error occurred.\n"; 
            $flag=1;  
        }  
        $sql = 'UPDATE visits 
        SET "index" = "index" + 1
        WHERE "id" = 1';
        $result = pg_query($conn, $sql);
        if (!$result) {  
         //echo "An error occurred.\n";
         $flag=1;
        }  
        if($flag==0){
        $_SESSION['last_page_visited'] = $page;}
        pg_close($conn);
    }
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
        
        .autocomplete-active {
            background: radial-gradient(rgb(28, 226, 160), rgb(61, 214, 241)) !important;
            color: #ffffff;
        }
    </style>
</head>

<body class="index-page" style="font-family: 'Libre Baskerville', serif;">

    <!-- Navigation bar starts -->

    <nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
        <div class="container">
            <a class="navbar-brand mr-md-6" href="/fog-prediction/"><img class="img-fluid" src="./assets/img/fps1.png" style="height:60px;width: 350px;"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
            <div class="collapse navbar-collapse" id="navbar-default">
                <div class="navbar-collapse-header">
                    <div class="row">
                        <div class="col-6 collapse-brand">

                        </div>
                        <div class="col-6 collapse-close">
                            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                        </button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav ml-lg-auto">
                    <li>
                        <div class="container">
                      
                            <form role="form" autocomplete="off" method="GET">
                                <div class="form-group">
                                    <div class="autocomplete input-group">
                                        <div class="container pt-3">
                                        <div class="d-flex flex-row justify-content-center">
                                            <div class="">
                                            <input id="myInput" class="form-control" placeholder="Select a location" type="text">
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
                    <li class="nav-item ">
                        <a class="nav-link" href="sensordata.php" target="_blank" style="font-size:larger;font-weight: bold;">
                        IIT Kanpur
                        </a>
                    </li>
                    
                    
                        <li class="nav-item ">
                            <a class="nav-link" href="pastprediction.php" target="_blank" style="font-size:larger;font-weight: bold;">
                            PAST PREDICTIONS
                            </a>
                        </li>
                    <li class="nav-item">
                        <a class="nav-link" href="comparedata.php" target="_blank" style="font-size:larger;font-weight: bold;">
                        COMPARE RESULTS
                        </a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link" href="about.php" target="_blank" style="font-size:larger;font-weight: bold;">
                        ABOUT
                        </a>
                    </li>
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
                    <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;height: 500px;">
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

                            </div>


                        </div>

                    </div>
                </div>
                
                    
                <div id="unique" class="col-md-8 margin-top">
                   
                    <div class="container pt-3" style="font-size:21px;">
                       
                        Visibility below 1 km indicates presence of fog.
                    </div>
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

    <script src="js/main4.js"></script>

    <script>
        document.getElementById('myInput').value = 'Lucknow';
        loaddata(4);
    </script>
</body>

</html>
