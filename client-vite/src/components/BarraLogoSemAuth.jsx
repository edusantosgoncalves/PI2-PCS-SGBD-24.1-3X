import React from "react";
import '../config.css';

//Outros imports
import mainLogo from '../images/Logo ctracado.png'

class BarraLogoSemAuth extends React.Component {
    render() {
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
            </div>
        );
    }
}

export default BarraLogoSemAuth;