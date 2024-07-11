const sequelize = require("../database/db").sequelize;
const { Op, literal } = require("sequelize");
const {
  UsuarioTime: UsuarioTimeModel,
  Usuario: UsuarioModel,
} = require("../database/db");

const basicFields = [
  "cep",
  "cepComplemento",
  "cepnumEndereco",
  "dtInat",
  "email",
  "funcao",
  "github",
  ["idUsuario", "codUsuario"],
  "linkedin",
  "nome",
  "status",
  "urlImagem",
];

class UsuarioRepository {
  // Validado
  static async get() {
    return await UsuarioModel.findAll({
      attributes: basicFields,
      raw: true,
    });
  }

  // Validado
  static async getAtivos() {
    return await UsuarioModel.findAll({
      attributes: basicFields,
      where: {
        status: { [Op.between]: [1, 4] },
      },
      raw: true,
    });
  }

  // NOVO
  static async getUserNameAndImageURLById(id) {
    return await UsuarioModel.findOne({
      attributes: ["nome", "urlImagem"],
      where: {
        idUsuario: id,
      },
      raw: true,
    });
  }

  // NOVO
  static async getUserEmailNameAndImageURLById(id) {
    return await UsuarioModel.findOne({
      attributes: ["email", "nome", "urlImagem"],
      where: {
        idUsuario: id,
      },
      raw: true,
    });
  }

  // NOVO
  static async getUserEmailById(id) {
    return await UsuarioModel.findOne({
      attributes: ["email"],
      where: {
        idUsuario: id,
      },
      raw: true,
    });
  }

  // Validado
  static async getUserByEmail(email) {
    return await UsuarioModel.findOne({
      attributes: basicFields,
      where: {
        email: email,
        status: { [Op.between]: [1, 4] },
      },
      raw: true,
    });
  }

  // Validado
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

  // Validado
  static async alteraStatus(email, status) {
    const user = await UsuarioModel.findOne({
      where: { email: email },
    });

    if (!user) {
      return false;
    }

    user.status = status;
    await user.save();

    return true;
  }

  // Validado
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

  // Validado
  static async userLogin(email, nome, urlImagem) {
    let user = await UsuarioModel.findOne({
      where: { email: email, status: { [Op.between]: [1, 4] } },
    });

    if (!user) return false;

    user.nome = nome;
    user.urlImagem = urlImagem;
    await user.save();

    return user;
  }

  // Validado
  static async addUser(email, nome, status) {
    let user = await UsuarioModel.findOne({ where: { email: email } });

    if (user) return false; // Usuário já cadastrado

    user = await UsuarioModel.create({
      email: email,
      nome: nome,
      status: status,
    }).then((usuario) => {
      return usuario.get({ plain: true });
    });

    return user;
  }

  // Validado
  static async deleteUser(email) {
    const user = await UsuarioModel.findOne({ where: { email: email } });

    if (!user) return false;

    // !! NOVO: Antes, removiamos o registro do usuario
    user.status = 5;
    await user.save();

    return true;
  }

  // Validado
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

  // Validado
  static async addUserTeam(idUsuario, idTime) {
    let userTimeModel = await UsuarioTimeModel.findOne({
      where: { idUsuario: idUsuario, idTime: idTime },
    });

    if (userTimeModel) return false; // Usuário já cadastrado no time

    await UsuarioTimeModel.create({
      idUsuario: idUsuario,
      idTime: idTime,
    });

    return true;
  }

  // Validado
  static async getUsersTimes(id) {
    const query = await sequelize.query(
      `select * from "3x".gettimesusuario(${id})`
    );

    return query[0];
  }

  // Validado
  static async getProjetosUsuario(id) {
    let queryString;
    // id === -1 (todos os projetos)
    if (id === "-1") {
      queryString = `select codprojeto as "codProjeto", nome, descricao, dtcriacao as "dtCriacao", timeresponsavel as "timeResponsavel", nometime as "nomeTime", dtconclusao as "dtConclusao", prazo as "Prazo", qtdtarefas as "qtdTarefas", qtdtarefasativas as "qtdTarefasAtivas", ativo from "3x".projetosview`;
    } else {
      queryString = `select * from "3x".getProjetosUsuario(${id})`;
    }

    const query = await sequelize.query(queryString);

    return query[0];
  }

  // Validado
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
