const UsuarioService = require("../service/Usuario");

module.exports = {
  async getUsersTimes(req, res) {
    const { email } = req.params;

    const times = await UsuarioService.getUsersTimes(email);
    return res.json(times);
  },

  async getTarefasSeguidasUsuario(req, res) {
    const { email } = req.params;

    const tarefas = await UsuarioService.getTarefasSeguidasUsuario(email);
    return res.json(tarefas);
  },

  async getProjetosUsuario(req, res) {
    const { email } = req.params;

    const projetos = await UsuarioService.getProjetosUsuario(email);
    return res.json(projetos);
  },

  async getUsuariosSeguidos(req, res) {
    const { email } = req.params;

    const usuarios = await UsuarioService.getUsuariosSeguidos(email);
    return res.json(usuarios);
  },

  async getAvaliacoesParaUsuario(req, res) {
    const { email } = req.params;

    const avaliacoes = await UsuarioService.getAvaliacoesParaUsuario(email);
    return res.json(avaliacoes);
  },

  async getAvaliacoesDeUsuario(req, res) {
    const { email } = req.params;

    const avaliacoes = await UsuarioService.getAvaliacoesDeUsuario(email);
    return res.json(avaliacoes);
  },

  async userLogin(req, res) {
    const { email } = req.params;
    const { nome, urlImagem } = req.body;

    const user = await UsuarioService.userLogin(email, nome, urlImagem);

    switch (user) {
      case false:
        return res.status(404).json();
      case -1:
        return res.status(500).json();
      default:
        return res.status(201).json(user);
    }
  },

  async getUserByEmail(req, res) {
    const { email } = req.params;

    const user = await UsuarioService.getUserByEmail(email);

    switch (user) {
      case false:
        return res.status(404).json();
      default:
        return res.status(200).json(user);
    }
  },
};
