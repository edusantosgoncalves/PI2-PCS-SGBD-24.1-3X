// !! Candidata a ser implementada no BD Neo4j
module.exports = (sequelize, DataTypes) => {
  let UsuarioSegueUsuario = sequelize.define(
    "UsuarioSegueUsuario",
    {},
    {
      tableName: "usuario_segue_usuario",
      schema: "3x",
    }
  );

  return UsuarioSegueUsuario;
};
