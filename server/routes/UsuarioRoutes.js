// * Importando as bibliotecas
const { Router } = require("express");
const UsuarioController = require("../controller/Usuario");
const router = Router();

// ! Definindo as rotas do usuário
router.get("/api/usuarios/:email/times", UsuarioController.getUsersTimes); // Retorna os times de um usuário específico
router.get(
  "/api/usuarios/:email/seguidos",
  UsuarioController.getUsuariosSeguidos
); // Busca usuarios seguidos

// ! Relacionadas a tarefa:
router.get(
  "/api/usuarios/:email/tarefa/seguidas",
  UsuarioController.getTarefasSeguidasUsuario
); // Retorna um usuário específico

// ! Relacionados a projetos
router.get(
  "/api/usuarios/:email/projetos",
  UsuarioController.getProjetosUsuario
); // Busca projetos de um usuario
module.exports = router;

// ! Relacionado à avaliação:
router.get(
  "/api/usuarios/:email/avaliacoes-recebidas",
  UsuarioController.getAvaliacoesParaUsuario
); // Busca avaliações de um usuario (avaliado)

router.get(
  "/api/usuarios/:email/avaliacoes-feitas",
  UsuarioController.getAvaliacoesDeUsuario
); // Busca avaliações de um usuario (avaliador)
