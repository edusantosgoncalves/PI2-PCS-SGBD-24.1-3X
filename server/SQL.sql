CREATE DATABASE "3x";

-- APÓS CRIAR O BANCO, MUDAR A CONEXÃO PARA ELE E SEGUIR ABAIXO
CREATE SCHEMA "3x";

create table "3x".usuario (
    "idUsuario" serial primary key,
    email varchar(255) not null,
    nome varchar(255) not null,
    funcao varchar(255),
    github varchar(255),
    linkedin varchar(255),
    cep varchar(8),
    "cepnumEndereco" varchar(50),
    "cepComplemento" varchar(255),
    "urlImagem" text,
    status integer default 1,
    "dtInat" timestamp with time zone,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

create table "3x".usuario_segue_usuario (
    id serial,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idUsuarioSeguidor" integer not null references usuario on update cascade on delete set null,
    "idUsuarioSeguido" integer not null references usuario on update cascade on delete set null,
    primary key ("idUsuarioSeguidor", "idUsuarioSeguido")
);

create table "3x".avaliacao_usuario (
    id serial,
    avaliacao integer,
    descricao text,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idUsuarioAvaliador" integer not null references usuario on update cascade on delete
    set null,
    "idUsuarioAvaliado" integer not null references usuario on update cascade on delete set null,
    primary key ("idUsuarioAvaliador", "idUsuarioAvaliado")
);

create table "3x".time (
    "idTime" serial primary key,
    nome varchar(255) not null,
    ativo boolean default true not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

create table "3x".usuario_time (
    id serial,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idUsuario" integer not null references usuario on update cascade on delete set null,
    "idTime" integer not null references time on update cascade on delete set null,
        primary key ("idUsuario", "idTime")
);

create table "3x".projeto (
    "idProjeto" serial primary key,
    nome varchar(150) not null,
    descricao text,
    "dtInicio" timestamp with time zone not null,
    "dtConclusao" timestamp with time zone not null,
    ativo boolean default true not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idTime" integer references time on update cascade on delete
    set null
);

create table "3x".iteracao (
    "idIteracao" serial primary key,
    nome varchar(150) not null,
    descricao text,
    "dtInicio" timestamp with time zone,
    "dtConclusao" timestamp with time zone,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idProjeto" integer references projeto on update cascade on delete set null
);

create table "3x".tarefa (
    "idTarefa" serial primary key,
    nome varchar(150) not null,
    descricao text,
    status integer not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idIteracao" integer references iteracao on update cascade on delete set null,
    "idUsuario" integer references usuario on update cascade on delete set null
);

create table "3x".usuario_segue_tarefa (
    id serial,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idUsuario" integer not null references usuario on update cascade on delete
    set null,
    "idTarefa" integer not null references tarefa on update cascade on delete set null,
    primary key ("idUsuario", "idTarefa")
);

create table "3x".comentario (
    "idComentario" serial primary key,
    descricao text not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null,
    "idTarefa" integer references tarefa on update cascade on delete
    set null,
    "idUsuario" integer references usuario on update cascade on delete set null
);