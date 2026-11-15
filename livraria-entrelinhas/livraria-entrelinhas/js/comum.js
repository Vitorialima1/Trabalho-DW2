/* =========================================================
   Funções compartilhadas por todas as páginas:
   armazenamento, carrinho, favoritos, tema, menu, cards e avisos.
   ========================================================= */

const CHAVES = {
  carrinho: "entrelinhas:carrinho",
  favoritos: "entrelinhas:favoritos",
  tema: "entrelinhas:tema",
  avaliacoes: "entrelinhas:avaliacoes",
  cupom: "entrelinhas:cupom"
};

/* ---------- localStorage com proteção contra erros ---------- */

function lerStorage(chave, valorPadrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto === null ? valorPadrao : JSON.parse(bruto);
  } catch (erro) {
    return valorPadrao;
  }
}

function salvarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    /* Navegação privada ou armazenamento cheio: o site continua funcionando sem salvar. */
  }
}

/* ---------- Utilidades ---------- */

const formatadorPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatarPreco(valor) {
  return formatadorPreco.format(valor);
}

function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buscarLivroPorId(id) {
  return LIVROS.find((livro) => livro.id === Number(id));
}

/* Remove acentos e deixa minúsculo, para a busca achar "codigo" em "Código". */
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/* ---------- Capas geradas em SVG ---------- */

function quebrarEmLinhas(texto, limite) {
  const palavras = texto.split(" ");
  const linhas = [];
  let atual = "";
  palavras.forEach((palavra) => {
    if ((atual + " " + palavra).trim().length > limite && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = (atual + " " + palavra).trim();
    }
  });
  if (atual) linhas.push(atual);
  return linhas;
}

function gerarCapa(livro) {
  const linhasTitulo = quebrarEmLinhas(livro.titulo, 13).slice(0, 4);
  const inicioY = 150 - (linhasTitulo.length - 1) * 21;
  const textoTitulo = linhasTitulo
    .map((linha, i) => `<text x="150" y="${inicioY + i * 42}" font-size="32" font-weight="700">${escaparHTML(linha)}</text>`)
    .join("");
  const linhasAutor = quebrarEmLinhas(livro.autor, 22).slice(0, 2);
  const textoAutor = linhasAutor
    .map((linha, i) => `<text x="150" y="${370 + i * 26}" font-size="20" opacity=".9">${escaparHTML(linha)}</text>`)
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="${livro.cor}"/>
    <rect width="300" height="450" fill="url(#g)"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".25"/>
    </linearGradient></defs>
    <rect x="18" y="18" width="264" height="414" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
    <rect x="0" y="0" width="14" height="450" fill="#000" fill-opacity=".22"/>
    <g fill="#fff" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
      ${textoTitulo}
      <line x1="110" y1="${inicioY + linhasTitulo.length * 42 - 10}" x2="190" y2="${inicioY + linhasTitulo.length * 42 - 10}" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
      ${textoAutor}
    </g>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function textoAltCapa(livro) {
  return `Capa do livro ${livro.titulo}, de ${livro.autor}`;
}

/* ---------- Carrinho ---------- */

function obterCarrinho() {
  const itens = lerStorage(CHAVES.carrinho, []);
  /* Descarta itens inválidos (ex.: livro removido do catálogo). */
  return Array.isArray(itens) ? itens.filter((item) => buscarLivroPorId(item.id) && item.quantidade > 0) : [];
}

function salvarCarrinho(itens) {
  salvarStorage(CHAVES.carrinho, itens);
  atualizarContadorCarrinho();
}

function adicionarAoCarrinho(idLivro, quantidade = 1) {
  const itens = obterCarrinho();
  const existente = itens.find((item) => item.id === idLivro);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    itens.push({ id: idLivro, quantidade: quantidade });
  }
  salvarCarrinho(itens);
  const livro = buscarLivroPorId(idLivro);
  mostrarAviso(`“${livro.titulo}” foi adicionado ao carrinho.`);
}

function contarItensCarrinho() {
  return obterCarrinho().reduce((total, item) => total + item.quantidade, 0);
}

function atualizarContadorCarrinho() {
  const total = contarItensCarrinho();
  document.querySelectorAll("[data-contador-carrinho]").forEach((contador) => {
    contador.textContent = total;
    contador.hidden = total === 0;
  });
  document.querySelectorAll("[data-link-carrinho]").forEach((link) => {
    link.setAttribute("aria-label", `Carrinho, ${total} ${total === 1 ? "item" : "itens"}`);
  });
}

/* ---------- Favoritos (lista de desejos) ---------- */

function obterFavoritos() {
  const favoritos = lerStorage(CHAVES.favoritos, []);
  return Array.isArray(favoritos) ? favoritos : [];
}

function ehFavorito(idLivro) {
  return obterFavoritos().includes(idLivro);
}

function alternarFavorito(idLivro) {
  let favoritos = obterFavoritos();
  const livro = buscarLivroPorId(idLivro);
  if (favoritos.includes(idLivro)) {
    favoritos = favoritos.filter((id) => id !== idLivro);
    mostrarAviso(`“${livro.titulo}” saiu da sua lista de desejos.`);
  } else {
    favoritos.push(idLivro);
    mostrarAviso(`“${livro.titulo}” entrou na sua lista de desejos.`);
  }
  salvarStorage(CHAVES.favoritos, favoritos);
  atualizarBotoesFavorito(idLivro);
  document.dispatchEvent(new CustomEvent("favoritos:alterados"));
}

