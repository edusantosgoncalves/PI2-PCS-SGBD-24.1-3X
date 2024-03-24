import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

//Imports da MUI
import {
  Button,
  Backdrop,
  CircularProgress,
  Grow,
  Container,
  Grid,
  CssBaseline,
  Tabs,
  Tab,
  Card,
  CardContent,
  Rating,
  Typography,
  CardHeader,
  Avatar,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Import de icones
import { FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../components/MenuLateral";
import BarraLogo from "../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";

const UsuarioCriar = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
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

    // ! Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });

    // ! Buscando avs...
    buscarAvsFeitas(usuarioLS.email);
    buscarMinhasAvs(usuarioLS.email);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Variável que controla qual tipo de avaliação mostrar pro usuário:
  const [tipoAv, setTipoAv] = React.useState(0);

  const mudaVisualizacao = (event, valor) => {
    setTipoAv(valor);
    if (valor === 0) {
      setAvMostrar(avMinhas);
    } else {
      setAvMostrar(avRealizadas);
    }
  };

  // ! Variáveis que receberão as avaliações
  const [avMinhas, setAvMinhas] = React.useState([{}]);
  const [avRealizadas, setAvRealizadas] = React.useState([{}]);
  const [avMostrar, setAvMostrar] = React.useState([{}]);

  // ! Funções para buscar avaliações
  const buscarMinhasAvs = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/avaliacoes-recebidas`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 300) {
          setAvMinhas(response.data);
          setAvMostrar(response.data);
          setJaCarregou(true);
        }
      })
      .catch((erro) => {
        console.log(erro);
        setAbreNaoPode(true);
        setMsgAlerts(erro.response.data);
        setJaCarregou(true);
      });
  };

  const buscarAvsFeitas = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/avaliacoes-feitas`)
      .then((response) => {
        setAvRealizadas(response.data);
        setJaCarregou(true);
      })
      .catch((erro) => {
        console.log(erro);
        setAbreNaoPode(true);
        setMsgAlerts(erro.response.data);
        setJaCarregou(true);
      });
  };
  return (
    <>
      <div className="Usuarios-ADM">
        <BarraLogo locationState={locationState}></BarraLogo>
        <MenuLateral locationState={locationState}></MenuLateral>

        <CssBaseline />
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <div className={jaCarregou ? "divMeio" : "ocultar"}>
            <Container disableGutters sx={{ paddingTop: "0" }} maxWidth="md">
              <Container
                className="containerVolta"
                disableGutters
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Tabs
                  value={tipoAv}
                  onChange={mudaVisualizacao}
                  TabIndicatorProps={{ style: { background: "#b6a1e4" } }}
                  textColor="primary"
                  sx={{
                    backgroundColor: "fundoCard",
                    borderRadius: "15px",
                  }}
                >
                  <Tab label="Recebidas" />
                  <Tab label="Realizadas" />
                </Tabs>
              </Container>

              <Grid
                overflow={"auto"}
                maxHeight={"70vh"}
                className="gridTimes" //className={tipoAv === 0 ? "gridTimes" : "ocultar"}
                container
                spacing={4}
              >
                <Container
                  sx={{
                    minWidth: 275,
                    margin: "0.5em 0.6em",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "stretch",
                    alignItems: "stretch",
                  }}
                >
                  {avMostrar.map((avaliacao, index) => {
                    if (avaliacao.hasOwnProperty("nome")) {
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
                              maxHeight: "220px",
                            }}
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
                                avaliacao.hasOwnProperty("nome")
                                  ? avaliacao.nome
                                  : ""
                              }
                              subheader={
                                <Rating
                                  value={parseInt(avaliacao.avaliacao)}
                                  key={"RAT_MIN_" + index}
                                  readOnly
                                />
                              }
                            />
                            <CardContent sx={{ overflow: "overlay" }}>
                              <Typography
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  display: "inline-block",
                                }}
                                color="texto.descricao"
                              >
                                {avaliacao.comentario}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grow>
                      );
                    }
                  })}
                </Container>
              </Grid>
            </Container>
            <Container
              maxWidth="md"
              className="divBotaoFim"
              disableGutters
              sx={{ display: "flex" }}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
                sx={{ marginTop: "1.5em", marginRight: "0.5em" }}
              >
                Voltar
              </Button>
            </Container>
          </div>

          <div className={jaCarregou ? "ocultar" : "principal"}>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress sx={{ color: "#CDC1F8" }} />
            </Backdrop>
          </div>
        </ThemeProvider>
      </div>

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
          <AlertTitle>Erro / Informativo</AlertTitle>
          {msgAlerts}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UsuarioCriar;
