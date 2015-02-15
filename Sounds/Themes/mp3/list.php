<?php
    $files = scandir('.');
    foreach($files as $file) {
        if (strlen($file) < 3 || strpos($file, '.mp3') === false) {
            continue;
        }
        
        echo $file . PHP_EOL;
    }
?>