const UsuarioRepository = require("../repository/Usuario"); // Repositorio do Usuario
const Usuario4JRepository = require("../repository/Usuario4J"); // Repositorio das relações Usuario x Usuario (Avaliacao e Segue)
const Tarefa4JRepository = require("../repository/Tarefa4J"); // Repositorio das relações Usuario x Tarefa (Seguir)
const TarefaRepository = require("../repository/Tarefa"); // Repositorio da Tarefa
const { sendEmail } = require("../utils/Email");

class UsuarioService {
  static getUserIdError(errorCode) {
    switch (errorCode) {
      case -1:
        return { mensagem: "Erro ao buscar usuário no banco de dados" };
      case -2:
        return { mensagem: "Usuário inativo ou inexistente" };
      default:
        return { mensagem: "Erro desconhecido" };
    }
  }

  static async get() {
    return await UsuarioRepository.get();
  }

  static async getAtivos() {
    return await UsuarioRepository.getAtivos();
  }

  static async getUserByEmail(email) {
    return await UsuarioRepository.getUserByEmail(email);
  }

  static async getUserIdByEmailForActiveUser(email) {
    let userId;
    try {
      userId = await UsuarioRepository.getUserIdByEmailForActiveUser(email);
    } catch (e) {
      return -1;
    }

    if (!userId) {
      return -2;
    }
    return userId.idUsuario;
  }

  static async alteraStatus(email, status) {
    // Se o status não for um dos 5 possíveis, retorne false
    if (status < 1 || status > 5) return false;

    return await UsuarioRepository.alteraStatus(email, status);
  }

  static async updateUser(
    email,
    nome,
    funcao,
    github,
    linkedin,
    cep,
    numEnd,
    complEnd
  ) {
    return await UsuarioRepository.updateUser(
      email,
      nome,
      funcao,
      github,
      linkedin,
      cep,
      numEnd,
      complEnd
    );
  }

  static async userLogin(email, nome, urlImagem) {
    try {
      return await UsuarioRepository.userLogin(email, nome, urlImagem);
    } catch (e) {
      return -1;
    }
  }

  static async addUser(email, nome, status) {
    const usuario = await UsuarioRepository.addUser(email, nome, status);

    // !! ENVIAR E-MAIL
    // . Enviando email
    const subject = "3X: Usuário criado";
    const content = `Prezado, ${nome}, seu usuário foi criado no sistema 3X.`;
    await sendEmail(email, subject, content);

    return usuario;
  }

  static async deleteUser(email) {
    return await UsuarioRepository.deleteUser(email);
  }

