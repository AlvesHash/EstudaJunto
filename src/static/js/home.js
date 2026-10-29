import { currentUser, syncHeader } from './globals/store.js';
import { renderDiscussionList, bindSearch, searchAndFilter } from './globals/ui.js';
const input=document.getElementById('searchInput'), list=document.getElementById('discussionList'), count=document.getElementById('resultCount');
let category='Todas', query=new URLSearchParams(location.search).get('busca')||'';
input.value=query; syncHeader();
function render(){const results=searchAndFilter(query.toLocaleLowerCase('pt-BR'),category);renderDiscussionList(list,results);count.textContent=`${results.length} resultado(s)`;}
bindSearch(input,value=>{query=value;render()});
document.getElementById('categoryList').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(el=>el.classList.toggle('active',el===button));render()});
document.getElementById('createButton').addEventListener('click',()=>{if(!currentUser()){location.href='/login?next=%2Fcriar';return}location.href='/criar'});
render();
