import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CssBaseline,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  AlertTitle,
  Chip,
  Autocomplete,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft, FaPlusCircle } from "react-icons/fa";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";
import CriarIteracao from "../../Iteracoes/CriarIteracao";

const ProjetosCriar = () => {
  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

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

    // !! Validando se o usuário é adm (se não for, não acessa)
    if (localStorage.getItem("admin") === "false") {
      redirect(-1);
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });

    buscarTodosTimesAtivos();
  }, []);

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    if (saiDaPagina === true) {
      redirect(-1);
    }
  };

  // ! Declarando variável que vai receber a lista de times
  const [listaTimes, setListaTimes] = React.useState([
    {
      codTime: "",
      nome: "",
      dtCriacao: "",
      ativo: "",
      qtdPess: "",
      qtdProj: "",
    },
  ]);

  const [timeSelecionado, setTimeSelecionado] = React.useState("");

  const buscarTodosTimesAtivos = () => {
    Axios.get(`${serverPrefix}/api/timesAtivos`).then((response) => {
      console.log(response.data); // TESTE -
      setListaTimes(response.data);
    });
  };

  //Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que cria o projeto com o time e iterações
  const criarProjeto = () => {
    if (
      document.getElementById("nome-projeto").value.trim() === "" ||
      eNomeValido === false
    ) {
      setAbreNaoPode(true);
      setMsgAlerts("O campo nome do projeto é obrigatório!");
      return;
    }

    if (timeSelecionado === "") {
      setAbreNaoPode(true);
      setMsgAlerts("É necessário selecionar o time!");
      return;
    }

    if (listaIteracoes.length === 0) {
      setAbreNaoPode(true);
      setMsgAlerts("É necessário criar ao menos 1 iteração!");
      return;
    } else {
      Axios.post(`${serverPrefix}/api/projetos`, {
        nome: document.getElementById("nome-projeto").value.trim(),
        descricao: document.getElementById("txt-descricao").value,
        timeResponsavel: timeSelecionado.codTime,
        ativo: 1,
        listaIteracoes: listaIteracoes,
      }).then((respostaCriaTime) => {
        console.log("recebi resposta");
        console.log(respostaCriaTime);
        setMensagem(
          document.getElementById("nome-projeto").value + " criado com sucesso!"
        );
        setSaiDaPagina(true);
        setSair(true);
      });
    }
  };

  // ! Controlando mudança de time no Select
  const timeChange = (time) => {
    setTimeSelecionado(time);
    console.log(time);
  };

  // ! Declarando variável que vai receber a lista de iterações conforme a criação
  const [listaIteracoes, setListaIteracoes] = React.useState([]);

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [saiItera, setSaiItera] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const sairItera = () => {
    setSaiItera(false);
  };

  // ! Função que abre o dialog de criar iteração
  const abreItera = () => {
    console.log(listaIteracoes);
    setSaiItera(true);
  };

  // ! Função que adicão a iteração criada a lista de iterações
  const criarIteracao = (nome, descricao, dtInicio, dtFim) => {
    setListaIteracoes([
      ...listaIteracoes,
      {
        nome: nome,
        descricao: descricao,
        dtInicio: dtInicio,
        dtConclusao: dtFim,
      },
    ]);
    setSaiItera(false);
  };

  // ! Função que remove uma iteração da lista de iterações criada
  const removeIteracao = (iteracao) => {
    const novaListaIteracoes = listaIteracoes.filter(
      (item) => item !== iteracao
    );
    setListaIteracoes(novaListaIteracoes);
  };

  //! Constantes que recebem se o nome é valido ou não
  const [eNomeValido, setENomeValido] = React.useState(false);
  const [labelNome, setLabelNome] = React.useState("Inválido: Nome vazio!");

  // ! Função que valida se o nome é possível (consultando se já há um existente no BD)
  const validarNome = () => {
    //Validando inputs do usuário...
    if (document.getElementById("nome-projeto").value === "") {
      setENomeValido(false);
      setLabelNome("Inválido: Nome vazio!");
    }

    Axios.post(`${serverPrefix}/api/projetos/validaNome`, {
      nome: document.getElementById("nome-projeto").value,
    }).then((respostaValida) => {
      console.log(respostaValida);
      if (respostaValida.data === true) {
        setENomeValido(true);
        setLabelNome("Válido!");
      } else {
        setENomeValido(false);
        setLabelNome("Inválido: Projeto já existente!");
      }
    });
  };

  // ! Variável que controla se o popup é pra voltar pra página anterior ou se manter na página atual
  const [saiDaPagina, setSaiDaPagina] = React.useState(false);

  return (
    <>
      <CssBaseline />
      <div className="mainCria">
        <BarraLogo locationState={locationState}></BarraLogo>

        <Container sx={{ display: "flex" }} className="principalCriaTime">
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography className="nome-acao" variant="h3" component="h1">
              Novo Projeto
            </Typography>
            <Container sx={{ height: "100%" }} maxWidth="md">
              <Box
                sx={{
                  marginTop: "0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
                className="boxNovoTime"
              >
                <Container
                  className="container-nome-tarefa"
                  sx={{ display: "flex" }}
                >
                  <Typography variant="body" component="h5" gutterBottom>
                    Nome:
                  </Typography>

                  <TextField
                    id="nome-projeto"
                    placeholder="Projeto ABC"
                    required
                    variant="outlined"
                    sx={{
                      maxHeight: "3px",
                      marginLeft: "20px",
                      width: "inherit",
                    }}
                    onChange={validarNome}
                  ></TextField>
                </Container>

                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "0",
                  }}
                  maxWidth="md"
                >
                  <Typography
                    variant="body2"
                    component="body2"
                    gutterBottom
                    sx={{
                      color: eNomeValido ? "#015001" : "var(--vermelho)",
                      backgroundColor: "#b6a1e4a9",
                      fontWeight: "500",
                      borderRadius: "0.2em",
                      padding: "0.2em 0.1em 0.1em 0.2em",
                      margin: "0.5em 0 0 0",
                    }}
                  >
                    {labelNome}
                  </Typography>
                </Container>

                <Container
                  className="containerDados"
                  sx={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Container sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body" component="h5" gutterBottom>
                      Time:
                    </Typography>
                    <Autocomplete
                      id="timeSelecionado"
                      options={listaTimes}
                      getOptionLabel={(option) => option.nome}
                      sx={{ marginLeft: "20px", width: "50%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Escolha um time ativo"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        timeChange(newValue);
                      }}
                    />

                    {/* <Select
                                            id="timeSelecionado"
                                            variant="outlined"
                                            sx={{ marginLeft: '20px', width: '50%' }}>
                                            {listaTimes.map((time) => (
                                                <MenuItem
                                                    value={time.codTime}
                                                    key={"USU_" + time.codTime}
                                                    onClick={() => timeChange(time)}
                                                    selected={timeSelecionado === time}
                                                >
                                                    {time.nome}
                                                </MenuItem>
                                            ))}
                                        </Select> */}
                  </Container>
                </Container>

                {
                  <Container
                    sx={{ display: "flex" }}
                    className="containerDados"
                  >
                    <Container sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body" component="h5" gutterBottom>
                        Iterações:
                      </Typography>

                      <Button
                        color="success"
                        variant="contained"
                        // startIcon={<FaPlusCircle />}
                        onClick={abreItera}
                        sx={{ marginLeft: "0.5em" }}
                      >
                        <FaPlusCircle size={15} />
                      </Button>
                    </Container>
                    <Container
                      className="containerDados"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        padding: "0%",
                        flexWrap: "wrap",
                        margin: "0.5em",
                      }}
                    >
                      {listaIteracoes.map((iteracao) => {
                        if (iteracao.hasOwnProperty("nome")) {
                          // ERIC, PRECISO REMOVER O PRIMEIRO ELEMENTO QUE É VAZIO, FAÇA PFV...
                          return (
                            <Chip
                              className={iteracao.nome === "" ? "ocultar" : ""}
                              key={"ITERA_CHIP_" + iteracao.nome}
                              label={iteracao.nome}
                              sx={{
                                margin: "0.2em 0.2em 0",
                                "&:hover": {
                                  backgroundColor: "#fd8f90",
                                },
                              }}
                              onDelete={() => removeIteracao(iteracao)}
                            />
                          );
                          /*return <ListItem
                                                        className={iteracao.nome === '' ? 'ocultar' : ''}
                                                        value={iteracao.nome}
                                                        key={"ITERA_SLC_" + iteracao.nome + iteracao.dtInicio + iteracao.dtFim}
                                                    >
                                                        <Button onClick={() => removeIteracao(iteracao)}>
                                                            {<CancelIcon color="cancel" />}
                                                        </Button>
                                                        <ListItemText primary={iteracao.nome} />
                                                    </ListItem>;*/
                        }
                      })}
                    </Container>
                  </Container>
                }

                <Container
                  className="containerDados container-descricao"
                  sx={{ display: "flex" }}
                >
                  <Typography variant="body" component="h5" gutterBottom>
                    Descricao:
                  </Typography>
                  <TextField
                    id="txt-descricao"
                    label="Descrição"
                    placeholder="Escreva a descrição do projeto"
                    multiline
                    minRows={4}
                    maxRows={4}
                    sx={{ width: "inherit" }}
                  />
                </Container>

                <Container className="containerSalvar" sx={{ display: "flex" }}>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={criarProjeto}
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
          <CriarIteracao
            saiItera={saiItera}
            sairItera={sairItera}
            criarIteracao={criarIteracao}
          />
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
      </div>
    </>
  );
};

export default ProjetosCriar;
