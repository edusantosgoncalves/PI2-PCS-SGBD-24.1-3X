import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  CssBaseline,
  Grid,
  Snackbar,
  Alert,
  AlertTitle,
  Chip,
  Tooltip,
  Backdrop,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft, FaPlusCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";
import CriarIteracao from "../../Iteracoes/CriarIteracao";
import AlteraIteracao from "../../Iteracoes/AlteraIteracao";

const ProjetosAlterar = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    projeto: "",
  });

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

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

    // !! Validando se o usuário é adm (se não for, não acessa)
    if (localStorage.getItem("admin") === "false") {
      redirect(-1);
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

    //Inserindo-os nas variáveis
    buscarTodosTimes(projetoLS.timeResponsavel);
    getIteracoes(projetoLS.codProjeto);
    getDescricao(projetoLS.codProjeto);
    setandoNomeAoCarregar(projetoLS.nome);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

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

  const setandoNomeAoCarregar = (nome) => {
    document.getElementById("nome-projeto").value = nome;
    setENomeValido(true);
    setLabelNome("Válido!");
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

  const [codTimeSelecionado, setCodTimeSelecionado] = React.useState("");

  const buscarTodosTimes = (timeAtual) => {
    Axios.get(`${serverPrefix}/api/timesAtivos`).then((response) => {
      setListaTimes(response.data);
      setCodTimeSelecionado(timeAtual);
    });
  };

  //Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // Função que altera o projeto
  const alteraProjeto = () => {
    //Validando se o time do Projeto é o mesmo corrente:
    if (locationState.projeto.timeResponsavel !== codTimeSelecionado) {
      Axios.get(
        `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/qtdtarefas`
      ).then((resposta) => {
        if (resposta.data.qtdTarefas > 0) {
          setMsgAlerts(
            "Não é possível alterar o time, pois ainda há tarefas ativas associadas a ele!"
          );
          setAbreNaoPode(true);
          return;
        }

        if (
          document.getElementById("nome-projeto").value.trim() === "" ||
          eNomeValido === false
        ) {
          setAbreNaoPode(true);
          setMsgAlerts("O campo nome do projeto é obrigatório!");
          return;
        }

        if (listaIteracoes.length <= 1) {
          setAbreNaoPode(true);
          setMsgAlerts(
            "É necessário criar ao menos 1 iteração (sem contar a ITERAÇÃO PADRÃO)!"
          );
          return;
        } else {
          Axios.put(
            `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}`,
            {
              nome: document.getElementById("nome-projeto").value,
              descricao: document.getElementById("txt-descricao").value,
              timeResponsavel: codTimeSelecionado,
              ativo: 1,
            }
          ).then((respostaValida) => {
            console.log(respostaValida);
            if (respostaValida.status === 200) {
              setSair(true);
              setMensagem(
                document.getElementById("nome-projeto").value +
                  " foi atualizado!"
              );
              setSaiDaPagina(true);
            } else {
              setMsgAlerts(
                "Ocorreu algum erro ao alterar o projeto: \n" +
                  respostaValida.data.message
              );
              setAbreNaoPode(true);
            }
          });
        }
      });
    } else {
      if (
        document.getElementById("nome-projeto").value.trim() === "" ||
        eNomeValido === false
      ) {
        setAbreNaoPode(true);
        setMsgAlerts("O campo nome do projeto é obrigatório!");
        return;
      }

      if (listaIteracoes.length <= 1) {
        setAbreNaoPode(true);
        setMsgAlerts(
          "É necessário criar ao menos 1 iteração (sem contar a ITERAÇÃO PADRÃO)!"
        );
        return;
      }

      Axios.put(
        `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}`,
        {
          nome: document.getElementById("nome-projeto").value,
          descricao: document.getElementById("txt-descricao").value,
          timeResponsavel: codTimeSelecionado,
          ativo: 1,
        }
      ).then((respostaValida) => {
        console.log(respostaValida);
        if (respostaValida.status === 200) {
          setSair(true);
          setMensagem(
            document.getElementById("nome-projeto").value + " foi atualizado!"
          );
          setSaiDaPagina(true);
        } else {
          setMsgAlerts(
            "Ocorreu algum erro ao alterar o projeto: \n" +
              respostaValida.data.message
          );
          setAbreNaoPode(true);
        }
      });
    }
  };

  // ! Controlando mudança de time no Select
  const timeChange = (time) => {
    setCodTimeSelecionado(time.codTime);
    console.log(time.codTime);
  };

  // ! Função que retorna o nome do time do projeto
  const retornaNomeTime = (codTime) => {
    for (let i = 0; i < listaTimes.length; i++) {
      if (listaTimes[i].codTime === codTime) {
        return listaTimes[i].nome;
      }
    }
  };

  // ! Declarando variável que vai receber a lista de iterações conforme a criação
  const [listaIteracoes, setListaIteracoes] = React.useState([{}]);

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getIteracoes = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/iteracoes`).then(
      (response) => {
        setListaIteracoes(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [saiItera, setSaiItera] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de alterar projeto
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
    Axios.post(
      `${serverPrefix}/api/projetos/${locationState.projeto.codProjeto}/iteracao`,
      {
        nome: nome,
        descricao: descricao,
        dtInicio: dtInicio,
        dtFim: dtFim,
      }
    ).then((response) => {
      if (response.status === 200) {
        getIteracoes(locationState.projeto.codProjeto);
        setSaiItera(false);
        setMsgAlerts("A iteração " + nome + " foi adicionada.");
        setAbreAdd(true);
      }
    });
  };

  // ! Declarando variável que vai receber a iteracao a ser alterada
  const [iteracaoAlterada, setIteracaoAlterada] = React.useState();

  // ! Declarando variável que controlará o PopUp de Alterar iteração...
  const [saiIteraAlteracao, setSaiIteraAlteracao] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de alterar projeto
  const sairIteraAlteracao = () => {
    setSaiIteraAlteracao(false);
  };

  // ! Função que abre o dialog de alterar iteração
  const abreIteraAlteracao = (iteracao) => {
    if (
      iteracao.descricao !==
      "ITERAÇÃO GERAL DO PROJETO " + locationState.projeto.nome.toUpperCase()
    ) {
      Axios.get(
        `${serverPrefix}/api/projetos/${iteracao.codIteracao}/iteracao`
      ).then((response) => {
        console.log(response.data);

        if (response.status === 200) {
          setIteracaoAlterada(response.data);
          setSaiIteraAlteracao(true);
        }
      });
    } else {
      setMsgAlerts("A iteração padrão não pode ser alterada!");
      setAbreNaoPode(true);
    }
  };

  // ! Função que altera uma iteração
  const alterarIteracao = (codIteracao, nome, descricao, dtInicio, dtFim) => {
    Axios.put(`${serverPrefix}/api/projetos/${codIteracao}/iteracao`, {
      nome: nome,
      descricao: descricao,
      dtInicio: dtInicio,
      dtFim: dtFim,
    }).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        getIteracoes(locationState.projeto.codProjeto);
        setSaiIteraAlteracao(false);
        setMsgAlerts("A iteração " + nome + " foi atualizada.");
        setAbreAdd(true);
      }
    });
  };

  // ! Função que remove uma iteração da lista de iterações criada
  const removeIteracao = (iteracao) => {
    //Se for uma iteração já existente, validar se há o componente id
    if (iteracao.hasOwnProperty("codIteracao")) {
      if (
        iteracao.descricao !==
        "ITERAÇÃO GERAL DO PROJETO " + locationState.projeto.nome.toUpperCase()
      ) {
        //Validar se a iteração tem tarefas associadas...
        Axios.get(
          `${serverPrefix}/api/tarefas-itera/${iteracao.codIteracao}`
        ).then((response) => {
          if (response.data === 0) {
            //Remove a iteração da tabela...
            Axios.delete(
              `${serverPrefix}/api/projetos/${iteracao.codIteracao}/iteracao`
            ).then((resposta) => {
              if (resposta.status === 200) {
                setMsgAlerts("A iteração " + iteracao.nome + " foi removida!");
                setAbreRemove(true);

                //Ajustando lista
                let listaNova = listaIteracoes.filter(function (item) {
                  return item.codIteracao !== iteracao.codIteracao;
                });
                setListaIteracoes(listaNova);
              }
            });
          } else {
            setMsgAlerts(
              "A iteração ainda possui " +
                response.data +
                " tarefas associadas."
            );
            setAbreNaoPode(true);
          }
        });
      } else {
        setMsgAlerts("A iteração padrão não pode ser removida!");
        setAbreNaoPode(true);
      }
    } else {
      const novaListaIteracoes = listaIteracoes.filter(
        (item) => item !== iteracao
      );
      setListaIteracoes(novaListaIteracoes);
    }
  };

  //! Constantes que recebem se o nome é valido ou não
  const [eNomeValido, setENomeValido] = React.useState(false);
  const [labelNome, setLabelNome] = React.useState("Inválido!");

  // ! Função que valida se o nome é possível (consultando se já há um existente no BD)
  const validarNome = () => {
    //Validando inputs do usuário...
    if (document.getElementById("nome-projeto").value.trim() === "") {
      setENomeValido(false);
      setLabelNome("Inválido: Nome vazio!");
    } else if (
      document.getElementById("nome-projeto").value.trim() ===
      locationState.projeto.nome
    ) {
      setENomeValido(true);
      setLabelNome("Válido!");
    } else {
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
    }
  };

  // ! Variável que controla se o popup é pra voltar pra página anterior ou se manter na página atual
  const [saiDaPagina, setSaiDaPagina] = React.useState(false);

  // ! Função que busca a descricao de um projeto
  const getDescricao = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/descricao`).then(
      (response) => {
        document.getElementById("txt-descricao").value = response.data;
      }
    );
  };

  //! Variaveis q vao controlar os alerts:
  const [abreRemove, setAbreRemove] = React.useState(false);
  const [abreAdd, setAbreAdd] = React.useState(false);
  const [abreNaoPode, setAbreNaoPode] = React.useState(false);
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

  const fechaAlertNaoPode = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbreNaoPode(false);
  };

  return (
    <>
      <CssBaseline />
      <div className="mainCria">
        <BarraLogo locationState={locationState}></BarraLogo>

        <Container
          sx={{ display: "flex" }}
          className={jaCarregou ? "principalCriaTime" : "ocultar"}
        >
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography
              className="nome-acao"
              variant="h3"
              component="h1"
              sx={{ display: "flex", marginTop: "2%", marginBottom: "0" }}
            >
              Alterar Projeto
            </Typography>
            <Container sx={{ height: "100%" }} maxWidth="md">
              <Box className="boxNovoTime" sx={{ marginTop: "0" }}>
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
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
                    {eNomeValido
                      ? "Válido"
                      : "Inválido: Nome de projeto já existente"}
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
                    {/* <Autocomplete
                                            id="timeSelecionado"
                                            options={listaTimes}
                                            // inputValue={(option) => option.codTime === projetoLS.codTime ? option.nome : ''}
                                            getOptionLabel={(option) => option.nome}
                                            sx={{ marginLeft: '20px', width: '50%' }}
                                            renderInput={(params) => <TextField {...params} label="Time" />}
                                            onChange={(event, newValue) => {
                                                timeChange(newValue);
                                            }}
                                        /> */}

                    <Select
                      id="timeSelecionado"
                      variant="outlined"
                      sx={{ marginLeft: "20px", width: "50%" }}
                      value={codTimeSelecionado}
                    >
                      {listaTimes.map((time) => (
                        <MenuItem
                          value={parseInt(time.codTime)}
                          key={"USU_" + time.codTime}
                          onClick={() => timeChange(time)}
                          selected={codTimeSelecionado === time.codTime}
                        >
                          {time.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </Container>

                  {/*<Container
                                            sx={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Typography variant="body" component="h5" gutterBottom>
                                                Iterações:
                                            </Typography>

                                            <Button
                                                color="success"
                                                variant="contained"
                                                // startIcon={<FaPlusCircle />}
                                                onClick={abreItera}
                                            >
                                                <FaPlusCircle
                                                    size={15}
                                                />
                                            </Button>
                                                </Container>*/}
                </Container>

                <Container
                  className="containerDados"
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Container
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "200px",
                    }}
                  >
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

                  <Grid
                    className="containerDados"
                    overflow={"overlay"}
                    sx={{
                      display: "flex",
                      padding: "0%",
                      flexWrap: "wrap",
                      margin: "0.5em",
                      height: "200px",
                    }}
                  >
                    {listaIteracoes.map((iteracao, index) => {
                      if (iteracao.hasOwnProperty("nome")) {
                        return (
                          <Container gutterBottom sx={{ width: "260px" }}>
                            <Tooltip
                              title={iteracao.nome}
                              placement="top"
                              arrow
                            >
                              <Chip
                                className={
                                  iteracao.nome === "" ? "ocultar" : ""
                                }
                                key={"ITERA_CHIP_" + iteracao.nome}
                                label={iteracao.nome}
                                sx={{
                                  maxWidth: "85%",
                                  "&:hover": {
                                    backgroundColor: "#fd8f90",
                                  },
                                }}
                                onDelete={() => removeIteracao(iteracao)}
                              />
                            </Tooltip>
                            <FaEdit
                              size={30}
                              style={{
                                //backgroundColor: 'var(--cinza-claro-transparente)',
                                padding: "0.5em",
                                borderRadius: "0.5em",
                              }}
                              className="editar"
                              onClick={() => abreIteraAlteracao(iteracao)}
                            />
                          </Container>
                        );
                      }
                    })}
                  </Grid>
                </Container>

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
                    defaultValue=" "
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
                    onClick={alteraProjeto}
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
          <AlteraIteracao
            saiItera={saiIteraAlteracao}
            sairItera={sairIteraAlteracao}
            alterarIteracao={alterarIteracao}
            iteracao={iteracaoAlterada}
          />
          <CriarIteracao
            saiItera={saiItera}
            sairItera={sairItera}
            criarIteracao={criarIteracao}
          />
        </Container>
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
            <AlertTitle>Inserção/Alteração</AlertTitle>
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

        <div className={jaCarregou ? "ocultar" : "principal"}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress sx={{ color: "#CDC1F8" }} />
          </Backdrop>
        </div>
      </div>
    </>
  );
};

export default ProjetosAlterar;
