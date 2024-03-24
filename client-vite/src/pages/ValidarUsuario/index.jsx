import React from "react";
import { useNavigate } from "react-router-dom";

import Axios from "axios";
import "./stylesValidar.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Imports de componentes criados
import BarraLogoSemAuth from "../../components/BarraLogoSemAuth";

//IMPORT CHAKRA UI
//import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
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
    const location = window.location.href;

    // * The current location.
    console.log(location);

    //Transformando localização em url e buscando parametros;
    let url = new URL(location);
    let params = new URLSearchParams(url.search);

    console.log(params.get("nome").toString());
    Axios.put(
      `${serverPrefix}/api/usuarios/${params.get("email").toString()}/valida`,
      {
        urlImagem: params.get("foto").toString(),
        nome: params.get("nome").toString(),
      },
      { validateStatus: false }
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
              redirect(
                "/cadastro" //, { state: { usuario: response.data, admin: false } }
              );
            });
            break;
          case 2:
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", true);
              redirect(
                "/cadastro" //, { state: { usuario: response.data, admin: true } }
              );
            });
            break;
          case 3:
            console.log(response.data);
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", false);
              redirect(
                "/home" //, { state: { usuario: response.data, admin: true } }
              );
            });
            break;
          case 4:
            console.log(response.data);
            delay(3000).then(() => {
              localStorage.setItem("usuario", JSON.stringify(response.data));
              localStorage.setItem("admin", true);
              redirect(
                "/home" //, { state: { usuario: response.data, admin: true } }
              );
            });
            break;
          default:
            //REDIRECIONAR PRA PAGINA DE SEM ACESSO!
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
              <CircularProgress // color="verde"
                sx={{ color: "#CDC1F8" }}
              />
              <div className="txtValidar">
                Validando informações do usuário...
              </div>
            </Container>
          </Backdrop>
        </ThemeProvider>
      </div>
      {/*<BarraLogoSemAuth> </BarraLogoSemAuth>

            <div className="divValida">
                <CircularProgress isIndeterminate color='purple' />
                <div className="txtValidar">
                    Validando informações do usuário...
                </div>

    </div>*/}
    </div>
  );
};

export default ValidarUsuario;
