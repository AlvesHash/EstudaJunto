// Comunicação com o servidor Java (API) e estado de login.
// Antes: tudo ficava no localStorage. Agora os dados ficam no banco; o navegador guarda só o "token" de login.

const TOKEN_KEY = 'estudaJunto.token';
const USER_KEY = 'estudaJunto.user';

// ---------- chamada genérica à API ----------
async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  let response;
  try {
    response = await fetch('/api' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.');
  }

  let data = null;
  if (response.status !== 204) {
    try { data = await response.json(); } catch { data = null; }
  }
  if (!response.ok) {
    if (response.status === 401 && token) clearSession();
    throw new Error(data?.erro || 'Algo deu errado. Tente novamente.');
  }
  return data;
}

// ---------- sessão ----------
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
// Usuário guardado no navegador (rápido, usado para desenhar o cabeçalho).
export function currentUser() {
  if (!getToken()) return null;
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}
// Confirma com o servidor quem está logado (e atualiza os dados guardados).
export async function loadUser() {
  if (!getToken()) return null;
  try {
    const user = await api('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}
export async function requireUser() {
  const user = await loadUser();
  if (!user) {
    clearSession();
    window.location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search);
  }
  return user;
}

// ---------- contas ----------
export function register(data) { return api('/auth/cadastro', { method: 'POST', body: data }); }
export function login(email, password) { return api('/auth/login', { method: 'POST', body: { email, password } }); }
export async function logout() {
  try { await api('/auth/logout', { method: 'POST' }); } catch { /* sem problema */ }
  clearSession();
}
export async function updateProfile(data) {
  const user = await api('/auth/me', { method: 'PUT', body: data });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// ---------- discussões ----------
export function listDiscussions() { return api('/discussoes'); }
export function getDiscussion(id) { return api('/discussoes/' + encodeURIComponent(id)); }
export function createDiscussion(data) { return api('/discussoes', { method: 'POST', body: data }); }
export function deleteDiscussion(id) { return api('/discussoes/' + encodeURIComponent(id), { method: 'DELETE' }); }
export function toggleLike(id) { return api('/discussoes/' + encodeURIComponent(id) + '/curtir', { method: 'POST' }); }
export function addComment(id, text) {
  return api('/discussoes/' + encodeURIComponent(id) + '/comentarios', { method: 'POST', body: { text } });
}

// ---------- utilitários ----------
export function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
export function timeAgo(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)} h`;
  if (seconds < 604800) return `há ${Math.floor(seconds / 86400)} d`;
  return new Date(date).toLocaleDateString('pt-BR');
}
export function syncHeader() {
  const user = currentUser();
  const slot = document.querySelector('[data-auth-links]');
  if (!slot) return;
  slot.innerHTML = user
    ? `<a class="btn btn-outline" href="/perfil">Meu perfil</a><button class="btn btn-primary" id="logoutButton" type="button">Sair</button>`
    : `<a class="btn btn-outline" href="/login">Entrar</a><a class="btn btn-primary" href="/cadastro">Cadastrar</a>`;
  document.getElementById('logoutButton')?.addEventListener('click', async () => { await logout(); location.href = '/'; });
}
// Mensagem padrão enquanto o servidor responde (no plano grátis ele pode levar ~1 min para acordar).
export const WAKING_TEXT = 'Conectando ao servidor… na primeira visita pode levar cerca de 1 minuto.';
