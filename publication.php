<?php include 'apis/start_admin.php'; ?>
<?php
    session_start();

    // Parse publications data from JSON file
    $publications_json = file_get_contents('./apis/publications.json');
    $publications = json_decode($publications_json, true);

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <link rel="apple-touch-icon" sizes="76x76" href="./assets/img/apple-icon.png"> -->
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
    <title>Paper Publication</title>
    <link rel="stylesheet" href="assets/css/theme.css">



    <!--  -->






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




    <main class="page page-publications editorial-narrow">
      <div>
          <div class="page-header">
            <h1>Paper Publications</h1>
            <hr>
          </div>
          <div>


            <div class="publications-grid">
              <?php
                if ($publications && is_array($publications)) {
                  foreach ($publications as $index => $publication) {
                    $pub_id = 'pub_' . $index;
                    $is_expanded = false;
              ?>
                <div class="publication-card card mb-3 shadow-sm">
                  <div class="card-header bg-white p-0" onclick="togglePublication('<?php echo $pub_id; ?>')">
                    <div class="row align-items-center p-3">
                      <div class="col-md-10">
                        <h5 class="mb-2">
                          <?php echo htmlspecialchars($publication['title']); ?>
                        </h5>
                        <p class="mb-1">
                          <strong>Publication:</strong> <?php echo htmlspecialchars($publication['publication']); ?>
                        </p>
                        <?php if (!empty($publication['download_link'])) { ?>
                          <p class="mb-0">
                            <a href="<?php echo htmlspecialchars($publication['download_link']); ?>" target="_blank" class="btn btn-sm btn-primary mt-2">
                              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/></svg> Download Paper
                            </a>
                          </p>
                        <?php } ?>
                      </div>
                      <div class="col-md-2 text-right">
                        <svg class="toggle-icon" id="icon_<?php echo $pub_id; ?>" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg>
                      </div>
                    </div>
                  </div>

                  <div class="collapse-content" id="<?php echo $pub_id; ?>">
                    <div class="card-body">

                      <?php if (!empty($publication['abstract'])) { ?>
                        <div class="mb-3">
                          <h6>Abstract:</h6>
                          <p>
                            <?php echo htmlspecialchars($publication['abstract']); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['authors']) && is_array($publication['authors'])) { ?>
                        <div class="mb-3">
                          <h6>Authors:</h6>
                          <p>
                            <?php echo htmlspecialchars(implode(', ', $publication['authors'])); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['citation'])) { ?>
                        <div class="mb-3">
                          <h6>Citation:</h6>
                          <p>
                            <?php echo htmlspecialchars($publication['citation']); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['keywords']) && is_array($publication['keywords'])) { ?>
                        <div class="mb-2">
                          <h6>Keywords:</h6>
                          <div>
                            <?php
                              foreach ($publication['keywords'] as $keyword) {
                                echo '<span class="badge badge-primary">' . htmlspecialchars($keyword) . '</span>';
                              }
                            ?>
                          </div>
                        </div>
                      <?php } ?>

                    </div>
                  </div>
                </div>
              <?php
                  }
                }
              ?>
            </div>

          </div>
        </div>
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
</script>
<script>
     window.addEventListener('load', function() {
        var renderTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    });

    // Toggle publication details
    function togglePublication(pubId) {
      var contentElement = document.getElementById(pubId);
      var iconElement = document.getElementById('icon_' + pubId);

      if (contentElement.style.display === 'none' || contentElement.style.display === '') {
        contentElement.style.display = 'block';
        iconElement.style.transform = 'rotate(180deg)';
      } else {
        contentElement.style.display = 'none';
        iconElement.style.transform = 'rotate(0deg)';
      }
    }
  </script>
  </body>

</html>
