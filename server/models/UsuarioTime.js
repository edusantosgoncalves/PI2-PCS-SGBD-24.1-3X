// !! Candidata a ser implementada no BD Neo4j
module.exports = (sequelize, DataTypes) => {
  let UsuarioTime = sequelize.define(
    "UsuarioTime",
    {},
    {
      tableName: "usuario_time",
      schema: "3x",
    }
  );

  return UsuarioTime;
};
