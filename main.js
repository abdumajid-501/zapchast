// ================= ELEMENTLAR =================
const productList = document.getElementById('productList');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modal = document.getElementById('formModal');
const addBtn = document.getElementById('addBtn');
const totalCount = document.getElementById('totalCount');
const themeToggle = document.getElementById('themeToggle');
const categoryTabs = document.getElementById('categoryTabs');

// ================= DATA =================
let products = JSON.parse(localStorage.getItem('parts_mobile_v1')) || [];
let filter = 'all';

// ================= THEME INIT =================
const savedTheme = localStorage.getItem('theme_mobile_v1');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// ================= THEME TOGGLE =================
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');

  localStorage.setItem(
    'theme_mobile_v1',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
};

// ================= MODAL =================
openModalBtn.onclick = () => modal.classList.add('open');
closeModalBtn.onclick = () => modal.classList.remove('open');

// ================= ADD PRODUCT =================
addBtn.onclick = () => {
  const name = document.getElementById('name').value.trim();
  const cat = document.getElementById('category').value;
  const price = Number(document.getElementById('price').value);
  const count = Number(document.getElementById('count').value);

  if (!name || price <= 0 || count <= 0) {
    alert("Barcha maydonlarni to'g'ri to'ldiring!");
    return;
  }

  products.unshift({
    id: Date.now(),
    name,
    cat,
    price,
    count
  });

  saveAndRender();

  // form reset + close modal
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('count').value = '';
  modal.classList.remove('open');
};

// ================= DELETE =================
function deleteItem(id) {
  products = products.filter(p => p.id !== id);
  saveAndRender();
}

// ================= FILTER =================
categoryTabs.onclick = (e) => {
  if (e.target.classList.contains('tab')) {
    document.querySelectorAll('.tab').forEach(t =>
      t.classList.remove('active')
    );
    e.target.classList.add('active');
    filter = e.target.dataset.cat;
    render();
  }
};

// ================= SAVE + RENDER =================
function saveAndRender() {
  localStorage.setItem('parts_mobile_v1', JSON.stringify(products));
  render();
}

// ================= RENDER =================
function render() {
  productList.innerHTML = '';

  const filteredItems =
    filter === 'all'
      ? products
      : products.filter(p => p.cat === filter);

  totalCount.textContent = filteredItems.length;

  filteredItems.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="card-info">
        <h4 title="${p.name}">${p.name}</h4>
        <p>${p.price.toLocaleString('uz-UZ')} so'm • ${p.count} ta</p>
        <small>${p.cat}</small>
      </div>
      <button class="delete-btn" onclick="deleteItem(${p.id})">🗑️</button>
    `;
    productList.appendChild(div);
  });
}

// ================= INIT =================
render();
