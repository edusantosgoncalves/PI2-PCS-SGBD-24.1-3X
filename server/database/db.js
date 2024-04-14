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
  foreignKey: "idUsuarioAvaliador",
  sourceKey: "idUsuario",
});

db.Usuario.hasMany(db.AvaliacaoUsuario, {
  foreignKey: "idUsuarioAvaliado",
  sourceKey: "idUsuario",
});

// * Relacoes N x 1
db.AvaliacaoUsuario.belongsTo(db.Usuario, {
  foreignKey: "idUsuarioAvaliador",
  targetKey: "idUsuario",
});

db.AvaliacaoUsuario.belongsTo(db.Usuario, {
  foreignKey: "idUsuarioAvaliado",
  targetKey: "idUsuario",
});

// . Usuario x Usuario (N x N - UsuarioSegueUsuario)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioSegueUsuario, {
  foreignKey: "idUsuarioSeguidor",
  sourceKey: "idUsuario",
});

db.Usuario.hasMany(db.UsuarioSegueUsuario, {
  foreignKey: "idUsuarioSeguido",
  sourceKey: "idUsuario",
});

// * Relacoes N x 1
db.UsuarioSegueUsuario.belongsTo(db.Usuario, {
  foreignKey: "idUsuarioSeguidor",
  targetKey: "idUsuario",
});

db.UsuarioSegueUsuario.belongsTo(db.Usuario, {
  foreignKey: "idUsuarioSeguido",
  targetKey: "idUsuario",
});

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

// . Usuario x Tarefa (N x N - UsuarioSegueTarefa)
// * Relacoes 1 x N
db.Usuario.hasMany(db.UsuarioSegueTarefa, {
  foreignKey: "idUsuario",
  sourceKey: "idUsuario",
});

db.Tarefa.hasMany(db.UsuarioSegueTarefa, {
  foreignKey: "idTarefa",
  sourceKey: "idTarefa",
});

// * Relacoes N x 1
db.UsuarioSegueTarefa.belongsTo(db.Usuario, {
  foreignKey: "idUsuario",
  targetKey: "idUsuario",
});

db.UsuarioSegueTarefa.belongsTo(db.Tarefa, {
  foreignKey: "idTarefa",
  targetKey: "idTarefa",
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
/*sequelize.query(`CREATE VIEW "TIMES_QTDPESS_QTDPROJ"
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
GROUP BY ut2.codTime, ut2.nome, ut2.dtCriacao, ut2.ativo, ut2.qtdPess;`);*/

// ! PROCEDURES
/*sequelize.query(`
CREATE OR REPLACE PROCEDURE getTimesUsuario(
  IN Usuario VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    ids_times INTEGER[];
    team_data RECORD;
BEGIN
    -- Obtendo os ids dos times do usuario
    SELECT ut."idTime" INTO ids_times FROM usuario_time ut JOIN TIME T
    ON ut."idTime" = t.id
     WHERE ut."usuarioEmail"=@Usuario
     ORDER BY t.ativo desc;

    IF array_length(ids_times, 1) IS NOT NULL THEN
        -- Cria uma consulta dinâmica usando os IDs obtidos
        EXECUTE 'SELECT * FROM TIMES_QTDPESS_QTDPROJ WHERE id = ANY($1)' USING ids_times;
    ELSE
        -- Se o array de IDs estiver vazio, retorna uma mensagem de erro
        RAISE EXCEPTION 'Sem times para o usuário';
    END IF;
END;
$$;`);*/

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
