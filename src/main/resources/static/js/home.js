import { currentUser, loadUser, syncHeader, listDiscussions, WAKING_TEXT } from './globals/store.js';
import { renderDiscussionList, renderMessage, bindSearch, filterDiscussions } from './globals/ui.js';

const input = document.getElementById('searchInput');
const list = document.getElementById('discussionList');
const count = document.getElementById('resultCount');
let all = [];
let category = 'Todas';
let query = new URLSearchParams(location.search).get('busca') || '';
input.value = query;
syncHeader();
loadUser().then(syncHeader);

function render() {
  const results = filterDiscussions(all, query.toLocaleLowerCase('pt-BR'), category);
  renderDiscussionList(list, results);
  count.textContent = `${results.length} resultado(s)`;
}

bindSearch(input, value => { query = value; render(); });
document.getElementById('categoryList').addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  category = button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(el => el.classList.toggle('active', el === button));
  render();
});
document.getElementById('createButton').addEventListener('click', () => {
  if (!currentUser()) { location.href = '/login?next=%2Fcriar'; return; }
  location.href = '/criar';
});

async function load() {
  renderMessage(list, 'Carregando discussões…', WAKING_TEXT);
  try {
    all = await listDiscussions();
    render();
  } catch (error) {
    renderMessage(list, 'Não foi possível carregar', error.message);
  }
}
load();
