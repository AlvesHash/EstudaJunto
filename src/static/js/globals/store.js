const USERS_KEY = 'estudaJunto.users.v2';
const DISCUSSIONS_KEY = 'estudaJunto.discussions.v2';
const SESSION_KEY = 'estudaJunto.session.v2';

const starterDiscussions = [
  {id:'demo-historia',title:'Quais foram as principais causas da Revolta da Vacina?',category:'História',question:'Estou estudando a Revolta da Vacina, ocorrida no Rio de Janeiro em 1904. Como a vacinação obrigatória se relacionou com as reformas urbanas e a insatisfação popular?',author:'João Silva',username:'joaosilva',createdAt:new Date(Date.now()-7200000).toISOString(),tags:['Brasil','República Velha'],likes:[],comments:[{id:'c-hist-1',username:'mariacosta',name:'Maria Costa',text:'A imposição da vacinação ocorreu em um contexto de reformas urbanas autoritárias e falta de diálogo com a população.',createdAt:new Date(Date.now()-3600000).toISOString()}]},
  {id:'demo-matematica',title:'Alguém pode explicar a fórmula de Bhaskara?',category:'Matemática',question:'Estou tendo dificuldade para entender equações do segundo grau. Como a fórmula funciona e quando devo utilizá-la?',author:'Maria Costa',username:'mariacosta',createdAt:new Date(Date.now()-14400000).toISOString(),tags:['Ensino Médio','Álgebra'],likes:[],comments:[]},
  {id:'demo-ciencias',title:'Como funciona a fotossíntese?',category:'Ciências',question:'Alguém poderia explicar de maneira simples como as plantas transformam luz em energia química?',author:'Pedro Lima',username:'pedrolima',createdAt:new Date(Date.now()-86400000).toISOString(),tags:['Biologia'],likes:[],comments:[]},
  {id:'demo-tech',title:'Qual linguagem de programação devo aprender primeiro?',category:'Tecnologia',question:'Estou começando a estudar programação. Vale mais a pena começar com JavaScript, Python ou Java? Quais são as diferenças para quem está aprendendo?',author:'Lucas Rocha',username:'lucasrocha',createdAt:new Date(Date.now()-172800000).toISOString(),tags:['Programação','Iniciantes'],likes:[],comments:[]}
];

function read(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export function users() { return read(USERS_KEY, []); }
export function saveUsers(value) { write(USERS_KEY, value); }
export function discussions() {
  const saved = read(DISCUSSIONS_KEY, null);
  if (!saved) { write(DISCUSSIONS_KEY, starterDiscussions); return starterDiscussions; }
  return saved;
}
export function saveDiscussions(value) { write(DISCUSSIONS_KEY, value); }
export function currentUser() {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;
  return users().find(user => user.username === username) || null;
}
export function setSession(username) { localStorage.setItem(SESSION_KEY, username); }
export function clearSession() { localStorage.removeItem(SESSION_KEY); }
export function updateUser(updated) {
  const list = users(); const index = list.findIndex(user => user.username === updated.username);
  if (index < 0) return false;
  list[index] = updated; saveUsers(list); return true;
}
export async function hashText(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(n => n.toString(16).padStart(2,'0')).join('');
}
export function escapeHTML(value='') {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function timeAgo(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `há ${Math.floor(seconds/60)} min`;
  if (seconds < 86400) return `há ${Math.floor(seconds/3600)} h`;
  if (seconds < 604800) return `há ${Math.floor(seconds/86400)} d`;
  return new Date(date).toLocaleDateString('pt-BR');
}
export function requireUser() {
  const user = currentUser();
  if (!user) { window.location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); }
  return user;
}
export function syncHeader() {
  const user = currentUser();
  const slot = document.querySelector('[data-auth-links]');
  if (!slot) return;
  slot.innerHTML = user
    ? `<a class="btn btn-outline" href="/perfil">Meu perfil</a><button class="btn btn-primary" id="logoutButton" type="button">Sair</button>`
    : `<a class="btn btn-outline" href="/login">Entrar</a><a class="btn btn-primary" href="/cadastro">Cadastrar</a>`;
  document.getElementById('logoutButton')?.addEventListener('click', () => { clearSession(); location.href='/'; });
}
