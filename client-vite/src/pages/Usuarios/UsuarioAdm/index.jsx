import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesUsuarioADM.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports da MUI
import { Button, Container, Backdrop, CircularProgress } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, ptBR } from "@mui/x-data-grid";

//Import de icones
import {
  FaUserPlus,
  FaTimesCircle,
  FaCheckCircle,
  FaUserEdit,
  FaHandPointLeft,
  FaUsers,
} from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const UsuarioAdm = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
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

    // !! Validando se o usuário é adm (se não for, não acessa)
    if (localStorage.getItem("admin") === "false") {
      redirect(-1);
    }

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });
    getUsuarios();
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Definindo variável (um array de objetos) que vai receber todos os usuários do sistema
  const [listaUsuarios, setListaUsuarios] = React.useState([
    {
      email: "",
      nome: "",
      funcao: "",
      dtCriacao: "",
      urlImagem: "",
      github: "",
      linkedin: "",
      CEP: "",
      CEP_numEnd: "",
      status: "",
      dtInat: "",
      CEP_complemento: "",
    },
  ]);

  // ! Definindo variável (um array de objetos) que vai preencher a tabela...
  const [listaUsuariosTBL, setListaUsuariosTBL] = React.useState([
    {
      id: "" /* PRECISA TER UM ID PRA SE ORGANIZAR NA TBL... */,
      email: "",
      nome: "",
      admin: "",
      ativo: "",
    },
  ]);

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getUsuarios = () => {
    Axios.get(`${serverPrefix}/api/usuarios`).then((response) => {
      setListaUsuarios(response.data);

      /* FILTRANDO DADOS DE CADA USUÁRIO PARA PREENCHER A TABELA... */
      const listaFiltrados = [];
      let contador = 1;
      response.data.forEach((elemento) => {
        let { email, nome, status } = elemento;

        let admin = false;
        if (parseInt(status) === 2 || parseInt(status) === 4) admin = true;

        let ativo = false;
        if (parseInt(status) >= 1 && parseInt(status) <= 4) ativo = true;

        listaFiltrados.push({
          id: contador,
          email: email,
          nome: nome,
          admin: admin,
          ativo: ativo,
        });
        contador = contador + 1;
      });

      setListaUsuariosTBL(listaFiltrados);
      setJaCarregou(true);
      // TESTE - console.log(listaFiltrados)
    });
  };

  // ! Definindo as colunas da tbl Usuario
  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      headerClassName: "headerTBL",
      flex: 3,
    },
    {
      field: "email",
      headerName: "E-mail",
      headerClassName: "headerTBL",
      flex: 2,
    },
    {
      field: "admin",
      headerName: "É administrador?",
      headerClassName: "headerTBL",
      flex: 1,
      renderCell: (cellValues) => {
        if (cellValues.row.admin === true)
          return (
            <div style={{ color: "green" }}>
              <FaCheckCircle color="green" /> Sim{" "}
            </div>
          );
        else
          return (
            <div style={{ color: "red" }}>
              <FaTimesCircle color="red" /> Não{" "}
            </div>
          );
      },
    },
    {
      field: "ativo",
      headerName: "Ativo?",
      headerClassName: "headerTBL",
      flex: 1,
      renderCell: (cellValues) => {
        if (cellValues.row.ativo === true)
          return (
            <div style={{ color: "green" }} value="Sim">
              <FaCheckCircle color="green" /> Sim{" "}
            </div>
          );
        else
          return (
            <div style={{ color: "red" }} value="Não">
              <FaTimesCircle color="red" /> Não{" "}
            </div>
          );
      },
    },
  ];

  // ! Declarando variável que receberá o usuário selecionado a partir da tabela (será redirecionado para páginas de alteração...)
  const [usuarioSelecionado, setUsuarioSelecionado] = React.useState({
    email: "",
    nome: "",
    funcao: "",
    dtCriacao: "",
    urlImagem: "",
    github: "",
    linkedin: "",
    CEP: "",
    CEP_numEnd: "",
    status: "",
    dtInat: "",
    CEP_complemento: "",
  });

  // ! Declarando variável booleana que receberá se teve um usuário selecionado a partir da tabela
  const [temUsuarioSelecionado, setTemUsuarioSelecionado] =
    React.useState(false);

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Função para levar o usuario logado a pagina de alterar usuario
  const alterarDadosUsuarioSelecionado = () => {
    //Setando usuario no localStorage
    localStorage.setItem("usuarioAlterar", JSON.stringify(usuarioSelecionado));

    redirect("/usuarios-adm/alterar");
  };

  // ! Função para levar o usuário logado a página de criar novo usuário
  const criarNovoUsuario = () => {
    redirect("/usuarios-adm/criar");
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que vai redirecionar o usuário para os usuarios seguidos
  const usuariosSeguidos = () => {
    redirect("/usuarios/seguidos");
  };

  return (
    <div className="tarefas-adm">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <div className={jaCarregou ? "principal-tarefas-adm" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Container
            disableGutters
            className="divBotaoAdd"
            sx={{
              paddingBottom: "1.5em",
              margin: "0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<FaUserPlus />}
              onClick={criarNovoUsuario}
              sx={{ display: "flex" }}
            >
              ADICIONAR USUÁRIO
            </Button>
          </Container>

          <Container
            disableGutters
            className="gridTarefas"
            sx={{ margin: "0" }}
          >
            <DataGrid
              className={"tbl"}
              autoHeight
              rows={listaUsuariosTBL}
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
                if (isNaN(idSelecionado))
                  return setTemUsuarioSelecionado(false);

                // TESTE - console.log(listaUsuarios[parseInt(idSelecionado)])

                setUsuarioSelecionado(
                  listaUsuarios[parseInt(idSelecionado) - 1]
                );
                setTemUsuarioSelecionado(true);
                /* BUSCAR COMO DES-SELECIONAR UM USUARIO */
              }}
            />
          </Container>

          <Container
            disableGutters
            className="divBotaoAdd"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "0",
              margin: "1.5em 0 0 0",
            }}
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
              startIcon={<FaUsers />}
              sx={{ display: "flex" }}
              onClick={usuariosSeguidos}
            >
              USUÁRIOS QUE SIGO
            </Button>

            <Button
              className={temUsuarioSelecionado ? "botaoAlterar" : "ocultar"}
              variant="contained"
              color="warning"
              startIcon={<FaUserEdit />}
              sx={{ display: "flex" }}
              onClick={alterarDadosUsuarioSelecionado}
            >
              ALTERAR USUÁRIO
            </Button>
          </Container>
        </ThemeProvider>
      </div>

      <div className={jaCarregou ? "ocultar" : "principalUsuarios"}>
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

export default UsuarioAdm;
