// * Importando as bibliotecas
const { Router } = require("express");
const TarefaController = require("../controllers-old/TarefaController");
const router = Router();

// * Definindo as rotas do usuário
router.get("/api/tarefas", TarefaController.getTarefas); // ! Retorna todas as tarefas
router.get("/api/tarefas/:id", TarefaController.getTarefaById); // ! Retorna uma tarefa específica
router.put("/api/tarefas/:id", TarefaController.updateTarefa); // ! Atualiza uma tarefa específica
router.post("/api/tarefas", TarefaController.addTarefa); // ! Cadastra uma tarefa
//router.delete('/api/tarefas/:id', TarefaController.inactivateTarefa); // Deleta uma tarefa
router.delete("/api/tarefas/:id", TarefaController.concluiTarefa); // Conclui uma tarefa

// * Definindo rotas da view das tarefas
router.put(
  "/api/tarefas-view/usuario",
  TarefaController.getTarefasViewByUsuario
); // !  Retorna todas as tarefas de um usuario
router.put(
  "/api/tarefas/:id/seguida",
  TarefaController.isTarefaSeguidaPorUsuario
); // ! Verifica se uma tarefa é seguida por um usuario
router.put(
  "/api/tarefas/:id/comentarios",
  TarefaController.getComentariosPorTarefa
); // ! Obtem os comentarios de uma tarefa
router.put(
  "/api/tarefas/:id/seguidores",
  TarefaController.getListaUsuariosGatilho
); // ! Envia e-mail sobre o status da tarefa para os seguidores da tarefa e os seguidores do usuário responsável pela tarefa (recebido pelo endpoint)
router.put("/api/tarefas/:id/addcomentario", TarefaController.addComentario); // ! Adiciona um comentário a tarefa
router.get("/api/tarefas-itera/:id", TarefaController.getTarefasByIteracao); // ! Retorna a qtd de tarefas de uma iteração

module.exports = router;
