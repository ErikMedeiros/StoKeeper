const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

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
    sNome.value = itens[index].name
    sFuncao.value = itens[index].position
    sSalario.value = itens[index].salary
    id = itens[index].id;
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
  
}

function insertItem(item, index) {
  let tr = document.createElement('tr')
  tr.id = `employee-${item.id}` 

  tr.innerHTML = `
    <td>${item.name}</td>
    <td>${item.position}</td>
    <td>R$ ${item.salary}</td>
    <td class="acao">
      <button onclick="openModal(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="openModal(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = async (e) => {
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return
  }

  e.preventDefault();

  const data = { name: sNome.value, position: sFuncao.value, salary: sSalario.value };
  if (id !== undefined) {
    await updateEmployee(id, data)
  } else {
    await createEmployee(data)
  }

  await loadItens();
  modal.classList.remove('active')
  id = undefined
}

async function loadItens() {
  itens = await getAllEmployees()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

async function getAllEmployees () {
  const result = await fetch(`${URL}/employees`);
  const data = await result.json();
  return data || [];
}

async function createEmployee(item) {
  await fetch(`${URL}/employee`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

async function updateEmployee(id, item) {
  await fetch(`${URL}/employee/${id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(item)
  });
}

loadItens()


