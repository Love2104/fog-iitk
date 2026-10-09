<?php include 'apis/start_admin.php'; ?>
<!DOCTYPE html>
<html lang="en"  xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Map</title>
    <link rel="stylesheet" href="assets/css/theme.css">
    <script src="assets/v6.5.0/build/ol.js"></script>
    <script src="assets/ol-layerswitcher/dist/ol-layerswitcher.js"></script>



<!--<link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />-->
<script src='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js'></script>



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

    <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); ?>
    <?php $_GET['page'] = "spatial"; include "navbar.php" ?>


   <main class="page page-spatial-fog">
   <div class="page-header"><h1>Spatial Fog Detection</h1></div>
    <!--<div class="container">


        <div class="row d-flex justify-content-center">
           <p> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;City:&ensp;&ensp;</p>
            <div>
                <div class="  map-data d-flex">


                            <div class="autocomplete input-group">
                                <input id="city" class="form-control" placeholder="Enter City...." type="text" width="50%" required>
                            </div>

                </div>
            </div>
            <div class="col-sm-2"></div>


        </div>


        <div class="row d-flex justify-content-center">
            <p>Date & Time:&ensp;&ensp;</p>
            <div>
                <div class="  map-data d-flex">

                            <div class="autocomplete input-group">
                                <input id="startDate" class="form-control" placeholder="Enter Date & Time...." type="datetime-local" width="50%" required>
                            </div>

                </div>
            </div>

            <div  >

                    <span class="nav-link-inner--text"><button type="button" class="btn btn-link" id="select-city" onclick="latest()"> Take Latest</button></span>

            </div>
        </div>-->
        <!--<div class="row d-flex justify-content-center" >
            <p>(* implies required)<p>
        </div>-->


           <!-- <div class="col-md-2"></div>
            <div class="col-md-2">
                <div class="col-md  map-data d-flex">
                    <form role="form" autocomplete="off" method="GET">
                        <div class="form-group">
                            <div class="autocomplete input-group">
                                <input id="city" class="form-control" placeholder="Enter City...." type="text" width="50%" required>
                            </div>
                        </div>
                    </form>
                </div>
            </div>-->

         <!--
        <div class="row d-flex justify-content-center">
            <div >

                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="submit" onclick="getloc()">Submit</button></span>

            </div>

            <div>

                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="reset" onclick="reset()">Reset</button></span>

            </div>-->
           <!-- <div id="mod4" class="col-md-2">
                <a href="#" class="nav-link" data-toggle="dropdown" href="#" role="button">
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="hr-choose">Choose Hourwise</button></span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar-default_dropdown_1">
                    <a class="dropdown-item" modelno="405" onclick="onModelChange(this)" href="#">0.5 hour</a>
                    <a class="dropdown-item" modelno="410" onclick="onModelChange(this)" href="#">1 hour</a>
                    <a class="dropdown-item" modelno="415" onclick="onModelChange(this)" href="#">1.5 hour</a>
                    <a class="dropdown-item" modelno="420" onclick="onModelChange(this)" href="#">2 hour</a>
                    <a class="dropdown-item" modelno="425" onclick="onModelChange(this)" href="#">2.5 hour</a>
                    <a class="dropdown-item" modelno="4" onclick="onModelChange(this)" href="#">3 hour</a>-->
                    <!-- <a class="dropdown-item" modelno="460" onclick="onModelChange(this)" href="#">6 hour</a> -->

               <!-- </div>
            </div>-->
            </div>


    </div>

    </form>
    <div class="row mt-4">

     <div class=" container col-md-4" >
        <div class="card">

            <div class="card-body" >
        <div class="row d-flex justify-content-center m-4">

        <form  autocomplete="off" method="GET" id="cityform" >
        <h5>Select Cities & Time for Data</h5>

        <!-- City Selection Section -->
        <div class="form-section p-3 border-left">
            <div class="custom-control custom-radio mb-2">
                <input type="radio" class="custom-control-input" name="inputSelection" value="input1" id="radio1" checked>
                <label class="custom-control-label" for="radio1"><strong>By City Name</strong></label>
            </div>
            <div class="form-group">
                <label for="city">Enter City Name</label>
                <div class="input-group">
                    <input id="city" class="form-control" placeholder="e.g., Mumbai, Delhi..." type="text" width="50%" autocomplete="off">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-info" id="addCityBtn">
                            <i class="fa fa-plus"></i> Add
                        </button>
                    </div>
                </div>
                <span id="cityError" class="error small d-block mt-1"></span>
            </div>
            <div id="wordContainer" class="mt-3 p-2 bg-white rounded"></div>
        </div>

        <!-- Location Selection Section -->
        <h6>
            <span>OR</span>
        </h6>

        <div class="form-section p-3 border-left">
            <div class="custom-control custom-radio mb-2">
                <input type="radio" class="custom-control-input" name="inputSelection" value="input2" id="radio2">
                <label class="custom-control-label" for="radio2"><strong>By Latitude & Longitude</strong></label>
            </div>
            <p class="small text-muted mb-3"><i class="fa fa-info-circle"></i> Double-click on map to auto-fill coordinates</p>

            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="lat">Latitude</label>
                        <input id="lat" class="form-control" placeholder="e.g., 28.57" type="text" pattern="[0-9]*[.]?[0-9]*" disabled>
                        <span id="latitudeError" class="error small d-block mt-1"></span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="long">Longitude</label>
                        <input id="long" class="form-control" placeholder="e.g., 77.23" type="text" pattern="[0-9]*[.]?[0-9]*" disabled>
                        <span id="longitudeError" class="error small d-block mt-1"></span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <button type="button" class="btn btn-info" id="addLocationBtn"disabled>
                    <i class="fa fa-plus"></i> Add Location
                </button>
            </div>
        </div>

        <!-- Date Selection Section -->
        <div class="form-section p-3 border-left">
            <div class="form-group">
                <label for="sdate">Start Date</label>
                <input id="sdate" class="form-control" placeholder="Select date..." type="date">
            </div>
            <!--<div class="form-group">
                <label for="edate">End Date</label>
                <input id="edate" class="form-control" placeholder="Select date..." type="date">
            </div>-->
        </div>

        <!-- Action Buttons -->
        <div class="form-group mt-4 d-flex gap-2">
            <button type="button" class="btn btn-primary flex-grow-1" id="submitBtn">
                <i class="fa fa-search"></i> Submit
            </button>
            <button type="reset" class="btn btn-outline-secondary flex-grow-1" id="reset">
                <i class="fa fa-refresh"></i> Reset
            </button>
        </div>

        </form>
        </div>
        </div>
        </div>



        <!--<div class="card shadow mt-3">

            <div class="card-body" >
        <div class="row d-flex justify-content-center">

        <form  autocomplete="off" method="GET" id="layerform" >

        <div class="form-group mt-3">-->
            <!--<h5>Select the type of data to be viewed</h5>-->

            <!--<div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer1" checked>
                <label class="form-check-label" for="flexRadioDefault1">
                    Fog
                </label>
            </div>-->
           <!-- <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer2" checked>
                <label class="form-check-label" for="flexRadioDefault1">
                    Fog Probability
                </label>
            </div>-->
            <!--<div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer2">
                <label class="form-check-label" for="flexRadioDefault2">
                    Fog Probability
                </label>
            </div>-->
            <!--<div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer3" >
                <label class="form-check-label" for="flexRadioDefault3">
                    Epistemic Uncertainty
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer4" >
                <label class="form-check-label" for="flexRadioDefault4">
                    Aleatoric Uncertainty
                </label>
            </div>-->
            <!--<div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="layer5" >
                <label class="form-check-label" for="flexRadioDefault5">
                    INSAT
                </label>
            </div>-->


                <!--<label>
                    <input type='checkbox' id='overlay-checkbox' checked>
                    Layer1
                </label>-->

            <!--</div>
            </form>
        </div>
        </div>
        </div>-->
    </div>

    <div class="container col-md-8">

        <div class="card">

            <div class="card-body" >


                <!--<p>Note: Real-time fog detection has been paused as the winter season is over. It will resume on November 1, 2024.</p>-->
                    <h4 class="m-3">Fog results for:<span id="dt"></span> IST (GMT+5:30)</h4>
                    <div class="text-center m-1" id="address">

                    </div>
                    <div class="text-center m-1" id="fogval">

                    </div>
                    <div class="text-center m-1" id="epi">

                    </div>
                    <div class="text-center m-1" id="alea">

                    </div>
                    <div class='d-flex justify-content-center w-100 m-4' >
                            <div class='col-md-6 mt-1'>
                                <input type="range" class="form-range w-100" id="opacity" min="0" max="10" step="1" value="10" >
                                <!--<p>Image Number: <span id="demo">10</span></p>-->
                            </div>
                            <div class='col-md-2'>
                                <button id="playPauseButton" class="btn btn-primary">
                                    <i id="playPauseIcon" class="fa fa-play"></i>
                                </button>
                            </div>
                    </div>

                <div class="d-flex justify-content-center w-100 " id="whileg" script="text-align:center">
                    <!--<div class="legend">
                        <div class="row">
                        <div class="legend-item ml-4" >
                             <div class=" rounded"><div class="legend-color w-100 category-1" id="legen"></div></div>
                            <span>Fog</span>
                        </div>
                        <div class="legend-item ml-4 " >
                             <div class=" rounded"><div class="legend-color w-100 category-2" id="legen"></div></div>
                            <span>No Fog</span>
                        </div>
                        </div>
                    </div>-->
                    <div class=" w-75" >
                        <div class="rounded w-100"><div class="color-legend w-100" id="legen"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></div></div>

                        <div class="legend-label">
                            <span>1(Fog)</span>
                            <!--<span>Mid</span>-->
                            <span>0(No Fog)</span>
                        </div>
                        </div>


                    </div>

                   <!--<div class="container w-100">
                            Fog
                    </div>-->

                    <!--<div class=" w-75" >
                        <div class="rounded"><div class="color-legend w-100   " id="legen"></div></div>

                        <div class="legend-label">
                            <span>1</span>

                            <span>0</span>
                        </div>
                    </div>-->


                    <!-- <div class="d-flex justify-content-center">
                        <div id="map" class="map w-75 h-100"></div>
                    </div>   -->


                    <div class="form-check mt-3">

                    <div class="d-flex justify-content-center">
                        <div id="map1" class="map1 w-100 h-100"></div>

                        <!--<input id='range' class='range' type='range' min='0' max='1.0' step='any' />-->
                    </div>
                    <p>Disclaimer: The above data is for educational use only. Raw data provided by the Space Application Center by Indian Space Research Organisation (SAC-ISRO)<p>
                     <!--<iframe width='500' height='400' frameborder='0' scrolling='no' marginwidth='0'src=https://bhuvan.nrsc.gov.in/map/bhuvan/embed.html?l=47.85&b=9.51416015625&r=115.35&t=35.48583984375&val=m></iframe>
                -->
                        <!--<div class=" con "  id="imagediv">
                            <img id="fogimage" src="process/fog_output/Fog_for_website_default.jpg" class="w-75  mx-auto d-block map" id="fog">

                        </div>-->
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
            <!-- <div class="card-body">
                <div id="rmse" align="center"></div>
            </div> -->
           <!-- <div class="card-body">
                <div id="rmsec"></div>
            </div>

        </div>
    </div>-->





    </main>
    <?php include __DIR__ . '/footer.php'; ?>
    <!--<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>-->
    <script src="./assets/js/core/jquery.min.js" type="text/javascript"></script>

    <script src="./assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/jquery.validate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validation-unobtrusive/4.0.0/jquery.validate.unobtrusive.min.js"></script>
    <script src="./assets/js/core/popper.min.js" type="text/javascript"></script>
    <script src="./assets/js/core/bootstrap.min.js" type="text/javascript"></script>
    <!--<script src="./assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>-->
    <script src="./assets/js/plugins/bootstrap-switch.js"></script>
    <script src="./assets/js/plugins/nouislider.min.js" type="text/javascript"></script>
    <script src="./assets/js/plugins/moment.min.js"></script>

    <script src="./assets/js/plugins/datetimepicker.js" type="text/javascript"></script>
    <!--<script src="./assets/js/plugins/bootstrap-datepicker.min.js"></script>-->
    <script src="./assets/js/argon-design-system.min.js?v=1.2.0" type="text/javascript"></script>



    <script src="./assets/chart-library/core.js"></script>
    <script src="./assets/chart-library/charts.js"></script>
    <script src="./assets/chart-library/themes/material.js"></script>
    <script src="./assets/chart-library/themes/animated.js"></script>




    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>

    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="https://code.highcharts.com/stock/modules/data.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/stock/modules/export-data.js"></script>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="./assets/vendor/leaflet/leaflet-idw.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/geotiff"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.5/proj4.js"></script>

   <!-- <script>
        document.getElementById("city").value = 'Lucknow'
        loaddata(4,"Gradient Boosting Regressor")
    </script>
    <script type="text/javascript" src="js/google_map.js"></script>
    <script src="assets/v6.5.0/build/ol.js"></script>
    <script src="assets/ol-layerswitcher/dist/ol-layerswitcher.js"></script>-->
    <!--<script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>-->


    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.0/chroma.min.js"></script>


    <!--<script src="https://gipong.github.io/shp2geojson.js"></script>-->
    <!--<script src="https://openlayers.org/en/v6.4.3/build/ol.js"></script>
    <script src="https://raw.githack.com/walkermatt/ol-layerswitcher/master/dist/ol-layerswitcher.js"></script>
    <script src="https://raw.githack.com/walkermatt/ol-layerswitcher/master/examples/layerswitcher.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.8.3"></script>-->

    <script src="./js/spatial_enhance.js"></script>
    <script>



    const address = 'kanpur'; // Example address

