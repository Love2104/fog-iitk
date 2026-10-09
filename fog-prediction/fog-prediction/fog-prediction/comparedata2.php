<!DOCTYPE html>
<html lang="en">

<head>
  <?php include "./include/head.php"; ?>


</head>

<body id="body_" class="index-page site-page archive-page">

    <!-- Navigation bar starts -->

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 3) . '/navbar.php'; ?>
<main class="page page-archive page-archive-comparedata2"><div class="page-header"><h1>Select the Cities Name</h1></div>



    <!-- Navigation bar ends -->





    <div class="container-fluid">
        <div>
            <div>

                <div class="row ">
                    <div class="col-md">
                        <h2><b>Select the Cities Name </b></h2>
                    </div>
                </div>

                <div class="row ">
                    <div class="col-md-3 data-column"></div>
                    <div class="col-md-2 ">
                        <div class="col-md  map-data d-flex">
                            <form role="form" autocomplete="off" method="GET">
                                <div class="form-group">
                                    <div class="autocomplete input-group">
                                        <input id="myInputFirst" class="form-control" placeholder="First City" type="text" width="50%" required>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-md-2 data-column"></div>
                    <div class="col-md-2 ">
                        <div class="col-md  map-data d-flex">
                            <form role="form" autocomplete="off" method="GET">
                                <div class="form-group">
                                    <div class="autocomplete input-group">
                                        <input id="myInputSecond" class="form-control" placeholder="Second City" type="text" width="100%" required>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-md-3 data-column"></div>
                </div>


                <div class="row justify-content-center">
                    <div class="col-md-5 data-column"></div>
                    <div class="col-md-2">
                        <button id="compare-button" type="button" class="btn btn-primary">Compare</button>
                    </div>
                    <div class="col-md-5 data-column"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid" id="radio-button-div" style="display: none;">
        <div class="row card shadow">
            <div class="custom-control custom-radio col-md-2 data-column">
                <input name="show-chart" class="custom-control-input" id="customRadio1" type="radio" checked="" value="Visibility">
                <label class="custom-control-label" for="customRadio1">Visibility</label>
            </div>
            <div class="custom-control custom-radio col-md-2 data-column">
                <input name="show-chart" class="custom-control-input" id="customRadio2" type="radio" value="Temperature">
                <label class="custom-control-label" for="customRadio2">Temperature</label>
            </div>
            <div class="custom-control custom-radio col-md-2 data-column">
                <input name="show-chart" class="custom-control-input" id="customRadio3" type="radio" value="Humidity">
                <label class="custom-control-label" for="customRadio3">Humidity</label>
            </div>
            <div class="custom-control custom-radio col-md-2 data-column">
                <input name="show-chart" class="custom-control-input" id="customRadio4" type="radio" value="Wind">
                <label class="custom-control-label" for="customRadio4">Wind</label>
            </div>
        </div>
    </div>

    <div class="container-fluid ">
        <div class="card" id="compchart-div" style="display: none;">
            <div class="card-body">
                <section class="section  pb-0">
                    <section class="section  pb-0">
                        <div class="container-fluid">
                            <div class="card">
                                <div class="card-body">
                                    <div id="compchart"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
        <div class="card" id="TempComp-div" style="display: none;">
            <div class="card-body">
                <section class="section  pb-0">
                    <section class="section  pb-0">
                        <div class="container-fluid">
                            <div class="card">
                                <div class="card-body">
                                    <div id="TempComp"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
        <div class="card" id="HumidityComp-div" style="display: none;">
            <div class="card-body">
                <section class="section  pb-0">
                    <section class="section  pb-0">
                        <div class="container-fluid">
                            <div class="card">
                                <div class="card-body">
                                    <div id="HumidityComp"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
        <div class="card" id="WindComp-div" style="display: none;">
            <div class="card-body">
                <section class="section  pb-0">
                    <section class="section  pb-0">
                        <div class="container-fluid">
                            <div class="card">
                                <div class="card-body">
                                    <div id="WindComp"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    </div>

    </main>
<?php include "./include/tail.php"; ?>


    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>

    <script src="./js/compare2.js"></script>
</body>

</html>
