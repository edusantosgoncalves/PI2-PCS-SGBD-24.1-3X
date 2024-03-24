import React from "react";
import '../config.css';

//Outros imports
import mainLogo from '../images/Logo ctracado.png'
import Button from '@mui/material/Button';
import { FaHandPointLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import MuiEstilosPersonalizados from './MuiEstilosPersonalizados';

function BarraLogoAlterarDados() {
    const redirect = useNavigate();

    //Função que volta pra página anterior
    const voltar = () => {
        redirect(-1);
    }

    return (
        <div className="header-principal">
            <div className="container-header-logo">
                <div className="container-header img-logo">
                    <img src={mainLogo} width="300px" alt="Logo 3X" />
                </div>
                <div className="container-header app-name">
                    <h1>Gestão de Projetos</h1>
                </div>

            </div>
            <div className="container-header-voltar">
                <div className="container-header">
                    <ThemeProvider theme={MuiEstilosPersonalizados}>
                        <Button variant="contained" color="info" startIcon={<FaHandPointLeft />} onClick={voltar}>
                            Voltar
                        </Button>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );

}

export default BarraLogoAlterarDados;