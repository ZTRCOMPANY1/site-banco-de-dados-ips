<?php
$input = file_get_contents("php://input");
$data = json_decode($input,true);

if(isset($data['nome']) && isset($data['dados']) && isset($data['usuario'])){
    $usuario = preg_replace("/[^a-zA-Z0-9_-]/","",$data['usuario']);
    $nome = preg_replace("/[^a-zA-Z0-9_-]/","",$data['nome']);

    // CRIA PASTA DO USUÁRIO AUTOMATICAMENTE SE NÃO EXISTIR
    $dir = __DIR__."/bancos/$usuario";
    if(!is_dir($dir)) mkdir($dir, 0777, true);

    file_put_contents("$dir/$nome.json", json_encode($data['dados']));
    echo "Arquivo $nome.json do usuário $usuario salvo!";
}else{
    echo "Dados inválidos!";
}
?>
