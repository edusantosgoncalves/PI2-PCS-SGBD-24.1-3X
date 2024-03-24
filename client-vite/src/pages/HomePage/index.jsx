import React from "react";
import "./stylesHome.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Imports de componentes criados
import MenuLateral from "../../components/MenuLateral";
import BarraLogo from "../../components/BarraLogo";
import {
  Card,
  CardContent,
  Link,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Axios from "axios";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";

const HomePage = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página e receber dados da página redirecionadora
  const location = useLocation();

  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  // ! OnLoad event -> Lendo se houve acesso negado antes da página carregar por completo!
  React.useEffect(() => {
    console.log(location);
    /*//TESTE SETANDO LOCALSTORAGE
        localStorage.setItem("usuario", JSON.stringify(location.state.usuario))
        localStorage.setItem("admin", location.state.admin)

        if (location.state) //Se receber esses dados, coloca na variável...
            setLocationState(location.state);
        let eAdmin = location.state.admin ? 1 : 0;
        getDashboard(location.state.usuario.email, eAdmin)*/

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

    //Enchendo dashboard
    let eAdmin = adminLS ? 1 : 0;
    getDashboard(usuarioLS.email, eAdmin);
  }, []);

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  //! Variável que vai receber dados do dashboard
  const [dashboard, setDashboard] = React.useState({
    qtdTimesUsuario: "",
    qtdTimesSys: "",
    qtdProjetosUsuario: "",
    qtdProjetosSys: "",
    qtdTarefas: "",
    qtdTarefasSys: "",
    qtdTarefasSemana: "",
    qtdUsuarios: "",
  });

  // ! Função que busca dados para preencher o dashboard do usuário
  const getDashboard = (email, admin) => {
    Axios.get(`${serverPrefix}/api/usuarios/${email}/dashboard/${admin}`).then(
      (response) => {
        setDashboard(response.data);
        setJaCarregou(true);
      }
    );
  };

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Função para levar o usuario logado a pagina de alterar usuario
  const irTimes = () => {
    redirect("/times", {
      state: { usuario: locationState.usuario, admin: locationState.admin },
    });
  };

  // ! Função para levar o usuario logado a pagina de alterar usuario
  const irProjetos = () => {
    redirect("/projetos", {
      state: { usuario: locationState.usuario, admin: locationState.admin },
    });
  };

  // ! Função para levar o usuario logado a pagina de usuarios
  const irTarefas = () => {
    redirect("/tarefas", {
      state: { usuario: locationState.usuario, admin: locationState.admin },
    });
  };

  // ! Função para levar o usuario logado a pagina de usuarios
  const irUsuarios = () => {
    redirect("/usuarios-adm", {
      state: { usuario: locationState.usuario, admin: locationState.admin },
    });
  };

  // !
  const irTarefasADM = () => {
    redirect("/tarefas/adm", {
      state: { usuario: locationState.usuario, admin: locationState.admin },
    });
  };

  return (
    <div className="Home">
      <BarraLogo locationState={locationState}></BarraLogo>
      <MenuLateral locationState={locationState}></MenuLateral>

      <div className={jaCarregou ? "principal" : "ocultar"}>
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Card
            sx={{
              backgroundColor: "fundoCard",
              display: "flex",
            }}
            className="cards"
            variant="outline"
          >
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "900" }}>
                <Link
                  underline="none"
                  color={"black"}
                  className="link-underline-transicao"
                  onClick={() => {
                    irTimes();
                  }}
                >
                  Times
                </Link>
              </Typography>

              <Typography
                sx={{ mb: 1, fontWeight: "500" }}
                color="texto.descricao"
              >
                Você está em{" "}
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irTimes();
                  }}
                >
                  {dashboard.qtdTimesUsuario}
                </Link>{" "}
                times.
              </Typography>

              <Typography
                sx={{ mb: 1, fontWeight: "500" }}
                color="texto.descricao"
                className={dashboard.qtdTimesSys === "" ? "ocultar" : ""}
              >
                Há um total de{" "}
                <Link
                  underline="none"
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irTimes();
                  }}
                >
                  {dashboard.qtdTimesSys}{" "}
                </Link>{" "}
                times ativos.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: "fundoCard",
              display: "flex",
            }}
            className="cards"
            variant="outline"
          >
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "900" }}>
                <Link
                  underline="none"
                  color={"black"}
                  className="link-underline-transicao"
                  onClick={() => {
                    irProjetos();
                  }}
                >
                  Projetos
                </Link>
              </Typography>
              <Typography
                sx={{ mb: 1, fontWeight: "500" }}
                color="texto.descricao"
              >
                Você está em{" "}
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irProjetos();
                  }}
                >
                  {dashboard.qtdProjetosUsuario}
                </Link>{" "}
                projetos.
              </Typography>

              <Typography
                sx={{ mb: 1, fontWeight: "500" }}
                color="texto.descricao"
                className={dashboard.qtdProjetosSys === "" ? "ocultar" : ""}
              >
                Há um total de{" "}
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irProjetos();
                  }}
                >
                  {dashboard.qtdProjetosSys}{" "}
                </Link>{" "}
                projetos ativos.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: "fundoCard",
              display: "flex",
            }}
            className="cards"
            variant="outline"
          >
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "900" }}>
                <Link
                  underline="none"
                  color={"black"}
                  className="link-underline-transicao"
                  onClick={irTarefas}
                >
                  Tarefas
                </Link>
              </Typography>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  display: dashboard.qtdTarefas === "" ? "none" : "",
                }}
                color="texto.descricao"
              >
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irTarefas();
                  }}
                >
                  {dashboard.qtdTarefas}
                </Link>{" "}
                tarefas pendentes.
              </Typography>

              <Typography
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  display: dashboard.qtdTarefasSemana === "" ? "none" : "",
                }}
                color="texto.descricao"
                className={dashboard.qtdTarefasSemana === "" ? "ocultar" : ""}
              >
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irTarefas();
                  }}
                >
                  {dashboard.qtdTarefasSemana}{" "}
                </Link>{" "}
                tarefas vencem esta semana.
              </Typography>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  display: dashboard.qtdTarefasSys === "" ? "none" : "",
                }}
                color="texto.descricao"
                className={dashboard.qtdTarefasSys === "" ? "ocultar" : ""}
              >
                Há um total de{" "}
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irTarefasADM();
                  }}
                >
                  {dashboard.qtdTarefasSys}{" "}
                </Link>{" "}
                tarefas em andamento no geral.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: "fundoCard",
              display: "flex",
            }}
            className={locationState.admin === "true" ? "cards" : "ocultar"}
            variant="outline"
          >
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "900" }}>
                <Link
                  underline="none"
                  color={"black"}
                  className="link-underline-transicao"
                  onClick={() => {
                    irUsuarios();
                  }}
                >
                  Usuários
                </Link>
              </Typography>
              <Typography
                sx={{ mb: 1, fontWeight: "500" }}
                color="texto.descricao"
              >
                Há{" "}
                <Link
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    backgroundColor: "fundoCard",
                    color: "black",
                    fontWeight: "600",
                  }}
                  onClick={() => {
                    irUsuarios();
                  }}
                >
                  {dashboard.qtdUsuarios}
                </Link>{" "}
                usuários no sistema.
              </Typography>
            </CardContent>
          </Card>
        </ThemeProvider>
      </div>

      <div className={jaCarregou ? "ocultar" : "principal"}>
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

export default HomePage;
