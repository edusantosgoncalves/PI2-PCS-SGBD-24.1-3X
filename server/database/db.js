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
db.UsuarioSegueUsuario = require("../models/UsuarioSegueUsuario")(
  sequelize,
  Sequelize.DataTypes
);
db.AvaliacaoUsuario = require("../models/AvaliacaoUsuario")(
  sequelize,
  Sequelize.DataTypes
);
db.Time = require("../models/Time")(sequelize, Sequelize.DataTypes);
db.UsuarioTime = require("../models/UsuarioTime")(
  sequelize,
  Sequelize.DataTypes
);
db.Projeto = require("../models/Projeto")(sequelize, Sequelize.DataTypes);
db.Iteracao = require("../models/Iteracao")(sequelize, Sequelize.DataTypes);
db.Tarefa = require("../models/Tarefa")(sequelize, Sequelize.DataTypes);
db.UsuarioSegueTarefa = require("../models/UsuarioSegueTarefa")(
  sequelize,
  Sequelize.DataTypes
);
db.Comentario = require("../models/Comentario")(sequelize, Sequelize.DataTypes);

// ! Relacionamentos
// . Usuario x Usuario (N x N - AvaliacaoUsuario)
// * Relacoes 1 x N
db.Usuario.hasMany(db.AvaliacaoUsuario, {
  foreignKey: "usuarioAvaliadorEmail",
  sourceKey: "email",
});

db.Usuario.hasMany(db.AvaliacaoUsuario, {
  foreignKey: "usuarioAvaliadoEmail",
  sourceKey: "email",
});

// * Relacoes N x 1
db.AvaliacaoUsuario.belongsTo(db.Usuario, {
  foreignKey: "usuarioAvaliadorEmail",
  targetKey: "email",
});

db.AvaliacaoUsuario.belongsTo(db.Usuario, {
  foreignKey: "usuarioAvaliadoEmail",
  targetKey: "email",
});

// . Usuario x Usuario (N x N - UsuarioSegueUsuario)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioSegueUsuario, {
  foreignKey: "usuarioSeguidorEmail",
  sourceKey: "email",
});

db.Usuario.hasMany(db.UsuarioSegueUsuario, {
  foreignKey: "usuarioSeguidoEmail",
  sourceKey: "email",
});

// * Relacoes N x 1
db.UsuarioSegueUsuario.belongsTo(db.Usuario, {
  foreignKey: "usuarioSeguidorEmail",
  targetKey: "email",
});

db.UsuarioSegueUsuario.belongsTo(db.Usuario, {
  foreignKey: "usuarioSeguidoEmail",
  targetKey: "email",
});

// . Usuario x Time (N x N - UsuarioTime)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioTime, {
  foreignKey: "usuarioEmail",
  sourceKey: "email",
});

db.Time.hasMany(db.UsuarioTime, {
  foreignKey: "timeId",
  sourceKey: "id",
});

// * Relacoes N x 1
db.UsuarioTime.belongsTo(db.Usuario, {
  foreignKey: "usuarioEmail",
  targetKey: "email",
});

db.UsuarioTime.belongsTo(db.Time, {
  foreignKey: "timeId",
  targetKey: "id",
});

// . Time x Projeto (1 x N)
db.Time.hasMany(db.Projeto, {
  foreignKey: "timeResponsavel",
  sourceKey: "id",
});
db.Projeto.belongsTo(db.Time, {
  foreignKey: "timeResponsavel",
  targetKey: "id",
});

// . Projeto x Iteracao (1 x N)
db.Projeto.hasMany(db.Iteracao, {
  foreignKey: "projetoId", // . No nosso modelo estava codProjetoFK, ajustar
  sourceKey: "id",
});
db.Iteracao.belongsTo(db.Projeto, {
  foreignKey: "projetoId",
  targetKey: "id",
});

// . Iteracao x Tarefa (1 x N)
db.Iteracao.hasMany(db.Tarefa, {
  foreignKey: "iteracaoId", // . No nosso modelo estava codIteracaoFK, ajustar
  sourceKey: "id",
});
db.Tarefa.belongsTo(db.Iteracao, {
  foreignKey: "iteracaoId",
  targetKey: "id",
});

// . Usuario x Tarefa (1 x N)
db.Usuario.hasMany(db.Tarefa, {
  foreignKey: "usuarioResponsavel", // . No nosso modelo estava usuarioResp, ajustar
  sourceKey: "email",
});
db.Tarefa.belongsTo(db.Usuario, {
  foreignKey: "usuarioResponsavel",
  targetKey: "email",
});

// . Usuario x Tarefa (N x N - UsuarioSegueTarefa)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioSegueTarefa, {
  foreignKey: "usuarioSeguidorEmail",
  sourceKey: "email",
});

db.Tarefa.hasMany(db.UsuarioSegueTarefa, {
  foreignKey: "tarefaSeguida",
  sourceKey: "id",
});

// * Relacoes N x 1
db.UsuarioSegueTarefa.belongsTo(db.Usuario, {
  foreignKey: "usuarioSeguidorEmail",
  targetKey: "email",
});

db.UsuarioSegueTarefa.belongsTo(db.Tarefa, {
  foreignKey: "tarefaSeguida",
  targetKey: "id",
});

// . Tarefa x Comentario (1 x N)
db.Tarefa.hasMany(db.Comentario, {
  foreignKey: "tarefaId", // . No nosso modelo estava codTarefa, ajustar
  sourceKey: "id",
});
db.Comentario.belongsTo(db.Tarefa, {
  foreignKey: "tarefaId",
  targetKey: "id",
});

// . Usuario x Comentario (1 x N) - !! NOVA NESTA VERSÃO
db.Usuario.hasMany(db.Comentario, {
  foreignKey: "usuarioResponsavel", // . No nosso modelo estava usuarioResp, ajustar
  sourceKey: "email",
});
db.Comentario.belongsTo(db.Usuario, {
  foreignKey: "usuarioResponsavel",
  targetKey: "email",
});

// ! VIEWS
sequelize.query(/*`CREATE VIEW "TIMES_QTDPESS_QTDPROJ"
AS
SELECT ut2.codTime, ut2.nome, ut2.dtCriacao, ut2.ativo, ut2.qtdPess, count(p.codProjeto) as qtdProj
   FROM PROJETO p RIGHT JOIN
    (SELECT
    t.codTime, t.nome, t.dtCriacao, t.ativo, count(ut.USUARIO_email) as qtdPess
FROM
    dbo.TIME t LEFT JOIN dbo.USUARIO_TIME ut
    ON t.codTime = ut.TIME_codTime
GROUP BY t.codTime, t.nome, t.dtCriacao, t.ativo) AS ut2
ON p.timeResponsavel = ut2.codTime
GROUP BY ut2.codTime, ut2.nome, ut2.dtCriacao, ut2.ativo, ut2.qtdPess;`*/);

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
