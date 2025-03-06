const tbody = document.getElementsByTagName("tbody")[0];

const iProductName = document.getElementById("product-name");
const sMovementType = document.getElementById("movement-type");
const sCategoryId = document.getElementById("category-id");
const iStartDate = document.getElementById("start-date");
const iEndDate = document.getElementById("end-date");

let timeout = -1;
for (const element of [iProductName, sMovementType, sCategoryId, iStartDate, iEndDate]) {
  element.addEventListener('change', () => {
    if (timeout !== -1) clearTimeout(timeout);
    timeout = setTimeout(loadMovements, 750);
  });
}

/** @param {string} date  */
function formatDate(text) {
  const date = new Date(text);
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timezone = (date.getTimezoneOffset() / 60).toString().padStart(2, '0').padEnd(4, '0');
  return `${year}-${month}-${day}T${hour}:${minutes}:00-${timezone}`;
}

async function loadMovements() {
  const request = new URL("movements", BASE_URL);
  if (iProductName.value) request.searchParams.set("name", iProductName.value);
  if (sMovementType.value) request.searchParams.set("type", sMovementType.value);
  if (sCategoryId.value) request.searchParams.set("categoryId", sCategoryId.value);
  if (iStartDate.value) request.searchParams.set("startDate", formatDate(iStartDate.value));
  if (iEndDate.value) request.searchParams.set("endDate", formatDate(iEndDate.value));

  const response = await fetch(request);
  const data = await response.json();

  while (tbody.lastElementChild)
    tbody.removeChild(tbody.lastElementChild);

  for (const entry of data) {
    const tr = document.createElement("tr");
    tr.id = "movement-" + entry.id;

    tr.innerHTML = `
        <td>${entry.productName}</td>
        <td>${entry.categoryName}</td>
        <td>${entry.employeeName}</td>
        <td>${entry.type}</td>
        <td>${Math.abs(entry.quantity)}</td>
        <td>R$ ${entry.unitPrice.toFixed(2)}</td>
        <td>${new Date(entry.registeredAt).toLocaleString()}</td>
      `;

    tbody.appendChild(tr);
  }
}

async function loadCategories() {
  const result = await fetch(`${BASE_URL}/category`);
  const data = await result.json();

  for (const category of data) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    sCategoryId.appendChild(option);
  }
}

loadMovements();
loadCategories();
