// ! REQUIRE MODEL
const Time = require('../models/Time.js');

// * Cria a classe de CRUD de Times 
module.exports = {

    // * Retorna todos os times
    async getTimes(req, res) {
        Time.get()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna todos os times ativos
    async getTimesAtivos(req, res) {
        Time.getAtivos()
            .then(resposta => {
                console.log(resposta);
                if ('code' in resposta) {
                    res.status(400).json(resposta);
                }

                res.status(200).json(resposta);
            })
    },

    // * Retorna um time
    async getTimeById(req, res) {
        const { id } = req.params;

        Time.getTimeById(id)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.time);
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

    // * Cria um time
    async addTime(req, res) {
        const time = req.body;

        Time.addTime(time.nome)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 201:
                        res.status(201).json(resposta.time.codTime);
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

    // * Adicionando usuários a um time
    async addUsuarioTime(req, res) {
        const { id } = req.params;
        const time = req.body;

        Time.addUsuarioTime(id, time.listaUsuarios)
            .then(resposta => {
                console.log(resposta);
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

    async deleteUsuarioTime(req, res) {
        const { id } = req.params;
        const time = req.body;
        console.log(time);

        Time.deleteUsuarioTime(id, time.usuario)
            .then(resposta => {
                console.log(resposta);
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

    // * Associando projetos a um time
    async atualizaTimeProjeto(req, res) {
        const { id } = req.params;
        const time = req.body;

        Time.atualizaTimeProjeto(id, time.listaProjetos)
            .then(resposta => {
                console.log(resposta);
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

    // * Atualiza o status de um time
    async atualizaStatusTime(req, res) {
        const { id } = req.params;
        const { ativo } = req.body;

        Time.atualizaStatusTime(id, ativo)
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

    // * Atualiza nome de um time
    async updateNomeTime(req, res) {
        const { id } = req.params;
        const time = req.body;

        Time.updateNomeTime(id, time.nome)
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

    // * Inativa um time
    async inactivateTime(req, res) {
        const { id } = req.params;

        Time.inactivateTime(id)
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
            })
    },


    // * Retorna qtd de Projetos ativos de um time
    async getProjetosAtivosTime(req, res) {
        const { id } = req.params;

        Time.getProjetosAtivosTime(id)
            .then(resposta => {
                console.log(resposta);
                switch (resposta.status) {
                    case 200:
                        res.status(200).json(resposta.qtd);
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

}