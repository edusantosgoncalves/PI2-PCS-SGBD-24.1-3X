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
db.Time = require("../models/Time")(sequelize, Sequelize.DataTypes);
db.UsuarioTime = require("../models/UsuarioTime")(
  sequelize,
  Sequelize.DataTypes
);
db.Projeto = require("../models/Projeto")(sequelize, Sequelize.DataTypes);

// ! Relacionamentos
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
