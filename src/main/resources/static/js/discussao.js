import { getDiscussion, deleteDiscussion, toggleLike, addComment, currentUser, loadUser, syncHeader, escapeHTML, timeAgo, WAKING_TEXT } from './globals/store.js';

syncHeader();
loadUser().then(() => { syncHeader(); if (item) render(); });

const id = new URLSearchParams(location.search).get('id');
const content = document.getElementById('discussionContent');
const commentsList = document.getElementById('commentsList');
const form = document.getElementById('commentForm');
const input = document.getElementById('commentInput');
const help = document.getElementById('commentHelp');
let item = null;

function showNotFound(text) {
  content.innerHTML = `<div class="empty-state"><strong>Discussão não encontrada</strong>${escapeHTML(text)}<p><a href="/">Voltar ao início</a></p></div>`;
  form.classList.add('hidden');
}

function render() {
  if (!item) return;
  document.title = item.title + ' — Estuda Junto';
  const user = currentUser();
  const likes = item.likes || [];
  const iLiked = !!user && likes.includes(user.username);

  content.innerHTML = `<div class="detail-top"><span class="tag">${escapeHTML(item.category || 'Outros')}</span><button id="likeButton" class="btn ${iLiked ? 'btn-blue' : 'btn-secondary'}" type="button">👍 ${iLiked ? 'Curtido' : 'Curtir'} · ${likes.length}</button></div>
    <h1 class="detail-title">${escapeHTML(item.title)}</h1>
    <div class="author-line"><span class="avatar">${escapeHTML((item.author || '?').charAt(0).toUpperCase())}</span><span><strong>${escapeHTML(item.author)}</strong><br>${timeAgo(item.createdAt)}</span></div>
    <div class="tags">${(item.tags || []).map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
    <div class="detail-content">${escapeHTML(item.question)}</div>
    ${user && user.username === item.username ? '<button class="btn btn-danger" id="deleteButton" type="button">Excluir discussão</button>' : ''}`;

  document.getElementById('likeButton')?.addEventListener('click', async () => {
    if (!currentUser()) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); return; }
    try { item = await toggleLike(id); render(); } catch (error) { alert(error.message); }
  });
  document.getElementById('deleteButton')?.addEventListener('click', async () => {
    if (!confirm('Excluir esta discussão? Esta ação não pode ser desfeita.')) return;
    try { await deleteDiscussion(id); location.href = '/perfil'; } catch (error) { alert(error.message); }
  });

  const comments = item.comments || [];
  document.getElementById('commentCount').textContent = `${comments.length} comentário(s)`;
  commentsList.innerHTML = comments.length
    ? comments.map(c => `<article class="comment"><div class="comment-head"><span class="avatar">${escapeHTML((c.name || '?').charAt(0).toUpperCase())}</span><div><strong>${escapeHTML(c.name)}</strong><div class="muted">${timeAgo(c.createdAt)}</div></div></div><div class="comment-text">${escapeHTML(c.text)}</div></article>`).join('')
    : '<div class="empty-state">Ainda não há comentários. Seja o primeiro a contribuir.</div>';
  help.textContent = user ? 'Compartilhe uma explicação ou dúvida de forma respeitosa.' : 'Entre na sua conta para comentar.';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!currentUser()) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); return; }
  const text = input.value.trim();
  if (text.length < 2 || !item) return;
  try {
    item = await addComment(id, text);
    input.value = '';
    render();
  } catch (error) {
    help.textContent = error.message;
  }
});

async function load() {
  if (!id) { showNotFound('O endereço está incorreto.'); return; }
  content.innerHTML = `<div class="empty-state"><strong>Carregando…</strong>${escapeHTML(WAKING_TEXT)}</div>`;
  try {
    item = await getDiscussion(id);
    render();
  } catch (error) {
    showNotFound(error.message);
  }
}
load();
