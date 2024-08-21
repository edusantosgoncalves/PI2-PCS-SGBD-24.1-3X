import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesCriarTarefa.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  AlertTitle,
  TextField,
  CssBaseline,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const CriarTarefaPage = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
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

    getProjetos();
  }, []);

  // ! Definindo variável (um array de objetos) que vai receber todas as iterações do projeto
  const [listaIteracoes, setListaIteracoes] = React.useState([
    {
      codIteracao: "",
      nome: "",
    },
  ]);

  // ! Adiciona um projeto a uma lista para exibição
  const [iteracaoSelecionada, setIteracaoSelecionada] = React.useState("");

  // ! Definindo variável que vai receber os valores do radioButton
  const radioButtons = ["Em andamento", "Concluída"];

  // ! A cada troca de projeto, busque os usuariosRelacionados
  const iteracaoChange = (itera) => {
    setIteracaoSelecionada(itera);
  };

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getIteracoes = (codProjeto) => {
    Axios.get(`${serverPrefix}/api/projetos/${codProjeto}/iteracoes`).then(
      (response) => {
        console.log(response.data);
        setIteracaoSelecionada("");
        setListaIteracoes(response.data);
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
        setUsuarioSelecionado("");
        setListaUsuarios(response.data);
      }
    );
  };

  const [usuarioSelecionado, setUsuarioSelecionado] = React.useState("");

  // ! Adiciona um integrante a uma variável
  const usuarioChange = (usuario) => {
    setUsuarioSelecionado(usuario);
  };

  // ! Buscando todos os projetos do bd para preencher a tabela.
  const getProjetos = () => {
    Axios.get(`${serverPrefix}/api/projetos`).then((response) => {
      setListaProjetos(response.data);
    });
  };

  // ! Adiciona um projeto a uma lista para exibição
  const [projetoSelecionado, setProjetoSelecionado] = React.useState("");

  // ! A cada troca de projeto, busque os usuariosRelacionados
  const projetoChange = (proj) => {
    if (proj === null) {
      return;
    }

    setProjetoSelecionado(proj);
    getUsuarios(proj.codProjeto);
    getIteracoes(proj.codProjeto);
  };

  // ! Variável que recebe os projetos do sistema.
  const [listaProjetos, setListaProjetos] = React.useState([
    {
      codProjeto: "",
      nome: "",
      timeResponsavel: "",
    },
  ]);

  // ! Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // ! Variável que seta o status selecionado pelo usuario, por padrão, mantem-se o estado "Padrão"
  const [statusCodSlc, setStatusCodSlc] = React.useState(1);
  const [statusSlc, setStatusSlc] = React.useState("Em andamento");

  // ! Função que muda o status da tarefa
  const mudaStatus = (e) => {
    const newValue = {
      "Em andamento": 1,
      Concluída: 3,
    };
    let newStatus = newValue[e.target.value];
    setStatusSlc(e.target.value);
    setStatusCodSlc(newStatus);
  };

  // ! Função que cria o time com os integrantes e projetos
  const criarTarefa = () => {
    //Validando inputs do usuário...
    if (document.getElementById("nome-tarefa").value === "") {
      setAbreNaoPode(true);
      setMsgAlerts("O campo nome da tarefa é obrigatório!");
      return;
    }

    // ! verificar também se tem usuario e iteração selecionados!!!
    if (usuarioSelecionado.hasOwnProperty("idUsuario") === false) {
      setAbreNaoPode(true);
      setMsgAlerts("A seleção de um usuário é obrigatória!");
      return;
    }

    if (iteracaoSelecionada.hasOwnProperty("codIteracao") === false) {
      setAbreNaoPode(true);
      setMsgAlerts("A seleção de uma iteração é obrigatória!");
      return;
    }

    // ! Verificando se o usuário selecionado pertence ao time do projeto selecionado
    let vrfUsuarioProjeto = false;

    for (let i = 0; i < listaUsuarios.length; i++) {
      if (listaUsuarios[i].email === usuarioSelecionado.email) {
        console.log("É!!!");
        vrfUsuarioProjeto = true;
      }
    }

    if (vrfUsuarioProjeto === true) {
      Axios.post(`${serverPrefix}/api/tarefas`, {
        nome: document.getElementById("nome-tarefa").value,
        descricao: document.getElementById("txt-descricao").value,
        status: statusCodSlc,
        idIteracao: iteracaoSelecionada.codIteracao,
        usuarioResp: usuarioSelecionado.idUsuario,
      }).then((respostaCriaTarefa) => {
        console.log(respostaCriaTarefa);
        if (respostaCriaTarefa.status === 200) {
          setSair(true);
          setMensagem("Tarefa criada");
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

  const [nomeValido, setNomeValido] = React.useState(false);

  const validaNome = () => {
    const phraseRegex = new RegExp(/\b\w+\b \b\w+\b/);
    console.log(document.getElementById("nome-tarefa").value);
    if (phraseRegex.test(document.getElementById("nome-tarefa").value)) {
      console.log("nome válido");
      setNomeValido(true);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className="nova-tarefa">
        <BarraLogo locationState={locationState}></BarraLogo>

        <div className="principal-nova-tarefa">
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography
              className="nome-acao"
              variant="h3"
              component="h1"
              sx={{ display: "flex", marginTop: "2%", marginBottom: "0" }}
            >
              Nova Tarefa
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
                    //onChange={validaNome}
                    //error={nomeValido ? true : false}
                    //inputProps={{ helperText: 'Nome inválido' }}
                  ></TextField>
                </Container>

                <Container
                  sx={{ display: "flex" }}
                  className="containerDados container-projetos-tarefas"
                >
                  <Typography variant="body" component="h5" gutterBottom>
                    Projetos:
                  </Typography>
                  {/* <Autocomplete
                                        id="projetoSelecionado"
                                        options={listaProjetos}
                                        getOptionLabel={(option) => option.nome}
                                        sx={{ marginLeft: '20px', width: '50%' }}
                                        renderInput={(params) => <TextField {...params} label="Escolha um projeto..." variant="outlined" />}
                                        onChange={(event, newValue) => {
                                            projetoChange(newValue);
                                        }}
                                    /> */}

                  <Select
                    id="projetoSelecionado"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                  >
                    {listaProjetos.map((projeto) => (
                      <MenuItem
                        value={projeto.codProjeto}
                        key={"PROJ_" + projeto.codProjeto}
                        onClick={() => projetoChange(projeto)}
                        selected={projetoSelecionado === projeto}
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
                  {/* <Autocomplete
                                        id="iteracaoSelecionada"
                                        options={listaIteracoes}
                                        getOptionLabel={(option) => option.nome}                               
                                        sx={{ marginLeft: '20px', width: '50%' }}
                                        renderInput={(params) => <TextField {...params} label="Escolha uma iteração..." variant="outlined" />}
                                        onChange={(event, newValue) => {                                            
                                            iteracaoChange(newValue);
                                        }}
                                    /> */}

                  <Select
                    id="iteracaoSelecionada"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                  >
                    {listaIteracoes.map((itera) => (
                      <MenuItem
                        value={itera.codIteracao}
                        key={"USU_" + itera.codIteracao}
                        onClick={() => iteracaoChange(itera)}
                        selected={iteracaoSelecionada === itera}
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
                  {/* <Autocomplete
                                        id="integranteSelecionado"
                                        options={listaUsuarios}
                                        getOptionLabel={(option) => option.nome}
                                        sx={{ marginLeft: '20px', width: '50%' }}
                                        renderInput={(params) => <TextField {...params} label="Escolha um usuário..." variant="outlined" />}
                                        onChange={(event, newValue) => {
                                            usuarioChange(newValue);
                                        }}
                                    /> */}

                  <Select
                    id="integranteSelecionado"
                    variant="outlined"
                    sx={{ marginLeft: "20px", width: "50%" }}
                  >
                    {listaUsuarios.map((usuario) => (
                      <MenuItem
                        value={usuario.email}
                        key={"USU_" + usuario.email}
                        onClick={() => usuarioChange(usuario)}
                        selected={usuarioSelecionado === usuario}
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
                    onClick={criarTarefa}
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
            <AlertTitle>Não é possível</AlertTitle>
            {msgAlerts}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default CriarTarefaPage;
