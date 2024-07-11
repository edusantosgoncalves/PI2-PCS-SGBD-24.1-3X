const UsuarioService = require("../service/Usuario");

module.exports = {
  async getUsuarios(req, res) {
    const usuarios = await UsuarioService.get();
    return res.json(usuarios);
  },

  async getAtivos(req, res) {
    const usuarios = await UsuarioService.getAtivos();
    return res.json(usuarios);
  },

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

    if (!isNaN(projetos)) {
      const result = UsuarioService.getUserIdError(projetos);

      if (projetos === -1) return res.status(500).json(result);
      else if (projetos === -2) return res.status(404).json(result);
      else return res.status(400).json(result);
    }
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

    if (avaliacoes === -2) {
      return res.status(404).json("Usuário não encontrado");
    }
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

    if (!user) return res.status(404).json();
    return res.status(200).json(user);
  },

  async pararDeSeguirTarefa(req, res) {
    const { email } = req.params;
    const { codTarefa } = req.body;

    const result = await UsuarioService.pararDeSeguirTarefa(email, codTarefa);

    if (result < 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(result);
  },

  async seguirTarefa(req, res) {
    const { email } = req.params;
    const { codTarefa } = req.body;

    const result = await UsuarioService.seguirTarefa(email, codTarefa);

    if (result < 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(result);
  },

  async getDashboard(req, res) {
    const { email, adm } = req.params;

    const dashboard = await UsuarioService.getDashboard(email, adm);

    switch (dashboard) {
      case false:
        return res.status(404).json();
      default:
        return res.status(200).json(dashboard);
    }
  },

  async pararDeSeguirUsuario(req, res) {
    const { email } = req.params;
    const { email: emailSeguir } = req.body;

    const result = await UsuarioService.pararDeSeguirUsuario(
      email,
      emailSeguir
    );

    if (result < 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(result);
  },

  async seguirUsuario(req, res) {
    const { email } = req.params;
    const { email: emailSeguir } = req.body;

    const result = await UsuarioService.seguirUsuario(email, emailSeguir);

    if (result < 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(result);
  },

  async isUsuarioSeguidoPorUsuario(req, res) {
    const { email, emailSeguido } = req.params;

    const result = await UsuarioService.isUsuarioSeguidoPorUsuario(
      email,
      emailSeguido
    );

    if (result < 0)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(result);
  },

  async updateUserAdmin(req, res) {
    const { email } = req.params;
    const { emailNovo, funcao, status } = req.body;

    const result = await UsuarioService.updateUserAdmin(
      email,
      emailNovo,
      funcao,
      status
    );

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(200).json(true);
    }
  },

  async deleteUser(req, res) {
    const { email } = req.params;

    const result = await UsuarioService.deleteUser(email);

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(200).json(true);
    }
  },

  async addUser(req, res) {
    const { email, nome, status } = req.body;

    const result = await UsuarioService.addUser(email, nome, status);

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(201).json(result);
    }
  },

  async addUserTeam(req, res) {
    const { email } = req.params;
    const { codTime } = req.body;

    const result = await UsuarioService.addUserTeam(email, codTime);

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(201).json(result);
    }
  },

  async alteraStatus(req, res) {
    const { email } = req.params;
    const { status } = req.body;

    const result = await UsuarioService.alteraStatus(email, status);

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(200).json(true);
    }
  },

  async updateUser(req, res) {
    const { email } = req.params;
    const { nome, funcao, github, linkedin, cep, numEnd, complEnd } = req.body;

    const result = await UsuarioService.updateUser(
      email,
      nome,
      funcao,
      github,
      linkedin,
      cep,
      numEnd,
      complEnd
    );

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(201).json(result);
    }
  },

  async avaliarUsuario(req, res) {
    const { email } = req.params;
    const {
      email: emailAvaliado,
      avaliacao: nota,
      comentario: descricao,
    } = req.body;

    const result = await UsuarioService.avaliarUsuario(
      email,
      emailAvaliado,
      nota,
      descricao
    );

    switch (result) {
      case false:
        return res.status(404).json();
      default:
        return res.status(201).json(result);
    }
  },
};
