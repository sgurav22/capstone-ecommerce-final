import { fetchProducts } from './api.js';
let allProducts = [], filtered = [], cart = JSON.parse(localStorage.getItem('cart')||'[]'), activeCat='all';
const grid=document.getElementById('grid'), skeleton=document.getElementById('skeleton'), search=document.getElementById('search'), sort=document.getElementById('sort'), tabs=document.getElementById('tabs'), errorDiv=document.getElementById('error'), cartCount=document.getElementById('cartCount');
const authModal=document.getElementById('authModal'), loginBtn=document.getElementById('loginBtn'), cartDrawer=document.getElementById('cartDrawer');

function updateAuthUI(){ const user=localStorage.getItem('user'); loginBtn.textContent=user?`Logout (${user})`:'Login'; document.getElementById('userStatus').textContent=user?`Logged in as ${user}`:'Not logged in'; }
function renderTabs(){ const cats=['all',...new Set(allProducts.map(p=>p.category))]; tabs.innerHTML=cats.map(c=>`<button class="tab ${activeCat===c?'active':''}" data-cat="${c}">${c}</button>`).join(''); document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{activeCat=b.dataset.cat; apply(); renderTabs();})); }
function renderProducts(list){ grid.innerHTML=list.map(p=>`<div class="card"><img src="${p.image}"><h4>${p.title.slice(0,45)}</h4><p>$${p.price}</p><p class="small">${p.category}</p><button class="add" data-id="${p.id}">Add to Cart</button></div>`).join(''); document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{ cart.push({id:btn.dataset.id, qty:1}); localStorage.setItem('cart',JSON.stringify(cart)); updateCart(); })); }
function apply(){ let r=[...allProducts]; if(activeCat!=='all') r=r.filter(p=>p.category===activeCat); if(search.value) r=r.filter(p=>p.title.toLowerCase().includes(search.value.toLowerCase())); if(sort.value==='low-high') r.sort((a,b)=>a.price-b.price); if(sort.value==='high-low') r.sort((a,b)=>b.price-a.price); filtered=r; renderProducts(filtered); }
function updateCart(){ cartCount.textContent=cart.length; localStorage.setItem('cart',JSON.stringify(cart)); renderCart(); }
function renderCart(){ document.getElementById('cartItems').innerHTML=cart.length?cart.map((c,i)=>`<div>${c.id} - Qty ${c.qty} <button onclick="this.parentElement.remove()">Remove</button></div>`).join(''):'Empty'; }

async function init(){ skeleton.innerHTML=Array(8).fill(0).map(()=>`<div class="card skeleton"></div>`).join(''); try{ allProducts=await fetchProducts(); skeleton.classList.add('hidden'); renderTabs(); apply(); }catch(e){ errorDiv.textContent='Failed to load API. Check internet.'; errorDiv.classList.remove('hidden'); skeleton.classList.add('hidden'); } updateCart(); updateAuthUI(); }
loginBtn.addEventListener('click',()=>{ const user=localStorage.getItem('user'); if(user){ localStorage.removeItem('user'); updateAuthUI(); } else authModal.classList.remove('hidden'); });
document.getElementById('doLogin').addEventListener('click',()=>{ const email=document.getElementById('emailInput').value; if(email){ localStorage.setItem('user',email); authModal.classList.add('hidden'); updateAuthUI(); }});
document.getElementById('closeModal').addEventListener('click',()=>authModal.classList.add('hidden'));
document.getElementById('cartBtn').addEventListener('click',()=>cartDrawer.classList.remove('hidden'));
document.getElementById('closeCart').addEventListener('click',()=>cartDrawer.classList.add('hidden'));
document.getElementById('checkout').addEventListener('click',()=>{ if(!localStorage.getItem('user')) return alert('Please login first - Auth simulation'); alert('Order placed! CRUD success'); cart=[]; updateCart(); });
search.addEventListener('input',apply); sort.addEventListener('change',apply);
init();
