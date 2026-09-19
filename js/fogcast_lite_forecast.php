


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Fogcast-lite Forecast</title>
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
        img{
            object-fit: cover;
            height:90%;
            width:100%;
        }
        .bold-text {
            font-weight: bold;
        }
    </style>
</head>

<body id="page" class="index-page" style="font-family: 'Libre Baskerville', serif;">

    <!-- Navigation bar starts -->

    <nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
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
                    <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Fogcast-lite Forecast</h2>
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
    </nav>


    <!-- Navigation bar ends -->


    <div class="wrapper container-fuild">
        <section class="section section-shaped rounded" style="padding-bottom:2rem;">
            <div class="shape shape-primary" style="height: 100px;">
            </div>
        </section>
    </div>

    
    <div class="container">
        <div class="card shadow"  >
            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;" align="center">
            <!-- <h3 class="m-2 ">Visibility Classification For Respective Images</h3> -->
            <!-- <p class="m-2 col-md-8">Following are the images classified based on visibility(in meters) using Convolutional Neural Network(CNN), the threshold of classification is 1000 m. Time is in IST(GMT+05:30)  The cameras are located at Airstrip, IIT Kanpur.</p> -->
            <div class="col-md-12 m-2 ">
                <h5>Select the date and lead time of forecast to be shown</h5>
                <form role="form" autocomplete="off" method="GET">
                    <div class="form-group">
                            <div class="container d-flex flex-row justify-content-around ">
                                <div class="row">
                                    <div class="form-group mr-4">
                                        <label for="startdate">Date</label>
                                        <input id="startdate" class="form-control" placeholder="Enter Date ...." type="date"  >
                                        
                                    </div> 
                                    <div class="form-group mr-4 " style="display:none">
                                        <label for="enddate">End Date & Time</label>
                                        <input id="enddate" class="form-control" placeholder="Enter Date & Time...." type="datetime-local"  >
                                        <span class="nav-link-inner--text"><button type="button" class="btn btn-link" id="select-city" onclick="latest()"> Take Latest</button></span>
                                        
                                    </div> 
                                    <div class="form-group">
                                        <label for="dropdown">Lead Time</label>
                                        <select class="form-select form-control" id="leadtime">
                                            <option value="6" selected>6 hours</option>
                                            <option value="12">12 hours</option>
                                            <option value="24">1 day</option>
                                            <option value="48">2 day</option>
                                            <option value="120">5 days</option>
                                            <option value="240">10 days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            
                            
                    </div>
                    <div class="" >
                            <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="Submit" onclick="newdata()">
                    </div>
                </form>
                

                

                <h4 class="mt-4">Fog is forcasted <span id="city" style="display:none"></span> on (T) <span id = "date_time"></span> IST</h4> 
                <h3>Shown forecast is of (T + <span id="predicate"></span> Hours) i.e. <span id = "predict_time"></span> IST</h3>
                <div class="row justify-content-center">
                    <button  class="btn btn-primary mr-4" id="prev" onclick="prev()" style="display:none">Prev</button>
                    <button  class="btn btn-primary" id="next" onclick="next()" >Next</button>
                </div>
            

            

            <div class="row mt-4 " >
            <div class="col-md-6  ">
                <h5 class="">Fog Probability</h5>
                
                <img id="prob" class="" style="" >
                    
                    
                </img>
                
            </div>
            <div class="col-md-6 p-1 ">
                <h5 class="">Binary Fog </h5>
                <img id="bin_" class=" " >
                    
                    
                </img>
            </div>
            <div class="col-md-6 p-1">
                <h5 class="">Epistemic Uncertainity</h5>
                <img id="epi_" class="  " >
                    
                    
                </img>
            </div>
    
            <div class="col-md-6 p-1">
                <h5 class="m-1 p-1">Aleatoric Uncertainity</h5>
                <img id="alea" class="  " >
                    
                    
                </img>
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
    <!-- <script src="apis/spatial_prediction.php?cityname=Lucknow">
        
     
        
    </script> -->

<script>
    var files
    var position = 0
    var arr = ["Lucknow","Delhi","Gorakhpur","Kolkata","Agra","Amritsar","Gaya"]
    function setdata(){
        Date.prototype.addHours = function(h) { 
                this.setTime(this.getTime() + 
                            (h * 60 * 60 * 1000)); 
                return this; 
            } 
        for(let i=position;i<position+4;i++){
            $('#'+files[i][2]).attr("src","data:image/png;base64,"+files[i][3]);
        }
        let prediction_date = new Date(files[position][0])
        let shown_date = new Date(files[position][0])
        $('#date_time').html(prediction_date.addHours(6).toString(undefined, {weekday: 'long', year: "numeric", month: "long", day: "numeric", hour: "numeric"  }))
        $('#predicate').html(files[position][1])
        
        $('#predict_time').html(shown_date.addHours(files[position][1]+6).toLocaleDateString(undefined, {weekday: 'long', year: "numeric", month: "long", day: "numeric", hour: "numeric" }))
    }
    function next(){
        if(position>=files.length-4)
            return
        position+=4
        if(position==files.length-4)
            $("#next").hide()
        if(position==4)
            $('#prev').show()
        
        setdata()
    }
    function prev(){
        if(position<0)
            return
        position-=4
        if(position==0)
            $("#prev").hide()
        if(position==files.length-8)
            $("#next").show()
        
        setdata()
    }
    function latest(){
        const now = new Date();
        var mon=(now.getMonth()+1<10)? '0'+(now.getMonth()+1) : now.getMonth()+1
        var date=(now.getDate()<10)? '0'+now.getDate() : now.getDate()
        var minite=(now.getMinutes()<10)? '0'+now.getMinutes() : now.getMinutes()
        var hour=(now.getHours()<10)? '0'+now.getHours() : now.getHours()
        var today=now.getFullYear()+'-'+mon+'-'+date//+'T'+hour+':'+minite;
        //now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        // $("#enddate").val(today);
        //$("#startdate").val(today);
        return today
        
    }
    function newdata(){
        var startdate=$("#startdate").val(), enddate=$("#enddate").val(), leadtime= $("#leadtime").find(":selected").val()
        console.log(startdate,enddate,leadtime)
        $.ajax({url: "apis/spatial_prediction1.php?startdate="+startdate+"&enddate="+enddate+"&leadtime="+leadtime, 
            success: function(alldata){
                console.log(alldata)
                if(alldata === null || alldata === undefined || alldata == ""){
                    
                    return
                }
                files = JSON.parse(alldata)
                console.log(files)
                let itr=0
                position=0
                $("#next").show()
                $("#prev").hide()
                setdata()
            }
        })
    }
    function autocomplete(inp) {
    
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;

        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            pn = document.getElementById(this.id).parentElement;

            /*create a DIV element that will contain the items (values):*/

            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items container ");
            /*append the DIV element as a child of the autocomplete container:*/
            pn.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    // b.setAttribute("class","shape shape-primary")
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function(e) {
            closeAllLists(e.target);
        });
    }

    //$('#cityname').on('keyup', autocomplete(document.getElementById("cityname")));
    $("#startdate").val(latest())
    latest()
    $('#cityname').val("Lucknow")
    
    $('#city').html("Lucknow")
    newdata()
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
