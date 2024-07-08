// ! Ajusta as chaves primárias das tabelas associativas
async function Views(sequelize) {
  // * VIEW PARA A PÁGINA DE TIMES
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TIMES_QTDPESS_QTDPROJ
      AS
      SELECT ut2."idTime"         AS "codTime",
       ut2.nome,
       ut2.dtcriacao        AS "dtCriacao",
       ut2.ativo,
       ut2.qtdpess          AS "qtdPess",
       count(p."idProjeto") AS "qtdProj"
        FROM "3x".projeto p
                RIGHT JOIN (SELECT t."idTime",
                                    t.nome,
                                    t."createdAt"         AS dtcriacao,
                                    t.ativo,
                                    count(ut."idUsuario") AS qtdpess
                            FROM "3x"."time" t
                                      LEFT JOIN "3x".usuario_time ut ON t."idTime" = ut."idTime"
                            GROUP BY t."idTime", t.nome, t."createdAt", t.ativo) ut2 ON p."idTime" = ut2."idTime"
        GROUP BY ut2."idTime", ut2.nome, ut2.dtcriacao, ut2.ativo, ut2.qtdpess;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA A PÁGINA DE TAREFAS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS
        AS
        SELECT tui."idTarefa"   AS codtarefa,
          tui.nome,
          tui.descricao,
          tui.status,
          tui.projetotarefa,
          p.nome           AS nomeprojeto,
          tui."idIteracao" AS coditeracaofk,
          tui.nomeiteracao,
          tui."idUsuario"  AS usuarioresp,
          tui.nomeusuarioresp,
          tui.emailusuarioresp
          FROM "3x".projeto p
          RIGHT JOIN (SELECT tu."idTarefa",
                        tu.nome,
                        tu.descricao,
                        tu.status,
                        i."idProjeto" AS projetotarefa,
                        tu."idIteracao",
                        i.nome        AS nomeiteracao,
                        tu."idUsuario",
                        tu.nomeusuarioresp,
                        tu.emailusuarioresp
                  FROM "3x".iteracao i
                        RIGHT JOIN (SELECT t."idTarefa",
                                            t.nome,
                                            t.descricao,
                                            t.status,
                                            t."createdAt",
                                            t."updatedAt",
                                            t."idIteracao",
                                            t."idUsuario",
                                            u.nome  AS nomeusuarioresp,
                                            u.email AS emailusuarioresp
                                    FROM "3x".tarefa t
                                              LEFT JOIN "3x".usuario u ON t."idUsuario" = u."idUsuario") tu
                                    ON i."idIteracao" = tu."idIteracao") tui ON tui.projetotarefa = p."idProjeto";`
    );
  } catch (e) {
    console.log(e);
  }

  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".TAREFAS_ITERACAO_PROJETOS_USUARIOS_ATIVO
      AS
      SELECT tui.codtarefa,
       tui.nome,
       tui.descricao,
       tui.status,
       tui.projetotarefa,
       p.nome AS nomeprojeto,
       tui.coditeracaofk,
       tui.nomeiteracao,
       tui.usuarioresp,
       tui.nomeusuarioresp
         FROM "3x".projeto p
         RIGHT JOIN (SELECT tu."idTarefa"   AS codtarefa,
                            tu.nome,
                            tu.descricao,
                            tu.status,
                            i."idProjeto"   AS projetotarefa,
                            tu."idIteracao" AS coditeracaofk,
                            i.nome          AS nomeiteracao,
                            tu."idUsuario"  AS usuarioresp,
                            tu.nomeusuarioresp
                     FROM "3x".iteracao i
                              RIGHT JOIN (SELECT t."idTarefa",
                                                 t.nome,
                                                 t.descricao,
                                                 t.status,
                                                 t."createdAt",
                                                 t."updatedAt",
                                                 t."idIteracao",
                                                 t."idUsuario",
                                                 u.nome AS nomeusuarioresp
                                          FROM "3x".tarefa t
                                                   LEFT JOIN "3x".usuario u ON t."idIteracao" = u."idUsuario") tu
                                         ON i."idIteracao" = tu."idIteracao") tui ON tui.projetotarefa = p."idProjeto"
          WHERE p.ativo = true;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA A PÁGINA DE PROJETOS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".PROJETOSView AS
        SELECT ti.codprojeto,
        ti.nome,
        ti.descricao,
        to_char(ti."dtInicio", 'DD/MM/YYYY'::text)                 AS dtcriacao,
        ti."idTime"                                                AS timeresponsavel,
        ti.nometime,
        ti.ativo,
        to_char(ti."dtConclusao", 'DD/MM/YYYY'::text)              AS dtconclusao,
        to_char(ti.prazo, 'DD/MM/YYYY'::text)                      AS prazo,
        COALESCE((SELECT count(*) AS qtdtarefas
                  FROM "3x".tarefa t2
                            LEFT JOIN "3x".iteracao i ON t2."idIteracao" = i."idIteracao"
                  WHERE i."idProjeto" = ti.codprojeto), 0::bigint) AS qtdtarefas,
        COALESCE((SELECT count(*) AS qtdtarefasativas
                  FROM "3x".tarefa t3
                            LEFT JOIN "3x".iteracao i2 ON t3."idIteracao" = i2."idIteracao"
                  WHERE i2."idProjeto" = ti.codprojeto
                    AND t3.status = 1
                  GROUP BY i2."idProjeto"), 0::bigint)             AS qtdtarefasativas
      FROM (SELECT p."idProjeto"        AS codprojeto,
                  p.nome,
                  p."dtInicio",
                  p."idTime",
                  "time".nome          AS nometime,
                  p.ativo,
                  p."dtConclusao",
                  max(i."dtConclusao") AS prazo,
                  p.descricao
            FROM "3x".projeto p
                    JOIN "3x"."time" "time" ON p."idTime" = "time"."idTime"
                    LEFT JOIN "3x".iteracao i ON p."idProjeto" = i."idProjeto"
            GROUP BY p."idProjeto", p.nome, p."dtInicio", p."idTime", "time".nome, p.ativo, p."dtConclusao") ti;`
    );
  } catch (e) {
    console.log(e);
  }

  // * VIEW PARA USUARIOS X PROJETOS
  try {
    await sequelize.query(
      `CREATE OR REPLACE VIEW "3x".USUARIOS_PROJETOS AS
      SELECT p."idProjeto" AS "codProjeto",
       u."idUsuario",
       u.email,
       u.nome
      FROM "3x".projeto p
         LEFT JOIN "3x".usuario_time ut ON p."idTime" = ut."idTime"
         LEFT JOIN "3x".usuario u ON ut."idUsuario" = u."idUsuario";`
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = Views;
