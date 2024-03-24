// ! REQUIRE ENV
require("dotenv").config();

const Axios = require("axios");
let SpotifyWebApi = require("spotify-web-api-node");

let spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
});

// * Cria a classe de APIs
module.exports = {
  // * Busca músicas e albuns no Spotify
  async buscaSpotify(req, res) {
    const { nome } = req.params;

    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        spotifyApi.setAccessToken(data.body["access_token"]);

        spotifyApi
          .search(nome.toString(), ["album", "track"], { limit: 5 })
          .then(
            function (data) {
              res.status(200).json(data.body);
            },
            function (err) {
              console.log(err);
              res.status(404).json({ err: err });
            }
          );
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err
        );
        res
          .status(500)
          .json({ err: "Houve um erro ao obter o token de acesso" });
      }
    );
  },

  // * Recupera músicas ou albuns no Spotify
  async recuperaSpotify(req, res) {
    const { uri } = req.params;

    let vrfUri = uri.toString().split(":");
    const tipo = vrfUri[1];
    const id = vrfUri[2];

    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        spotifyApi.setAccessToken(data.body["access_token"]);

        if (tipo.toString() === "album") {
          spotifyApi.getAlbum(id).then(
            function (data) {
              res.status(200).json(data.body);
            },
            function (err) {
              console.log(err);
              res.status(404).json({ err: err });
            }
          );
        } else {
          spotifyApi.getTrack(uri.toString()).then(
            function (data) {
              res.status(200).json(data.body);
            },
            function (err) {
              console.log(err);
              res.status(404).json({ err: err });
            }
          );
        }
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err
        );
        res
          .status(500)
          .json({ err: "Houve um erro ao obter o token de acesso" });
      }
    );
  },

  // * Busca audiovisual no The Movie DB
  async buscaMovieDB(req, res) {
    const { nome } = req.params;

    Axios.get(
      "https://api.themoviedb.org/3/search/multi?api_key=" +
        process.env.MOVIEDB_KEY +
        "&language=pt-BR&query=" +
        nome +
        "&page=1&include_adult=false"
    ).then((response) => {
      console.log(response);
      res.status(200).json(response.data.results);
    });
  },

  // * Recupera audiovisual no The Movie DB
  async recuperaMovieDB(req, res) {
    const { id, tipo } = req.params;

    if (tipo.toString() === "movie") {
      Axios.get(
        "https://api.themoviedb.org/3/movie/" +
          id +
          "?api_key=" +
          process.env.MOVIEDB_KEY +
          "&language=pt-BR"
      ).then((response) => {
        res.status(200).json(response.data);
      });
    } else {
      Axios.get(
        "https://api.themoviedb.org/3/tv/" +
          id +
          "?api_key=" +
          process.env.MOVIEDB_KEY +
          "&language=pt-BR"
      ).then((response) => {
        res.status(200).json(response.data);
      });
    }
  },
};
