// * Importando as bibliotecas
require("dotenv").config();
const Sequelize = require("sequelize");

// * Criando a configuração do banco de dados
const db = {};
const sequelize = new Sequelize(
  process.env.BD_DATABASE,
  process.env.BD_USER,
  process.env.BD_PASS,
  // ! Verificando se a conexão com o banco de dados é segura (SSL), se for, defina o ssl como require
  process.env.BD_SSL === "true"
    ? {
        host: process.env.BD_SERVER,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
            sslmode: "require",
          },
        },
      }
    : { host: process.env.BD_SERVER, dialect: "postgres", logging: false }
);

// ! Modelos
db.Usuario = require("../models/Usuario")(sequelize, Sequelize.DataTypes);
db.Time = require("../models/Time")(sequelize, Sequelize.DataTypes);
db.UsuarioTime = require("../models/UsuarioTime")(
  sequelize,
  Sequelize.DataTypes
);
db.Projeto = require("../models/Projeto")(sequelize, Sequelize.DataTypes);
db.Iteracao = require("../models/Iteracao")(sequelize, Sequelize.DataTypes);
db.Tarefa = require("../models/Tarefa")(sequelize, Sequelize.DataTypes);
db.Comentario = require("../models/Comentario")(sequelize, Sequelize.DataTypes);

// ! Relacionamentos
// . Usuario x Time (N x N - UsuarioTime)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioTime, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

db.Time.hasMany(db.UsuarioTime, {
  foreignKey: "idTime",
  sourceKey: "idTime",
});

// * Relacoes N x 1
db.UsuarioTime.belongsTo(db.Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

db.UsuarioTime.belongsTo(db.Time, {
  foreignKey: "idTime",
  targetKey: "idTime",
});

// . Time x Projeto (1 x N)
db.Time.hasMany(db.Projeto, {
  foreignKey: "idTime",
  sourceKey: "idTime",
});
db.Projeto.belongsTo(db.Time, {
  foreignKey: "idTime",
  targetKey: "idTime",
});

// . Projeto x Iteracao (1 x N)
db.Projeto.hasMany(db.Iteracao, {
  foreignKey: "idProjeto", // . No nosso modelo estava codProjetoFK, ajustar
  sourceKey: "idProjeto",
});
db.Iteracao.belongsTo(db.Projeto, {
  foreignKey: "idProjeto",
  targetKey: "idProjeto",
});

// . Iteracao x Tarefa (1 x N)
db.Iteracao.hasMany(db.Tarefa, {
  foreignKey: "idIteracao", // . No nosso modelo estava codIteracaoFK, ajustar
  sourceKey: "idIteracao",
});
db.Tarefa.belongsTo(db.Iteracao, {
  foreignKey: "idIteracao",
  targetKey: "idIteracao",
});

// . Usuario x Tarefa (1 x N)
db.Usuario.hasMany(db.Tarefa, {
  foreignKey: "idUsuario", // . No nosso modelo estava usuarioResp, ajustar
  sourceKey: "idUsuario",
});
db.Tarefa.belongsTo(db.Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

// . Tarefa x Comentario (1 x N)
db.Tarefa.hasMany(db.Comentario, {
  foreignKey: "idTarefa", // . No nosso modelo estava codTarefa, ajustar
  sourceKey: "idTarefa",
});
db.Comentario.belongsTo(db.Tarefa, {
  foreignKey: "idTarefa",
  targetKey: "idTarefa",
});

// . Usuario x Comentario (1 x N) - !! NOVA NESTA VERSÃO
db.Usuario.hasMany(db.Comentario, {
  foreignKey: "idUsuario", // . No nosso modelo estava usuarioResp, ajustar
  sourceKey: "idUsuario",
});
db.Comentario.belongsTo(db.Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

// ! AJUSTES NAS TABELAS
db.Adjusts = require("./dbAdjusts");

// ! VIEWS
db.Views = require("./dbViews");

// ! PROCEDURES
db.Functions = require("./dbFunctions");

// ! Exportando instancia do bd (sequelize) e o proprio sequelize (Sequelize)
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado ao Azure SQL SERVER')
    return pool
  })
  .catch(err => console.log('Erro na conexão: ', err))

module.exports = {
  sql, poolPromise
}*/
