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
              </div>
              <div class="navbar-nav flex-row mr-auto ml-4 d-none d-md-flex">
                <ul class="navbar-nav ">
                    <li class="nav-item">
                        <a class="nav-link" href="contact_us.php" target="_blank" style="font-size:larger;font-weight: bold;">Feedback</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.php" target="_blank" style="font-size:larger;font-weight: bold;">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="publication.php" target="_blank" style="font-size:larger;font-weight: bold;background:#5e72e4;">Publications</a>
                    </li>
                  
              </ul>
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
  </nav> -->
  <?php $_GET['page'] = "about"; include "navbar.php" ?>


  <!-- Navigation bar ends -->


  <div class="wrapper container-fuild">
      <section class="section section-shaped rounded" style="padding-bottom:2rem;">
          <div class="shape shape-primary" style="height: 100px;">
          </div>
      </section>
  </div>

    <section class="section  pb-0" style="padding-top:1rem;">
      <div class="container">
        <div class="card shadow">
          <div class="card-body rounded" style="padding:2rem;">
            <h1 class="heading-title text-warning" style="text-align: center; margin-bottom: 2rem;"><b>Publications</b></h1>
            
            <div class="publications-grid">
              <?php 
                if ($publications && is_array($publications)) {
                  foreach ($publications as $index => $publication) {
                    $pub_id = 'pub_' . $index;
                    $is_expanded = false;
              ?>
                <div class="publication-card card mb-3 shadow-sm">
                  <div class="card-header bg-white p-0" style="cursor: pointer; border: none;" onclick="togglePublication('<?php echo $pub_id; ?>')">
                    <div class="row align-items-center p-3" style="margin: 0;">
                      <div class="col-md-10">
                        <h5 class="mb-2" style="color: #2c3e50; font-weight: 600;">
                          <?php echo htmlspecialchars($publication['title']); ?>
                        </h5>
                        <p class="mb-1" style="color: #7f8c8d; font-size: 0.9rem;">
                          <strong>Publication:</strong> <?php echo htmlspecialchars($publication['publication']); ?>
                        </p>
                        <?php if (!empty($publication['download_link'])) { ?>
                          <p class="mb-0">
                            <a href="<?php echo htmlspecialchars($publication['download_link']); ?>" target="_blank" class="btn btn-sm btn-primary mt-2">
                              <i class="fas fa-download"></i> Download Paper
                            </a>
                          </p>
                        <?php } ?>
                      </div>
                      <div class="col-md-2 text-right">
                        <i class="fas fa-chevron-down toggle-icon" id="icon_<?php echo $pub_id; ?>" style="font-size: 1.5rem; color: #5e72e4; transition: transform 0.3s ease;"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="collapse-content" id="<?php echo $pub_id; ?>" style="display: none;">
                    <div class="card-body" style="border-top: 1px solid #e0e0e0; padding-top: 1.5rem;">
                      
                      <?php if (!empty($publication['abstract'])) { ?>
                        <div class="mb-3">
                          <h6 style="color: #2c3e50; font-weight: 600; margin-bottom: 0.5rem;">Abstract:</h6>
                          <p style="color: #5a6c7d; font-size: 0.95rem; line-height: 1.6;">
                            <?php echo htmlspecialchars($publication['abstract']); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['authors']) && is_array($publication['authors'])) { ?>
                        <div class="mb-3">
                          <h6 style="color: #2c3e50; font-weight: 600; margin-bottom: 0.5rem;">Authors:</h6>
                          <p style="color: #5a6c7d; font-size: 0.95rem;">
                            <?php echo htmlspecialchars(implode(', ', $publication['authors'])); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['citation'])) { ?>
                        <div class="mb-3">
                          <h6 style="color: #2c3e50; font-weight: 600; margin-bottom: 0.5rem;">Citation:</h6>
                          <p style="color: #5a6c7d; font-size: 0.9rem; line-height: 1.5; padding: 1rem; background-color: #f8f9fa; border-left: 3px solid #5e72e4; border-radius: 4px;">
                            <?php echo htmlspecialchars($publication['citation']); ?>
                          </p>
                        </div>
                      <?php } ?>

                      <?php if (!empty($publication['keywords']) && is_array($publication['keywords'])) { ?>
                        <div class="mb-2">
                          <h6 style="color: #2c3e50; font-weight: 600; margin-bottom: 0.5rem;">Keywords:</h6>
                          <div>
                            <?php 
                              foreach ($publication['keywords'] as $keyword) {
                                echo '<span class="badge badge-primary" style="margin-right: 0.5rem; margin-bottom: 0.5rem;">' . htmlspecialchars($keyword) . '</span>';
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