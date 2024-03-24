import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesDetalharTime.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  CssBaseline,
  Chip,
  Avatar,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft, FaUserShield, FaUserTimes } from "react-icons/fa";
import { Fade } from "@mui/material";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const DetalharTimePage = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    time: "",
  });

  // ! Declarando variável que vai definir o status atual do time
  const [statusTime, setStatusTime] = React.useState(false);

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

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
      localStorage.hasOwnProperty("time") === false
    ) {
      redirect("/?acesso=" + 0);
      return;
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    let timeLS = JSON.parse(localStorage.getItem("time"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS, time: timeLS });
    retornarTime(timeLS.codTime);
    setStatusTime(timeLS.ativo ? true : false);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  const retornarTime = (codTime) => {
    Axios.get(`${serverPrefix}/api/time/${codTime}`)
      .then((resposta) => {
        //console.log(resposta.data);
        console.log(resposta.data.usuarios);
        setListaIntegrantes(resposta.data.usuarios);
        setListaProjetos(resposta.data.projetos);

        let timeAdd = resposta.data;
        delete timeAdd["usuarios"];
        delete timeAdd["projetos"];

        setTime(timeAdd);
        setJaCarregou(true);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // * RECEBENDO DADOS DO TIME...
  // ! Declarando variável que vai receber o time
  const [time, setTime] = React.useState({
    codTime: "",
    nome: "",
    dtCriacao: "",
    ativo: true,
  });

  // ! Declarando variável que vai receber a lista de integrantes do time
  const [listaIntegrantes, setListaIntegrantes] = React.useState([
    {
      email: "",
      nome: "",
    },
  ]);

  // ! Declarando variável que vai receber a lista de projetos do time
  const [listaProjetos, setListaProjetos] = React.useState([
    {
      codProjeto: "",
      nome: "",
    },
  ]);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de usuarios-adm
  const fecharDialog = () => {
    setSair(false);
    redirect(
      "/times" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Função que altera o status do time
  const alterarStatusTime = () => {
    console.log("🚀 ~ file: index.jsx:85 ~ React.useEffect ~ time", time);

    if (statusTime === true) {
      Axios.get(
        `${serverPrefix}/api/times/${time.codTime}/projetosAtivos`
      ).then((response) => {
        if (response.status === 200) {
          if (parseInt(response.data.qtd) > 0) {
            setMsgAlerts(
              "O time ainda possui " +
                response.data.qtd +
                " projetos em andamento!"
            );
            setAbreNaoPode(true);
            return;
          } else {
            Axios.put(`${serverPrefix}/api/times/${time.codTime}/status`, {
              ativo: !statusTime,
            })
              .then((resposta) => {
                setSair(true);
                setMensagem(
                  time.nome +
                    " foi " +
                    (statusTime ? "inativado" : "reativado") +
                    " com sucesso!"
                );
              })
              .catch((erro) => {
                console.log(erro);
              });
          }
        }
      });
    } else {
      Axios.put(`${serverPrefix}/api/times/${time.codTime}/status`, {
        ativo: !statusTime,
      })
        .then((resposta) => {
          setSair(true);
          setMensagem(
            time.nome +
              " foi " +
              (statusTime ? "inativado" : "reativado") +
              " com sucesso!"
          );
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que levará para a tela de seguir usuário (caso o usuario da tarefa seja outro)
  const detalharUsuario = (emailUsuario) => {
    //Redirecionar o usuario para a página de seguir o outro usuario
    if (emailUsuario !== null) {
      //Setando usuario no localStorage
      localStorage.setItem("usuarioPerfil", JSON.stringify(emailUsuario));

      redirect(
        "/perfil?" + emailUsuario //, { state: { usuario: locationState.usuario, admin: locationState.admin, usuarioPerfil: emailUsuario } }
      );
    }
  };

  // ! Função que levará para a tela de seguir usuário (caso o usuario da tarefa seja outro)
  const detalharProjeto = (codProjeto) => {
    //Redirecionar o usuario para a página de seguir o outro usuario
    if (codProjeto !== null) {
      Axios.get(`${serverPrefix}/api/projetos/` + codProjeto).then(
        (response) => {
          if (response.status === 200) {
            //Setando projeto no localStorage
            localStorage.setItem("projeto", JSON.stringify(response.data));

            redirect(
              "/projetos/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, projeto: response.data } }
            );
          }
        }
      );
    }
  };

  // ! Função que retorna o Avatar dos integrantes do grupo
  const retornaAvatar = (urlImagem, email, nome) => {
    if (urlImagem === "") {
      return <Avatar> {nome.charAt(0)}</Avatar>;
    } else {
      return <Avatar alt={"AVT_" + email} src={urlImagem} />;
    }
  };
  return (
    <>
      <CssBaseline />
      <BarraLogo locationState={locationState} />
      <div className={jaCarregou ? "mainDetalha" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container
            className="principalDetalha"
            maxWidth="sm"
            overflow={"auto"}
            sx={{
              paddingBottom: "24px",
              display: "flex",
              backgroundColor: "fundoCard",
            }}
          >
            <Box
              height={"100%"}
              overflow={"auto"}
              className="boxDetalha"
              sx={{ display: "flex" }}
            >
              <Container disableGutters className="tituloDetalha">
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{ color: "tituloDetalha", fontWeight: "600" }}
                >
                  {time.nome}
                </Typography>
              </Container>

              <Container
                className="detalhaTime"
                disableGutters
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <Container disableGutters className="detalhaIntegrantetime">
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                  >
                    Integrantes
                  </Typography>
                  {listaIntegrantes.map(
                    (integrante, index) => (
                      // if (integrante.email !== locationState.usuario.email) {
                      //     return
                      <Fade in={true} timeout={(index + 1) * 500} key={index}>
                        <Chip
                          key={"INT_CHIP_" + integrante.email}
                          label={integrante.nome}
                          sx={{
                            justifyContent: "left",
                            paddingBottom: "0.2em",
                            margin: "0.2em",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                            },
                          }}
                          onClick={() => detalharUsuario(integrante.email)}
                          avatar={retornaAvatar(
                            integrante.urlImagem,
                            integrante.email,
                            integrante.nome
                          )}
                        />
                      </Fade>
                    )
                    // }
                    // else {
                    //     return <Fade in={true} timeout={(index + 1) * 500} key={index}>
                    //         <Chip
                    //             key={"INT_CHIP_" + integrante.email}
                    //             label={integrante.nome}
                    //             sx={{
                    //                 justifyContent: 'left',
                    //                 paddingBottom: '0.2em',
                    //                 margin: '0.2em',
                    //                 '&:hover': {
                    //                     backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    //                 },
                    //             }}
                    //             avatar={retornaAvatar(integrante.urlImagem, integrante.email, integrante.nome)}
                    //         />
                    //     </Fade>;
                    // }
                  )}
                  {/*<List className="listaDetalha">

                                        {listaIntegrantes.map((integrante) => (
                                            <ListItem key={integrante.email} className="itemListaDetalha" sx={{ display: "flex" }}>
                                                <Link
                                                    underline="none"
                                                    color={'black'}
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#61536a',
                                                        },
                                                    }}
                                                    className={"link-underline-transicao"}
                                                    onClick={() => {
                                                        detalharUsuario(integrante.email)
                                                    }}>
                                                    {integrante.nome}
                                                </Link>
                                            </ListItem>
                                        ))}
                                                </List>*/}
                </Container>
                <Container disableGutters className="detalhaProjetotime">
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                  >
                    Projetos
                  </Typography>
                  {listaProjetos.map((projeto, index) => (
                    <Fade in={true} timeout={(index + 1) * 500} key={index}>
                      <Chip
                        key={"PROJ_CHIP_" + projeto.codProjeto}
                        label={projeto.nome}
                        sx={{
                          margin: "0.2em",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                          },
                        }}
                        onClick={() => detalharProjeto(projeto.codProjeto)}
                      />
                    </Fade>
                  ))}
                  {/*<List className="listaDetalha">
                                        {listaProjetos.map((projeto) => (
                                            <ListItem key={projeto.codProjeto} className="itemListaDetalha" sx={{ display: "flex" }}>
                                                <Link
                                                    underline="none"
                                                    color={'white'}
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#61536a',
                                                        },
                                                    }}
                                                    className={"link-underline-transicao"}
                                                    onClick={() => {
                                                        detalharProjeto(projeto.codProjeto)
                                                    }}>
                                                    {projeto.nome}
                                                </Link>
                                            </ListItem>
                                        ))}
                                                </List>*/}
                </Container>
              </Container>
            </Box>

            <Container
              className="divBotaoFim"
              disableGutters
              sx={{ display: "flex" }}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
              >
                Voltar
              </Button>
              <Button
                className={
                  locationState.admin === "true" ? "botaoReativar" : "ocultar"
                }
                variant="contained"
                color={statusTime ? "error" : "warning"}
                startIcon={statusTime ? <FaUserTimes /> : <FaUserShield />}
                onClick={alterarStatusTime}
              >
                {statusTime ? "Inativar" : "Reativar"}
              </Button>
            </Container>
          </Container>

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
        </ThemeProvider>
      </div>
      <div className={jaCarregou ? "ocultar" : "principalTimes"}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress sx={{ color: "#CDC1F8" }} />
        </Backdrop>
      </div>
      <PopupOKPersonalizado
        sair={sair}
        fecharDialog={fecharDialog}
        mensagem={mensagem}
      />
    </>
  );
};

export default DetalharTimePage;
