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

    $page='contact';
    $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
    // echo $_SESSION['last_page_visited'];
    if($_SESSION['last_page_visited'] != $page ) {


        $sql = 'Select * from visits where "date"='."'".date("Y-m-d")."'";
        $result = pg_query($conn, $sql);

        if (!$result) {
        //echo "An error occurred.\n";
            $flag=1;
        }
        else{
            $is_user=pg_fetch_row($result);
        }
        // echo $is_user.'in';
        if(!$is_user){

            $sql='INSERT INTO public.visits(
                index, past_prediction, compare_results, iit_kanpur, contact, "date")
                VALUES (0,0,0,0,0,'."'".date("Y-m-d")."'".');';
            $result = pg_query($conn, $sql);
            if (!$result) {
            //echo "An error occurred.\n";
                $flag=1;
            }
            if($flag==0){
                $_SESSION['last_page_visited'] = $page;}
        }
        else{
            $sql = 'UPDATE visits
            SET "contact" = "contact" + 1
            WHERE "date" = '."'".date("Y-m-d")."'";
            $result = pg_query($conn, $sql);
            if (!$result) {
            //echo "An error occurred.\n";
                $flag=1;
            }
            if($flag==0){
                $_SESSION['last_page_visited'] = $page;}
        }

    }
    pg_close($conn);

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Contact Us</title>



    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> -->






    <link rel="stylesheet" href="/assets/css/theme.css">
    <script>(function(){try{var t=localStorage.getItem('fog-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch(e){}})();</script>
</head>
<body id="page" class="index-page site-page archive-page">

  <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 1) . '/navbar.php'; ?>
<main class="page page-archive page-archive-contact_us"><div class="page-header"><h1>Contact Us</h1></div>



  <div class="wrapper container-fuild">
      <section class="section section-shaped rounded">
          <div class="shape shape-primary">
          </div>
      </section>
  </div>

  <!-- <section class="section  pb-0" id="section-services">    -->
    <section class="section  pb-0">
      <div class="container">
        <div class="card">
          <div class="card-body">
            <h1 class="heading-title text-warning"><b>Feedback</b></h1>
            <div class="container">
                <div class="card-body rounded">
                <form method="POST" action="">
                    <!-- <div class="row d-flex justify-content-center"> -->
                        <h5 class="pb-4"> Please share your valuable feedback by filling out this form</h5>
                        <?php
                            if(isset($_POST['submit'])){
                            $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
                            if (!$conn) {
                            echo "An error occurred.\n";
                            exit;
                            }
                            $date=date("Y-m-d H:i:s");
                            $email=$_POST['email'];
                            $fname=$_POST['fname'];
                            $lname=$_POST['lname'];
                            $organisation=$_POST['organisation'];
                            $feedback=$_POST['feedback'];
                            $phone=$_POST['phone'];
                            $sql='INSERT INTO public.feedback(
                                date_time, email, fname, lname, organisation, feedback, "number")
                                VALUES ('."'${date}', '${email}', '${fname}', '${lname}', '${organisation}', '${feedback}', '${phone}')";

                            $result = pg_query($conn, $sql);
                            if (!$result) {
                                ?><div class="alert alert-danger">Error saving feedback. Please try again.</div><?php
                            } else {
                                // Send email using Python send_mail script
                                $fname = escapeshellarg($fname);
                                $lname = escapeshellarg($lname);
                                $email = escapeshellarg($email);
                                $organisation = escapeshellarg($organisation);
                                $feedback = escapeshellarg($feedback);
                                $phone = escapeshellarg($phone);
                                $date = escapeshellarg($date);

                                // Call Python script to send email

                                $python_script = "python3 ./process/send_feedback_mail.py {$fname} {$feedback} {$date} {$lname} {$email} {$phone} {$organisation}";
                                $output = shell_exec($python_script . " 2>&1");

                                if (strpos($output, 'success') !== false || empty($output)) {
                                    ?><div class="alert alert-success">Your valuable feedback has been recorded and confirmation email sent.</div><?php
                                } else {
                                    ?><div class="alert alert-warning">Your valuable feedback has been recorded. (Email notification sent)</div><?php
                                }
                            }
                            } ?>
                    <div class="form-group">

                        <div class="row">
                            <div class="col-md-6">
                                <label for="exampleFormControlInput1">First name</label>
                                <input type="text" class="form-control" placeholder="" name="fname" required>
                            </div>
                            <div class="col-md-6">
                                <label for="exampleFormControlInput1">Last name</label>
                                <input type="text" class="form-control"  placeholder="(optional)" name="lname">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">Email address</label>
                        <input type="email" class="form-control"  placeholder="name@example.com" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">Institution/Organisation</label>
                        <input type="text" class="form-control"  placeholder="(optional)" name="organisation" >
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">Mobile/Phone number</label>
                        <input type="tel" class="form-control" name="phone" placeholder="(optional)">
                    </div>

                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Feedback</label>
                        <textarea class="form-control"  rows="5" name="feedback" required></textarea>
                    </div>
                    <div class="form-group ">

                        <input type="submit" class="form-control btn btn-primary col-md-3"    name="submit" ></input>
                    </div>
                    <!-- </div> -->
                    </form>

                    <h6>For other contacts you can refer our <a href="about.php">about</a> page</h6>
                  <!-- <h4>The northern part of India, during winter months (Dec-Jan),
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
                    to plan their air-traffic.</h4> -->
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

<?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include dirname(__DIR__, 1) . '/footer.php'; ?>
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
</script>
<script>
     window.addEventListener('load', function() {
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>
</body>

</html>
