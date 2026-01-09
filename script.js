/* ===== CONFIGURAÇÃO GOOGLE SHEETS ===== */
const API_URL = "https://script.google.com/macros/s/AKfycbz8r4HlniXVp6ecGHPbdwTYjUFPYxBw51ptAJRe0uB3j_NBAsk-87vDyRCr7p7_PooJiA/exec";

/* ===== CONTADORES ===== */
let compras = 0;
let vendas = 0;
let linhaEditando = null;

/* ===== SALVAR ===== */
function salvar(tipo) {
  const dados = {
    tipo,
    placa: document.getElementById(tipo + "Placa").value,
    modelo: document.getElementById(tipo + "Modelo").value,
    ano: document.getElementById(tipo + "Ano").value,
    valor: document.getElementById(tipo + "Valor").value,
    endereco: document.getElementById(tipo + "Endereco").value,
    telefone: document.getElementById(tipo + "Telefone").value,
    rg: document.getElementById(tipo + "Rg").value,
    cpf: document.getElementById(tipo + "Cpf").value,
    data: document.getElementById(tipo + "Data").value,
    obs: document.getElementById(tipo + "Obs").value
  };

  if (!dados.placa || !dados.valor) {
    alert("Placa e valor são obrigatórios");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  adicionarNaTabela(dados);
  document.getElementById(tipo + "Form").reset();
}

/* ===== ADICIONAR NA TABELA ===== */
function adicionarNaTabela(d) {
  const tr = document.createElement("tr");
  tr.classList.add(d.tipo);
  tr.dataset.id = d.id || "";

  tr.innerHTML = `
    <td>${d.tipo}</td>
    <td>${d.placa}</td>
    <td>${d.modelo}</td>
    <td>${d.ano}</td>
    <td>${d.valor}</td>
    <td>${d.endereco}</td>
    <td>${d.telefone}</td>
    <td>${d.rg}</td>
    <td>${d.cpf}</td>
    <td>${d.data}</td>
    <td>${d.obs}</td>
    <td>
      <button type="button" onclick="editar(this)">Editar</button>
      <button type="button" onclick="excluir(this)">Excluir</button>
    </td>
  `;

  document.getElementById("tabelaDados").appendChild(tr);

  if (d.tipo === "compra") compras++;
  if (d.tipo === "venda") vendas++;

  document.getElementById("totalCompras").innerText = compras;
  document.getElementById("totalVendas").innerText = vendas;
}

/* ===== EXCLUIR ===== */
function excluir(btn) {
  const linha = btn.parentElement.parentElement;
  const id = linha.dataset.id;
  const tipo = linha.children[0].innerText;

  fetch(API_URL + "?acao=excluir&id=" + id);

  if (tipo === "compra") compras--;
  if (tipo === "venda") vendas--;

  document.getElementById("totalCompras").innerText = Math.max(compras, 0);
  document.getElementById("totalVendas").innerText = Math.max(vendas, 0);

  linha.remove();
}

/* ===== EDITAR ===== */
function editar(btn) {
  linhaEditando = btn.parentElement.parentElement;

  document.getElementById("editPlaca").value = linhaEditando.children[1].innerText;
  document.getElementById("editModelo").value = linhaEditando.children[2].innerText;
  document.getElementById("editAno").value = linhaEditando.children[3].innerText;
  document.getElementById("editValor").value = linhaEditando.children[4].innerText;
  document.getElementById("editEndereco").value = linhaEditando.children[5].innerText;
  document.getElementById("editTelefone").value = linhaEditando.children[6].innerText;
  document.getElementById("editRg").value = linhaEditando.children[7].innerText;
  document.getElementById("editCpf").value = linhaEditando.children[8].innerText;
  document.getElementById("editData").value = linhaEditando.children[9].innerText;
  document.getElementById("editObs").value = linhaEditando.children[10].innerText;

  document.getElementById("modal").style.display = "flex";
}

/* ===== SALVAR EDIÇÃO ===== */
function salvarEdicao() {
  linhaEditando.children[1].innerText = document.getElementById("editPlaca").value;
  linhaEditando.children[2].innerText = document.getElementById("editModelo").value;
  linhaEditando.children[3].innerText = document.getElementById("editAno").value;
  linhaEditando.children[4].innerText = document.getElementById("editValor").value;
  linhaEditando.children[5].innerText = document.getElementById("editEndereco").value;
  linhaEditando.children[6].innerText = document.getElementById("editTelefone").value;
  linhaEditando.children[7].innerText = document.getElementById("editRg").value;
  linhaEditando.children[8].innerText = document.getElementById("editCpf").value;
  linhaEditando.children[9].innerText = document.getElementById("editData").value;
  linhaEditando.children[10].innerText = document.getElementById("editObs").value;

  fetch(API_URL, {
    method: "PUT",
    body: JSON.stringify({
      id: linhaEditando.dataset.id,
      rg: linhaEditando.children[7].innerText,
      cpf: linhaEditando.children[8].innerText
    })
  });

  fecharModal();
}

/* ===== MODAL ===== */
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

/* ===== FILTRO ===== */
function filtrarTabela() {
  const texto = document.getElementById("busca").value.toLowerCase();
  const linhas = document.querySelectorAll("#tabelaDados tr");

  linhas.forEach(linha => {
    const placa = linha.children[1].innerText.toLowerCase();
    const modelo = linha.children[2].innerText.toLowerCase();
    const rg = linha.children[7].innerText.toLowerCase();
    const cpf = linha.children[8].innerText.toLowerCase();

    if (
      placa.includes(texto) ||
      modelo.includes(texto) ||
      rg.includes(texto) ||
      cpf.includes(texto)
    ) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
}

/* ===== CARREGAR DADOS ===== */
window.onload = carregarDados;

function carregarDados() {
  fetch(API_URL)
    .then(res => res.json())
    .then(dados => {
      dados.forEach(d => {
        adicionarNaTabela(d);
      });
    });
}
