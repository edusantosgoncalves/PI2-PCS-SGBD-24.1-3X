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

class Usuario4JRepository {
  // Validado
  static async create(id) {
    const session = neo4jdb.session();
    let result = await session.run(`MERGE (u:Usuario{id:${id}}) RETURN u`); // MERGE: cria se não existir, se existir retorna
    await session.close();

    return result.records.length > 0 ? result.records[0].get("u") : false;
  }

  // Validado
  static async get(id) {
    const session = neo4jdb.session();
    const result = await session.run(`MATCH (u:Usuario{id:${id}}) RETURN u`);
    await session.close();

    return result.records.length > 0 ? result.records[0].get("u") : false;
  }

  // Validado
  static async delete(id) {
    const session = neo4jdb.session();

    const result = await session.run(`MATCH (u:Usuario{id:${id}})
    WITH u, u.id AS usuarioId
    DELETE u
    RETURN usuarioId`); // WITH: passa o resultado da query anterior para a próxima

    await session.close();

    return result.records.length > 0 ? result.records[0] : false;
  }

  // Validado
  static async seguirUsuario(idUsuario, idUsuarioSeguido) {
    const session = neo4jdb.session();
    const result = await session.run(`MATCH (p:Usuario{id:${idUsuario}})
    MATCH (l:Usuario{id:${idUsuarioSeguido}})
    MERGE (p)-[:SEGUE]->(l)
    RETURN *`);
    await session.close();

    return result.records.length > 0; // Se for retornado registros, a operação foi bem sucedida
  }

  // Validado
  static async pararDeSeguirUsuario(idUsuario, idUsuarioSeguido) {
    const session = neo4jdb.session();

    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[s:SEGUE]->(u2:Usuario{id:${idUsuarioSeguido}})
    WITH s, s.id AS relacaoId
    DELETE s
    RETURN relacaoId`); // WITH: passa o resultado da query anterior para a próxima

    await session.close();

    return result.records.length > 0 ? result.records[0] : false;
  }

  // Validado
  static async avaliarUsuario(idUsuario, idUsuarioAvaliado, nota, comentario) {
    const session = neo4jdb.session();

    const result = await session.run(`MATCH (p:Usuario{id:${idUsuario}})
    MATCH (l:Usuario{id:${idUsuarioAvaliado}})
    MERGE (p)-[:AVALIA{nota:${nota}, comentario:"${comentario}"}]->(l)
    RETURN *`);

    await session.close();

    return result.records.length > 0; // Se for retornado registros, a operação foi bem sucedida
  }

  // Validado
  static async getAvaliacoesRecebidasUsuario(idUsuario) {
    const session = neo4jdb.session();
    const avaliacoes = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})<-[a:AVALIA]-(u2:Usuario)
    RETURN a, u2`);
    await session.close();

    for (const avaliacao of result.records) {
      avaliacoes.push({
        avaliacao: avaliacao.get("a").properties.nota.low,
        descricao: avaliacao.get("a").properties.comentario,
        usuario: avaliacao.get("u2").properties.id.low,
      });
    }

    return avaliacoes;
  }

  // Validado
  static async getAvaliacoesFeitasUsuario(idUsuario) {
    const session = neo4jdb.session();
    const avaliacoes = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[a:AVALIA]->(u2:Usuario)
      RETURN a, u2`);
    await session.close();

    for (const avaliacao of result.records) {
      avaliacoes.push({
        avaliacao: avaliacao.get("a").properties.nota.low,
        descricao: avaliacao.get("a").properties.comentario,
        usuario: avaliacao.get("u2").properties.id.low,
      });
    }

    return avaliacoes;
  }

  // Validado
  static async getSeguidoresUsuario(idUsuario) {
    const session = neo4jdb.session();
    const seguidores = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})<-[:SEGUE]-(u2:Usuario)
      RETURN u2`);
    await session.close();

    for (const avaliacao of result.records) {
      seguidores.push(avaliacao.get("u2").properties.id.low);
    }

    return seguidores;
  }

  // Validado
  static async getUsuariosSeguidos(idUsuario) {
    const session = neo4jdb.session();
    const seguidos = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[:SEGUE]->(u2:Usuario)
      RETURN u2`);
    await session.close();

    for (const avaliacao of result.records) {
      seguidos.push(avaliacao.get("u2").properties.id.low);
    }

    return seguidos;
  }

  // Validado
  static async isUsuarioSeguidoPorUsuario(idUsuario, idUsuarioSeguido) {
    const session = neo4jdb.session();
    const seguidos = [];
    const result =
      await session.run(`MATCH (u:Usuario{id:${idUsuario}})-[:SEGUE]->(u2:Usuario{id:${idUsuarioSeguido}})
      RETURN u, u2`);
    await session.close();

    for (const avaliacao of result.records) {
      seguidos.push(avaliacao.get("u2").properties.id.low);
    }

    return seguidos.length > 0;
  }
}

module.exports = Usuario4JRepository;
