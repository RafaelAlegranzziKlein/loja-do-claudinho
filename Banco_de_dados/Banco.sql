create database Loja;

use loja;

create table Clientes (
CPF int (15) primary key unique,
Nome varchar(50) not null,
nivel_de_fidelidade enum('1','2','3','4','5') not null,
dividas decimal(10,2) not null
);

create table Boleto_de_Fornecedor (
ID int primary key not null auto_increment,
data_de_vencimento date not null,
Nome_do_fornecedor varchar(30) not null, 
Valor numeric(10,2) not null,
juros numeric(10,2) not null

);



