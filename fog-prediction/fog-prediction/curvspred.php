<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "./include/head.php"; ?>



</head>

<body id="page" class="index-page site-page archive-page">

    <!-- Navigation bar starts -->

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 2) . '/navbar.php'; ?>
<main class="page page-archive page-archive-curvspred"><div class="page-header"><h1>Fog Prediction</h1></div>



    <!-- Navigation bar ends -->




    <div class="container">
        <div class="row">
            <div class="col-md-5"></div>
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
            <div class="col-md-2">
                <a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary dropdown-toggle" id="model-choose">Choose Model</button></span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                    <a class="dropdown-item" modelno="1" onclick="checkModel(1)" href="#">Model 1</a>
                    <a class="dropdown-item" modelno="2" onclick="checkModel(2)" href="#">Model 2</a>
                    <a class="dropdown-item" modelno="3" onclick="checkModel(3)" href="#">Model 3</a>
                    <a class="dropdown-item" modelno="4" onclick="checkModel(4)" href="#">Gradient Boosting</a>
                    <!-- <a class="dropdown-item" modelno="5" onclick="checkModel(5)" href="#">Model 5</a> -->

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
<?php include "./include/tail.php"; ?>


    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/stock/modules/export-data.js"></script>

    <script src="./js/curvspred3.js"></script>
    <script>
        document.getElementById("myInputFirst").value = 'Lucknow'
        checkModel(4)
    </script>
</body>

</html>
