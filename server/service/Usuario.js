const UsuarioRepository = require("../repository/Usuario"); // Repositorio do Usuario
const Usuario4JRepository = require("../repository/Usuario4J"); // Repositorio das relações Usuario x Usuario (Avaliacao e Segue)
const Tarefa4JRepository = require("../repository/Tarefa4J"); // Repositorio das relações Usuario x Tarefa (Seguir)
const TarefaRepository = require("../repository/Tarefa"); // Repositorio da Tarefa

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

    return await UsuarioRepository.seguirTarefa(userId, idTarefa);
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
      const taskData = await TarefaRepository.getTarefaById(tasks[i]);

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

    return await UsuarioRepository.seguirUsuario(userSeguidorId, userSeguidoId);
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

    return await UsuarioRepository.pararDeSeguirUsuario(
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
      const userData = await UsuarioRepository.getUserNameAndImageURLById(
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
      const userData = await UsuarioRepository.getUserNameAndImageURLById(
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

  static async getAvaliacoesDeUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const users = await Usuario4JRepository.getAvaliacoesFeitasUsuario(userId);

    for (let i = 0; i < users.length; i++) {
      const userData = await UsuarioRepository.getUserNameAndImageURLById(
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
    const userAvaliadorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );

    const userAvaliadoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailSeguido
    );

    if (userAvaliadorId < 0) return userAvaliadorId;
    if (userAvaliadoId < 0) return userAvaliadoId;

    // Se a avaliação não for um número entre 1 e 5, retorne -3
    if (avaliacao < 1 || avaliacao > 5) return -3;

    return await UsuarioRepository.avaliarUsuario(
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

    return await UsuarioRepository.getDashboard(userId, adminBool);
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
