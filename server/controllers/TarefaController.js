// ! REQUIRE MODEL
const Tarefa = require('../models/Tarefa.js');

// * Importando as dependências do BD
const { sql, poolPromise } = require('../database/db');

// * Cria a classe de CRUD de Projetos 
module.exports = {

    // * Retorna todas as tarefas
    async getTarefas(req, res) {
        Tarefa.get()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })

    },

    // * Retorna todas as tarefas de um usuario (usando a VIEW criada no SQL)
    async getTarefasViewByUsuario(req, res) {
        const usuario = req.body;

        Tarefa.getTarefasViewByUsuario(usuario.email)
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna uma tarefa
    async getTarefaById(req, res) {
        const { id } = req.params;

        Tarefa.getTarefaById(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.tarefa);
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

    // * Atualiza uma tarefa
    async updateTarefa(req, res) {
        const { id } = req.params;
        const tarefa = req.body;

        Tarefa.updateTarefa(id, tarefa.nome, tarefa.descricao, tarefa.status, tarefa.codIteracaoFK, tarefa.usuarioResp)
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
            })
    },

    // * Cria uma tarefa
    async addTarefa(req, res) {
        const tarefa = req.body;

        Tarefa.addTarefa(tarefa.nome, tarefa.descricao, tarefa.status, tarefa.codIteracaoFK, tarefa.usuarioResp)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(200).json(); //Validar no front dps... (trocar pra 201 nos 2)
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

    // * Deleta uma tarefa
    async inactivateTarefa(req, res) {
        const { id } = req.params;

        Tarefa.inactivateTarefa(id)
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

    // * Verifica se a tarefa é seguida pelo usuario recebido
    async isTarefaSeguidaPorUsuario(req, res) {
        const { id } = req.params;
        const usuario = req.body;

        Tarefa.isTarefaSeguidaPorUsuario(id, usuario.email)
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

    // * Retorna todos os comentários de uma tarefa
    async getComentariosPorTarefa(req, res) {
        const { id } = req.params;

        Tarefa.getComentariosPorTarefa(id)
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(500).json({ message: resposta });
                }

                res.status(200).json(resposta);
            })
    },

    // * Adiciona um comentário para a tarefa
    async addComentario(req, res) {
        const { id } = req.params;
        const comment = req.body;

        Tarefa.addComentario(id, comment.descricao, comment.email)
            .then(resposta => {
                switch (resposta.status) {
                    case 201:
                        res.status(201).json();
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

    // * Atualiza uma tarefa
    async concluiTarefa(req, res) {
        const { id } = req.params;

        Tarefa.concluiTarefa(id)
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
            })
    },

    // * Busca a lista de usuários que devem receber um e-mail sobre a alteração de uma tarefa:
    async getListaUsuariosGatilho(req, res) {
        const { id } = req.params;
        const usuario = req.body;

        Tarefa.getListaUsuariosGatilho(id, usuario.email, usuario.acao,
            usuario.nomeTarefa, usuario.nomeRespTarefa, usuario.comentario)
            .then(resposta => {
                console.log(resposta);

                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.usuarios);
                        break;

                    case 500:
                        res.status(500).json({ message: resposta.message });
                        break;
                }
            })
    },

    // * Retorna a qtd de tarefas de uma iteração
    async getTarefasByIteracao(req, res) {
        const { id } = req.params;

        Tarefa.getTarefasByIteracao(id)
            .then(resposta => {
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.tarefa);
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

}