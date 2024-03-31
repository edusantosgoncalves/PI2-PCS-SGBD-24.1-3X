module.exports = (sequelize, DataTypes) => {
  let Iteracao = sequelize.define(
    "Iteracao",
    {
      // . No nosso modelo estava codIteracao, ajustar
      id: {
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
        allowNull: false,
      },
      // . No nosso modelo estava dtFim, ajustar
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
      tableName: "iteracao",
      schema: "3x",
    }
  );

  return Iteracao;
};
