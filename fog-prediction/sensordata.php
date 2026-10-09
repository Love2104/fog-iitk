<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Fog Prediction</title>
    <!-- <link rel="stylesheet" href="css/main.css"> -->








    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->


    <link rel="stylesheet" href="/assets/css/theme.css">
    <script>(function(){try{var t=localStorage.getItem('fog-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch(e){}})();</script>
</head>

<body id="page" class="index-page site-page archive-page">

    <!-- Navigation bar starts -->

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 1) . '/navbar.php'; ?>
<main class="page page-archive page-archive-sensordata page-sensor-archive"><div class="page-header"><h1>Data From AWS Server</h1></div>



    <!-- Navigation bar ends -->




    <div class="container" align="center">
        <h2>Data From AWS Server</h2>
    </div>
    <div id="chart-show" class="container-fluid " style="display: none;" >
        <section class="section  pb-0" id="Temperature-section">
            <section class="section  pb-0">
                <div class="container-fluid">
                    <div class="card">
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
                    <div class="card">
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
                    <div class="card">
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
                    <div class="card">
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

        </div>
        <div class="container-fluid card shadow" id="response">
            </div>
    </main>
<div id="footr" hidden></div>
<?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include dirname(__DIR__, 1) . '/footer.php'; ?>







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

    <script src="./js/sensordata.js"></script>

</body>

</html>
