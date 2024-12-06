import { supabase } from './supabaseClient'

export async function LoginUser(correo, contra){

let { data, error } = await supabase.auth.signInWithPassword({
  email: correo,
  password: contra
})

return [data, error]


}