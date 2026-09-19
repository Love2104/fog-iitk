<!DOCTYPE html>
<html lang="en">

<head>
    <?php 
        include "./include/head.php";
    ?>

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
            <a class="navbar-brand mr-md-6 d-lg-4" href="/fog-prediction/"><img class="img-fluid" src="./assets/img/fps1.png" style="height:60px;width: 350px;"></a>
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
                
                    <li class="nav-item">
                        <div class="row">
                            <div class="col-md-12" style="height:60px;">
                                <form role="form" autocomplete="off" method="GET">
                                    <div class="form-group">
                                        <div class="autocomplete input-group" style="padding-top: 17px ;">
                                            <input id="myInput" class="form-control" placeholder="Search" type="text">
                                            <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="Click" onclick="loaddata(4)">

                                        </div>
                                    </div>
                                </form>
                            </div>         
                        </div>
                    </li>
                    <li class="nav-item overflow-ellipsis">
                        <a class="nav-link" href="sensordata.php" target="_blank" style="padding-top:25px;font-size:larger;">
                        IITK
                        </a>
                    </li>
                    <li class="nav-item overflow-ellipsis">
                        <a class="nav-link" href="pastprediction.php" target="_blank" style="padding-top:25px;font-size:larger;">
                        PAST PREDICTIONS
                        </a>
                    </li>
                    <li class="nav-item overflow-ellipsis">
                        <a class="nav-link" href="comparedata.php" target="_blank" style="padding-top:25px;font-size:larger;">
                        COMPARE RESULTS
                        </a>
                    </li>
                    <li class="nav-item overflow-ellipsis">
                        <a class="nav-link" href="about.php" target="_blank" style="padding-top:25px;font-size:larger;">
                        ABOUT
                        </a>
                    </li>
                    <!-- <li class="nav-item dropdown">
                        <a href="#" class="nav-link" data-toggle="dropdown" role="button" aria-expanded="false" aria-haspopup="true">
                            <span class="nav-link-inner--text"><button type="button" class="btn btn-secondary dropdown-toggle">More</button></span>
                        </a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_2">
                            <a class="dropdown-item" href="comparedata.php" target="_blank">Compare Results</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="curvspred.php" target="_blank">Past Predictions</a>
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
                                    <h1>This is the Website For Fog Prediction.</h1>
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
                                <h3 id="cityname">City: Select the city</h3><span id="latlong" style="visibility: hidden;"></span>
                            </div>
                            <div class="col-md-10" id="data-detail">

                            </div>


                        </div>

                    </div>
                </div>

                <div id="unique" class="col-md-8 margin-top">
                    <div class="container" style="font-size:21px;">
                        Fog is considered when visibility falls below 1 km.
                    </div>
                    <div class="container-fluid">
                        <div class="card shadow">
                            <div class="card-body rounded " style="padding:0">
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
                    <div class="container" style="font-size: 25px;color: red; margin-top: 20px;">
                        <a href="./moremodel.php" target="_blank" >Want to explore different Prediction models? Click here</a>
                    
                    </div>
                    </div>
                </div>
            </div>
            
    </section>
        <!-- <div id="loading" style="height: 500px;"></div> -->
  </div>
    



    <?php include "./include/tail.php"; ?>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script src="js/newmain4.js"></script>

    <script>
        document.getElementById('myInput').value = 'Lucknow';
        loaddata(4);
    </script>
</body>

</html>
