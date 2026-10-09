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








    <link rel="preconnect" href="https://fonts.gstatic.com">

    <script type="text/javascript" src="./amcharts4/ammap.js"></script>

    <script type="text/javascript" src="./geodata/indiaHigh.js"></script>
    <script type="text/javascript" src="./geodata/india2019High.js"></script>
    <script src="https://www.amcharts.com/lib/3/maps/js/indiaLow.js"></script>

    <link rel="stylesheet" href="/assets/css/theme.css">
    <script>(function(){try{var t=localStorage.getItem('fog-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch(e){}})();</script>
</head>

<body id="body_" class="index-page site-page archive-page">

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 3) . '/navbar.php'; ?>
<main class="page page-archive page-archive-comparedata"><div class="page-header"><h1>Compare Locations Data</h1></div>



        <div class="wrapper container-fluid">
            <section class="section section-shaped rounded">
                <div class="shape shape-primary">
                </div>
            </section>
        </div>

        <div id="sel-div" style="display: none;">
            <div class="container-fluid">
                <div>
                    <div>

                        <div class="row">
                            <div class="col-md">
                                <h2><b>Select Locations to Compare (up to 4) </b></h2>
                            </div>
                        </div>
                        <div align="center">
                            <select multiple="" id="stations_in" class="form-control">
                            </select>
                        </div>

                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-5 data-column"></div>
                    <div class="col-md-2">
                        <button id="compare-button" type="button" class="btn btn-primary">Compare</button>
                    </div>
                    <div class="col-md-5 data-column"></div>
                </div>
            </div>
        </div>

        <div class="container-fluid ">

                <section id="compchart-div" class="section  pb-0">
                    <div class="container">
                        <div class="card">
                            <div class="card-body">
                                <div id="compchart"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="TempComp-div" class="section  pb-0">
                    <div class="container">
                        <div class="card">
                            <div class="card-body">
                                <div id="TempComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="HumidityComp-div" class="section  pb-0">
                    <div class="container">
                        <div class="card">
                            <div class="card-body">
                                <div id="HumidityComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="WindComp-div" class="section  pb-0">
                    <div class="container">
                        <div class="card">
                            <div class="card-body">
                                <div id="WindComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
        </main>
<div id="footr" hidden></div>
<?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include dirname(__DIR__, 3) . '/footer.php'; ?>
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
