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
  const name = document.getElementById('name').value.trim();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (name.length < 2) { show('Informe um nome com pelo menos 2 caracteres.'); return; }
  if (password.length < 6) { show('A senha precisa ter pelo menos 6 caracteres.'); return; }
  if (password !== confirm) { show('As senhas não são iguais.'); return; }

  button.disabled = true;
  show(WAKING_TEXT, true);
  try {
    const { token, user } = await register({ name, username, email, password });
    setSession(token, user);
    show('Conta criada. Abrindo seu perfil...', true);
    setTimeout(() => location.href = '/perfil', 300);
  } catch (error) {
    show(error.message);
    button.disabled = false;
  }
});
