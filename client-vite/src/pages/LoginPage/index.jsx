import React from "react";
import "./stylesLogin.css";
import { useNavigate } from "react-router-dom";

//Imports MUI e Joy
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Container, Typography, Box, Paper } from "@mui/material";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Imports de componentes criados
import BarraLogoSemAuth from "../../components/BarraLogoSemAuth";

const LoginPage = () => {
  //Declarando variável que receberá se o acesso foi negado ou não
  const [acessoNegado, setAcessoNegado] = React.useState(false);

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    vrfAcesso();
  }, []);

  // ! Verificando se o usuário foi redirecionado por um login não autorizado!
  const vrfAcesso = () => {
    // ! Recebe o link atual
    const location = window.location.href;

    // * Printa o link atual
    console.log(location);

    // ! Transformando localização em url e buscando parametros;
    let url = new URL(location);
    let params = new URLSearchParams(url.search);

    // ! Tem o parâmetro acesso? Se sim, defina a variável de acesso negado como verdadeira
    if (params.has("acesso")) {
      setAcessoNegado(true);
    }
  };

  //Imports para o popUp
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Definindo a função do botão do popup: definir false a acessoNegado para que o popup desapareça
  const fecharPopUp = () => {
    setAcessoNegado(false);
    redirect("/");
  };

  return (
    <div id="login">
      <BarraLogoSemAuth></BarraLogoSemAuth>

      <ThemeProvider theme={MuiEstilosPersonalizados}>
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CssBaseline />
          <Paper
            elevation={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
              width: "30vh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#e1d3ff",
                }}
              >
                Acesso ao sistema
              </Typography>

              <Button
                className="btnGoogle"
                href={`${serverPrefix}/auth/google`}
                variant="outlined"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: "90%",
                }}
              >
                Entrar com Google
              </Button>

              <Box
                sx={{
                  marginTop: 2,
                  width: "80%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography component="h1" align="justify" paragraph={true}>
                  Em caso de falha no login, verifique se a conta escolhida para
                  o acesso é a mesma cadastrada pelo seu administrador de
                  usuários. Se o problema persistir entre em contato com o
                  administrador do sistema.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
      <Dialog
        fullScreen={fullScreen}
        open={acessoNegado}
        onClose={fecharPopUp}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Acesso negado!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Usuário sem permissão de acesso: Ou você não possui acesso ao
            sistema ou o seu cadastro está inativo!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={fecharPopUp}>
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginPage;
