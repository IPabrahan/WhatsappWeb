import "../css/Register.css"
import { Registrar } from "../conecctions/registrar"
import { hashPassword } from "../conecctions/registrar"
import { insertUser } from "../conecctions/insertarUser"
import { SelectCorreo } from "../conecctions/Consultas"


function Register({ handler }) {

    return (<>
        <div className="contenedor-Register">
            <p>Register Whatsapp</p>
            <label>Usuario</label>
            <input type="usuario" id="usuario"></input>
            <label>email</label>
            <input type="email" id="email"></input>
            <label >contraseña</label>
            <input type="contrasenia" id="contrasenia"></input>
            <button onClick={validarForm}>Register</button>
            <p id="error"></p>
            <button onClick={handler}>ir a Login</button>
        </div >
    </>)
}

async function validarForm() {
    const campoUser = document.getElementById("usuario").value;
    const campoEmail = document.getElementById("email").value;
    const campoContrasenia = document.getElementById("contrasenia").value;
    const campoError = document.querySelector("#error");
    campoError.classList.add("error");
    
    if (campoUser !== "" && campoEmail !== "" && campoContrasenia !== "") {
        try {
            const datos = await Registrar(campoEmail, campoContrasenia);
            console.log(datos)
            if (datos[1]) {
                console.log(datos[1])
                campoError.textContent = "Error";
            } else {
                const correo = datos[0].user.email
                const user = campoUser
                const contra = await hashPassword(campoContrasenia)
                try {
                    const insertData = await insertUser(datos[0].user.id, user, correo, contra);
                    console.log("Datos del insert")
                    console.log(insertData)
                    if (insertData[1]) {
                        console.log("eliminamos el usuario")
                        eliminarUsuario(campoEmail)
                    } else {
                        campoError.classList.add("error");
                        campoError.textContent = "";
                        window.location.reload();
                    }
                } catch (error) {
                    console.log(error)
                    campoError.textContent = "Error";
                }
            }

        } catch (error) {
            console.log(error)
            campoError.textContent = "Error";
        }
    } else {
        campoError.textContent = "Error, no puede haber campos vacios";
    }
}



export default Register



