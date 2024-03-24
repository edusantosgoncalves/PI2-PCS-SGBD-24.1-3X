import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesUsuarioAlt.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports da MUI
import {
  Button,
  Box,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Container,
  Snackbar,
  Alert,
  AlertTitle,
  Typography,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

//Import de icones
import {
  FaUserShield,
  FaUserEdit,
  FaUserTimes,
  FaHandPointLeft,
} from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const UsuarioAlterar = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
    usuarioAlterar: "",
  });

  // ! Declarando variável que define se o usuário recebido está inativo ou não
  const [usuarioInativo, setUsuarioInativo] = React.useState(false);

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
      localStorage.hasOwnProperty("usuarioAlterar") === false
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
    let usuarioAlterarLS = JSON.parse(localStorage.getItem("usuarioAlterar"));

    //Atribuindo-os a locationState
    setLocationState({
      admin: adminLS,
      usuario: usuarioLS,
      usuarioAlterar: usuarioAlterarLS,
    });

    // ! Definindo valores nos campos
    document.getElementById("email").value = usuarioAlterarLS.email;
    document.getElementById("funcao").value = usuarioAlterarLS.funcao;

    if (usuarioAlterarLS.status === 1 || usuarioAlterarLS.status === 3) {
      setEAdmin(false);
    } else if (usuarioAlterarLS.status === 2 || usuarioAlterarLS.status === 4) {
      setEAdmin(true);
    } else {
      setUsuarioInativo(true);
    }
  }, []);

  /* PARA APARECER O POPUP */
  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de usuarios-adm
  const fecharDialog = () => {
    setSair(false);
    redirect("/usuarios-adm");
  };

  // ! Variável controlada pelo checkbox de ÉAdmin
  const [eAdmin, setEAdmin] = React.useState(false);

  // ! Função que define a variável eAdmin conforme o valor do Checkbox de ADMinistrador
  const attStatusAdmin = (event) => {
    setEAdmin(event.target.checked);
  };

  // ! Declarando função de alterar usuário.
  const alterarDadosUsuarioSelecionado = () => {
    //! Validando campos
    if (document.getElementById("email").value.trim() === "") {
      setMsgAlerts("E-mail inválido!");
      setAbreNaoPode(true);
      return;
    }

    if (document.getElementById("funcao").value.trim() === "") {
      setMsgAlerts("Função inválida!");
      setAbreNaoPode(true);
      return;
    }

    if (
      document.getElementById("email").value.trim().toString() ===
      locationState.usuarioAlterar.email.toString()
    ) {
      Axios.put(
        `${serverPrefix}/api/usuarios-adm/${locationState.usuarioAlterar.email}`,
        {
          emailNovo: document.getElementById("email").value,
          funcao: document.getElementById("funcao").value,
          status: eAdmin ? 2 : 1, //Se for selecionado no checkbox admin, defina o status como 2, senão, defina como 1
        }
      ).then((response) => {
        setSair(true);
        setMensagem(
          (locationState.usuarioAlterar.nome ?? "Usuário ") +
            " alterado com sucesso!"
        );
      });
      return;
    }
    //! Validando se usuário já existe
    Axios.get(
      `${serverPrefix}/api/usuarios/${document
        .getElementById("email")
        .value.trim()}`
    )
      .then((response) => {
        // ! Se o usuário não existir, crie
        if (response.data.hasOwnProperty("message")) {
          if (response.data.message === "Usuário não encontrado") {
            Axios.put(
              `${serverPrefix}/api/usuarios-adm/${locationState.usuarioAlterar.email}`,
              {
                emailNovo: document.getElementById("email").value,
                funcao: document.getElementById("funcao").value,
                status: eAdmin ? 2 : 1, //Se for selecionado no checkbox admin, defina o status como 2, senão, defina como 1
              }
            ).then((response) => {
              setSair(true);
              setMensagem(
                (locationState.usuarioAlterar.nome ?? "Usuário ") +
                  " alterado com sucesso!"
              );
            });
          }
        } else {
          // ! Se existe, não deixa
          setMsgAlerts("Novo e-mail já cadastrado!");
          setAbreNaoPode(true);
          return;
        }
      })
      .catch((erro) => {
        setMsgAlerts(erro.response.message.toString());
        setAbreNaoPode(true);
        return;
      });
  };

  // ! Função que ativa o usuário selecionado
  const ativarUsuario = () => {
    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuarioAlterar.email}/status`,
      {
        status: eAdmin ? 2 : 1, //Se for selecionado no checkbox admin, defina o status como 2, senão, defina como 1
      }
    ).then((response) => {
      setSair(true);
      setMensagem(
        (locationState.usuarioAlterar.nome ?? "Usuário ") +
          " reativado com sucesso!"
      );
    });
  };

  // ! Função que inativa o usuário selecionado
  const inativarUsuario = () => {
    Axios.put(
      `${serverPrefix}/api/usuarios/${locationState.usuarioAlterar.email}/status`,
      {
        status: 5,
      }
    ).then((response) => {
      setSair(true); // ! define a aparição do popup de Encerrar Sessão
      setMensagem(
        locationState.usuarioAlterar.nome + " inativado com sucesso!"
      );
    });
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  return (
    <div className="Usuarios-ADM">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <CssBaseline />
      <Container
        disableGutters
        className={"principalAlteraUsuario"}
        sx={{ display: "flex", width: "30%" }}
      >
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Typography
            className="nome-acao"
            variant="h3"
            component="h1"
            sx={{ display: "flex", marginBottom: "0" }}
          >
            Alterar Usuário
          </Typography>

          <Container
            disableGutters
            className={"principalAlteraUsuario"}
            sx={{ display: "flex", paddingTop: "0" }}
          >
            <Box
              className="boxNovoTime"
              sx={{
                backgroundColor: "var(--nvClaroFundo)",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                borderRadius: "15px",
                padding: "2vh 0 5vh 0",
                width: "100%",
                marginTop: "0",
              }}
              noValidate
              autoComplete="off"
            >
              <div className="perfil">
                <Avatar
                  alt={"img_" + locationState.usuarioAlterar.nome}
                  src={locationState.usuarioAlterar.urlImagem}
                  referrerPolicy="no-referrer"
                />
                <p>{locationState.usuarioAlterar.nome}</p>
              </div>
              <Container
                maxWidth="sm"
                sx={{
                  gap: "2vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextField
                  className=""
                  id="email"
                  label="Email"
                  defaultValue={""}
                />

                <TextField id="funcao" label="Função" defaultValue={""} />

                <FormControlLabel
                  label="Administrador?"
                  control={
                    <Checkbox
                      label={"Administrador?"}
                      checked={eAdmin}
                      color="info"
                      id="eAdmin"
                      onChange={attStatusAdmin}
                    />
                  }
                />

                <Container
                  disableGutters
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {usuarioInativo ? (
                    <Button
                      className="mostrarBtn"
                      variant="contained"
                      color="warning"
                      startIcon={<FaUserShield />}
                      onClick={ativarUsuario}
                    >
                      REATIVAR
                    </Button>
                  ) : (
                    <Button
                      className="mostrarBtn"
                      variant="contained"
                      color="error"
                      startIcon={<FaUserTimes />}
                      onClick={inativarUsuario}
                    >
                      INATIVAR
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<FaUserEdit />}
                    onClick={alterarDadosUsuarioSelecionado}
                  >
                    SALVAR
                  </Button>
                </Container>
              </Container>
            </Box>

            <Container className="divBotaoFim" sx={{ paddingLeft: "0" }}>
              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
                sx={{ marginTop: "10%" }}
              >
                Voltar
              </Button>
            </Container>

            {/* <Container className="divBotoesAtualizar" sx={{ display: 'flex' }}>
                                <Button className={usuarioInativo ? "mostrarBtn" : "naoMostrarBtn"} variant="contained" color="warning" startIcon={<FaUserShield />}
                                    onClick={ativarUsuario}
                                >
                                    REATIVAR
                                </Button>

                                <Button className={usuarioInativo ? "naoMostrarBtn" : "mostrarBtn"} variant="contained" color="error" startIcon={<FaUserTimes />}
                                    onClick={inativarUsuario}
                                >
                                    INATIVAR
                                </Button> */}

            {/* FALTA COLOCAR A FUNÇÃO DE ALTERAR USUÁRIO... (CRIAR ELA NO BACK...) */}
          </Container>

          <PopupOKPersonalizado
            sair={sair}
            fecharDialog={fecharDialog}
            mensagem={mensagem}
          />

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
        </ThemeProvider>
      </Container>
    </div>
  );
};

export default UsuarioAlterar;
