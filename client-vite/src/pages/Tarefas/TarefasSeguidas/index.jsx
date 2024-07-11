import React from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesTarefasSeguidas.css";

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
  InputLabel,
} from "@mui/material";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { FaBook, FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const TarefasSeguidas = () => {
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

    getTarefasSeguidos(usuarioLS.email);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Declarando variavel que receberá todas as tarefas do sistema
  const [listaTarefas, setListaTarefas] = React.useState([
    {
      idTarefa: "",
      nomeTarefa: "",
      descricao: "",
      idIteracao: "",
      nomeIteracao: "",
      codProjetoFK: "",
      nomeProjeto: "",
      usuarioResp: "",
      nomeUsuarioResp: "",
      status: "",
    },
  ]);

  const [listaTarefasTBL, setListaTarefasTBL] = React.useState([
    {
      id: "",
      nomeTarefa: "",
      descricao: "",
      idIteracao: "",
      nomeIteracao: "",
      codProjetoFK: "",
      nomeProjeto: "",
      usuarioResp: "",
      nomeUsuarioResp: "",
      status: "",
    },
  ]);

  // ! Buscando todas as tarefas do sistema..
  const getTarefasSeguidos = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/tarefa/seguidas`).then(
      (response) => {
        setListaTarefas(response.data);
        console.log(response.data);

        /* FILTRANDO DADOS DE CADA USUÁRIO PARA PREENCHER A TABELA... */
        const listaFiltrados = [];
        let contador = 1;
        response.data.forEach((elemento) => {
          const {
            nomeTarefa,
            descricao,
            nomeIteracao,
            nomeProjeto,
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
            id: contador,
            nome: nomeTarefa,
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
      }
    );
  };

  // ! Declarando variável que receberá o usuário selecionado a partir da tabela (será redirecionado para páginas de alteração...)
  const [tarefaSelecionada, setTarefaSelecionada] = React.useState({
    idTarefa: "",
    nome: "",
    descricao: "",
    status: "",
    projetoTarefa: "",
    nomeProjeto: "",
    idIteracao: "",
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

  // ! Função que vai redirecionar o usuário para o detalhamento da tarefa
  const detalharTarefa = () => {
    //Setando tarefa no localStorage
    localStorage.setItem("tarefa", JSON.stringify(tarefaSelecionada));

    redirect(
      "/tarefas/detalhar" //, { state: { usuario: locationState.usuario, admin: locationState.admin, tarefa: tarefaSelecionada } }
    );
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  return (
    <div className={"tarefas-seguidas"}>
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <Container
        className={jaCarregou ? "principal-tarefas-adm" : "ocultar"}
        sx={{ display: "flex" }}
      >
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <div className="gridTarefas">
            <DataGrid
              className={"tbl"}
              autoHeight
              rows={listaTarefasTBL}
              columns={columns}
              pageSize={10}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              sx={{
                marginTop: "5%",
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
              className={temTarefaSelecionada ? "botaoalterar" : "ocultar"}
              variant="contained"
              color="info"
              startIcon={<FaBook />}
              sx={{ display: "flex" }}
              onClick={detalharTarefa}
            >
              DETALHAR
            </Button>
          </Container>
        </ThemeProvider>
      </Container>
    </div>
  );
};

export default TarefasSeguidas;