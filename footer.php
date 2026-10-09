<?php
/** Shared footer layout. Pages may keep their existing copyright wording. */
$footerHrefBase = $footerHrefBase ?? '';
$footerCopyrightHtml = $footerCopyrightHtml
    ?? '&copy; ' . date('Y') . ' IIT Kanpur. All rights reserved.';
?>
<footer class="fog-foot">
  <div class="fog-foot-inner">
    <div class="foot-col">
      <h2>About</h2>
      <ul>
        <li><a href="<?php echo $footerHrefBase; ?>index.php?station=VIAR">Amritsar</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>index.php?station=VIDP">Delhi</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>index.php?station=VEGY">Gaya</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>index.php?station=VIKN">Kanpur</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>index.php?station=VIJP">Jaipur</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h2>The Model</h2>
      <ul>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#fogcast">FogCast</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#spatial">Spatial Fog</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#compare">Compare Results</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h2>Network</h2>
      <ul>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#sensors">IITK sensors</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#insat">INSAT-3D/3S</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#cameras">Airstrip cameras</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#metar">Airport METAR</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h2>Project</h2>
      <ul>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#team">The group</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#publications">Publications</a></li>
        <li><a href="<?php echo $footerHrefBase; ?>about.php#contact">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-colophon"><?php echo $footerCopyrightHtml; ?></div>
</footer>
