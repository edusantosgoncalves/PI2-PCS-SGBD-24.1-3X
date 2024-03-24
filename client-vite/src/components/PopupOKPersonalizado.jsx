import React from "react";

//Imports da MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, ThemeProvider } from '@mui/material/styles';

import MuiEstilosPersonalizados from "./MuiEstilosPersonalizados";

function PopupOKPersonalizado(props) {
    // ! Imports para o popUp
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <ThemeProvider theme={MuiEstilosPersonalizados}>
            <Dialog fullScreen={fullScreen} open={props.sair} onClose={props.fecharDialog}>
                <DialogTitle sx={{ backgroundColor: 'fundoCard' }}>
                    {props.mensagem}
                </DialogTitle>
                <DialogActions sx={{ backgroundColor: 'fundoCard' }}>
                    <Button variant="outlined" color="secondary" onClick={props.fecharDialog}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e4b0ff',
                            },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}


export default PopupOKPersonalizado;