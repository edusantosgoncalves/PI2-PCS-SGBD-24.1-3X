// * Importando as bibliotecas
const { Router } = require('express');
const APIsController = require('../controllers/APIsController');
const router = Router();


// * Definindo as rotas do usuário
router.get('/api/tmdb/:nome', APIsController.buscaMovieDB); // Retorna audiovisual pelo TMDB
router.get('/api/tmdb-recupera/:id/:tipo', APIsController.recuperaMovieDB); // Retorna audiovisual pelo TMDB
router.get('/api/spotify/:nome', APIsController.buscaSpotify)// Retorna busca pelo Spotify
router.get('/api/spotify-recupera/:uri', APIsController.recuperaSpotify)// Retorna busca pelo Spotify

module.exports = router;