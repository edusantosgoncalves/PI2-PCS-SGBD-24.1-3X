module.exports = (sequelize, DataTypes) => {
  let Tarefa = sequelize.define(
    "Tarefa",
    {
      // . No nosso modelo estava codTarefa, ajustar
      idTarefa: {
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
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 1,
        /* 
        1 - Em andamento
        3 - Concluída
        4 - Inativada
        */
      },
    },
    {
      tableName: "tarefa",
      schema: "3x",
    }
  );

  return Tarefa;
};
