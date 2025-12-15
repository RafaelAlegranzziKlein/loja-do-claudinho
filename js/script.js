import { db } from "./firebaseConfig.js";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
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
            <strong>Nome do fornecedor:</strong> ${boleto.nomeFornecedor}<br>
            <strong>Valor da dívida:</strong> R$ ${Number(boleto.valor)}<br>
            <strong>Juros ao dia:</strong> ${boleto.juros}%<br>
            <strong>Data vencimento:</strong> ${formatarDataBR(boleto.dataVencimento)}<br>
            <button class="btn-pagar" data-id="${boleto.id}">Pagar</button>
        `;

        listarBoletosDiv.appendChild(div);
    }
}

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

document.addEventListener("DOMContentLoaded", carregarlistaBoletos);