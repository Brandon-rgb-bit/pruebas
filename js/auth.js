// js/auth.js
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Inicio de sesión
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert('Error al iniciar sesión: ' + error.message);
        return;
      }

      // Verifica si el correo está confirmado
      const { user } = data;
      if (!user.email_confirmed_at) {
        alert('Debes confirmar tu correo electrónico antes de iniciar sesión.');
        await supabase.auth.signOut();
        return;
      }

      alert('Bienvenido');
      window.location.href = 'dashboard.html';
    });
  }

  // Registro de usuario
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5500/mi-sitio-inmobiliario/login.html'
        }
      });

      if (error) {
        alert('Error al registrarse: ' + error.message);
      } else {
        alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
        window.location.href = 'login.html';
      }
    });
  }
});
