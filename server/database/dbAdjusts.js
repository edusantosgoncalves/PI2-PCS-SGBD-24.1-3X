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

  // . Removendo coluna de id criada automaticamente pelo Sequelize
  try {
    await sequelize.query(`ALTER TABLE "3x".usuario_time DROP COLUMN id;`);
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

  // * USUARIO_TIME
  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_usuario DROP CONSTRAINT usuario_segue_usuario_pkey;`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_usuario DROP COLUMN id;`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_usuario ADD PRIMARY KEY ("idUsuarioSeguidor", "idUsuarioSeguido");`
    );
  } catch (e) {
    console.log(e);
  }

  // * AVALIACAO_USUARIO
  try {
    await sequelize.query(
      `ALTER TABLE "3x".avaliacao_usuario DROP CONSTRAINT avaliacao_usuario_pkey;`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(`ALTER TABLE "3x".avaliacao_usuario DROP COLUMN id;`);
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `ALTER TABLE "3x".avaliacao_usuario ADD PRIMARY KEY ("idUsuarioAvaliador", "idUsuarioAvaliado");`
    );
  } catch (e) {
    console.log(e);
  }

  // * USUARIO_SEGUE_TAREFA
  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_tarefa DROP CONSTRAINT usuario_segue_tarefa_pkey;`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_tarefa DROP COLUMN id;`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `ALTER TABLE "3x".usuario_segue_tarefa ADD PRIMARY KEY ("idUsuario", "idTarefa");`
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = Adjusts;
