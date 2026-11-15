/* Página de detalhes: lê o id da URL (livro.html?id=3) e monta a página. */

function obterIdDaUrl() {
  return Number(new URLSearchParams(window.location.search).get("id"));
}

function obterAvaliacao(idLivro) {
  const avaliacoes = lerStorage(CHAVES.avaliacoes, {});
  return Number(avaliacoes[idLivro]) || 0;
}

function salvarAvaliacao(idLivro, nota) {
  const avaliacoes = lerStorage(CHAVES.avaliacoes, {});
  avaliacoes[idLivro] = nota;
  salvarStorage(CHAVES.avaliacoes, avaliacoes);
}

function montarEstrelas(nota) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<button type="button" class="estrela${i <= nota ? " estrela--ativa" : ""}" data-nota="${i}"
      aria-pressed="${i === nota}" aria-label="Dar ${i} ${i === 1 ? "estrela" : "estrelas"}">★</button>`;
  }
  return html;
}

function textoAvaliacao(nota) {
  return nota ? `Sua avaliação: ${nota} de 5` : "Você ainda não avaliou este livro";
}

function renderizarDetalhes(livro) {
  const container = document.querySelector("[data-detalhes]");
  const nota = obterAvaliacao(livro.id);
  const favorito = ehFavorito(livro.id);
  document.title = `${livro.titulo} | Livraria Entrelinhas`;

  container.innerHTML = `
    <nav class="trilha" aria-label="Você está em">
      <a href="catalogo.html" class="voltar">← Voltar ao catálogo</a>
    </nav>
    <article class="detalhes">
      <div class="detalhes__capa">
        <img src="${gerarCapa(livro)}" alt="${escaparHTML(textoAltCapa(livro))}" width="300" height="450">
      </div>
      <div class="detalhes__info">
        <p class="etiqueta">${escaparHTML(livro.categoria)}</p>
        <h1 class="detalhes__titulo">${escaparHTML(livro.titulo)}</h1>
        <p class="detalhes__autor">por ${escaparHTML(livro.autor)}</p>

        <div class="avaliacao">
          <div class="estrelas" role="group" aria-label="Avalie este livro" data-estrelas>${montarEstrelas(nota)}</div>
          <p class="avaliacao__texto" data-texto-avaliacao aria-live="polite">${textoAvaliacao(nota)}</p>
        </div>

        <p class="detalhes__preco">${formatarPreco(livro.preco)}</p>
        <div class="detalhes__acoes">
          <button class="botao botao--primario" type="button" data-acao="adicionar" data-id="${livro.id}">Adicionar ao carrinho</button>
          <button class="botao-favorito botao-favorito--grande" type="button" data-acao="favoritar" data-id="${livro.id}"
            aria-pressed="${favorito}"
            aria-label="${favorito ? "Remover" : "Adicionar"} “${escaparHTML(livro.titulo)}” ${favorito ? "da" : "à"} lista de desejos">
            ${ICONE_CORACAO}
          </button>
        </div>

        <section class="detalhes__secao" aria-labelledby="titulo-sinopse">
          <h2 id="titulo-sinopse">Sinopse</h2>
          <p>${escaparHTML(livro.sinopse)}</p>
        </section>

        <section class="detalhes__secao" aria-labelledby="titulo-ficha">
          <h2 id="titulo-ficha">Ficha técnica</h2>
          <dl class="ficha">
            <div><dt>Autor</dt><dd>${escaparHTML(livro.autor)}</dd></div>
            <div><dt>Editora</dt><dd>${escaparHTML(livro.editora)}</dd></div>
            <div><dt>Ano</dt><dd>${livro.ano}</dd></div>
            <div><dt>Páginas</dt><dd>${livro.paginas}</dd></div>
            <div><dt>Categoria</dt><dd><a href="catalogo.html?categoria=${encodeURIComponent(livro.categoria)}">${escaparHTML(livro.categoria)}</a></dd></div>
          </dl>
        </section>
      </div>
    </article>`;

  configurarEstrelas(livro.id);
}

function configurarEstrelas(idLivro) {
  const grupo = document.querySelector("[data-estrelas]");
  const texto = document.querySelector("[data-texto-avaliacao]");
  grupo.addEventListener("click", (evento) => {
    const estrela = evento.target.closest("[data-nota]");
    if (!estrela) return;
    const nota = Number(estrela.dataset.nota);
    salvarAvaliacao(idLivro, nota);
    grupo.querySelectorAll("[data-nota]").forEach((botao) => {
      const valor = Number(botao.dataset.nota);
      botao.classList.toggle("estrela--ativa", valor <= nota);
      botao.setAttribute("aria-pressed", String(valor === nota));
    });
    texto.textContent = textoAvaliacao(nota);
  });
}

function renderizarRelacionados(livro) {
  const secao = document.querySelector("[data-secao-relacionados]");
  const grade = document.querySelector("[data-relacionados]");
  const relacionados = LIVROS.filter((l) => l.categoria === livro.categoria && l.id !== livro.id).slice(0, 4);
  if (relacionados.length === 0) return;
  renderizarCards(grade, relacionados, 3);
  secao.hidden = false;
}

function renderizarLivroNaoEncontrado() {
  document.querySelector("[data-detalhes]").innerHTML = `
    <div class="mensagem-vazia">
      <h1>Livro não encontrado</h1>
      <p>O livro que você procura não está no nosso catálogo.</p>
      <a class="botao botao--primario" href="catalogo.html">Voltar ao catálogo</a>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const livro = buscarLivroPorId(obterIdDaUrl());
  if (!livro) {
    renderizarLivroNaoEncontrado();
    return;
  }
  renderizarDetalhes(livro);
  renderizarRelacionados(livro);
});
