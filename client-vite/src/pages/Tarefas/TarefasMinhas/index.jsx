import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesTarefasMinhas.css";

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
  Backdrop,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Badge,
  Grow,
  Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaBookOpen, FaCircle, FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const TarefasMinhas = () => {
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

    getTarefas(usuarioLS.email);
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

  // ! Declarando variável que vai receber todos os projetos
  const [selectProjetos, setSelectProjetos] = React.useState([
    {
      projetoTarefa: "",
      nomeProjeto: "",
    },
  ]);

  // ! Declarando variável que vai receber projeto escolhido
  const [projetoSelecionado, setProjetoSelecionado] = React.useState(-1);

  // ! Declarando função que definirá o projeto escolhido no Select
  const filtrarProjeto = (evento, projeto) => {
    setProjetoSelecionado(projeto.projetoTarefa);
    let nvListaTarefas = [];

    //Se não for Todos, faça o filtro...
    if (!(projeto.projetoTarefa === -1)) {
      // Se não houver status selecionado, filtre só por projeto...
      if (parseInt(statusSelecionado) === -1) {
        // ! Filtrando o projeto selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) =>
            parseInt(tarefa.projetoTarefa) === parseInt(projeto.projetoTarefa)
        );
        console.log("S = sim / P = não");
        console.log(nvListaTarefas);
      }
      //Se houver projeto selecionado, filtre por ambos
      else {
        // ! Filtrando o status e projeto selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) =>
            parseInt(tarefa.status) === parseInt(statusSelecionado) &&
            parseInt(tarefa.projetoTarefa) === parseInt(projeto.projetoTarefa)
        );
        console.log("S = sim / P = sim");
        console.log(nvListaTarefas);
      }
    }
    //Se for todos, reitere o filtro...
    else {
      // Se não houver projeto selecionado, não filtre
      if (parseInt(statusSelecionado) === -1) {
        nvListaTarefas = listaTarefas;
        console.log("S = não / P = não");
      }
      //Se houver projeto selecionado, filtre por ele
      else {
        // ! Filtrando o projeto selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) => parseInt(tarefa.status) === parseInt(statusSelecionado)
        );
        console.log("S = não / P = sim");
      }
    }

    setListaTarefasFiltrada(nvListaTarefas);
  };

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
    console.log(status);
    setStatusSelecionado(status.status);
    let nvListaTarefas = [];

    //Se não for Todos, faça o filtro...
    if (!(parseInt(status.status) === -1)) {
      // Se não houver projeto selecionado, filtre só por status...
      if (parseInt(projetoSelecionado) === -1) {
        // ! Filtrando o status selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) => parseInt(tarefa.status) === parseInt(status.status)
        );
      }
      //Se houver projeto selecionado, filtre por ambos
      else {
        // ! Filtrando o status e projeto selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) =>
            parseInt(tarefa.status) === parseInt(status.status) &&
            parseInt(tarefa.projetoTarefa) === parseInt(projetoSelecionado)
        );
      }
    }
    //Se for todos, reitere o filtro...
    else {
      // Se não houver projeto selecionado, não filtre
      if (parseInt(projetoSelecionado) === -1) {
        nvListaTarefas = listaTarefas;
      }
      //Se houver projeto selecionado, filtre por ele
      else {
        // ! Filtrando o projeto selecionado
        nvListaTarefas = listaTarefas.filter(
          (tarefa) =>
            parseInt(tarefa.projetoTarefa) === parseInt(projetoSelecionado)
        );
      }
    }
    setListaTarefasFiltrada(nvListaTarefas);
  };

  // ! Buscando todas as tarefas do sistema..
  const getTarefas = (usuario) => {
    Axios.put(`${serverPrefix}/api/tarefas-view/usuario`, {
      email: usuario,
    }).then((response) => {
      setListaTarefas(response.data);
      setListaTarefasFiltrada(response.data);

      // ! Filtrando projetos diferentes das tarefas do usuario
      const proj = [
        ...new Map(
          response.data.map((item) => [item["projetoTarefa"], item])
        ).values(),
      ];

      let projCerto = [{ projetoTarefa: -1, nomeProjeto: "Todos" }];

      for (let i = 0; i < proj.length; i++) {
        console.log(proj[i]);
        projCerto.push({
          projetoTarefa: proj[i].projetoTarefa,
          nomeProjeto: proj[i].nomeProjeto,
        });
      }

      setSelectProjetos(projCerto);
      setJaCarregou(true);

      //Definindo todos como padrão nos selects:
      /* setStatusSelecionado({ status: -1, descStatus: 'Todos' })
                 setProjetoSelecionado({ projetoTarefa: -1, nomeProjeto: 'Todos' })*/
    });
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

      <div className={jaCarregou ? "principalTimes" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container
            className="container-minha-tarefa"
            disableGutters
            sx={{ paddingTop: "0", display: "flex", margin: "0.5em 0" }}
            maxWidth="md"
          >
            <Container
              disableGutters
              className="divBotaoFim"
              sx={{
                paddingBottom: "1%",
                margin: "0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                className="botao-tarefas-sigo"
                variant="contained"
                color="success"
                startIcon={<FaBookOpen />}
                sx={{ display: "flex" }}
                onClick={tarefasSeguidas}
              >
                TAREFAS QUE SIGO
              </Button>
            </Container>

            <Container
              className="container-filtro-minhas-tarefas"
              sx={{ display: "flex", marginTop: "1.5em  " }}
              container
              spacing={4}
            >
              <Typography
                className="titulo-minhas-tarefas"
                gutterBottom
                variant="h5"
                sx={{ color: "fundoCard", fontWeight: 600 }}
              >
                Minhas tarefas
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
                  Filtrar Projeto
                </Typography>
                <Select
                  className="select-filtro-minhas-tarefas"
                  labelId="selectProjetos"
                  id="slctProj"
                  value={projetoSelecionado}
                  label="Projetos"
                  sx={{ backgroundColor: "fundoCard" }}
                >
                  {selectProjetos.map((projeto) => {
                    return (
                      <MenuItem
                        value={projeto.projetoTarefa}
                        key={"SLC_P_" + projeto.projetoTarefa}
                        onClick={(event) => filtrarProjeto(event, projeto)}
                        selected={projetoSelecionado === projeto}
                      >
                        {projeto.nomeProjeto}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

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
                overflow: "auto",
                display: "flex",
                marginBottom: "1.5em",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
              //overflow={'auto'}
              maxHeight={"70vh"}
            >
              {listaTarefasFiltrada.map((tarefa, index) => {
                return (
                  <Grow
                    in={true}
                    style={{ transformOrigin: "0 0 0" }}
                    key={"GRW_" + tarefa.idTarefa}
                    {...(true ? { timeout: (index + 1) * 250 } : {})}
                  >
                    <Box
                      sx={{
                        maxWidth: "100%",
                        margin: "0.5em 0.6em",
                        display: "flex",
                      }}
                    >
                      <Card
                        sx={{
                          width: "240px",
                          backgroundColor: "fundoCard",
                          display: "flex",
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
                  </Grow>
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

            <Button
              variant="contained"
              color="info"
              startIcon={<FaHandPointLeft />}
              onClick={voltar}
              sx={{ marginTop: "9px" }}
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

export default TarefasMinhas;
