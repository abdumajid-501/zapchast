const productList = document.getElementById('productList');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modal = document.getElementById('formModal');
const addBtn = document.getElementById('addBtn');
const totalCount = document.getElementById('totalCount');
const themeToggle = document.getElementById('themeToggle');
const categoryTabs = document.getElementById('categoryTabs');
const searchInput = document.getElementById('searchInput');

const nameInput = document.getElementById('nameInput');
const carInput = document.getElementById('carInput');
const priceInput = document.getElementById('priceInput');
const countInput = document.getElementById('countInput');
const category = document.getElementById('category');

let products = JSON.parse(localStorage.getItem('parts_mobile_v2')) || [];
let filter = 'all';
let editId = null;

const LOW_LIMIT = 5;

/* THEME */
if (localStorage.getItem('theme_mobile_v2') === 'dark') {
  document.body.classList.add('dark');
}
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme_mobile_v2',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
};

/* MODAL */
openModalBtn.onclick = () => modal.classList.add('open');
closeModalBtn.onclick = () => {
  modal.classList.remove('open');
  editId = null;
};

/* ADD / EDIT */
addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const car = carInput.value.trim();
  const price = Number(priceInput.value);
  const count = Number(countInput.value);
  const cat = category.value;

  if (!name || !car || price <= 0 || count <= 0) {
    alert("Barcha maydonlarni to‘ldiring");
    return;
  }

  if (editId) {
    const p = products.find(x => x.id === editId);
    p.name = name;
    p.car = car;
    p.price = price;
    p.count = count;
    p.cat = cat;
    editId = null;
  } else {
    products.unshift({
      id: Date.now(),
      name,
      car,
      price,
      count,
      cat
    });
  }

  save();
  modal.classList.remove('open');
  nameInput.value = carInput.value = priceInput.value = countInput.value = '';
};

/* DELETE */
function deleteItem(id) {
  products = products.filter(p => p.id !== id);
  save();
}

/* EDIT */
function editItem(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  editId = id;
  modal.classList.add('open');

  nameInput.value = p.name;
  carInput.value = p.car;
  priceInput.value = p.price;
  countInput.value = p.count;
  category.value = p.cat;
}

/* FILTER */
categoryTabs.onclick = e => {
  if (e.target.classList.contains('tab')) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    filter = e.target.dataset.cat;
    render();
  }
};

searchInput.oninput = render;

function save() {
  localStorage.setItem('parts_mobile_v2', JSON.stringify(products));
  render();
}

function render() {
  productList.innerHTML = '';

  let list = filter === 'all'
    ? products
    : products.filter(p => p.cat === filter);

  const search = searchInput.value.toLowerCase();
  if (search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.car.toLowerCase().includes(search)
    );
  }

  totalCount.textContent = list.length;

  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';

    if (p.count <= LOW_LIMIT) {
      div.classList.add('low-stock');
    }

    div.innerHTML = `
      <div class="card-info">
        <h4>${p.name}</h4>
        <small>🚗 ${p.car}</small>
        <p>${p.price.toLocaleString('uz-UZ')} so'm • ${p.count} ta</p>
        <small>${p.cat}</small>
      </div>
      <div>
        <button class="edit-btn" onclick="editItem(${p.id})">✏️</button>
        <button class="delete-btn" onclick="deleteItem(${p.id})">🗑️</button>
      </div>
    `;
    productList.appendChild(div);
  });
}

render();
