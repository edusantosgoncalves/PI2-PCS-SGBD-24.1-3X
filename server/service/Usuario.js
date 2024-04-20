const UsuarioRepository = require("../repository/Usuario");

class UsuarioService {
  static async getUserIdByEmail(email) {
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

  static async getUsersTimes(email) {
    const userId = await UsuarioService.getUserIdByEmail(email);

    return await UsuarioRepository.getUsersTimes(userId);
  }

  static async getTarefasSeguidasUsuario(email) {
    const userId = await UsuarioService.getUserIdByEmail(email);

    return await UsuarioRepository.getTarefasSeguidasUsuario(userId);
  }

  static async getProjetosUsuario(email) {
    if (email === "-1") {
      // email === -1 (todos os projetos)
      return await UsuarioRepository.getProjetosUsuario(email);
    }

    const userId = await UsuarioService.getUserIdByEmail(email);
    return await UsuarioRepository.getProjetosUsuario(userId);
  }

  static async getUsuariosSeguidos(email) {
    const userId = await UsuarioService.getUserIdByEmail(email);
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
    const userId = await UsuarioService.getUserIdByEmail(email);

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
    const userId = await UsuarioService.getUserIdByEmail(email);

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
}

module.exports = UsuarioService;
