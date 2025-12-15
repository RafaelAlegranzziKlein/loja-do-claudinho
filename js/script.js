
let valorConta = 200 ;
let taxaJuros = 0.5;
let diasAtraso = diaDaDivida - diaAtual;
const taxaJurosTotal = taxaJuros*diasAtraso;

const valorTotal = valorConta + (valorConta * (taxaJurosTotal/100));
console.log(valorConta + " , " + taxaJurosTotal + " , " + valorTotal)


const valorPago = 20;
const novoValor = valorTotal - valorPago;

console.log(novoValor +" " +valorTotal +" "+ valorPago)


document.getElementById('pagar').addEventListener('click', async () => {
    const edicao = getValoresEditar()
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value.trim(),
        email: edicao.editarEmail.value.trim(),
        senha: edicao.editarSenha.value.trim(),
        telefone: edicao.editarTelefone.value.trim(),
        cnpj: edicao.editarCnpj.value.trim()
    }
    try {
        const ref = doc(db, "produtores", id);
        await setDoc(ref, novosDados);
        alert("Produtor atualizado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaProdutores();
    } catch (error) {
        console.log("Erro ao salvar edição:", error);
        alert("Erro ao atualizar produtor.");
    }
});
document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none';
});

function adicionarListenersDeAcao() {
    listarProdutoresDiv.addEventListener('click', lidarClique);
}

document.addEventListener("DOMContentLoaded", carregarListaProdutores);





// função clicque

async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir');
    if (btnExcluir) {
        const certeza = confirm("Tem certeza que deseja fazer essa exclusão?")
        if (certeza) {
            const idprodutor = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirProdutor(idprodutor);

            if (exclusaoBemSucedida) {
                carregarListaProdutores();
                alert('Produtor excluído com sucesso!');
            }
        } else {
            alert("Exclusão cancelada");
        }
    }

    // botão editar
    const btnEditar = eventoDeClique.target.closest('.btn-Editar');

    if (btnEditar) {
        const idprodutor = btnEditar.dataset.id;
        const produtor = await BuscarProdutoresPorID(idprodutor)

        const edicao = getValoresEditar()

        edicao.editarNome.value = produtor.nome;
        edicao.editarEmail.value = produtor.email;
        edicao.editarSenha.value = produtor.senha;
        edicao.editarTelefone.value = produtor.telefone;
        edicao.editarCnpj.value = produtor.cnpj;
        edicao.editarId.value = produtor.id;

        edicao.formularioEdicao.style.display = 'block';
    }
}

async function BuscarProdutoresPorID(id) {
    try {
        const produtorDoc = doc(db, "produtores", id);
        const snapshot = await getDoc(produtorDoc);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        } else {
            console.log("Produtor não encontrado com o ID:", id);
            return null;
        }
    } catch (error) {
        console.log("Erro ao buscar Produtor por ID:", error);
        alert("Erro ao buscar produtor para edição.");
        return null;
    }
}

