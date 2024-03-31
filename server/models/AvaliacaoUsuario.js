// !! Candidata a ser implementada no BD Neo4j
module.exports = (sequelize, DataTypes) => {
  let AvaliacaoUsuario = sequelize.define(
    "AvaliacaoUsuario",
    {},
    {
      tableName: "avaliacao_usuario",
      schema: "3x",
    }
  );

  return AvaliacaoUsuario;
};
