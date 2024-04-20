const sequelize = require("../database/db").sequelize;
const { Op, literal } = require("sequelize");
const {
  AvaliacaoUsuario: AvaliacaoUsuarioModel,
  UsuarioSegueUsuario: UsuarioSegueUsuarioModel,
  UsuarioSegueTarefa: UsuarioSegueTarefaModel,
  UsuarioTime: UsuarioTimeModel,
  Usuario: UsuarioModel,
} = require("../database/db");

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

  static async getUserIdByEmailForActiveUser(email) {
    return await UsuarioModel.findOne({
      attributes: ["idUsuario"],
      where: {
        email: email,
        status: { [Op.between]: [3, 4] },
      },
      raw: true,
    });
  }

  static async alteraStatus(email, status) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (!user) {
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

    if (!user) {
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

    if (!user) return null;

    user.nome = nome;
    user.urlImagem = urlImagem;
    await user.save();

    return user;
  }

  static async addUser(email, nome, status) {
    let user = await UsuarioModel.findOne({ where: { email: email } });

    if (!user) return false; // Usuário já cadastrado

    user = await UsuarioModel.create({
      email: email,
      nome: nome,
      status: status,
    });

    return user;
  }

  static async deleteUser(email) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (!user) return false;

    // !! NOVO: Antes, removiamos o registro do usuario
    user.status = 5;
    await user.save();

    return true;
  }

  static async updateUserAdmin(email, emailNovo, funcao, status) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (!user) {
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

    if (!user) return false; // Usuário já cadastrado no time

    await UsuarioTimeModel.create({
      usuarioEmail: email,
      timeId: time,
    });

    return true;
  }

  static async getUsersTimes(id) {
    const query = await sequelize.query(
      `select * from "3x".gettimesusuario(${id})`
    );

    return query[0];
  }

  static async seguirTarefa(id, tarefa) {
    const user = await UsuarioSegueTarefaModel.findOne({
      where: { idUsuario: id, idTarefa: tarefa },
    });

    if (!user) return false; // Usuário já segue a tarefa

    await UsuarioSegueTarefaModel.create({
      idUsuario: id,
      idTarefa: tarefa,
    });

    return true;
  }

  static async pararDeSeguirTarefa(id, tarefa) {
    const user = await UsuarioSegueTarefaModel.findOne({
      where: { idUsuario: id, idTarefa: tarefa },
    });

    if (!user) return false; // Usuário não segue a tarefa

    await user.destroy();

    return true;
  }

  static async getTarefasSeguidasUsuario(id) {
    const query = await sequelize.query(
      `select * from "3x".getTarefasSeguidasUsuario(${id})`
    );

    return query[0];
  }

  static async getProjetosUsuario(id) {
    let queryString;
    // id === -1 (todos os projetos)
    if (id === "-1") {
      queryString = `select * from "3x".projetosview`;
    } else {
      queryString = `select * from "3x".getProjetosUsuario(${id})`;
    }

    const query = await sequelize.query(queryString);

    return query[0];
  }

  static async seguirUsuario(id, idSeguido) {
    const user = await UsuarioSegueUsuarioModel.findOne({
      where: { idUsuarioSeguidor: id, idUsuarioSeguido: idSeguido },
    });

    if (!user) return false; // Usuário já segue o usuário

    await UsuarioSegueUsuarioModel.create({
      idUsuario: id,
      idUsuarioSeguido: idSeguido,
    });

    return true;
  }

  static async pararDeSeguirUsuario(id, idSeguido) {
    const user = await UsuarioSegueUsuarioModel.findOne({
      where: { idUsuarioSeguidor: id, idUsuarioSeguido: idSeguido },
    });

    if (!user) return false; // Usuário não segue o usuário

    await user.destroy();

    return true;
  }

  static async isUsuarioSeguidoPorUsuario(id, idSeguido) {
    const user = await UsuarioSegueUsuarioModel.findOne({
      where: { idUsuarioSeguidor: id, idUsuarioSeguido: idSeguido },
    });

    return user ? true : false;
  }

  static async getUsuariosSeguidos(id) {
    const users = await UsuarioSegueUsuarioModel.findAll({
      attributes: ["idUsuarioSeguido"],
      where: { idUsuarioSeguidor: id },
      include: {
        model: UsuarioModel,
        attributes: ["nome", "urlImagem"],
      },
      raw: true,
    });

    return users;
  }

  static async getAvaliacoesParaUsuario(id) {
    const users = await AvaliacaoUsuarioModel.findAll({
      where: { idUsuarioAvaliado: id },
      include: {
        model: UsuarioModel,
        as: "Avaliador",
        attributes: ["nome", "urlImagem"],
      },
      raw: true,
    });

    return users;
  }

  static async getAvaliacoesDeUsuario(id) {
    const users = await AvaliacaoUsuarioModel.findAll({
      where: { idUsuarioAvaliador: id },
      include: {
        model: UsuarioModel,
        as: "Avaliado",
        attributes: ["nome", "urlImagem"],
      },
      raw: true,
    });

    return users;
  }

  async avaliarUsuario(id, idAvaliado, avaliacao, descricao) {
    await AvaliacaoUsuarioModel.create({
      idUsuarioAvaliador: id,
      idUsuarioAvaliado: idAvaliado,
      avaliacao: avaliacao,
      descricao: descricao,
    });

    return true;
  }

  static async getDashboard(id, admin) {
    let query;
    if (admin === true) {
      query = await sequelize.query(
        `select * from "3x".getDashboardAdmin(${id})`
      );
    } else {
      query = await sequelize.query(`select * from "3x".getDashboard(${id})`);
    }

    return query[0];
  }
}

module.exports = UsuarioRepository;
