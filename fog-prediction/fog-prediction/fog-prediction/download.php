
<!DOCTYPE html>
<html lang="en">

<head>
  <?php include "./include/head.php"; ?>


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
    text-align:justify; 
  }
  .autocomplete-items div {
    padding: 10px;
    cursor: pointer;
    font: outline;
    color: azure;
    background:radial-gradient(rgb(235, 119, 235),rgb(108, 108, 238)); 
    border-bottom: 2px solid #d4d4d4; 
  }
  
  /*when hovering an item:*/
  .autocomplete-items div:hover {
    background:radial-gradient(rgb(28, 226, 160),rgb(61, 214, 241)); 
  }
  
  /*when navigating through the items using the arrow keys:*/
  .autocomplete-active {
    background: radial-gradient(rgb(28, 226, 160),rgb(61, 214, 241)) !important; 
    color: #ffffff; 
  }
  </style>
</head>
<body class="index-page">

  <!-- Navigation bar starts -->

  <nav id="navbar-main" class="navbar navbar-main navbar-expand-lg navbar-transparent navbar-light headroom">
    <div class="container">
        <a class="navbar-brand mr-md-6" href="/fog/website"><img class = "img-fluid" src="./assets/img/fps1.png" style="width:350px;height: 60px;"></a>
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
              <li>
                <div class="row">
                  <div class="col-md-12" style="height:60px;">
                    <form role="form" autocomplete="off" method="GET">
                      <div class="form-group">
                        <div class="autocomplete input-group" >
                            <a href="../website/" class="nav-link">
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

  
  <div class="wrapper">
    <section class="section section-shaped" style="padding-bottom:2rem;">
      <div class="shape shape-primary" style="height: 100px;">
      </div>
    </section>
  </div>

  <section class="section  pb-0" id="other-section" style="padding-top:1rem;">
    <section class="section  pb-0" style="padding-top:1rem;">
      <div class="container">
        <div class="card shadow">
            <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;height: 700px;">

                <div class="row " style="height: 100px;">
                  <div class="col-md" style="text-align: center;">
                      <h2><b>FILL REQUIRED FIELD TO DOWNLOAD DATA </b></h2>
                  </div>
                </div>
                
                <div class="row " >
                  <div class="col-md-2 data-column"></div>
                  <div class="col-md-3 data-column">
                    <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                          </div>
                          <input id="startDate" class="flatpickr flatpickr-input form-control" type="text" placeholder="Select Start Date" required>
                        </div>
                      </div>                            
                    </div>
                    <!-- <div class="col-md data-column">
                        <div class="input-daterange">
                            <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                                </div>
                                <input id="drange" class="flatpickr range form-control" type="text"  placeholder="Select Date Range ">
                            </div>
                            </div>
                        </div>
                    </div> -->

                    <div class="col-md-3 data-column">
                      <div class="form-group">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                          </div>
                          <input id="endDate" class="flatpickr flatpickr-input form-control" type="text" placeholder="Select End Date" required>
                        </div>
                      </div>                
                    </div> 

                    <div class="col-md data-column justify-content-center">
                      <div class="col-lg  map-data d-flex" style="width:100%;">
                        <form role="form" autocomplete="off" method="GET">
                          <div class="form-group">
                            <div class="autocomplete input-group" style="width:100%;">
                              <input id="myInput" class="form-control" placeholder="City Name" type="text" width="100%" required>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="col-md-2 data-column"></div>
                </div>
                <div class="row justify-content-center" style="margin-top:20px">
                    <div class="col-md-5 data-column"></div>
                    <div class="col-md-4">
                        <button id="download-button" type="button" class="btn btn-primary" onclick="downloadFile()">Download</button>
                    </div>
                    <div class="col-md-3 data-column"></div>
                </div>
            
            </div>
        </div>
      </div>
    </section>
  </section>
  
 
  <?php include "./include/tail.php"; ?>

<script src="./js/main.js"></script>
</body>

</html>
