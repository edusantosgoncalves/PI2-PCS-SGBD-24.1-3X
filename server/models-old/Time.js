// * Importando as dependências
const { sql, poolPromise } = require('../database/db');

module.exports = {
    async get() {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .query("SELECT * FROM dbo.TIMES_QTDPESS_QTDPROJ ORDER BY ativo DESC");

            return data.recordset;
        }
        catch (err) {
            return err;
        }
    },

    async getAtivos() {
        try {
            let pool = await poolPromise;
            let data = await pool.request()
                .query("SELECT * FROM dbo.TIMES_QTDPESS_QTDPROJ WHERE ativo = 1 ORDER BY ativo DESC");

            return data.recordset;
        }
        catch (err) {
            return err;
        }
    },

    async getTimeById(id) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, id)
                .query("SELECT * FROM dbo.TIMES_QTDPESS_QTDPROJ WHERE codTime = @id")

            //Se não encontrar o time, retorne...
            if (data.recordset.length == 0)
                return { status: 404, message: "Time não encontrado" };

            let time = data.recordset[0];

            //Pegando os usuarios associados ao time
            let dataUsuarios = await pool.request()
                .input("id", sql.Numeric, id)
                .query("EXEC RetornaUsuariosDeUmTime @Time = @id");

            //Colocando os usuarios do time no JSON de time
            time.usuarios = dataUsuarios.recordset;

            //Pegando os projetos associados ao time
            let dataProjetos = await pool.request()
                .input("id", sql.Numeric, id)
                .query("EXEC RetornaProjetosDeUmTime @Time = @id");

            //Colocando os projetos do time no JSON de time
            time.projetos = dataProjetos.recordset;

            return { status: 200, time: time }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Cria um time
    async addTime(nome) {
        console.log(nome)
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("nm", sql.VarChar, nome)
                .query("INSERT INTO dbo.TIME (nome, ativo) VALUES (@nm, 1)");

            if (data.rowsAffected[0] == 0) {
                return { status: 402 };
            }

            let novoTime = await pool.request()
                .input("nm", sql.VarChar, nome)
                .query("SELECT codTime FROM dbo.TIME WHERE nome=@nm ORDER BY codTime DESC");

            if (novoTime.rowsAffected[0] == 0) {
                return { status: 402 };
            }
            else {
                return { status: 201, time: novoTime.recordset[0] };
            }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Adicionando usuários a um time
    async addUsuarioTime(codTime, listaUsuarios) {
        try {
            let pool = await poolPromise;

            //Se a lista estiver vazia, retorne com erro
            if (listaUsuarios.length < 1) {
                return { status: 402, message: "Sem usuários a adicionar!" };
            }

            //Inicializando string que vai conter cada insert
            let inserts = '';

            //A cada usuario na lista, insira na String insert
            for (let posicao in listaUsuarios) {
                inserts = inserts + ('(' + codTime + ', \'' + listaUsuarios[posicao].email + '\'),')
            }

            //Remova a última vírgula que sobrou no insert.
            inserts = inserts.slice(0, -1);

            console.log(inserts)
            //Faz a requisição pro banco
            let data = await pool.request()
                .query("INSERT INTO dbo.USUARIO_TIME (TIME_codTime, USUARIO_email) VALUES " + inserts.toString());

            //Se não adicionou nenhuma linha, retorne.
            if (data.rowsAffected[0] == 0)
                return { status: 402, message: "Não foi possível criar o time!!" };

            //Se a quantidade de adicionados for diferente da quantidade de usuarios no array, retorne erro também.
            else if (listaUsuarios.length != data.rowsAffected[0])
                return { status: 402, message: "Ocorreu um erro na associação de um ou mais times, alguns usuários podem não ter sido adicionados!" };

            //Se tiver inserido todos, retorne positivo!
            return { status: 201, message: "Usuarios adicionados!" };

        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Removendo usuário de time
    async deleteUsuarioTime(codTime, usuario) {
        try {
            let pool = await poolPromise

            //Faz a requisição pro banco
            let data = await pool.request()
                .input("cod", sql.Numeric, codTime)
                .input("usuario", sql.VarChar, usuario)
                .query("DELETE FROM dbo.USUARIO_TIME WHERE TIME_codTime=@cod AND USUARIO_email=@usuario");

            //Se não removeu, retorne negativo.
            if (data.rowsAffected[0] == 0)
                return { status: 402, message: "Usuário não encontrado" };

            //Se removeu, retorne positivo!
            return { status: 201, message: "Remoção com sucesso!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Associando projetos a um time
    async atualizaTimeProjeto(codTime, listaProj) {
        try {
            let pool = await poolPromise;

            //Se a lista estiver vazia, retorne com erro
            if (listaProj.length < 1) {
                return { status: 402, message: "Sem usuários a adicionar!" };
            }

            //Inicializando string que vai conter cada insert
            let inserts = '';

            //A cada projeto na lista, insira na String insert
            for (let posicao in listaProj) {
                inserts = inserts + (listaProj[posicao].codProjeto + ',')
            }

            //Remova a última vírgula que sobrou no insert.
            inserts = inserts.slice(0, -1);
            console.log(inserts)

            //Faz a requisição pro banco
            let data = await pool.request()
                .query("UPDATE dbo.PROJETO SET timeResponsavel = " + codTime + " WHERE codProjeto IN (" + inserts + ")");

            //Se não adicionou nenhuma linha, retorne.
            console.log(data.rowsAffected)
            if (data.rowsAffected[0] == 0) {
                return { status: 402, message: "Não foi possível associar o time a(os) projeto(s)!" };
            }
            //Se a quantidade de associados for diferente da quantidade de projetos no array, retorne erro também.
            else if (listaProj.length != data.rowsAffected[0]) {
                return { status: 402, message: "Ocorreu um erro na associação de um ou mais projetos!" };
            }
            //Se tiver associado todos, retorne positivo!
            return { status: 201, message: "Projetos alterados!" };
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Atualiza o status de um time
    async atualizaStatusTime(codTime, ativo) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codTime)
                .input("ativo", sql.Bit, ativo)
                .query("UPDATE dbo.TIME SET ativo=@ativo WHERE codTime=@id");

            if (data.rowsAffected[0] == 0) {
                return { status: 404, message: "Time não encontrado!" };
            }
            return { status: 201, message: "Status do time atualizado com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Atualiza nome de um time
    async updateNomeTime(codTime, nome) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codTime)
                .input("nm", sql.VarChar, nome)
                .query("UPDATE dbo.TIME SET nome=@nm WHERE codTime=@id");

            //Se não for encontrado o time com tal código...
            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Time não encontrado!" }

            //Se for, retorne positivo
            return { status: 201, message: "Time atualizado com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },

    // * Inativa um time
    async inactivateTime(codTime) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, codTime)
                .query("UPDATE dbo.TIME SET ativo=0 WHERE codTime=@id");

            if (data.rowsAffected[0] == 0)
                return { status: 404, message: "Time não encontrado!" };

            return { status: 201, message: "Time inativado com sucesso!" }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },


    async getProjetosAtivosTime(id) {
        try {
            let pool = await poolPromise
            let data = await pool.request()
                .input("id", sql.Numeric, id)
                .query("EXEC getQtdProjetosAtivosTime @Time = @id")

            //Se não encontrar o time, retorne...
            if (data.recordset.length == 0)
                return { status: 404, message: "Time não encontrado" };

            return { status: 200, qtd: data.recordset[0] }
        }
        catch (err) {
            return { status: 500, message: err.message };
        }
    },
};