import { createTheme } from '@mui/material/styles';

import CssBaseline from "@mui/material/CssBaseline";

const temaBase = createTheme();

const MuiEstilosPersonalizados = createTheme({
    typography: {
        fontFamily: [
            'Tajawal',
            'sans-serif'
        ].join(','),

        h3: {
            fontSize: '1.2rem',
            fontWeight: 400,
            '@media (min-width:600px)': {
                fontSize: '1.5rem',
            },
            [temaBase.breakpoints.up('md')]: {
                fontSize: '2.4rem',
            },
        },
    },
    palette: {
        success: {
            main: '#71ead2',
            darker: '#01e7b9',
        },
        error: {
            main: '#e779c1',
            darker: '#e922a3',
        },
        info: {
            main: '#58c7f3',
            darker: '#02b2f8',
        },
        info2: {
            main: '#8458f3',
            darker: '#492ae0'
        },
        warning: {
            main: '#f3cc30',
            darker: '#d3aa05',
        },
        cancel: {
            main: '#f00000',
            darker: '#d3aa05',
        },
        texto: {
            titulo: '#080026',
            descricao: '#282828'
        },
        stt: {
            true: "#ceffd9",
            false: "#ffcfcf",
        },
        verde: '#046000',
        //Definindo estilos dos containers para os cards:
        gridCards: '#b6a1e454',
        fundoCard: '#CDC1F8',
        tituloDetalha: '#27003d',
        subTituloDetalha: '#45006c',
        subTituloDetalhaHover: '#7a24ab',
        textoDetalha: '#5f0195'
    },
    overrides: {
        MuiTypography: {
            h1: {
                fontSize: "0.5rem",
            }
        },
    },
});

export default MuiEstilosPersonalizados;