<?php include 'apis/start_admin.php'; ?>
<?php
    // $page='past_prediction';
    // if($_SESSION['last_page_visited'] != $page ) {
    //     $flag=0;

    //     if (!$conn) {
    //         //echo "An error occurred.\n";
    //         $flag=1;
    //     }
    //     $sql = 'UPDATE visits
    //     SET "past_prediction" = "past_prediction" + 1
    //     WHERE "id" = 1';
    //     $result = pg_query($conn, $sql);
    //     if (!$result) {
    //      //echo "An error occurred.\n";
    //      $flag=1;
    //     }
    //     if($flag==0){
    //         $_SESSION['last_page_visited'] = $page;  }
    //         pg_close($conn);    }
    $page='past_prediction';
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
            SET "past_prediction" = "past_prediction" + 1
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
    <title>Short-term Forecast Comparison</title>









    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->


    <link rel="stylesheet" href="/assets/css/theme.css">
    <script>(function(){try{var t=localStorage.getItem('fog-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch(e){}})();</script>
</head>

<body id="page" class="index-page site-page archive-page">

    <!-- Navigation bar starts -->


    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 2) . '/navbar.php'; ?>
<main class="page page-archive page-archive-short_term_forecast_comp"><div class="page-header"><h1>Short-term Forecast Comparison</h1></div>



    <!-- Navigation bar ends -->




    <div class="container">
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-2">
                <div class="col-md  map-data d-flex">
                    <form role="form" autocomplete="off" method="GET">
                        <div class="form-group">
                            <div class="autocomplete input-group">
                                <input id="myInputFirst" class="form-control" placeholder="Enter City...." type="text" width="50%" required>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-md-4">
                <!-- <a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button"> -->
                    <!-- <span class="nav-link-inner--text"><button type="button" class="btn btn-primary dropdown-toggle" id="model-choose">Choose Model</button></span> -->
                     <span class="nav-link-inner--text"> <button type="button" class="btn btn-primary" id="model-choose" onclick="checkModel(this)"  modelno="4" >Gradient Boosting Regressor</button> </span>
                <!-- </a> -->

                <div class="dropdown-menu dropdown-menu-left" aria-labelledby="navbar-default_dropdown_1" style="display:none;">
                    <!--<a class="dropdown-item" modelno="1" onclick="checkModel(this)" href="#">Gradient Boosting Multiclassifier</a>
                    <a class="dropdown-item" modelno="2" onclick="checkModel(this)" href="#">Multilayer Perceptron (MLP)</a>
                    <a class="dropdown-item" modelno="3" onclick="checkModel(this)" href="#">Gradient Boosting 1</a>-->
                    <!-- <a class="dropdown-item" modelno="4" onclick="checkModel(this)" href="#">Gradient Boosting Regressor</a> -->

                    <!-- <a class="dropdown-item" modelno="5" onclick="checkModel(this)" href="#">GBR_Past Visibility</a>
                    <a class="dropdown-item" modelno="6" onclick="checkModel(this)" href="#">GBR_Rolling Mean</a> -->

                     <!-- <a class="dropdown-item" modelno="7" onclick="checkModel(this)" href="#">LSTM</a>
                    <a class="dropdown-item" modelno="8" onclick="checkModel(this)" href="#">Light GBM</a>
                    <a class="dropdown-item" modelno="9" onclick="checkModel(this)" href="#">Ensemble</a>
                    <a class="dropdown-item" modelno="10" onclick="checkModel(this)" href="#">GBR Non-Winter Month</a>

                    <a class="dropdown-item" modelno="11" onclick="checkModel(this)" href="#">ALL</a>
                    <a class="dropdown-item" modelno="12" onclick="checkModel(this)" href="#">IIT Kanpur Model</a>  -->

                </div>
            </div>
            <div id="mod4" class="col-md-2">
                <a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="hr-choose">Choose Hourwise</button></span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                    <a class="dropdown-item" modelno="405" onclick="onModelChange(this)" href="#">0.5 hour</a>
                    <a class="dropdown-item" modelno="410" onclick="onModelChange(this)" href="#">1 hour</a>
                    <a class="dropdown-item" modelno="415" onclick="onModelChange(this)" href="#">1.5 hour</a>
                    <a class="dropdown-item" modelno="420" onclick="onModelChange(this)" href="#">2 hour</a>
                    <a class="dropdown-item" modelno="425" onclick="onModelChange(this)" href="#">2.5 hour</a>
                    <a class="dropdown-item" modelno="4" onclick="onModelChange(this)" href="#">3 hour</a>
                    <!-- <a class="dropdown-item" modelno="460" onclick="onModelChange(this)" href="#">6 hour</a> -->

                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="card" id="curvspred-div" style="display: none;">
            <div class="card-body">
                <div id="curvspred"></div>
            </div>
            <!-- <div class="card-body">
                <div id="rmse" align="center"></div>
            </div> -->
            <div class="card-body">
                <div id="rmsec"></div>
            </div>

        </div>
    </div>
    </main>
<div id="footr" hidden></div>
<?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include dirname(__DIR__, 2) . '/footer.php'; ?>







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

    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/stock/modules/export-data.js"></script>

    <script src="./js/curvspred.js"></script>
    <script>
        document.getElementById("myInputFirst").value = 'Lucknow'
        loaddata(4,"Gradient Boosting Regressor")
    </script>
    <script>
     window.addEventListener('load', function() {
        console.log(window.performance.timing.navigationStart)
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>
</body>

</html>
