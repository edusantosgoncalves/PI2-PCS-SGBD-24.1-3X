// ! REQUIRE MODEL
const Projeto = require('../models/Projeto.js');

// * Cria a classe de CRUD de Times 
module.exports = {
    // * Retorna todos os projetos
    async getProjetos(req, res) {
        Projeto.get()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna um projeto
    async getProjetoById(req, res) {
        const { id } = req.params;

        Projeto.getProjetoById(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.projeto);
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

    // * Atualiza um projeto
    async updateProjeto(req, res) {
        const { id } = req.params;
        const projeto = req.body;

        Projeto.updateProjeto(id, projeto.nome, projeto.descricao, projeto.timeResponsavel, projeto.ativo)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            });
    },

    // * Cria um projeto
    async addProjeto(req, res) {
        const projeto = req.body;

        Projeto.addProjeto(projeto.nome, projeto.descricao, projeto.timeResponsavel, projeto.listaIteracoes)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json(resposta);
                        break;
                    case 402:
                        res.status(402).json();
                        break;
                    case 500:
                        res.status(500).json(resposta);
                        break;
                }
            });
    },

    // * Inativa um projeto
    async inactivateProjeto(req, res) {
        const { id } = req.params;

        Projeto.inactivateProjeto(id)
            .then(resposta => {
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

    // * Adiciona um projeto a um time
    async addProjetoTime(req, res) {
        const { id } = req.params;
        const time = req.body.codTime;

        Projeto.addProjetoTime(id, time)
            .then(resposta => {
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
            });
    },

    // * Retorna todos os usuários de um projeto
    async getUsuariosProjetos(req, res) {
        const { id } = req.params;

        Projeto.getUsuariosProjetos(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.usuarios);
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna todas as iterações de um projeto
    async getIteracoesProjetos(req, res) {
        const { id } = req.params;

        Projeto.getIteracoesProjetos(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.iteracoes);
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna todas as tarefas de um projeto
    async getTarefasProjetos(req, res) {
        const { id } = req.params;

        Projeto.getTarefasProjetos(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.tarefas);
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Atualiza o status de um time
    async atualizaStatusProjeto(req, res) {
        const { id } = req.params;
        const { ativo } = req.body;

        Projeto.atualizaStatusProjeto(id, ativo)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna todas as iterações de um projeto
    async validaNomeProjeto(req, res) {
        const { id } = req.params;

        Projeto.validaNomeProjeto(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json({ valido: resposta.valido });
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna a descrição de um projeto
    async getDescricaoProjeto(req, res) {
        const { id } = req.params;

        Projeto.getDescricaoProjeto(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.descricao);
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna uma iteração pelo id
    async getIteracao(req, res) {
        const { id } = req.params;

        Projeto.getIteracao(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.iteracao);
                        break;
                    case 404:
                        res.status(404).json();
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Adiciona uma iteração
    async addIteracao(req, res) {
        const { id } = req.params;
        const { nome, descricao, dtInicio, dtFim } = req.body;

        Projeto.addIteracao(id, nome, descricao, dtInicio, dtFim)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Altera uma iteração
    async alteraIteracao(req, res) {
        const { id } = req.params;
        const { nome, descricao, dtInicio, dtFim } = req.body;

        Projeto.alteraIteracao(id, nome, descricao, dtInicio, dtFim)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna a descrição de um projeto
    async removeIteracao(req, res) {
        const { id } = req.params;

        Projeto.removeIteracao(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },


    // * Retorna a qtd de tarefas de um projeto
    async getTarefasByProjeto(req, res) {
        const { id } = req.params;

        Projeto.getTarefasByProjeto(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.tarefa);
                        break;
                    case 404:
                        res.status(404).json();
                        break;
                    case 500:
                        res.status(500).json(resposta)
                        break;
                }
            })
    },

    // * Retorna a qtd de tarefas ativas de um projeto
    async getTarefasAtivasProjeto(req, res) {
        const { id } = req.params;

        Projeto.getTarefasAtivasProjeto(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.qtd);
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

    // * Conclui um projeto
    async concluiProjeto(req, res) {
        const { id } = req.params;

        Projeto.concluiProjeto(id)
            .then(resposta => {
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
}