import { discussions, escapeHTML, timeAgo, currentUser } from './store.js';

export function renderDiscussionCard(item) {
  const count = item.comments?.length || 0;
  const liked = currentUser() && (item.likes || []).includes(currentUser().username);
  return `<article class="discussion-card" data-id="${escapeHTML(item.id)}">
    <div class="tags"><span class="tag">${escapeHTML(item.category || 'Outros')}</span>${(item.tags || []).slice(0,3).map(tag=>`<span class="tag">${escapeHTML(tag)}</span>`).join('')}</div>
    <h2><a href="/discussao?id=${encodeURIComponent(item.id)}">${escapeHTML(item.title)}</a></h2>
    <p>${escapeHTML(item.question)}</p>
    <div class="discussion-info"><span>Por ${escapeHTML(item.author)}</span><span>💬 ${count} comentário(s)</span><span>👍 ${(item.likes||[]).length}${liked?' · você curtiu':''}</span><span>${timeAgo(item.createdAt)}</span></div>
  </article>`;
}
export function renderDiscussionList(target, list) {
  if (!target) return;
  target.innerHTML = list.length ? list.map(renderDiscussionCard).join('') : `<div class="empty-state"><strong>Nenhuma discussão encontrada</strong>Tente outra pesquisa ou escolha uma categoria diferente.</div>`;
}
export function bindSearch(input, onSearch) {
  if (!input) return;
  input.addEventListener('input', () => onSearch(input.value.trim().toLocaleLowerCase('pt-BR')));
}
export function searchAndFilter(search='', category='Todas') {
  return discussions().filter(item => {
    const text = `${item.title} ${item.question} ${item.category} ${(item.tags||[]).join(' ')} ${item.author}`.toLocaleLowerCase('pt-BR');
    return (!search || text.includes(search)) && (category === 'Todas' || item.category === category);
  }).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
}
