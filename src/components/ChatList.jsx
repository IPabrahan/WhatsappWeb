// import chats from "../mocks/chats";
import "../css/ChatList.css"
import Avatar from "@mui/material/Avatar";
import { CrearChat, SelectChats } from "../conecctions/Consultas";
import { useState } from "react";
import { useEffect } from "react";
import { SelectUsuarios } from "../conecctions/Consultas";


/* mapea los chats que está en los mocks/chats.js y los muestra en la lista de chats  
debes pensar donde hacer el fetch, si pasarlo como props... pero no lo dejes como variable global
*/
/* eslint-disable react/prop-types */

function cerrarSesion() {
  sessionStorage.clear()
  window.location.reload();
}


function ChatList({ onSelectChat }) {
  const [chats, cambiarChats] = useState()
  const [usuarios, setUsuarios] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");


  function handleModal() {
    setModalVisible(!isModalVisible)
  }

  useEffect(() => {
    const datosfetch = async () => {
      const TotalChats = await SelectChats(sessionStorage.getItem("id")); // Obtén los chats
      const UsuariosTotales = await SelectUsuarios(); // Obtén los Usuarios
      cambiarChats(TotalChats);
      setUsuarios(UsuariosTotales);
    }
    datosfetch()

  }, [])


  if (chats && usuarios) {
    // console.log(chats)
    return (
      < div className="chat-list" >

        <div className={`modal ${isModalVisible ? "visible" : "escondido"}`}>
          <div className="modal-content">
            <h2>Crear nuevo chat</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nombre del usuario"
            />
            <label>Grupo?</label>
            <input
              type="checkbox"
              onChange={() => {
                const checkeoLabel = document.getElementById("checkeo");
                checkeoLabel.innerHTML = checkeoLabel.innerHTML === "no" ? "si" : "no";
              }}
              placeholder="esGrupo"
            />
            <label id="checkeo">no</label>
            <button className="create-chat-button" onClick={() => {
              // Filtramos el usuario por su nombre
              const selectedUser = usuarios[0].find(user => user.nombre.toLowerCase() === userName.toLowerCase());

              // Comprobamos si el nombre del usuario es válido
              if (selectedUser) {
                const userId = selectedUser.id;

                // Definir el array de usuarios que participan en el chat (incluyendo al usuario actual)
                const idUsuarios = [sessionStorage.getItem("id"), userId];

                // Llamamos a la función CrearChat con el ID de los usuarios y los detalles del grupo
                CrearChat(idUsuarios, document.getElementById("checkeo").innerHTML === "si", userName)
                  .then((chats) => {
                    console.log("Chat creado exitosamente:", chats);
                  })
                  .catch((error) => {
                    console.error("Error al crear el chat:", error);
                  });
              } else {
                alert("Usuario no encontrado");
              }
            }}>
              Crear Chat
            </button>
            <button className="close-modal-button" onClick={handleModal}>
              Cancelar
            </button>
          </div>
        </div>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-container">
              {chat.avatar ? (
                <Avatar src={chat.avatar} alt={chat.name} />
              ) : (
                <Avatar>{chat.is_group ? chat.name_group.charAt(0) : (usuarios[0].filter((e) => e.id == (chat.id_usuario.filter((e) => e != sessionStorage.getItem("id"))))[0].nombre).charAt(0)}</Avatar>
              )}

              <div className="chat-info">
                <h4>{chat.is_group ? chat.name_group : usuarios[0].filter((e) => e.id == (chat.id_usuario.filter((e) => e != sessionStorage.getItem("id"))))[0].nombre}</h4>
              </div>
            </div>
          </div>
        ))}
        <div className="Cerrar-sesion" onClick={cerrarSesion}>Cerrar Sesion</div>
        <div className="addChat" onClick={handleModal}>+</div>
      </div >
    );
  }
}

export default ChatList;
