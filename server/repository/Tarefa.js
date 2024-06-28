const sequelize = require("../database/db").sequelize;
const {
  Tarefa: TarefaModel,
  Comentario: ComentarioModel,
  Usuario: UsuarioModel,
} = require("../database/db");

class ProjetoRepository {
  // Validado
  static async get() {
    const query = await sequelize.query(
      `SELECT * FROM "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS`
    );

    return query[0];
  }

  // Validado
  static async getTarefasViewByUsuario(idUsuario) {
    let tarefa = await sequelize.query(
      `SELECT * FROM "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS WHERE usuarioResp = ${idUsuario}`
    );

    if (tarefa[0].length === 0) {
      return false;
    }

    return tarefa[0];
  }

  // Validado: atualizar no front recuperacao de comentarios da tarefa
  static async getTarefaById(id) {
    let tarefa = await TarefaModel.findOne({
      where: { idTarefa: id },
      raw: true,
    });

    if (!tarefa) {
      return false;
    }

    // Buscando comentarios
    let comentarios = await ComentarioModel.findAll({
      attributes: [
        "idComentario",
        "descricao",
        "idUsuario",
        ["createdAt", "dtCriacao"],
      ],
      where: { idTarefa: id },
      include: {
        model: UsuarioModel,
        attributes: ["nome", "email", "urlImagem"],
      },
      raw: true,
    });

    tarefa.comentarios = comentarios;

    return tarefa;
  }

  // Validado
  static async updateTarefa(
    id,
    nome,
    descricao,
    status,
    idIteracao,
    idUsuario
  ) {
    const tarefa = await TarefaModel.findByPk(id);

    if (!tarefa) {
      return false;
    }

    tarefa.nome = nome;
    tarefa.descricao = descricao;
    tarefa.status = status;
    tarefa.idIteracao = idIteracao;
    tarefa.idUsuario = idUsuario;
    await tarefa.save();

    return true;
  }

  // Validado
  static async addTarefa(nome, descricao, status, idIteracao, idUsuario) {
    const novaTarefa = await TarefaModel.create({
      nome: nome,
      descricao: descricao,
      status: status,
      idIteracao: idIteracao,
      idUsuario: idUsuario,
    }).then((tarefa) => {
      return tarefa.get({ plain: true });
    });

    return novaTarefa;
  }

  // Validado
  static async inactivateTarefa(id) {
    const tarefa = await TarefaModel.findByPk(id);

    if (!tarefa) {
      return false;
    }

    tarefa.status = 4;
    await tarefa.save();

    return true;
  }

  // Validado
  static async getComentariosPorTarefa(id) {
    const comentarios = await ComentarioModel.findAll({
      where: { idTarefa: id },
      include: {
        model: UsuarioModel,
        attributes: ["nome", "email", "urlImagem"],
      },
      raw: true,
    });

    if (!comentarios) {
      return false;
    }

    return comentarios;
  }

  // Validado
  static async addComentario(idTarefa, descricao, idUsuario) {
    const comentario = await ComentarioModel.create({
      descricao: descricao,
      idTarefa: idTarefa,
      idUsuario: idUsuario,
    }).then((comm) => {
      return comm.get({ plain: true });
    });

    return comentario;
  }

  // Validado
  static async concluiTarefa(id) {
    const tarefa = await TarefaModel.findByPk(id);

    if (!tarefa) {
      return false;
    }

    tarefa.status = 3;
    await tarefa.save();

    return true;
  }

  // Validado
  static async getTarefasByIteracao(idIteracao) {
    const tarefas = await TarefaModel.findAll({
      where: { idIteracao: idIteracao },
      raw: true,
    });

    if (!tarefas) {
      return false;
    }

    return tarefas;
  }
}

module.exports = ProjetoRepository;
