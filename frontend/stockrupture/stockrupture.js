document.addEventListener("DOMContentLoaded", () => {
    // Obtém a data e hora atual
    const now = new Date();

    // Formata a data no formato necessário para o input "datetime-local"
    const formattedDate = now.toISOString().slice(0, 16); // Exemplo: "2025-03-24T15:30"

    // Preenche automaticamente o campo de data com a data e hora atuais
    document.getElementById("data").value = formattedDate;
});

document.getElementById("formQuebra").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Captura os valores dos campos
    const usuario = document.getElementById("usuario").value;
    const produto = document.getElementById("produto").value;
    const quantidade = document.getElementById("quantidade").value;
    const motivo = document.getElementById("motivo").value;
    const data = document.getElementById("data").value;

    // Validação dos campos
    if (!usuario || !produto || !quantidade || !motivo || !data) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Envio da requisição para a API
    try {
        const response = await fetch("http://localhost:8080/stockrupture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, produto, quantidade, motivo, data })
        });

        // Verificação do status da resposta
        if (!response.ok) {
            throw new Error('Erro ao registrar a quebra de estoque');
        }

        const dataResponse = await response.json();
        alert(dataResponse.message);
    } catch (error) {
        console.error(error);
        alert("Houve um erro ao tentar registrar a quebra de estoque.");
    }
});
