create database Loja;

use Loja;

create table Clientes (
Nome varchar(50) not null,
CPF varchar (15) primary key unique,
dividas decimal(10,2) not null,
nivel_de_fidelidade numeric(4) not null
);

create table Boleto_de_Fornecedor (
ID int primary key not null auto_increment,
data_de_vencimento date not null,
Valor decimal(10,2) not null,
juros decimal(10,2) not null,
Nome_do_fornecedor varchar(30) not null

);