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
    <link rel="stylesheet" href="assets/css/theme.css">









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
<?php $_GET['page'] = "about"; include "navbar.php"; ?>






            <main class="page page-about editorial-narrow">
  <div class="page-header">
    <h1>About Us</h1>
    <hr>
  </div>
  <div class="card">
    <h2>Motivation</h2>
            <div class="container">
                <div class="card-body rounded" >
                  <p class="motivation-copy">The northern part of India, during winter months (Dec-Jan),
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
                    to plan their air-traffic.</p>
                </div>
            </div>


            </div>
  <div>
    <h2>Onset and dissipation of fog at Airstrip IITK</h2>
            <div class="container">
                <div class="card-body rounded d-flex justify-content-center" >
                <video class="w-100" controls>
                  <source src="TimeSeriesanimation_fps-8_new_layout_oneDay.mp4" type="video/mp4">
                Your browser does not support the video tag.
                </video>
                </div>
            </div>



          </div>
  <div>
    <h2>Fog Prediction Team</h2>
          <br>
          <h3>Current Team Members</h3>


          <div class="row team-grid">
            <div class="col-md">
              <a href="https://home.iitk.ac.in/~prasadj/" target="_blank"><img src="./assets/img/team/prasad.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover"></a>
              <b>Deshpande Prasad Jayant</b><br><i>prasadj@iitk.ac.in</i>
            </div>
            <div class="col-md">
              <img src="./assets/img/team/kriti.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Kriti Bajaj</b><br><i>kritib@iitk.ac.in</i><br>
            </div>
            <div class="col-md">
              <img src="./assets/img/team/roshan.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b> Roshan Banbariya</b><br><i>brosha@iitk.ac.in</i><br>
            </div>





          </div>
          <div class="row " >


            <div class="col-md-4 ">
              <img src="./assets/img/team/yash.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b> Yash Patil</b><br><i>yashpp21@iitk.ac.in</i><br>
            </div>








          </div>

          <br><br><br>
          <h3>Mentors</h3>
          <div class="row">
            <div class="col-md">
              <a href="https://www.cse.iitk.ac.in/users/arnabb/" target="_blank"><img src="./assets/img/team/arnab.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover"></a>
              <b>Dr. Arnab Bhattacharya</b><br><i>arnabb@iitk.ac.in</i>
            </div>
            <div class="col-md">
              <a href="https://iitk.ac.in/new/shivam-tripathi" target="_blank"><img src="./assets/img/team/shivam.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover"></a>
              <b>Dr. Shivam Tripathi</b><br><i>shiva@iitk.ac.in</i>
            </div>
            <div class="col-md">
              <a href="https://sites.google.com/view/mahendra-verma/" target="_blank"><img src="./assets/img/team/mahendra.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover"></a>
              <b>Dr. Mahendra K. Verma</b><br><i>mkv@iitk.ac.in</i>
            </div>
          </div>
          <br><br>
          <h3>Past Team Members</h3>
          <div class="row team-grid">
          <div class="col-md">
              <img src="./assets/img/team/kajal.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Kajal Sethi</b><br><i>kajals21@iitk.ac.in</i><br>
            </div>
            <div class="col-md">
            <img src="./assets/img/team/shlok.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Shlok Mishra</b><br><i> shlokm21@iitk.ac.in</i>
            </div>
            <div class="col-md-4">
              <img src="./assets/img/team/ridin.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b> Ridin Datta</b><br><i>ridind21@iitk.ac.in</i><br>
            </div>
            </div>
          <div class="row team-grid">
          <div class="col-md">
              <img src="./assets/img/team/Mohsin Usmani.png" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Mohsin Usmani</b><br><i> musmani@iitk.ac.in</i><br>
            </div>
          <div class="col-md">
              <a href="https://shruti-codes.github.io" target="_blank"><img src="./assets/img/team/shruti.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover"></a>
              <b>Shruti Sharma</b><br><i>shruti20@iitk.ac.in</i><br>
            </div>
            <div class="col-md">
              <img src="./assets/img/team/chaman.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Chaman Jangra</b><br><i>cjangra@iitk.ac.in</i>
            </div>


          </div>
          <div class="row team-grid">
          <div class="col-md">
              <img src="./assets/img/team/yash.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Yash Saraswat</b><br><i>yash20@iitk.ac.in</i><br>
            </div>
          <div class="col-md">
              <img src="./assets/img/team/rakshit.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Rakshit Paurwal</b><br><i>rakshup@iitk.ac.in</i><br>
            </div>
            <div class="col-md">
              <img src="./assets/img/team/sanket.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Sanket Bodele</b><br><i>sbodele@iitk.ac.in</i><br>
            </div>
            <!-- <div class="col-md">
              <img src="./assets/img/team/aruna.jpg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Aruna</b><br><i>arunasp23@gmail.com</i><br>
            </div> -->
          </div>
          <div class="row team-grid">
            <div class="col-md-4">
              <img src="./assets/img/team/chinthu.jpeg" class="rounded-circle img-center img-fluid shadow shadow-lg--hover">
              <b>Chinthulal V S</b><br><i>chinthulalvs@gmail.com</i><br>
            </div>
          </div>
          <br><br>

    </div>
</main>
<?php $footerCopyrightHtml = "&copy; Fog Prediction , IIT Kanpur. All rights reserved."; include __DIR__ . "/footer.php"; ?>
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
</body>

</html>
