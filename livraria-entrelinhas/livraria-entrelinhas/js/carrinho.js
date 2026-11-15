/* Carrinho: lista de itens, quantidades, cupom, total e finalização com ViaCEP. */

/* ---------- Cálculos ---------- */

function obterCupomAplicado() {
  const codigo = lerStorage(CHAVES.cupom, null);
  return codigo && CUPONS[codigo] ? codigo : null;
}

function calcularTotais() {
  const itens = obterCarrinho();
  const subtotal = itens.reduce((soma, item) => soma + buscarLivroPorId(item.id).preco * item.quantidade, 0);
  const cupom = obterCupomAplicado();
  const desconto = cupom ? subtotal * (CUPONS[cupom] / 100) : 0;
  return { subtotal, desconto, total: subtotal - desconto, cupom };
}

/* ---------- Alterações nos itens ---------- */

function alterarQuantidade(idLivro, novaQuantidade) {
  const itens = obterCarrinho();
  const item = itens.find((i) => i.id === idLivro);
  if (!item) return;
  if (novaQuantidade < 1) {
    removerItem(idLivro);
    return;
  }
  item.quantidade = Math.min(novaQuantidade, 99);
  salvarCarrinho(itens);
  renderizarCarrinho();
}

function removerItem(idLivro) {
  const livro = buscarLivroPorId(idLivro);
  salvarCarrinho(obterCarrinho().filter((item) => item.id !== idLivro));
  mostrarAviso(`“${livro.titulo}” foi removido do carrinho.`);
  renderizarCarrinho();
  document.querySelector("[data-titulo-carrinho]").focus();
}

/* ---------- Renderização ---------- */

function criarLinhaItem(item) {
  const livro = buscarLivroPorId(item.id);
  const li = document.createElement("li");
  li.className = "item-carrinho";
  li.innerHTML = `
    <img class="item-carrinho__capa" src="${gerarCapa(livro)}" alt="${escaparHTML(textoAltCapa(livro))}" width="300" height="450">
    <div class="item-carrinho__info">
      <h3 class="item-carrinho__titulo"><a href="livro.html?id=${livro.id}">${escaparHTML(livro.titulo)}</a></h3>
      <p class="item-carrinho__autor">${escaparHTML(livro.autor)}</p>
      <p class="item-carrinho__unitario">Preço unitário: <strong>${formatarPreco(livro.preco)}</strong></p>
    </div>
    <div class="quantidade" role="group" aria-label="Quantidade de ${escaparHTML(livro.titulo)}">
      <button type="button" class="quantidade__botao" data-diminuir="${livro.id}" aria-label="Diminuir quantidade">−</button>
      <label class="sr-only" for="qtd-${livro.id}">Quantidade</label>
      <input class="quantidade__campo" id="qtd-${livro.id}" type="number" min="1" max="99" inputmode="numeric"
        value="${item.quantidade}" data-quantidade="${livro.id}">
      <button type="button" class="quantidade__botao" data-aumentar="${livro.id}" aria-label="Aumentar quantidade">+</button>
    </div>
    <p class="item-carrinho__subtotal"><span class="sr-only">Subtotal: </span>${formatarPreco(livro.preco * item.quantidade)}</p>
    <button type="button" class="botao-remover" data-remover="${livro.id}" aria-label="Remover ${escaparHTML(livro.titulo)} do carrinho">
      Remover
    </button>`;
  return li;
}

function renderizarResumo() {
  const { subtotal, desconto, total, cupom } = calcularTotais();
  document.querySelector("[data-subtotal]").textContent = formatarPreco(subtotal);
  document.querySelector("[data-total]").textContent = formatarPreco(total);

  const linhaDesconto = document.querySelector("[data-linha-desconto]");
  linhaDesconto.hidden = !cupom;
  if (cupom) {
    document.querySelector("[data-rotulo-desconto]").textContent = `Desconto (${cupom} −${CUPONS[cupom]}%)`;
    document.querySelector("[data-desconto]").textContent = `− ${formatarPreco(desconto)}`;
  }
  document.querySelector("[data-remover-cupom]").hidden = !cupom;
}

function renderizarCarrinho() {
  const itens = obterCarrinho();
  const conteudo = document.querySelector("[data-carrinho]");
  const vazio = document.querySelector("[data-carrinho-vazio]");
  const lista = document.querySelector("[data-itens]");

  const temItens = itens.length > 0;
  conteudo.hidden = !temItens;
  vazio.hidden = temItens;
  if (!temItens) {
    document.querySelector("[data-checkout]").hidden = true;
    return;
  }

  lista.innerHTML = "";
  itens.forEach((item) => lista.appendChild(criarLinhaItem(item)));
  const quantidade = contarItensCarrinho();
  document.querySelector("[data-qtd-resumo]").textContent =
    `${quantidade} ${quantidade === 1 ? "item" : "itens"}`;
  renderizarResumo();
}

function configurarListaItens() {
  const lista = document.querySelector("[data-itens]");

  lista.addEventListener("click", (evento) => {
    const alvo = evento.target.closest("button");
    if (!alvo) return;
    const itens = obterCarrinho();
    if (alvo.dataset.aumentar) {
      const id = Number(alvo.dataset.aumentar);
      const item = itens.find((i) => i.id === id);
      alterarQuantidade(id, item.quantidade + 1);
      document.querySelector(`[data-aumentar="${id}"]`)?.focus();
    } else if (alvo.dataset.diminuir) {
      const id = Number(alvo.dataset.diminuir);
      const item = itens.find((i) => i.id === id);
      alterarQuantidade(id, item.quantidade - 1);
      document.querySelector(`[data-diminuir="${id}"]`)?.focus();
    } else if (alvo.dataset.remover) {
      removerItem(Number(alvo.dataset.remover));
    }
  });

  /* Digitar a quantidade direto no campo. */
  lista.addEventListener("change", (evento) => {
    const campo = evento.target.closest("[data-quantidade]");
    if (!campo) return;
    const valor = parseInt(campo.value, 10);
    alterarQuantidade(Number(campo.dataset.quantidade), Number.isNaN(valor) ? 1 : valor);
  });
}

