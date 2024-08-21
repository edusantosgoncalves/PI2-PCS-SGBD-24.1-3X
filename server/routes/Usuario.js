// * Importando as bibliotecas
const { Router } = require("express");
const UsuarioController = require("../controller/Usuario");
const router = Router();

/*
! Detalhe dos comentários:
. -> Validado
* -> Não validado
*/

// ! Definindo as rotas do usuário
router.get("/api/usuarios", UsuarioController.getUsuarios); // . Retorna todos os usuários
router.get("/api/usuarios-ativos", UsuarioController.getAtivos); // . Retorna todos os usuários ativos
router.get("/api/usuarios/:email", UsuarioController.getUserByEmail); // . Retorna um usuário específico
router.put("/api/usuarios/:email", UsuarioController.updateUser); // . Atualiza um usuário específico
router.get("/api/usuarios/:email/times", UsuarioController.getUsersTimes); // . Retorna os times de um usuário específico
router.put("/api/usuarios/:email/valida", UsuarioController.userLogin); // . Autentica usuário
router.put("/api/usuarios/:email/status", UsuarioController.alteraStatus); // . Altera status do usuário
router.post("/api/usuarios/:email/times", UsuarioController.addUserTeam); // . Adiciona um usuário a um time
router.get(
  "/api/usuarios/:email/dashboard/:adm",
  UsuarioController.getDashboard
); // . Gera dashboard de um usuario (:adm - 1 -> true / 0 -> false)

// ! Funcoes de admin
router.post("/api/usuarios", UsuarioController.addUser); // . Cadastra um usuário
router.delete("/api/usuarios/:email", UsuarioController.deleteUser); // . Deleta um usuário
router.put("/api/usuarios-adm/:email", UsuarioController.updateUserAdmin); // . Atualiza um usuário específico

// ! Relacionados a seguir
router.get(
  "/api/usuarios/:email/seguidos",
  UsuarioController.getUsuariosSeguidos
); // . Busca usuarios seguidos
router.get(
  "/api/usuarios/:email/seguindo/:emailSeguido",
  UsuarioController.isUsuarioSeguidoPorUsuario
); // . Verifica se um usuario segue outro
router.put(
  "/api/usuarios/:email/usuario/seguir",
  UsuarioController.seguirUsuario
); // . Seguir usuario
router.put(
  "/api/usuarios/:email/usuario/parar-seguir",
  UsuarioController.pararDeSeguirUsuario
); // . Parar de seguir usuario

// ! Relacionadas a tarefa:
router.get(
  "/api/usuarios/:email/tarefa/seguidas",
  UsuarioController.getTarefasSeguidasUsuario
); // . Retorna as tarefas seguidas por um usuario
router.put(
  "/api/usuarios/:email/tarefa/seguir",
  UsuarioController.seguirTarefa
); // . Seguir tarefa
router.put(
  "/api/usuarios/:email/tarefa/parar-seguir",
  UsuarioController.pararDeSeguirTarefa
); // . Parar de seguir tarefa

// ! Relacionados a projetos
router.get(
  "/api/usuarios/:email/projetos",
  UsuarioController.getProjetosUsuario
); // . Busca projetos de um usuario

// ! Relacionado à avaliação:
router.post(
  "/api/usuarios/:email/avaliacoes",
  UsuarioController.avaliarUsuario
); // . Avalia um usuario

router.get(
  "/api/usuarios/:email/avaliacoes-recebidas",
  UsuarioController.getAvaliacoesParaUsuario
); // . Busca avaliações de um usuario (avaliado)

router.get(
  "/api/usuarios/:id/avaliacoes-feitas",
  UsuarioController.getAvaliacoesDeUsuario
); // . Busca avaliações de um usuario (avaliador)

module.exports = router;
