import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesTarefasProj.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Grid,
  Container,
  Typography,
  Box,
  Card,
  Button,
  Link,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
  Badge,
  Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaBookOpen, FaCircle, FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const TarefasProjeto = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    projeto: "",
  });

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    // Validando se há dados no localstorage
    if (
      localStorage.hasOwnProperty("admin") === false ||
      localStorage.hasOwnProperty("usuario") === false ||
      localStorage.hasOwnProperty("projeto") === false
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

    getTarefas(projetoLS.codProjeto);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Declarando variavel que receberá todas as tarefas do sistema
  const [listaTarefas, setListaTarefas] = React.useState([
    {
      codTarefa: "",
      nome: "",
      descricao: "",
      status: "",
      projetoTarefa: "",
      nomeProjeto: "",
      codIteracaoFK: "",
      nomeIteracao: "",
      usuarioResp: "",
      nomeUsuarioResp: "",
    },
  ]);

  const [listaTarefasFiltrada, setListaTarefasFiltrada] = React.useState([
    {
      codTarefa: "",
      nome: "",
      descricao: "",
      status: "",
      projetoTarefa: "",
      nomeProjeto: "",
      codIteracaoFK: "",
      nomeIteracao: "",
      usuarioResp: "",
      nomeUsuarioResp: "",
    },
  ]);

  // ! Declarando variável que filtrará pelo status
  const selectStatus = [
    { status: "-1", descStatus: "Todos" },
    { status: "1", descStatus: "Em Andamento" },
    { status: "3", descStatus: "Concluído" },
  ];

  // ! Declarando variável que vai receber projeto escolhido
  const [statusSelecionado, setStatusSelecionado] = React.useState(-1);

  // ! Declarando função que definirá o projeto escolhido no Select
  const filtrarStatus = (evento, status) => {
    setStatusSelecionado(status.status);
    let nvListaTarefas = [];

    //Se não for Todos, faça o filtro...
    if (parseInt(status.status) !== -1) {
      // ! Filtrando o status selecionado
      nvListaTarefas = listaTarefas.filter(
        (tarefa) => parseInt(tarefa.status) === parseInt(status.status)
      );
    }
    //Se for todos, reitere o filtro...
    else {
      nvListaTarefas = listaTarefas;
    }
    setListaTarefasFiltrada(nvListaTarefas);
  };

  // ! Buscando todas as tarefas do sistema..
  const getTarefas = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/tarefas`).then(
      (response) => {
        console.log(response.data);
        setListaTarefas(response.data);
        setListaTarefasFiltrada(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Variável que armazena a cor para status de card
  const corStatus = {
    /* DETALHANDO STATUS...
            1 - Em andamento(quando tiver um usuário atribuído);
            3 - Concluído(quando tiver sido concluída por um usuário);
            4 - Inativada
        */
    1: "#f3cc30",
    2: "#f3cc30",
    3: "#00bb00",
    4: "#f33030",
  };

  // ! Função que vai redirecionar o usuário para o detalhamento da tarefa
  const detalharTarefa = (tarefa) => {
    //Setando tarefa no localStorage
    localStorage.setItem("tarefa", JSON.stringify(tarefa));

    redirect(
      "/tarefas/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, tarefa: tarefa } }
    );
  };

  // ! Função que vai redirecionar o usuário para as tarefas seguidas
  const tarefasSeguidas = () => {
    redirect(
      "/tarefas/seguidas" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  return (
    <div className={"minhas-tarefas"}>
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <div className={jaCarregou ? "principal-minhas-tarefas" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container
            className="container-minha-tarefa"
            disableGutters
            sx={{ paddingTop: "0", display: "flex", margin: "0.5em 0" }}
            maxWidth="md"
          >
            <Container
              className="container-filtro-minhas-tarefas"
              sx={{ display: "flex" }}
              container
              spacing={4}
            >
              <Typography
                className="titulo-minhas-tarefas"
                gutterBottom
                variant="h5"
                sx={{ color: "fundoCard", fontWeight: 600 }}
              >
                {locationState.projeto.nome}
              </Typography>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0.5em 0",
                }}
              >
                <Typography
                  className="titulo-minhas-tarefas"
                  gutterBottom
                  variant="body1"
                  sx={{ color: "fundoCard", fontWeight: 500 }}
                >
                  Filtrar Status
                </Typography>
                <Select
                  className="select-filtro-minhas-tarefas"
                  labelId="selectStatus"
                  id="slctStatus"
                  value={statusSelecionado}
                  label="Status"
                  sx={{ backgroundColor: "fundoCard" }}
                  //onChange={filtrarStatus}
                >
                  {selectStatus.map((status) => {
                    return (
                      <MenuItem
                        value={status.status}
                        key={"SLC_S_" + status.status}
                        onClick={(event) => filtrarStatus(event, status)}
                        selected={statusSelecionado === status}
                      >
                        {status.descStatus}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Container>

            <Container
              className="container-exibe-minhas-tarefas"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
              //overflow={'auto'}
              maxHeight={"70vh"}
            >
              {listaTarefasFiltrada.map((tarefa) => {
                return (
                  <Box
                    sx={{
                      minWidth: 275,
                      margin: "0.5em 0.6em",
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <Card
                      sx={{
                        minWidth: 275,
                        backgroundColor: "fundoCard",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                      className="cardTimes"
                      variant="outline"
                    >
                      <CardContent>
                        <Link
                          sx={{
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            detalharTarefa(tarefa);
                          }}
                        >
                          <Typography
                            variant="h5"
                            gutterBottom
                            className="links"
                            sx={{ fontWeight: "900" }}
                          >
                            {tarefa.nome}
                          </Typography>
                        </Link>
                        <Typography
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            display: "inline-block",
                          }}
                          color="texto.descricao"
                        >
                          {tarefa.descricao}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Tooltip
                      title={
                        tarefa.status === 1
                          ? "Em andamento"
                          : tarefa.status === 2
                          ? "Em andamento"
                          : tarefa.status === 3
                          ? "Concluída"
                          : "Inativada"
                      }
                      placement="top"
                      arrow
                    >
                      <Badge
                        badgeContent={
                          <div>
                            <FaCircle
                              color={corStatus[parseInt(tarefa.status)]}
                              fontSize="1.7em"
                            />
                          </div>
                        }
                      ></Badge>
                    </Tooltip>
                  </Box>
                  /*<Grid sx={{ maxHeight: '100%', overflow: 'auto', width: '30%', margin: '0.5em' }} item key={"Tarefa_" + tarefa.codTarefa} xs={12} sm={6} md={4} >
                                        <Card
                                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <CardContent className="cardTimes" sx={{ flexGrow: 1, backgroundColor: corStatus[parseInt(tarefa.status)] }} >
                                                <Link
                                                    underline="none"
                                                    sx={{ color: 'black', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        detalharTarefa(tarefa)
                                                    }}>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                        className="links"
                                                        sx={{ fontWeight: '700' }}
                                                    >
                                                        {tarefa.nome}
                                                    </Typography>
                                                </Link>

                                                <Typography
                                                    gutterBottom
                                                    variant="h6"
                                                    component="h6"
                                                    //className="links"
                                                    sx={{ fontWeight: '400' }}
                                                >
                                                    {tarefa.descricao}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>*/
                );
              })}
            </Container>

            <Container
              className="containerVolta"
              disableGutters
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
                sx={{ display: "flex", marginTop: "3%" }}
              >
                Voltar
              </Button>
              <Button
                className="botao-tarefas-sigo"
                variant="contained"
                color="success"
                startIcon={<FaBookOpen />}
                sx={{ display: "flex", marginTop: "3%" }}
                onClick={tarefasSeguidas}
              >
                TAREFAS QUE SIGO
              </Button>
            </Container>
          </Container>
        </ThemeProvider>
      </div>

      <div className={jaCarregou ? "ocultar" : "principal"}>
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

export default TarefasProjeto;