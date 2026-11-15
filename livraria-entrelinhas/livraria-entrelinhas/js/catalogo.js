/* Catálogo: busca, filtro por categoria, ordenação, favoritos e "Carregar mais". */

const LIVROS_POR_PAGINA = 8;

const estadoCatalogo = {
  busca: "",
  categoria: "Todas",
  ordenacao: "padrao",
  soFavoritos: false,
  quantidadeVisivel: LIVROS_POR_PAGINA
};

function filtrarLivros() {
  const termo = normalizarTexto(estadoCatalogo.busca);
  const favoritos = obterFavoritos();

  return LIVROS.filter((livro) => {
    const combinaBusca =
      !termo || normalizarTexto(livro.titulo).includes(termo) || normalizarTexto(livro.autor).includes(termo);
    const combinaCategoria = estadoCatalogo.categoria === "Todas" || livro.categoria === estadoCatalogo.categoria;
    const combinaFavorito = !estadoCatalogo.soFavoritos || favoritos.includes(livro.id);
    return combinaBusca && combinaCategoria && combinaFavorito;
  });
}

function ordenarLivros(livros) {
  const copia = [...livros];
  switch (estadoCatalogo.ordenacao) {
    case "preco-menor":
      return copia.sort((a, b) => a.preco - b.preco);
    case "preco-maior":
      return copia.sort((a, b) => b.preco - a.preco);
    case "titulo":
      return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    case "lancamento":
      return copia.sort((a, b) => b.ano - a.ano);
    default:
      return copia;
  }
}

function renderizarCatalogo() {
  const grade = document.querySelector("[data-catalogo]");
  const vazio = document.querySelector("[data-vazio]");
  const resultado = document.querySelector("[data-resultado]");
  const botaoMais = document.querySelector("[data-carregar-mais]");

  const livros = ordenarLivros(filtrarLivros());
  const visiveis = livros.slice(0, estadoCatalogo.quantidadeVisivel);

  grade.innerHTML = "";
  renderizarCards(grade, visiveis, 2);

  vazio.hidden = livros.length > 0;
  resultado.textContent =
    livros.length === 1 ? "1 livro encontrado" : `${livros.length} livros encontrados`;
  if (livros.length > visiveis.length) {
    resultado.textContent += ` (mostrando ${visiveis.length})`;
  }
  botaoMais.hidden = visiveis.length >= livros.length;
}

function renderizarBotoesCategoria() {
  const grupo = document.querySelector("[data-botoes-categoria]");
  const opcoes = ["Todas", ...CATEGORIAS];
  grupo.innerHTML = opcoes
    .map(
      (categoria) => `
      <button type="button" class="filtro-botao" data-categoria="${escaparHTML(categoria)}"
        aria-pressed="${categoria === estadoCatalogo.categoria}">${escaparHTML(categoria)}</button>`
    )
    .join("");

  grupo.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-categoria]");
    if (!botao) return;
    selecionarCategoria(botao.dataset.categoria);
  });
}

function selecionarCategoria(categoria) {
  estadoCatalogo.categoria = categoria;
  estadoCatalogo.quantidadeVisivel = LIVROS_POR_PAGINA;
  document.querySelectorAll("[data-categoria]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(botao.dataset.categoria === categoria));
  });
  renderizarCatalogo();
}

function lerFiltrosDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get("categoria");
  if (categoria && CATEGORIAS.includes(categoria)) {
    estadoCatalogo.categoria = categoria;
  }
  const busca = parametros.get("busca");
  if (busca) {
    estadoCatalogo.busca = busca;
    document.getElementById("busca").value = busca;
  }
}

function configurarControlesCatalogo() {
  const campoBusca = document.getElementById("busca");
  const seletorOrdem = document.getElementById("ordenacao");
  const botaoFavoritos = document.querySelector("[data-so-favoritos]");
  const botaoMais = document.querySelector("[data-carregar-mais]");
  const formBusca = document.querySelector("[data-form-busca]");

  /* Filtra enquanto o usuário digita. */
  campoBusca.addEventListener("input", () => {
    estadoCatalogo.busca = campoBusca.value;
    estadoCatalogo.quantidadeVisivel = LIVROS_POR_PAGINA;
    renderizarCatalogo();
  });

  formBusca.addEventListener("submit", (evento) => evento.preventDefault());

  seletorOrdem.addEventListener("change", () => {
    estadoCatalogo.ordenacao = seletorOrdem.value;
    renderizarCatalogo();
  });

  botaoFavoritos.addEventListener("click", () => {
    estadoCatalogo.soFavoritos = !estadoCatalogo.soFavoritos;
    botaoFavoritos.setAttribute("aria-pressed", String(estadoCatalogo.soFavoritos));
    estadoCatalogo.quantidadeVisivel = LIVROS_POR_PAGINA;
    renderizarCatalogo();
  });

  botaoMais.addEventListener("click", () => {
    const primeiroNovo = estadoCatalogo.quantidadeVisivel;
    estadoCatalogo.quantidadeVisivel += LIVROS_POR_PAGINA;
    renderizarCatalogo();
    /* Leva o foco ao primeiro livro novo, para quem navega pelo teclado. */
    const novoCard = document.querySelectorAll("[data-catalogo] .card-livro__titulo a")[primeiroNovo];
    if (novoCard) novoCard.focus();
  });

  /* Se o usuário tirar um favorito com o filtro "só favoritos" ligado, a lista se atualiza. */
  document.addEventListener("favoritos:alterados", () => {
    if (estadoCatalogo.soFavoritos) renderizarCatalogo();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  lerFiltrosDaUrl();
  renderizarBotoesCategoria();
  configurarControlesCatalogo();
  renderizarCatalogo();
});
