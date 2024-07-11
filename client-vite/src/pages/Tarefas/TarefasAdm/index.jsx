import React from "react";
import "./stylesTarefas.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports MUI e Joy
import { CssBaseline } from "@mui/material";
import { Container, Button, Backdrop, CircularProgress } from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  FaPlusCircle,
  FaBook,
  FaBookOpen,
  FaHandPointLeft,
  FaPencilAlt,
} from "react-icons/fa";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MenuLateral from "../../../components/MenuLateral";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const TarefasAdm = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

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

    getTarefas();
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

  // ! Declarando variável que será utilizada na tabela
  const [listaTarefasTBL, setListaTarefasTBL] = React.useState([
    {
      id: "" /* PRECISA TER UM ID PRA SE ORGANIZAR NA TBL... */,
      nome: "",
      descricao: "",
      nomeProjeto: "",
      nomeIteracao: "",
      nomeUsuarioResp: "",
      status: "",
    },
  ]);

  // ! Buscando todas as tarefas do sistema..
  const getTarefas = () => {
    Axios.get(`${serverPrefix}/api/tarefas`).then((response) => {
      console.log(response); // TESTE
      setListaTarefas(response.data);

      /* FILTRANDO DADOS DE CADA USUÁRIO PARA PREENCHER A TABELA... */
      const listaFiltrados = [];
      let contador = 1;
      response.data.forEach((elemento) => {
        let {
          nome,
          descricao,
          nomeProjeto,
          nomeIteracao,
          nomeUsuarioResp,
          status,
        } = elemento;

        /* AJUSTANDO STATUS...
                        1 - Em andamento(quando tiver um usuário atribuído);
                        2 - Pendente(quando não tiver usuário atribuído);
                        3 - Concluído(quando tiver sido concluída por um usuário);
                        4 - Inativada(quando tiver sido inativada); 
                    */

        let statusNovo = "Não reconhecido"; //Caso não esteja em nenhum dos escopos, defina não reconhecido..

        switch (status) {
          case 1:
            statusNovo = "Em andamento";
            break;
          case 2:
            statusNovo = "Pendente";
            break;
          case 3:
            statusNovo = "Concluído";
            break;
          case 4:
            statusNovo = "Inativada";
            break;
        }

        listaFiltrados.push({
          id: contador /* PRECISA TER UM ID PRA SE ORGANIZAR NA TBL... */,
          nome: nome,
          descricao: descricao,
          nomeProjeto: nomeProjeto,
          nomeIteracao: nomeIteracao,
          nomeUsuarioResp: nomeUsuarioResp,
          status: statusNovo,
        });
        contador = contador + 1;
      });

      setListaTarefasTBL(listaFiltrados);
      setJaCarregou(true);
      // TESTE - console.log(listaFiltrados)
    });
  };

  // ! Declarando variável que receberá o usuário selecionado a partir da tabela (será redirecionado para páginas de alteração...)
  const [tarefaSelecionada, setTarefaSelecionada] = React.useState({
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
  });

  // ! Definindo as colunas da tbl Usuario
  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "nomeProjeto",
      headerName: "Projeto",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "nomeIteracao",
      headerName: "Iteração",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "nomeUsuarioResp",
      headerName: "Responsável",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "headerTBL",
      flex: 2,
    },
  ];

  // ! Declarando variável booleana que receberá se teve uma tarefa selecionada a partir da tabela
  const [temTarefaSelecionada, setTemTarefaSelecionada] = React.useState(false);

  // ! Função que vai redirecionar o usuário para criação de uma nova tarefa
  const criarTarefa = () => {
    redirect(
      "/tarefas/criar" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Função que vai redirecionar o usuário para ver as suas tarefas
  const minhasTarefas = () => {
    redirect(
      "/tarefas" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Função que vai redirecionar o usuário para o detalhamento da tarefa selecionada
  const detalharTarefa = () => {
    //Setando tarefa no localStorage
    localStorage.setItem("tarefa", JSON.stringify(tarefaSelecionada));

    redirect(
      "/tarefas/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, tarefa: tarefaSelecionada } }
    );
  };

  // ! Função que vai redirecionar o usuário para a alteração da tarefa selecionada
  const alterarTarefa = () => {
    //Setando tarefa no localStorage
    localStorage.setItem("tarefa", JSON.stringify(tarefaSelecionada));

    redirect(
      "/tarefas/alterar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, tarefa: tarefaSelecionada } }
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
    <div className={"tarefas-adm"}>
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <Container
        className={jaCarregou ? "principal-tarefas-adm" : "ocultar"}
        sx={{ display: "flex" }}
      >
        <ThemeProvider theme={MuiEstilosPersonalizados}>
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
              variant="contained"
              color="success"
              startIcon={<FaPlusCircle />}
              onClick={criarTarefa}
              sx={{ display: "flex" }}
            >
              ADICIONAR TAREFA
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<FaBook />}
              onClick={minhasTarefas}
              sx={{ display: "flex" }}
            >
              MINHAS TAREFAS
            </Button>
          </Container>

          <div className="gridTarefas">
            <DataGrid
              className={"tbl"}
              autoHeight
              rows={listaTarefasTBL}
              columns={columns}
              pageSize={10}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              sx={{
                width: "100%",
              }}
              /* ABAIXO, pegando a linha selecionada pelo usuário... */
              onSelectionModelChange={(ids) => {
                const idSelecionado = parseInt(ids[0]); //Pegando a linha selecionada pelo usuario (só pode uma por vez)
                // TESTE - console.log('id Selecionada = ', idSelecionado)
                if (isNaN(idSelecionado)) return setTemTarefaSelecionada(false);

                // TESTE - console.log(listaUsuarios[parseInt(idSelecionado)])

                setTarefaSelecionada(listaTarefas[parseInt(idSelecionado) - 1]);
                setTemTarefaSelecionada(true);
                /* BUSCAR COMO DES-SELECIONAR UMA TAREFA */
              }}
            />
          </div>

          <Container
            disableGutters
            className="divBotaoFim"
            sx={{ display: "flex", margin: "0" }}
          >
            <Button
              variant="contained"
              color="info"
              startIcon={<FaHandPointLeft />}
              onClick={voltar}
            >
              Voltar
            </Button>

            <Button
              className="botaoAlterar"
              variant="contained"
              color="success"
              startIcon={<FaBookOpen />}
              sx={{ display: "flex" }}
              onClick={tarefasSeguidas}
            >
              TAREFAS QUE SIGO
            </Button>

            <Button
              className={temTarefaSelecionada ? "botaoAlterar" : "ocultar"}
              variant="contained"
              color="info"
              startIcon={<FaBook />}
              sx={{ display: "flex" }}
              onClick={detalharTarefa}
            >
              DETALHAR
            </Button>

            <Button
              className={temTarefaSelecionada ? "botaoAlterar" : "ocultar"}
              variant="contained"
              color="warning"
              startIcon={<FaPencilAlt />}
              sx={{ display: "flex" }}
              onClick={alterarTarefa}
            >
              ALTERAR
            </Button>
          </Container>
        </ThemeProvider>
      </Container>

      <Container className={jaCarregou ? "ocultar" : "principal-tarefas-adm"}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress sx={{ color: "#CDC1F8" }} />
        </Backdrop>
      </Container>
      <CssBaseline />
    </div>
  );
};

export default TarefasAdm;