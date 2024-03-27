module.exports = (sequelize, DataTypes) => {
  let Projeto = sequelize.define(
    "Projeto",
    {
      // . No nosso modelo estava codProjeto, ajustar
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
      dtConclusao: {
        type: DataTypes.DATE,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      // . "dtCriacao" nao foi criado pois por padrão, no sequelize, ele cria colunas de createdAt e updatedAt, na hr das consultas, fazer um alias do createdAt pra dtCriacao
    },
    {
      tableName: "projeto",
      schema: "3x",
    }
  );

  return Projeto;
};