// Nominatim API endpoint for geocoding
//const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&//q=${encodeURIComponent(address)}`;
/*const latitude = 34.53284377728075;
const longitude = 77.9909905221395; // Example coordinates

// Nominatim API endpoint for reverse geocoding
const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

console.log(apiUrl)
// Define custom headers including User-Agent
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const firstResult = data[0];
            console.log(firstResult)
            // Extract specific address components
            const addressComponents = firstResult.address || {};

            // Access the district component
            console.log(addressComponents)
            const district = addressComponents.city_district || addressComponents.suburb || addressComponents.town || addressComponents.village || '';
            let checklist=['village','town','suburb','district','city']
            if (district) {
                console.log(`District: ${district}`);
            } else {
                Object.keys(addressComponents).some(key => {
                    const value = addressComponents[key];
                    console.log(value)
                    // Check if the value contains the substring "district" (case-insensitive)
                    if (value && typeof value === 'string') {
                        checklist.forEach(el => {

                            if( value.toLowerCase().includes(el)){
                                district=value
                                district = value;
                                console.log(value)
                                return true;
                            }
                        });
                        // Stop iteration once district is found
                    }

                    return false; // Continue iteration
                }); // Continue searching

            }
        } else {
            console.log('No results found');
        }
    })
    .catch(error => {
        console.error('Error fetching reverse geocoding data:', error);
    });
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const firstResult = data[0];
            const lat = parseFloat(firstResult.lat);
            const lon = parseFloat(firstResult.lon);
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        } else {
            console.log('No results found');
        }
    })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
    });*/

        /*function init() {
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');

            //drawImage(image);

            var image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;

                context.drawImage(image, 0, 0);
            }
            image.src = 'images/FOG.jpg';



        }

        window.addEventListener('load', init);  */

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
