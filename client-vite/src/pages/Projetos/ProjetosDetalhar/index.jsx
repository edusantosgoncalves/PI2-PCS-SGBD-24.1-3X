import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Box,
  Container,
  Typography,
  Slide,
  Grid,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  FaHandPointLeft,
  FaUserShield,
  FaUserTimes,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const ProjetosDetalhar = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    projeto: "",
  });

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
      localStorage.hasOwnProperty("usuario") === false
    ) {
      redirect("/?acesso=" + 0);
      return;
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    let projetoLS = JSON.parse(localStorage.getItem("projeto"));

    //Atribuindo-os a locationState
    setLocationState({
      admin: adminLS,
      usuario: usuarioLS,
      projeto: projetoLS,
    });

    if (projetoLS.ativo) setStatusProjeto(true);
    console.log(projetoLS);
    getIteracoes(projetoLS.codProjeto);
  }, []);

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    if (
      mensagem.toString() ===
      (locationState.projeto.nome + " foi concluído com sucesso!").toString()
    )
      redirect(-1);
  };

  // ! Variável que vai controlar o estado do projeto
  const [statusProjeto, setStatusProjeto] = React.useState(false);

  // ! Função que muda o status do projeto
  const alterarStatusProjeto = () => {
    if (statusProjeto === true) {
      Axios.get(
        `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/tarefasAtivas`
      ).then((response) => {
        if (response.status === 200) {
          console.log(response.data.qtdTarefasAtivas);
          if (parseInt(response.data.qtdTarefasAtivas) > 0) {
            setMsgAlerts(
              "O projeto ainda possui " +
                response.data.qtdTarefasAtivas +
                " tarefas em andamento!"
            );
            setAbreNaoPode(true);
            return;
          } else {
            Axios.put(
              `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/status`,
              {
                ativo: !statusProjeto,
              }
            )
              .then((resposta) => {
                setSair(true);
                setMensagem(
                  locationState.projeto.nome +
                    " foi " +
                    (statusProjeto ? "inativado" : "reativado") +
                    " com sucesso!"
                );
                setStatusProjeto(!statusProjeto);
              })
              .catch((erro) => {
                console.log(erro);
              });
          }
        }
      });
    } else {
      Axios.put(
        `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/status`,
        {
          ativo: !statusProjeto,
        }
      )
        .then((resposta) => {
          setSair(true);
          setMensagem(
            locationState.projeto.nome +
              " foi " +
              (statusProjeto ? "inativado" : "reativado") +
              " com sucesso!"
          );
          setStatusProjeto(!statusProjeto);
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

  // ! Visualizar tarefas do projeto.
  const visualizarTarefas = () => {
    //Setando projeto no localStorage
    localStorage.setItem("projeto", JSON.stringify(locationState.projeto));

    redirect(
      "/projetos/tarefas" //, { state: { usuario: locationState.usuario, admin: locationState.admin, projeto: locationState.projeto } }
    );
  };

  // ! Declarando variável que vai receber a lista de iterações conforme a criação
  const [listaIteracoes, setListaIteracoes] = React.useState([{}]);

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getIteracoes = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/iteracoes`).then(
      (response) => {
        console.log(response.data);
        setListaIteracoes(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Função que recebe uma data no formato SQL e retorna-a formatada para o padrão BR
  let formatData = (dataSQL) => {
    let dt = new Date(dataSQL);
    return (
      dt.getDate() + 1 + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear()
    );
  };

  const detalharTime = (codTime) => {
    if (codTime !== null) {
      Axios.get(`${serverPrefix}/api/time/${codTime}`).then((response) => {
        if (response.status === 200) {
          //Setando time no localStorage
          localStorage.setItem("time", JSON.stringify(response.data));

          redirect(
            "/times/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, time: response.data } }
          );
        }
      });
    }
  };

  // ! Função que conclui projeto
  const concluiProjeto = () => {
    Axios.get(
      `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/tarefasAtivas`
    ).then((response) => {
      if (response.status === 200) {
        if (parseInt(response.data.qtdTarefasAtivas) > 0) {
          setMsgAlerts(
            "O projeto ainda possui " +
              response.data.qtdTarefasAtivas +
              " tarefas em andamento!"
          );
          setAbreNaoPode(true);
          return;
        } else {
          Axios.delete(
            `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/conclui`
          )
            .then((resposta) => {
              setSair(true);
              setMensagem(
                locationState.projeto.nome + " foi concluído com sucesso!"
              );

              return;
            })
            .catch((erro) => {
              console.log(erro);
            });
        }
      }
    });
  };

  return (
    <>
      <CssBaseline />
      <BarraLogo locationState={locationState}></BarraLogo>
      <div className={jaCarregou ? "mainDetalha" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container
            className="principalDetalha"
            maxWidth="md"
            sx={{
              paddingBottom: "24px",
              display: "flex",
              backgroundColor: "fundoCard",
            }}
          >
            <Box
              height={"100%"}
              className="boxDetalha"
              sx={{ display: "flex" }}
            >
              <Container disableGutters className="tituloDetalha">
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ color: "tituloDetalha", fontWeight: "600" }}
                >
                  {locationState.projeto.nome}
                </Typography>
              </Container>

              <Container
                className="detalhaTime"
                disableGutters
                sx={{ display: "flex" }}
              >
                <Container disableGutters className="detalhaIntegrantetime">
                  <Typography
                    variant="body"
                    component="h3"
                    sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                  >
                    {locationState.projeto.descricao}
                  </Typography>
                </Container>

                <Container
                  disableGutters
                  sx={{ display: "flex", height: "100px", gap: "1.5em" }}
                >
                  <Container
                    disableGutters
                    className="detalhaProjetotime"
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="body"
                      component="h3"
                      sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                    >
                      {"Criado em: "}
                    </Typography>
                    <Typography
                      variant="body"
                      component="h4"
                      sx={{ color: "subTituloDetalha" }}
                    >
                      {locationState.projeto.dtCriacao}
                    </Typography>
                  </Container>

                  <Container disableGutters className="detalhaProjetotime">
                    <Typography
                      variant="body"
                      component="h3"
                      sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                    >
                      Time Responsável:
                      <Typography
                        variant="body"
                        component="h4"
                        sx={{ color: "subTituloDetalha" }}
                      >
                        <Link
                          underline="none"
                          color={"subTituloDetalha"}
                          sx={{
                            "&:hover": {
                              color: "subTituloDetalhaHover",
                            },
                          }}
                          className={"link-underline-transicao"}
                          onClick={() => {
                            detalharTime(locationState.projeto.timeResponsavel);
                          }}
                        >
                          &nbsp;{locationState.projeto.nomeTime}
                        </Link>
                      </Typography>
                    </Typography>
                  </Container>

                  <Container
                    disableGutters
                    className="detalhaProjetotime"
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="body"
                      component="h3"
                      sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                    >
                      {locationState.projeto.dtConclusao === null
                        ? "Prazo:"
                        : "Concluído em:"}
                    </Typography>

                    <Typography
                      variant="body"
                      component="h4"
                      sx={{ color: "subTituloDetalha" }}
                    >
                      {locationState.projeto.dtConclusao === null
                        ? locationState.projeto.Prazo
                        : locationState.projeto.dtConclusao}
                    </Typography>
                  </Container>
                </Container>

                <Container
                  disableGutters
                  className="containerExibeDados"
                  sx={{
                    display: "flex",
                    height: "300px",
                    width: "100%",
                    padding: "0%",
                  }}
                >
                  <Typography
                    variant="body"
                    component="h3"
                    sx={{ color: "subTituloDetalha", fontWeight: "500" }}
                  >
                    Iterações:
                  </Typography>
                  <Grid
                    overflow={"overlay"}
                    sx={{ width: "100%", overflowX: "hidden" }}
                  >
                    <List>
                      {listaIteracoes.map((iteracao, index) => {
                        return (
                          <Slide
                            direction="left"
                            in={true}
                            timeout={(index + 1) * 250}
                            mountOnEnter
                            unmountOnExit
                          >
                            <ListItem
                              className={
                                iteracao.nome ===
                                `ITERAÇÃO - ${
                                  locationState.projeto.nome
                                    ? locationState.projeto.nome.toUpperCase()
                                    : ""
                                }`
                                  ? "ocultar"
                                  : ""
                              }
                              value={iteracao.nome}
                              key={
                                "ITERA_SLC_" +
                                iteracao.codIteracao +
                                iteracao.nome
                              }
                              sx={{ color: "subTituloDetalha" }}
                            >
                              <ListItemText
                                primary={
                                  iteracao.nome +
                                  ": de " +
                                  iteracao.dtInicio +
                                  " a " +
                                  iteracao.dtConclusao
                                }
                                sx={{
                                  color: "subTituloDetalha",
                                  textDecoration: "underline",
                                }}
                              />
                            </ListItem>
                          </Slide>
                        );
                      })}
                    </List>
                  </Grid>
                </Container>
              </Container>
            </Box>

            {/* <Container className="botoesDetalha" disableGutters sx={{ display: 'flex' }}>
                    </Container> */}

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
                variant="contained"
                color="secondary"
                startIcon={<FaBookOpen />}
                onClick={visualizarTarefas}
              >
                Visualizar Tarefas
              </Button>

              <Button
                className={
                  locationState.admin === "true"
                    ? locationState.projeto.dtConclusao === null &&
                      locationState.projeto.ativo === true
                      ? "botaoReativar"
                      : "ocultar"
                    : "ocultar"
                }
                variant="contained"
                color="success"
                startIcon={<FaCheckCircle />}
                onClick={concluiProjeto}
              >
                Concluir
              </Button>

              <Button
                className={
                  locationState.admin === "true" ? "botaoReativar" : "ocultar"
                }
                variant="contained"
                color={statusProjeto ? "error" : "warning"}
                startIcon={statusProjeto ? <FaUserTimes /> : <FaUserShield />}
                onClick={alterarStatusProjeto}
              >
                {statusProjeto ? "Inativar" : "Reativar"}
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
        <PopupOKPersonalizado
          sair={sair}
          fecharDialog={fecharDialog}
          mensagem={mensagem}
        />
      </div>
    </>
  );
};

export default ProjetosDetalhar;
