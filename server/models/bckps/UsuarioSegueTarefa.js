// !! Candidata a ser implementada no BD Neo4j
module.exports = (sequelize, DataTypes) => {
  let UsuarioSegueTarefa = sequelize.define(
    "UsuarioSegueTarefa",
    {},
    {
      tableName: "usuario_segue_tarefa",
      schema: "3x",
    }
  );

  return UsuarioSegueTarefa;
};
