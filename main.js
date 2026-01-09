/* ================= ELEMENTLAR ================= */
const nameInput = document.getElementById('name');
const categorySelect = document.getElementById('category');
const carSelect = document.getElementById('car');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const addBtn = document.getElementById('addBtn');
const productsDiv = document.getElementById('products');
const themeBtn = document.getElementById('themeBtn');

/* ================= DATA ================= */
let products = JSON.parse(localStorage.getItem('products')) || [];
let theme = localStorage.getItem('theme') || 'light';

/* ================= THEME ================= */
if(theme === 'dark') document.body.classList.add('dark');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

/* ================= STORAGE ================= */
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

/* ================= ADD PRODUCT ================= */
addBtn.addEventListener('click', () => {
  const product = {
    id: Date.now(),
    name: nameInput.value.trim(),
    category: categorySelect.value,
    car: carSelect.value,
    price: Number(priceInput.value),
    count: Number(stockInput.value)
  };

  if(!product.name || product.price <= 0 || product.count <= 0) {
    alert("Maʼlumotlarni to‘liq kiriting");
    return;
  }

  products.push(product);
  saveProducts();
  renderProducts();

  // Inputlarni tozalash
  nameInput.value = '';
  priceInput.value = '';
  stockInput.value = '';
});

/* ================= COUNT CONTROL ================= */
function increase(id) {
  const p = products.find(p => p.id === id);
  if(!p) return;
  p.count++;
  saveProducts();
  renderProducts();
}

function decrease(id) {
  const p = products.find(p => p.id === id);
  if(!p) return;
  if(p.count > 0) p.count--;
  saveProducts();
  renderProducts();
}

/* ================= RENDER ================= */
function renderProducts() {
  productsDiv.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>Mashina:</b> ${p.car}</p>
      <p><b>Kategoriya:</b> ${p.category}</p>
      <p><b>Narxi:</b> ${p.price.toLocaleString()} so‘m</p>
      <div class="counter">
        <button class="decrease">➖</button>
        <span>${p.count}</span>
        <button class="increase">➕</button>
      </div>
    `;

    const increaseBtn = card.querySelector('.increase');
    const decreaseBtn = card.querySelector('.decrease');

    increaseBtn.addEventListener('click', () => increase(p.id));
    decreaseBtn.addEventListener('click', () => decrease(p.id));

    productsDiv.appendChild(card);
  });
}

/* ================= INIT ================= */
renderProducts();
