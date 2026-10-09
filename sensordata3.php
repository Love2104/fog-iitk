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
    //     pg_close($conn);
    // }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>IIT Kanpur Page</title>
    <link rel="stylesheet" href="assets/css/theme.css">
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (e) {}
})();
</script>


</head>

<body id="page" class="index-page site-page">

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include __DIR__ . '/navbar.php'; ?>


    <main class="page page-sensor-archive">
    <div class="page-header"><h1>IIT Kanpur Sensor Data</h1></div>
    <div id="chart-show2" class="container" style="display: none;">
        <section class="section  pb-0">
            <div class="container" align="center">
                <h2>Data From Sensors</h2>
            </div>

            <section class="section  pb-0" id="">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <p class="">
                                            To view the data of certain period of time select the start and end date
                                        </p>
                                        <div class="form-group row">
                                            <div class="col">
                                                <label>Start Date</label>
                                                <div >
                                                    <input type="date" class="form-control date" id="sensor_start_date" type="text" placeholder="dd/mm/yyyy">
                                                </div>
                                            </div>

                                            <div class="col">
                                                <label>End Date</label>
                                                <div>
                                                    <input type="date" class="form-control date" id="sensor_end_date" type="text" placeholder="dd/mm/yyyy">
                                                </div>
                                            </div>

                                            <div class="col">
                                                <button type="submit" onclick="sensor_sub()" class="btn">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="Visibility-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
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
            <section class="section  pb-0" id="Layer-Temperature-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="Layer-Temperature"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>
            </section>
            <section class="section  pb-0" id="Layer-Humidity-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="Layer-Humidity"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="PM-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="PM"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="NC-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="NC"></div>
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
    <div id="chart-show" class="container" style="display: none;" >

        <section class="section  pb-0">
            <div class="container" align="center">
                <h2>Data From AWS Server</h2>
            </div>
            <section class="section  pb-0" id="Temperature-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
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
            <section class="section  pb-0" id="Humidity-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
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
            <section class="section  pb-0" id="Wind-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
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
            <section class="section  pb-0" id="Sunshine-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="sunshine"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="AtmosPressure-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="atmospressure"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section class="section  pb-0" id="Rain-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card chart-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="rain"></div>
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


        <!-- <div class="container-fluid card shadow" id="response">
            </div> -->
    <div id="footr" hidden></div>







    </main>

    <?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include __DIR__ . '/footer.php'; ?>

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

    <script src="./js/sensordata3.js"></script>
    <!-- <script src="./js/sensordata2.js"></script> -->

</body>

</html>
