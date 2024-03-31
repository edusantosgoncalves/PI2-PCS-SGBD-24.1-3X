const UsuarioModel = require("../database/db").User;
const UsuarioTimeModel = require("../database/db").UsuarioTime;
const { Op, literal } = require("sequelize");

const basicFields = []; //= ["id", "name", "email", "status"];

class UsuarioRepository {
  static async get() {
    return await UsuarioModel.findAll({
      raw: true,
    });
  }

  static async getAtivos() {
    return await UsuarioModel.findAll({
      where: {
        status: { [Op.between]: [1, 4] },
      },
      raw: true,
    });
  }

  static async getUserByEmail(email) {
    return await UsuarioModel.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
  }

  static async alteraStatus(email, status) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (user === null) {
      return false;
    }

    user.status = status;
    await user.save();

    return true;
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
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (user === null) {
      return false;
    }

    user.nome = nome;
    user.funcao = funcao;
    user.github = github;
    user.linkedin = linkedin;
    user.cep = cep;
    user.cep_numEnd = numEnd;
    user.cep_complemento = complEnd;
    await user.save();

    return true;
  }

  static async userLogin(email, nome, urlImagem) {
    let user = await UsuarioModel.findOne({ where: { email: email } });

    if (user === null) return null;

    user.nome = nome;
    user.urlImagem = urlImagem;
    await user.save();

    return user;
  }

  static async addUser(email, nome, status) {
    let user = await UsuarioModel.findOne({ where: { email: email } });

    if (user !== null) return false; // Usuário já cadastrado

    user = await UsuarioModel.create({
      email: email,
      nome: nome,
      status: status,
    });

    return user;
  }

  static async deleteUser(email) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (user === null) return false;

    // !! NOVO: Antes, removiamos o registro do usuario
    user.status = 5;
    await user.save();

    return true;
  }

  static async updateUserAdmin(email, emailNovo, funcao, status) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (user === null) {
      return false;
    }

    user.email = emailNovo;
    user.funcao = funcao;
    user.status = status;
    await user.save();

    return true;
  }

  static async addUserTeam(email, time) {
    let user = await UsuarioTimeModel.findOne({
      where: { usuarioEmail: email, timeId: time },
    });

    if (user !== null) return false; // Usuário já cadastrado no time

    user = await UsuarioTimeModel.create({
      usuarioEmail: email,
      timeId: time,
    });

    return true;
  }

  static async getUsersTimes(email) {
    /*return await UsuarioTimeModel.findAll({
      where: { usuarioEmail: email },
      raw: true,
    });*/
  }
}
