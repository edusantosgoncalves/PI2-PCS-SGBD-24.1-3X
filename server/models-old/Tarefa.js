// * Importando as dependências
const { sql, poolPromise } = require("../database/db");
require("dotenv").config();

// * Importando as dependencias da API Email (elasticemail)
let ElasticEmail = require("@elasticemail/elasticemail-client");

let defaultClient = ElasticEmail.ApiClient.instance;

let apikey = defaultClient.authentications["apikey"];
apikey.apiKey = process.env.ELASTIC_EMAIL_API_KEY;

let apiElasticEmail = new ElasticEmail.EmailsApi();

module.exports = {
  // * Retorna todas as tarefas
  async get() {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .query("SELECT * FROM TAREFAS_ITERACAO_PROJETOS_USUARIOS");

      return data.recordset;
    } catch (err) {
      return err;
    }
  },

  // * Retorna todas as tarefas de um usuario (usando a VIEW criada no SQL)
  async getTarefasViewByUsuario(emailUsuario) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailUsuario)
        .query(
          "SELECT * FROM TAREFAS_ITERACAO_PROJETOS_USUARIOS WHERE usuarioResp LIKE @em AND (status = 1 OR status = 3)"
        );

      return data.recordset;
    } catch (err) {
      return err;
    }
  },

  // * Retorna uma tarefa
  async getTarefaById(codTarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codTarefa)
        //.query("SELECT * FROM dbo.TAREFA WHERE codTarefa=@id");
        .query("EXEC getTarefaByCod @codTarefa=@id");
      if (data.rowsAffected[0] == 0)
        return { status: 404, message: "Tarefa não encontrada" };

      console.log(data.recordset);
      return { status: 200, tarefa: data.recordset[0] };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Atualiza uma tarefa
  async updateTarefa(
    codTarefa,
    nome,
    descricao,
    status,
    codIteracaoFK,
    usuarioResp
  ) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codTarefa)
        .input("nm", sql.VarChar, nome)
        .input("de", sql.VarChar, descricao)
        .input("st", sql.Numeric, status)
        .input("it", sql.Numeric, codIteracaoFK)
        .input("us", sql.VarChar, usuarioResp)
        .query(
          "UPDATE dbo.TAREFA SET nome=@nm, descricao=@de, status=@st, codIteracaoFK=@it, usuarioResp=@us WHERE codTarefa=@id"
        );

      if (data.rowsAffected[0] == 0)
        return { status: 404, message: "Tarefa não encontrada" };

      return { status: 200, message: "Tarefa atualizada com sucesso!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Cria uma tarefa
  async addTarefa(nome, descricao, status, codIteracaoFK, usuarioResp) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("nm", sql.VarChar, nome)
        .input("de", sql.VarChar, descricao)
        .input("st", sql.Numeric, status)
        .input("it", sql.Numeric, codIteracaoFK)
        .input("us", sql.VarChar, usuarioResp)
        .query(
          "INSERT INTO dbo.TAREFA(nome, descricao, status, codIteracaoFK, usuarioResp) VALUES (@nm, @de, @st, @it, @us)"
        );

      if (data.rowsAffected[0] == 0)
        return { status: 402, message: "Não foi possível criar a tarefa" };

      return { status: 201, message: "Tarefa criada com sucesso!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Deleta uma tarefa
  async inactivateTarefa(codTarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codTarefa)
        .query("UPDATE dbo.TAREFA SET status=4 WHERE codTarefa=@id");

      if (data.rowsAffected[0] == 0)
        return { status: 402, message: "Não foi possível inativar a tarefa" };

      return { status: 200, message: "Tarefa inativada com sucesso!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Verifica se a tarefa é seguida pelo usuario recebido
  async isTarefaSeguidaPorUsuario(codTarefa, emailUsuario) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codTarefa)
        .input("em", sql.VarChar, emailUsuario)
        .query("EXEC vrfUsuarioSegueTarefa @Usuario=@em, @Tarefa = @id");

      let vrfRetorno = Object.values(data.recordset[0]);

      if (vrfRetorno == 0)
        return { status: 202, message: "Tarefa não é seguida" };

      return { status: 200, message: "Tarefa é seguida!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Retorna todos os comentários de uma tarefa
  async getComentariosPorTarefa(codTarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("tf", sql.Numeric, codTarefa)
        .query("EXEC getComentariosTarefa @Tarefa=@tf");

      return data.recordset;
    } catch (err) {
      return err.message;
    }
  },

  // * Adiciona um comentário para a tarefa
  async addComentario(codTarefa, descricao, emailUsuario) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("ct", sql.Numeric, codTarefa)
        .input("de", sql.VarChar, descricao)
        .input("em", sql.VarChar, emailUsuario)
        .query(
          "INSERT INTO dbo.COMENTARIOS (codTarefa, descricao, usuario) VALUES (@ct, @de, @em)"
        );

      if (data.rowsAffected[0] > 0)
        return { status: 201, message: "Comentário criado com sucesso!" };

      return { status: 402, message: "Erro na criação do comentário." };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Conclui uma tarefa
  async concluiTarefa(codTarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codTarefa)
        .query("UPDATE dbo.TAREFA SET status = 3 WHERE codTarefa=@id");

      if (data.rowsAffected[0] == 0)
        return { status: 404, message: "Tarefa não encontrada!" };

      return { status: 200, message: "Tarefa concluída com sucesso!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Busca a lista de usuários que devem receber um e-mail sobre a alteração de uma tarefa:
  async getListaUsuariosGatilho(
    codTarefa,
    emailUsuario,
    acao,
    nomeTarefa,
    nomeRespTarefa,
    comentario
  ) {
    let emailEnviado = false;
    let callback = function (error, data, response) {
      if (error) {
        console.error(error);
      } else {
        emailEnviado = true;
        console.log("API utilizada com sucesso.");
      }
    };

    try {
      let usuarios = [];
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailUsuario)
        .input("tf", sql.Numeric, codTarefa)
        .query("EXEC getUsuariosEnvioGatilhos @Usuario=@em, @Tarefa=@tf");

      for (let i = 0; i < data.rowsAffected; i++) {
        usuarios.push(
          new ElasticEmail.EmailRecipient(
            data.recordset[i].usuarioSeguidor.toString()
          )
        );
        //usuarios.push(data.recordset[i].usuarioSeguidor);
      }

      //if (usuarios.length > 0) {
      if (acao === "ADD") {
        let email = ElasticEmail.EmailMessageData.constructFromObject({
          Recipients: usuarios,
          Content: {
            Body: [
              ElasticEmail.BodyPart.constructFromObject({
                ContentType: "HTML",
                Content:
                  "A tarefa <b>" +
                  nomeTarefa +
                  "</b> recebeu um novo comentário de " +
                  nomeRespTarefa +
                  ": <br>" +
                  comentario,
              }),
            ],
            Subject: "3X: Tarefa Atualizada",
            From: "musicexplosionv2@gmail.com",
          },
        });
        apiElasticEmail.emailsPost(email, callback);
        return { status: 200, usuarios: usuarios, emailEnviado: emailEnviado };
      } else if (acao === "CONC") {
        let email = ElasticEmail.EmailMessageData.constructFromObject({
          Recipients: usuarios,
          Content: {
            Body: [
              ElasticEmail.BodyPart.constructFromObject({
                ContentType: "HTML",
                Content:
                  "A tarefa <b>" +
                  nomeTarefa +
                  "</b> foi concluida por " +
                  nomeRespTarefa +
                  "!",
              }),
            ],
            Subject: "3X: Tarefa Concluída",
            From: "musicexplosionv2@gmail.com",
          },
        });
        apiElasticEmail.emailsPost(email, callback);
        return { status: 200, usuarios: usuarios, emailEnviado: emailEnviado };
      }
      //}
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Retorna uma tarefa
  async getTarefasByIteracao(codIteracao) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("id", sql.Numeric, codIteracao)
        .query("EXEC getQtdTarefasByIteracao @codItera=@id");

      if (data.rowsAffected[0] == 0)
        return { status: 404, message: "Tarefa não encontrada" };

      return { status: 200, tarefa: data.recordset[0] };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },
};
