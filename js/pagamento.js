import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");
const id = params.get("id");

const colecao = tipo === "cliente" ? "Clientes" : "boleto";

/* ===== BUSCAR DADOS ===== */

const ref = doc(db, colecao, id);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Registro não encontrado");
  throw new Error("Registro não encontrado");
}

const data = snap.data();

/* ===== DADOS DEPENDENDO DO TIPO ===== */
let nome, valor, taxa, vencimento;

if (tipo === "cliente") {
  nome = data.valueCliente;
  valor = data.valueDividaCliente;
  taxa = data.valueTxaJuros;
  vencimento = data.valueVencimentoDivida;
} else {
  nome = data.nomeFornecedor;
  valor = data.valor;
  taxa = data.juros / 100;
  vencimento = data.dataVencimento;
}

/* ===== CALCULO ===== */
function diasAtraso(v) {
  const hoje = new Date();
  const dv = new Date(v);
  return Math.max(0, Math.floor((hoje - dv) / 86400000));
}

const dias = diasAtraso(vencimento);
const juros = valor * taxa * dias;
const total = valor + juros;

/* ===== MOSTRAR NA TELA ===== */
document.getElementById("pgNome").textContent = nome;
document.getElementById("pgValor").textContent = valor.toFixed(2);
document.getElementById("pgJuros").textContent = juros.toFixed(2);
document.getElementById("pgTotal").textContent = total.toFixed(2);
document.getElementById("pgInput").value = total.toFixed(2);

/* ===== CONFIRMAR PAGAMENTO ===== */
document.getElementById("pgConfirmar").addEventListener("click", async () => {
  const pago = Number(document.getElementById("pgInput").value);

  if (pago <= 0 || pago > total) {
    alert("Valor inválido");
    return;
  }

  const novoValor = total - pago;

  if (tipo === "cliente") {
    await updateDoc(ref, { valueDividaCliente: novoValor });
  } else {
    await updateDoc(ref, { valor: novoValor });
  }

  alert("Pagamento realizado com sucesso!");
});