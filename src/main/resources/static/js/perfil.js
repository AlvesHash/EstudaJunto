import { requireUser, updateProfile, listDiscussions, syncHeader } from './globals/store.js';
import { renderDiscussionList } from './globals/ui.js';

syncHeader();
let user = await requireUser();
if (!user) throw new Error('Login necessário');
syncHeader();

const modal = document.getElementById('editModal');
const form = document.getElementById('profileForm');
const message = document.getElementById('message');

async function render() {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userUsername').textContent = '@' + user.username;
  document.getElementById('avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('userBio').textContent = user.bio || 'Conte um pouco sobre você.';

  let all = [];
  try { all = await listDiscussions(); } catch { /* mostra zeros se falhar */ }
  const mine = all.filter(d => d.username === user.username);
  document.getElementById('discussionCount').textContent = mine.length;
  document.getElementById('commentCount').textContent = all.reduce((n, d) => n + (d.comments || []).filter(c => c.username === user.username).length, 0);
  document.getElementById('likeCount').textContent = mine.reduce((n, d) => n + (d.likes || []).length, 0);
  renderDiscussionList(document.getElementById('discussionsList'), mine);
}

function openModal() {
  document.getElementById('editName').value = user.name;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editBio').value = user.bio || '';
  message.className = 'hidden';
  modal.classList.add('open');
}
function closeModal() { modal.classList.remove('open'); }

document.getElementById('editProfileButton').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelEdit').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('editName').value.trim();
  const username = document.getElementById('editUsername').value.trim().toLowerCase();
  const bio = document.getElementById('editBio').value.trim();
  try {
    user = await updateProfile({ name, username, bio });
    closeModal();
    syncHeader();
    render();
  } catch (error) {
    message.textContent = error.message;
    message.className = 'notice error';
  }
});

render();
