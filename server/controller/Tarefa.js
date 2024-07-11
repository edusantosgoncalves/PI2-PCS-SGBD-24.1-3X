const TarefaService = require("../service/Tarefa");

module.exports = {
  async getTarefas(req, res) {
    const tarefas = await TarefaService.get();
    return res.json(tarefas);
  },

  async getTarefaById(req, res) {
    const { id } = req.params;
    const tarefa = await TarefaService.getById(id);
    return res.json(tarefa);
  },

  async updateTarefa(req, res) {
    const { id } = req.params;
    const { nome, descricao, status, idIteracao, usuarioResp } = req.body;
    const updated = await TarefaService.updateTarefa(
      id,
      nome,
      descricao,
      status,
      idIteracao,
      usuarioResp
    );
    return res.json(updated);
  },

  async addTarefa(req, res) {
    const { nome, descricao, status, idIteracao, usuarioResp } = req.body;
    const added = await TarefaService.addTarefa(
      nome,
      descricao,
      status,
      idIteracao,
      usuarioResp
    );
    return res.json(added);
  },

  async concluiTarefa(req, res) {
    const { id } = req.params;
    const concluido = await TarefaService.concluiTarefa(id);
    return res.json(concluido);
  },

  async getTarefasViewByUsuario(req, res) {
    const { email } = req.body;

    const tarefas = await TarefaService.getTarefasViewByUsuario(email);

    return res.json(tarefas);
  },

  async isTarefaSeguidaPorUsuario(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const seguida = await TarefaService.isTarefaSeguidaPorUsuario(id, email);

    return res.json(seguida);
  },

  async getComentariosPorTarefa(req, res) {
    const { id } = req.params;
    const comentarios = await TarefaService.getComentariosPorTarefa(id);
    return res.json(comentarios);
  },

  async getListaUsuariosGatilho(req, res) {
    const { id } = req.params;
    const { email, acao, nomeTarefa, nomeRespTarefa, comentario } = req.body;

    // ! Fazendo a tarefa sincronamente  (sem aguardar o retorno do e-mail para responder o usuario - ou seja, sem await)
    TarefaService.getListaUsuariosGatilho(
      id,
      email,
      acao,
      nomeTarefa,
      nomeRespTarefa,
      comentario
    );

    return res.json(true);
  },

  async addComentario(req, res) {
    const { id } = req.params;
    const { descricao, email } = req.body;

    const comentario = await TarefaService.addComentario(id, descricao, email);

    if (comentario.message) return res.status(400).json(comentario);
    if (!comentario)
      return res.status(404).json({ message: "Tarefa não encontrada" });

    return res.status(201).json(comentario);
  },

  async getTarefasByIteracao(req, res) {
    const { id } = req.params;

    const tarefas = await TarefaService.getTarefasByIteracao(id);

    return res.json(tarefas);
  },
};
