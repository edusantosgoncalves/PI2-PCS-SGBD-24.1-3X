// * Importando as bibliotecas
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// * Definindo porta do servidor e ativando cors
app.use(cors());
app.set("port", process.env.PORT || 1003);

// * Importando as rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Importando as rotas novas
app.use(require("./routes/UsuarioRoutes"));

// * Importando as rotas antigas
/*app.use(require("./routes-old/ProjetoRoutes"));
app.use(require("./routes-old/TarefaRoutes"));
app.use(require("./routes-old/TimeRoutes"));
app.use(require("./routes-old/UsuarioRoutes"));
app.use(require("./routes-old/APIsRoutes"));*/

/* GOOGLE AUTH */
//Importando o framework Express-Session e instanciando-o
const session = require("express-session");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

//Importando o framework Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// Variável para armazenar o perfil do usuário
let userProfile;

// Rota de erro - autenticação google
app.get("/google/error", (req, res) => res.send("Erro ao logar"));

// Rota de sucesso - autenticação google
app.get("/google/success", (req, res) =>
  res.redirect(
    `${process.env.CLIENT_PREFIX}/validarusu?email=` +
      userProfile._json.email +
      "&nome=" +
      userProfile._json.name +
      "&foto=" +
      userProfile._json.picture
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
//Importando o framework Passport-Google-OAuth
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//Definindo o seu client ID e Secret do Google (foi cadastrado no API do Google Cloud)

//Importando o .env
require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET;

//Requisitando a autenticação do usuário
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_PREFIX}/auth/google/callback`,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  // Autenticação incorreta, redirecionamento para a falha
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Autenticação correta, redirecionamento para o sucesso.
    req.session.regenerate(function (err) {
      if (err) {
        console.error("Error regenerating session:", err);
        res.redirect("/google/error");
      }
      console.log(userProfile._json);
      res.redirect("/google/success");
    });
  }
);

module.exports = app;
