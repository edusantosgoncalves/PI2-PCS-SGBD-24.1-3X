import React from "react";
import "../config.css";
import { Link } from "react-router-dom";
import {
  FaTasks,
  FaRegUserCircle,
  FaUsers,
  FaHome,
  FaProjectDiagram,
} from "react-icons/fa";

import {
  Container,
  CssBaseline,
  List,
  ListItem,
  Typography,
} from "@mui/material";

function MenuLateral(props) {
  const locationState = props.locationState;

  let acessoTarefas = "/tarefas";
  let acessoUsuarios = "/usuarios/seguidos";

  if (locationState.admin === "true") {
    acessoTarefas = "/tarefas/adm";
    acessoUsuarios = "/usuarios-adm";
  }

  return (
    <>
      <CssBaseline />
      <Container
        disableGutters
        xs={12}
        className="lateral"
        maxWidth="100px"
        sx={{ display: "flex" }}
      >
        <List className="navbar" sx={{ display: "flex" }}>
          <ListItem>
            <Link to="/home" className="nav-link underline-effect-menu-lateral">
              <FaHome size={20} />
              <Typography variant="body" sx={{ paddingLeft: "10px" }}>
                Home
              </Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/times"
              className="nav-link underline-effect-menu-lateral"
            >
              <FaUsers size={20} />
              <Typography variant="body" sx={{ paddingLeft: "10px" }}>
                Times
              </Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to="/projetos"
              className="nav-link underline-effect-menu-lateral"
            >
              <FaProjectDiagram size={20} />
              <Typography variant="body" sx={{ paddingLeft: "10px" }}>
                Projetos
              </Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to={acessoTarefas}
              sx={{ display: "flex", flexDirection: "row" }}
              className="nav-link underline-effect-menu-lateral"
            >
              <FaTasks size={20} />
              <Typography variant="body" sx={{ paddingLeft: "10px" }}>
                Tarefas
              </Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link
              to={acessoUsuarios}
              className="nav-link underline-effect-menu-lateral"
            >
              <FaRegUserCircle size={30} />
              <Typography variant="body" sx={{ paddingLeft: "10px" }}>
                Usuários
              </Typography>
            </Link>
          </ListItem>
        </List>
      </Container>
    </>
  );
}

export default MenuLateral;
