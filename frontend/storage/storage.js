const tbody = document.querySelector('tbody')
const sProductName = document.getElementById('product-name')
const sDescription = document.getElementById('description')
const sCategoryId = document.getElementById('category-id')
const bSalvarProduto = document.getElementById("salvar-produto")

const sCategoryName = document.getElementById('category-name')
const bSalvarCategoria = document.getElementById("salvar-categoria");

/** @type {NodeListOf<HTMLInputElement} */
const iMovements = document.querySelectorAll("input[name='movement']")
const sQuantity = document.getElementById("quantity");
const sUnitPrice = document.getElementById("unit-price");
const bSalvarMovimentacao = document.getElementById("salvar-movimentacao");

/** @type {HTMLDivElement} */
const notifyContainer = document.querySelector("div:has(> #notify)");
  /** @type {HTMLInputElement} */
const isExpirable = document.getElementById("is-expirable");

isExpirable.addEventListener("change", (event) => {
  /** @type {HTMLInputElement} */
  const checkbox = event.target;
  notifyContainer.style.display = checkbox.checked ? 'block' : 'none';
})

const iNotifyDays = document.getElementById("notify");

/** @type {HTMLDivElement} */
const expiresContainer = document.querySelector("div:has(> #expires-at)");
const iExpiresAt = document.getElementById("expires-at");

/** @type {HTMLElement} */
let modal
let id

/** @type {Array<any>} */
let products
/** @type {Array<any>} */
let categories

function openModal(id, value) {
  modal = document.getElementById(id);
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  switch(id) {
    case "product-modal":
      if (value !== undefined && value !== null) {
        sProductName.value = products[value].name
        sDescription.value = products[value].description
        sCategoryId.value = products[value].categoryId
        iNotifyDays.value = products[value].notifyBeforeExpiresDays;
        modal.dataset.id = products[value].id;
      } else {
        sProductName.value = ''
        sDescription.value = ''
        sCategoryId.value = '';
        iNotifyDays.value = '';
      }
      break;
    case "category-modal":
      sCategoryName.value = ''
      break
    case "movement-modal":
      modal.dataset.index = value.index;
      modal.dataset.type = value.type;
      sQuantity.value = '';
      sUnitPrice.value = ''

      for (const input of iMovements) {
        if (input.value === value.type) {
          input.checked = true;
          input.disabled = false;
        } else {
          input.checked = false;
          input.disabled = true;
        }
      }

      const productDays = products[value.index].notifyBeforeExpiresDays;
      if (productDays !== null && productDays !== undefined && value.type == 'entrada') {
        expiresContainer.style.display = "block";
      } else {
        expiresContainer.style.display = "none";
      }
      break
  }
}

bSalvarProduto.onclick = async (e) => {
  if (sProductName.value == '' || sDescription.value == '' || sCategoryId.value == '') {
    return
  }

  e.preventDefault();

  const data = {
    name: sProductName.value,
    description: sDescription.value,
    categoryId: sCategoryId.value,
    notify: isExpirable.checked ? iNotifyDays.value : null,
  };

  const id = modal.dataset.id;
  if (id !== undefined) {
    await updateProduct(id, data)
  } else {
    await createProduct(data)
  }

  await loadProducts();
  modal.classList.remove('active')
  modal.dataset.id = undefined;
}

bSalvarCategoria.onclick = async (e) => {
  if (!sCategoryName.value) return;

  e.preventDefault();

  await createCategory({ name: sCategoryName.value });
  await loadCategories();
}

bSalvarMovimentacao.onclick = async (e) => {
  if (!sQuantity.value || !sUnitPrice.value) return;

  e.preventDefault();

  const data = {
    quantity: sQuantity.value,
    unitPrice: sUnitPrice.value,
    type: modal.dataset.type,
    employeeId: window.localStorage.getItem("token"),
    productId: products[modal.dataset.index].id,
    expiresAt: formatDate(iExpiresAt.value),
  };

  await createMovement(data);
  await loadProducts();

  modal.dataset.type = undefined;
  modal.dataset.index = undefined;
}

async function loadProducts() {
  products = await getAllProducts()
  tbody.innerHTML = ''
  products.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.id = `product-${item.id}`;

    tr.innerHTML = `
      <td>
        ${item.name}
        <button onclick="openModal('product-modal', ${index})">
          <i class='bx bx-edit' ></i>
        </button>
      </td>
      <td>${item.description}</td>
      <td>${item.categoryName}</td>
      <td>${item.quantity}</td>
      <td>${item.averageUnitPrice?.toFixed(2)}</td>
      <td class="acao">
        <button onclick="openModal('movement-modal', { index: ${index}, type: 'entrada' })">
          <i class='bx bxs-plus-square' style="color: green;"></i>
        </button>
      </td>
      <td class="acao">
        <button onclick="openModal('movement-modal', { index: ${index}, type: 'saida' })">
          <i class='bx bxs-minus-square' style="color: red;"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  })
}

async function loadCategories() {
  categories = await getAllCategories();
  
  while(sCategoryId.lastElementChild)
    sCategoryId.removeChild(sCategoryId.lastElementChild);

  categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category.id;
    option.textContent = category.name;
    sCategoryId.appendChild(option);
  });
}

async function getAllProducts () {
  const result = await fetch(`${BASE_URL}/product`);
  const data = await result.json();
  return data || [];
}

async function createProduct(item) {
  await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function updateProduct(id, item) {
  await fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function getAllCategories() {
  const result = await fetch(`${BASE_URL}/category`);
  const data = await result.json();
  return data || [];
}

async function createCategory(item) {
  await fetch(`${BASE_URL}/category`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(item),
  });
}

async function createMovement(item) {
  await fetch(`${BASE_URL}/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(item),
  });
}


loadProducts()
loadCategories()
