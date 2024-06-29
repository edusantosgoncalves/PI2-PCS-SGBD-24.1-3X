const TarefaRepository = require("../repository/Tarefa"); // Repositorio da Tarefa
const Tarefa4JRepository = require("../repository/Tarefa4J"); // Repositorio da Tarefa no Neo4j
const UsuarioRepository = require("../repository/Usuario"); // Repositorio do Usuario
const Usuario4JRepository = require("../repository/Usuario4J"); // Repositorio do Usuario no Neo4j
const { sendEmail } = require("../utils/Email");

class TarefaService {
  static async get() {
    const tarefas = await TarefaRepository.get();
    return tarefas;
  }

  static async getById(id) {
    const tarefa = await TarefaRepository.getById(id);

    if (!tarefa) return false;

    // . Normalizando JSON
    tarefa["usuarioResp"] = tarefa["Usuario.usuarioResp"];
    delete tarefa["Usuario.usuarioResp"];

    tarefa["nomeUsuarioResp"] = tarefa["Usuario.nomeUsuarioResp"];
    delete tarefa["Usuario.nomeUsuarioResp"];

    tarefa["urlImagemUsuarioResp"] = tarefa["Usuario.urlImagem"];
    delete tarefa["Usuario.urlImagem"];

    return tarefa;
  }

  static async updateTarefa(
    id,
    nome,
    descricao,
    status,
    codIteracaoFK,
    usuarioResp
  ) {
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      usuarioResp
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const tarefa = await TarefaRepository.updateTarefa(
      id,
      nome,
      descricao,
      status,
      codIteracaoFK,
      usuario.idUsuario
    );
    return tarefa;
  }

  static async addTarefa(nome, descricao, status, codIteracaoFK, usuarioResp) {
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      usuarioResp
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const tarefa = await TarefaRepository.addTarefa(
      nome,
      descricao,
      status,
      codIteracaoFK,
      usuario.idUsuario
    );
    return tarefa;
  }

  static async concluiTarefa(id) {
    const tarefa = await TarefaRepository.concluiTarefa(id);

    return tarefa;
  }

  static async getTarefasViewByUsuario(email) {
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      email
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const tarefas = await TarefaRepository.getTarefasViewByUsuario(
      usuario.idUsuario
    );

    return tarefas;
  }

  static async isTarefaSeguidaPorUsuario(id, email) {
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      email
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const seguida = await Tarefa4JRepository.isTarefaSeguidaPorUsuario(
      usuario.idUsuario,
      id
    );

    return seguida;
  }

  static async getComentariosPorTarefa(id) {
    const comentarios = await TarefaRepository.getComentariosPorTarefa(id);

    if (!comentarios) return false;

    comentarios.forEach((comentario) => {
      comentario["usuario"] = comentario["Usuario.email"];
      delete comentario["Usuario.email"];

      comentario["nomeUsuario"] = comentario["Usuario.nome"];
      delete comentario["Usuario.nome"];

      comentario["urlImagemUsuario"] = comentario["Usuario.urlImagem"];
      delete comentario["Usuario.urlImagem"];
    });

    return comentarios;
  }

  static async getListaUsuariosGatilho(
    id,
    emailUsuario,
    acao,
    nomeTarefa,
    nomeRespTarefa,
    comentario
  ) {
    // Obtendo id do usuario
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      emailUsuario
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const usuariosTarefa = await Tarefa4JRepository.getUsuarioSeguidores(id);

    const usuariosUsuarios = await Usuario4JRepository.getSeguidoresUsuario(
      usuario.idUsuario
    );

    const usuarios = new Set([...usuariosTarefa, ...usuariosUsuarios]);

    let content = "";
    let subject = "";

    if (acao === "ADD") {
      subject = "3X: Tarefa Atualizada";

      content =
        "A tarefa <b>" +
        nomeTarefa +
        "</b> recebeu um novo comentário de " +
        nomeRespTarefa +
        ": <br>" +
        comentario;
    } else if (acao === "CONC") {
      subject = "3X: Tarefa Concluída";

      content =
        "A tarefa <b>" +
        nomeTarefa +
        "</b> foi concluida por " +
        nomeRespTarefa +
        "!";
    }

    for (const usuario of usuarios) {
      const emailUsuario = await UsuarioRepository.getUserEmailById(usuario);

      // . Enviando email
      await sendEmail(emailUsuario.email, subject, content);
    }

    return true;
  }

  static async addComentario(id, descricao, email) {
    const usuario = await UsuarioRepository.getUserIdByEmailForActiveUser(
      email
    );

    // . Verificando se o usuario existe
    if (!usuario) {
      return { message: "Usuário não encontrado" };
    }

    const comentario = await TarefaRepository.addComentario(
      id,
      descricao,
      usuario.idUsuario
    );

    return comentario;
  }

  static async getTarefasByIteracao(idIteracao) {
    const tarefas = await TarefaRepository.getTarefasByIteracao(idIteracao);

    return tarefas;
  }
}

module.exports = TarefaService;
