<?php include 'apis/start_admin.php'; ?>
<!DOCTYPE html>
<html lang="en"  xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Map</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->
    <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.9.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="assets/v6.5.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="assets/v6.5.0/examples/resources/layout.css" type="text/css">
    <link rel="stylesheet" href="assets/ol-layerswitcher/dist/ol-layerswitcher.css" />-->
    <!--<link rel="stylesheet" href="https://openlayers.org/en/v6.4.3/css/ol.css" />
    <link rel="stylesheet" href="https://raw.githack.com/walkermatt/ol-layerswitcher/master/src/ol-layerswitcher.css" />
    <link rel="stylesheet" href="https://raw.githack.com/walkermatt/ol-layerswitcher/master/examples/layerswitcher.css" />
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.8.3/dist/ol-layerswitcher.css" />-->
    <link rel="stylesheet" href="assets/v6.5.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="assets/v6.5.0/examples/resources/layout.css" type="text/css">
    <link rel="stylesheet" href="assets/ol-layerswitcher/dist/ol-layerswitcher.css" />


    <script src="assets/v6.5.0/build/ol.js"></script>
    <script src="assets/ol-layerswitcher/dist/ol-layerswitcher.js"></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

    
<!--<link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />-->
<script src='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js'></script>
<link href='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css' rel='stylesheet' />

    <style>
       
        .color-legend {
            width: 200px;
            height: 20px;
            background: linear-gradient(to right, white, black);/*red, yellow, green); */
           
        }

        
        .legend-label {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
        }
                .legend {
            display: flex;
            flex-direction: column;
        }

        /* Define the legend items for each category */
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        /* Define the color or symbol for each category */
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }

        /* You can add more styles as needed */

        /* Define the colors or symbols for your discrete variables */
        .category-1 {
            background-color: white;
        }

        .category-2 {
            background-color: black;
        }

        /* You can add more styles as needed */
    </style>
    <style>
        .layer-switcher.shown.layer-switcher-activation-mode-click {
            padding-right: 10px;
          }
          .layer-switcher.shown.layer-switcher-activation-mode-click > button {
            right: 0;
            border-left: 0;
          }
        /*.map {
            height: ;
            width: 400px;
          }*/
          .ol-mouse-position{
            top:97%;
            right:20%;
            position:absolute;
            font-weight: bold;
            }
            .layer-switcher.shown {
             max-height: 465px;
            }
            
            #legend{
               z-index: 11;
               padding: 4px 8px;
               border: 2px solid grey;
               position: absolute;
               bottom: 0px;
               height: 50%;
               overflow: scroll;
               width:15%; 
               right: 0%;
               background-color: #ffffff;
               font-weight: bold;
             }
        v\:* { behavior: url(#default#VML);}
        o\:* { behavior: url(#default#VML);}
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
       /*.container #canvas {
        width: 100%;
        height: auto;
        }*/
       
        .circle {
            width: 10px;
            height: 10px;
            background: red;
            border-radius: 50%;
            z-index:1;
        }
        /*.con .circle {
        position: absolute;
        top:300px;
        left:300px;
        
        border: none;
        cursor: pointer;
       
        }*/

       /* #wordList {
            list-style: none;
            padding: 0;
        }
        .wordItem {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            
        }
        .wordText {
            margin-right: 10px;
        }
        .deleteBtn {
            cursor: pointer;
        }*/
        #wordContainer {
            max-height: 200px; /* Set a maximum height for the container */
            overflow-y: auto; /* Enable vertical scrolling */
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            /*display: flex;
            flex-wrap: wrap;*/
        }
        .wordItem {
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            padding: 8px;
            border-radius: 5px;
            margin:4px;
        }
        .wordText {
            margin-right: 8px;
        }
        .deleteBtn {
            cursor: pointer;
            background-color:black;
            border-radius:2px;
            aspect-ratio:1;
            width:20px;
            height: 20px;
            //text-align:center;
            margin-left: auto; 
            margin-right: 5px;
           
            color:white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px; /* Adjust the font size as needed */
            line-height: 1;
        }
        .deleteBtn:hover {
            background-color: grey;
        }
        .error {
            color: red;
            font-size: 14px;
            margin-top: 5px;
        }

        /* Form Section Styling */
        .form-section {
            transition: all 0.3s ease;
        }

        .form-section:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-group label {
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-control:focus {
            border-color: #5e72e4;
            box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
        }

        .input-group-append .btn {
            border-left: 0;
        }

        .input-group-append .btn:hover {
            background-color: #4c63d2;
            border-color: #4c63d2;
        }

        #wordContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        #wordContainer:empty::before {
            content: "Added cities will appear here";
            color: #999;
            font-style: italic;
            width: 100%;
            padding: 10px;
        }

        .city-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .custom-radio .custom-control-label {
            font-weight: 500;
            cursor: pointer;
            color: #333;
        }

        .custom-radio .custom-control-input:checked ~ .custom-control-label {
            color: #5e72e4;
            font-weight: 600;
        }

        #addCityBtn, #addLocationBtn {
            transition: all 0.2s ease;
        }

        #addCityBtn:hover, #addLocationBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        #addCityBtn:active, #addLocationBtn:active {
            transform: translateY(0);
        }

        .btn-primary {
            background-color: #5e72e4;
            border-color: #5e72e4;
        }

        .btn-primary:hover {
            background-color: #4c63d2;
            border-color: #4c63d2;
        }

        .btn-info {
            background-color: #11cdef;
            border-color: #11cdef;
        }

        .btn-info:hover {
            background-color: #0ba5b8;
            border-color: #0ba5b8;
        }

        .gap-2 {
            gap: 0.5rem;
        }

        .flex-grow-1 {
            flex-grow: 1;
        }

        @media (max-width: 576px) {
            .form-section {
                padding: 1rem !important;
            }
            
            #wordContainer {
                max-height: 200px;
                overflow-y: auto;
            }
        }
    </style>
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
                    <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Spatial Fog Detection</h2>
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
    <?php $_GET['page'] = "spatial"; include "navbar.php" ?>


    <!-- Navigation bar ends -->


   <div class="wrapper container-fuild">
        <section class="section section-shaped rounded" style="padding-bottom:2rem;">
            <div class="shape shape-primary" style="height: 100px;">
            </div>
        </section>
    </div>
    
    <!--<div class="container" style="margin:10px;padding:10px">
    
    
        <div class="row d-flex justify-content-center">
           <p> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;City:&ensp;&ensp;</p>
            <div>
                <div class="  map-data d-flex" style="width:100%;">
                    
                        
                            <div class="autocomplete input-group" style="width:100%;">
                                <input id="city" class="form-control" placeholder="Enter City...." type="text" width="50%" required>
                            </div>
                        
                </div>
            </div>
            <div class="col-sm-2"></div>

            
        </div>

        
        <div class="row d-flex justify-content-center" style="padding-top:1rem;">
            <p>Date & Time:&ensp;&ensp;</p>
            <div>
                <div class="  map-data d-flex" style="width:100%;">
                    
                            <div class="autocomplete input-group" style="width:100%;">
                                <input id="startDate" class="form-control" placeholder="Enter Date & Time...." type="datetime-local" width="50%" required>
                            </div>
                       
                </div>
            </div>
            
            <div  >
               
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-link" id="select-city" onclick="latest()"> Take Latest</button></span>
               
            </div>
        </div>-->
        <!--<div class="row d-flex justify-content-center" >
            <p style="color:red">(* implies required)<p>
        </div>-->
       
        
           <!-- <div class="col-md-2"></div>
            <div class="col-md-2">
                <div class="col-md  map-data d-flex" style="width:100%;">
                    <form role="form" autocomplete="off" method="GET">
                        <div class="form-group">
                            <div class="autocomplete input-group" style="width:100%;">
                                <input id="city" class="form-control" placeholder="Enter City...." type="text" width="50%" required>
                            </div>
                        </div>
                    </form>
                </div>
            </div>-->
           
         <!--  
        <div class="row d-flex justify-content-center" style="padding-top:1rem;">
            <div >
               
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="submit" onclick="getloc()">Submit</button></span>
               
            </div>
           
            <div style="padding-left:1rem;">
               
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-primary" id="reset" onclick="reset()">Reset</button></span>
               
            </div>-->
           <!-- <div id="mod4" class="col-md-2" style="padding-left: 40px;display:none">
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
    <div class="row mt-4" style="padding:1rem 2rem 1rem 1rem; ">

     <div class=" container col-md-4" >
        <div class="card shadow">

            <div class="card-body rounded " style="padding:1rem 2rem 1rem 0rem; " >
        <div class="row d-flex justify-content-center m-4">
        
        <form  autocomplete="off" method="GET" id="cityform" >
        <h5 style="color: #5e72e4; font-weight: 600; margin-bottom: 1.5rem;">Select Cities & Time for Data</h5>
        
        <!-- City Selection Section -->
        <div class="form-section p-3 border-left" style="border-left: 4px solid #5e72e4; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 1.5rem;">
            <div class="custom-control custom-radio mb-2">
                <input type="radio" class="custom-control-input" name="inputSelection" value="input1" id="radio1" checked> 
                <label class="custom-control-label" for="radio1"><strong>By City Name</strong></label>
            </div>
            <div class="form-group">
                <label for="city" style="font-weight: 500; color: #333;">Enter City Name</label>
                <div class="input-group">
                    <input id="city" class="form-control" placeholder="e.g., Mumbai, Delhi..." type="text" width="50%" autocomplete="off">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-info" id="addCityBtn" style="border-radius: 0 4px 4px 0;">
                            <i class="fa fa-plus"></i> Add
                        </button>
                    </div>
                </div>
                <span id="cityError" class="error small d-block mt-1"></span>
            </div>
            <div id="wordContainer" class="mt-3 p-2 bg-white rounded" style="min-height: 50px; border: 1px solid #dee2e6;"></div>
        </div>

        <!-- Location Selection Section -->
        <h6 style="text-align: center; color: #999; margin: 1.5rem 0; font-weight: 600;">
            <span style="background: #f8f9fa; padding: 0 10px;">OR</span>
        </h6>

        <div class="form-section p-3 border-left" style="border-left: 4px solid #11cdef; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 1.5rem;">
            <div class="custom-control custom-radio mb-2">
                <input type="radio" class="custom-control-input" name="inputSelection" value="input2" id="radio2"> 
                <label class="custom-control-label" for="radio2"><strong>By Latitude & Longitude</strong></label>
            </div>
            <p class="small text-muted mb-3"><i class="fa fa-info-circle"></i> Double-click on map to auto-fill coordinates</p>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="lat" style="font-weight: 500; color: #333;">Latitude</label>
                        <input id="lat" class="form-control" placeholder="e.g., 28.57" type="text" pattern="[0-9]*[.]?[0-9]*" disabled>
                        <span id="latitudeError" class="error small d-block mt-1"></span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="long" style="font-weight: 500; color: #333;">Longitude</label>
                        <input id="long" class="form-control" placeholder="e.g., 77.23" type="text" pattern="[0-9]*[.]?[0-9]*" disabled>
                        <span id="longitudeError" class="error small d-block mt-1"></span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <button type="button" class="btn btn-info" id="addLocationBtn" style="width: 100%;"disabled>
                    <i class="fa fa-plus"></i> Add Location
                </button>
            </div>
        </div>

        <!-- Date Selection Section -->
        <div class="form-section p-3 border-left" style="border-left: 4px solid #825ee4; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 1.5rem;">
            <div class="form-group">
                <label for="sdate" style="font-weight: 500; color: #333;">Start Date</label>
                <input id="sdate" class="form-control" placeholder="Select date..." type="date" style="cursor: pointer;">
            </div>
            <!--<div class="form-group">
                <label for="edate" style="font-weight: 500; color: #333;">End Date</label>
                <input id="edate" class="form-control" placeholder="Select date..." type="date" style="cursor: pointer;">
            </div>-->
        </div>

        <!-- Action Buttons -->
        <div class="form-group mt-4 d-flex gap-2">
            <button type="button" class="btn btn-primary flex-grow-1" id="submitBtn" style="font-weight: 600; padding: 10px;">
                <i class="fa fa-search"></i> Submit
            </button>
            <button type="reset" class="btn btn-outline-secondary flex-grow-1" id="reset" style="font-weight: 600; padding: 10px;">
                <i class="fa fa-refresh"></i> Reset
            </button>
        </div>
        
        </form>
        </div>
        </div>
        </div>
        
        
        
        <!--<div class="card shadow mt-3">

            <div class="card-body rounded " style="padding:1rem 2rem 1rem 0rem; " >
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
    
    <div class="container col-md-8" style="height: 100vh">
        
        <div class="card shadow">

            <div class="card-body rounded " style="padding:1rem 2rem 1rem 0rem; " >
                

                <!--<p style="color:red; padding:10px; text-align:center;">Note: Real-time fog detection has been paused as the winter season is over. It will resume on November 1, 2024.</p>-->
                    <h4 class="m-3" style="text-align:center;">Fog results for:<span id="dt"></span> IST (GMT+5:30)</h4>
                    <div class="text-center m-1"  style="margin-top:1rem;font-size:21px;" id="address">
                
                    </div>
                    <div class="text-center m-1"  style="font-size:21px;" id="fogval">
                        
                    </div>
                    <div class="text-center m-1"  style="font-size:21px;" id="epi">
                        
                    </div>
                    <div class="text-center m-1"  style="font-size:21px;" id="alea">
                        
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
                             <div class=" rounded" style=" border: 2px solid; "><div class="legend-color w-100 category-1" id="legen"></div></div>
                            <span>Fog</span>
                        </div>
                        <div class="legend-item ml-4 " >
                             <div class=" rounded" style=" border: 2px solid; "><div class="legend-color w-100 category-2" id="legen"></div></div>
                            <span>No Fog</span>
                        </div>
                        </div>
                    </div>-->
                    <div class=" w-75" style=" justify-content: center;align-items: center;" >
                        <div class="rounded w-100" style=" border: 2px solid; "><div class="color-legend w-100   " id="legen"></div></div>

                        <div class="legend-label">
                            <span>1(Fog)</span>    
                            <!--<span>Mid</span>-->
                            <span>0(No Fog)</span>
                        </div>
                        </div>
                        
                    
                    </div>
                    
                   <!--<div class="container w-100" style="font-size:26px;color:red;">
                            Fog
                    </div>--> 
                    
                    <!--<div class=" w-75" style=" justify-content: center;align-items: center;" >
                        <div class="rounded" style=" border: 2px solid; "><div class="color-legend w-100   " id="legen"></div></div>

                        <div class="legend-label">
                            <span>1</span>    
                            
                            <span>0</span>
                        </div>
                    </div>-->
                    
                    
                    <!-- <div class="d-flex justify-content-center" style="height: 100vh">
                        <div id="map" class="map w-75 h-100"></div>
                    </div>   -->
                    
                    
                    <div class="form-check mt-3">
                    
                    <div class="d-flex justify-content-center" style="height: 100vh;padding:10px;">
                        <div id="map1" class="map1 w-100 h-100"></div>
                        
                        <!--<input id='range' class='range' type='range' min='0' max='1.0' step='any' />-->
                    </div>  
                    <p style="color:red; padding:10px;">Disclaimer: The above data is for educational use only. Raw data provided by the Space Application Center by Indian Space Research Organisation (SAC-ISRO)<p>
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
            <!-- <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                <div id="rmse" align="center"></div>
            </div> -->
           <!-- <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                <div id="rmsec"></div>
            </div>
            
        </div>        
    </div>-->
    <!--<section id="footr" class="section  pb-0" style="padding-top:1rem;margin-bottom:1rem;display: none;">
        <div class="container-fuild">
            <div class="card shadow">
                <div class="card-body bg-gradient-primary rounded ">
                    <div class="row justify-content-center" style="color:white;">
                        <a href="./about.html" target="_blank" style="color: #ffffff;"><p>© Fog Prediction , IIT Kanpur. All rights reserved.</p></a>
                    </div>
                </div>
            </div>
        </div>
    </section>-->

    
    

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
