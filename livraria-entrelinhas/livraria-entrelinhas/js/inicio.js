/* Página inicial: banner do livro do mês, vitrine de destaques e categorias. */

function renderizarLivroDoMes() {
  const container = document.querySelector("[data-livro-mes]");
  const livro = LIVROS.find((l) => l.livroDoMes) || LIVROS[0];
  container.innerHTML = `
    <a href="livro.html?id=${livro.id}" class="banner__capa">
      <img src="${gerarCapa(livro)}" alt="${escaparHTML(textoAltCapa(livro))}" width="300" height="450">
    </a>
    <div class="banner__livro-info">
      <p class="banner__selo">Livro do mês</p>
      <h2 class="banner__livro-titulo">${escaparHTML(livro.titulo)}</h2>
      <p class="banner__livro-autor">${escaparHTML(livro.autor)}</p>
      <p class="banner__livro-preco">${formatarPreco(livro.preco)}</p>
      <div class="banner__acoes">
        <a class="botao botao--primario" href="livro.html?id=${livro.id}">Conhecer o livro</a>
        <button class="botao botao--secundario" type="button" data-acao="adicionar" data-id="${livro.id}">Adicionar ao carrinho</button>
      </div>
    </div>`;
}

function renderizarVitrine() {
  const vitrine = document.querySelector("[data-vitrine]");
  const destaques = LIVROS.filter((livro) => livro.destaque);
  renderizarCards(vitrine, destaques, 3);
}

function renderizarCategoriasInicio() {
  const lista = document.querySelector("[data-categorias-inicio]");
  lista.innerHTML = CATEGORIAS.map((categoria) => {
    const quantidade = LIVROS.filter((livro) => livro.categoria === categoria).length;
    return `
      <li>
        <a class="categoria-atalho" href="catalogo.html?categoria=${encodeURIComponent(categoria)}">
          <span class="categoria-atalho__nome">${escaparHTML(categoria)}</span>
          <span class="categoria-atalho__qtd">${quantidade} títulos</span>
        </a>
      </li>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarLivroDoMes();
  renderizarVitrine();
  renderizarCategoriasInicio();
});
