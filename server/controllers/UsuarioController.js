// ! REQUIRE MODEL
const Usuario = require('../models/Usuario.js');

// * Cria a classe de CRUD do usuário 
module.exports = {

    // * Retorna todos os usuários
    async getUsuarios(req, res) {
        Usuario.get()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna todos os usuários ativos
    async getAtivos(req, res) {
        Usuario.getAtivos()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna um usuário pelo e-mail
    async getUserByEmail(req, res) {
        const { email } = req.params;

        Usuario.getUserByEmail(email)
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta)
                    res.status(400).json(resposta);
                else
                    res.status(200).json(resposta);
            })
    },

    // * Altera status do usuário
    async alteraStatus(req, res) {
        const { email } = req.params;
        const { status } = req.body;
        Usuario.alteraStatus(email, status)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json(resposta);
                        break;
                    case 404:
                        res.status(404).json(resposta);
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Atualiza um usuário
    async updateUser(req, res) {
        const { email } = req.params;
        const user = req.body;

        Usuario.updateUser(email, user.nome, user.funcao, user.github,
            user.linkedin, user.cep, user.numEnd, user.complEnd)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json(resposta);
                        break;
                    case 404:
                        res.status(404).json(resposta);
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Autentica um usuário
    async userLogin(req, res) {
        const { email } = req.params;
        const user = req.body;
        //console.log(user)

        Usuario.userLogin(email, user.nome, user.urlImagem)
            .then(resposta => {
                console.log(resposta.status);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },


    // * Cria um usuário
    async addUser(req, res) {
        const user = req.body;

        Usuario.addUser(user.email, user.nome, user.status)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json(resposta.emailEnviado);
                        break;
                    case 402:
                        res.status(402).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Deleta um usuário
    async deleteUser(req, res) {
        const { email } = req.params;

        Usuario.deleteUser(email)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 402:
                        res.status(402).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Atualiza um usuário - tela de USUARIO ADM
    async updateUserAdmin(req, res) {
        const { email } = req.params;
        const user = req.body;

        Usuario.updateUserAdmin(email, user.emailNovo, user.funcao, user.status)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },


    // * Adiciona um usuário a um time
    async addUserTeam(req, res) {
        const { email } = req.params;
        const time = req.body.codTime;

        Usuario.addUserTeam(email, time)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Retorna todos os times do usuario
    async getUsersTimes(req, res) {
        const { email } = req.params;

        Usuario.getUsersTimes(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta.times);
            })

    },


    // * Segue uma tarefa
    async seguirTarefa(req, res) {
        const { email } = req.params;
        const tarefa = req.body;

        Usuario.seguirTarefa(email, tarefa.codTarefa)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta.message);
                        break;
                }
            })
    },


    // * Segue uma tarefa
    async pararDeSeguirTarefa(req, res) {
        const { email } = req.params;
        const tarefa = req.body;

        Usuario.pararDeSeguirTarefa(email, tarefa.codTarefa)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta.message);
                        break;
                }
            })
    },

    // * Retorna todos os usuários
    async getTarefasSeguidasUsuario(req, res) {
        const { email } = req.params;

        Usuario.getTarefasSeguidasUsuario(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta.tarefas);
            })
    },

    // * Retorna todos os projetos de um usuário específico
    async getProjetosUsuario(req, res) {
        const { email } = req.params;

        Usuario.getProjetosUsuario(email)
            .then(resposta => {
                console.log("peguei projetos")
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta.projetos);
            })
    },


    // * Segue uma tarefa
    async seguirUsuario(req, res) {
        const { email } = req.params;
        const usuarioSeguir = req.body;

        Usuario.seguirUsuario(email, usuarioSeguir.email)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta.message);
                        break;
                }
            })
    },


    // * Para de seguir um usuario
    async pararDeSeguirUsuario(req, res) {
        const { email } = req.params;
        const usuarioSeguir = req.body;
        console.log(email, usuarioSeguir.email)

        Usuario.pararDeSeguirUsuario(email, usuarioSeguir.email)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta.message);
                        break;
                }
            })
    },


    // * Verifica se a tarefa é seguida pelo usuario recebido
    async isUsuarioSeguidoPorUsuario(req, res) {
        const { id, emailSeguido } = req.params;
        //const usuario = req.body;
        console.log(emailSeguido + id)

        Usuario.isUsuarioSeguidoPorUsuario(id, emailSeguido)
            .then(resposta => {
                console.log(resposta)
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta);
                        break;
                    case 202:
                        res.status(202).json(resposta);
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },


    // * Gera dashboard do usuario
    async getDashboard(req, res) {
        const { email, adm } = req.params;
        //const usuario = req.body;
        console.log(adm + " - " + email)

        Usuario.getDashboard(email, adm)
            .then(resposta => {
                // console.log(resposta)
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.dashboard);
                        break;
                    case 404:
                        res.status(404).json(resposta);
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Busca usuários seguidos
    async getUsuariosSeguidos(req, res) {
        const { email } = req.params;

        Usuario.getUsuariosSeguidos(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta);
            })
    },

    // * Busca sugestões de entretenimento do usuario
    async getEntretenimentoByEmail(req, res) {
        const { email } = req.params;

        Usuario.getEntretenimentoByEmail(email)
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta)
                    res.status(400).json(resposta);
                else
                    res.status(200).json(resposta);
            })
    },

    // * Busca sugestões de entretenimento do usuario
    async getAvaliacoesParaUsuario(req, res) {
        const { email } = req.params;

        Usuario.getAvaliacoesParaUsuario(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta);
            })
    },

    // * Busca sugestões de entretenimento do usuario
    async getAvaliacoesDeUsuario(req, res) {
        const { email } = req.params;

        Usuario.getAvaliacoesDeUsuario(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta)
                    res.status(500).json(resposta.message);
                else
                    res.status(200).json(resposta);
            })
    },

    // * Avalia usuário
    async avaliarUsuario(req, res) {
        const { email } = req.params;

        const avaliacao = req.body;

        Usuario.avaliarUsuario(email, avaliacao.email, avaliacao.avaliacao, avaliacao.comentario)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            })
    },

    // * Adiciona/altera entretenimento de usuário
    async vrfEntretenimento(req, res) {
        const { email } = req.params;

        const entretenimento = req.body;

        Usuario.getEntretenimentoByEmail(email)
            .then(resposta => {
                console.log(resposta);
                if ('message' in resposta) {
                    if (resposta.message === "Usuário não encontrado") {
                        Usuario.addEntretenimento(email, entretenimento.spotify, entretenimento.moviedb_id, entretenimento.moviedb_tipo)
                            .then(resposta => {
                                console.log(resposta);
                                switch (resposta.status) {
                                    case 201:
                                        res.status(201).json();
                                        break;
                                    case 404:
                                        res.status(404).json();
                                        break;
                                    case 500:
                                        res.status(500).json(resposta);
                                        break;
                                }
                            })
                    }
                    else {
                        res.status(500).json(resposta);
                    }
                }
                else {
                    Usuario.alterEntretenimento(email, entretenimento.spotify, entretenimento.moviedb_id, entretenimento.moviedb_tipo)
                        .then(resposta => {
                            console.log(resposta);
                            switch (resposta.status) {
                                case 201:
                                    res.status(201).json();
                                    break;
                                case 404:
                                    res.status(404).json();
                                    break;
                                case 500:
                                    res.status(500).json(resposta);
                                    break;
                            }
                        })
                }
            })
    },
}