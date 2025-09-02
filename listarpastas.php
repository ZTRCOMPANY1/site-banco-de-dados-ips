<?php
$files = array();
foreach(glob("bancos/*.json") as $file){
    $files[] = basename($file, ".json");
}
echo json_encode($files);
?>
