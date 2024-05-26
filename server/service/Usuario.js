const UsuarioRepository = require("../repository/Usuario");

class UsuarioService {
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

  static async addUser(email) {
    return await UsuarioRepository.addUser(email);
  }

  static async deleteUser(email) {
    return await UsuarioRepository.deleteUser(email);
  }

  static async addUserTeam(email, idTime) {
    return await UsuarioRepository.addUserTeam(email, idTime);
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

    return await UsuarioRepository.pararDeSeguirTarefa(userId, idTarefa);
  }

  static async getTarefasSeguidasUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    return await UsuarioRepository.getTarefasSeguidasUsuario(userId);
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

  static async seguirUsuario(email, emailSeguido) {
    const userSeguidorId = await UsuarioService.getUserIdByEmailForActiveUser(
      email
    );
    const userSeguidoId = await UsuarioService.getUserIdByEmailForActiveUser(
      emailSeguido
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

    return await UsuarioRepository.isUsuarioSeguidoPorUsuario(
      userSeguidorId,
      userSeguidoId
    );
  }

  static async getUsuariosSeguidos(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const users = await UsuarioRepository.getUsuariosSeguidos(userId);

    for (let i = 0; i < users.length; i++) {
      users[i] = {
        nome: users[i]["Usuario.nome"],
        email: users[i]["Usuario.email"],
        urlImagem: users[i]["Usuario.urlImagem"],
      };
    }

    return users;
  }

  static async getAvaliacoesParaUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const users = await UsuarioRepository.getAvaliacoesParaUsuario(userId);

    for (let i = 0; i < users.length; i++) {
      users[i] = {
        avaliacao: users[i]["avaliacao"],
        descricao: users[i]["descricao"],
        nome: users[i]["Avaliador.nome"],
        urlImagem: users[i]["Avaliador.urlImagem"],
      };
    }

    return users;
  }

  static async getAvaliacoesDeUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmailForActiveUser(email);

    if (userId < 0) return userId;

    const users = await UsuarioRepository.getAvaliacoesDeUsuario(userId);

    for (let i = 0; i < users.length; i++) {
      console.log(users[i]);
      users[i] = {
        avaliacao: users[i]["avaliacao"],
        descricao: users[i]["descricao"],
        nome: users[i]["Avaliado.nome"],
        urlImagem: users[i]["Avaliado.urlImagem"],
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

    return await UsuarioRepository.getDashboard(userId, admin);
  }
}

module.exports = UsuarioService;
