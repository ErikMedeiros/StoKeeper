export const BASE_URL = new URL("/", import.meta.env.VITE_BACKEND_URL);

export async function isAdmin(token: string) {
  const url = new URL("/employee/admin/" + token, BASE_URL);
  const response = await fetch(url);
  const { isAdmin } = await response.json();
  return isAdmin;
}

export async function login(username: string, password: string) {
  const url = new URL("/employee/login", BASE_URL);
  url.searchParams.set("username", username);
  url.searchParams.set("password", password);

  const response = await fetch(url);
  return response.json();
}

export async function getProducts() {
  const url = new URL("/product", BASE_URL);
  const response = await fetch(url);
  return response.json();
}

export async function createProduct(item: unknown) {
  const url = new URL("/product", BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function updateProduct(item: unknown) {
  const url = new URL("/product", BASE_URL);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function getCategories() {
  const url = new URL("/category", BASE_URL);
  const response = await fetch(url);
  return response.json();
}

export async function createCategory(item: unknown) {
  const url = new URL("/category", BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function getMovements(
  name: string,
  type: string,
  categoryId: string,
  startDate: string,
  endDate: string
) {
  const url = new URL("/movements", BASE_URL);
  if (name) url.searchParams.set("name", name);
  if (type) url.searchParams.set("type", type);
  if (categoryId) url.searchParams.set("categoryId", categoryId);
  if (startDate) url.searchParams.set("startDate", startDate);
  if (endDate) url.searchParams.set("endDate", endDate);

  const response = await fetch(url);
  return response.json();
}

export async function createMovement(item: unknown) {
  const url = new URL("/movements", BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function getEmployees() {
  const url = new URL("/employee", BASE_URL);
  const response = await fetch(url);
  return response.json();
}

export async function createEmployee(item: unknown) {
  const url = new URL("/employee", BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function updateEmployee(id: string, item: unknown) {
  const url = new URL("/employee/" + id, BASE_URL);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
}

export async function postStockRupture(employeeId: number, data: any[]) {
  const url = new URL("/stockrupture?employeeId=" + employeeId, BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
