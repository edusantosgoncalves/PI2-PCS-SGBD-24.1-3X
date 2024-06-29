const ProjetoService = require("../service/Projeto");

module.exports = {
  async getProjetos(req, res) {
    const projetos = await ProjetoService.get();

    return res.json(projetos);
  },

  async getProjetoById(req, res) {
    const { id } = req.params;
    const projeto = await ProjetoService.getProjetoById(id);

    return res.json(projeto);
  },

  async updateProjeto(req, res) {
    const { id } = req.params;
    const { nome, descricao, timeResponsavel, ativo } = req.body;

    const projeto = await ProjetoService.updateProjeto(
      id,
      nome,
      descricao,
      timeResponsavel,
      ativo
    );

    return res.json(projeto);
  },

  async addProjetoTime(req, res) {
    const { id } = req.params;
    const { codTime } = req.body;

    const projeto = await ProjetoService.addProjetoTime(id, codTime);

    return res.json(projeto);
  },

  async atualizaStatusProjeto(req, res) {
    const { id } = req.params;
    const { ativo } = req.body;

    const projeto = await ProjetoService.atualizaStatusProjeto(id, ativo);

    return res.json(projeto);
  },

  async addProjeto(req, res) {
    const { nome, descricao, timeResponsavel, listaIteracoes } = req.body;

    const projeto = await ProjetoService.addProjeto(
      nome,
      descricao,
      timeResponsavel,
      listaIteracoes
    );

    return res.json(projeto);
  },

  async inactivateProjeto(req, res) {
    const { id } = req.params;
    const projeto = await ProjetoService.inactivateProjeto(id);

    return res.json(projeto);
  },

  async concluiProjeto(req, res) {
    const { id } = req.params;
    const projeto = await ProjetoService.concluiProjeto(id);

    return res.json(projeto);
  },

  async getUsuariosProjetos(req, res) {
    const { id } = req.params;

    const usuarios = await ProjetoService.getUsuariosProjetos(id);

    return res.json(usuarios);
  },

  async getIteracoesProjetos(req, res) {
    const { id } = req.params;

    const iteracoes = await ProjetoService.getIteracoesProjetos(id);

    return res.json(iteracoes);
  },

  async getTarefasProjeto(req, res) {
    const { id } = req.params;

    const tarefas = await ProjetoService.getTarefasProjeto(id);

    return res.json(tarefas);
  },

  async validaNomeProjeto(req, res) {
    const { nome } = req.body;

    const isValid = await ProjetoService.validaNomeProjeto(nome);

    return res.json(isValid);
  },

  async getDescricaoProjeto(req, res) {
    const { id } = req.params;

    const descricao = await ProjetoService.getDescricaoProjeto(id);

    return res.json(descricao);
  },

  async getIteracao(req, res) {
    const { id } = req.params;

    const iteracao = await ProjetoService.getIteracao(id);

    return res.json(iteracao);
  },

  async addIteracao(req, res) {
    const { id } = req.params;
    const { nome, descricao, dtInicio, dtFim } = req.body;

    const iteracao = await ProjetoService.addIteracao(
      id,
      nome,
      descricao,
      dtInicio,
      dtFim
    );

    return res.json(iteracao);
  },

  async alteraIteracao(req, res) {
    const { id } = req.params;
    const { nome, descricao, dtInicio, dtFim } = req.body;

    const iteracao = await ProjetoService.alteraIteracao(
      id,
      nome,
      descricao,
      dtInicio,
      dtFim
    );

    return res.json(iteracao);
  },

  async removeIteracao(req, res) {
    const { id } = req.params;

    const iteracao = await ProjetoService.removeIteracao(id);

    return res.json(iteracao);
  },

  async getQtdTarefasByProjeto(req, res) {
    const { id } = req.params;

    const tarefas = await ProjetoService.getQtdTarefasByProjeto(id);

    return res.json(tarefas);
  },

  async getQtdTarefasAtivasProjeto(req, res) {
    const { id } = req.params;

    const tarefas = await ProjetoService.getQtdTarefasAtivasProjeto(id);

    return res.json(tarefas);
  },
};
