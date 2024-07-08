const sequelize = require("../database/db").sequelize;
const { Op, literal } = require("sequelize");
const {
  Time: TimeModel,
  UsuarioTime: UsuarioTimeModel,
  Projeto: ProjetoModel,
} = require("../database/db");

class TimeRepository {
  // Validado
  static async get() {
    const query = await sequelize.query(
      `SELECT * FROM "3x".TIMES_QTDPESS_QTDPROJ ORDER BY ativo DESC`
    );

    return query[0];
  }

  // Validado
  static async getAtivos() {
    const query = await sequelize.query(
      `SELECT * FROM "3x".TIMES_QTDPESS_QTDPROJ WHERE ativo = true ORDER BY ativo DESC`
    );

    return query[0];
  }

  // Validado
  static async getTimeById(id) {
    let time = await sequelize.query(
      `SELECT * FROM "3x".TIMES_QTDPESS_QTDPROJ WHERE "codTime" = ${id}`
    );

    if (time[0].length === 0) {
      return false;
    }

    time = time[0][0];
    console.log(time.codTime);

    const usuarios = await sequelize.query(
      `SELECT * FROM "3x".RetornaUsuariosDeUmTime(${time.codTime})`
    );

    time.usuarios = usuarios[0];

    const projetos = await sequelize.query(
      `SELECT codprojeto as "codProjeto", nome, descricao, dtcriacao as "dtCriacao", timeresponsavel as "timeResponsavel", nometime as "nomeTime", dtconclusao as "dtConclusao", prazo as "Prazo", qtdtarefas as "qtdTarefas", qtdtarefasativas as "qtdTarefasAtivas", ativo FROM "3x".PROJETOSView WHERE timeresponsavel = ${time.codTime}`
    );

    time.projetos = projetos[0];

    return time;
  }

  // Validado
  static async addTime(nome) {
    const novoTime = await TimeModel.create({ nome: nome, ativo: true }).then(
      (time) => {
        return time.get({ plain: true });
      }
    );

    return novoTime;
  }

  // Validado
  static async addUsuarioTime(id, listaUsuarios) {
    const time = await TimeModel.findByPk(id);

    if (!time) {
      return false;
    }

    for (const usuario of listaUsuarios) {
      await UsuarioTimeModel.create({
        idUsuario: usuario,
        idTime: id,
      });
    }

    return true;
  }

  // Validado
  static async deleteUsuarioTime(id, usuario) {
    const user = await UsuarioTimeModel.findOne({
      where: { idUsuario: usuario, idTime: id },
    });

    if (!user) {
      return false;
    }

    await user.destroy();

    return true;
  }

  // Validado
  static async atualizaTimeProjeto(id, listaProjetos) {
    const time = await TimeModel.findByPk(id);

    if (!time) {
      return false;
    }

    await ProjetoModel.update(
      { idTime: id },
      { where: { idProjeto: { [Op.in]: listaProjetos } } }
    );

    return true;
  }

  // Validado
  static async atualizaStatusTime(id, ativo) {
    const time = await TimeModel.findByPk(id);

    if (!time) {
      return false;
    }

    await time.update({ ativo: ativo });

    return true;
  }

  // Validado
  static async updateNomeTime(id, nome) {
    const time = await TimeModel.findByPk(id);

    if (!time) {
      return false;
    }

    await time.update({ nome: nome });

    return true;
  }

  // Validado
  static async inactivateTime(id) {
    const time = await TimeModel.findByPk(id);

    if (!time) {
      return false;
    }

    await time.update({ ativo: false });

    return true;
  }

  // Validado
  static async getProjetosAtivosTime(id) {
    const projetos = await ProjetoModel.findAll({
      where: { idTime: id, ativo: true },
      raw: true,
    });

    return projetos;
  }
}

module.exports = TimeRepository;
