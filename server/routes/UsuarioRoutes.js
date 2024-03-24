// * Importando as bibliotecas
const { Router } = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const router = Router();

// Definindo as rotas do usuário

router.get('/api/usuarios', UsuarioController.getUsuarios); // Retorna todos os usuários
router.get('/api/usuarios-ativos', UsuarioController.getAtivos); // Retorna todos os usuários ativos
router.get('/api/usuarios/:email', UsuarioController.getUserByEmail); // Retorna um usuário específico
router.get('/api/usuarios/:email/times', UsuarioController.getUsersTimes); // Retorna os times de um usuário específico
router.put('/api/usuarios/:email', UsuarioController.updateUser); // Atualiza um usuário específico
router.put('/api/usuarios/:email/valida', UsuarioController.userLogin); // Cadastra um usuário
router.put('/api/usuarios/:email/status', UsuarioController.alteraStatus); // Altera status do usuário
router.post('/api/usuarios/:email/times', UsuarioController.addUserTeam); // Adiciona um usuário a um time
router.post('/api/usuarios', UsuarioController.addUser); // Cadastra um usuário
router.delete('/api/usuarios/:email', UsuarioController.deleteUser); // Deleta um usuário
router.put('/api/usuarios-adm/:email', UsuarioController.updateUserAdmin); // Atualiza um usuário específico
router.get('/api/usuarios/:id/seguindo/:emailSeguido', UsuarioController.isUsuarioSeguidoPorUsuario); //Vrf se um usuario segue outro
router.put('/api/usuarios/:email/usuario/seguir', UsuarioController.seguirUsuario); // Cadastra um usuário
router.put('/api/usuarios/:email/usuario/parar-seguir', UsuarioController.pararDeSeguirUsuario); // Altera status do usuário
router.get('/api/usuarios/:email/dashboard/:adm', UsuarioController.getDashboard); // Gera dashboard de um usuario
router.get('/api/usuarios/:email/seguidos', UsuarioController.getUsuariosSeguidos); // Busca usuarios seguidos

//Relacionadas a tarefa:
router.put('/api/usuarios/:email/tarefa/seguir', UsuarioController.seguirTarefa); // Cadastra um usuário
router.put('/api/usuarios/:email/tarefa/parar-seguir', UsuarioController.pararDeSeguirTarefa); // Altera status do usuário
router.get('/api/usuarios/:email/tarefa/seguidas', UsuarioController.getTarefasSeguidasUsuario); // Retorna um usuário específico

//Relacionados a projetos
router.get('/api/usuarios/:email/projetos', UsuarioController.getProjetosUsuario); // Busca projetos de um usuario

//Relacionado à avaliação:
router.get('/api/usuarios/:email/avaliacoes-recebidas', UsuarioController.getAvaliacoesParaUsuario); // Busca avaliações de um usuario (avaliado)
router.get('/api/usuarios/:email/avaliacoes-feitas', UsuarioController.getAvaliacoesDeUsuario); // Busca avaliações de um usuario (avaliador)
router.post('/api/usuarios/:email/avaliacoes', UsuarioController.avaliarUsuario); // Adiciona uma avaliação de um usuario

//Relacionado a entretenimento:
router.get('/api/usuarios/:email/entretenimento', UsuarioController.getEntretenimentoByEmail); // Busca avaliações de um usuario (avaliado)
router.put('/api/usuarios/:email/entretenimento', UsuarioController.vrfEntretenimento); // Busca avaliações de um usuario (avaliado)


module.exports = router;