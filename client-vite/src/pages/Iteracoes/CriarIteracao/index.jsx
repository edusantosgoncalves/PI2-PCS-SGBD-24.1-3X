import React from "react";

//Imports da MUI
import {
    Container, Typography, Button, TextField,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Snackbar, Alert, AlertTitle
} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';

import MuiEstilosPersonalizados from '../../../components/MuiEstilosPersonalizados';

function CriarIteracao(props) {

    // ! Instanciando variáveis de notificação
    const [abreNaoPode, setAbreNaoPode] = React.useState(false);
    const [msgAlerts, setMsgAlerts] = React.useState("");

    const fechaAlertNaoPode = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAbreNaoPode(false);
    };

    const criaDados = () => {
        // ! Validar campos
        if (document.getElementById("nomeItera").value.length <= 0) {
            setAbreNaoPode(true)
            setMsgAlerts("Nome da iteração inválido!")
            return;
        }

        if (document.getElementById("dtInicioItera").value.length <= 0) {
            setAbreNaoPode(true)
            setMsgAlerts("Data de Início da Iteração inválida!")
            return;
        }

        if (document.getElementById("dtConcItera").value.length <= 0) {
            setAbreNaoPode(true)
            setMsgAlerts("Data de Conclusão da Iteração inválida!")
            return;
        }

        let dtIni = new Date(document.getElementById("dtInicioItera").value);
        let dtConc = new Date(document.getElementById("dtConcItera").value);
        let diffTempo = dtConc.getTime() - dtIni.getTime();
        let diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));

        if (diffDias <= 0) {
            setAbreNaoPode(true)
            setMsgAlerts("Data de conclusão igual ou anterior a data de início: " + diffDias)
            return;
        }

        props.criarIteracao(
            document.getElementById("nomeItera").value,
            document.getElementById("descricaoItera").value,
            document.getElementById("dtInicioItera").value,
            document.getElementById("dtConcItera").value)

    }

    return (
        <div>
            <ThemeProvider theme={MuiEstilosPersonalizados}>
                <Dialog open={props.saiItera} onClose={props.sairItera} >
                    <DialogTitle sx={{ backgroundColor: 'fundoCard' }}>Criar Iteração</DialogTitle>
                    <DialogContent sx={{ backgroundColor: 'fundoCard' }}>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="nomeItera"
                            label="Nome"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue=""
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="descricaoItera"
                            label="Descrição"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue=""
                        />

                        <Container className="containerNome" sx={{ display: 'flex' }}>
                            <Typography gutterBottom>
                                Data de Início:
                            </Typography>
                            <TextField id="dtInicioItera" variant="standard" type="date" />
                        </Container>

                        <Container className="containerNome" sx={{ display: 'flex' }}>
                            <Typography gutterBottom>
                                Data de Conclusão:
                            </Typography>
                            <TextField id="dtConcItera" variant="standard" type="date" />
                        </Container>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: 'fundoCard' }}>
                        <Button onClick={props.sairItera}>
                            Cancelar
                        </Button>

                        <Button onClick={criaDados}>
                            Criar Iteracao
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={abreNaoPode}
                autoHideDuration={2500}
                onClose={fechaAlertNaoPode}>
                <Alert onClose={fechaAlertNaoPode} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Não é possível</AlertTitle>
                    {msgAlerts}
                </Alert>
            </Snackbar>
        </div>
    );

    /*
    //DO dialog novo
    <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
    
    
    <Dialog fullScreen={fullScreen} open={props.sair} onClose={props.criarIteracao}>
            <DialogTitle>
                {props.mensagem}
            </DialogTitle>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.criarIteracao}>
                    OK
                </Button>
            </DialogActions>
    </Dialog>*/
}


export default CriarIteracao;