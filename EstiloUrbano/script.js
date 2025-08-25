const EUR = new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});

// --- productos ---
const products = [
  {
    id: 'p1',
    name: 'Monedero Gucci',
    price: 200,
    images: ['Monedero.jpg','Monedero1.jpg','Monedero2.jpg'], // galería
    description: 'Monedero de cuero premium, elegante y resistente.',
    pay: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8G2U6UE26S6Z4'
  }
];
// ----------------------------------

let cart = JSON.parse(localStorage.getItem('cart')||'[]');

const count = document.getElementById('count');
const dialog = document.getElementById('carrito');
const itemsEl = document.getElementById('items');
const totalEl = document.getElementById('total');

// Guardar carrito y actualizar contador
function save(){ 
  localStorage.setItem('cart', JSON.stringify(cart)); 
  updateUI(); 
}
function updateUI(){
  count.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// Añadir producto al carrito
function addToCart(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id, qty:1});
  save();
}

// Mostrar productos en la página principal
function showProducts(){
  let container = document.getElementById('products');
  container.innerHTML = products.map(p=>`
      <div class="item">
          <a href="producto.html?id=${p.id}" target="_blank">
              <img src="${p.images[0]}" alt="${p.name}">
          </a>
          <h3>${p.name}</h3>
          <p>${EUR.format(p.price)}</p>
          <button class="add-btn" data-id="${p.id}">Añadir al carrito</button>
          <a href="${p.pay}" target="_blank">
              <img src="comprar.png" alt="Comprar Ahora">
          </a>
      </div>
  `).join('');

  // Event listener para los botones "Añadir al carrito"
  const addButtons = container.querySelectorAll('.add-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.getAttribute('data-id'));
      alert('Producto añadido al carrito');
    });
  });
}

// Renderizar carrito
function renderCart(){
  itemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(it=>{
    const p = products.find(x=>x.id===it.id);
    if(!p) return;
    const subtotal = p.price * it.qty;
    total += subtotal;
    const div = document.createElement('div');
    div.innerHTML = `<strong>${p.name}</strong> ${it.qty}x — ${EUR.format(subtotal)}
      <button data-rem="${p.id}">Eliminar</button>`;
    itemsEl.appendChild(div);
  });
  totalEl.textContent = EUR.format(total);

  itemsEl.addEventListener('click', e=>{
    const b = e.target.closest('[data-rem]');
    if(!b) return;
    cart = cart.filter(i=>i.id!==b.getAttribute('data-rem'));
    save(); renderCart();
  }, {once:true});
}

// Eventos carrito
document.getElementById('verCarrito').addEventListener('click', ()=>{ renderCart(); dialog.showModal(); });
document.getElementById('vaciar').addEventListener('click', ()=>{ cart=[]; save(); renderCart(); });
document.getElementById('cerrar').addEventListener('click', ()=>dialog.close());
document.getElementById('checkout').addEventListener('click', ()=>{
  if(!cart.length){ alert('Carrito vacío'); return; }
  const w = window.open('about:blank','_blank');
  let html = '<h1>Finaliza tu compra</h1><ol>';
  cart.forEach(i=>{
    const p = products.find(x=>x.id===i.id);
    const link = p.pay;
    html += `<li>${p.name} × ${i.qty} — ${EUR.format(p.price)} · <a href="${link}" target="_blank" rel="noopener">Pagar este producto</a></li>`;
  });
  html += '</ol><p>Completa cada pago en la pasarela. Cuando termines, vuelve a esta página.</p>';
  w.document.write(html);
});

// Función para añadir producto al carrito desde la página de detalle
function addProductDetail(id){
  const btn = document.getElementById('add-to-cart-detail');
  if(btn){
    btn.addEventListener('click', ()=>{
      addToCart(id);
      alert('Producto añadido al carrito');
    });
  }
}

window.onload = showProducts;
updateUI();
