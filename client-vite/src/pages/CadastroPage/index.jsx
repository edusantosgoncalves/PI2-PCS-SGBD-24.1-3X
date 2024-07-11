import React from "react";
import "./stylesCadastro.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  TextField,
  Avatar,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Axios from "axios";

// Imports de componentes criados
import BarraLogoSemAuth from "../../components/BarraLogoSemAuth";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";

const CadastroPage = () => {
  // ! Instanciando o useLocation para receber dados da página redirecionadora
  const location = useLocation();

  //Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  const [usuarioEmail, setUsuarioEmail] = React.useState("");

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

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

    // Pegando dados do localStorage
    let adminLS = localStorage.getItem("admin");
    let usuarioLS = JSON.parse(localStorage.getItem("usuario"));

    //Atribuindo-os a locationState
    setLocationState({ admin: adminLS, usuario: usuarioLS });

    //Inserindo-os nas variáveis
    setUsuarioEmail(usuarioLS.email);
    document.getElementById("funcao").value = usuarioLS.funcao;
    document.getElementById("CEP").value = usuarioLS["cep"];
    buscaEndereco();
    document.getElementById("CEP_numEnd").value = usuarioLS.cepnumEndereco;
    document.getElementById("CEP_complemento").value = usuarioLS.cepComplemento;
  }, []);

  //! Função que atualiza os dados do usuário no banco e redireciona a página indicada
  const attCadastroUsuario = () => {
    //Validando campos...
    if (document.getElementById("funcao").value.length <= 0) {
      setMsgAlerts("Função não preenchida!");
      setAbreNaoPode(true);
      return;
    }

    if (
      document.getElementById("endereco").value === " " ||
      document.getElementById("endereco").value === ""
    ) {
      setMsgAlerts("Endereço incompleto: CEP não informado ou inválido!");
      setAbreNaoPode(true);
      return;
    }

    if (
      document.getElementById("CEP_numEnd").value === " " ||
      document.getElementById("CEP_numEnd").value === ""
    ) {
      setMsgAlerts("Endereço incompleto: Número da residência não informado!");
      setAbreNaoPode(true);
      return;
    }

    Axios.put(
      `${serverPrefix}/api/usuarios/${document.getElementById("email").value}`,
      {
        nome: document.getElementById("nome").innerHTML,
        funcao: document.getElementById("funcao").value,
        cep: document.getElementById("CEP").value,
        numEnd:
          document.getElementById("CEP_numEnd").value === ""
            ? null
            : document.getElementById("CEP_numEnd").value,
        complEnd: document.getElementById("CEP_complemento").value,
        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
      }
    ).then((response) => {
      if (response.status === 201) {
        let status = 3;

        // Se o usuario for admin, troque o status ativo dele para o status de admin
        if (locationState.admin === "true") {
          status = 4;
        }

        Axios.put(
          `${serverPrefix}/api/usuarios/${
            document.getElementById("email").value
          }/status`,
          {
            status: status,
          }
        ).then((resposta2) => {
          if (resposta2.status >= 200 && resposta2.status <= 300) {
            Axios.get(
              `${serverPrefix}/api/usuarios/${locationState.usuario.email}`
            ).then((responseUsuario) => {
              if (responseUsuario.status === 200) {
                localStorage.setItem(
                  "usuario",
                  JSON.stringify(responseUsuario.data)
                );
                redirect("/home");
              }
            });
          }
        });
      }
    });
  };

  //! Variável que controla se já carregou dados
  const [jaCarregou, setJaCarregou] = React.useState(false);

  // ! Função que busca os dados do endereço do usuário
  const buscaEndereco = () => {
    let cep = document.getElementById("CEP").value;

    if (cep.length === 8) {
      if (cep.match(/^[0-9]+$/)) {
        try {
          Axios.get("https://viacep.com.br/ws/" + cep + "/json/").then(
            (response) => {
              // Verificando se a resposta foi vazia
              if (response.data.erro) {
                setMsgAlerts("CEP não encontrado!");
                setAbreNaoPode(true);
                document.getElementById("CEP").value = "";
                setJaCarregou(true);
                return;
              }

              // Se for recebido, preencher os campos
              document.getElementById("endereco").value =
                response.data.logradouro;
              document.getElementById("cidade").value =
                response.data.localidade;
              document.getElementById("estado").value = response.data.uf;
              setJaCarregou(true);
            }
          );
        } catch (error) {
          setJaCarregou(true);
        }
      } else {
        setMsgAlerts("CEP inválido!");
        setAbreNaoPode(true);
        document.getElementById("CEP").value = "";
        setJaCarregou(true);
        //alert("CEP inválido!");
      }
    } else {
      document.getElementById("endereco").value = " ";
      document.getElementById("cidade").value = " ";
      document.getElementById("estado").value = " ";
      setJaCarregou(true);
    }
  };

  return (
    <div className="Cadastro">
      <BarraLogoSemAuth> </BarraLogoSemAuth>

      <ThemeProvider theme={MuiEstilosPersonalizados}>
        <div
          className={jaCarregou ? "container-form" : "ocultar"}
          style={{ backgroundColor: "var(--nvClaroFundo)" }}
        >
          <div className="perfil">
            <Avatar
              alt={"img_" + locationState.usuario.nome}
              src={locationState.usuario.urlImagem}
              referrerPolicy="no-referrer"
            />
            <Typography id="nome">{locationState.usuario.nome}</Typography>
          </div>
          <div></div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField disabled id="email" label="Email" value={usuarioEmail} />
            <TextField
              required
              id="funcao"
              label="Função"
              defaultValue={""}
              /*InputProps={{
                            onChange: (event) => { setUsuarioAltFuncao(event.target.value) },
                        }} */
            />
            <TextField
              required
              id="CEP"
              label="CEP"
              defaultValue={""}
              InputProps={{
                onChange: buscaEndereco,
              }}
            />
            <TextField
              disabled
              id="endereco"
              label="Endereço"
              defaultValue=" "
              //value={enderecoPorCep.logradouro}
            />
          </Box>

          <div className="endereco">
            <TextField
              sx={{ width: 1 / 5 }}
              required
              id="CEP_numEnd"
              label="Nº"
              defaultValue=""
            />
            <TextField
              sx={{ width: 3 / 4 }}
              id="CEP_complemento"
              label="Complemento"
              defaultValue=""
            />
          </div>
          <div className="endereco">
            <TextField
              sx={{ width: 3 / 4 }}
              disabled
              id="cidade"
              label="Cidade"
              defaultValue={" "}
              //value={enderecoPorCep.localidade}
            />
            <TextField
              sx={{ width: 1 / 5 }}
              disabled
              id="estado"
              label="Estado"
              defaultValue={" "}
              //value={enderecoPorCep.uf}
            />
          </div>

          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="linkedin"
              label="LinkedIn (link do perfil)"
              defaultValue=""
            />
            <TextField
              id="github"
              label="GitHub (link do perfil)"
              defaultValue=""
            />
          </Box>

          <div className="areaBtns">
            <Button
              variant="contained"
              color="success"
              name="concluir"
              onClick={attCadastroUsuario}
            >
              Concluir cadastro
            </Button>
          </div>
        </div>
      </ThemeProvider>

      <div className={jaCarregou ? "ocultar" : "container-form"}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress sx={{ color: "#CDC1F8" }} />
        </Backdrop>
      </div>

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

export default CadastroPage;
