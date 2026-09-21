<?php 
    include 'apis/start_admin.php';
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
    $conn = @pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
    if ($conn) {
        if (!isset($_SESSION['last_page_visited']) || $_SESSION['last_page_visited'] != $page) {
            $sql = 'Select * from visits where "date"='."'".date("Y-m-d")."'";
            $result = @pg_query($conn, $sql);
            if ($result) {
                $is_user = pg_fetch_row($result);
                if (!$is_user) {
                    $sql = 'INSERT INTO public.visits(index, past_prediction, compare_results, iit_kanpur, about, "date") VALUES (0,0,0,0,0,'."'".date("Y-m-d")."'".');';
                    @pg_query($conn, $sql);
                } else {
                    $sql = 'UPDATE visits SET "past_prediction" = "past_prediction" + 1 WHERE "date" = '."'".date("Y-m-d")."'";
                    @pg_query($conn, $sql);
                }
                $_SESSION['last_page_visited'] = $page;
            }
        }
        @pg_close($conn);
    }
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Short-term Forecast Comparison</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->

    <style>
        .highcharts-credits{
            display:none;
        }
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
        
        #compchart-section {
            display: none;
        }
    </style>
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

<body id="page" class="index-page" style="font-family: 'Libre Baskerville', serif;">

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
                    <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Short-term Forecast Comparison</h2>
                </div>
                <ul class="navbar-nav ml-lg-auto">
                    <li>
                        <div class="row">
                            <div class="col-md-12" style="height:60px;">
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


    <!-- REDESIGNED CONTENT AREA -->
    <style>
        body.index-page {
            background-color: #F8FAFC !important;
        }
        .scientific-container {
            max-width: 960px;
            margin: 0 auto;
            padding-top: 64px;
        }
        .scientific-header {
            margin-bottom: 24px;
            padding: 0 16px;
        }
        .scientific-header h1 {
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
            font-size: 26px;
            font-weight: 600;
            color: #0F172A;
            letter-spacing: -0.02em;
            margin-bottom: 8px;
        }
        .scientific-header p {
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
            font-size: 14px;
            color: #64748B;
            font-weight: 500;
            margin: 0;
        }
        .scientific-divider {
            border: 0;
            border-top: 1px solid #E2E8F0;
            margin-bottom: 32px;
            margin-left: 16px;
            margin-right: 16px;
        }
        .scientific-input {
            background: #FFFFFF;
            border: 1px solid #CBD5E1;
            border-radius: 4px;
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
            font-size: 14px;
            color: #334155;
            padding: 10px 12px;
            width: 100%;
            transition: all 0.2s ease;
        }
        .scientific-input:focus {
            border-color: #0F172A;
            outline: none;
            box-shadow: 0 0 0 1px #0F172A;
        }
        .scientific-label {
            display: block;
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748B;
            margin-bottom: 6px;
        }
        .scientific-btn {
            background: #0F172A !important;
            color: #fff !important;
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
            padding: 10px 24px !important;
            border-radius: 6px !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-shadow: none !important;
            height: auto !important;
        }
        .scientific-btn:hover {
            background: #334155 !important;
        }
        .form-grid {
            display: flex;
            gap: 16px;
            align-items: flex-end;
            padding: 0 16px;
            margin-bottom: 40px;
        }
        .form-group-custom {
            flex: 1;
            min-width: 200px;
        }
    </style>

    <div class="scientific-container">
        <div class="scientific-header">
            <h1>Short-Term Forecast Comparison</h1>
            <p>Compare predicted vs observed visibility by lead time.</p>
        </div>
        <hr class="scientific-divider">

        <div class="form-grid">
            <div class="form-group-custom">
                <label class="scientific-label">City / Station</label>
                <form role="form" autocomplete="off" method="GET" style="margin:0;">
                    <div class="autocomplete" style="width:100%;">
                        <input id="myInputFirst" class="scientific-input" placeholder="Enter City...." type="text" required>
                    </div>
                </form>
            </div>
            
            <div class="form-group-custom">
                <label class="scientific-label">Model</label>
                <button type="button" class="scientific-btn" id="model-choose" onclick="checkModel(this)" modelno="4" style="width:100%; text-align: left;">Gradient Boosting Regressor</button>
                <div class="dropdown-menu dropdown-menu-left" aria-labelledby="model-choose" style="display:none;">
                </div>
            </div>

            <div class="form-group-custom" id="mod4" style="display:none;">
                <label class="scientific-label">Lead Time</label>
                <a href="#" data-toggle="dropdown" role="button" style="text-decoration:none;">
                    <button type="button" class="scientific-btn" id="hr-choose" style="width:100%; text-align: left;">Choose Hourwise</button>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" modelno="405" onclick="onModelChange(this)" href="#">0.5 hour</a>
                    <a class="dropdown-item" modelno="410" onclick="onModelChange(this)" href="#">1 hour</a>
                    <a class="dropdown-item" modelno="415" onclick="onModelChange(this)" href="#">1.5 hour</a>
                    <a class="dropdown-item" modelno="420" onclick="onModelChange(this)" href="#">2 hour</a>
                    <a class="dropdown-item" modelno="425" onclick="onModelChange(this)" href="#">2.5 hour</a>
                    <a class="dropdown-item" modelno="4" onclick="onModelChange(this)" href="#">3 hour</a>
                </div>
            </div>
        </div>
    </div>
    <div class="scientific-container">
        <div id="curvspred-div" style="display: none; border: 1px solid #E2E8F0; padding: 24px; border-radius: 4px; background: #FFFFFF; margin-bottom: 40px;">
            <div id="curvspred" style="height: 600px; margin-bottom: 24px;"></div>
            <div id="rmsec" style="height: 400px;"></div>
        </div>        
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
