 <?php include 'apis/start_admin.php'; ?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Camera-Based Visibility Detection</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <link rel="stylesheet" href="./assets/owl-carousel/owl.carousel.min.css">
    <link rel="stylesheet" href="./assets/owl-carousel/owl.theme.default.min.css">
    <script src="./assets/js/core/jquery.min.js" type="text/javascript"></script>
    <!-- <script src="https://cdn.jsdelivr.net/gh/egeriis/zipcelx/lib/standalone.js"></script> -->

    <style>
        .ico-color{
            background:black;
            /* background: -moz-linear-gradient(top, #e72c83 0%, #a742c6 100%);
  background: -webkit-linear-gradient(top, #e72c83 0%, #a742c6 100%);
  background: linear-gradient(to bottom, #e72c83 0%, #a742c6 100%); */
  color: white;
  /* -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent; */
        }
        .counter {
            position: absolute;
            top: 20px; /* Adjust as needed */
            right: 20px; /* Adjust as needed */
            color: white;
            background-color: rgba(0, 0, 0, 0.5); /* Transparent black background */
            padding: 5px;
            border-radius: 5px;
        }
        .carousel-counter {
            position: absolute;
            top: 20px; /* Adjust as needed */
             right: 20px; /*Adjust as needed */
            align:center;
            color: white;
            background-color: rgba(0, 0, 0, 0.3); /* Transparent black background */
            padding: 5px;
            border-radius: 5px;
        }
        .carousel-caption {
            position: absolute;
            /*top:20%;*/ /* Adjust as needed */
            /* right: 20px; Adjust as needed */
            align:center;
            color: white;
            background-color: rgba(0, 0, 0, 0.3); /* Transparent black background */
            padding: 5px;
            border-radius: 5px;
        }
        
        .center-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Full height of the viewport */
        }
        .carousel-control-next {
            background-color: black; /* Set the background color */
            width: 3rem; /* Adjust the width as needed */
            height: 3rem; 
            position: absolute;
            top: 50%;
            right:10%;
            transform: translateY(-50%);
        }
        .carousel-control-prev {
            background-color: black; /* Set the background color */
            width: 3rem; /* Adjust the width as needed */
            height: 3rem; 
            position: absolute;
            top: 50%;
            left:10%;
            transform: translateY(-50%);
        }
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
        .theimage{
            object-fit: cover;
            height:100%;
            width:100%;
        }
        .bold-text {
            font-weight: bold;
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
                    <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Camera-Based Visibility Classifier Results</h2>
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
    <?php $_GET['page'] = "camera"; include "navbar.php" ?>


    <!-- Navigation bar ends -->


    <div class="wrapper container-fuild">
        <section class="section section-shaped rounded" style="padding-bottom:2rem;">
            <div class="shape shape-primary" style="height: 100px;">
            </div>
        </section>
    </div>

    <!--  <div class="container" style="margin:10px;padding:10px">
        <div class="row">
            <div class="col-md-12">
           

           <div class="owl-carousel owl-theme">
            <div class="item">
              <h4>1</h4>
            </div>
            <div class="item">
              <h4>2</h4>
            </div>
            <div class="item">
              <h4>3</h4>
            </div>
            <div class="item">
              <h4>4</h4>
            </div>
            <div class="item">
              <h4>5</h4>
            </div>
            <div class="item">
              <h4>6</h4>
            </div>
            <div class="item">
              <h4>7</h4>
            </div>
            <div class="item">
              <h4>8</h4>
            </div>
            <div class="item">
              <h4>9</h4>
            </div>
            <div class="item">
              <h4>10</h4>
            </div>
            <div class="item">
              <h4>11</h4>
            </div>
            <div class="item">
              <h4>12</h4>
            </div>
          </div> 
            </div>
            
        </div>
    </div>-->
    <div class="container">
        <div class="card shadow"  >
            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;" align="center">
            <h3 class="m-2 ">Visibility Classification For Respective Images</h3>
            <!-- <p class="m-2 col-md-8">Following are the images classified based on visibility(in meters) using Convolutional Neural Network(CNN), the threshold of classification is 1000 m. Time is in IST(GMT+05:30)  The cameras are located at Airstrip, IIT Kanpur.</p> -->
            <p class="m-4 col-md-8">
                <span class="bold-text">Image Classification Results</span>: Convolutional Neural Network (CNN) Analysis by Visibility (meters)<br>

                <span class="bold-text">Threshold</span>: 1000 meters<br>

                <span class="bold-text">Location</span>: Airstrip, IIT Kanpur<br>

                <span class="bold-text">Timezone</span>: Indian Standard Time (IST) - GMT+05:30<br>
            </p>
            <div class="col-md-6 m-2">
                <h5>Select the  Time of data to be viewed</h5>
                
                <div class="form-group">
                    <label for="myInputSecond">Date & Time</label>
                    <input id="myInputSecond" class="form-control" placeholder="Enter Date & Time...." type="datetime-local" width="50%" required>
                    <span class="nav-link-inner--text"><button type="button" class="btn btn-link" id="select-city" onclick="latest()"> Take Latest</button></span>
                    
                </div>

                
                
                <span class="nav-link-inner--text"><button  class="btn btn-primary" id="submit" onclick="newdata()">Submit</button></span>
            </div>
            <div class="row" >
            <div class="col-md-6">
            <h5 class="m-2 ">Correctly Classified Images From Cam1</h5>
                <div id="imageCarousel1C" class="carousel slide " data-ride="carousel" data-interval="false">
                    <div class="carousel-inner" id="Cam1C">
                   
                       <!-- <div class="carousel-item active">
                            <img src="assets/img/iitk.png" class="d-block w-100" alt="Image 1">
                        </div> -->
                        <!--<div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 2">
                        </div>
                        <div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 3">
                        </div>-->
                    </div>
                    <div class="">
                    <a class="carousel-control-prev " href="#imageCarousel1C" role="button" data-slide="prev" onclick="prependImage('Cam1,Classified')" id="nextBtn1C"><!--style="background:black;aspect-ratio:1;width:25%">-->
                    <span class="carousel-control-prev-icon " aria-hidden="true" ></span>
                    <span class="sr-only" >Previous</span>
                    </a>
                    </div>
                    <div class="">
                    <a class="carousel-control-next " href="#imageCarousel1C" role="button" data-slide="next"  onclick="appendImage('Cam1,Classified')" id="prevBtn1C">
                    <span class="carousel-control-next-icon " aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                    </a>
                    </div>
                </div>
    </div>
    <div class="col-md-6" <?php if(!$admin){echo 'style="display:none;"';} ?>>
                <h5 class="m-2 ">Incorrectly Classified Images From Cam1</h5>
                <div id="imageCarousel1M" class="carousel slide  " data-ride="carousel" data-interval="false">
                    <div class="carousel-inner" id="Cam1M">
                   
                       <!-- <div class="carousel-item active">
                            <img src="assets/img/iitk.png" class="d-block w-100" alt="Image 1">
                        </div> -->
                        <!--<div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 2">
                        </div>
                        <div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 3">
                        </div>-->
                    </div>
                    <div class="">
                    <a class="carousel-control-prev" href="#imageCarousel1M" role="button" data-slide="prev" onclick="prependImage('Cam1,MisClassified')" id="nextBtn1M"><!--style="background:black;aspect-ratio:1;width:25%">-->
                    <span class="carousel-control-prev-icon " aria-hidden="true" ></span>
                    <span class="sr-only" >Previous</span>
                    </a>
                    </div>
                    <div class="">
                    <a class="carousel-control-next " href="#imageCarousel1M" role="button" data-slide="next"  onclick="appendImage('Cam1,MisClassified')" id="prevBtn1M">
                    <span class="carousel-control-next-icon " aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                    </a>
                    </div>
                </div>
                </div>
    <div class="col-md-6">
                <h5 class="m-2 ">Correctly Classified Images From Cam2</h5>
                <div id="imageCarousel2C" class="carousel slide  " data-ride="carousel" data-interval="false">
                    <div class="carousel-inner" id="Cam2C">
                    <!-- <div class="carousel-item active">
                            <img src="assets/img/iitk.png" class="d-block w-100" alt="Image 1">
                        </div> -->
                       <!-- <div class="carousel-item active">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 1">
                        </div>
                        <div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 2">
                        </div>
                        <div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 3">
                        </div>-->
                    </div>
                    <div class="">
                    <a class="carousel-control-prev" href="#imageCarousel2C" role="button" data-slide="prev"  onclick="prependImage('Cam2,Classified')" id="nextBtn2C"><!--style="background:black;aspect-ratio:1;width:25%">-->
                    <span class="carousel-control-prev-icon " aria-hidden="true" ></span>
                    <span class="sr-only" >Previous</span>
                    </a>
                    </div>
                    <div class="">
                    <a class="carousel-control-next " href="#imageCarousel2C" role="button" data-slide="next"  onclick="appendImage('Cam2,Classified')" id="prevBtn2C">
                    <span class="carousel-control-next-icon " aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                    </a>
                    </div>
                </div>
                </div>
    
    <div class="col-md-6" <?php if(!$admin){echo 'style="display:none;"';} ?>>
                <h5 class="m-2 ">Incorrectly Classified Images From Cam2</h5>
                <div id="imageCarousel2M" class="carousel slide  mt-1" data-ride="carousel" data-interval="false">
                    <div class="carousel-inner" id="Cam2M">
                   
                       <!-- <div class="carousel-item active">
                            <img src="assets/img/iitk.png" class="d-block w-100" alt="Image 1">
                        </div> -->
                        <!--<div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 2">
                        </div>
                        <div class="carousel-item">
                            <img src="./sample_fog_images/Cam2/1.jpg" class="d-block w-100" alt="Image 3">
                        </div>-->
                    </div>
                    <div class="">
                    <a class="carousel-control-prev" href="#imageCarousel2M" role="button" data-slide="prev" onclick="prependImage('Cam2,MisClassified')" id="nextBtn2M"><!--style="background:black;aspect-ratio:1;width:25%">-->
                    <span class="carousel-control-prev-icon " aria-hidden="true" ></span>
                    <span class="sr-only" >Previous</span>
                    </a>
                    </div>
                    <div class="">
                    <a class="carousel-control-next " href="#imageCarousel2M" role="button" data-slide="next"  onclick="appendImage('Cam2,MisClassified')" id="prevBtn2M">
                    <span class="carousel-control-next-icon " aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                    </a>
                    </div>
                </div>
    </div>
    </div>
            
            <!-- <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                <div id="rmse" align="center"></div>
            </div> -->
            <!-- <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
                <div id="rmsec"></div>
            </div> -->
            </div>
        </div>        
    </div>
    <section id="footr" class="section  pb-0" style="padding-top:1rem;margin-bottom:1rem;">
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
    
    
    <script src="./assets/owl-carousel/owl.carousel.js"></script>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
    <script>console.log('waiting..')</script>
    <script>
        
     
        function newdata(){
            let date=$('#myInputSecond').val()
            //console.log(date)
            $.ajax({
            type: "POST",
            data: { method: 'Date', date:date, },
            url: "apis/fetch_images.php",
            success: function(response) {
                //console.log(response)
                data=response.split('@@')
                //console.log(data)
            //console.log(response.split('<div class="carousel-item ">'))
            
            $('#Cam1C').empty()
            $('#Cam1C').html(data[0]);
            $('#Cam2C').empty()
            $('#Cam2C').html(data[1]);
            $('#Cam1M').empty()
            $('#Cam1M').html(data[2]);
            $('#Cam2M').empty()
            $('#Cam2M').html(data[3]);

            }
            });
        }
        function latest(){
            const now = new Date();
            var mon=(now.getMonth()+1<10)? '0'+(now.getMonth()+1) : (now.getMonth()+1)
            var date=(now.getDate()<10)? '0'+now.getDate() : now.getDate()
            var minite=(now.getMinutes()<10)? '0'+now.getMinutes() : now.getMinutes()
            var hour=(now.getHours()<10)? '0'+now.getHours() : now.getHours()
            var today=now.getFullYear()+'-'+mon+'-'+date+'T'+hour+':'+minite;
            //now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            $('#myInputSecond').val(today);
            
        }
        latest()
    //$(document).ready(function(){
        var maxItems=6
    $.ajax({
        type: "GET",
        url: "apis/fetch_images.php",
        success: function(response) {
            
            // Add the HTML for the initial carousel items to the carousel container
            data=response.split('@@')
            //console.log(response.split('<div class="carousel-item ">'))
            
            $('#Cam1C').empty()
            $('#Cam1C').html(data[0]);
            $('#Cam2C').empty()
            $('#Cam2C').html(data[1]);
            $('#Cam1M').empty()
            $('#Cam1M').html(data[2]);
            $('#Cam2M').empty()
            $('#Cam2M').html(data[3]);
            
            var images = document.getElementsByTagName('img');

// Initialize a counter for loaded images
            var loadedImageCount = 24;
            // Function to be called when an image is loaded
            function imageLoaded() {
                loadedImageCount++;
                
                // Check if all images have been loaded
                if (loadedImageCount === images.length) {
                    // All images have been loaded, execute your event here
                    var loadEndTime  = Date.now(); // Current time when all images are loaded
                    var duration = loadEndTime - window.performance.timing.navigationStart;
                    console.log(window.performance.timing.navigationStart)
                    console.log('Duration from navigation start to all images loaded: ' + duration + ' milliseconds');
                }
            }

            // Loop through each image element and add a load event listener
            for (var i = 0; i < images.length; i++) {
                images[i].addEventListener('load', imageLoaded);
            }

            
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
    console.log('done..')
    function prependImage(cam) {
        // Make an AJAX request to get the new carousel item HTML
        console.log(cam)
        $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).hide();
        $.ajax({
            type: "POST",
            data: { cam: cam, method: 'Prev' },
            url: "apis/fetch_images.php",
            success: function(response) {
                
                // Prepend the new carousel item HTML to the beginning of the carousel
                console.log(response)
                $('#'+cam.slice(0,4)+cam[5]).prepend(response);

                // Remove the last item if the maximum number of items is exceeded
                if ($('#'+cam.slice(0,4)+cam[5]+' .carousel-item').length > maxItems) {
                    $('#'+cam.slice(0,4)+cam[5]+' .carousel-item:last').remove();
                }
                console.log($('#'+cam.slice(0,4)+cam[5]+' .carousel-item').length)
                setTimeout(function() {
                    $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).show();
        }, 500);
                
            },
            
            error: function(xhr, status, error) {
                console.error(error);
                setTimeout(function() {
                    $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).show();
        }, 500);
            }
        });
        
    }

    function appendImage(cam) {
        $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).hide();
        // Make an AJAX request to get the new carousel item HTML
        $.ajax({
            type: "POST",
            data: { cam: cam, method: 'Next' },
            url: "apis/fetch_images.php",

            success: function(response) {
                
                // Append the new carousel item HTML to the end of the carousel
                $('#'+cam.slice(0,4)+cam[5]).append(response);

                // Remove the first item if the maximum number of items is exceeded
                if ($('#'+cam.slice(0,4)+cam[5]+' .carousel-item').length > maxItems) {
                    $('#'+cam.slice(0,4)+cam[5]+' .carousel-item:first').remove();
                }
                console.log($('#'+cam.slice(0,4)+cam[5]+' .carousel-item').length)
                setTimeout(function() {
                    $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).show();
        }, 500);
                
            },
            error: function(xhr, status, error) {
                console.error(error);
                setTimeout(function() {
                    $('#prevBtn'+cam[3]+cam[5]+', #nextBtn'+cam[3]+cam[5]).show();
        }, 500);
            }
            
        });
    }
