import React from "react";
import { useNavigate } from "react-router-dom";

import Axios from "axios";
import "./stylesValidar.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Imports de componentes criados
import BarraLogoSemAuth from "../../components/BarraLogoSemAuth";

//IMPORT MUI
import {
  Backdrop,
  CircularProgress,
  Container,
  ThemeProvider,
} from "@mui/material";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";

//PÁGINA DE VALIDAÇÃO DO USUÁRIO...
const ValidarUsuario = () => {
  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  // ! Instanciando uma função pra definir um tempo de espera... - NÃO ESTÁ FUNCIONANDO...
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  //! Função que valida o usuário no banco e conforme a resposta do status, redireciona a página indicada
  const vrfUsuario = () => {
    // . Pegando a localização da página
    const location = window.location.href;

    // . Transformando localização em url e buscando parametros;
    let url = new URL(location);
    let params = new URLSearchParams(url.search);

    // . Atualizando dados do usuário no banco
    Axios.put(
      `${serverPrefix}/api/usuarios/${params.get("email").toString()}/valida`,
      {
        urlImagem: params.get("foto").toString(),
        nome: params.get("nome").toString(),
      },
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    ).then((response) => {
      if (response.status !== 201) {
        redirect("/?acesso=" + 0);
        return;
      }

      Axios.get(
        `${serverPrefix}/api/usuarios/${params.get("email").toString()}`
      ).then((response) => {
        //TESTE SETANDO LOCALSTORAGE
        switch (response.data.status) {
          case 1:
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", false);
              redirect("/cadastro");
            });
            break;
          case 2:
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", true);
              redirect("/cadastro");
            });
            break;
          case 3:
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", false);
              redirect("/home");
            });
            break;
          case 4:
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", true);
              redirect("/home");
            });
            break;
          default:
            // . REDIRECIONAR PRA PAGINA DE SEM ACESSO!
            delay(3000).then(redirect("/?acesso=" + 0));
            break;
        }
      });
    });
  };

  // ! OnLoad event -> Lendo as informações do usuário conforme a página é carregada...
  React.useEffect(() => {
    vrfUsuario();
  }, []);

  return (
    <div id="vrfLogin">
      <BarraLogoSemAuth />
      <div className="divValida">
        <ThemeProvider theme={MuiEstilosPersonalizados}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress sx={{ color: "#CDC1F8" }} />
              <div className="txtValidar">
                Validando informações do usuário...
              </div>
            </Container>
          </Backdrop>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default ValidarUsuario;
