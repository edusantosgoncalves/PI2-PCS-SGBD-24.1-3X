import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

//Imports da MUI
import {
  Button,
  Grow,
  Container,
  Grid,
  CssBaseline,
  Typography,
  Card,
  Link,
  CardHeader,
  Avatar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

//Import de icones
import { FaHandPointLeft } from "react-icons/fa";

//Imports de componentes criados
import MenuLateral from "../../../components/MenuLateral";
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";

const UsuarioSeguidos = () => {
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

    // ! Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });

    // ! Buscando usuarios seguidos...
    buscarUsuariosSeguidos(usuarioLS.email);
  }, []);

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Voltar para a página anterior.
  const voltar = () => {
    redirect(-1);
  };

  // ! Variáveis que receberão as avaliações
  const [listaUsuarios, setListaUsuarios] = React.useState([{}]);

  // ! Funções para buscar avaliações
  const buscarUsuariosSeguidos = (email) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/seguidos`).then(
      (response) => {
        setListaUsuarios(response.data);
      }
    );
  };

  // ! Função que levará para a tela de seguir usuário (caso o usuario da tarefa seja outro)
  const detalharUsuario = (emailUsuario) => {
    //Redirecionar o usuario para a página de seguir o outro usuario
    if (emailUsuario !== null) {
      //Setando usuario no localStorage
      localStorage.setItem("usuarioPerfil", JSON.stringify(emailUsuario));

      redirect(
        "/perfil?" + emailUsuario //, { state: { usuario: locationState.usuario, admin: locationState.admin, usuarioPerfil: emailUsuario } }
      );
    }
  };
  return (
    <div className="Usuarios-ADM">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <CssBaseline />
      <ThemeProvider theme={MuiEstilosPersonalizados}>
        <div className="divMeio">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              display: "flex",
              marginTop: "0",
              marginBottom: "1em",
              fontSize: "1.5rem",
              padding: "1% 2% 0 2%",
              borderTopLeftRadius: "0.8rem",
              borderTopRightRadius: "0.8rem",
              color: "fundoCard",
            }}
          >
            Usuarios seguidos
          </Typography>
          <Container disableGutters sx={{ paddingTop: "0" }} maxWidth="md">
            <Grid
              overflow={"auto"}
              maxHeight={"70vh"}
              className="gridTimes" //className={tipoAv === 0 ? "gridTimes" : "ocultar"}
              container
              spacing={4}
            >
              <Container
                sx={{
                  minWidth: 275,
                  margin: "0.5em 0.6em",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignContent: "stretch",
                  alignItems: "stretch",
                }}
              >
                {listaUsuarios.map((usuario, index) => {
                  if (usuario.hasOwnProperty("email")) {
                    return (
                      <Grow
                        in={true}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(true ? { timeout: (index + 1) * 350 } : {})}
                      >
                        <Card
                          sx={{
                            width: "220px",
                            backgroundColor: "fundoCard",
                            display: "flex",
                            margin: "0.2em",
                            maxHeight: "220px",
                          }}
                          className="cardTimes"
                          variant="outline"
                        >
                          <CardHeader
                            avatar={
                              <Avatar
                                src={
                                  usuario.hasOwnProperty("urlImagem")
                                    ? usuario.urlImagem
                                    : "A"
                                }
                                referrerPolicy="no-referrer"
                              />
                            }
                            title={
                              usuario.hasOwnProperty("nome") ? (
                                <Link
                                  underline="none"
                                  color={"black"}
                                  className="link-underline-transicao"
                                  onClick={() => {
                                    detalharUsuario(usuario.email);
                                  }}
                                >
                                  {usuario.nome}
                                </Link>
                              ) : (
                                ""
                              )
                            }
                          />
                        </Card>
                      </Grow>
                    );
                  }
                })}
              </Container>
            </Grid>
          </Container>
          <Container
            className="divBotaoFim"
            disableGutters
            sx={{ display: "flex" }}
          >
            <Button
              variant="contained"
              color="info"
              startIcon={<FaHandPointLeft />}
              onClick={voltar}
              sx={{ marginTop: "1.5em" }}
            >
              Voltar
            </Button>
          </Container>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default UsuarioSeguidos;
