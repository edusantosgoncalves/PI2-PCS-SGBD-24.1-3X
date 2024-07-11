import React from "react";
import "./stylesUsuarioAlt.css";

import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports da MUI
import {
  Button,
  Box,
  Avatar,
  Backdrop,
  CircularProgress,
  Typography,
  Divider,
  Chip,
  Rating,
  TextField,
  Grow,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft, FaCommentDots } from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MenuLateral from "../../../components/MenuLateral";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";
import { Container } from "@mui/system";

const UsuarioPerfil = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    usuarioPerfil: "",
  });

  // ! Instanciando usuario dps de alterado
  const [usuarioPerfil, setUsuarioPerfil] = React.useState({});

  // ! Instanciando variáveis de notificação
  const [abreNaoPode, setAbreNaoPode] = React.useState(false);
  const [msgAlerts, setMsgAlerts] = React.useState("");

  const fechaAlertNaoPode = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbreNaoPode(false);
  };

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    // Validando se há dados no localstorage
    if (
      localStorage.hasOwnProperty("admin") === false ||
      localStorage.hasOwnProperty("usuario") === false ||
      localStorage.hasOwnProperty("usuarioPerfil") === false
    ) {
      redirect("/?acesso=" + 0);
      return;
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    let usuarioPerfilLS = JSON.parse(localStorage.getItem("usuarioPerfil"));

    //Atribuindo-os a locationState
    setLocationState({
      admin: adminLS,
      usuario: usuarioLS,
      usuarioPerfil: usuarioPerfilLS,
    });
    buscaUsuario(usuarioPerfilLS);
    vrfUsuarioESeguido(usuarioLS.email, usuarioPerfilLS);
    vrfUsuarioProprioPerfil(usuarioLS.email, usuarioPerfilLS);
    buscarAvs(usuarioPerfilLS);
  }, []);

  // ! Função que busca os dados do usuário cujo se deseja ver o perfil
  const buscaUsuario = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}`).then((response) => {
      setUsuarioPerfil(response.data);
    });
  };

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
  };

  //! Declarando variável que definirá se a tarefa é seguida pelo usuario
  const [usuarioESeguido, setUsuarioESeguido] = React.useState(false);

  //! verificando resposta de validacao de seguido
  const [vrfSeguido, setVrfSeguido] = React.useState(false);

  //! Função que verifica se a tarefa é seguida pelo usuario
  const vrfUsuarioESeguido = (emailUsuarioLogado, usuarioSeguido) => {
    Axios.get(
      `${serverPrefix}/api/usuarios/${emailUsuarioLogado}/seguindo/${usuarioSeguido}`,
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    ).then((response) => {
      setVrfSeguido(true);
      if (response.data === true) {
        setUsuarioESeguido(true);
      } else {
        setUsuarioESeguido(false);
      }
    });
  };

  // ! Função que deixará de seguir o usuario
  const deixardeSeguirUsuario = () => {
    // Verificando se o usuário existe, se nao, recusa
    if (usuarioPerfil.email === undefined) {
      setMsgAlerts("Um dos usuários está inativo ou não existe.");
      setAbreNaoPode(true);
      return;
    }

    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuario.email}/usuario/parar-seguir`,
      {
        email: usuarioPerfil.email,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        setUsuarioESeguido(false);
        setSair(true);
        setMensagem("O usuario parou de ser seguido!");
      }
    });
  };

  // ! Variável que controlará o valor da avaliação
  const [avaliacao, setAvaliacao] = React.useState(0);

  // ! Variável que diz se o usuário está no próprio perfil
  const [usuarioProprioPerfil, setUsuarioProprioPerfil] = React.useState(false);

  // ! Função que verifica se o usuário está no próprio perfil
  const vrfUsuarioProprioPerfil = (eu, outro) => {
    setUsuarioProprioPerfil(eu === outro);
  };

  // ! Função que seguirá o usuario
  const seguirUsuario = () => {
    // Verificando se o usuário existe, se nao, recusa
    if (usuarioPerfil.email === undefined) {
      setMsgAlerts("Um dos usuários está inativo ou não existe.");
      setAbreNaoPode(true);
      return;
    }

    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuario.email}/usuario/seguir`,
      {
        email: usuarioPerfil.email,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    ).then((response) => {
      switch (response.status) {
        case 200:
        case 201:
          setUsuarioESeguido(true);
          setSair(true);
          setMensagem("O usuario começou a ser seguido!");
          break;
        case 404:
          setMsgAlerts("Um dos usuários está inativo ou não existe.");
          setAbreNaoPode(true);
          return;
      }
    });
  };

  const [avs, setAvs] = React.useState([{}]);

  // ! Funções para buscar avaliações
  const buscarAvs = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/avaliacoes-recebidas`, {
      validateStatus: function (status) {
        return status < 500;
      },
    }).then((response) => {
      if (response.status === 404) {
        setMsgAlerts("Um dos usuários está inativo ou não existe.");
        setAbreNaoPode(true);
        return;
      }
      if (response.data.length > 0) {
        // Se forem obtidas avaliações, atualiza o estado
        setAvs(response.data);
      }
    });
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que deixará de seguir o usuario
  const avaliarUsuario = () => {
    // Verificando se o usuário existe, se nao, recusa
    if (usuarioPerfil.email === undefined) {
      setMsgAlerts("Um dos usuários está inativo ou não existe.");
      setAbreNaoPode(true);
      return;
    }

    // Se não houver avaliação, recusa
    if (avaliacao == 0) {
      setMsgAlerts(
        "Avaliação inválida, por favor, selecione ao menos uma estrela!"
      );
      setAbreNaoPode(true);
      return;
    }

    Axios.post(
      `${serverPrefix}/api/usuarios/${locationState.usuario.email}/avaliacoes`,
      {
        email: usuarioPerfil.email,
        avaliacao: avaliacao,
        comentario: document.getElementById("avaliacao-comm").value,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    ).then((response) => {
      switch (response.status) {
        case 200:
        case 201:
          document.getElementById("avaliacao-comm").value = "";
          buscarAvs(usuarioPerfil.email);
          setAvaliacao(0);
          break;
        case 404:
          setMsgAlerts("Um dos usuários está inativo ou não existe.");
          setAbreNaoPode(true);
          return;
      }
    });
  };

  return (
    <div className="Usuarios-ADM">
      <BarraLogo locationState={locationState} />
      <MenuLateral locationState={locationState} />

      <ThemeProvider theme={MuiEstilosPersonalizados}>
        <Container
          className={vrfSeguido ? "principalAlteraUsuario" : "ocultar"}
          sx={{ display: "flex" }}
        >
          <Container
            disableGutters
            className="containerPerfilUsuario"
            sx={{ display: "flex" }}
          >
            <Container
              className={"container-formulario2"}
              sx={{
                padding: "1em",
                width: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                backgroundColor: "var(--nvClaroFundo)",
              }}
            >
              <div className="perfil">
                <Avatar
                  alt={
                    "img_" + usuarioPerfil.hasOwnProperty("nome")
                      ? usuarioPerfil.nome
                      : ""
                  }
                  sx={{ width: 100, height: 100 }}
                  src={
                    usuarioPerfil.hasOwnProperty("urlImagem")
                      ? usuarioPerfil.urlImagem
                      : ""
                  }
                  referrerPolicy="no-referrer"
                />
                <h4>
                  <b>
                    {usuarioPerfil.hasOwnProperty("nome")
                      ? usuarioPerfil.nome
                      : ""}
                  </b>
                </h4>
                <p>
                  {usuarioPerfil.hasOwnProperty("email")
                    ? usuarioPerfil.email
                    : ""}
                </p>
              </div>
              <div></div>
              <Typography
                gutterBottom
                variant="h6"
                component="h6"
                id="funcao"
                className={usuarioPerfil.funcao === "" ? "ocultar" : ""}
                sx={{
                  fontWeight: "500",
                  fontFamily: ["Tajawal", "sans-serif"].join(","),
                }}
              >
                <b>Função:</b>{" "}
                {usuarioPerfil.hasOwnProperty("funcao")
                  ? usuarioPerfil.funcao
                  : ""}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h6"
                  id="linkedin"
                  sx={{
                    fontWeight: "500",
                    fontFamily: ["Tajawal", "sans-serif"].join(","),
                    margin: "0 1em 0 1em",
                    visibility: usuarioPerfil.linkedin ? "visible" : "hidden",
                  }}
                >
                  <a
                    style={{ backgroundColor: "var(--nvClaroFundo)" }}
                    className={
                      usuarioPerfil.hasOwnProperty("linkedin")
                        ? usuarioPerfil.linkedin === ""
                          ? "ocultar"
                          : ""
                        : "ocultar"
                    }
                    href={
                      usuarioPerfil.hasOwnProperty("linkedin")
                        ? usuarioPerfil.linkedin
                        : ""
                    }
                    target="_blank"
                    //className={usuarioPerfil.hasOwnProperty('linkedin') ? (usuarioPerfil.linkedin === '' ? "" : "link-underline-transicao") : ""} // Se a tarefa for do usuario, aparece normal
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                    </svg>
                  </a>
                </Typography>

                <Typography
                  gutterBottom
                  variant="h6"
                  component="h6"
                  id="github"
                  sx={{
                    fontWeight: "500",
                    fontFamily: ["Tajawal", "sans-serif"].join(","),
                    margin: "0 1em 0 1em",
                    visibility: usuarioPerfil.github ? "visible" : "hidden",
                  }}
                >
                  <a
                    className={
                      usuarioPerfil.hasOwnProperty("github")
                        ? usuarioPerfil.github === ""
                          ? "ocultar"
                          : ""
                        : "ocultar"
                    }
                    href={
                      usuarioPerfil.hasOwnProperty("github")
                        ? usuarioPerfil.github
                        : ""
                    }
                    target="_blank"
                    style={{ backgroundColor: "var(--nvClaroFundo)" }}
                    //className={usuarioPerfil.hasOwnProperty('linkedin') ? (usuarioPerfil.linkedin === '' ? "" : "link-underline-transicao") : ""} // Se a tarefa for do usuario, aparece normal
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                  </a>
                </Typography>
              </Box>

              <div className="areaBtns" style={{ margin: "1em" }}>
                {!usuarioProprioPerfil ? (
                  <div>
                    <Button
                      variant="contained"
                      color="success"
                      name="dxseguir"
                      className={usuarioESeguido ? "" : "ocultar"}
                      onClick={deixardeSeguirUsuario}
                    >
                      Deixar de seguir
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      name="seguir"
                      className={usuarioESeguido ? "ocultar" : ""}
                      onClick={seguirUsuario}
                    >
                      Seguir
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Container>

            <Container
              className={"container-formulario2"}
              disableGutters
              maxWidth="sm"
              sx={{
                display: usuarioProprioPerfil ? "none" : "flex",
                flexDirection: "column",
                paddingBottom: "1em",
                justifyContent: "space-between",
                backgroundColor: "var(--nvClaroFundo)",
              }}
            >
              {/* <Container disableGutters>
                            <Divider sx={{ margin: '1em 0 1em 0' }}>
                                <Chip label="Entretenimento" />
                                    <Box >
                                        
                                    </Box>                            
                            </Divider>
                    </Container>        */}

              <Container
                disableGutters
                sx={{ height: "40%", marginBottom: "2.5em" }}
              >
                <Divider sx={{ margin: "1em 0 1em 0" }}>
                  <Chip label="Avaliação" />
                </Divider>

                <Box sx={{ display: "flex", paddingLeft: "1em" }}>
                  <Typography
                    gutterBottom
                    vaiant="h6"
                    component="h6"
                    id="avaliacao"
                    sx={{
                      marginRight: "1em",
                      fontWeight: "500",
                      fontFamily: ["Tajawal", "sans-serif"].join(","),
                    }}
                  >
                    <b>Nota: </b>
                  </Typography>
                  <Rating
                    value={avaliacao}
                    name="avaliacaoEstrelas"
                    onChange={(event, newValue) => {
                      setAvaliacao(newValue);
                    }}
                  />
                </Box>

                <Container
                  disableGutters
                  widht="md"
                  sx={{
                    display: "flex",
                    paddingLeft: "1em",
                    paddingRight: "1em",
                  }}
                >
                  <Typography
                    gutterBottom
                    vaiant="h6"
                    component="h6"
                    id="avaliacao-label"
                    sx={{
                      marginRight: "1em",
                      fontWeight: "500",
                      fontFamily: ["Tajawal", "sans-serif"].join(","),
                    }}
                  >
                    <b>Comentário: </b>
                  </Typography>

                  <TextField
                    multiline
                    fullWidth
                    minRows={3}
                    maxRows={3}
                    id="avaliacao-comm"
                  ></TextField>
                </Container>

                <Container
                  disableGutters
                  className="divBotaoFim"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "1em",
                  }}
                >
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<FaCommentDots />}
                    onClick={avaliarUsuario}
                  >
                    Avaliar
                  </Button>
                </Container>
              </Container>
            </Container>

            <Container
              className={"container-formulario2"}
              disableGutters
              maxWidth="sm"
              sx={{
                display: avs[0].hasOwnProperty("nome") ? "flex" : "none",
                flexDirection: "column",
                paddingBottom: "1em",
                paddingLeft: "1em",
                paddingTop: "1em",
                backgroundColor: "var(--nvClaroFundo)", //flexWrap: 'wrap'
              }}
              overflow={"auto"}
            >
              {avs.map((avaliacao, index) => {
                return (
                  <Grow
                    in={true}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(true ? { timeout: (index + 1) * 350 } : {})}
                  >
                    <Card
                      sx={{
                        width: "220px",
                        backgroundColor: "fundoCard",
                        display: "flex",
                        margin: "0.2em",
                      }}
                      //Ajustar pro card ter rolagem (aqui e na pag de avaliações)
                      className="cardTimes"
                      variant="outline"
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            src={
                              avaliacao.hasOwnProperty("urlImagem")
                                ? avaliacao.urlImagem
                                : "A"
                            }
                            referrerPolicy="no-referrer"
                          />
                        }
                        title={
                          avaliacao.hasOwnProperty("nome") ? avaliacao.nome : ""
                        }
                        subheader={
                          <Rating
                            value={parseInt(avaliacao.avaliacao)}
                            key={"RAT_MIN_" + index}
                            readOnly
                          />
                        }
                      />
                      <CardContent>
                        <Typography
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            display: "inline-block",
                          }}
                          color="texto.descricao"
                        >
                          {avaliacao.descricao}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                );
              })}
            </Container>
          </Container>

          <Container
            disableGutters
            className="divBotaoFim"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gridArea: "main",
            }}
          >
            <Button
              variant="contained"
              color="info"
              startIcon={<FaHandPointLeft />}
              onClick={voltar}
            >
              Voltar
            </Button>
          </Container>
        </Container>

        <div className={vrfSeguido ? "ocultar" : "container-formulario2"}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress sx={{ color: "#CDC1F8" }} />
          </Backdrop>
        </div>
      </ThemeProvider>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={abreNaoPode}
        autoHideDuration={2500}
        onClose={fechaAlertNaoPode}
      >
        <Alert
          onClose={fechaAlertNaoPode}
          severity="error"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Não é possível</AlertTitle>
          {msgAlerts}
        </Alert>
      </Snackbar>
      <PopupOKPersonalizado
        sair={sair}
        fecharDialog={fecharDialog}
        mensagem={mensagem}
      />
    </div>
  );
};

export default UsuarioPerfil;
