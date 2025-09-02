<?php
if(isset($_GET['nome']) && isset($_GET['usuario'])){
    $usuario = preg_replace("/[^a-zA-Z0-9_-]/","",$_GET['usuario']);
    $nome = preg_replace("/[^a-zA-Z0-9_-]/","",$_GET['nome']);

    $arquivo = __DIR__."/bancos/$usuario/$nome.json";
    if(file_exists($arquivo)){
        unlink($arquivo);
        echo "Arquivo $nome.json do usuário $usuario removido!";
    } else { echo "Arquivo não existe!"; }
}else{
    echo "Nome ou usuário inválido!";
}
?>
