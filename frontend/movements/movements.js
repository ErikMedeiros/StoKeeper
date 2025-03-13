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
    const registeredAt = new Date(entry.registeredAt);
    let expiresAt = null;
    let color = null;

    if (!!entry.expiresAt) {
      expiresAt = new Date(entry.expiresAt);
      const days = entry.notifyBeforeExpiresDays;
      const notifyDate = new Date(expiresAt);
      notifyDate.setDate(notifyDate.getDate() - days + 1);

      if (new Date().valueOf() <= notifyDate.valueOf()) {
        color = "lightcoral";
      }
    }

    tr.innerHTML = `
        <td>${entry.productName}</td>
        <td>${entry.categoryName}</td>
        <td>${entry.employeeName}</td>
        <td>${entry.type}</td>
        <td>${Math.abs(entry.quantity)}</td>
        <td>R$ ${entry.unitPrice.toFixed(2)}</td>
        <td>${registeredAt.toLocaleString()}</td>
        <td ${color ? `style="color: ${color}"` : ''}>${expiresAt?.toLocaleString() ?? '-'}</td>
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
