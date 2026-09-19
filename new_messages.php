<?php include 'apis/start_admin.php'; ?>
<?php 
    $page='messages';
    $conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  
    
    
    
    // Fetch feedback data from database
    $feedback_data = [];
    $feedback_sql = 'SELECT * FROM feedback ORDER BY date_time DESC';
    $feedback_result = pg_query($conn, $feedback_sql);
    
    if($feedback_result) {
        while($row = pg_fetch_assoc($feedback_result)) {
            $feedback_data[] = $row;
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
    <title>Messages</title>
    <link rel="stylesheet" href="css/main.css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" />
    <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
    <link href="./assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/font-awesome.css" rel="stylesheet" />
    <link href="./assets/css/nucleo-svg.css" rel="stylesheet" />
    <link href="./assets/css/argon-design-system.css?v=1.2.0" rel="stylesheet" />
    <style>
        .feedback-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .feedback-table th {
            background-color: #5e72e4;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        .feedback-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        .feedback-table tr:hover {
            background-color: #f5f5f5;
        }
        .feedback-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
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
              <ul class="navbar-nav ">
                    <li class="nav-item">
                        <a class="nav-link" href="contact_us.php" target="_blank" style="font-size:larger;font-weight: bold;">Feedback</a>
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

  <!-- Main Content Section -->
  <section class="section pb-0" style="padding-top:1rem;">
    <div class="container">
      <div class="card shadow">
        <div class="card-body rounded " style="padding:1rem 2rem 1rem 2rem;">
          <h1 class="heading-title text-warning" style="text-align: center;"><b>Feedback Messages</b></h1>
          <div class="container">
              <div class="card-body rounded"  style="padding:1rem 2rem 1rem 2rem;">
                <?php if(count($feedback_data) > 0) { ?>
                  <div class="table-responsive">
                    <table class="feedback-table">
                      <thead>
                        <tr>
                          <th>Date/Time</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email</th>
                          <th>Organisation</th>
                          <th>Feedback</th>
                          <th>Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php foreach($feedback_data as $feedback) { ?>
                          <tr>
                            <td><?php echo htmlspecialchars($feedback['date_time'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['fname'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['lname'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['email'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['organisation'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['feedback'] ?? ''); ?></td>
                            <td><?php echo htmlspecialchars($feedback['number'] ?? ''); ?></td>
                          </tr>
                        <?php } ?>
                      </tbody>
                    </table>
                  </div>
                <?php } else { ?>
                  <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">No Messages</h4>
                    <p>Currently, there are no feedback messages to display.</p>
                  </div>
                <?php } ?>
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer Section -->
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
</body>

</html>
