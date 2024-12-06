import { useState } from "react";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { EliminarChat, EnviarMensaje, SelectMensajes } from "../conecctions/Consultas";
import { SelectUsuarios } from "../conecctions/Consultas";

/* eslint-disable react/prop-types */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const apptitle = import.meta.env.VITE_TITLE;

const supabase = createClient(supabaseUrl, supabaseKey);

function ChatWindow({ selectedChat }) {
  const [usuarios, setUsuarios] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedChat) {
      const fetchDatos = async () => {
        console.log(selectedChat.id);
  
        
        setMessages([]); 
  
        const Mensajes = await SelectMensajes(selectedChat.id);
        const UsuariosTotales = await SelectUsuarios();
  
        setMessages((prevMessages) => {
          const mensajesExistentesIds = new Set(prevMessages.map((msg) => msg.id));
          const nuevosMensajes = Mensajes[0].filter((msg) => !mensajesExistentesIds.has(msg.id));
          return [...prevMessages, ...nuevosMensajes];
        });
  
        setUsuarios(UsuariosTotales[0]);
  
        console.log(usuarios, "USUARIOS (después de obtener)");
      };
  
      fetchDatos();
    }
  }, [selectedChat]);
  
  

  useEffect(() => {
    let canal;
  
    const subscribirseMensajes = () => {
      canal = supabase
        .channel("tabla-mensajes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "mensajes" },
          (payload) => {
            const nuevoMensaje = payload.new;
  
            
            setMessages((prevMessages) => {
              const existe = prevMessages.some((msg) => msg.id === nuevoMensaje.id);
              return existe ? prevMessages : [...prevMessages, nuevoMensaje];
            });
  
            console.log(apptitle + " Nuevo mensaje: " + nuevoMensaje.cuerpo);
          }
        )
        .subscribe();
    };
  
    if (selectedChat) {
      subscribirseMensajes();
    }
  
    return () => {
      if (canal) {
        supabase.removeChannel(canal); 
      }
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
  if (newMessage.trim()) {
    const textaco = document.getElementById("Input-Texto").value;

    
    await EnviarMensaje(selectedChat.id, sessionStorage.getItem("id"), textaco);

    
    setNewMessage("");
  }
};


  if (!selectedChat) {
    return <div className="chat-window">Select a chat to start messaging</div>;
  }

  return (
    <div className="chat-window">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"></link>
      <div className="chat-header">
        {selectedChat.name_group ? (
          <Avatar />
        ) : usuarios.length !== 0 ? (
          <Avatar>
            {selectedChat.is_group
              ? selectedChat.name_group
              : selectedChat.is_group ? selectedChat.name_group : usuarios.filter((e) => e.id == (selectedChat.id_usuario.filter((e) => e != sessionStorage.getItem("id"))))[0].nombre.charAt(0)}
          </Avatar>
        ) : (
          <Avatar />
        )}
        {usuarios.length !== 0 ? 
          <h3>
            {selectedChat.is_group
              ? selectedChat.name_group
              : selectedChat.is_group ? selectedChat.name_group : usuarios.filter((e) => e.id == (selectedChat.id_usuario.filter((e) => e != sessionStorage.getItem("id"))))[0].nombre}
          </h3>
         : 
          <h3>
            {selectedChat.is_group ? selectedChat.name_group : selectedChat.id_usuario.filter((e) => e !== sessionStorage.getItem("id"))}
          </h3>
          
        }
        <i className="fas fa-trash" onClick={() => EliminarChat(selectedChat.id)}></i>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <Message key={message.id} text={message.text} sender={message.sender_id} />
        ))}
      </div>
      <div className="input-box">
        <input
          id="Input-Texto"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <Fab variant="extended" onClick={handleSendMessage}>
          <SendIcon sx={{ color: "#005000" }} />
          Enviar
        </Fab>
        <Fab variant="extended">
          <AttachFileIcon sx={{ color: "#005000" }} />
        </Fab>
      </div>
    </div>
  );
}

export default ChatWindow;
