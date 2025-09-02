<?php
$input = file_get_contents("php://input");
$data = json_decode($input,true);
if(isset($data['nome']) && isset($data['dados'])){
    $nome = preg_replace("/[^a-zA-Z0-9_-]/","",$data['nome']);
    file_put_contents(__DIR__."/bancos/$nome.json", json_encode($data['dados']));
    echo "Arquivo $nome.json salvo!";
}else{ echo "Dados inválidos!"; }
?>
