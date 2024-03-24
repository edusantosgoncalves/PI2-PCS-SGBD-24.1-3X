// * Importando as bibliotecas
const { Router } = require('express');
const projetoController = require('../controllers/ProjetoController');
const router = Router();

// * Definindo as rotas do usuário
router.get('/api/projetos', projetoController.getProjetos); // Retorna todos os projetos
router.get('/api/projetos/:id', projetoController.getProjetoById); // Retorna um projeto específico
router.put('/api/projetos/:id', projetoController.updateProjeto); // Atualiza um projeto específico
router.put('/api/projetos/:id/time', projetoController.addProjetoTime); // Troca o time de um Projeto
router.put('/api/projetos/:id/status', projetoController.atualizaStatusProjeto); // Atualiza o status de um projeto específico
router.post('/api/projetos', projetoController.addProjeto); // Cadastra um projeto
router.delete('/api/projetos/:id', projetoController.inactivateProjeto); // Deleta um projeto
router.delete('/api/projetos/:id/conclui', projetoController.concluiProjeto); // Deleta um projeto

router.get('/api/projetos/:id/usuarios', projetoController.getUsuariosProjetos); // Retorna usuários associados a um projeto
router.get('/api/projetos/:id/iteracoes', projetoController.getIteracoesProjetos); // Retorna iterações de um projeto
router.get('/api/projetos/:id/tarefas', projetoController.getTarefasProjetos); // Retorna tarefas de um projeto
router.put('/api/projetos/:id/validaNome', projetoController.validaNomeProjeto); // Valida se o nome de um Projeto é possível
router.get('/api/projetos/:id/descricao', projetoController.getDescricaoProjeto); // Retorna iterações de um projeto
router.get('/api/projetos/:id/iteracao/', projetoController.getIteracao); // Retorna uma iteração
router.post('/api/projetos/:id/iteracao', projetoController.addIteracao); // Altera uma iteração
router.put('/api/projetos/:id/iteracao', projetoController.alteraIteracao); // Altera uma iteração
router.delete('/api/projetos/:id/iteracao', projetoController.removeIteracao); // Retorna iterações de um projeto
router.get('/api/projetos/:id/qtdtarefas', projetoController.getTarefasByProjeto); // Retorna iterações de um projeto
router.get('/api/projetos/:id/tarefasAtivas', projetoController.getTarefasAtivasProjeto); // Retorna qtd de tarefas ativas de um projeto específico

module.exports = router;