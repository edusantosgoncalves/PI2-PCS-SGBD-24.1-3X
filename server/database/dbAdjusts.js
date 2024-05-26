// ! Ajusta as chaves primárias das tabelas associativas
async function Adjusts(sequelize) {
  // * USUARIO_TIME
  // . Removendo constraint da primary key atual (criada automaticamente pelo Sequelize)
  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_time DROP CONSTRAINT usuario_time_pkey;`
    );
  } catch (e) {
    console.log(e);
  }

  // . Adicionando nova associacao de chave primaria
  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_time ADD PRIMARY KEY ("idUsuario", "idTime");`
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = Adjusts;
