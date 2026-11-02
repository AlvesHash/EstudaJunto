import { register, setSession, WAKING_TEXT } from './globals/store.js';

const form = document.getElementById('registerForm');
const message = document.getElementById('message');
const button = form.querySelector('button[type="submit"]');

function show(text, ok = false) {
  message.textContent = text;
  message.className = `notice ${ok ? 'success' : 'error'}`;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  if (!/^[a-z0-9_]{3,20}$/.test(username)) { show('O usuário deve ter de 3 a 20 caracteres: letras, números ou _.'); return; }
  if (password.length < 6) { show('A senha precisa ter pelo menos 6 caracteres.'); return; }

  button.disabled = true;
  show(WAKING_TEXT, true);
  try {
    const { token, user } = await register({ username, password });
    setSession(token, user);
    show('Conta criada. Abrindo seu perfil...', true);
    setTimeout(() => location.href = '/perfil', 300);
  } catch (error) {
    show(error.message);
    button.disabled = false;
  }
});

