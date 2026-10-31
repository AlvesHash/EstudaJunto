import { login, setSession, WAKING_TEXT } from './globals/store.js';

const form = document.getElementById('loginForm');
const message = document.getElementById('message');
const button = form.querySelector('button[type="submit"]');

function show(text, ok = false) {
  message.textContent = text;
  message.className = `notice ${ok ? 'success' : 'error'}`;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  button.disabled = true;
  show(WAKING_TEXT, true);
  try {
    const { token, user } = await login(email, password);
    setSession(token, user);
    show('Login realizado. Abrindo seu espaço...', true);
    const next = new URLSearchParams(location.search).get('next');
    setTimeout(() => location.href = next && next.startsWith('/') && !next.startsWith('//') ? next : '/perfil', 300);
  } catch (error) {
    show(error.message);
    button.disabled = false;
  }
});
