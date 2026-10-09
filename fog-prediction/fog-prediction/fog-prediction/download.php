
<!DOCTYPE html>
<html lang="en">

<head>
  <?php include "./include/head.php"; ?>



</head>
<body class="index-page site-page archive-page">

  <!-- Navigation bar starts -->

  <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 3) . '/navbar.php'; ?>
<main class="page page-archive page-archive-download"><div class="page-header"><h1>FILL REQUIRED FIELD TO DOWNLOAD DATA</h1></div>



  <!-- Navigation bar ends -->




  <section class="section  pb-0" id="other-section">
    <section class="section  pb-0">
      <div class="container">
        <div class="card">
            <div class="card-body">

                <div class="row ">
                  <div class="col-md">
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
                      <div class="col-lg  map-data d-flex">
                        <form role="form" autocomplete="off" method="GET">
                          <div class="form-group">
                            <div class="autocomplete input-group">
                              <input id="myInput" class="form-control" placeholder="City Name" type="text" width="100%" required>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="col-md-2 data-column"></div>
                </div>
                <div class="row justify-content-center">
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


  </main>
<?php include "./include/tail.php"; ?>

<script src="./js/main.js"></script>
</body>

</html>
