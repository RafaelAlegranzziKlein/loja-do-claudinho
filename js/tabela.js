import {db} from '../js/firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
/**
 * 
 * @author : Pedro
 */

 function getInputBoleto(){
    return {
        dataVencimento: document.getElementById("dataVencimento"),
        valor: document.getElementById("valor"),
        juros: document.getElementById("juros"),
        nomeFornecedor: document.getElementById("nomeFornecedor")
        
    }
}

function getValoresBoleto({dataVencimento, valor, juros,nomeFornecedor }){
    return {
        dataVencimento: dataVencimento.value.trim(),
        valor: Math.round(parseFloat(valor.value)*10)/100,
        juros: juros.value.trim(),
        nomeFornecedor: nomeFornecedor.value.trim()
    }
}

document.getElementById("btnEnviarBoleto").addEventListener("click", async function (){
    const Inputs = getInputBoleto()
    const dados = getValoresBoleto(Inputs)

    console.log("Dados", dados)

    try{
        const ref = await addDoc(collection(db, "boleto"), dados)
        console.log("ID do documento", ref.id)
        alert("boleto cadastrado com sucesso.")
    } catch (e){
        console.log("Erro:", e)
    }
})

function getInput() {
    return{
        Nome: document.getElementById("Nome"),
        CPF: document.getElementById("CPF"),
        dividas: document.getElementById("dividas"),
        nivel_de_fidelidade: document.getElementById("nivel_de_fidelidade"),
    };
}

function getValores({ Nome,CPF,dividas,nivel_de_fidelidade}){
return{
    Nome: Nome.value.trim(),
    CPF: CPF.value.trim(),
    dividas: dividas.value.trim(),
    nivel_de_fidelidade: nivel_de_fidelidade.value.trim(),
};

}