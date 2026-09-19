<?php
$myfile = fopen("../response.txt", "r") or die("Unable to open file!");
echo json_decode(fread($myfile,filesize("../response.txt")));
fclose($myfile);
?> 
