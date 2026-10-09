<?php include 'apis/start_admin.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Camera-Based Visibility Detection</title>
    <link rel="icon" type="image/png" href="./assets/img/iitk.png">
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
    <?php if (!defined("FOG_HEAD_DONE")) define("FOG_HEAD_DONE", true); $_GET['page'] = "camera"; include "navbar.php"; ?>

    <main class="page page-camera">
        
        <header class="cam-page-header">
            <h1 class="cam-title">Camera-Based Visibility Detection</h1>
            <p class="cam-subtitle">CNN visibility classification from IITK airstrip imagery</p>

            <div class="cam-metadata-strip">
                <div class="cam-meta-block">
                    <span class="cam-meta-label">Data Source</span>
                    <span class="cam-meta-val">IITK Airstrip</span>
                </div>
                <div class="cam-meta-block">
                    <span class="cam-meta-label">Cameras</span>
                    <span class="cam-meta-val">Cam 1 · Cam 2</span>
                </div>
                <div class="cam-meta-block">
                    <span class="cam-meta-label">Threshold</span>
                    <span class="cam-meta-val">1 km Visibility</span>
                </div>
                <div class="cam-meta-block">
                    <span class="cam-meta-label">Latest Data</span>
                    <span class="cam-meta-val" id="latest-data-time">--</span>
                </div>
            </div>
            <div class="cam-metadata-strip">
                <div class="cam-meta-block">
                    <span class="cam-meta-label">Observation Day</span>
                    <input id="myInputSecond" class="form-control" type="datetime-local" required>
                    <button class="cam-btn" onclick="newdata()">Apply</button>
                    <button class="cam-btn" onclick="latest(); newdata();">Latest</button>
                </div>
            </div>
        </header>

        <!-- CAMERA 1 CORRECT -->
        <section class="cam-section card">
            <div class="cam-controls">
                <h2 class="cam-section-title correct">Cam 1 — Correctly Classified</h2>
                <div>
                    <button class="cam-btn" id="prevBtn1C" onclick="prependImage('Cam1,Classified')" aria-label="Previous images">Prev</button>
                    <button class="cam-btn" id="nextBtn1C" onclick="appendImage('Cam1,Classified')" aria-label="Next images">Next</button>
                </div>
            </div>
            <div class="obs-gallery" id="Cam1C" aria-live="polite">
                <div class="cam-state-msg">Loading camera observations...</div>
            </div>
        </section>

        <!-- CAMERA 1 INCORRECT -->
        <?php if($admin): ?>
        <section class="cam-section card">
            <div class="cam-controls">
                <h2 class="cam-section-title incorrect">Cam 1 — Misclassified</h2>
                <div>
                    <button class="cam-btn" id="prevBtn1M" onclick="prependImage('Cam1,MisClassified')" aria-label="Previous images">Prev</button>
                    <button class="cam-btn" id="nextBtn1M" onclick="appendImage('Cam1,MisClassified')" aria-label="Next images">Next</button>
                </div>
            </div>
            <div class="obs-gallery" id="Cam1M" aria-live="polite">
                <div class="cam-state-msg">Loading camera observations...</div>
            </div>
        </section>
        <?php endif; ?>

        <!-- CAMERA 2 CORRECT -->
        <section class="cam-section card">
            <div class="cam-controls">
                <h2 class="cam-section-title correct">Cam 2 — Correctly Classified</h2>
                <div>
                    <button class="cam-btn" id="prevBtn2C" onclick="prependImage('Cam2,Classified')" aria-label="Previous images">Prev</button>
                    <button class="cam-btn" id="nextBtn2C" onclick="appendImage('Cam2,Classified')" aria-label="Next images">Next</button>
                </div>
            </div>
            <div class="obs-gallery" id="Cam2C" aria-live="polite">
                <div class="cam-state-msg">Loading camera observations...</div>
            </div>
        </section>

        <!-- CAMERA 2 INCORRECT -->
        <?php if($admin): ?>
        <section class="cam-section card">
            <div class="cam-controls">
                <h2 class="cam-section-title incorrect">Cam 2 — Misclassified</h2>
                <div>
                    <button class="cam-btn" id="prevBtn2M" onclick="prependImage('Cam2,MisClassified')" aria-label="Previous images">Prev</button>
                    <button class="cam-btn" id="nextBtn2M" onclick="appendImage('Cam2,MisClassified')" aria-label="Next images">Next</button>
                </div>
            </div>
            <div class="obs-gallery" id="Cam2M" aria-live="polite">
                <div class="cam-state-msg">Loading camera observations...</div>
            </div>
        </section>
        <?php endif; ?>

        <section class="cam-section card">
            <h2 class="cam-section-title">Performance Metrics</h2>
            <p>Not available from the current image archive.</p>
            <p>Camera classification is interpreted against the 1 km visibility threshold used by the project.</p>
        </section>

    </main>
    <?php $footerCopyrightHtml = "&copy; Fog Prediction, IIT Kanpur. All rights reserved."; include __DIR__ . "/footer.php"; ?>

    <!-- Scripts -->
    <script src="./assets/js/core/jquery.min.js"></script>
    <script src="./assets/js/core/popper.min.js"></script>
    <script src="./assets/js/core/bootstrap.min.js"></script>
    
    <script>
        var maxItems = 6;

        function updateLatestTime(dateStr) {
            if (dateStr && dateStr.trim() !== '') {
                $('#latest-data-time').text(dateStr + ' IST');
            }
        }

        function handleEmpty(containerId, html) {
            if (!html || html.trim() === '' || html.trim() === '@@@@' || html.trim() === '@@') {
                $('#' + containerId).html('<div class="cam-state-msg">No camera observations available for this period.</div>');
                return true;
            }
            return false;
        }

        function initLoad() {
            $.ajax({
                type: "GET",
                url: "apis/fetch_images.php",
                success: function(response) {
                    var data = response.split('@@');
                    
                    if (!handleEmpty('Cam1C', data[0])) $('#Cam1C').html(data[0]);
                    if (!handleEmpty('Cam2C', data[1])) $('#Cam2C').html(data[1]);
                    if (!handleEmpty('Cam1M', data[2])) $('#Cam1M').html(data[2]);
                    if (!handleEmpty('Cam2M', data[3])) $('#Cam2M').html(data[3]);

                    // Try to extract latest date from the first image loaded
                    var firstDate = $('.obs-meta-date').first().text();
                    updateLatestTime(firstDate.replace(' IST', ''));
                },
                error: function(xhr, status, error) {
                    console.error(error);
                    $('.obs-gallery').html('<div class="cam-state-msg">Camera observation data could not be loaded.</div>');
                }
            });
        }

        function newdata() {
            let date = $('#myInputSecond').val();
            $('.obs-gallery').html('<div class="cam-state-msg">Loading camera observations...</div>');
            $.ajax({
                type: "POST",
                data: { method: 'Date', date: date },
                url: "apis/fetch_images.php",
                success: function(response) {
                    var data = response.split('@@');
                    if (!handleEmpty('Cam1C', data[0])) $('#Cam1C').html(data[0]);
                    if (!handleEmpty('Cam2C', data[1])) $('#Cam2C').html(data[1]);
                    if (!handleEmpty('Cam1M', data[2])) $('#Cam1M').html(data[2]);
                    if (!handleEmpty('Cam2M', data[3])) $('#Cam2M').html(data[3]);
                }
            });
        }

        function latest() {
            const now = new Date();
            var mon = (now.getMonth() + 1 < 10) ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
            var date = (now.getDate() < 10) ? '0' + now.getDate() : now.getDate()
            var minite = (now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes()
            var hour = (now.getHours() < 10) ? '0' + now.getHours() : now.getHours()
            var today = now.getFullYear() + '-' + mon + '-' + date + 'T' + hour + ':' + minite;
            $('#myInputSecond').val(today);
        }

        function prependImage(cam) {
            var btnNext = '#nextBtn' + cam[3] + cam[5];
            var btnPrev = '#prevBtn' + cam[3] + cam[5];
            $(btnNext + ', ' + btnPrev).hide();
            $.ajax({
                type: "POST",
                data: { cam: cam, method: 'Prev' },
                url: "apis/fetch_images.php",
                success: function(response) {
                    var target = '#' + cam.slice(0,4) + cam[5];
                    // Remove empty state message if present
                    $(target + ' .cam-state-msg').remove();

                    if(response && response.trim() !== '') {
                        $(target).prepend(response);
                        if ($(target + ' .obs-figure').length > maxItems) {
                            $(target + ' .obs-figure:last').remove();
                        }
                    }
                    setTimeout(function() { $(btnNext + ', ' + btnPrev).show(); }, 500);
                },
                error: function(xhr, status, error) {
                    setTimeout(function() { $(btnNext + ', ' + btnPrev).show(); }, 500);
                }
            });
        }

        function appendImage(cam) {
            var btnNext = '#nextBtn' + cam[3] + cam[5];
            var btnPrev = '#prevBtn' + cam[3] + cam[5];
            $(btnNext + ', ' + btnPrev).hide();
            $.ajax({
                type: "POST",
                data: { cam: cam, method: 'Next' },
                url: "apis/fetch_images.php",
                success: function(response) {
                    var target = '#' + cam.slice(0,4) + cam[5];
                    $(target + ' .cam-state-msg').remove();

                    if(response && response.trim() !== '') {
                        $(target).append(response);
                        if ($(target + ' .obs-figure').length > maxItems) {
                            $(target + ' .obs-figure:first').remove();
                        }
                    }
                    setTimeout(function() { $(btnNext + ', ' + btnPrev).show(); }, 500);
                },
                error: function(xhr, status, error) {
                    setTimeout(function() { $(btnNext + ', ' + btnPrev).show(); }, 500);
                }
            });
        }

        // Init
        latest();
        initLoad();
    </script>
</body>
</html>
