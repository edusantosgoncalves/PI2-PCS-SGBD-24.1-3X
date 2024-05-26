const sequelize = require("../database/db").sequelize;
const {
  Time: TimeModel,
  Projeto: ProjetoModel,
  Iteracao: IteracaoModel,
} = require("../database/db");

class ProjetoRepository {
  // Validado
  static async get() {
    const query = await sequelize.query(
      `SELECT * FROM "3x".PROJETOSView ORDER BY ativo DESC`
    );

    return query[0];
  }

  // Validado
  static async getProjetoById(id) {
    let projeto = await sequelize.query(
      `SELECT * FROM "3x".PROJETOSView WHERE codProjeto = ${id}`
    );

    if (projeto[0].length === 0) {
      return false;
    }

    return projeto[0];
  }

  // Validado
  static async updateProjeto(id, nome, descricao, timeResponsavel, ativo) {
    const projeto = await ProjetoModel.findByPk(id);

    if (!projeto) {
      return false;
    }

    projeto.nome = nome;
    projeto.descricao = descricao;
    projeto.idTime = timeResponsavel;
    projeto.ativo = ativo;
    await projeto.save();

    return true;
  }

  // Validado
  static async addProjeto(nome, descricao, timeResponsavel, listaIteracoes) {
    const novoTime = await ProjetoModel.create({
      nome: nome,
      descricao: descricao,
      idTime: timeResponsavel,
      ativo: true,
    }).then((projeto) => {
      return projeto.get({ plain: true });
    });

    // . Inserindo iteracao geral do projeto
    await IteracaoModel.create({
      nome: "ITERAÇÃO - " + nome.toUpperCase(),
      descricao: "Iteração geral do projeto",
      idProjeto: novoTime.idProjeto,
    });

    let qtdIteracoesCriadas = 0;
    for (const iteracao of listaIteracoes) {
      await IteracaoModel.create({
        nome: iteracao.nome,
        descricao: iteracao.descricao,
        idProjeto: novoTime.idProjeto,
        dtInicio: iteracao.dtInicio,
        dtConclusao: iteracao.dtConclusao,
      });
      qtdIteracoesCriadas++;
    }

    return {
      qtdIteracoesCriadas,
      qtdIteracoesRecebidas: listaIteracoes.length,
    };
  }

  // Validado
  static async inactivateProjeto(id) {
    const projeto = await ProjetoModel.findByPk(id);

    if (!projeto) {
      return false;
    }

    await projeto.update({ ativo: false });

    return true;
  }

  // Validado
  static async addProjetoTime(idProjeto, idTime) {
    const projeto = await ProjetoModel.findByPk(idProjeto);
    const time = await TimeModel.findByPk(idTime);

    if (!projeto || !time) {
      return false;
    }

    await projeto.setTime(time);

    return true;
  }

  // Validado: Ajustar no FRONT_END, pois nao consegui obter essa view
  static async getUsuariosProjetos(id) {
    const query = await sequelize.query(
      `SELECT * FROM "3x".USUARIOS_PROJETOS WHERE "codProjeto" = ${id}`
    );

    return query[0];
  }

  // Validado
  static async getIteracoesProjeto(id) {
    const query = await sequelize.query(
      `SELECT * FROM "3x".getIteracoesProjetos(${id})`
    );

    return query[0];
  }

  // Validado
  static async getTarefasProjetos(id) {
    const query = await sequelize.query(
      `SELECT * FROM "3x".getTarefasProjeto(${id})`
    );

    return query[0];
  }

  // Validado
  static async atualizaStatusProjeto(id, ativo) {
    const projeto = await ProjetoModel.findByPk(id);

    if (!projeto) {
      return false;
    }

    projeto.ativo = ativo;
    await projeto.save();

    return true;
  }

  // Validado
  static async validaNomeProjeto(email) {
    const projeto = await ProjetoModel.findOne({ where: { nome: email } });

    return !projeto; // Se existir projeto, retorna false, se não, retorna true
  }

  // Validado
  static async getDescricaoProjeto(id) {
    const projeto = await ProjetoModel.findByPk(id, { raw: true });

    if (!projeto) {
      return false;
    }

    return projeto.descricao;
  }

  // Validado
  static async getIteracao(idIteracao) {
    const iteracao = await IteracaoModel.findByPk(idIteracao, { raw: true });

    if (!iteracao) {
      return false;
    }

    return iteracao;
  }

  // Validado
  static async addIteracao(idProjeto, nome, descricao, dtInicio, dtFim) {
    const iteracoes = await IteracaoModel.create({
      nome: nome,
      descricao: descricao,
      dtInicio: dtInicio,
      dtConclusao: dtFim,
      idProjeto: idProjeto,
    }).then((iteracao) => {
      return iteracao.get({ plain: true });
    });

    return iteracoes;
  }

  // Validado
  static async updateIteracao(idIteracao, nome, descricao, dtInicio, dtFim) {
    const iteracao = await IteracaoModel.findByPk(idIteracao);

    if (!iteracao) {
      return false;
    }

    iteracao.nome = nome;
    iteracao.descricao = descricao;
    iteracao.dtInicio = dtInicio;
    iteracao.dtConclusao = dtFim;
    await iteracao.save();

    return true;
  }

  // Validado
  static async removeIteracao(idIteracao) {
    const iteracao = await IteracaoModel.findByPk(idIteracao);

    if (!iteracao) {
      return false;
    }

    await iteracao.destroy();

    return true;
  }

  // Validado
  static async getTarefasByProjeto(idProjeto) {
    const query = await sequelize.query(
      `SELECT qtdtarefas FROM "3x".PROJETOSVIEW WHERE codprojeto = ${idProjeto}`
    );

    if (query[0].length === 0) return false;

    return query[0][0].qtdtarefas;
  }

  // Validado
  static async getTarefasAtivasProjeto(idProjeto) {
    const query = await sequelize.query(
      `SELECT qtdTarefasAtivas FROM "3x".PROJETOSVIEW WHERE codprojeto = ${idProjeto}`
    );

    return query[0];
  }

  // Validado
  static async concluiProjeto(id) {
    const projeto = await ProjetoModel.findByPk(id);

    if (!projeto) {
      return false;
    }

    projeto.dtConclusao = sequelize.fn("NOW");
    await projeto.save();

    return true;
  }
}

module.exports = ProjetoRepository;
