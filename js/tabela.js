<<<<<<< HEAD
import {db} from '../js/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
/**
 * 
 * @author : Pedro
 */

 function getInputBoleto(){
=======
import { db } from './firebaseConfig.js';
import { collection, addDoc, server } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInput() {
>>>>>>> refs/remotes/origin/main
    return {
        dataVencimento: document.getElementById("dataVencimento"),
        valor: document.getElementById("valor"),
        juros: document.getElementById("juros"),
        nomeFornecedor: document.getElementById("nomeFornecedor")
        
    }
}

<<<<<<< HEAD
function getValoresBoleto({dataVencimento, valor, juros,nomeFornecedor }){
=======
function getValores({ nome, idade, cargo }) {
>>>>>>> refs/remotes/origin/main
    return {
        dataVencimento: dataVencimento.value.trim(),
        valor: Math.round(parseFloat(valor.value)*10)/100,
        juros: juros.value.trim(),
        nomeFornecedor: nomeFornecedor.value.trim()
    }
}
<<<<<<< HEAD

document.getElementById("btnEnviarBoleto").addEventListener("click", async function (){
    const Inputs = getInputBoleto()
    const dados = getValoresBoleto(Inputs)

    console.log("Dados", dados)

    try{
        const ref = await addDoc(collection(db, "boleto"), dados)
        console.log("ID do documento", ref.id)
        alert("boleto cadastrado com sucesso.")
    } catch (e){
=======
document.getElementById("btnEnviar").addEventListener("click", async function () {
    const Inputs = getInput()
    const dados = getValores(Inputs)

    console.log("Dados", dados)

    try {
        const ref = await addDoc(collection(db, "funcionarios"), dados)
        console.log("ID do documento", ref.id)
        alert("Funcionario cadastrado com sucesso.")
    } catch (e) {
>>>>>>> refs/remotes/origin/main
        console.log("Erro:", e)
    }
})


/**
 * @author : Rafael Alegranzzi Klein
 *  os codigos abaixo foram feitos por minha pessoa
 * O codigo é do cliente
 */

function getImputCliente() {
    return {
        cliente: document.getElementById("nomeCliente"),
        cpf: document.getElementById("cpf"),
        dividaDoCliente: document.getElementById("dividaCliente"),
        taxaDeJurosDia: document.getElementById("taxaJurosCliente"),
        vencimentoDivida: document.getElementById("dataVencimetoCliente")
    }
}

function getValoresCliente({ cliente, cpf, dividaDoCliente, taxaDeJurosDia, vencimentoDivida }) {
    return {
        valueCliente: cliente.value.trim(),
        valueCPF: parseFloat(cpf.value.trim()),
        valueDividaCliente: Math.round(parseFloat(dividaDoCliente.value) * 10) / 100,
        valueTxaJuros: taxaDeJurosDia / 100,
        valueVencimentoDivida: vencimentoDivida.trim()

    }
}


document.getElementById("btnEnviarCliente").addEventListener("click", async function () {
    const Inputs = getImputCliente()
    const dados = getValoresCliente(Inputs)

    console.log("Dados", dados)

    try {
        const ref = await addDoc(collection(db, "Clientes"), dados)
        console.log("ID do documento", ref.id)
        alert("Cliente cadastrado com sucesso.")
    } catch (e) {
        console.log("Erro:", e)
    }
})