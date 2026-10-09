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
    <link rel="stylesheet" href="assets/css/theme.css">
    <!-- <link rel="stylesheet" href="css/main.css"> -->
    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->



<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
</script>
</head>

<body id="page" class="index-page site-page">

    <!-- Navigation bar starts -->


    <?php $_GET['page'] = "long"; define("FOG_HEAD_DONE", true); include "navbar.php" ?>


    <!-- Navigation bar ends -->
    <main class="page page-long-term">
    <div class="page-header"><h1>Long-term Forecast</h1></div>
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
                            <!--<a class="dropdown-item" modelno="2" onclick="checkModel(this)" href="#">Multilayer Perceptron (MLP)</a>
                            <a class="dropdown-item" modelno="3" onclick="checkModel(this)" href="#">Gradient Boosting 1</a>-->
                            <!-- <a class="dropdown-item" modelno="4" onclick="loaddata(this)" href="#">Gradient Boosting Regressor</a>
                            <a class="dropdown-item" modelno="5" onclick="loaddata(this)" href="#">Model 5</a>-->
                        <!--</div>-->
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="chart-show" class="container" style="display:none;">
        <section class="section  pb-0">
            <section class="section  pb-0" id="">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
                                <div class="row">
                                    <div class="container-fluid">
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
            <section class="section  pb-0" id="Visibility-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
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
            <section class="section  pb-0" id="Visibility-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
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
            <section class="section  pb-0" id="Layer-Temperature-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
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
            <section class="section  pb-0" id="Layer-Humidity-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
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
            <section class="section  pb-0" id="PM-section">
                <section class="section  pb-0">
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded ">
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





        <!-- <div class="container-fluid card shadow" id="response" style="display:none;">
            </div> -->
    </main>
    <div id="footr" hidden></div>
    <?php $footerCopyrightHtml = "&copy; Fog Prediction , IIT Kanpur. All rights reserved."; include __DIR__ . "/footer.php"; ?>







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
