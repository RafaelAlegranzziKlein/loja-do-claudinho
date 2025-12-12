import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

 function getInput(){
    return {
        nome: document.getElementById("nome"),
        idade: document.getElementById("idade"),
        cargo: document.getElementById("cargo")
    }
}

function getValores({nome, idade, cargo}){
    return {
        nome: nome.value.trim(),
        idade: parseInt(idade.value),
        cargo: cargo.value.trim()
    }
}
document.getElementById("btnEnviar").addEventListener("click", async function (){
    const Inputs = getInput()
    const dados = getValores(Inputs)

    console.log("Dados", dados)

    try{
        const ref = await addDoc(collection(db, "funcionarios"), dados)
        console.log("ID do documento", ref.id)
        alert("Funcionario cadastrado com sucesso.")
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