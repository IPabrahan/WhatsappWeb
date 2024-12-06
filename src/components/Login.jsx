import "../css/login.css"
import { LoginUser } from "../conecctions/LoginUser"
import { SelectCorreo } from "../conecctions/Consultas"
import { hashPassword } from "../conecctions/registrar"


function Login({ handler }) {
    return <>
        <div className="contenedor-Register">
            <p>Login Whatsapp</p>
            <label>Usuario</label>
            <input type="usuario" id="usuario"></input>
            <label >contraseña</label>
            <input type="contrasenia" id="contrasenia"></input>
            <button onClick={validarLogin}>Login</button>
            <p id="error"></p>
            <button onClick={handler}>ir a Register</button>
        </div >

    </>
}

async function validarLogin() {
    const campoUser = document.getElementById("usuario").value;
    const Constrasenia = document.getElementById("contrasenia").value;
    const campoError = document.getElementById("error");

    const ConsultaCorreo = await SelectCorreo(campoUser, Constrasenia)

    console.log(ConsultaCorreo, "ESTOO")
    if (campoUser != "" || Constrasenia != "") {
        if (ConsultaCorreo[0].length == 0) {
            campoError.classList.add("error");
            campoError.innerHTML = "Usuario o contraseña incorrectos"

        } else if (ConsultaCorreo[1]) {
            campoError.classList.add("error");
            campoError.innerHTML = "Algo ha ido mal"
        } else {
            campoError.classList.remove("error");
            campoError.innerHTML = ""
            const datosLogin = await LoginUser(ConsultaCorreo[0][0].correo, Constrasenia)
            console.log(await hashPassword(Constrasenia))
            console.log(ConsultaCorreo[0][0].correo)
            console.log(datosLogin)
            if (datosLogin[1]) {
                campoError.classList.add("error");
                campoError.innerHTML = "ERROR, REINICIA"
            } else {
                sessionStorage.setItem("token-sesion", datosLogin[0].session.access_token);
                sessionStorage.setItem("refresh-token", datosLogin[0].session.refresh_token);
                sessionStorage.setItem("nombre", campoUser);
                sessionStorage.setItem("id", ConsultaCorreo[0][0].id);
                window.location.reload();
            }
        }
    } else {
        campoError.classList.add("error");
        campoError.innerHTML = "No puedes dejar ningun campo en blanco"
    }

}

export default Login