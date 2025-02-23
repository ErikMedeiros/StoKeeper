const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const btnSalvar = document.querySelector('#btnSalvar')

const sProductName = document.querySelector('#m-product-name')
const sQuantity = document.querySelector('#m-quantity')
const sUnitPrice = document.querySelector('#m-unit-price')

const URL = "http://localhost:5000";

let itens
let id

function openModal(index = null) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (index !== null) {
    sProductName.value = itens[index].productName
    sQuantity.value = itens[index].quantity
    sUnitPrice.value = itens[index].unitPrice
    id = itens[index].id;
  } else {
    sProductName.value = ''
    sQuantity.value = ''
    sUnitPrice.value = ''
  }
}

function insertItem(item, index) {
  let tr = document.createElement('tr')
  tr.id = `storage-${item.id}` 

  tr.innerHTML = `
    <td>${item.productName}  <button onclick="openModal(${index})"><i class='bx bx-edit' ></i></button></td>
    <td>${item.quantity}</td>
    <td>R$ ${item.unitPrice}</td>
    <td>R$ ${(item.quantity * item.unitPrice).toFixed(2)}</td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = async (e) => {
  if (sProductName.value == '' || sQuantity.value == '' || sUnitPrice.value == '') {
    return
  }

  e.preventDefault();

  const data = {
    productName: sProductName.value,
    quantity: sQuantity.value,
    unitPrice: sUnitPrice.value 
  };

  if (id !== undefined) {
    await updateStorage(id, data)
  } else {
    await createStorage(data)
  }

  await loadItens();
  modal.classList.remove('active')
  id = undefined
}

async function loadItens() {
  itens = await getAllStorages()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

async function getAllStorages () {
  const result = await fetch(`${URL}/storages`);
  const data = await result.json();
  return data || [];
}

async function createStorage(item) {
  await fetch(`${URL}/storage`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function updateStorage(id, item) {
  await fetch(`${URL}/storage/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

loadItens()


