const TimeService = require("../service/Time");

module.exports = {
  async getTimes(req, res) {
    const times = await TimeService.get();
    return res.json(times);
  },

  async getTimesAtivos(req, res) {
    const times = await TimeService.getAtivos();
    return res.json(times);
  },

  async getTimeById(req, res) {
    const { id } = req.params;
    const time = await TimeService.getById(id);
    return res.json(time);
  },

  async addUsuarioTime(req, res) {
    const { id } = req.params;
    const { listaUsuarios } = req.body;

    const time = await TimeService.addUsuarioTime(id, listaUsuarios);

    return res.json(time);
  },

  async atualizaTimeProjeto(req, res) {
    const { id } = req.params;
    const { listaProjetos } = req.body;

    const time = await TimeService.atualizaTimeProjeto(id, listaProjetos);

    return res.json(time);
  },

  async atualizaStatusTime(req, res) {
    const { id } = req.params;
    const { ativo } = req.body;

    const time = await TimeService.atualizaStatusTime(id, ativo);

    return res.json(time);
  },

  async atualizaNomeTime(req, res) {
    const { id } = req.params;
    const { nome } = req.body;

    const time = await TimeService.atualizaNomeTime(id, nome);

    return res.json(time);
  },

  async addTime(req, res) {
    const { nome } = req.body;

    const novoTime = await TimeService.addTime(nome);

    return res.json(novoTime);
  },

  async inactivateTime(req, res) {
    const { id } = req.params;
    const time = await TimeService.inactivateTime(id);
    return res.json(time);
  },

  async deleteUsuarioTime(req, res) {
    const { id } = req.params;
    const { usuario } = req.body;

    const time = await TimeService.deleteUsuarioTime(id, usuario);

    return res.json(time);
  },

  async getProjetosAtivosTime(req, res) {
    const { id } = req.params;

    const projetos = await TimeService.getProjetosAtivosTime(id);

    return res.json(projetos);
  },
};
