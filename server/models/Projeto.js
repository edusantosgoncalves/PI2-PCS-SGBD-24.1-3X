module.exports = (sequelize, DataTypes) => {
  let Projeto = sequelize.define(
    "Projeto",
    {
      // . No nosso modelo estava codProjeto, ajustar
      idProjeto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
      },
      // . No nosso modelo estava dtCriacao, ajustar
      dtInicio: {
        type: DataTypes.DATE,
      },
      dtConclusao: {
        type: DataTypes.DATE,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "projeto",
      schema: "3x",
    }
  );

  return Projeto;
};