/* ---------- Cupom de desconto ---------- */

function configurarCupom() {
  const formulario = document.querySelector("[data-form-cupom]");
  const campo = document.getElementById("cupom");
  const mensagem = document.querySelector("[data-mensagem-cupom]");
  const botaoRemover = document.querySelector("[data-remover-cupom]");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const codigo = campo.value.trim().toUpperCase();
    if (!codigo) {
      mostrarMensagemFormulario(mensagem, "erro", "Digite o código do cupom.");
      return;
    }
    if (!CUPONS[codigo]) {
      mostrarMensagemFormulario(mensagem, "erro", `O cupom “${codigo}” não é válido.`);
      return;
    }
    salvarStorage(CHAVES.cupom, codigo);
    campo.value = "";
    mostrarMensagemFormulario(mensagem, "sucesso", `Cupom ${codigo} aplicado: ${CUPONS[codigo]}% de desconto.`);
    renderizarResumo();
  });

  botaoRemover.addEventListener("click", () => {
    salvarStorage(CHAVES.cupom, null);
    mostrarMensagemFormulario(mensagem, "sucesso", "Cupom removido.");
    renderizarResumo();
  });
}

/* ---------- Finalização da compra com busca de CEP ---------- */

function formatarCep(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

async function buscarCep(cep) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!resposta.ok) throw new Error("Falha na consulta do CEP");
  const dados = await resposta.json();
  if (dados.erro) return null;
  return dados;
}

function configurarBuscaCep() {
  const campoCep = document.getElementById("cep");
  const status = document.querySelector("[data-status-cep]");
  let ultimoCepBuscado = "";

  campoCep.addEventListener("input", async () => {
    campoCep.value = formatarCep(campoCep.value);
    const cep = campoCep.value.replace(/\D/g, "");
    if (cep.length !== 8 || cep === ultimoCepBuscado) return;
    ultimoCepBuscado = cep;

    status.textContent = "Buscando endereço…";
    try {
      const endereco = await buscarCep(cep);
      if (!endereco) {
        status.textContent = "";
        mostrarErroCampo(campoCep, "CEP não encontrado. Confira os números ou preencha o endereço manualmente.");
        return;
      }
      limparErroCampo(campoCep);
      document.getElementById("rua").value = endereco.logradouro || "";
      document.getElementById("bairro").value = endereco.bairro || "";
      document.getElementById("cidade").value = endereco.localidade || "";
      document.getElementById("uf").value = endereco.uf || "";
      ["rua", "bairro", "cidade", "uf"].forEach((id) => limparErroCampo(document.getElementById(id)));
      status.textContent = `Endereço encontrado: ${endereco.localidade} – ${endereco.uf}.`;
      document.getElementById(endereco.logradouro ? "numero" : "rua").focus();
    } catch (erro) {
      status.textContent = "Não foi possível consultar o CEP agora. Preencha o endereço manualmente.";
    }
  });
}

function configurarCheckout() {
  const botaoFinalizar = document.querySelector("[data-finalizar]");
  const secao = document.querySelector("[data-checkout]");
  const formulario = document.querySelector("[data-form-checkout]");

  botaoFinalizar.addEventListener("click", () => {
    secao.hidden = false;
    secao.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("nome-entrega").focus({ preventScroll: true });
  });

  configurarBuscaCep();

  const obrigatorio = (rotulo) => (valor) => (valor.trim() ? "" : `Informe ${rotulo}.`);

  configurarValidacao(
    formulario,
    {
      "nome-entrega": (valor) =>
        !valor.trim() ? "Informe o nome de quem vai receber." : valor.trim().length < 3 ? "Digite o nome completo." : "",
      cep: (valor) => (valor.replace(/\D/g, "").length !== 8 ? "Digite um CEP com 8 números." : ""),
      rua: obrigatorio("a rua"),
      numero: obrigatorio("o número"),
      bairro: obrigatorio("o bairro"),
      cidade: obrigatorio("a cidade"),
      uf: (valor) => (/^[A-Za-z]{2}$/.test(valor.trim()) ? "" : "Use a sigla do estado com 2 letras (ex.: SP)."),
      pagamento: (valor) => (valor ? "" : "Escolha a forma de pagamento.")
    },
    concluirPedido
  );
}

function concluirPedido() {
  const { total } = calcularTotais();
  const nome = document.getElementById("nome-entrega").value.trim().split(" ")[0];
  const numeroPedido = Math.floor(100000 + Math.random() * 900000);

  salvarCarrinho([]);
  salvarStorage(CHAVES.cupom, null);

  document.querySelector("[data-carrinho]").hidden = true;
  document.querySelector("[data-checkout]").hidden = true;
  const concluido = document.querySelector("[data-pedido-concluido]");
  concluido.querySelector("[data-texto-pedido]").textContent =
    `Obrigado, ${nome}! O pedido nº ${numeroPedido}, no valor de ${formatarPreco(total)}, foi registrado. `;
  concluido.hidden = false;
  concluido.querySelector("h2").focus();
}

document.addEventListener("DOMContentLoaded", () => {
  configurarListaItens();
  configurarCupom();
  configurarCheckout();
  renderizarCarrinho();

  /* Se o carrinho for alterado em outra aba, atualiza esta. */
  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVES.carrinho || evento.key === CHAVES.cupom) renderizarCarrinho();
  });
});
