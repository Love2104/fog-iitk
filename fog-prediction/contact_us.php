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
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> -->
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
                <h2 style="color: #ffffff; margin-left: 100px;font-weight: bold;">Contact Us</h2>
            </div> -->
            <!--<ul class="navbar-nav ">
                    <li class="nav-item">
                        <a class="nav-link" href="contact_us.php" target="_blank" style="font-size:larger;font-weight: bold;background:#5e72e4;">Feedback</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.php" target="_blank" style="font-size:larger;font-weight: bold;">About Us</a>
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
            <h1 class="heading-title text-warning" style="text-align: center;"><b>Feedback</b></h1>
            <div class="container">
                <div class="card-body rounded"  style="padding:1rem 2rem 1rem 2rem;">
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
                                ?><div class="alert alert-danger" style="text-align:center;">Error saving feedback. Please try again.</div><?php
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
                                    ?><div class="alert alert-success" style="text-align:center;">Your valuable feedback has been recorded and confirmation email sent.</div><?php
                                } else {
                                    ?><div class="alert alert-warning" style="text-align:center;">Your valuable feedback has been recorded. (Email notification sent)</div><?php
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
                    <div class="form-group " style="text-align:center;">
                        
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
</script>
<script>
     window.addEventListener('load', function() {
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });
  </script>
</body>

</html>