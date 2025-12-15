import { db } from "./firebaseConfig.js";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/* =============================
   FORMATAR DATA PT-BR
============================= */
function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/* =============================
   BUSCAR BOLETOS
============================= */
async function buscarBoletos() {
    const snapshot = await getDocs(collection(db, "boletos"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

const listarBoletosDiv = document.getElementById("listagem-boletos");

async function carregarlistaBoletos() {
    listarBoletosDiv.innerHTML = "<p>Carregando boletos...</p>";
    const boletos = await buscarBoletos();
    renderizarListaBoletos(boletos);
}

function renderizarListaBoletos(boletos) {
    listarBoletosDiv.innerHTML = "";

    if (!boletos.length) {
        listarBoletosDiv.innerHTML = "<p>Nenhum boleto cadastrado</p>";
        return;
    }

    for (let boleto of boletos) {
        const div = document.createElement("div");
        div.className = "form-container";

        div.innerHTML = `
            <strong>Fornecedor:</strong> ${boleto.nomeFornecedor}<br>
            <strong>Valor:</strong> R$ ${Number(boleto.valor)}<br>
            <strong>Juros ao dia:</strong> ${boleto.juros}%<br>
            <strong>Vencimento:</strong> ${formatarDataBR(boleto.dataVencimento)}<br>
            <button class="btn-pagar" data-id="${boleto.id}">Pagar</button>
        `;

        listarBoletosDiv.appendChild(div);
    }
}

/* =============================
   MODAL DE PAGAMENTO
============================= */
const modal = document.getElementById("modalPagamento");
let boletoAtual = null;

listarBoletosDiv.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-pagar");
    if (!btn) return;

    const ref = doc(db, "boletos", btn.dataset.id);
    const snap = await getDoc(ref);

    boletoAtual = { id: btn.dataset.id, ...snap.data() };

    document.getElementById("dataPagamento").value =
        new Date().toISOString().split("T")[0];

    atualizarResumoPagamento();
    modal.classList.remove("hidden");
});

/* =============================
   CÁLCULO DE JUROS
============================= */
function calcularDetalhesPagamento(boleto, dataPagamento) {
    const valorInicial = Number(boleto.valor);
    const valorConta = Number(boleto.valor);
    const taxaJuros = Number(boleto.juros) / 100;

    const vencimento = new Date(boleto.dataVencimento);
    const pagamento = new Date(dataPagamento);

    let diasAtraso = 0;
    if (pagamento > vencimento) {
        diasAtraso = Math.floor((pagamento - vencimento) / (1000 * 60 * 60 * 24));
    }

    const jurosValor = valorConta * taxaJuros * diasAtraso;
    const valorTotal = valorConta + jurosValor;

    return {
        valorInicial,
        valorConta,
        diasAtraso,
        taxaJuros,
        jurosValor,
        total: valorTotal
    };
}

function atualizarResumoPagamento() {
    const data = document.getElementById("dataPagamento").value;
    const dados = calcularDetalhesPagamento(boletoAtual, data);

    document.getElementById("dividaAtual").innerText = dados.valorConta.toFixed(2);
    document.getElementById("jurosPercentual").innerText = boletoAtual.juros;
    document.getElementById("jurosValor").innerText = dados.jurosValor.toFixed(2);
    document.getElementById("valorParaZerar").innerText = dados.total.toFixed(2);
    document.getElementById("totalComJuros").innerText = dados.total.toFixed(2);

    document.getElementById("valorPago").max = dados.total.toFixed(2);
}

document.getElementById("dataPagamento")
    .addEventListener("change", atualizarResumoPagamento);

/* =============================
   CONFIRMAR PAGAMENTO
============================= */
document.getElementById("confirmarPagamento").addEventListener("click", async () => {
    const valorPago = Number(document.getElementById("valorPago").value);
    const total = Number(document.getElementById("totalComJuros").innerText);
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
    const ref = doc(db, "boletos", boletoAtual.id);

    if (saldo === 0) {
        await deleteDoc(ref);
        alert("Boleto quitado!");
    } else {
        await setDoc(ref, {
            valor: saldo,
            ultimoPagamento: valorPago,
            dataPagamento: dataPagamento
        }, { merge: true });
    }

    modal.classList.add("hidden");
    carregarlistaBoletos();
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
document.addEventListener("DOMContentLoaded", carregarlistaBoletos);
