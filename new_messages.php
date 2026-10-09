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
    <link rel="stylesheet" href="assets/css/theme.css">
<script>
(function () {
  try {
    var t = localStorage.getItem('fog-theme');
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (e) {}
})();
</script>
</head>
<body id="page" class="index-page site-page">

  <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include __DIR__ . '/navbar.php'; ?>

  <!-- Main Content Section -->
  <main class="page page-messages">
    <div class="page-header"><h1>Feedback Messages</h1></div>
    <div class="container">
      <div class="card">
        <div class="card-body rounded ">

          <div class="container">
              <div class="card-body rounded">
                <?php if(count($feedback_data) > 0) { ?>
                  <div class="scroll-x">
                    <table class="table feedback-table">
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
  </main>

  <?php $footerCopyrightHtml = '&copy; Fog Prediction , IIT Kanpur. All rights reserved.'; include __DIR__ . '/footer.php'; ?>

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
