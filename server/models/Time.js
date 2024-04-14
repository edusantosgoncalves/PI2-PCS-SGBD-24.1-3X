module.exports = (sequelize, DataTypes) => {
  let Time = sequelize.define(
    "Time",
    {
      // . No nosso modelo estava codTime, ajustar
      idTime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      // . "dtCriacao" nao foi criado pois por padrão, no sequelize, ele cria colunas de createdAt e updatedAt, na hr das consultas, fazer um alias do createdAt pra dtCriacao
    },
    {
      tableName: "time",
      schema: "3x",
    }
  );

  return Time;
};