function atualizarBotoesFavorito(idLivro) {
  const ativo = ehFavorito(idLivro);
  const livro = buscarLivroPorId(idLivro);
  document.querySelectorAll(`[data-acao="favoritar"][data-id="${idLivro}"]`).forEach((botao) => {
    botao.setAttribute("aria-pressed", String(ativo));
    botao.setAttribute("aria-label", `${ativo ? "Remover" : "Adicionar"} “${livro.titulo}” ${ativo ? "da" : "à"} lista de desejos`);
  });
}

const ICONE_CORACAO =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>';

/* ---------- Card de livro ---------- */

function criarCardLivro(livro, nivelTitulo = 3) {
  const favorito = ehFavorito(livro.id);
  const h = `h${nivelTitulo}`;
  const card = document.createElement("article");
  card.className = "card-livro";
  card.innerHTML = `
    <a class="card-livro__capa" href="livro.html?id=${livro.id}" tabindex="-1" aria-hidden="true">
      <img src="${gerarCapa(livro)}" alt="${escaparHTML(textoAltCapa(livro))}" loading="lazy" width="300" height="450">
    </a>
    <button class="botao-favorito" type="button" data-acao="favoritar" data-id="${livro.id}"
      aria-pressed="${favorito}"
      aria-label="${favorito ? "Remover" : "Adicionar"} “${escaparHTML(livro.titulo)}” ${favorito ? "da" : "à"} lista de desejos">
      ${ICONE_CORACAO}
    </button>
    <div class="card-livro__corpo">
      <p class="etiqueta">${escaparHTML(livro.categoria)}</p>
      <${h} class="card-livro__titulo"><a href="livro.html?id=${livro.id}">${escaparHTML(livro.titulo)}</a></${h}>
      <p class="card-livro__autor">${escaparHTML(livro.autor)}</p>
      <p class="card-livro__preco">${formatarPreco(livro.preco)}</p>
      <button class="botao botao--primario botao--bloco" type="button" data-acao="adicionar" data-id="${livro.id}">
        Adicionar ao carrinho
      </button>
    </div>`;
  return card;
}

function renderizarCards(container, livros, nivelTitulo) {
  const fragmento = document.createDocumentFragment();
  livros.forEach((livro) => fragmento.appendChild(criarCardLivro(livro, nivelTitulo)));
  container.appendChild(fragmento);
}

/* ---------- Avisos na tela (substituem o alert) ---------- */

let temporizadorAviso = null;

function mostrarAviso(mensagem) {
  const aviso = document.querySelector("[data-aviso]");
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.classList.add("aviso--visivel");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("aviso--visivel"), 2800);
}

/* ---------- Tema claro/escuro ---------- */

function obterTemaAtual() {
  return document.documentElement.getAttribute("data-tema") === "escuro" ? "escuro" : "claro";
}

function atualizarBotaoTema() {
  const escuro = obterTemaAtual() === "escuro";
  document.querySelectorAll("[data-botao-tema]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(escuro));
    botao.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
    botao.title = escuro ? "Modo claro" : "Modo escuro";
  });
}

function alternarTema() {
  const novoTema = obterTemaAtual() === "escuro" ? "claro" : "escuro";
  document.documentElement.setAttribute("data-tema", novoTema);
  try {
    localStorage.setItem(CHAVES.tema, novoTema);
  } catch (erro) {
    /* sem persistência disponível */
  }
  atualizarBotaoTema();
}

/* ---------- Menu hambúrguer ---------- */

function configurarMenu() {
  const botao = document.querySelector("[data-botao-menu]");
  const menu = document.getElementById("menu-principal");
  if (!botao || !menu) return;

  function fecharMenu() {
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    menu.classList.remove("menu--aberto");
  }

  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    if (aberto) {
      fecharMenu();
    } else {
      botao.setAttribute("aria-expanded", "true");
      botao.setAttribute("aria-label", "Fechar menu");
      menu.classList.add("menu--aberto");
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("menu--aberto")) {
      fecharMenu();
      botao.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) fecharMenu();
  });
}

/* Marca no menu o link da página atual. */
function marcarLinkAtivo() {
  const paginaAtual = document.body.dataset.pagina;
  document.querySelectorAll("[data-link-pagina]").forEach((link) => {
    if (link.dataset.linkPagina === paginaAtual) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- Cliques nos cards (delegação de eventos) ---------- */

function configurarAcoesDosCards() {
  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-acao]");
    if (!botao) return;
    const id = Number(botao.dataset.id);
    if (botao.dataset.acao === "adicionar") {
      adicionarAoCarrinho(id);
      botao.classList.remove("botao--pulsar");
      void botao.offsetWidth; /* reinicia a animação */
      botao.classList.add("botao--pulsar");
    } else if (botao.dataset.acao === "favoritar") {
      alternarFavorito(id);
    }
  });
}

/* ---------- Inicialização comum ---------- */

function iniciarPaginaComum() {
  configurarMenu();
  marcarLinkAtivo();
  configurarAcoesDosCards();
  atualizarContadorCarrinho();
  atualizarBotaoTema();
  document.querySelectorAll("[data-botao-tema]").forEach((botao) => botao.addEventListener("click", alternarTema));
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Mantém o contador sincronizado se o carrinho mudar em outra aba. */
  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVES.carrinho) atualizarContadorCarrinho();
  });
}

document.addEventListener("DOMContentLoaded", iniciarPaginaComum);
