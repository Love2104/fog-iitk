<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "./include/head.php"; ?>

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

  <div class="row align-items-center" style="padding: 5px;margin-top: 10px;">
      <div class="col"></div>
    <div class="col-3">
        <div class="form-group">
            <div class="input-group input-group-alternative">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                </div>
                <input id="sdate" class="form-control datepicker" placeholder="Start date" type="text" >
            </div>
        </div>
    </div>
    <div class="col-3">
        <div class="form-group">
            <div class="input-group input-group-alternative">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                </div>
                <input id="edate" class="form-control datepicker" placeholder="End date" type="text">
            </div>
        </div>
    </div>
    <div class="col"></div>
</div>

<div class="align-items-center" align="center" style="padding: 5px;">
    <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="submit" onclick="findResponse()">
</div>
<div id="response">
</div>


<?php include "./include/tail.php"; ?>

</body>

</html>