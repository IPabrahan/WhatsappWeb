import { supabase } from './supabaseClient'
import { hashPassword } from './registrar';

export async function SelectCorreo(nombre, pass){

  const hashespass = await hashPassword(pass)

   let { data: Usuarios, error } = await supabase
    .from('Usuarios')
    .select('correo, id')
    .eq('contraseña', hashespass)
    .eq('nombre', nombre);

    console.log(nombre, hashespass)

    return[Usuarios, error]
}

export async function SelectChats(idParticipante){
  const { data, error } = await supabase
    .from('chats') 
    .select('*') 
    .contains('id_usuario', [idParticipante]);

  if (error) {
    console.error('Error al obtener los chats:', error);
    return null;
  }

  return data;
}

export async function SelectUsuarios(){

  let { data: Usuarios, error } = await supabase
    .from('Usuarios')
    .select('*');

    return[Usuarios, error]
}

export async function SelectMensajes(id) {
  let { data: mensajes, error } = await supabase
    .from("mensajes")
    .select("*")
    .eq("chat_id", id);

  return [mensajes, error];
}

export async function EnviarMensaje(chat_id, sender_id, texto) {
  const { data: mensajes, error } = await supabase
    .from("mensajes")
    .insert([
      {
        chat_id: chat_id, // ID del chat al que pertenece el mensaje
        sender_id: sender_id, // ID del usuario que envía el mensaje
        text: texto, // Contenido del mensaje
      },
    ]);

    console.log(texto)
  return [mensajes, error];
}

export async function EliminarChat(chat_id) {
  const { data: chats, error } = await supabase
    .from("chats")
    .delete()
    .eq("id", chat_id);

    window.location.reload();
  return [chats, error];
}

export async function CrearChat(  id_usuario, is_group=false, name_group=null) {
  const { data: chats, error } = await supabase
    .from("chats")
    .insert([
      {
        is_group: is_group, // TRUE o FALSE dependiendo del tipo de chat
        name_group: name_group, // Nombre del grupo (o null para chats individuales)
        id_usuario: id_usuario, // Array de usuarios, por ejemplo: ["9", "13"]
      },
    ]);

  if (error) {
    console.error("Error al crear el chat:", error);
    return null;
  }

  console.log("Chat creado con éxito:", chats);
  window.location.reload();
  return chats;
}












