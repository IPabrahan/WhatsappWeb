import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./components/register.jsx";
import Login from "./components/Login.jsx";

function RootComponent() {
  const [LoginRegister, setLoginRegister] = useState(false);

  function manejarRegistroLogin() {
    setLoginRegister(!LoginRegister);
    console.log(LoginRegister);

  }

  const refreshToken = sessionStorage.getItem("refresh-token");
  const tokenSesion = sessionStorage.getItem("token-sesion");
  const nombre = sessionStorage.getItem("nombre");
  const id = sessionStorage.getItem("id");


  return (
    <StrictMode>
      {(refreshToken && tokenSesion && nombre && id )? (
        <App />
      ) : LoginRegister ? (
        <Register handler={manejarRegistroLogin} />
      ) : (
        <Login handler={manejarRegistroLogin} />
      )}
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<RootComponent />);
