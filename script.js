// ---------- Dados ----------
const produtos = [
    { id: 1, nome: "Mouse",          preco: 49.90,  categoria: "Perifericos", validade: "" },
    { id: 2, nome: "Gabinete",       preco: 129.90, categoria: "Eletronicos", validade: "" },
    { id: 3, nome: "Monitor",        preco: 299.90, categoria: "Eletronicos", validade: "" },
    { id: 4, nome: "Mouse Pad",      preco: 19.90,  categoria: "Perifericos", validade: "" },
    { id: 5, nome: "Fone de Ouvido", preco: 59.90,  categoria: "Perifericos", validade: "" }
];

const nomesCategoria = {
    Eletronicos: "Eletrônicos",
    Perifericos: "Periféricos"
};

// ---------- Elementos ----------
const formulario      = document.getElementById("cadastroP");
const campoNome       = document.getElementById("produto");
const campoPreco      = document.getElementById("preco");
const campoValidade   = document.getElementById("validade");
const campoCategoria  = document.getElementById("categoria");
const titulo          = document.getElementById("titulo");
const botao           = document.getElementById("btn");

const formBusca       = document.getElementById("formBusca");
const campoBusca      = document.getElementById("busca");
const filtroCategoria = document.getElementById("filtroCategoria");
const corpoTabela     = document.getElementById("corpoTabela");

// ---------- Funções auxiliares ----------
// Evita que texto digitado pelo usuário seja interpretado como HTML
function escapeHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// "2026-11-30" -> "30/11/2026" (sem usar Date, para evitar erro de fuso horário)
function formatarData(data) {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// ---------- Renderização ----------
function renderizarProdutos(lista) {
    if (lista.length === 0) {
        corpoTabela.innerHTML =
            '<tr><td colspan="4" class="vazio">Nenhum produto encontrado.</td></tr>';
        return;
    }

    corpoTabela.innerHTML = lista.map((produto) => {
        const { nome, preco, categoria, validade } = produto;

        const precoFormatado = Number(preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return `
            <tr>
                <td>${escapeHTML(nome)}</td>
                <td>${nomesCategoria[categoria] || escapeHTML(categoria)}</td>
                <td class="preco">${precoFormatado}</td>
                <td>${formatarData(validade)}</td>
            </tr>
        `;
    }).join("");
}

// ---------- Busca + filtro ----------
function aplicarBusca() {
    const termoBusca = campoBusca.value.toLowerCase().trim();
    const categoriaEscolhida = filtroCategoria.value;

    const resultado = produtos.filter((produto) => {
        const atendeBusca = produto.nome.toLowerCase().includes(termoBusca);
        const atendeCategoria =
            categoriaEscolhida === "Todos" || produto.categoria === categoriaEscolhida;

        return atendeBusca && atendeCategoria;
    });
 
    renderizarProdutos(resultado); 
}

// ---------- Eventos ----------
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const novoProduto = {
        id: Date.now(),
        nome: campoNome.value.trim(),
        preco: Number(campoPreco.value),
        validade: campoValidade.value,
        categoria: campoCategoria.value
    };

    produtos.push(novoProduto);

    titulo.textContent = `Produto ${novoProduto.nome} salvo!`;
    botao.style.backgroundColor = "#27ae60";
    botao.textContent = "Salvo com sucesso!";

    formulario.reset();
    aplicarBusca(); // atualiza a tabela na tela
});

formBusca.addEventListener("submit", function (event) {
    event.preventDefault();
    aplicarBusca();
});

campoBusca.addEventListener("input", aplicarBusca);
filtroCategoria.addEventListener("change", aplicarBusca);

// ---------- Início ----------
aplicarBusca(); // mostra a tabela ao carregar a página