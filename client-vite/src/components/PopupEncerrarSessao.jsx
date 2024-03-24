import React from "react";

//Imports da MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import MuiEstilosPersonalizados from "./MuiEstilosPersonalizados";

import { useNavigate } from 'react-router-dom';


function PopupEncerrarSessao(props) {


    // ! Imports para o popUp
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    //Instanciando função de redirecionamento para a saida
    const redirect = useNavigate();

    // ! Definindo a função do botão do popup: definir false a acessoNegado para que o popup desapareça
    const confirmaSaida = () => {
        localStorage.clear();
        redirect("/");
    }

    return (
        <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Dialog fullScreen={fullScreen} open={props.sair} onClose={props.negaSaida}>
                <DialogTitle sx={{ backgroundColor: 'fundoCard' }}>
                    {"Você deseja encerrar a sessão?"}
                </DialogTitle>
                <DialogActions sx={{ backgroundColor: 'fundoCard' }}>
                    <Button variant="outlined" onClick={props.negaSaida}
                        sx={{
                            color: 'red', borderColor: 'red',
                            '&:hover': {
                                backgroundColor: '#fd8f90',
                                borderColor: 'red',
                            },
                        }}
                    >
                        CANCELAR
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={confirmaSaida}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e4b0ff',
                            },
                        }}
                    >
                        SAIR
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}


export default PopupEncerrarSessao;