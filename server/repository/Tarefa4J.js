/*
CLAUSULAS DE QUERY

INSERT: CREATE (:Usuario{id:1})
SELECT: MATCH (u:Usuario{id:1})
SELECT COM JOIN (SE NAO TIVER ELE CRIA, SE EXISTIR ELE RETORNA): 
    MATCH (p:Usuario{id:1})
    MATCH (l:Usuario{id:2})
    MERGE (p)-[:SEGUE]->(l)
    RETURN *

*/

const neo4jdb = require("../database/neo4j");

class Tarefa4JRepository {
  // Validado
  static async create(id) {
    const session = neo4jdb.session();
    let result = await session.run(`MERGE (t:Tarefa{id:${id}}) RETURN t`); // MERGE: cria se não existir, se existir retorna
    await session.close();

    return result.records.length > 0 ? result.records[0].get("t") : false;
  }

  // Validado
  static async get(id) {
    const session = neo4jdb.session();
    const result = await session.run(`MATCH (t:Tarefa{id:${id}}) RETURN t`);
    await session.close();

    return result.records.length > 0 ? result.records[0].get("t") : false;
  }

  // Validado
  static async delete(id) {
    const session = neo4jdb.session();

    const result = await session.run(`MATCH (t:Tarefa{id:${id}})
    WITH t, t.id AS tarefaId
    DELETE t
    RETURN tarefaId`); // WITH: passa o resultado da query anterior para a próxima

    await session.close();

    return result.records.length > 0 ? result.records[0] : false;
  }

  static async seguirTarefa(idUsuario, idTarefa) {
    const session = neo4jdb.session();
    const result = await session.run(`MATCH (u:Usuario{id:${idUsuario}})
    MATCH (t:Tarefa{id:${idTarefa}})
    MERGE (u)-[:SEGUE]->(t)
    RETURN *`);
    await session.close();

    return result.records.length > 0; // Se for retornado registros, a operação foi bem sucedida
  }

  static async pararDeSeguirTarefa(idUsuario, idTarefa) {
    const session = neo4jdb.session();

    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[s:SEGUE]->(t:Tarefa{id:${idTarefa}})
    WITH s, s.id AS relacaoId
    DELETE s
    RETURN relacaoId`); // WITH: passa o resultado da query anterior para a próxima

    await session.close();

    return result.records.length > 0 ? result.records[0] : false;
  }

  static async getTarefasSeguidasUsuario(idUsuario) {
    const session = neo4jdb.session();
    const seguidas = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[:SEGUE]->(t:Tarefa)
      RETURN t`);
    await session.close();

    for (const tarefa of result.records) {
      seguidas.push(tarefa.get("t").properties.id.low);
    }

    return seguidas;
  }

  static async getUsuarioSeguidores(idTarefa) {
    const session = neo4jdb.session();
    const seguidores = [];
    const result =
      await session.run(`MATCH (u:Usuario)-[:SEGUE]->(t:Tarefa{id:${idTarefa}})
      RETURN u`);
    await session.close();

    for (const usuario of result.records) {
      seguidores.push(usuario.get("u").properties.id.low);
    }

    return seguidores;
  }

  static async isTarefaSeguidaPorUsuario(idUsuario, idTarefa) {
    const session = neo4jdb.session();
    const seguidas = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[:SEGUE]->(t:Tarefa{id:${idTarefa}})
      RETURN t`);
    await session.close();

    for (const tarefa of result.records) {
      seguidas.push(tarefa.get("t").properties.id.low);
    }

    return seguidas.length > 0;
  }
}

module.exports = Tarefa4JRepository;
