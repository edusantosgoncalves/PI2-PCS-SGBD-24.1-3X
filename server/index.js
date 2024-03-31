// ! Importando módulos
const app = require("./app");
const db = require("./database/db");

// ! Autenticando com o banco e iniciando servidor
db.sequelize
  .authenticate({ logging: false })
  .then(async () => {
    console.log("\nModelos:\n", db.sequelize.models, "\n");
    // *Inserir parâmetro "{ force: true }" no método sync() para forçar a redefinição das tabelas que foram modificadas (drop table e recrição)
    // ! await db.sequelize.sync({ force: true });
    await db.sequelize.sync();

    // * Caso a tabela não seja recriada: usar função drop(), executar uma vez, depois remover (caso não remova, as tabelas serão sempre derrubadas)
    // ! await db.sequelize.drop();

    // . Iniciando servidor
    app.listen(app.get('port'), () => console.log("Servidor na porta " + app.get('port')));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });