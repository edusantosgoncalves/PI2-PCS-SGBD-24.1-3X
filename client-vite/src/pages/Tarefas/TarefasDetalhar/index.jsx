import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesDetalharTarefas.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Grid,
  Container,
  Typography,
  Card,
  Badge,
  Button,
  Link,
  CardContent,
  TextField,
  Chip,
  Avatar,
  Backdrop,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaPlusCircle,
  FaCircle,
  FaHandPointLeft,
} from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";
import BarraLogoSemAuth from "../../../components/BarraLogoSemAuth";

function TarefasDetalhar() {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    tarefa: "",
  });

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    // Validando se há dados no localstorage
    if (
      localStorage.hasOwnProperty("admin") === false ||
      localStorage.hasOwnProperty("usuario") === false ||
      localStorage.hasOwnProperty("tarefa") === false
    ) {
      redirect("/?acesso=" + 0);
      return;
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    let tarefaLS = JSON.parse(localStorage.getItem("tarefa"));

    //Atribuindo-os a locationState
    getTarefa(tarefaLS.codTarefa, usuarioLS, adminLS);
    //setLocationState({ admin: adminLS, usuario: usuarioLS, tarefa: tarefaLS })

    // ! Se for uma tarefa do usuario logado, marque a variavel como verdadeira
    if (tarefaLS.usuarioResp === usuarioLS.email) {
      setETarefaDoUsuario(true);
    }

    // ! Buscando comentários da tarefa e verificando se ela é seguida pelo usuário locago
    getComentarios(tarefaLS.codTarefa);
    vrfTarefaESeguida(tarefaLS.codTarefa, usuarioLS.email);
  }, []);

  // ! Declarando variável que receberá se a tarefa é do usuário ou não.
  const [eTarefaDoUsuario, setETarefaDoUsuario] = React.useState(false);

  // ! Declarando variavel que receberá todas as tarefas do sistema
  const [listaComentarios, setListaComentarios] = React.useState([
    {
      codComentarios: "",
      dtCriacao: "",
      descricao: "",
    },
  ]);

  // ! Buscando todas as tarefas do sistema..
  const getComentarios = (codTarefa) => {
    Axios.put(`${serverPrefix}/api/tarefas/${codTarefa}/comentarios`, {
      codTarefa: codTarefa,
    }).then((response) => {
      setListaComentarios(response.data);
    });
  };

  // ! Variável que armazena a cor para status de card
  const corStatus = {
    /* DETALHANDO STATUS...
            1 - Em andamento(quando tiver um usuário atribuído);
            3 - Concluído(quando tiver sido concluída por um usuário);
        */
    1: "#f3cc30",
    2: "#f3cc30",
    3: "#00bb00",
    4: "#f33030",
  };

  //! Declarando variável que definirá se a tarefa é seguida pelo usuario
  const [tarefaESeguida, setTarefaESeguida] = React.useState(false);

  //! Função que verifica se a tarefa é seguida pelo usuario
  const vrfTarefaESeguida = (tarefa, usuario) => {
    Axios.put(`${serverPrefix}/api/tarefas/${tarefa}/seguida`, {
      email: usuario,
    }).then((response) => {
      if (response.status === 200) setTarefaESeguida(true);
      else setTarefaESeguida(false);
    });
  };

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    redirect(-1);
  };

  // ! Função que deixará de seguir a tarefa corrente
  const deixarDeSeguirTarefa = () => {
    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuario.email}/tarefa/parar-seguir`,
      {
        codTarefa: locationState.tarefa.codTarefa,
      }
    ).then((response) => {
      if (response.status === 200) {
        setTarefaESeguida(false);
        setSair(true);
        setMensagem("A tarefa parou de ser seguida!");
      }
    });
  };

  // ! Função que seguirá a tarefa corrente
  const seguirTarefa = () => {
    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuario.email}/tarefa/seguir`,
      {
        codTarefa: locationState.tarefa.codTarefa,
      }
    ).then((response) => {
      if (response.status === 200) {
        setTarefaESeguida(true);
        setSair(true);
        setMensagem("A tarefa começou a ser seguida!");
        return;
      }
      setMensagem("Erro ao seguir a tarefa! " + response.message);
    });
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

  const [abreRemove, setAbreRemove] = React.useState(false);
  const [msgAlerts, setMsgAlerts] = React.useState("");
  // ! Função que insere um comentário na tarefa
  const inserirComentario = () => {
    console.log(locationState.tarefa.codTarefa);
    Axios.put(
      `${serverPrefix}/api/tarefas/${locationState.tarefa.codTarefa}/addcomentario`,
      {
        descricao: document.getElementById("txt_comentario").value,
        email: locationState.tarefa.usuarioResp,
      }
    ).then((response) => {
      if (response.status === 201) {
        Axios.put(
          `${serverPrefix}/api/tarefas/${locationState.tarefa.codTarefa}/seguidores`,
          {
            email: locationState.tarefa.usuarioResp,
            acao: "ADD",
            nomeTarefa: locationState.tarefa.nome,
            nomeRespTarefa: locationState.tarefa.nomeUsuarioResp,
            comentario: document.getElementById("txt_comentario").value,
          }
        ).then((resposta) => {
          if (resposta.status === 200) {
            setMsgAlerts(
              "Os usuários seguidores da tarefa e usuário receberão e-mails sobre o comentário!"
            );
            setAbreRemove(true);
          }
        });
        getComentarios(locationState.tarefa.codTarefa);
      }
    });
  };

  //! Função que verifica se a tarefa é seguida pelo usuario
  const concluiTarefa = () => {
    let msg = "";
    Axios.delete(
      `${serverPrefix}/api/tarefas/${locationState.tarefa.codTarefa}`
    ).then((response) => {
      if (response.status === 200) {
        msg = "A tarefa foi concluída!";
        Axios.put(
          `${serverPrefix}/api/tarefas/${locationState.tarefa.codTarefa}/seguidores`,
          {
            email: locationState.tarefa.usuarioResp,
            acao: "CONC",
            nomeTarefa: locationState.tarefa.nome,
            nomeRespTarefa: locationState.tarefa.nomeUsuarioResp,
            comentario: "",
          }
        ).then((resposta) => {
          if (resposta.status === 200) {
            msg = "A tarefa foi concluída e os e-mails disparados!";
          }
        });
        setMensagem(msg);
        setSair(true);
      }
    });
  };

  // !Função que busca tarefa:
  let getTarefa = (id, usuario, admin) => {
    Axios.get(`${serverPrefix}/api/tarefas/${id}`).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setLocationState({
          admin: admin,
          usuario: usuario,
          tarefa: response.data,
        });
      }
    });
  };

  // ! Loading enquanto carrega os dados da tarefa...
  if (locationState.tarefa === "") {
    return (
      <div className="detalhar-tarefa">
        <BarraLogoSemAuth />
        <div className="principal-detalha-tarefa">
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress sx={{ color: "#CDC1F8" }} />
          </Backdrop>
        </div>
      </div>
    );
  }

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que levará para a tela de seguir usuário (caso o usuario da tarefa seja outro)
  const detalharProjeto = (codProjeto) => {
    //Redirecionar o usuario para a página de seguir o outro usuario
    if (codProjeto !== null) {
      Axios.get(`${serverPrefix}/api/projetos/${codProjeto}`).then(
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

  //! Variaveis q vao controlar os alerts:
  const fechaAlertRemove = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbreRemove(false);
  };

  return (
    <div className="detalhar-tarefa">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <div className="principal-detalha-tarefa">
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container disableGutters sx={{ paddingTop: "0" }} maxWidth="md">
            <Grid
              sx={{ maxHeight: "100%", overflow: "auto", marginTop: "1.6em" }}
              item
              key={"Tarefa_" + locationState.tarefa.codTarefa}
              xs={12}
              sm={6}
              md={4}
            >
              <Card
                className="card-detalha-tarefa"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "var(--nvClaroFundo)",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{ fontWeight: "900" }}
                  >
                    {locationState.tarefa.nome}
                    <Tooltip
                      placement="top"
                      arrow
                      title={
                        locationState.tarefa.status === 1
                          ? "Em andamento"
                          : locationState.tarefa.status === 2
                          ? "Em andamento"
                          : locationState.tarefa.status === 3
                          ? "Concluída"
                          : "Inativada"
                      }
                    >
                      <Badge
                        sx={{
                          marginLeft: "0.8em",
                        }}
                        badgeContent={
                          <div>
                            <FaCircle
                              color={
                                corStatus[parseInt(locationState.tarefa.status)]
                              }
                              fontSize="1.7em"
                            />
                          </div>
                        }
                      ></Badge>
                    </Tooltip>
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    //className="links"
                    sx={{ fontWeight: "700" }}
                  >
                    {locationState.tarefa.descricao}
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    sx={{ fontWeight: "500" }}
                  >
                    <b>Responsável: </b>
                    <Link
                      underline="none"
                      color={"black"}
                      className={"link-underline-transicao"} // Se a tarefa for do usuario, aparece normal
                      onClick={() => {
                        detalharUsuario(locationState.tarefa.usuarioResp);
                      }}
                    >
                      {locationState.tarefa.nomeUsuarioResp}
                    </Link>
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    //className="links"
                    sx={{ fontWeight: "500" }}
                  >
                    <b>Projeto: </b>
                    <Link
                      underline="none"
                      color={"black"}
                      className={"link-underline-transicao"} // Se a tarefa for do usuario, aparece normal
                      onClick={() => {
                        detalharProjeto(locationState.tarefa.codProjeto);
                      }}
                    >
                      {locationState.tarefa.nomeProjeto}
                    </Link>
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    //className="links"
                    sx={{ fontWeight: "500" }}
                  >
                    <b>Iteração:</b> {locationState.tarefa.nomeIteracao}
                  </Typography>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    //className="links"
                    sx={{ fontWeight: "500" }}
                  >
                    <b>Anotações:</b>
                  </Typography>

                  <Container
                    className={
                      eTarefaDoUsuario &&
                      locationState.tarefa.status !== 3 &&
                      locationState.tarefa.status !== 4
                        ? "container-comentario-tarefa"
                        : "ocultar"
                    }
                    height="10px"
                    sx={{ display: "flex" }}
                  >
                    {/* <Typography variant="button">
                                            Adicionar comentário:
                                        </Typography> */}
                    <TextField
                      id="txt_comentario"
                      label="Adicionar comentário"
                      size="small"
                      //ERIC DIMINUI ESSE TEXTFIELD PLMDDS e coloca ele no canto esquerdo (flex-start)
                      className="text-field-comentario-tarefa"
                    ></TextField>
                    <Button
                      className={"botao-adicionar-comentario-tarefa"}
                      variant="contained"
                      color="info"
                      sx={{ display: "flex" }}
                      startIcon={<FaPlusCircle />}
                      onClick={inserirComentario}
                    >
                      COMENTAR
                    </Button>
                  </Container>
                  <Container
                    className={listaComentarios.length === 0 ? "ocultar" : ""}
                    disableGutters
                    key={"CT_COMENTS_" + locationState.tarefa.codTarefa}
                    sx={{
                      display: "flex",
                      flexDirection: "column", //backgroundColor: '#c5c5c5',
                      margin: "0.3em",
                      width: "fit-content",
                      borderRadius: "5px",
                    }}
                  >
                    {listaComentarios.map((comentario) => {
                      return (
                        <Chip
                          avatar={<Avatar src={comentario.urlImagem} />}
                          label={
                            comentario.nome +
                            " - " +
                            comentario.dtCriacao +
                            ":\n" +
                            comentario.descricao
                          }
                          variant="outlined"
                          sx={{
                            display: "flex",
                            margin: "0.2em",
                            backgroundColor: "#c5c5c5",
                            justifyContent: "flex-start",
                            flexGrow: 0,
                          }}
                        />
                      );
                    })}
                  </Container>
                  <Container
                    disableGutters
                    className="divBotaoFim"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: "0",
                    }}
                  >
                    <Button
                      className={
                        eTarefaDoUsuario && locationState.tarefa.status === 1
                          ? "botaoConcluir"
                          : "ocultar"
                      }
                      variant="contained"
                      color="success"
                      sx={{ display: "flex" }}
                      onClick={concluiTarefa}
                    >
                      CONCLUIR
                    </Button>
                  </Container>
                </CardContent>
              </Card>

              <Container
                disableGutters
                className="divBotaoFim"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0",
                }}
              >
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<FaHandPointLeft />}
                  onClick={voltar}
                  sx={{ marginBottom: "5%", width: "20%", maxHeight: "10%" }}
                >
                  Voltar
                </Button>

                {/* {
                                    !(eTarefaDoUsuario) && tarefaESeguida ?
                                        <Button className="botaoAlterar" variant="contained" color="error"
                                            sx={{ display: 'flex' }} startIcon={<FaRegTimesCircle />}
                                            onClick={deixarDeSeguirTarefa}
                                        >
                                            DEIXAR DE SEGUIR
                                        </Button>
                                        :
                                        <Button className="botaoAlterar" variant="contained" color="warning"
                                            sx={{ display: 'flex' }} startIcon={<FaRegCheckCircle />}
                                            onClick={seguirTarefa}
                                        >
                                            SEGUIR
                                        </Button>
                                } */}

                <Button
                  className={
                    eTarefaDoUsuario
                      ? "ocultar"
                      : tarefaESeguida
                      ? "botaoAlterar"
                      : "ocultar"
                  }
                  variant="contained"
                  color="error"
                  sx={{ display: "flex" }}
                  startIcon={<FaRegTimesCircle />}
                  onClick={deixarDeSeguirTarefa}
                >
                  DEIXAR DE SEGUIR
                </Button>

                <Button
                  className={
                    eTarefaDoUsuario
                      ? "ocultar"
                      : tarefaESeguida
                      ? "ocultar"
                      : "botaoAlterar"
                  }
                  variant="contained"
                  color="warning"
                  sx={{ display: "flex" }}
                  startIcon={<FaRegCheckCircle />}
                  onClick={seguirTarefa}
                >
                  SEGUIR
                </Button>
              </Container>
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
      <PopupOKPersonalizado
        sair={sair}
        fecharDialog={fecharDialog}
        mensagem={mensagem}
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={abreRemove}
        autoHideDuration={2500}
        onClose={fechaAlertRemove}
      >
        <Alert
          onClose={fechaAlertRemove}
          severity="warning"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Informativo</AlertTitle>
          {msgAlerts}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TarefasDetalhar;
