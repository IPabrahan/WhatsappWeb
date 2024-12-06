import { supabase } from "./supabaseClient";

export async function insertUser(uid, usuario, email, contrasenia){
    
const { data, error } = await supabase
  .from('Usuarios').insert([
    { uid: uid, 
    correo: email, 
    nombre: usuario, 
    contraseña: contrasenia 
    },
  ])
  .select()


  return [data,error]
  
}
          