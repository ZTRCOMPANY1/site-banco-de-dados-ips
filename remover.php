<?php
if(isset($_GET['nome'])){
    $nome = preg_replace("/[^a-zA-Z0-9_-]/","",$nome = $_GET['nome']);
    $arquivo = __DIR__."/bancos/$nome.json";
    if(file_exists($arquivo)){
        unlink($arquivo);
        echo "Arquivo $nome.json removido!";
    } else { echo "Arquivo não existe!"; }
}else{ echo "Nome inválido!"; }
?>