</script>

<script>
     window.addEventListener('load', function() {
        console.log(window.performance.timing.navigationStart)
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>
  <!--  function prependImage() {
        // Make an AJAX request to get the new carousel item HTML
        $.ajax({
            type: "GET",
            url: "get_carousel_item.php",
            success: function(response) {
                // Prepend the new carousel item HTML to the beginning of the carousel
                $('#imageCarousel .carousel-inner').prepend(response);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function appendImage() {
        // Make an AJAX request to get the new carousel item HTML
        $.ajax({
            type: "GET",
            url: "get_carousel_item.php",
            success: function(response) {
                // Append the new carousel item HTML to the end of the carousel
                $('#imageCarousel .carousel-inner').append(response);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }
  
      $("#imageCarousel").on("slide.bs.carousel", function(event){
        if (event.direction == "right") {
          var newImage =` <?php //get_item(); ?>`
          console.log(newImage)
          $(this).find(".carousel-inner").prepend(newImage);
        }
      });
    //});
    </script>-->
    
      <!--<script>
            $(document).ready(function() {
              var owl = $('.owl-carousel');
              owl.owlCarousel({
                margin: 10,
                nav: true,
                loop: true,
                responsive: {
                  0: {
                    items: 1
                  },
                  600: {
                    items: 3
                  },
                  1000: {
                    items: 5
                  }
                }
              })
            })
          </script>-->
    <!-- <script src="./js/curvspred.js"></script>
    <script>
        document.getElementById("myInputFirst").value = 'Lucknow'
        loaddata(4,"Gradient Boosting Regressor") 
    </script>-->
</body>

</html>
