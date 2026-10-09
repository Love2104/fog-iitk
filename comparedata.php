<?php
    include 'apis/start_admin.php';

    $page='compare';
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
                    $sql = 'UPDATE visits SET "compare_results" = "compare_results" + 1 WHERE "date" = '."'".date("Y-m-d")."'";
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
    <title>Compare Locations Data</title>
    <link rel="stylesheet" href="assets/css/theme.css">
    <script type="text/javascript" src="./amcharts4/ammap.js"></script>

    <script type="text/javascript" src="./geodata/indiaHigh.js"></script>
    <script type="text/javascript" src="./geodata/india2019High.js"></script>
    <script src="https://www.amcharts.com/lib/3/maps/js/indiaLow.js"></script>

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

<body id="body_" class="index-page site-page">

    <!-- Navigation bar starts -->



        <?php $_GET['page'] = "compare"; define("FOG_HEAD_DONE", true); include "navbar.php" ?>


        <!-- Navigation bar ends -->


        <!-- REDESIGNED CONTENT AREA -->


        <main class="page page-comparison"><div id="sel-div" style="display:none;">
            <div>
                <h1>Real-Time Data Comparison</h1>
                <p>Select up to four stations to compare live meteorological observations.</p>
            </div>

            <div>
                <hr>
            </div>

            <div>
                <select multiple id="stations_in" style="display:none;"></select>

                <div id="custom_stations_grid" style="display:grid;">
                    <!-- Dynamically populated via JS -->
                </div>

                <div>
                    <button id="compare-button" type="button" class="custom-compare-btn">Compare Stations</button>
                </div>
            </div>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Use jQuery ajaxComplete since the original site uses jQuery for AJAX
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url && settings.url.indexOf("apis/map.php") !== -1) {
                    var select = document.getElementById("stations_in");
                    var grid = document.getElementById("custom_stations_grid");
                    if (!select || !grid) return;
                    grid.innerHTML = ""; // clear if already populated

                    Array.from(select.options).forEach(function(opt) {
                        var label = document.createElement("label");
                        label.className = "station-label";

                        var cb = document.createElement("input");
                        cb.type = "checkbox";
                        cb.value = opt.value;
                        cb.className = "station-checkbox";

                        cb.addEventListener("change", function() {
                            opt.selected = cb.checked;
                            if (cb.checked) {
                                label.classList.add("checked");
                            } else {
                                label.classList.remove("checked");
                            }
                        });

                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(opt.text));
                        grid.appendChild(label);
                    });
                }
            });
        });
        </script>
        <!-- END REDESIGNED CONTENT AREA -->

        <div class="container-fluid ">

                <section id="compchart-div" class="section  pb-0" style="display:none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded ">
                                <div id="compchart"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="TempComp-div" class="section  pb-0" style="display:none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded ">
                                <div id="TempComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="HumidityComp-div" class="section  pb-0" style="display:none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded ">
                                <div id="HumidityComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="WindComp-div" class="section  pb-0" style="display:none;">
                    <div class="container">
                        <div class="card shadow">
                            <div class="card-body rounded ">
                                <div id="WindComp"></div>
                            </div>
                        </div>
                    </div>
                </section>
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
