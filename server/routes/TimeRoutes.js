// * Importando as bibliotecas
const { Router } = require('express');
const TimeController = require('../controllers/TimeController');
const router = Router();

// * Definindo as rotas do usuário
router.get('/api/times', TimeController.getTimes); // Retorna todos os times
router.get('/api/timesAtivos', TimeController.getTimesAtivos); // Retorna todos os times
router.get('/api/times/:id', TimeController.getTimeById); // Retorna um time específico
router.get('/api/time/:id', TimeController.getTimeById); // Retorna um time específico com todos os seus dados
router.post('/api/times/:id/usuarios', TimeController.addUsuarioTime); // Adiciona usuários a um time específico
router.put('/api/times/:id/projetos', TimeController.atualizaTimeProjeto); // Associa a um time específico a (um ou mais) projeto(s)
router.put('/api/times/:id/status', TimeController.atualizaStatusTime); // Atualiza o status de um time específico
router.put('/api/times/:id/nome', TimeController.updateNomeTime); // Atualiza o nome de um time específico
router.post('/api/times', TimeController.addTime); // Cadastra um time
router.delete('/api/times/:id', TimeController.inactivateTime); // Deleta um time
router.put('/api/times/:id/usuarioDelete', TimeController.deleteUsuarioTime); // Desassocia um usuário de um time
router.get('/api/times/:id/projetosAtivos', TimeController.getProjetosAtivosTime); // Retorna a qtd de projetos ativos de um time



module.exports = router;
