import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./stylesCriarTime.css";

// Imports do prefixo da url do servidor
import { serverPrefix } from "../../../configs/urlPrefixes";

// Imports MUI e Joy
import {
  Container,
  Typography,
  Box,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField,
  CssBaseline,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider } from "@mui/material/styles";
import { FaHandPointLeft } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";

//Imports de componentes criados
import BarraLogo from "../../../components/BarraLogo";
import MuiEstilosPersonalizados from "../../../components/MuiEstilosPersonalizados";
import PopupOKPersonalizado from "../../../components/PopupOKPersonalizado";

const CriarTimePage = () => {
  // ! Instanciando uma variável useState para receber os dados do redirecionamento
  const [locationState, setLocationState] = React.useState({
    admin: "",
    usuario: "",
  });

  // ! Instanciando o useNavigate para redirecionar o usuário pra alguma página
  const redirect = useNavigate();

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
    exibirIntegrantes();
  }, []);

  // ! Declarando variável que controlará o PopUp de Inativar usuário...
  const [sair, setSair] = React.useState(false);
  const [mensagem, setMensagem] = React.useState(false);
  const [redir, setRedir] = React.useState(false);

  // ! Função que fecha o dialog aberto e redireciona de volta a tela de novo time
  const fecharDialog = () => {
    setSair(false);
    if (redir === true)
      redirect(
        "/times" //, { state: { admin: true, usuario: locationState.usuario } }
      );
  };

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

  // ! Buscando todos os usuários do bd para preencher a tabela.
  const getUsuarios = () => {
    Axios.get(`${serverPrefix}/api/usuarios-ativos`).then((response) => {
      setListaUsuarios(response.data);
    });
  };

  const [integranteSelecionado, setIntegranteSelecionado] = React.useState("");

  // ! Adiciona um integrante a uma lista para exibição
  const integranteChange = (event, usuario) => {
    setIntegranteSelecionado(usuario);
  };

  const [listaIntegrantes, setListaIntegrantes] = React.useState([
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

  const exibirIntegrantes = () => {
    if (!listaIntegrantes.includes(integranteSelecionado)) {
      setListaIntegrantes([...listaIntegrantes, integranteSelecionado]);
    }

    listaIntegrantes.forEach((integrante) => {
      if (integrante.nome === "") {
        removeIntegrante(integrante);
      }
    });
  };

  const removeIntegrante = (integrante) => {
    const novaListaIntegrantes = listaIntegrantes.filter(
      (item) => item !== integrante
    );
    setListaIntegrantes(novaListaIntegrantes);
  };

  // ! Função que volta pra página anterior
  const voltar = () => {
    redirect(-1);
  };

  // ! Função que cria o time com os integrantes e projetos
  const criarTimeCompleto = () => {
    //Validando inputs do usuário...
    if (document.getElementById("nome-time").value === "") {
      setSair(true);
      setMensagem("O campo nome do time é obrigatório!");
    } else if (listaIntegrantes.length === 0) {
      setSair(true);
      setMensagem("É necessário adicionar pelo menos um integrante ao time!");
    } else {
      console.log(listaIntegrantes);

      Axios.post(`${serverPrefix}/api/times`, {
        nome: document.getElementById("nome-time").value,
      }).then((respostaCriaTime) => {
        console.log(respostaCriaTime);

        Axios.post(
          `${serverPrefix}/api/times/${respostaCriaTime.data.idTime}/usuarios`,
          {
            listaUsuarios: listaIntegrantes,
          }
        ).then((respostaCriaUsuarios) => {
          console.log(respostaCriaUsuarios);
          //TERIA QUE VERIFICAR SE TA ADICIONANDO MESMO...
        });

        setMensagem(
          document.getElementById("nome-time").value + " criado com sucesso!"
        );
        setSair(true);
        setRedir(true);
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <div className="mainCria">
        <BarraLogo locationState={locationState}></BarraLogo>

        <Container sx={{ display: "flex" }} className="principalCriaTime">
          <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Typography
              className="nome-acao"
              variant="h3"
              component="h1"
              sx={{ display: "flex", marginTop: "2%", marginBottom: "0" }}
            >
              Novo Time
            </Typography>
            <Container sx={{ height: "100%" }} maxWidth="md">
              <Box className="boxNovoTime" sx={{ marginTop: "0" }}>
                <Container
                  className="container-nome-tarefa"
                  sx={{ display: "flex" }}
                >
                  <Typography variant="body" component="h5" gutterBottom>
                    Nome:
                  </Typography>

                  <TextField
                    id="nome-time"
                    placeholder="Time ABC"
                    required
                    variant="outlined"
                    sx={{
                      maxHeight: "3px",
                      marginLeft: "20px",
                      width: "inherit",
                    }}
                  ></TextField>
                </Container>

                <Container sx={{ display: "flex" }} className="containerDados">
                  <Typography variant="body" component="h5" gutterBottom>
                    Integrantes:
                  </Typography>
                  <Autocomplete
                    id="integranteSelecionado"
                    options={listaUsuarios.filter((cbox) =>
                      listaIntegrantes.every(
                        (integ) => integ.email !== cbox.email
                      )
                    )}
                    getOptionLabel={(option) => option.nome}
                    sx={{ marginLeft: "20px", width: "50%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Escolha um integrante" />
                    )}
                    onChange={(event, usuario) =>
                      integranteChange(event, usuario)
                    }
                  />
                  {/* <Select
                                        id="integranteSelecionado"
                                        variant="outlined"
                                        sx={{ marginLeft: '20px', width: '50%' }}>
                                        {(listaUsuarios.filter(
                                            cbox => listaIntegrantes.every(integ => integ.email !== cbox.email)
                                        )).map((usuario) => {
                                            if (usuario.hasOwnProperty('email')) {
                                                return <MenuItem
                                                    value={usuario.email}
                                                    key={"USU_" + usuario.email}
                                                    onClick={(event) => integranteChange(event, usuario)}
                                                    selected={integranteSelecionado === usuario}
                                                >
                                                    {usuario.nome}
                                                </MenuItem>;
                                            }
                                        }
                                        )}
                                    </Select> */}
                  <Button
                    onClick={exibirIntegrantes}
                    variant="contained"
                    sx={{ marginLeft: "20px", width: "20%" }}
                  >
                    Incluir
                  </Button>
                </Container>

                <Container
                  overflow={"auto"}
                  className="containerExibeDados"
                  sx={{ display: "flex" }}
                >
                  <List>
                    {listaIntegrantes.map((integrante) => (
                      <Chip
                        key={"INT_CHIP_" + integrante.email}
                        label={integrante.nome}
                        sx={{
                          margin: "0.2em",
                          "&:hover": {
                            backgroundColor: "#fd8f90",
                          },
                        }}
                        onDelete={() => removeIntegrante(integrante)}
                      />
                    ))}
                  </List>
                </Container>

                <Container className="containerSalvar" sx={{ display: "flex" }}>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={criarTimeCompleto}
                    sx={{ width: "20%" }}
                  >
                    Salvar
                  </Button>
                </Container>
              </Box>

              <Button
                variant="contained"
                color="info"
                startIcon={<FaHandPointLeft />}
                onClick={voltar}
              >
                Voltar
              </Button>
            </Container>
          </ThemeProvider>
          <PopupOKPersonalizado
            sair={sair}
            fecharDialog={fecharDialog}
            mensagem={mensagem}
          />
        </Container>
      </div>
    </>
  );
};

export default CriarTimePage;