  static async addUserTeam(email, idTime) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    return await UsuarioRepository.addUserTeam(userId, idTime);
  }

  static async getUsersTimes(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    return await UsuarioRepository.getUsersTimes(userId);
  }

  static async seguirTarefa(email, idTarefa) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    return await Tarefa4JRepository.seguirTarefa(userId, idTarefa);
  }

  static async pararDeSeguirTarefa(email, idTarefa) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    return await Tarefa4JRepository.pararDeSeguirTarefa(userId, idTarefa);
  }

  static async getTarefasSeguidasUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const tasks = await Tarefa4JRepository.getTarefasSeguidasUsuario(userId);

    for (let i = 0; i < tasks.length; i++) {
      const taskData = await TarefaRepository.getById(tasks[i]);

      // Formatando campos de usuario, iteração e projeto
      taskData.usuarioResp = taskData["Usuario.usuarioResp"];
      taskData.nomeUsuarioResp = taskData["Usuario.nomeUsuarioResp"];
      taskData.nomeIteracao = taskData["Iteracao.nomeIteracao"];
      taskData.idProjeto = taskData["Iteracao.Projeto.projetoTarefa"];
      taskData.nomeProjeto = taskData["Iteracao.Projeto.nomeProjeto"];
      taskData.nomeTarefa = taskData["nome"];

      // Removendo campos desnecessários
      delete taskData["Usuario.usuarioResp"];
      delete taskData["Usuario.nomeUsuarioResp"];
      delete taskData["Iteracao.nomeIteracao"];
      delete taskData["Iteracao.Projeto.projetoTarefa"];
      delete taskData["Iteracao.Projeto.nomeProjeto"];
      delete taskData["nome"];

      tasks[i] = taskData;
    }

    return tasks; //await UsuarioRepository.getTarefasSeguidasUsuario(userId);
  }

  static async getProjetosUsuario(email) {
    if (email === "-1") {
      // email === -1 (todos os projetos)
      return await UsuarioRepository.getProjetosUsuario("-1");
    }

    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    return await UsuarioRepository.getProjetosUsuario(userId);
  }

  static async seguirUsuario(email, emailSeguir) {
    const userSeguidorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );
    const userSeguidoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailSeguir
    );

    if (userSeguidorId < 0) return userSeguidorId;
    if (userSeguidoId < 0) return userSeguidoId;

    return await Usuario4JRepository.seguirUsuario(
      userSeguidorId,
      userSeguidoId
    );
  }

  static async pararDeSeguirUsuario(email, emailSeguido) {
    const userSeguidorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );

    const userSeguidoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailSeguido
    );

    if (userSeguidorId < 0) return userSeguidorId;
    if (userSeguidoId < 0) return userSeguidoId;

    return await Usuario4JRepository.pararDeSeguirUsuario(
      userSeguidorId,
      userSeguidoId
    );
  }

  static async isUsuarioSeguidoPorUsuario(email, emailSeguido) {
    const userSeguidorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );

    const userSeguidoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailSeguido
    );

    if (userSeguidorId < 0) return userSeguidorId;
    if (userSeguidoId < 0) return userSeguidoId;

    return await Usuario4JRepository.isUsuarioSeguidoPorUsuario(
      userSeguidorId,
      userSeguidoId
    );
  }

  static async getUsuariosSeguidos(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const users = await Usuario4JRepository.getUsuariosSeguidos(userId);

    for (let i = 0; i < users.length; i++) {
      const userData = await UsuarioRepository.getUserEmailNameAndImageURLById(
        users[i]
      );

      users[i] = userData;
    }

    return users;
  }

  static async getAvaliacoesParaUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    let users = await Usuario4JRepository.getAvaliacoesRecebidasUsuario(userId);

    for (let i = 0; i < users.length; i++) {
      const userData = await UsuarioRepository.getUserEmailNameAndImageURLById(
        users[i].usuario
      );

      users[i] = {
        avaliacao: users[i].avaliacao,
        descricao: users[i].descricao,
        nome: userData.nome,
        urlImagem: userData.urlImagem,
      };
    }

    return users;
  }

  static async getAvaliacoesDeUsuario(usuarioId) {
    /*
    . Removido para Teste de Carga E2
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;
    */

    const users = await Usuario4JRepository.getAvaliacoesFeitasUsuario(
      usuarioId
    );

    for (let i = 0; i < users.length; i++) {
      const userData = await UsuarioRepository.getUserEmailNameAndImageURLById(
        users[i].usuario
      );

      users[i] = {
        avaliacao: users[i].avaliacao,
        descricao: users[i].descricao,
        nome: userData.nome,
        urlImagem: userData.urlImagem,
      };
    }

    return users;
  }

  static async avaliarUsuario(email, emailAvaliado, avaliacao, descricao) {
    // Se a avaliação não for um número entre 1 e 5, retorne -3
    if (avaliacao < 1 || avaliacao > 5) return -3;

    // obtendo os ids dos usuários
    const userAvaliadorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );

    const userAvaliadoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailAvaliado
    );

    if (userAvaliadorId < 0) return userAvaliadorId;
    if (userAvaliadoId < 0) return userAvaliadoId;

    // Verificando se há nó criado, se não, criar.
    const hasUserAvaliadorNode = await Usuario4JRepository.get(userAvaliadorId);
    const hasUserAvaliadoNode = await Usuario4JRepository.get(userAvaliadoId);

    if (!hasUserAvaliadorNode) {
      await Usuario4JRepository.create(userAvaliadorId);
    }

    if (!hasUserAvaliadoNode) {
      await Usuario4JRepository.create(userAvaliadoId);
    }

    return await Usuario4JRepository.avaliarUsuario(
      userAvaliadorId,
      userAvaliadoId,
      avaliacao,
      descricao
    );
  }

  static async getDashboard(email, admin) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const adminBool = admin === "1";

    // Busca os dados do dashboard
    const dashboardData = await UsuarioRepository.getDashboard(
      userId,
      adminBool
    );

    const dashboard = {};
    // Para cada atributo do dashboard, se o atributo nao for nulo e vazio, inseri-lo no objeto "dashboard"
    for (const dashData of dashboardData) {
      Object.keys(dashData).forEach((key) => {
        if (dashData[key] && dashData[key] !== "") {
          dashboard[key] = dashData[key];
        }
      });
    }

    return dashboard;
  }

  static async updateUserAdmin(email, emailNovo, funcao, status) {
    return await UsuarioRepository.updateUserAdmin(
      email,
      emailNovo,
      funcao,
      status
    );
  }
}

module.exports = UsuarioService;
