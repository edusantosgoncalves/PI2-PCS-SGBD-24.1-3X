import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesAlterarTarefa.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const TarefasAlterar = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    tarefa: "",
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
      localStorage.hasOwnProperty("usuario") === false ||
      localStorage.hasOwnProperty("tarefa") === false
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
    let tarefaLS = JSON.parse(localStorage.getItem("tarefa"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS, tarefa: tarefaLS });

    getProjetos();
    getIteracoes(tarefaLS.projetoTarefa);
    getUsuarios(tarefaLS.projetoTarefa);

    //Setando valores para os campos
    document.getElementById("nome-tarefa").value = tarefaLS.nome;
    document.getElementById("txt-descricao").value = tarefaLS.descricao;
    setCodProjetoSelecionado(tarefaLS.projetoTarefa);
    setIdIteracaoSelecionada(tarefaLS.idIteracao);
    setEmailUsuarioSelecionado(tarefaLS.emailUsuarioResp);

    //Vrf se é pendente (analisar se podemos deixar condicional uma tarefa ser criada necessariamente com um usuario...)
    switch (tarefaLS.status) {
      case 1:
      case 2:
        setStatusSlc("Em andamento");
        break;
      case 3:
        setStatusSlc("Concluída");
        break;
      case 4:
        setStatusSlc("Inativada");
        break;
    }
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Definindo variável que vai receber os valores do radioButton
  const radioButtons = ["Em andamento", "Concluída", "Inativada"];

  // ! Definindo variável (um array de objetos) que vai receber todas as iterações do projeto
  const [listaIteracoes, setListaIteracoes] = React.useState([
    {
      codIteracao: "",
      nome: "",
    },
  ]);

  // ! Adiciona um projeto a uma lista para exibição
  const [idIteracaoSelecionada, setIdIteracaoSelecionada] = React.useState("");

  // ! A cada troca de projeto, busque os usuariosRelacionados
  const iteracaoChange = (itera) => {
    setIdIteracaoSelecionada(itera.target.value);
  };

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getIteracoes = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/iteracoes`).then(
      (response) => {
        setListaIteracoes(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Definindo variável (um array de objetos) que vai receber todos os usuários do sistema
  const [listaUsuarios, setListaUsuarios] = React.useState([
    {
      email: "",
      nome: "",
    },
  ]);

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getUsuarios = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/usuarios`).then(
      (response) => {
        setListaUsuarios(response.data);
      }
    );
  };

  const [emailUsuarioSelecionado, setEmailUsuarioSelecionado] =
    React.useState("");

  // ! Adiciona um integrante a uma variável
  const usuarioChange = (usuario) => {
    setEmailUsuarioSelecionado(usuario.target.value);
  };

  // ! Buscando todos os projetos do bd para preencher a tabela.
  const getProjetos = () => {
    Axios.get(`${serverPrefix}/api/projetos`).then((response) => {
      setListaProjetos(response.data);
    });
  };

  // ! Adiciona um projeto a uma lista para exibição
  const [codProjetoSelecionado, setCodProjetoSelecionado] = React.useState("");

  // ! A cada troca de projeto, busque os usuariosRelacionados
  const projetoChange = (proj) => {
    getUsuarios(proj.codProjeto);
    getIteracoes(proj.codProjeto);
    setCodProjetoSelecionado(proj.codProjeto);
  };

  const [listaProjetos, setListaProjetos] = React.useState([
    {
      codProjeto: "",
      nome: "",
      timeResponsavel: "",
    },
  ]);

  //Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que cria o time com os integrantes e projetos
  const atualizaTarefa = () => {
    //Validando inputs do usuário...
    if (document.getElementById("nome-tarefa").value === "") {
      setAbreNaoPode(true);
      setMsgAlerts("O campo nome da tarefa é obrigatório!");
      return;
    }

    // ! verificar também se tem usuario e iteração selecionados!!!
    if (emailUsuarioSelecionado === "") {
      setAbreNaoPode(true);
      setMsgAlerts("A seleção de um usuário é obrigatória!");
      return;
    }

    if (idIteracaoSelecionada === "") {
      setAbreNaoPode(true);
      setMsgAlerts("A seleção de uma iteração é obrigatória!");
      return;
    }

    // ! Verificando se o usuário selecionado pertence ao time do projeto selecionado
    let vrfUsuarioProjeto = false;

    for (const usuario of listaUsuarios) {
      if (usuario.email === emailUsuarioSelecionado) {
        console.log("É!!!");
        vrfUsuarioProjeto = true;
      }
    }

    if (vrfUsuarioProjeto === true) {
      Axios.put(
        `${serverPrefix}/api/tarefas/${locationState.tarefa.idTarefa}`,
        {
          nome: document.getElementById("nome-tarefa").value,
          descricao: document.getElementById("txt-descricao").value,
          status: statusCodSlc,
          idIteracao: idIteracaoSelecionada,
          usuarioResp: emailUsuarioSelecionado,
        }
      ).then((respostaCriaTarefa) => {
        if (respostaCriaTarefa.status === 200) {
          setSair(true);
          setMensagem(
            document.getElementById("nome-tarefa").value + " foi atualizada!"
          );
        }
      });
    } else {
      setAbreNaoPode(true);
      setMsgAlerts("Selecione um usuário pertencente ao projeto selecionado!");
    }
  };

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    redirect(
      "/tarefas/adm" //, { state: { admin: true, usuario: locationState.usuario } }
    );
  };

  // ! Variável que seta o status selecionado pelo usuario, por padrão, mantem-se o estado "Em andamento"
  const [statusCodSlc, setStatusCodSlc] = React.useState(1);
  const [statusSlc, setStatusSlc] = React.useState("Em andamento");

  // ! Função que muda o status da tarefa
  const mudaStatus = (e) => {
    const newValue = {
      "Em andamento": 1,
      Concluída: 3,
      Inativada: 4,
    };
    let newStatus = newValue[e.target.value];
    setStatusSlc(e.target.value);
    setStatusCodSlc(newStatus);
  };

  return (
    <>
      <CssBaseline />
      <div className="mainCria">
        <BarraLogo locationState={locationState}></BarraLogo>

        <Container sx={{ display: "flex" }} className="principalCriaTime">
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography
              className="nome-acao"
              variant="h3"
              component="h1"
              sx={{ display: "flex", marginTop: "2%", marginBottom: "0" }}
            >
              Alterar Tarefa
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
                    id="nome-tarefa"
                    required
                    variant="outlined"
                    sx={{ maxHeight: "3px", marginLeft: "20px" }}
                  ></TextField>
                </Container>

                <Container
                  sx={{ display: "flex" }}
                  className="container-projetos-tarefas containerDados"
                >
                  <Typography variant="body" component="h5" gutterBottom>
                    Projetos:
                  </Typography>
                  <Select
                    id="projetoSelecionado"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                    value={codProjetoSelecionado}
                    //onChange={(e) => projetoChange(e)}
                  >
                    {listaProjetos.map((projeto) => (
                      <MenuItem
                        value={projeto.codProjeto}
                        key={"PROJ_" + projeto.codProjeto}
                        onClick={() => projetoChange(projeto)}
                        //selected={codProjetoSelecionado === projeto.codProjeto}
                      >
                        {projeto.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </Container>

                <Container sx={{ display: "flex" }} className="containerDados">
                  <Typography variant="body" component="h5" gutterBottom>
                    Iteração:
                  </Typography>
                  <Select
                    id="iteracaoSelecionada"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                    value={idIteracaoSelecionada}
                    onChange={(e) => iteracaoChange(e)}
                  >
                    {listaIteracoes.map((itera) => (
                      <MenuItem
                        value={itera.codIteracao}
                        key={"USU_" + itera.codIteracao}
                        //onClick={() => iteracaoChange(itera)}
                        //selected={iteracaoSelecionada === itera}
                      >
                        {itera.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </Container>

                <Container sx={{ display: "flex" }} className="containerDados">
                  <Typography variant="body" component="h5" gutterBottom>
                    Usuário atribuído:
                  </Typography>
                  <Select
                    id="integranteSelecionado"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                    value={emailUsuarioSelecionado}
                    onChange={(e) => usuarioChange(e)}
                  >
                    {listaUsuarios.map((usuario) => (
                      <MenuItem
                        value={usuario.email}
                        key={"USU_" + usuario.idUsuario}
                        //onClick={() => usuarioChange(usuario)}
                        //selected={usuarioSelecionado === usuario}
                      >
                        {usuario.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </Container>

                <Container
                  className="container-bottom-alterar-tarefas"
                  sx={{ display: "flex" }}
                >
                  <Container
                    className="containerDados container-descricao"
                    sx={{ display: "flex" }}
                  >
                    <Typography variant="body" component="h5" gutterBottom>
                      Descricao:
                    </Typography>
                    <TextField
                      id="txt-descricao"
                      //label="Multiline"
                      placeholder="Escreva a descrição da tarefa"
                      multiline
                      minRows={6}
                      maxRows={6}
                      // variant="outlined"
                    />
                  </Container>

                  <Container
                    sx={{ display: "flex", flexDirection: "column" }}
                    className="container-status-tarefa"
                  >
                    <Typography variant="body" component="h5" gutterBottom>
                      Status da tarefa:
                    </Typography>
                    {radioButtons.map((value) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="radio-group"
                          {...(value === statusSlc
                            ? { checked: true }
                            : { checked: false })}
                          onChange={(e) => mudaStatus(e)}
                          value={value}
                        />
                        <span className="radio">
                          <span />
                        </span>
                        <span>{value}</span>
                      </label>
                    ))}
                    {/* <FormControl>
                                            {//<FormLabel id="radio-status">Defina o status da Tarefa:</FormLabel>
                                            }
                                            <RadioGroup
                                                aria-labelledby="radio-status"
                                                value={statusSlc}
                                                defaultValue={1}
                                                id="radiogroup-status"
                                                onChange={(e) => mudaStatus(e)}
                                            >
                                                <FormControlLabel value={1} control={<Radio />} label="Padrão" />
                                                <FormControlLabel value={3} control={<Radio />} label="Concluída" />
                                                <FormControlLabel value={4} control={<Radio />} label="Inativada" />
                                            </RadioGroup>
                                        </FormControl> */}
                  </Container>
                </Container>

                <Container className="containerSalvar" sx={{ display: "flex" }}>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={atualizaTarefa}
                    sx={{ width: "20%" }}
                  >
                    Atualizar
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

export default TarefasAlterar;