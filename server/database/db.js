// * Importando as bibliotecas
//const sql = require("mssql");
require("dotenv").config();

// * Criando a configuração do banco de dados
const config = {
  server: process.env.BD_SERVER, // Caminho do server
  database: process.env.BD_DATABASE, //BD desejado a conexão
  user: process.env.BD_USER, //Usuário a autenticar
  password: process.env.BD_PASS, //Senha do usuário
  port: parseInt(process.env.BD_PORT), //Porta a autenticar
  // Ao utilizar o Azure SQL Server, deve ser habilitada a opção de encriptação
  options: {
    encrypt: true,
  },
};

// * Cria a instância pra conexão.
const poolPromise = true; /*new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado ao Azure SQL SERVER')
    return pool
  })
  .catch(err => console.log('Erro na conexão: ', err))

module.exports = {
  sql, poolPromise
}*/
