<?php
    include 'apis/start_admin.php';
    // session_start();
    // // $page='past_prediction';
    // // if($_SESSION['last_page_visited'] != $page ) {
    // //     $flag=0;

    // //     if (!$conn) {
    // //         //echo "An error occurred.\n";
    // //         $flag=1;
    // //     }
    // //     $sql = 'UPDATE visits
    // //     SET "past_prediction" = "past_prediction" + 1
    // //     WHERE "id" = 1';
    // //     $result = pg_query($conn, $sql);
    // //     if (!$result) {
    // //      //echo "An error occurred.\n";
    // //      $flag=1;
    // //     }
    // //     if($flag==0){
    // //         $_SESSION['last_page_visited'] = $page;  }
    // //         pg_close($conn);    }
    // $page='past_prediction';
    // $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
    // // echo $_SESSION['last_page_visited'];
    // if($_SESSION['last_page_visited'] != $page ) {


    //     $sql = 'Select * from visits where "date"='."'".date("Y-m-d")."'";
    //     $result = pg_query($conn, $sql);

    //     if (!$result) {
    //     //echo "An error occurred.\n";
    //         $flag=1;
    //     }
    //     else{
    //         $is_user=pg_fetch_row($result);
    //     }
    //     // echo $is_user.'in';
    //     if(!$is_user){

    //         $sql='INSERT INTO public.visits(
    //             index, past_prediction, compare_results, iit_kanpur, about, "date")
    //             VALUES (0,0,0,0,0,'."'".date("Y-m-d")."'".');';
    //         $result = pg_query($conn, $sql);
    //         if (!$result) {
    //         //echo "An error occurred.\n";
    //             $flag=1;
    //         }
    //         if($flag==0){
    //             $_SESSION['last_page_visited'] = $page;}
    //     }
    //     else{
    //         $sql = 'UPDATE visits
    //         SET "past_prediction" = "past_prediction" + 1
    //         WHERE "date" = '."'".date("Y-m-d")."'";
    //         $result = pg_query($conn, $sql);
    //         if (!$result) {
    //         //echo "An error occurred.\n";
    //             $flag=1;
    //         }
    //         if($flag==0){
    //             $_SESSION['last_page_visited'] = $page;}
    //     }

    // }
    // pg_close($conn);
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Long-Term Forecast Comparison</title>
    <link rel="stylesheet" href="assets/css/theme.css">
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


    <?php $_GET['page'] = "compare"; define("FOG_HEAD_DONE", true); include "navbar.php" ?>


    <!-- Navigation bar ends -->


    <!-- REDESIGNED CONTENT AREA -->


    <main class="page page-comparison">
    <div class="scientific-container">
        <div class="scientific-header">
            <h1>Long-Term Forecast Comparison</h1>
            <p>Evaluate the forecast fog index against the observed record.</p>
        </div>
        <hr class="scientific-divider">

        <div class="form-grid">
            <div class="form-group-custom">
                <form role="form" autocomplete="off" method="GET">
                    <label class="scientific-label">City / Station</label>
                    <div class="autocomplete" style="display:flex;">
                        <input id="myInput" class="scientific-input" placeholder="Select a location" type="text" value="Lucknow">
                        <input type="button" class="scientific-btn" value="Go" onclick="loaddata(4)">
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="scientific-container">
        <div id="curvspred-div" style="display:none;">
            <div id="curvspred"></div>
            <div id="rmsec"></div>
        </div>
    </div>
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

    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/stock/modules/export-data.js"></script>

    <script src="./js/long_pred_comp.js"></script>
    <script>

    </script>
    <!-- <script>
     window.addEventListener('load', function() {
        console.log(window.performance.timing.navigationStart)
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script> -->
</body>

</html>
