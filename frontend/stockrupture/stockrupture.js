let produtos = [];
let lotes = [];
const quebras = [];

const formatter = new Intl.NumberFormat("pt-BR", { signDisplay: "exceptZero" });

document.addEventListener("DOMContentLoaded", () => {
    getAllProducts().then(data => {
        produtos = data;
        /** @type {HTMLSelectElement} */
        const select = document.getElementById("produto");

        for (const product of data) {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name
            select.options.add(option);
        }
    })

    getAllBatches().then(data => {
        lotes = data;
    })

    // const tbody = document.getElementsByTagName("tbody")[0]
    // for (let i = 0; i < 50; i += 1) {
    //     const tr = document.createElement("tr");
    //     tr.innerHTML = `
    //         <td>Produto ${i + 1}</td>
    //         <td>${Math.round(Math.random() * 100)}</td>
    //         <td>${new Date().toLocaleDateString()}</td>
    //         <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur commodi nulla modi aut, mollitia ipsa similique doloribus recusandae magni doloremque est expedita eum vero incidunt nisi nemo vitae, tempore non?</td>
    //     `;

    //     tbody.appendChild(tr);
    // }
});

document.getElementById("produto").addEventListener("change", (event) => {
  const produtoLotes = lotes.filter(p => p.productId == event.target.value);
    
  /** @type {HTMLSelectElement} */
  const select = document.getElementById("lote");
  select.disabled = (produtoLotes?.length ?? 0) === 0;
  select.required = !select.disabled;

  for(let i = select.options.length - 1; i > 0; i -= 1) 
    select.options.remove(i);

  for (const batch of produtoLotes) {
    const option = document.createElement("option");
    option.value = batch.id;
    option.textContent = `Lote #${batch.id}`;
    select.options.add(option);
  }
})

document.getElementById("formQuebra").addEventListener("submit", async (event) => {
    event.preventDefault();

    const produto = document.getElementById("produto").value;
    const lote = document.getElementById("lote").value;
    const quantidade = document.getElementById("quantidade").value;
    const comentario = document.getElementById("comentario").value;

    if (!produto || !quantidade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    await adicionarQuebra(produto, lote, quantidade, comentario);

    event.target.reset();
});

async function getAllProducts() {
    const response = await fetch(`${BASE_URL}/product/all`);
    const data = await response.json()
    return data || [];
}

async function getAllBatches() {
  const response = await fetch(`${BASE_URL}/batch`);
  const data = await response.json();
  return data || [];
}

async function getRupture(produtoId, loteId, quantidade) {
    const url = new URL("/movements/rupture", BASE_URL);
    url.searchParams.set("productId", produtoId)
    url.searchParams.set("batchId", loteId)
    url.searchParams.set("quantity", quantidade);

    const response = await fetch(url);
    const data = await response.json();
    return data.quantity;
}

const tbody = document.getElementsByTagName("tbody")[0];
async function adicionarQuebra(produtoId, loteId, quantidade, comentario) {
    const produto = produtos.find(p => p.id == produtoId);
    const diferença = await getRupture(produtoId, loteId, quantidade);

    quebras.push({produtoId, loteId, diferença, comentario })

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${produto.name}</td>
        <td>Lote #${loteId}</td>
        <td>${quantidade}</td>
        <td>${formatter.format(diferença)}</td>
        <td>${comentario}</td>
    `;

    tbody.appendChild(tr);
}