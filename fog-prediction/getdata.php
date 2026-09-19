<?php
    if(!empty($_POST['data']))
    {
	$status = $_POST['data'];
	echo "status=".$status;
	echo file_put_contents("test.txt",$status."\n",FILE_APPEND | LOCK_EX);

	}
else{
echo "error";}
?>

