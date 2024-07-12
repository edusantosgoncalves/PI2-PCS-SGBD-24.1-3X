// ! Ajusta as chaves primárias das tabelas associativas
async function Functions(sequelize) {
  // * getTimesUsuario()
  try {
    await sequelize.query(
      `create function "3x".gettimesusuario("Usuario" integer)
    returns TABLE("codTime" integer, nome character varying, "dtCriacao" timestamp with time zone, ativo boolean, "qtdPess" bigint, "qtdProj" bigint)
    language plpgsql
    as
    $$
      begin
          return query SELECT T.* 
          FROM "3x".USUARIO_TIME ut JOIN "3x".times_qtdpess_qtdproj T
              ON ut."idTime" = T."codTime"
           WHERE ut."idUsuario" = "Usuario"
           ORDER BY (t.ativo is true) desc;
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * getProjetosUsuario()
  try {
    await sequelize.query(
      `create function "3x".getprojetosusuario("Usuario" integer)
    returns TABLE("codProjeto" integer, nome character varying, "dtCriacao" text, "timeResponsavel" integer, "nomeTime" character varying, "Prazo" text, ativo boolean, "dtConclusao" text, "qtdTarefas" bigint)
    language plpgsql
    as
    $$
      begin
          return query  SELECT p."idProjeto" as "codProjeto", p.nome,
                 TO_CHAR(p."dtInicio" AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') as "dtCriacao",
                 p."idTime" as "timeResponsavel", time.nome AS "nomeTime",
                 TO_CHAR(MAX (i."dtConclusao") AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') as "Prazo",
                 p.ativo,TO_CHAR(MAX (i."dtConclusao") AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') as "dtConclusao", count(T2."idTarefa") as "qtdTarefas"
              FROM "3x".PROJETO p
           JOIN 
           (SELECT t.* FROM "3x".USUARIO_TIME ut JOIN "3x".TIME t
               ON ut."idTime" = t."idTime" WHERE ut."idUsuario" = "Usuario") time
          ON p."idTime" = time."idTime"
              LEFT JOIN "3x".ITERACAO I on p."idProjeto" = I."idProjeto"
              LEFT JOIN "3x".TAREFA T2 on I."idProjeto" = T2."idIteracao" AND t2."idUsuario" = "Usuario"
          GROUP BY p."idProjeto", p.nome, p."dtInicio", p."idTime", time.nome,
                 p.ativo, p."dtConclusao"
          ORDER BY ativo DESC;
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * getDashboardAdmin()
  try {
    await sequelize.query(
      `create function "3x".getdashboardadmin("Usuario" integer)
    returns TABLE("qtdTimesUsuario" bigint, "qtdTimesSys" bigint, "qtdProjetosUsuario" bigint, "qtdProjetosSys" bigint, "qtdTarefas" bigint, "qtdTarefasSys" bigint, "qtdTarefasSemana" bigint, "qtdUsuarios" bigint)
    language plpgsql
    as
    $$
      begin
      RETURN QUERY (
          -- Times do usuario
      SELECT COUNT(*) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys", cast(null as bigint) as "qtdProjetosUsuario",
             cast(null as bigint) as "qtdProjetosSys", cast(null as bigint) as "qtdTarefas",
             cast(null as bigint) as "qtdTarefasSys", cast(null as bigint) as "qtdTarefasSemana",
             cast(null as bigint) as "qtdUsuarios"
          FROM "3x".USUARIO_TIME WHERE "idUsuario"="Usuario"
          UNION ALL
          -- Times ativos totais se for admin
      SELECT cast(null as bigint) as "qtdTimesUsuario", count(*) as "qtdTimesSys", cast(null as bigint) as "qtdProjetosUsuario",
             cast(null as bigint) as "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", cast(null as bigint) as "qtdTarefasSys",
          cast(null as bigint) as "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".TIME WHERE ativo=true
          UNION ALL
          -- Projetos do usuario
      SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
             COUNT(*) AS "qtdProjetosUsuario", cast(null as bigint) as "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", cast(null as bigint) as "qtdTarefasSys",
          cast(null as bigint) as "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".PROJETO p
         WHERE p."idTime" IN (SELECT ut."idTime" FROM "3x".USUARIO_TIME ut JOIN "3x".TIME T on ut."idTime" = T."idTime" WHERE ut."idUsuario"="Usuario" AND t.ativo=true)
           AND p.ativo=true
          UNION ALL
          -- Projetos totais se for admin
      SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
             cast(null as bigint) AS "qtdProjetosUsuario", COUNT(*) AS "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", cast(null as bigint) as "qtdTarefasSys",
          cast(null as bigint) as "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".PROJETO p
          WHERE ativo=true
          UNION ALL
          -- TAREFAS do usuario
      SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
             cast(null as bigint) AS "qtdProjetosUsuario", cast(null as bigint) AS "qtdProjetosSys",
          COUNT(*) AS "qtdTarefas", cast(null as bigint) as "qtdTarefasSys",
          cast(null as bigint) as "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".TAREFA
          WHERE status=1 AND "idUsuario"="Usuario"
          UNION ALL
          -- TAREFAS ativas totais
      SELECT  cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
              cast(null as bigint) AS "qtdProjetosUsuario", cast(null as bigint) AS "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", COUNT(*) AS "qtdTarefasSys",
          cast(null as bigint) as "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".TAREFA
          WHERE status=1
          UNION ALL
          -- TAREFAS em até 1 semana do usuario
      SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
             cast(null as bigint) AS "qtdProjetosUsuario", cast(null as bigint) AS "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", cast(null as bigint) AS "qtdTarefasSys",
          COUNT(*) AS "qtdTarefasSemana", cast(null as bigint) as "qtdUsuarios"
          FROM "3x".TAREFA t JOIN "3x".ITERACAO i ON t."idIteracao"= i."idIteracao"
          WHERE status=1 AND t."idUsuario"="Usuario"
            AND DATE_PART('Day', NOW() - i."dtConclusao") BETWEEN 0 AND 7
              -- DATEDIFF(day, GETUTCDATE(), i.dtFim) BETWEEN 0 AND 7
          UNION ALL
      SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) as "qtdTimesSys",
             cast(null as bigint) AS "qtdProjetosUsuario", cast(null as bigint) AS "qtdProjetosSys",
          cast(null as bigint) as "qtdTarefas", cast(null as bigint) AS "qtdTarefasSys",
          cast(null as bigint) AS "qtdTarefasSemana",  COUNT(*) as "qtdUsuarios"
          FROM "3x".USUARIO
          WHERE status between 1 AND 4);
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * getDashboard()
  try {
    await sequelize.query(
      `create function "3x".getdashboard("Usuario" integer)
    returns TABLE("qtdTimesUsuario" bigint, "qtdProjetosUsuario" bigint, "qtdTarefas" bigint, "qtdTarefasSemana" bigint)
    language plpgsql
    as
    $$
  begin
  RETURN QUERY (
      -- Times do usuario
  SELECT COUNT(*) as "qtdTimesUsuario", cast(null as bigint) as "qtdProjetosUsuario",
         cast(null as bigint) as "qtdTarefas", cast(null as bigint) as "qtdTarefasSemana"
      FROM "3x".USUARIO_TIME WHERE "idUsuario"="Usuario"
      UNION ALL
      -- Projetos do usuario
  SELECT cast(null as bigint) as "qtdTimesUsuario", COUNT(*) AS "qtdProjetosUsuario",
         cast(null as bigint) as "qtdTarefas", cast(null as bigint) as "qtdTarefasSemana"
      FROM "3x".PROJETO p
     WHERE p."idTime" IN (SELECT ut."idTime" FROM "3x".USUARIO_TIME ut JOIN "3x".TIME T on ut."idTime" = T."idTime" WHERE ut."idUsuario"="Usuario" AND t.ativo=true)
       AND p.ativo=true
      UNION ALL
      -- TAREFAS do usuario
  SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) AS "qtdProjetosUsuario",
         COUNT(*) AS "qtdTarefas", cast(null as bigint) as "qtdTarefasSemana"
      FROM "3x".TAREFA
      WHERE status=1 AND "idUsuario"="Usuario"
      UNION ALL
      -- TAREFAS em até 1 semana do usuario
  SELECT cast(null as bigint) as "qtdTimesUsuario", cast(null as bigint) AS "qtdProjetosUsuario",
      cast(null as bigint) as "qtdTarefas", COUNT(*) AS "qtdTarefasSemana"
      FROM "3x".TAREFA t JOIN "3x".ITERACAO i ON t."idIteracao"= i."idIteracao"
      WHERE status=1 AND t."idUsuario"="Usuario"
        AND DATE_PART('Day', NOW() - i."dtConclusao") BETWEEN 0 AND 7);
  end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * RetornaUsuariosDeUmTime()
  try {
    await sequelize.query(
      `create function "3x".retornausuariosdeumtime("Time" integer)
    returns TABLE(email character varying, nome character varying)
    language plpgsql
    as
    $$
      begin
          return query  SELECT u.email, u.nome
          FROM "3x".USUARIO u JOIN "3x".USUARIO_TIME ut
          ON u."idUsuario" = ut."idUsuario"
          WHERE ut."idTime" = "Time";
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * RetornaProjetosDeUmTime()
  try {
    await sequelize.query(
      `create function "3x".retornaprojetosdeumtime("Time" integer)
    returns TABLE("codProjeto" integer, nome character varying)
    language plpgsql
    as
    $$
      begin
          return query SELECT p."idProjeto" as "codProjeto", p.nome
          FROM "3x".PROJETO p
          WHERE  p."idTime" = "Time";
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * getIteracoesProjetos()
  try {
    await sequelize.query(
      `create function "3x".getiteracoesprojetos("Projeto" integer)
    returns TABLE("codIteracao" integer, nome character varying, descricao text, "dtInicio" text, "dtConclusao" text, "codProjetoFK" integer)
    language plpgsql
    as
    $$
      begin
          return query SELECT i."idIteracao" as "codIteracao", i.nome,i.descricao,
                 TO_CHAR(i."dtInicio" AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') AS "dtInicio",
                 TO_CHAR(i."dtConclusao" AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') AS "dtConclusao",
                 i."idProjeto" as "codProjetoFK"
          FROM "3x".ITERACAO i
                   WHERE i."idProjeto"="Projeto" AND i."dtConclusao"
                       IS NOT NULL AND i."dtInicio" IS NOT NULL
          UNION ALL
          SELECT i."idIteracao" as "codIteracao", i.nome, i.descricao,
                 (SELECT TO_CHAR(MIN(i1."dtInicio") AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') as dtInicio
                  FROM "3x".ITERACAO i1
                  WHERE "idProjeto"="Projeto"
                  GROUP BY "idProjeto") as "dtInicio",
                 (SELECT
                      TO_CHAR(MAX(i2."dtConclusao") AT TIME ZONE 'UTC-3', 'dd/mm/yyyy') as dtFim
                  FROM "3x".ITERACAO i2
                  WHERE "idProjeto"="Projeto"
                  GROUP BY "idProjeto") as "dtConclusao",
              i."idProjeto" as "codProjetoFK"
          FROM "3x".ITERACAO i
               WHERE i."idProjeto"="Projeto" AND i."dtConclusao" IS NULL
                  AND i."dtInicio" IS NULL;
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }

  // * getTarefasProjeto()
  try {
    await sequelize.query(
      `create function "3x".gettarefasprojeto("Projeto" integer)
    returns TABLE("codTarefa" integer, nome character varying, descricao text, status integer)
    language plpgsql
    as
    $$
      begin
          return query SELECT t."idTarefa" as codTarefa, t.nome,
                              t.descricao, t.status
          FROM "3x".PROJETO p JOIN "3x".ITERACAO I
              ON p."idProjeto" = I."idProjeto"
              JOIN "3x".TAREFA T on I."idIteracao" = T."idIteracao"
          WHERE p."idProjeto" = "Projeto";
      end;$$;`
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = Functions;
