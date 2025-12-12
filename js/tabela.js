import { sqlite3 } from 'sqlite';
import { open } from 'sqlite';

async function CriarTabelaClientes() {
const db = await open({
 filename: './banco.db',
 driver: sqlite3.driver,
});
db.run(
    'CREATE TABLE IF NOT EXISTS Clientes ('
)

}



function getInpus() {
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