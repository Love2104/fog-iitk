<?php include 'apis/start_admin.php'; ?>
<?php 
    // session_start();
    // $page='sensordata';
    // if($_SESSION['last_page_visited'] != $page ) {
    //     $flag=0;
    //     $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
    //     if (!$conn) { 
    //         //echo "An error occurred.\n"; 
    //         $flag=1;  
    //     }  
    //     $sql = 'UPDATE visits 
    //     SET "iit_kanpur" = "iit_kanpur" + 1
    //     WHERE "id" = 1';
    //     $result = pg_query($conn, $sql);
    //     if (!$result) {  
    //      //echo "An error occurred.\n";
    //      $flag=1;  
    //     }  
    //     if($flag==0){
    //     $_SESSION['last_page_visited'] = $page;}  
    // }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Long-term Forecast</title>
    <!-- <link rel="stylesheet" href="css/main.css"> -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->
    <style>
        .highcharts-credits{
            display:none;
        }
    </style>
    <style>
        .autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            /*position the autocomplete items to be the same width as the container:*/
            top: 100%;
            /*left: 0;
            right: 0;*/
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
    
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') { document.documentElement.setAttribute('data-theme', t); }
  } catch (e) {}
})();
</script>
</head>

<body id="page" class="index-page" style="font-family: 'Libre Baskerville', serif;">

    <!-- Navigation bar starts -->

    <!-- <nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
        <div class="container">
            <a class="navbar-brand mr-md-6" href="../fog-prediction/"><img class="img-fluid" src="./assets/img/fps1.png" style="height: 60px;width: 350px;"></a>
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
                <div class="navbar-nav flex-row mr-auto ml-4 d-none d-md-flex">
                    <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Long Term Fog Index Prediction</h2>
                </div>
                <ul class="navbar-nav ml-lg-auto">
                    <li>
                        <div class="row">
                            <div class="col-md-12" style="height:60px;">
                                <form role="form" autocomplete="off" method="GET">
                                    <div class="form-group">
                                        <div class="autocomplete input-group">
                                            <a href="../fog-prediction/" class="nav-link">
                                                <span class="nav-link-inner--text"><button type="button" class="btn btn-primary btn-fab btn-icon btn-round fa fa-home">Home</button></span>
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    </nav> -->
    <?php $_GET['page'] = "long"; include "navbar.php" ?>


    <!-- Navigation bar ends -->


    <div class="wrapper container-fuild">
        <section class="section section-shaped rounded" style="padding-bottom:2rem;">
            <div class="shape shape-primary" style="height: 100px;">
            </div>
        </section>
    </div>
    <div class="container w-50" >
                      
        <form role="form" autocomplete="off" method="GET">
            <div class="form-group">
                <div class="autocomplete input-group">
                    <div class="container pt-3">
                        <div class="d-flex flex-row justify-content-center">
                            <div class="">
                                <input id="myInput" class="form-control" placeholder="Select a location" type="text" value="Lucknow">
                            </div>
                            <div class="" >
                                <input type="button" class="btn btn-primary btn-fab btn-icon btn-round ml-3" value="Go" onclick="loaddata(4)">
                            </div>
                        <!--<a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                            <span class="nav-link-inner--text"><button type="button" class="btn btn-primary dropdown-toggle" id="model-choose">Choose Model</button></span>
                        </a>-->
                        <!--<div class="dropdown-menu dropdown-menu-left" aria-labelledby="navbar-default_dropdown_1">-->
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

    <div id="chart-show" class="container" style="display: none;">
        <section class="section  pb-0" style="padding-top:1rem;">
            <div class="container" align="center">
                <h2>Long-term Forecast</h2>
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
            <section class="section  pb-0" id="Visibility-section" style="padding-top:0">
                <section class="section  pb-0" style="padding-top:1rem;">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:0">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="6hr"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="Layer-Temperature-section" style="padding-top:0">
                <section class="section  pb-0" style="padding-top:1rem;">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:0">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="1day"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>
            </section>
            <section class="section  pb-0" id="Layer-Humidity-section" style="padding-top:0">
                <section class="section  pb-0" style="padding-top:1rem;">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:0">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="3day"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="PM-section" style="padding-top:0">
                <section class="section  pb-0" style="padding-top:1rem;">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:0">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="5day"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            
        </section>
        

        </div>
        
        

        
        
        <!-- <div class="container-fluid card shadow" id="response" style="height: 300px;overflow-y: scroll;padding:15px;margin-top:10px;margin-bottom: 20px;display: none;">
            </div> -->
    <section id="footr" class="section  pb-0" style="padding-top:1rem;margin-bottom:1rem;display: none;">
        <div class="container-fuild">
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

    <script src="./assets/js/plugins/bootstrap-datepicker.min.js"></script>
    <script src="./assets/js/argon-design-system.min.js?v=1.2.0" type="text/javascript"></script>

    <script src="./assets/chart-library/core.js"></script>
    <script src="./assets/chart-library/charts.js"></script>
    <script src="./assets/chart-library/themes/material.js"></script>
    <script src="./assets/chart-library/themes/animated.js"></script>


    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
    <!-- <script src="./assets/chart-library/histogram-bellcurve.js"></script> -->
    <script src="https://code.highcharts.com/stock/9.1.2/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/9.1.2/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/9.1.2/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/stock/9.1.2/modules/export-data.js"></script>
    <!-- <script>
     window.addEventListener('load', function() {
        console.log(window.performance.timing.navigationStart)
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script> -->
    <script src="./js/fog_index.js"></script>
    
    <!--<script src="./js/highcharts.js"></script>
     <script src="./js/sensordata2.js"></script> -->
    
</body>

</html>
