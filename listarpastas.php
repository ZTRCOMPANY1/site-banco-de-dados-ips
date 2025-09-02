<?php
if(isset($_GET['usuario'])){
    $usuario = preg_replace("/[^a-zA-Z0-9_-]/","",$_GET['usuario']);
    $dir = __DIR__."/bancos/$usuario";
    $files = [];
    if(is_dir($dir)){
        foreach(glob("$dir/*.json") as $file){
            $files[] = basename($file, ".json");
        }
    }
    echo json_encode($files);
}else{
    echo json_encode([]);
}
?>
