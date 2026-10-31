import { requireUser, createDiscussion, syncHeader } from './globals/store.js';

syncHeader();
const user = await requireUser();
syncHeader();

const form = document.getElementById('discussionForm');
const message = document.getElementById('message');
const button = form.querySelector('button[type="submit"]');

function show(text) { message.textContent = text; message.className = 'notice error'; }

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!user) return;
  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value;
  const question = document.getElementById('question').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);

  if (title.length < 5 || question.length < 10) {
    show('Use um título de pelo menos 5 caracteres e um conteúdo de pelo menos 10.');
    return;
  }
  button.disabled = true;
  try {
    const created = await createDiscussion({ title, category, question, tags });
    location.href = '/discussao?id=' + encodeURIComponent(created.id);
  } catch (error) {
    show(error.message);
    button.disabled = false;
  }
});
