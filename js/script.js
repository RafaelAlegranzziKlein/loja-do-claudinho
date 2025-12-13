
let valorConta = 200 ;
let taxaJuros = 0.5;
let diasAtraso = diaDaDivida - diaAtual;
const taxaJurosTotal = taxaJuros*diasAtraso;

const valorTotal = valorConta + (valorConta * (taxaJurosTotal/100));
console.log(valorConta + " , " + taxaJurosTotal + " , " + valorTotal)


const valorPago = 20;
const novoValor = valorTotal - valorPago;

console.log(novoValor +" " +valorTotal +" "+ valorPago)