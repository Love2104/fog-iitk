<?php include 'apis/start_admin.php'; ?>

<?php 
    
    $page='compare';
    $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
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
            SET "compare_results" = "compare_results" + 1
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
    <title>Compare Locations Data</title>
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
    <style>
        .highcharts-credits{
            display:none;
        }
    </style>
</head>

<body id="body_" class="index-page" style="font-family: 'Libre Baskerville', serif;">

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
                        <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Compare Locations</h2>
                    </div>
                    <ul class="navbar-nav ml-lg-auto">
                        
                        <li>
                            <div class="row">
                                <div class="col-md-4" style="height:60px;">
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
        <?php $_GET['page'] = "compare"; include "navbar.php" ?>


        <!-- Navigation bar ends -->


        <div class="wrapper container-fluid">
            <section class="section section-shaped rounded" style="padding-bottom:2rem;">
                <div class="shape shape-primary" style="height: 100px;">
                </div>
            </section>
        </div>

        <div id="sel-div" style="display: none;">
            <div class="container-fluid">
                <div style="padding-top:20px ;">
                    <div style="padding:1rem 2rem 1rem 2rem">
    
                        <div class="row">
                            <div class="col-md" style="text-align: center;">
                                <h2><b>Select Locations to Compare (up to 4) </b></h2>
                            </div>
                        </div>
                        <div align="center">
                            <select multiple="" id="stations_in" class="form-control" style="width: 25%;">
                            </select>
                        </div>
    
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row justify-content-center" style="padding: 10px;">
                    <div class="col-md-5 data-column"></div>
                    <div class="col-md-2">
                        <button id="compare-button" type="button" class="btn btn-primary">Compare</button>
                    </div>
                    <div class="col-md-5 data-column"></div>
                </div>
            </div>
        </div>
        
        <div class="container-fluid ">
    
                <section id="compchart-div" class="section  pb-0" style="padding-top:1rem;display: none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem">
                                <div id="compchart"></div>
                            </div>
                        </div>
                    </div>
                </section>
    
                <section id="TempComp-div" class="section  pb-0" style="padding-top:1rem;display: none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                                <div id="TempComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="HumidityComp-div" class="section  pb-0" style="padding-top:1rem;display: none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                                <div id="HumidityComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="WindComp-div" class="section  pb-0" style="padding-top:1rem;display: none;margin-bottom: 40px;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                                <div id="WindComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
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

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
<script src="./assets/chart-library/core.js"></script>
<script src="./assets/chart-library/charts.js"></script>
<script src="./assets/chart-library/themes/material.js"></script>
<script src="./assets/chart-library/themes/animated.js"></script>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/stock/modules/data.js"></script>
<script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>

<script>
     window.addEventListener('load', function() {
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>

    <script src="./js/compare.js"></script>
    
</body>

</html>
