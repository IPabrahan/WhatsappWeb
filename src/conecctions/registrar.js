import { supabase } from './supabaseClient'


export async function Registrar(user, pass){

let { data, error } = await supabase.auth.signUp({
  email: user,
  password: pass
})

return [data, error]
}

export async function eliminarUsuario(userId) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error al eliminar el usuario:', error);
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Usuario eliminado con éxito' };

  } catch (err) {
    console.error('Error inesperado:', err);
    return { success: false, message: 'Error inesperado' };
  }
}

export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
}




