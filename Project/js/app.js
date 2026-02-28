// Simple frontend app: manages crops in localStorage
const initial = [
  {id:1,name:"Tomato",type:"vegetable",notes:"Greenhouse"},
  {id:2,name:"Wheat",type:"grain",notes:"Field A"},
  {id:3,name:"Apple",type:"fruit",notes:"Orchard"}
];
const STORAGE_KEY = 'farmcrops-v1';
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : initial;
}
function save(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
let crops = load();
const grid = document.getElementById('grid');
function render(list){
  grid.innerHTML = '';
  if(!list.length) grid.innerHTML = '<p>No crops found.</p>';
  list.forEach(c=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h4>${c.name}</h4>
                      <p class="muted">Type: ${c.type}</p>
                      <p>${c.notes||''}</p>
                      <button data-id="${c.id}" class="remove">Remove</button>`;
    grid.appendChild(card);
  });
}
function applyFilter(type, q=''){
  let list = crops.slice();
  if(type && type !== 'all') list = list.filter(i=>i.type===type);
  if(q) list = list.filter(i=>i.name.toLowerCase().includes(q.toLowerCase()));
  render(list);
}
// init
render(crops);
// filters
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{ document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); applyFilter(btn.dataset.type, document.getElementById('searchInput').value); });
});
// search
document.getElementById('searchInput').addEventListener('input', (e)=>{
  const active = document.querySelector('.filter-btn.active')?.dataset.type || 'all';
  applyFilter(active, e.target.value);
});
// add crop
document.getElementById('addForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('cropName').value.trim();
  const type = document.getElementById('cropType').value;
  const notes = document.getElementById('cropNotes').value;
  const id = Date.now();
  crops.unshift({id,name,type,notes});
  save(crops);
  render(crops);
  e.target.reset();
  location.hash = '#crops';
});
// remove (event delegation)
grid.addEventListener('click', e=>{
  if(e.target.classList.contains('remove')){
    const id = Number(e.target.dataset.id);
    crops = crops.filter(c=>c.id!==id);
    save(crops);
    render(crops);
  }
});
// mobile nav toggle
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
navToggle.addEventListener('click', ()=>nav.classList.toggle('open'));
navClose.addEventListener('click', ()=>nav.classList.remove('open'));

// simple performant parallax using requestAnimationFrame
(function(){
  const layers = document.querySelectorAll('.parallax-layer');
  if(!layers.length) return;

  // disable parallax for touch devices / small screens
  const parallaxEnabled = window.matchMedia('(min-width:801px)').matches && !('ontouchstart' in window);
  if(!parallaxEnabled) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update(){
    const sc = window.scrollY;
    layers.forEach(layer=>{
      const speed = parseFloat(layer.dataset.speed) || 0.2;
      const translate = (sc * speed);
      layer.style.transform = `translateY(${translate}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  });
})();