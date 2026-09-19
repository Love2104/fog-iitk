<?php include 'apis/start_admin.php'; ?>
<?php 
    
    // $page='about';
    // if($_SESSION['last_page_visited'] != $page ) {
    //   $flag=0;
    //     $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
    //     if (!$conn) { 
    //         //echo "An error occurred.\n"; 
    //         $flag=1;  
    //     }  
    //     $sql = 'UPDATE visits 
    //     SET "about" = "about" + 1
    //     WHERE "id" = 1';
    //     $result = pg_query($conn, $sql);
    //     if (!$result) {  
    //      //echo "An error occurred.\n";
    //      $flag=1;  
    //     }  
    //     if($flag==0){
    //       $_SESSION['last_page_visited'] = $page;  }  
    //       pg_close($conn);    }
    $page='about';
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
                    $sql = 'UPDATE visits SET "about" = "about" + 1 WHERE "date" = '."'".date("Y-m-d")."'";
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
    <title>About</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
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
              </div> -->
              <!-- <div class="navbar-nav flex-row mr-auto ml-4 d-none d-md-flex">
                <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">About Us</h2>
            </div> -->
              <!--<ul class="navbar-nav ">
                    <li class="nav-item">
                        <a class="nav-link" href="contact_us.php" target="_blank" style="font-size:larger;font-weight: bold;">Feedback</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.php" target="_blank" style="font-size:larger;font-weight: bold;background:#5e72e4;">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="publication.php" target="_blank" style="font-size:larger;font-weight: bold;">Publications</a>
                    </li>
                  
              </ul>
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
  <?php $_GET['page'] = "about"; include "navbar.php" ?>


  <!-- Navigation bar ends -->


  <div class="wrapper container-fuild">
      <section class="section section-shaped rounded" style="padding-bottom:2rem;">
          <div class="shape shape-primary" style="height: 100px;">
          </div>
      </section>
  </div>

  <!-- <section class="section  pb-0" id="section-services" style="padding-top:1rem;">    -->
    <section class="section  pb-0" style="padding-top:1rem;">
      <div class="container">
        <div class="card shadow">
          <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
            <h1 class="heading-title text-warning" style="text-align: center;"><b>Motivation</b></h1>
            <div class="container">
                <div class="card-body rounded"  style="padding:1rem 2rem 1rem 2rem;">
                  <h4>The northern part of India, during winter months (Dec-Jan),
                    experience high fog that hinders daily activities of people like
                    agriculture, transportation and travel. Formation of fog is mainly
                    due to interaction of complex factors like moisture, aerosols and
                    wind, originating from Western disturbances. Recent studies
                    have shown that there has been increase in fog intensity since
                    last 10-15 years.<br>
                    If there were reliable predictions of fog available, a lot of this
                    displeasure could have been prevented. Keeping this in mind, we
                    aim to forecast presence of fog accurately well in advance using
                    Data Science techniques. We use past data of meteorological
                    variables like air temperature, relative humidity, wind direction,
                    wind speed, atmospheric pressure etc. to develop the methods
                    for fog prediction. Aviation companies require such predictions
                    to plan their air-traffic.</h4>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section  pb-0" style="padding-top:1rem;">
      <div class="container">
        <div class="card shadow">
          <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
            <h1 class="heading-title text-warning" style="text-align: center;"><b>Onset and  dissipation of fog at Airstrip IITK</b></h1>
            <div class="container">
                <div class="card-body rounded d-flex justify-content-center"  style="padding:1rem 2rem 1rem 2rem;">
                <video class="w-100" controls>
                  <source src="TimeSeriesanimation_fps-8_new_layout_oneDay.mp4" type="video/mp4">
                Your browser does not support the video tag.
                </video>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  <section class="section  pb-0" style="padding-top:1rem;">
    <div class="container">
      <div class="card shadow">
        <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">

          <h2 id="bridgename" class="heading-title text-warning" style="text-align: center;">Fog Prediction Team</h2>
          <br>
          <h2 id="bridgename" class="heading-title text-warning ">Current Team Members</h2>
          
          
          <div class="row" >
            <div class="col-md" style="text-align: center;margin: 15px;">
              <a href="https://home.iitk.ac.in/~prasadj/" target="_blank"><img src="./assets/img/team/prasad.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;"></a>
              <b>Deshpande Prasad Jayant</b><br><i>prasadj@iitk.ac.in</i>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/kriti.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Kriti Bajaj</b><br><i>kritib@iitk.ac.in</i><br>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/roshan.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b> Roshan Banbariya</b><br><i>brosha@iitk.ac.in</i><br>
            </div>
            
            
            
             
            
          </div>
          <div class="row " >
            
          
            <div class="col-md-4 " style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/yash.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b> Yash Patil</b><br><i>yashpp21@iitk.ac.in</i><br>
            </div>
            
            
           
            
            
            
             
            
          </div>
          
          <br><br><br>
          <h2 id="bridgename" class="heading-title text-warning ">Mentors</h2>
          <div class="row">
            <div class="col-md" style="text-align: center;margin: 15px;">
              <a href="https://www.cse.iitk.ac.in/users/arnabb/" target="_blank"><img src="./assets/img/team/arnab.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;"></a>
              <b>Dr. Arnab Bhattacharya</b><br><i>arnabb@iitk.ac.in</i>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
              <a href="https://iitk.ac.in/new/shivam-tripathi" target="_blank"><img src="./assets/img/team/shivam.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;"></a>
              <b>Dr. Shivam Tripathi</b><br><i>shiva@iitk.ac.in</i>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
              <a href="https://sites.google.com/view/mahendra-verma/" target="_blank"><img src="./assets/img/team/mahendra.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;"></a>
              <b>Dr. Mahendra K. Verma</b><br><i>mkv@iitk.ac.in</i>
            </div>
          </div>
          <br><br>
          <h2 id="bridgename" class="heading-title text-warning ">Past Team Members</h2>
          <div class="row" >
          <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/kajal.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Kajal Sethi</b><br><i>kajals21@iitk.ac.in</i><br>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
            <img src="./assets/img/team/shlok.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Shlok Mishra</b><br><i> shlokm21@iitk.ac.in</i>
            </div>
            <div class="col-md-4" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/ridin.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b> Ridin Datta</b><br><i>ridind21@iitk.ac.in</i><br>
            </div>
            </div>
          <div class="row" >
          <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/Mohsin Usmani.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Mohsin Usmani</b><br><i> musmani@iitk.ac.in</i><br>
            </div>
          <div class="col-md" style="text-align: center;margin: 15px;">
              <a href="https://shruti-codes.github.io" target="_blank"><img src="./assets/img/team/shruti.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;"></a>
              <b>Shruti Sharma</b><br><i>shruti20@iitk.ac.in</i><br>
            </div> 
            <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/chaman.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Chaman Jangra</b><br><i>cjangra@iitk.ac.in</i>
            </div>
           
            
          </div>
          <div class="row" >
          <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/yash.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Yash Saraswat</b><br><i>yash20@iitk.ac.in</i><br>
            </div>
          <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/rakshit.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Rakshit Paurwal</b><br><i>rakshup@iitk.ac.in</i><br>
            </div>
            <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/sanket.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Sanket Bodele</b><br><i>sbodele@iitk.ac.in</i><br>
            </div>
            <!-- <div class="col-md" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/aruna.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Aruna</b><br><i>arunasp23@gmail.com</i><br>
            </div> -->
          </div>
          <div class="row" >
            <div class="col-md-4" style="text-align: center;margin: 15px;">
              <img src="./assets/img/team/chinthu.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover" style="width: 50%;">
              <b>Chinthulal V S</b><br><i>chinthulalvs@gmail.com</i><br>
            </div>
          </div>
          <br><br>
        </div>
      </div>
    </div>
    <br>
  </section>
  <section class="section pb-0" style="padding-top:1rem;margin-bottom:1rem">
    <div class="container-fluid">
        <div class="card shadow">
            <div class="card-body bg-gradient-primary rounded ">
                <div class="row justify-content-center" style="color:white;">
                    <p>© Fog Prediction , IIT Kanpur. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>
</section>
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
  <script src="./assets/chart-library/core.js"></script>
  <script src="./assets/chart-library/charts.js"></script>
  <script src="./assets/chart-library/themes/material.js"></script>
  <script src="./assets/chart-library/themes/animated.js"></script>
  <script>
     window.addEventListener('load', function() {
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>
</script>
</body>

</html>