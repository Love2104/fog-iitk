<?php

    $upload_dir= './uploads';
    $num_uploads = 2;
    $max_file_size  = 51200;
    $ini_max = str_replace('M', '', ini_get('upload_max_filesize'));
    $upload_max = $ini_max * 1024;
    $msg = 'Please select files for uploading';
    $messages = array();

    if(isset($_FILES['userfile']['tmp_name']))
    {
        for($i=0; $i < count($_FILES['userfile']['tmp_name']);$i++)
        {
            if(!is_uploaded_file($_FILES['userfile']['tmp_name'][$i]))
            {
                $messages[] = 'No file uploaded';
            }
            elseif($_FILES['userfile']['size'][$i] > $upload_max)
            {
                $messages[] = "File size exceeds $upload_max php.ini limit";
            }
            elseif($_FILES['userfile']['size'][$i] > $max_file_size)
            {
                $messages[] = "File size exceeds $max_file_size limit";
            }
            else
            {
                if(@copy($_FILES['userfile']['tmp_name'][$i],$upload_dir.'/'.$_FILES['userfile']['name'][$i]))
                {
                    $messages[] = $_FILES['userfile']['name'][$i].' uploaded';
                }
                else
                {
                    $messages[] = 'Uploading '.$_FILES['userfile']['name'][$i].' Failed';
                }
            }
        }
    }
?>

 <html>
 <head>
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <base href="/">
 <title>Multiple File Upload</title>
     <link rel="stylesheet" href="/assets/css/theme.css">
<script>(function(){try{var t=localStorage.getItem('fog-theme');document.documentElement.setAttribute('data-theme',t==='light'||t==='dark'?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch(e){}})();</script>
</head>

 <body class="site-page archive-page">
<?php if (!defined('FOG_HEAD_DONE')) define('FOG_HEAD_DONE', true); include dirname(__DIR__, 4) . '/navbar.php'; ?>
<main class="page page-archive page-archive-upload"><div class="page-header"><h1>Multiple File Upload</h1></div>


 <h3><?php echo $msg; ?></h3>
 <p>
 <?php
    if(sizeof($messages) != 0)
    {
        foreach($messages as $err)
        {
            echo $err.'<br />';
        }
    }
 ?>
 </p>
 <form enctype="multipart/form-data" action="<?php echo htmlentities($_SERVER['PHP_SELF']);?>" method="post">
 <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo $max_file_size; ?>" />
 <?php
    $num = 0;
    while($num < $num_uploads)
    {
        echo '<div><input name="userfile[]" type="file" /></div>';
        $num++;
    }
 ?>

 <input type="submit" value="Upload" />
 </form>

 </main>
 <?php include dirname(__DIR__, 4) . '/footer.php'; ?>
 </body>
 </html>

