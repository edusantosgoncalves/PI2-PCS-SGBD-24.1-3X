// * Importando as dependências
const { sql, poolPromise } = require("../database/db");
require("dotenv").config();

// * Importando as dependencias da API Email (elasticemail)
let ElasticEmail = require("@elasticemail/elasticemail-client");
// const { getUsuariosAtivos } = require('../controllers/UsuarioController');

let defaultClient = ElasticEmail.ApiClient.instance;

let apikey = defaultClient.authentications["apikey"];
apikey.apiKey = process.env.ELASTIC_EMAIL_API_KEY;

let apiElasticEmail = new ElasticEmail.EmailsApi();

module.exports = {
  async get() {
    //let users = [];
    try {
      let pool = await poolPromise;
      let data = await pool.request().query("SELECT * FROM dbo.USUARIO");

      return data.recordset;
    } catch (err) {
      return err;
    }
  },

  async getAtivos() {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .query("SELECT * FROM dbo.USUARIO WHERE status BETWEEN 1 AND 4");

      return data.recordset;
    } catch (err) {
      return err;
    }
  },

  async getUserByEmail(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("SELECT * FROM dbo.USUARIO WHERE email=@em");

      if (data.rowsAffected[0] == 0)
        return { message: "Usuário não encontrado" };

      return data.recordset[0];
    } catch (err) {
      return { message: err.message };
    }
  },

  async alteraStatus(email, status) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("st", sql.Numeric, status)
        .query("UPDATE dbo.USUARIO SET status=@st WHERE email=@em");

      if (data.rowsAffected[0] == 0) {
        return { message: "Usuário não encontrado!", status: 404 };
      }

      return {
        message: "Status do usuário alterado com sucesso!",
        status: 201,
      };
    } catch (err) {
      return { message: err.message, status: 500 };
    }
  },

  // * Atualiza um usuário
  async updateUser(
    email,
    nome,
    funcao,
    github,
    linkedin,
    cep,
    numEnd,
    complEnd
  ) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("nm", sql.VarChar, nome)
        .input("fn", sql.VarChar, funcao)
        .input("gh", sql.VarChar, github)
        .input("lk", sql.VarChar, linkedin)
        .input("cp", sql.VarChar(8), cep)
        .input("cn", sql.Numeric, numEnd)
        .input("cc", sql.VarChar, complEnd)
        .query(
          "UPDATE dbo.USUARIO SET nome=@nm, funcao=@fn, github=@gh, linkedin=@lk, CEP=@cp, CEP_numEnd=@cn, CEP_complemento=@cc WHERE email=@em"
        );

      if (data.rowsAffected[0] == 0) {
        //res.status(404).json({ message: "Usuário não encontrado!" });
        return { message: "Usuário não encontrado!", status: 404 };
      }
      return { message: "Usuário atualizado com sucesso!", status: 201 };
      //res.status(201).json({ message: "Usuário atualizado com sucesso!" });
    } catch (err) {
      return { message: err.message, status: 500 };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Autentica um usuário
  async userLogin(email, nome, urlImagem) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("nm", sql.VarChar, nome)
        .input("im", sql.VarChar, urlImagem)
        .query(
          "UPDATE dbo.USUARIO SET urlImagem=@im, nome=@nm WHERE email=@em"
        );

      if (data.rowsAffected[0] == 0) {
        //res.sendStatus(404);
        return { status: 404 };
      }

      return { status: 201 };
      //res.sendStatus(201);
    } catch (err) {
      return { message: err, status: 500 };
    }
  },

  // * Cria um usuário
  async addUser(emailNv, nome, status) {
    let emailEnviado = false;
    let callback = function (error, data, response) {
      if (error) {
        console.error(error);
      } else {
        emailEnviado = true;
        console.log("API utilizada com sucesso.");
        return { status: 201, emailEnviado: emailEnviado };
      }
    };

    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailNv)
        .input("nm", sql.VarChar, nome)
        .input("st", sql.Numeric, parseInt(status))
        .query(
          "INSERT INTO dbo.USUARIO (email, nome, status) VALUES (@em, @nm, @st)"
        );

      if (data.rowsAffected[0] == 0) {
        //res.status(402).json({ message: "Não foi possível cadastrar o usuário!" });
        return {
          status: 402,
          message: "Não foi possível cadastrar o usuário!",
        };
      }

      let email = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [new ElasticEmail.EmailRecipient(emailNv.toString())],
        Content: {
          Body: [
            ElasticEmail.BodyPart.constructFromObject({
              ContentType: "HTML",
              Content:
                "Prezado <b>" +
                nome +
                "</b>, você recebeu permissões para acessar o sistema 3X. <br> " +
                'Acesse <a href="https://3xdeploy.vercel.app">aqui</a> ',
            }),
          ],
          Subject: "3X: Acesso autorizado",
          From: "musicexplosionv2@gmail.com",
        },
      });
      apiElasticEmail.emailsPost(email, callback);

      return { status: 201, emailEnviado: emailEnviado };
      //res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Deleta um usuário
  async deleteUser(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("DELETE FROM dbo.USUARIO WHERE email=@em");

      if (data.rowsAffected[0] == 0) {
        //res.status(402).json({ message: "Não foi possível deletar o usuário!" });
        return { status: 402, message: "Não foi possível deletar o usuário!" };
      }

      return { status: 200 };
      //res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).status({ message: err.message });
    }
  },

  // * Atualiza um usuário - tela de USUARIO ADM
  async updateUserAdmin(email, emailNovo, funcao, status) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("emNv", sql.VarChar, emailNovo)
        .input("fn", sql.VarChar, funcao)
        .input("st", sql.Numeric, status)
        .query(
          "UPDATE dbo.USUARIO SET email=@emNv, funcao=@fn, status=@st WHERE email=@em"
        );

      if (data.rowsAffected[0] == 0) {
        //res.status(404).json({ message: "Usuário não encontrado!" });
        return { status: 404, message: "Usuário não encontrado!" };
      }

      return { status: 201 };
      //res.status(201).json({ message: "Usuário atualizado com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Adiciona um usuário a um time
  async addUserTeam(email, time) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("tm", sql.VarChar, time)
        .query(
          "INSERT INTO dbo.USUARIO_TIME (USUARIO_email, TIME_codTime) VALUES (@em, @tm)"
        );

      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
        //res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      return { status: 201 };
      // res.status(201).json({ message: "Usuário adicionado ao time com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Retorna todos os times do usuario
  async getUsersTimes(email) {
    let times = [];

    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("EXEC getTimesUsuario @Usuario=@em");

      console.log(data.recordset.length);
      const listaTimes = data.recordset;

      // ! Para cada codTime que o usuario está associado, obtenha os dados daquele time. (Não está rodando o loop, busca apenas o primeiro.)
      for (let i = 0; i < data.recordset.length; i++) {
        let data2 = await pool
          .request()
          .input("codT", sql.Numeric, listaTimes[i].TIME_codTime)
          .query("SELECT * FROM dbo.TIMES_QTDPESS_QTDPROJ WHERE codTime=@codT");
        //Temporario (analisar a view dps)
        if (data2.recordset[0] != null) {
          times.push(data2.recordset[0]);
        }
      }

      console.log(times);
      return { status: 200, times: times };
      //res.status(200).json(times);
    } catch (err) {
      return { status: 500, message: err.message };
      // res.status(500).json({ message: err.message });
    }
  },

  // * Segue uma tarefa
  async seguirTarefa(email, tarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("id", sql.Numeric, tarefa)
        .query("EXEC seguirTarefa @Usuario=@em, @Tarefa = @id");

      console.log(data);
      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
        //res.status(404).json({ message: "Tarefa não seguida!" });
      }

      return { status: 200 };
      //res.status(200).json({ message: "Tarefa seguida com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Deixa de seguir uma tarefa
  async pararDeSeguirTarefa(email, tarefa) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("id", sql.Numeric, tarefa)
        .query("EXEC pararDeSeguirTarefa @Usuario=@em, @Tarefa = @id");

      console.log(data);
      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
        //res.status(404).json({ message: "Tarefa não deixou de ser seguida!" });
      }

      return { status: 200 };
      //res.status(200).json({ message: "Tarefa deixada de ser seguida com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Retorna todos os usuários
  async getTarefasSeguidasUsuario(email) {
    let tarefas = [];
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("EXEC getTarefasSeguidasUsuario @Usuario=@em");

      for (let i = 0; i < data.rowsAffected; i++) {
        tarefas.push(data.recordset[i]);
      }

      return { status: 200, tarefas: tarefas };
      //res.status(200).json(tarefas);
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Retorna todos os projetos de um usuário específico
  async getProjetosUsuario(email) {
    let projetos = [];

    try {
      let data;
      if (email === "-1") {
        console.log("peguei todos projetos");
        let pool = await poolPromise;
        data = await pool.request().query("EXEC getProjetosView");
      } else {
        console.log("peguei  projetos" + email);
        let pool = await poolPromise;
        data = await pool
          .request()
          .input("em", sql.VarChar, email)
          .query("EXEC getProjetosUsuario @Usuario = @em");
      }

      for (let i = 0; i < data.rowsAffected; i++) {
        projetos.push(data.recordset[i]);
      }

      return { status: 200, projetos: projetos };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Segue um usuario
  async seguirUsuario(emailSeguidor, emailSeguido) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailSeguidor)
        .input("em2", sql.VarChar, emailSeguido)
        .query("EXEC seguirUsuario @Usuario1=@em, @Usuario2 = @em2");

      console.log(data);
      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
        //res.status(404).json({ message: "Tarefa não seguida!" });
      }

      return { status: 200 };
      //res.status(200).json({ message: "Tarefa seguida com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Deixa de seguir um usuario
  async pararDeSeguirUsuario(emailSeguidor, emailSeguido) {
    console.log(emailSeguidor, emailSeguido);
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailSeguidor)
        .input("em2", sql.VarChar, emailSeguido)
        .query("EXEC pararDeSeguirUsuario @Usuario1=@em, @Usuario2=@em2");

      console.log(data);
      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
        //res.status(404).json({ message: "Tarefa não deixou de ser seguida!" });
      }

      return { status: 200 };
      //res.status(200).json({ message: "Tarefa deixada de ser seguida com sucesso!" });
    } catch (err) {
      return { status: 500, message: err.message };
      //res.status(500).json({ message: err.message });
    }
  },

  // * Verifica se um usuario é seguida por outro usuario recebido
  async isUsuarioSeguidoPorUsuario(emailSeguido, emailUsuario) {
    console.log(emailSeguido, emailUsuario);
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, emailSeguido)
        .input("em2", sql.VarChar, emailUsuario)
        .query(
          "SELECT * FROM dbo.USUARIO_SEGUE_USUARIO WHERE usuarioSeguidor=@em AND usuarioSeguido=@em2"
        );

      console.log(data.recordset);
      //let vrfRetorno = Object.values(data.recordset[0]);

      if (data.recordset.length == 0)
        return { status: 202, message: "Usuario não é seguido" };

      return { status: 200, message: "Usuário é seguido!" };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Gera dados para o dashboard do usuario
  async getDashboard(email, admin) {
    try {
      let pool = await poolPromise;

      let dashboard = {
        qtdTimesUsuario: "",
        qtdTimesSys: "",
        qtdProjetosUsuario: "",
        qtdProjetosSys: "",
        qtdTarefas: "",
        qtdTarefasSys: "",
        qtdTarefasSemana: "",
        qtdUsuarios: "",
      };

      let data;

      if (parseInt(admin) === 1) {
        data = await pool
          .request()
          .input("em", sql.VarChar, email)
          .query("EXEC getDashboardAdmin @Usuario=@em");

        if (data.recordset.length == 0)
          return { status: 404, message: "Não foi possível obter dashboard" };

        for (let i in data.recordset) {
          console.log(data.recordset[i].qtdTimesUsuario ? "numero" : "nulo");
          dashboard.qtdTimesUsuario = data.recordset[i].qtdTimesUsuario
            ? data.recordset[i].qtdTimesUsuario
            : dashboard.qtdTimesUsuario;
          dashboard.qtdTimesSys = data.recordset[i].qtdTimesSys
            ? data.recordset[i].qtdTimesSys
            : dashboard.qtdTimesSys;
          dashboard.qtdProjetosUsuario = data.recordset[i].qtdProjetosUsuario
            ? data.recordset[i].qtdProjetosUsuario
            : dashboard.qtdProjetosUsuario;
          dashboard.qtdProjetosSys = data.recordset[i].qtdProjetosSys
            ? data.recordset[i].qtdProjetosSys
            : dashboard.qtdProjetosSys;
          dashboard.qtdTarefas = data.recordset[i].qtdTarefas
            ? data.recordset[i].qtdTarefas
            : dashboard.qtdTarefas;
          dashboard.qtdTarefasSys = data.recordset[i].qtdTarefasSys
            ? data.recordset[i].qtdTarefasSys
            : dashboard.qtdTarefasSys;
          dashboard.qtdTarefasSemana = data.recordset[i].qtdTarefasSemana
            ? data.recordset[i].qtdTarefasSemana
            : dashboard.qtdTarefasSemana;
          dashboard.qtdUsuarios = data.recordset[i].qtdUsuarios
            ? data.recordset[i].qtdUsuarios
            : dashboard.qtdUsuarios;
        }
        /*
                    qtdTimesUsuario
                    qtdTimesSys
                    qtdProjetosUsuario
                    qtdProjetosSys
                    qtdTarefas
                    qtdTarefasSys
                    qtdTarefasSemana
                    qtdUsuarios
                */
      } else {
        data = await pool
          .request()
          .input("em", sql.VarChar, email)
          .query("EXEC getDashboard @Usuario=@em");

        if (data.recordset.length == 0)
          return { status: 404, message: "Não foi possível obter dashboard" };

        for (let i in data.recordset) {
          dashboard.qtdTimesUsuario = data.recordset[i].qtdTimesUsuario
            ? data.recordset[i].qtdTimesUsuario
            : dashboard.qtdTimesUsuario;
          dashboard.qtdProjetosUsuario = data.recordset[i].qtdProjetosUsuario
            ? data.recordset[i].qtdProjetosUsuario
            : dashboard.qtdProjetosUsuario;
          dashboard.qtdTarefas = data.recordset[i].qtdTarefas
            ? data.recordset[i].qtdTarefas
            : dashboard.qtdTarefas;
          dashboard.qtdTarefasSemana = data.recordset[i].qtdTarefasSemana
            ? data.recordset[i].qtdTarefasSemana
            : dashboard.qtdTarefasSemana;
        }
        /*
                    qtdTimesUsuario, 
                    qtdProjetosUsuario, 
                    qtdTarefas,
                    qtdTarefasSemana
                */
      }

      // console.log(data.recordset)
      console.log(data.recordset.length);
      //let vrfRetorno = Object.values(data.recordset[0]);

      return { status: 200, dashboard: dashboard };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Busca usuários seguidos
  async getUsuariosSeguidos(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("EXEC getUsuariosSeguidos @Usuario=@em");

      if (data.rowsAffected[0] == 0)
        return { message: "Usuário não segue ninguém" };

      return data.recordset;
    } catch (err) {
      return { message: err.message };
    }
  },

  // * Busca sugestões de entretenimento do usuario
  async getEntretenimentoByEmail(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("SELECT * FROM dbo.ENTRETENIMENTO WHERE usuario=@em");

      if (data.rowsAffected[0] == 0)
        return { message: "Usuário não encontrado" };

      return data.recordset[0];
    } catch (err) {
      return { message: err.message };
    }
  },

  // * Busca avaliações recebidas de um usuario
  async getAvaliacoesParaUsuario(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("EXEC getAvaliacoesParaUsuario @Usuario=@em");

      if (data.rowsAffected[0] == 0)
        return { message: "Usuário não recebeu avaliações!" };

      return data.recordset;
    } catch (err) {
      return { message: err.message };
    }
  },

  // * Busca avaliações feitas por um usuario
  async getAvaliacoesDeUsuario(email) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .query("EXEC getAvaliacoesDeUsuario @Usuario=@em");

      if (data.rowsAffected[0] == 0)
        return { message: "Usuário não realizou avaliações!" };

      return data.recordset;
    } catch (err) {
      return { message: err.message };
    }
  },

  // * Avalia outro usuário
  async avaliarUsuario(email, emailAvaliado, avaliacao, comentario) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("emA", sql.VarChar, emailAvaliado)
        .input("av", sql.Numeric, avaliacao)
        .input("cm", sql.Text, comentario)
        .query(
          "INSERT INTO dbo.AVALIACAO_USUARIO VALUES (@em, @emA, @av, @cm)"
        );

      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
      }

      return { status: 201 };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Adicionar entretenimento
  async addEntretenimento(email, spotify, movie_id, movie_type) {
    console.log(email, spotify, movie_id, movie_type);
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("sp", sql.VarChar, spotify)
        .input("mid", sql.VarChar, movie_id.toString())
        .input("mty", sql.VarChar, movie_type)
        .query("INSERT INTO dbo.ENTRETENIMENTO VALUES (@em, @sp, @mid, @mty)");

      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
      }

      return { status: 201 };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },

  // * Alterar entretenimento
  async alterEntretenimento(email, spotify, movie_id, movie_type) {
    try {
      let pool = await poolPromise;
      let data = await pool
        .request()
        .input("em", sql.VarChar, email)
        .input("sp", sql.VarChar, spotify)
        .input("mid", sql.VarChar, movie_id.toString())
        .input("mty", sql.VarChar, movie_type)
        .query(
          "UPDATE dbo.ENTRETENIMENTO SET spotify_uri=@sp, moviedb_id=@mid, moviedb_tipo=@mty WHERE USUARIO = @em"
        );

      if (data.rowsAffected[0] == 0) {
        return { status: 404 };
      }

      return { status: 201 };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  },
};
