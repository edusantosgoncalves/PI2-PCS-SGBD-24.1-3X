const TimeRepository = require("../repository/Time"); // Repositorio do Time
const UsuarioRepository = require("../repository/Usuario"); // Repositorio do Usuario
class TimeService {
  static async get() {
    const times = await TimeRepository.get();
    return times;
  }

  static async getAtivos() {
    const times = await TimeRepository.getAtivos();
    return times;
  }

  static async getById(id) {
    const time = await TimeRepository.getTimeById(id);
    return time;
  }

  static async addUsuarioTime(id, listaUsuarios) {
    const time = await TimeRepository.addUsuarioTime(id, listaUsuarios);
    return time;
  }

  static async atualizaTimeProjeto(id, listaProjetos) {
    const time = await TimeRepository.atualizaTimeProjeto(id, listaProjetos);
    return time;
  }

  static async atualizaStatusTime(id, ativo) {
    const time = await TimeRepository.atualizaStatusTime(id, ativo);
    return time;
  }

  static async atualizaNomeTime(id, nome) {
    const time = await TimeRepository.updateNomeTime(id, nome);
    return time;
  }

  static async addTime(nome) {
    const novoTime = await TimeRepository.addTime(nome);
    return novoTime;
  }

  static async inactivateTime(id) {
    const time = await TimeRepository.inactivateTime(id);
    return time;
  }

  static async deleteUsuarioTime(id, emailUsuario) {
    // . Obtendo id do usuario a partir do email
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      emailUsuario
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const time = await TimeRepository.deleteUsuarioTime(id, usuario.idUsuario);
    return time;
  }

  static async getProjetosAtivosTime(id) {
    const projetos = await TimeRepository.getProjetosAtivosTime(id);
    return projetos.length;
  }
}

module.exports = TimeService;
