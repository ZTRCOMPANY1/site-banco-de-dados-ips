window.addEventListener("DOMContentLoaded", ()=>{

const user = localStorage.getItem("user");
if(!user) window.location.href = "index.html";
document.getElementById("userDisplay").textContent = user;

const foldersContainer = document.getElementById("folders");
const tableContainer = document.getElementById("tableContainer");
const planilhaTitle = document.getElementById("planilhaTitle");

let pastas = {};
let pastaAtual = null;

// FUNÇÃO PARA CRIAR A DIV DE CADA PASTA
function criarDivPasta(nome){
  const div = document.createElement("div");
  div.className = "folder";
  div.textContent = nome;
  div.onclick = ()=> abrirPasta(nome);
  foldersContainer.appendChild(div);
}

// ABRIR PASTA
function abrirPasta(nome){
  pastaAtual = nome;
  planilhaTitle.textContent = `Planilha: ${nome}`;
  
  fetch(`bancos/${user}/${nome}.json`)
    .then(res => res.json())
    .then(dados => {
      pastas[pastaAtual] = {
        linhas: dados.length,
        colunas: dados[0]?.length || 5,
        dados: dados
      };
      renderTabela();
    })
    .catch(err=>{
      pastas[nome] = { linhas:5, colunas:5, dados:Array.from({length:5},()=>Array(5).fill("")) };
      renderTabela();
    });
}

// LISTAR PASTAS EXISTENTES
fetch(`listarPastas.php?usuario=${user}`)
.then(res => res.json())
.then(pastasServidor=>{
    pastasServidor.forEach(nome=>{
        pastas[nome] = null;
        criarDivPasta(nome);
    });
});

// BOTÕES DE PASTA
document.getElementById("addFolderBtn").addEventListener("click", ()=>{
  const nome = prompt("Nome da pasta:");
  if(!nome || pastas[nome]) return alert("Nome inválido ou já existe!");
  pastas[nome] = { linhas:5, colunas:5, dados:Array.from({length:5},()=>Array(5).fill("")) };
  criarDivPasta(nome);
  abrirPasta(nome);
  fetch("salvar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({nome:nome,dados:pastas[nome].dados, usuario: user})
  });
});

document.getElementById("removeFolderBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  if(confirm(`Apagar pasta "${pastaAtual}"?`)){
    fetch(`remover.php?nome=${pastaAtual}&usuario=${user}`).then(res=>res.text()).then(console.log);
    delete pastas[pastaAtual];
    foldersContainer.innerHTML = "";
    Object.keys(pastas).forEach(criarDivPasta);
    tableContainer.innerHTML = "";
    pastaAtual = null;
  }
});

// RENDERIZAR TABELA
function renderTabela(){
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  tableContainer.innerHTML = "";
  const table = document.createElement("table");

  for(let i=0;i<pasta.linhas;i++){
    const tr = document.createElement("tr");
    for(let j=0;j<pasta.colunas;j++){
      const td = document.createElement(i===0?'th':'td');
      td.contentEditable="true";
      td.textContent = pasta.dados[i][j];
      td.oninput = ()=>{
        pasta.dados[i][j] = td.textContent;
      };
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  tableContainer.appendChild(table);
}

// BOTÕES LINHA/COLUNA
document.getElementById("addRowBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  pasta.dados.push(Array(pasta.colunas).fill(""));
  pasta.linhas++;
  renderTabela();
});
document.getElementById("removeRowBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  if(pasta.linhas>1){ pasta.dados.pop(); pasta.linhas--; renderTabela(); }
});
document.getElementById("addColBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  pasta.colunas++;
  pasta.dados.forEach(row=>row.push(""));
  renderTabela();
});
document.getElementById("removeColBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  if(pasta.colunas>1){ pasta.colunas--; pasta.dados.forEach(r=>r.pop()); renderTabela(); }
});

// EXPORTAR EXCEL
document.getElementById("exportBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  const pasta = pastas[pastaAtual];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(pasta.dados);
  XLSX.utils.book_append_sheet(wb, ws, pastaAtual);
  XLSX.writeFile(wb, pastaAtual+".xlsx");
});

// IMPORTAR EXCEL
document.getElementById("importFile").addEventListener("change", function(e){
  if(!pastaAtual) return;
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data,{type:"array"});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet,{header:1});
    const pasta = pastas[pastaAtual];
    pasta.linhas = jsonData.length;
    pasta.colunas = jsonData[0].length;
    pasta.dados = jsonData.map(r=>[...r]);
    renderTabela();
    fetch("salvar.php",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({nome:pastaAtual,dados:pasta.dados, usuario:user})
    }).then(res=>res.text()).then(console.log);
  };
  reader.readAsArrayBuffer(file);
});

// BOTÃO SALVAR
document.getElementById("saveBtn").addEventListener("click", ()=>{
  if(!pastaAtual) return;
  fetch("salvar.php",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({nome:pastaAtual, dados:pastas[pastaAtual].dados, usuario:user})
  }).then(res=>res.text()).then(console.log);
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", ()=>{
  localStorage.removeItem("user");
  window.location.href="index.html";
});

});
