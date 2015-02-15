<?php
    $files = scandir('.');
    foreach($files as $file) {
        if (strlen($file) < 3 || strpos($file, '.mp3') === false || $file[0] != '1') {
            continue;
        }
        
        $spacer = strpos($file, ' ') + 1;
        rename($file, substr($file, $spacer));
    }

?>