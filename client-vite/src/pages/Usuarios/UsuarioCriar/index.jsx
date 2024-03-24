import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesUsuarioADM.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports da MUI
import {
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Snackbar,
  Alert,
  AlertTitle,
  Container,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

//Import de icones
import { FaUserShield, FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const UsuarioCriar = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
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
  }, []);

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de usuarios-adm
  const fecharDialog = () => {
    setSair(false);
    redirect(
      "/usuarios-adm" //, { state: { usuario: locationState.usuario, admin: locationState.admin } }
    );
  };

  // ! Variável controlada pelo checkbox de ÉAdmin
  const [eAdmin, setEAdmin] = React.useState(false);

  // ! Função que define a variável eAdmin conforme o valor do Checkbox de ADMinistrador
  const attStatusAdmin = (event) => {
    setEAdmin(event.target.checked);
  };

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  const criarUsuario = () => {
    //! Validando campos
    if (document.getElementById("email").value.trim() === "") {
      setMsgAlerts("E-mail inválido!");
      setAbreNaoPode(true);
      return;
    }

    if (document.getElementById("nome").value.trim() === "") {
      setMsgAlerts("Nome Inválido!");
      setAbreNaoPode(true);
      return;
    }

    //! Validando se usuário já existe
    Axios.get(
      `${serverPrefix}/api/usuarios/${document
        .getElementById("email")
        .value.trim()}`
    )
      .then((response) => {
        console.log(response.data);
        // ! Se o usuário não existir, crie
        if (response.data.hasOwnProperty("message")) {
          if (response.data.message === "Usuário não encontrado") {
            Axios.post(`${serverPrefix}/api/usuarios`, {
              email: document.getElementById("email").value,
              nome: document.getElementById("nome").value,
              status: eAdmin ? 2 : 1, //Se for selecionado no checkbox admin, defina o status como 2, senão, defina como 1
            }).then((response) => {
              setSair(true);
              setMensagem(
                (document.getElementById("nome").value ?? "Usuário ") +
                  " autorizada com sucesso!"
              );
            });
          }
        } else {
          // ! Se existe, não deixa
          setMsgAlerts("Usuário já cadastrado!");
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
            Novo Usuário
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
                padding: "5vh 0 5vh 0",
                width: "100%",
                marginTop: "0",
              }}
              //className="container-form"
            >
              <Container maxWidth="sm">
                <TextField
                  id="nome"
                  label="Nome"
                  defaultValue={""}
                  fullWidth
                  sx={{ margin: "0.5em" }}
                />

                <TextField
                  id="email"
                  label="Email"
                  defaultValue={""}
                  fullWidth
                  sx={{ margin: "0.5em" }}
                />

                <Container
                  disableGutters
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                  <Button
                    sx={{ width: "150px" }}
                    variant="contained"
                    color="success"
                    startIcon={<FaUserShield />}
                    onClick={criarUsuario}
                  >
                    AUTORIZAR
                  </Button>
                </Container>
              </Container>
            </Box>

            <Container className="divBotaoFim">
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
          </Container>
        </ThemeProvider>
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
    </div>
  );
};

export default UsuarioCriar;
