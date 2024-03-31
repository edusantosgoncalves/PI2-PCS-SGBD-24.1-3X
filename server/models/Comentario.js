module.exports = (sequelize, DataTypes) => {
  let Comentario = sequelize.define(
    // . No nosso modelo o nome da tbl estava Comentarios, ajustar
    "Comentario",
    {
      // . No nosso modelo estava codComentarios, ajustar
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // . "dtCriacao" nao foi criado pois por padrão, no sequelize, ele cria colunas de createdAt e updatedAt, na hr das consultas, fazer um alias do createdAt pra dtCriacao
    },
    {
      // . No nosso modelo o nome da tbl estava Comentarios, ajustar
      tableName: "comentario",
      schema: "3x",
    }
  );

  return Comentario;
};
