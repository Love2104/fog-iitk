<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "./include/head.php"; ?>

</head>
<body id="page" class="index-page site-page archive-page">

  <!-- Navigation bar starts -->

  <?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 2) . '/navbar.php'; ?>
<main class="page page-archive page-archive-iitkstation"><div class="page-header"><h1>Fog Prediction</h1></div>



  <!-- Navigation bar ends -->




  <div class="row align-items-center">
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

<div class="align-items-center" align="center">
    <input type="button" class="btn btn-primary btn-fab btn-icon btn-round" value="submit" onclick="findResponse()">
</div>
<div id="response">
</div>


</main>
<?php include "./include/tail.php"; ?>

</body>

</html>
