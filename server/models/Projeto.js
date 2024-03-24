// * Importando as dependências
const { sql, poolPromise } = require('../database/db');

module.exports = {
    async get() {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .query("SELECT * FROM dbo.PROJETOSView ORDER BY ativo DESC");

            return data.recordset;
        }
        catch (err) {
            return err;
        }
    },

    // * Retorna um projeto
    async getProjetoById(codProj) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("SELECT * FROM dbo.PROJETOSView WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado" };

            return { status: 200, projeto: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Atualiza um projeto
    async updateProjeto(codProj, nome, descricao, timeResponsavel, ativo) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .input("nm", sql.VarChar, nome)
                .input("de", sql.VarChar, descricao)
                .input("ti", sql.Numeric, timeResponsavel)
                .input("at", sql.Bit, ativo)
                .query("UPDATE dbo.PROJETO SET nome=@nm, descricao=@de, timeResponsavel=@ti, ativo=@at WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado" };

            return { status: 200, message: "Projeto atualizado com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Cria um projeto
    async addProjeto(nome, descricao, timeResponsavel, listaIteracoes) {
        let dataAtual = new Date();
        console.log(listaIteracoes)
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("nm", sql.VarChar, nome)
                .input("de", sql.VarChar, descricao)
                .input("ti", sql.Numeric, timeResponsavel)
                .input("dt", sql.Date, dataAtual)
                .query("INSERT INTO dbo.PROJETO (nome, descricao, timeResponsavel, dtCriacao, ativo) VALUES (@nm, @de, @ti, @dt, 1)");

            if (data.rowsAffected[0] == 0)
                return { status: 402, message: "Não foi possível cadastrar o projeto!" };

            // ! Caso a criação tenha sido feita, retorne-o.
            let data2 = await pool.request()
                .input("nm", sql.VarChar, nome)
                .input("ti", sql.Numeric, timeResponsavel)
                .input("dt", sql.Date, dataAtual)
                .query("SELECT codProjeto FROM dbo.PROJETO WHERE nome=@nm AND timeResponsavel=@ti AND dtCriacao=@dt AND ativo = 1 ORDER BY codProjeto DESC");

            console.log(data2.recordset[0]); // TESTE

            // ! Instânciando código do Projeto em uma variável
            const codProjeto = data2.recordset[0].codProjeto;

            // ! Inicializando contador de iterações criadas
            let qtdIteracoesCriadas = 0;

            // ! Associando uma iteração dummy (dinâmica) ao projeto criado
            let data3 = await pool.request()
                .input("nm", sql.VarChar, "ITERAÇÃO - " + nome.toUpperCase())
                .input("de", sql.VarChar, "ITERAÇÃO GERAL DO PROJETO " + nome.toUpperCase())
                .input("codP", sql.Numeric, codProjeto)
                .query("INSERT INTO dbo.ITERACAO (nome, descricao, codProjetoFK) VALUES (@nm, @de, @codP)");

            // ! Associando as iterações com o codProjeto criado...
            for (let i = 0; i < listaIteracoes.length; i++) {
                let iteracao = listaIteracoes[i];

                data3 = await pool.request()
                    .input("nm", sql.VarChar, iteracao.nome)
                    .input("desc", sql.VarChar, iteracao.descricao)
                    .input("dtI", sql.Date, iteracao.dtInicio)
                    .input("dtF", sql.Date, iteracao.dtFim)
                    .input("codP", sql.Numeric, codProjeto)
                    .query("INSERT INTO dbo.ITERACAO (nome, descricao, dtInicio, dtFim, codProjetoFK) VALUES (@nm, @desc, @dtI, @dtF, @codP)");

                //Temporario (analisar a view dps)
                if (data3.rowsAffected[0] != 0) {
                    qtdIteracoesCriadas += 1;
                }
            }

            return {
                status: 201,
                message: "Projeto cadastrado com sucesso!",
                qtdIteracoesRecebidas: listaIteracoes.length,
                qtdIteracoesCriadas: qtdIteracoesCriadas
            };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Inativa um projeto
    async inactivateProjeto(codProj) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("UPDATE dbo.PROJETO SET ativo = 0 WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 402, message: "Não foi possível inativar o projeto!" };

            return { status: 200, message: "Projeto inativado com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Adiciona um projeto a um time
    async addProjetoTime(codProj, time) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .input("ti", sql.Numeric, time)
                .query("UPDATE dbo.PROJETO SET timeResponsavel=@ti WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado!" };

            return { status: 201, message: "Time adicionado ao projeto com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna todos os usuários de um projeto
    async getUsuariosProjetos(codProj) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("EXEC getUsuariosProjeto @Projeto=@id");

            return { status: 200, usuarios: data.recordset }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna todas as iterações de um projeto
    async getIteracoesProjetos(codProj) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("EXEC getIteracoesProjetos @Projeto=@id");

            return { status: 200, iteracoes: data.recordset }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna todas as tarefas de um projeto
    async getTarefasProjetos(codProj) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("EXEC getTarefasProjeto @Projeto=@id");

            return { status: 200, tarefas: data.recordset }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Atualiza o status de um time
    async atualizaStatusProjeto(codProj, ativo) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .input("ativo", sql.Bit, ativo)
                .query("UPDATE dbo.PROJETO SET ativo=@ativo WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado!" };

            return { status: 201, message: "Status do projeto atualizado com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    async validaNomeProjeto(nome) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("nm", sql.VarChar, nome)
                .query("EXEC validarNomeProjeto @nomeProjeto=@nm");

            if (data.rowsAffected > 0) {
                return { status: 200, valido: false };
            }
            else {
                return { status: 200, valido: true };
            }

        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna a descrição de um projeto
    async getDescricaoProjeto(codProj) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("EXEC getDescricaoProjeto @Projeto=@id");

            return { status: 200, descricao: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna uma iteração pelo id
    async getIteracao(codItera) {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .input("id", sql.Numeric, codItera)
                .query("SELECT * from dbo.ITERACAO where codIteracao=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Iteração não encontrada!" };

            return { status: 200, iteracao: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Altera uma iteração
    async addIteracao(codProjeto, nome, descricao, dtInicio, dtFim) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProjeto)
                .input("nome", sql.VarChar, nome)
                .input("descricao", sql.VarChar, descricao)
                .input("dtInicio", sql.Date, dtInicio)
                .input("dtFim", sql.Date, dtFim)
                .query("INSERT INTO dbo.ITERACAO (codProjetoFK, nome, descricao, dtInicio, dtFim) VALUES(@id, @nome, @descricao, @dtInicio, @dtFim)");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Iteração não adicionada!" };

            return { status: 201, message: "Iteração adicionada com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Altera uma iteração
    async alteraIteracao(codItera, nome, descricao, dtInicio, dtFim) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codItera)
                .input("nome", sql.VarChar, nome)
                .input("descricao", sql.VarChar, descricao)
                .input("dtInicio", sql.Date, dtInicio)
                .input("dtFim", sql.Date, dtFim)
                .query("UPDATE dbo.ITERACAO SET nome=@nome, descricao=@descricao, dtInicio=@dtInicio, dtFim=@dtFim WHERE codIteracao=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Iteração não encontrada!" };

            return { status: 201, message: "Iteração alterada com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Remove uma iteração
    async removeIteracao(codItera) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codItera)
                .query("DELETE FROM dbo.ITERACAO WHERE codIteracao=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Iteração não encontrada!" };

            return { status: 201, message: "Iteração removida com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },


    // * Retorna a qtd de tarefas por Projeto
    async getTarefasByProjeto(codProjeto) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProjeto)
                .query("EXEC getQtdTarefasByProjeto @codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado" };

            return { status: 200, tarefa: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Retorna a qtd de tarefas ativas de um projeto
    async getTarefasAtivasProjeto(codProj) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("EXEC getQtdTarefasAtivasProjeto @Projeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Projeto não encontrado" };

            return { status: 200, qtd: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Conclui um projeto
    async concluiProjeto(codProj) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codProj)
                .query("UPDATE dbo.PROJETO SET dtConclusao = getutcdate() WHERE codProjeto=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 402, message: "Não foi possível concluir o projeto!" };

            return { status: 200, message: "Projeto concluído com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },
};