import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./projetosView.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Grow,
  Container,
  Typography,
  Switch,
  Card,
  Button,
  Link,
  CardContent,
  CardActions,
  Badge,
  Box,
  Backdrop,
  CircularProgress,
  Grid,
  Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  FaPlusCircle,
  FaPencilAlt,
  FaCircle,
  FaHandPointLeft,
} from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const ProjetosView = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página e receber dados da página redirecionadora
  const location = useLocation();

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

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

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });

    if (adminLS === "true") {
      buscarTodosProjetos();
    } else {
      buscarProjetos(usuarioLS.email.toString());
    }
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Declarando variável que vai receber a lista de times do usuário
  const [listaProjetos, setListaProjetos] = React.useState([
    {
      codProjeto: "",
      nome: "",
      descricao: "",
      dtCriacao: "",
      timeResponsavel: "",
      ativo: "",
      dtConclusao: "",
    },
  ]);

  const buscarTodosProjetos = () => {
    Axios.get(`${serverPrefix}/api/usuarios/-1/projetos`).then((response) => {
      console.log(response.data); // TESTE -
      setListaProjetos(response.data);
      setJaCarregou(true);
    });
  };

  const buscarProjetos = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/projetos`).then(
      (response) => {
        console.log(response.data); // TESTE -
        setListaProjetos(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Variável que armazena a cor para status de card
  const corStatus = {
    true: "#00bb00",
    false: "#d60606",
  };

  // ! Função para levar o usuario logado a pagina de alterar time
  const alterarDadosProjeto = (projeto) => {
    console.log(projeto);

    //Setando projeto no localStorage
    localStorage.setItem("projeto", JSON.stringify(projeto));

    redirect(
      "/projetos/alterar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, projeto: projeto } }
    );
  };

  // ! Função para levar o usuario logado a pagina de detalhar time
  const detalharProjeto = (projeto) => {
    console.log(projeto);
    //Setando projeto no localStorage
    localStorage.setItem("projeto", JSON.stringify(projeto));

    redirect(
      "/projetos/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, projeto: projeto } }
    );
  };

  // ! Variável que declara o controle do switch para ver projetos
  const [verTodosProjetos, setVerTodosProjetos] = React.useState(false);

  // ! Variável que muda a variável ver projetos
  const mudaVisualizacaoProjeto = (event) => {
    if (event.target.checked) {
      buscarProjetos(locationState.usuario.email);
      setTextoSwitch("Mudar para todos os projetos");
    } else {
      buscarTodosProjetos();
      setTextoSwitch("Mudar para meus projetos");
    }
    setVerTodosProjetos(event.target.checked);
  };

  // ! Variável que declara o texto mostrado no Switch
  const [textoSwitch, setTextoSwitch] = React.useState(
    "Mudar para meus projetos"
  );

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  return (
    <div className="Times">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <div className={jaCarregou ? "principalTimes" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container disableGutters sx={{ paddingTop: "0" }} maxWidth="md">
            <Container
              className="containerVolta"
              disableGutters
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Button
                className={locationState.admin === "true" ? "" : "ocultar"}
                color="success"
                variant="contained"
                size="large"
                startIcon={<FaPlusCircle />}
                onClick={() => {
                  redirect(
                    "/projetos/criar" //, { state: { admin: true, usuario: locationState.usuario } }
                  );
                }}
                sx={{ width: "20%", maxHeight: "10%" }}
              >
                Novo Projeto
              </Button>
            </Container>

            <Grid
              overflow={"auto"}
              maxHeight={"70vh"}
              className="gridTimes"
              container
              spacing={4}
              sx={{ margin: " 1.5em 0 1.5em 0 " }}
            >
              <Container
                disableGutters
                sx={{
                  paddingTop: "0",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                className={locationState.admin === "true" ? "" : "ocultar"}
                maxWidth="md"
              >
                <Switch
                  checked={verTodosProjetos}
                  onChange={mudaVisualizacaoProjeto}
                  inputProps={{ "aria-label": "controlled" }}
                  color={verTodosProjetos ? "success" : "error"}
                />
                <Typography
                  className="textoSwitch"
                  gutterBottom
                  variant="body"
                  component="h6"
                  sx={{ fontWeight: "500" }}
                >
                  {textoSwitch}
                </Typography>
              </Container>

              <Container
                sx={{
                  minWidth: 275,
                  margin: "0.5em 0.6em",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignContent: "stretch",
                }}
              >
                {listaProjetos.map((projeto, index) => {
                  return (
                    <Grow
                      in={true}
                      style={{ transformOrigin: "0 0 0" }}
                      key={projeto.id}
                      {...(true ? { timeout: (index + 1) * 250 } : {})}
                    >
                      <Box
                        sx={{
                          maxWidth: "100%",
                          minHeight: "10%",
                          margin: "0.5em 0.6em",
                          display: "flex",
                        }}
                      >
                        <Card
                          sx={{
                            width: "350px",
                            backgroundColor: "fundoCard",
                            display: "flex",
                          }}
                          className="cardTimes"
                          variant="outline"
                        >
                          <CardContent>
                            <Typography
                              variant="h5"
                              gutterBottom
                              sx={{ fontWeight: "900" }}
                            >
                              <Link
                                underline="none"
                                color={"black"}
                                className="link-underline-transicao"
                                onClick={() => {
                                  detalharProjeto(projeto);
                                }}
                              >
                                {projeto.nome}
                              </Link>
                            </Typography>
                            <Typography
                              sx={{
                                mb: 1,
                                fontWeight: "600",
                                display: "inline-block",
                              }}
                              color="texto.descricao"
                            >
                              {"Coordenação: "}
                              <Typography
                                sx={{
                                  mb: 1,
                                  fontWeight: "500",
                                  display: "inline-block",
                                }}
                                color="texto.descricao"
                              >
                                {projeto.nomeTime}
                              </Typography>
                            </Typography>

                            <Typography
                              sx={{ mb: 1, fontWeight: "600" }}
                              color="texto.descricao"
                            >
                              {"Tarefas: "}
                              <Typography
                                sx={{
                                  mb: 1,
                                  fontWeight: "500",
                                  display: "inline-block",
                                }}
                                color="texto.descricao"
                              >
                                {projeto.qtdTarefas}
                              </Typography>
                            </Typography>
                          </CardContent>
                          <CardActions>
                            {
                              <Button
                                className={
                                  locationState.admin === "true" &&
                                  projeto.ativo.toString() === "true" &&
                                  projeto.dtConclusao === null
                                    ? ""
                                    : "ocultar"
                                }
                                onClick={() => {
                                  alterarDadosProjeto(projeto);
                                }}
                                color="warning"
                                variant="contained"
                                size="small"
                                startIcon={<FaPencilAlt />}
                              >
                                Alterar
                              </Button>
                            }
                          </CardActions>
                        </Card>

                        <Tooltip
                          title={
                            projeto.ativo
                              ? projeto.dtConclusao === null
                                ? "Em andamento"
                                : "Concluído"
                              : "Inativo"
                          }
                          placement="top"
                          arrow
                        >
                          <Badge
                            badgeContent={
                              <div>
                                <FaCircle
                                  color={
                                    projeto.ativo
                                      ? projeto.dtConclusao === null
                                        ? "#f3cc30"
                                        : corStatus[projeto.ativo.toString()]
                                      : corStatus[projeto.ativo.toString()]
                                  }
                                  fontSize="1.7em"
                                />
                              </div>
                            }
                          ></Badge>
                        </Tooltip>
                      </Box>
                    </Grow>
                  );
                })}
              </Container>
            </Grid>

            <Button
              variant="contained"
              color="info"
              startIcon={<FaHandPointLeft />}
              onClick={voltar}
              sx={{ width: "20%", maxHeight: "10%" }}
            >
              Voltar
            </Button>
          </Container>
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
    </div>
  );
};

export default ProjetosView;
