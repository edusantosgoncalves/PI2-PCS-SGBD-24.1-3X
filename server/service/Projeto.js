const ProjetoRepository = require("../repository/Projeto"); // Repositorio do Projeto

class ProjetoService {
  static async get() {
    const projetos = await ProjetoRepository.get();
    return projetos;
  }

  static async getProjetoById(id) {
    const projeto = await ProjetoRepository.getProjetoById(id);
    return projeto;
  }

  static async updateProjeto(id, nome, descricao, timeResponsavel, ativo) {
    const projeto = await ProjetoRepository.updateProjeto(
      id,
      nome,
      descricao,
      timeResponsavel,
      ativo
    );

    return projeto;
  }

  static async addProjetoTime(id, codTime) {
    const projeto = await ProjetoRepository.addProjetoTime(id, codTime);

    return projeto;
  }

  static async atualizaStatusProjeto(id, ativo) {
    const projeto = await ProjetoRepository.atualizaStatusProjeto(id, ativo);

    return projeto;
  }

  static async addProjeto(nome, descricao, timeResponsavel, listaIteracoes) {
    const projeto = await ProjetoRepository.addProjeto(
      nome,
      descricao,
      timeResponsavel,
      listaIteracoes
    );

    return projeto;
  }

  static async inactivateProjeto(id) {
    const projeto = await ProjetoRepository.inactivateProjeto(id);

    return projeto;
  }

  static async concluiProjeto(id) {
    const projeto = await ProjetoRepository.concluiProjeto(id);

    return projeto;
  }

  static async getUsuariosProjetos(id) {
    const usuarios = await ProjetoRepository.getUsuariosProjetos(id);

    return usuarios;
  }

  static async getIteracoesProjetos(id) {
    const iteracoes = await ProjetoRepository.getIteracoesProjeto(id);

    return iteracoes;
  }

  static async getTarefasProjeto(id) {
    const tarefas = await ProjetoRepository.getTarefasProjetos(id);

    return tarefas;
  }

  static async validaNomeProjeto(nome) {
    const projeto = await ProjetoRepository.validaNomeProjeto(nome);

    return projeto;
  }

  static async getDescricaoProjeto(id) {
    const descricao = await ProjetoRepository.getDescricaoProjeto(id);

    return descricao;
  }

  static async getIteracao(idIteracao) {
    const iteracao = await ProjetoRepository.getIteracao(idIteracao);

    return iteracao;
  }

  static async addIteracao(idProjeto, nome, descricao, dataInicio, dataFim) {
    const iteracao = await ProjetoRepository.addIteracao(
      idProjeto,
      nome,
      descricao,
      dataInicio,
      dataFim
    );

    return iteracao;
  }

  static async alteraIteracao(
    idIteracao,
    nome,
    descricao,
    dataInicio,
    dataFim
  ) {
    const iteracao = await ProjetoRepository.updateIteracao(
      idIteracao,
      nome,
      descricao,
      dataInicio,
      dataFim
    );

    return iteracao;
  }

  static async removeIteracao(idIteracao) {
    const iteracao = await ProjetoRepository.removeIteracao(idIteracao);

    return iteracao;
  }

  static async getQtdTarefasByProjeto(idProjeto) {
    const qtdTarefas = await ProjetoRepository.getQtdTarefasByProjeto(
      idProjeto
    );

    return qtdTarefas;
  }

  static async getQtdTarefasAtivasProjeto(idProjeto) {
    const qtdTarefas = await ProjetoRepository.getQtdTarefasAtivasProjeto(
      idProjeto
    );

    return qtdTarefas;
  }
}

module.exports = ProjetoService;
