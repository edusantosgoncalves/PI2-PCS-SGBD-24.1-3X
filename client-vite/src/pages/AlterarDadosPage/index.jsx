import React from "react";
import "./stylesAlterar.css";

import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../configs/urlPrefixes";

//Imports da MUI
import {
  Button,
  Box,
  Avatar,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

//Imports de componentes criados
import BarraLogoAlterarDados from "../../components/BarraLogoAlterarDados";
import MuiEstilosPersonalizados from "../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../components/PopupOKPersonalizado";

const AlterarDadosPage = () => {
  // ! Instanciando o useLocation para receber dados da página redirecionadora
  const location = useLocation();

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

  //! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  const [usuarioEmail, setUsuarioEmail] = React.useState("");

  // ! Instanciando usuario dps de alterado
  const [usuarioAlterado, setUsuarioAlterado] = React.useState({});

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
    document.getElementById("CEP").value = usuarioLS["CEP"];
    buscaEndereco();
    document.getElementById("CEP_numEnd").value = usuarioLS.CEP_numEnd;
    document.getElementById("CEP_complemento").value =
      usuarioLS.CEP_complemento;
  }, []);

  //! Função que valida o usuário no banco e conforme a resposta do status, redireciona a página indicada
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

    Axios.put(`${serverPrefix}/api/usuarios/${locationState.usuario.email}`, {
      email: locationState.usuario.email,
      nome: locationState.usuario.nome,
      funcao: document.getElementById("funcao").value,
      cep: document.getElementById("CEP").value,
      numEnd:
        document.getElementById("CEP_numEnd").value === ""
          ? null
          : document.getElementById("CEP_numEnd").value,
      complEnd: document.getElementById("CEP_complemento").value,
      linkedin: document.getElementById("linkedin").value,
      github: document.getElementById("github").value,
    }).then((response) => {
      console.log(response); //* TESTANDO RESPOSTA!

      if (response.status === 201) {
        Axios.get(
          `${serverPrefix}/api/usuarios/${locationState.usuario.email}`
        ).then((responseUsuario) => {
          if (responseUsuario.status === 200) {
            if (
              responseUsuario.data.status >= 1 &&
              responseUsuario.data.status <= 4
            ) {
              localStorage.setItem(
                "usuario",
                JSON.stringify(responseUsuario.data)
              );
              setUsuarioAlterado(responseUsuario.data);
              setMensagem(
                locationState.usuario.nome + " atualizado com sucesso!"
              );
              setSair(true);
            } else redirect("/?acesso=" + 0);
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
              // setEndereco(response.data)

              // Testa se a resposta é vazia/erro
              if (response.data.erro) {
                setMsgAlerts("CEP não encontrado!");
                setAbreNaoPode(true);
                //alert("CEP não encontrado!");
                document.getElementById("CEP").value = "";
                setJaCarregou(true);
                return;
              }

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
          console.log(error);
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

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    //Adicionando alteração de dados do usuario no localStorage
    localStorage.setItem("usuario", JSON.stringify(usuarioAlterado));

    redirect(
      "/home" //, { state: { admin: locationState.admin, usuario: usuarioAlterado } }
    );
  };

  return (
    <div className="AlterarDados">
      <BarraLogoAlterarDados></BarraLogoAlterarDados>

      <ThemeProvider theme={MuiEstilosPersonalizados}>
        <div
          className={jaCarregou ? "container-form" : "ocultar"}
          style={{ backgroundColor: "var(--nvClaroFundo)" }}
        >
          <div className="perfil">
            <Avatar
              alt={"img_" + locationState.usuario.nome}
              sx={{ width: 70, height: 70 }}
              src={locationState.usuario.urlImagem}
              referrerPolicy="no-referrer"
            />
            <p>{locationState.usuario.nome}</p>
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
            <TextField id="funcao" label="Função" defaultValue={""} />
            <TextField
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
            />
          </Box>

          <div className="endereco">
            <TextField
              sx={{ width: 1 / 5 }}
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
              defaultValue=" "
            />
            <TextField
              sx={{ width: 1 / 5 }}
              disabled
              id="estado"
              label="Estado"
              defaultValue=" "
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
            <TextField id="linkedin" label="Linkedin" defaultValue="" />
            <TextField id="github" label="Github" defaultValue="" />
          </Box>

          <div className="areaBtns">
            <Button
              variant="contained"
              color="success"
              name="concluir"
              onClick={attCadastroUsuario}
            >
              Atualizar dados
            </Button>
          </div>
        </div>
      </ThemeProvider>

      <div className={jaCarregou ? "ocultar" : "principal-detalha-tarefa"}>
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
      <PopupOKPersonalizado
        sair={sair}
        fecharDialog={fecharDialog}
        mensagem={mensagem}
      />
    </div>
  );
};

export default AlterarDadosPage;
