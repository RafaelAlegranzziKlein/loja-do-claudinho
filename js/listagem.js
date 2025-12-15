import { db } from "./firebaseConfig.js";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

//DATA PT BR
function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}


/* =============================
   BUSCAR CLIENTES
============================= */
async function buscarClientes() {
    const snapshot = await getDocs(collection(db, "Clientes"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

const listarClientesDiv = document.getElementById("listagemClientes");

async function carregarlistaClientes() {
    listarClientesDiv.innerHTML = "<p>Carregando clientes...</p>";
    const clientes = await buscarClientes();
    renderizarListaClientes(clientes);
}

function renderizarListaClientes(clientes) {
    listarClientesDiv.innerHTML = "";

    if (!clientes.length) {
        listarClientesDiv.innerHTML = "<p>Nenhum cliente cadastrado</p>";
        return;
    }

    for (let cliente of clientes) {
        const div = document.createElement("div");
        div.className = "form-container";

        div.innerHTML = `
      <strong>Nome:</strong> ${cliente.valueCliente}<br>
      <strong>CPF:</strong> ${cliente.valueCPF}<br>
      <strong>Valor da dívida:</strong> R$ ${Number(cliente.valueDividaCliente)}<br>
      <strong>Juros ao dia:</strong> ${(cliente.valueTxaJuros)}%<br>
     <strong>Vencimento:</strong> ${formatarDataBR(cliente.valueVencimentoDivida)}<br>
      <button class="btn-pagar" data-id="${cliente.id}">Pagar</button>
    `;

        listarClientesDiv.appendChild(div);
    }
}

/* =============================
   MODAL DE PAGAMENTO
============================= */
const modal = document.getElementById("modalPagamento");
let clienteAtual = null;

listarClientesDiv.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-pagar");
    if (!btn) return;

    const ref = doc(db, "Clientes", btn.dataset.id);
    const snap = await getDoc(ref);

    clienteAtual = { id: btn.dataset.id, ...snap.data() };

    document.getElementById("dataPagamento").value =
        new Date().toISOString().split("T")[0];

    atualizarResumoPagamento();
    modal.classList.remove("hidden");
});

/* =============================
   CÁLCULO DE JUROS
============================= */
function calcularDetalhesPagamento(cliente, dataPagamento) {
    // VALOR INICIAL DA DÍVIDA (fixo)
    const valorInicial = Number(cliente.valueValorInicialDivida ?? cliente.valueDividaCliente);

    // VALOR ATUAL (pode já ter pagamentos)
    const valorConta = Number(cliente.valueDividaCliente);

    const taxaJuros = Number((cliente.valueTxaJuros) / 100); // % ao dia

    const vencimento = new Date(cliente.valueVencimentoDivida);
    const pagamento = new Date(dataPagamento);

    let diasAtraso = 0;
    if (pagamento > vencimento) {
        diasAtraso = Math.floor((pagamento - vencimento) / (1000 * 60 * 60 * 24));
    }
    const taxaJurosTotal = (taxaJuros * diasAtraso) / 100;
    const jurosValor = valorConta * taxaJurosTotal;
    const valorTotal = valorConta + jurosValor;

    return {
        valorInicial,
        valorConta,
        diasAtraso,
        taxaJuros,
        taxaJurosTotal,
        jurosValor,
        total: valorTotal
    };
}

function atualizarResumoPagamento() {
    const data = document.getElementById("dataPagamento").value;
    const dados = calcularDetalhesPagamento(clienteAtual, data);

    document.getElementById("dividaAtual").innerText = dados.valorConta.toFixed(2);

    // juros ao dia
    document.getElementById("jurosPercentual").innerText = dados.taxaJuros * 100;

    // juros acumulados em reais
    document.getElementById("jurosValor").innerText = dados.jurosValor.toFixed(2);

    // valor para zerar
    document.getElementById("valorParaZerar").innerText = dados.total.toFixed(2);

    // limitar o valor máximo que o usuário pode pagar
    const inputValor = document.getElementById("valorPago");
    inputValor.max = dados.total.toFixed(2);
}

document.getElementById("dataPagamento")
    .addEventListener("change", atualizarResumoPagamento);

/* =============================
   CONFIRMAR PAGAMENTO
============================= */
document.getElementById("confirmarPagamento").addEventListener("click", async () => {
    const valorPago = Number(document.getElementById("valorPago").value);
    const total = Number(document.getElementById("valorParaZerar").innerText);
    const dataPagamento = document.getElementById("dataPagamento").value;

    if (!valorPago || valorPago <= 0) {
        alert("Valor inválido");
        return;
    }

    if (valorPago > total) {
        alert("Não é permitido pagar mais que o total");
        return;
    }

    const saldo = Number((total - valorPago).toFixed(2));
    const ref = doc(db, "Clientes", clienteAtual.id);

    //  CRIAR NOVO VENCIMENTO = dataPagamento + 30 dias
    const novaData = new Date(dataPagamento);
    novaData.setDate(novaData.getDate() + 30);

    const novoVencimento = novaData.toISOString().split("T")[0];

    if (saldo === 0) {
        await deleteDoc(ref);
        alert("Dívida quitada!");
    } else {
        await setDoc(ref, {
            valueDividaCliente: saldo,
            valueUltimoPagamento: valorPago,
            valueDataPagamento: dataPagamento,
            valueVencimentoDivida: novoVencimento
        }, { merge: true });
    }

    modal.classList.add("hidden");
    carregarlistaClientes();
});
/* =============================
   CANCELAR
============================= */
document.getElementById("cancelarPagamento").onclick = () => {
    modal.classList.add("hidden");
};

/* =============================
   INIT
============================= */
document.addEventListener("DOMContentLoaded", carregarlistaClientes);
