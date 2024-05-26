// ! Ajusta as chaves primárias das tabelas associativas
async function Views(sequelize) {
  // * VIEW PARA A PÁGINA DE TIMES
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TIMES_QTDPESS_QTDPROJ
      AS
      SELECT ut2."idTime" as "codTime", ut2.nome,
             ut2."dtcriacao" as "dtCriacao", ut2.ativo,
             ut2.qtdPess as "qtdPess", count(p."idProjeto") as "qtdProj"
         FROM "3x".PROJETO p RIGHT JOIN
          (SELECT
          t."idTime", t.nome, t."createdAt" as dtCriacao, t.ativo, count(ut."idUsuario") as qtdPess
          FROM "3x".TIME t LEFT JOIN "3x".USUARIO_TIME ut
              ON t."idTime" = ut."idTime"
          GROUP BY t."idTime", t.nome, t."createdAt", t.ativo) AS ut2
      ON p."idTime" = ut2."idTime"
      GROUP BY ut2."idTime", ut2.nome, ut2.dtCriacao, ut2.ativo, ut2.qtdPess;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA A PÁGINA DE TAREFAS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS
    AS
    SELECT tui."idTarefa" as codTarefa, tui.nome, tui.descricao, tui.status, tui.projetoTarefa, p.nome AS nomeProjeto,
           tui."idIteracao" as codIteracaoFK, tui.nomeIteracao, tui."idUsuario" as usuarioResp, tui.nomeUsuarioResp
     FROM "3x".PROJETO p RIGHT JOIN
         (SELECT tu."idTarefa", tu.nome, tu.descricao, tu.status, i."idProjeto" AS projetoTarefa,
           tu."idIteracao", i.nome AS nomeIteracao, tu."idUsuario", tu.nomeUsuarioResp
           FROM "3x".ITERACAO i RIGHT JOIN
            (SELECT t.*, u.nome as nomeUsuarioResp
                FROM "3x".TAREFA t LEFT JOIN "3x".USUARIO u
                    ON t."idUsuario" = u."idUsuario"
            ) AS tu
        ON i."idIteracao" = tu."idIteracao") as tui
    ON tui.projetoTarefa = p."idProjeto";`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS_ATIVO
      AS
      SELECT tui.codTarefa, tui.nome, tui.descricao, tui.status, tui.projetoTarefa, p.nome AS nomeProjeto,
             tui.codIteracaoFK, tui.nomeIteracao, tui.usuarioResp, tui.nomeUsuarioResp
       FROM "3x".PROJETO p RIGHT JOIN
          (SELECT tu."idTarefa" as codTarefa, tu.nome, tu.descricao, tu.status, i."idProjeto" AS projetoTarefa,
             tu."idIteracao" as codIteracaoFK, i.nome AS nomeIteracao, tu."idUsuario" as usuarioResp, tu.nomeUsuarioResp
             FROM "3x".ITERACAO i RIGHT JOIN
              (SELECT t.*, u.nome as nomeUsuarioResp
                  FROM "3x".TAREFA t LEFT JOIN "3x".USUARIO u
                      ON t."idIteracao" = u."idUsuario"
              ) AS tu
              ON i."idIteracao" = tu."idIteracao") as tui
      ON tui.projetoTarefa = p."idProjeto"
      WHERE p.ativo = true;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA A PÁGINA DE PROJETOS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".PROJETOSView AS
      SELECT TI.codProjeto, TI.nome, TO_CHAR(TI."dtInicio", 'DD/MM/YYYY') as dtCriacao, TI."idTime" as timeResponsavel, TI.nomeTime,
             TI.ativo,TO_CHAR(TI."dtConclusao", 'DD/MM/YYYY') as dtConclusao, TO_CHAR(TI.Prazo, 'DD/MM/YYYY')as Prazo,
             coalesce((SELECT count(*) as qtdTarefas from "3x".TAREFA T2
                   LEFT JOIN "3x".ITERACAO i
                       on T2."idIteracao" = i."idIteracao"
                    WHERE i."idProjeto" = TI.codProjeto), 0) as qtdTarefas,
              /* count(TIII."idTarefa") as*/
          coalesce((SELECT count(*) as qtdTarefasAtivas from "3x".TAREFA T3
                   LEFT JOIN "3x".ITERACAO i2
                       on T3."idIteracao" = i2."idIteracao"
                   WHERE i2."idProjeto" = TI.codProjeto and T3.status = 1
                   group by i2."idProjeto"), 0) as qtdTarefasAtivas
      FROM
          (SELECT p."idProjeto" as codProjeto, p.nome, p."dtInicio", p."idTime", time.nome AS nomeTime,
             p.ativo, p."dtConclusao", MAX (I."dtConclusao") AS Prazo
          FROM "3x".PROJETO p JOIN "3x".TIME time
      ON p."idTime" = time."idTime"
          LEFT JOIN "3x".ITERACAO I on p."idProjeto" = I."idProjeto"
                 GROUP BY p."idProjeto", p.nome, p."dtInicio", p."idTime", time.nome,
             p.ativo, p."dtConclusao") TI;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA USUARIOS X PROJETOS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".USUARIOS_PROJETOS AS
      SELECT p."idProjeto" AS "codProjeto", u."idUsuario", u.email, u.nome
      FROM
          "3x".PROJETO p
          LEFT JOIN "3x".USUARIO_TIME ut ON p."idTime" = ut."idTime"
          LEFT JOIN "3x".usuario u ON ut."idUsuario" = u."idUsuario";`
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = Views;
