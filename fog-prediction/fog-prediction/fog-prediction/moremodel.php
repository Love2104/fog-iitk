<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "./include/head.php"; ?>


    <script type="text/javascript" src="./amcharts4/ammap.js"></script>

    <script type="text/javascript" src="./geodata/indiaHigh.js"></script>
    <script type="text/javascript" src="./geodata/india2019High.js"></script>
    <script src="https://www.amcharts.com/lib/3/maps/js/indiaLow.js"></script>

    <!-- <script src="https://code.highcharts.com/stock/modules/export-data.js"></script> -->

</head>

<body class="index-page site-page archive-page">

    <!-- Navigation bar starts -->

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 3) . '/navbar.php'; ?>
<main class="page page-archive page-archive-moremodel page-archive-index"><div class="page-header"><h1>This is the Website For Fog Prediction.</h1></div><div class="archive-controls"><form role="form" autocomplete="off" method="GET">
                                    <div class="form-group">
                                        <div class="autocomplete input-group">
                                            <input id="myInput" class="form-control" placeholder="Search" type="text">
                                            <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="Click" onclick="loaddata(4)">

                                        </div>
                                    </div>
                                </form><div class="archive-model-controls"><span>Choose Model</span><a class="dropdown-item" modelno="1" onclick="onModelChange(this)" href="#">Model 1</a><a class="dropdown-item" modelno="2" onclick="onModelChange(this)" href="#">Model 2</a><a class="dropdown-item" modelno="3" onclick="onModelChange(this)" href="#">Model 3</a><a class="dropdown-item" modelno="4" onclick="onModelChange(this)" href="#">Gradient Boosting Regressor</a><span>More</span><a href="comparedata.php" target="_blank">Compare Results</a><a href="curvspred.php" target="_blank">Past Predictions</a></div></div>



    <!-- Navigation bar ends -->




    <!-- <section class="section  pb-0" id="Map-section">
    <section class="section  pb-0">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 map-data d-flex justify-content-center">
            <img src="img/cords.jpg" alt="Map" >
          </div>
        </div>
      </div>
    </section>
  </section> -->



    <!-- <section class="section  pb-0" id="Fog-section">
    <section class="section  pb-0">
      <div class="container">
        <div class="card">
          <div class="card-body"> -->

    <!-- <div class="row">
              <div class="col-md-4" >
                <div><br><h5><b>TIR</b></h5></div>
                <div>
                  <img class="img-fluid rounded shadow-lg" src="./img/bk.png">
                  <img class="img-fluid rounded shadow-lg" src="./img/1.gif">
                </div>
              </div>
              <div class="col-md-12 map-data">
                <div class="map-column">
                    <img src="img/india.png">
                    <input title="Delhi" cityid="1" onclick="loaddata(this)" id="delhi-radio" name="city" type="radio" onclick="">
                    <input title="Lucknow" cityid="2" onclick="loaddata(this)" id="lucknow-radio" name="city" type="radio" onclick="">
                </div>
              </div>
            </div> -->

    <!-- <div class="row">
              <div class="container">
                <div class="col-md data-column">
                  <div id="Fog"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section> -->

  <div id="page">
    <section class="section  pb-0" id="other-section" >
        <section class="section  pb-0">
            <div class="container-fluid">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="container">
                                <div class="col-md data-column">
                                    <h1>This is the Website For Fog Prediction.</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>
    <section class="secton pb-0" id="mapFog-section">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="container-fluid">
                        <div class="row justify-content-center">
                            <div class="col-lg  map-data d-flex justify-content-center">
                                <div id="map1"></div>
                                <!-- <img src="img/cords.jpg" alt="Map" > -->
                            </div>
                        </div>
                    </div>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md">
                                <h3 id="cityname">City : Select the city</h3><span id="latlong" style="visibility: hidden;"></span>
                            </div>
                            <div class="col-md-10" id="data-detail">

                            </div>


                        </div>

                    </div>
                </div>

                <div id="unique" class="col-md-8 margin-top">
                    <div class="container">
                        Fog is considered when visibility falls below 1 km.
                    </div>
                    <div class="container-fluid">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="container-fluid">
                                        <div class="col-md data-column">
                                            <div id="Fog"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    </div>
                </div>
            </div>
    </section>
        <!-- <div id="loading"></div> -->
  </div>




  </main>
<?php include "./include/tail.php"; ?>


    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script src="js/main4.js"></script>

    <script>
        document.getElementById('myInput').value = 'Lucknow';
        loaddata(4);
    </script>
</body>

</html>
