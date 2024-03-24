import React from "react";
import '../config.css';

//Outros imports
import mainLogo from '../images/Logo ctracado.png'
import { Avatar, Badge, Typography, ThemeProvider } from '@mui/material';
import { Link, redirect } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';


import PopupEncerrarSessao from './PopupEncerrarSessao';
import MuiEstilosPersonalizados from './MuiEstilosPersonalizados'

function BarraLogo(props) {
    const locationState = props.locationState;

    /* PARA APARECER O POPUP */
    // ! Declarando variável que receberá se a pessoa quer deslogar
    const [sair, setSair] = React.useState(false);

    // ! Função que define a aparição do popup de Encerrar Sessão
    const encerrarSessao = () => {
        setSair(true);
    };
    const negaSaida = () => {
        setSair(false);
    }


    return (
        <div className="header-principal">

            <ThemeProvider theme={MuiEstilosPersonalizados}>
                <div className="container-header-logo">
                    <div className="container-header img-logo">
                        <Link to="/home" state={{ admin: locationState.admin, usuario: locationState.usuario }} >
                            <img src={mainLogo} width="300px" alt="Logo 3X" id="logo3X" />
                        </Link>
                    </div>
                </div>
                <div className="container-header app-name">
                    <Typography variant="h3" sx={{ fontWeight: '900' }}>
                        Gestão de Projetos
                    </Typography>
                </div>
                <div className="container-header profile-picture">
                    <span className="navBarItemLista">

                        <div className="nav-link2">
                            <Badge
                                sx={{
                                    transform: "translate(-25%, -50%) rotate(45deg)",
                                }}
                                badgeContent={locationState.admin === "true" ? '👑' : ''}
                            >
                                <Avatar
                                    alt={"img_" + locationState.usuario.nome}
                                    src={locationState.usuario.urlImagem}
                                    referrerPolicy="no-referrer"
                                    sx={{ transform: "translate(50%, 10%) rotate(-45deg)" }}
                                />
                            </Badge>
                            <Typography variant="body2" sx={{ fontWeight: '600', display: 'block', color: 'white' }}>
                                {locationState.usuario.nome}
                            </Typography>
                        </div>

                        <div className="navBarItemLista-lista">

                            <Link to="/alterardados" state={{ admin: locationState.admin, usuario: locationState.usuario }} >
                                Meus dados
                            </Link>
                            <Link to="/avaliacoes" state={{ admin: locationState.admin, usuario: locationState.usuario }} >
                                Avaliações
                            </Link>
                            <a onClick={encerrarSessao}>
                                Encerrar sessão
                            </a>
                        </div>
                    </span>
                </div>
            </ThemeProvider>
            <PopupEncerrarSessao sair={sair} negaSaida={negaSaida}></PopupEncerrarSessao>

        </div>
    );
}

export default BarraLogo;