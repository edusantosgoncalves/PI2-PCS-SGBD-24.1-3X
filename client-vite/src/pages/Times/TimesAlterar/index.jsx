import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesAlteraTime.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  CssBaseline,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  AlertTitle,
  Chip,
  Backdrop,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";
//import { buscarTodosUsuarios } from '../../functions/UsuariosFunctions';

const AlterarTimePage = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    timeAlterar: "",
  });

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    // Validando se há dados no localstorage
    if (
      localStorage.hasOwnProperty("admin") === false ||
      localStorage.hasOwnProperty("usuario") === false ||
      localStorage.hasOwnProperty("timeAlterar") === false
    ) {
      redirect("/?acesso=" + 0);
      return;
    }

    // !! Validando se o usuário é adm (se não for, não acessa)
    if (localStorage.getItem("admin") === "false") {
      redirect(-1);
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));
    let timeAlterarLS = JSON.parse(localStorage.getItem("timeAlterar"));

    //Atribuindo-os a locationState
    setLocationState({
      admin: adminLS,
      usuario: usuarioLS,
      timeAlterar: timeAlterarLS,
    });
    retornarTime(timeAlterarLS.codTime);

    //Enchendo comboboxes
    buscarTodosUsuarios();
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

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

  // ! Declarando a função que vai retornar o time
  const retornarTime = (codTime) => {
    Axios.get(`${serverPrefix}/api/time/${codTime}`)
      .then((resposta) => {
        //console.log(resposta.data);

        setListaIntegrantes(resposta.data.usuarios);

        let timeAdd = resposta.data;
        delete timeAdd["usuarios"];
        delete timeAdd["projetos"];

        setTime(timeAdd);
        document.getElementById("nome-time").value = timeAdd.nome;
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // * ENCHENDO COMBOBOXES
  //! Variavel que recebera os usuarios pro ComboBox
  const [listaUsuariosComboBox, setListaUsuariosComboBox] = React.useState([
    { nome: "", email: "" },
  ]);

  // ! Função que busca e enche o combobox de Usuarios
  const buscarTodosUsuarios = () => {
    Axios.get(`${serverPrefix}/api/usuarios-ativos`).then((response) => {
      /* FILTRANDO DADOS DE CADA USUÁRIO PARA PREENCHER A TABELA... */
      const listaFiltrados = [];
      response.data.forEach((elemento) => {
        const { email, nome } = elemento;

        listaFiltrados.push({ email: email, nome: nome });
      });

      setListaUsuariosComboBox(listaFiltrados);
      setJaCarregou(true);
    });
  };

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    redirect(
      "/times" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // * FLUXOS DOS REMOVER E ALTERAR...

  // ! Declarando variável que vai receber o integrante selecionado do ComboBox
  const [integranteSelecionado, setIntegranteSelecionado] = React.useState("");

  // ! Adiciona um integrante a uma lista para exibição
  const integranteChange = (event, usuario) => {
    setIntegranteSelecionado(usuario);
  };

  const inserirNovoIntegrante = () => {
    Axios.post(`${serverPrefix}/api/times/${time.codTime}/usuarios`, {
      codTime: time.codTime,
      listaUsuarios: [integranteSelecionado],
    }).then((respostaCriaUsuarios) => {
      if (respostaCriaUsuarios.data.message) {
        setAbreAdd(true);
        setMsgAlerts(respostaCriaUsuarios.data.message);
      }
      console.log(respostaCriaUsuarios);
      //TERIA QUE VERIFICAR SE TA ADICIONANDO MESMO...
      retornarTime(time.codTime);
      setAbreAdd(true);
      setMsgAlerts(integranteSelecionado.nome + " adicionado ao time!");
    });
  };

  const removeIntegrante = (integrante) => {
    console.log(integrante);
    Axios.put(`${serverPrefix}/api/times/${time.codTime}/usuarioDelete`, {
      codTime: time.codTime,
      usuario: integrante.email,
    }).then((respostaDeleteUsuarios) => {
      if (respostaDeleteUsuarios.data.message) {
        setAbreRemove(true);
        setMsgAlerts(respostaDeleteUsuarios.data.message);
        return;
      }
      //TERIA QUE VERIFICAR SE TA ADICIONANDO MESMO...
      retornarTime(time.codTime);
      setAbreRemove(true);
      setMsgAlerts(integrante.nome + " removido do time!");
    });
  };

  //! Variavel que receberá projeto selecionado
  const [projetoSelecionado, setProjetoSelecionado] = React.useState({});

  // ! Adiciona um integrante a uma lista para exibição
  const projetoChange = (event, usuario) => {
    setProjetoSelecionado(usuario);
  };

  const finalizarTimes = () => {
    Axios.put(`${serverPrefix}/api/times/${time.codTime}/nome`, {
      nome: document.getElementById("nome-time").value,
    }).then((respostaAlteraNomeTime) => {
      console.log(respostaAlteraNomeTime);
      //TERIA QUE VERIFICAR SE TA ADICIONANDO MESMO...

      setMensagem(
        document.getElementById("nome-time").value + " atualizado com sucesso!"
      );
      setSair(true);
      retornarTime(time.codTime);
    });
  };

  //! Variaveis q vao controlar os alerts:
  const [abreRemove, setAbreRemove] = React.useState(false);
  const [abreAdd, setAbreAdd] = React.useState(false);
  const [msgAlerts, setMsgAlerts] = React.useState("");

  const fechaAlertAdd = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbreAdd(false);
  };

  const fechaAlertRemove = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbreRemove(false);
  };

  return (
    <>
      <CssBaseline />
      <div className="mainCria">
        <BarraLogo locationState={locationState}></BarraLogo>

        <div className={jaCarregou ? "principalCriaTime" : "ocultar"}>
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography
              className="nome-acao"
              variant="h3"
              component="h1"
              sx={{ display: "flex", marginTop: "2%", marginBottom: "0" }}
            >
              Alterar Time
            </Typography>
            <Container sx={{ height: "100%" }} maxWidth="md">
              <Box className="boxNovoTime" sx={{ marginTop: "0" }}>
                <Container className="containerNome" sx={{ display: "flex" }}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Nome:
                    <TextField
                      id="nome-time"
                      required
                      variant="outlined"
                      sx={{ maxHeight: "3px", marginLeft: "20px" }}
                    ></TextField>
                  </Typography>
                </Container>

                <Container className="containerDados" sx={{ display: "flex" }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Integrantes:
                  </Typography>
                  <Autocomplete
                    id="integranteSelecionado"
                    options={listaUsuariosComboBox.filter((cbox) =>
                      listaIntegrantes.every(
                        (integ) => integ.email !== cbox.email
                      )
                    )}
                    getOptionLabel={(option) => option.nome}
                    sx={{ marginLeft: "20px", width: "50%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Integrantes" />
                    )}
                    onChange={(event, value) => integranteChange(event, value)}
                  />

                  {/* <Select
                                        id="integranteSelecionado"
                                        variant="outlined"
                                        sx={{ marginLeft: '20px', width: '50%' }}>
                                        {
                                            // ! Removendo os integrantes já adicionados...
                                            (listaUsuariosComboBox.filter(
                                                cbox => listaIntegrantes.every(integ => integ.email !== cbox.email)
                                            )).map(integrante => {
                                                return <MenuItem
                                                    value={integrante.email}
                                                    key={"USU_" + integrante.email}
                                                    onClick={(event) => integranteChange(event, integrante)}
                                                    selected={integranteSelecionado === integrante}
                                                >
                                                    {integrante.nome}
                                                </MenuItem>;
                                            }
                                            )}
                                    </Select> */}
                  <Button
                    onClick={inserirNovoIntegrante}
                    variant="contained"
                    sx={{ marginLeft: "20px", width: "20%" }}
                  >
                    Incluir
                  </Button>
                </Container>

                <Container
                  className="containerExibeDados"
                  sx={{
                    display: "flex",
                    alignContent: "space-around",
                  }}
                >
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      p: 0.5,
                      m: 0,
                    }}
                  >
                    {listaIntegrantes.map((integrante) => {
                      return (
                        <Chip
                          key={"INT_CHIP_" + integrante.email}
                          label={integrante.nome}
                          sx={{
                            margin: "0.2em",
                            "&:hover": {
                              backgroundColor: "#fd8f90",
                            },
                          }}
                          onDelete={() => removeIntegrante(integrante)}
                        />
                      );
                    })}
                  </Container>
                </Container>

                <Container className="containerSalvar" sx={{ display: "flex" }}>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={finalizarTimes}
                    sx={{ width: "20%" }}
                  >
                    Salvar
                  </Button>
                </Container>
              </Box>

              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
              >
                Voltar
              </Button>
            </Container>
          </ThemeProvider>
          <PopupOKPersonalizado
            sair={sair}
            fecharDialog={fecharDialog}
            mensagem={mensagem}
          />

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={abreAdd}
            autoHideDuration={2500}
            onClose={fechaAlertAdd}
          >
            <Alert
              onClose={fechaAlertAdd}
              severity="success"
              sx={{ width: "100%" }}
            >
              <AlertTitle>Inserção</AlertTitle>
              {msgAlerts}
            </Alert>
          </Snackbar>

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
              <AlertTitle>Remoção</AlertTitle>
              {msgAlerts}
            </Alert>
          </Snackbar>
        </div>
      </div>
      <div className={jaCarregou ? "ocultar" : "principalTimes"}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress sx={{ color: "#CDC1F8" }} />
        </Backdrop>
      </div>
    </>
  );
};

export default AlterarTimePage;