/* Validação de formulários reaproveitada no contato e na finalização da compra.
   As mensagens aparecem na tela, ao lado de cada campo (sem alert). */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validarEmail(valor) {
  return REGEX_EMAIL.test(valor.trim());
}

function mostrarErroCampo(campo, mensagem) {
  const erro = document.getElementById(`erro-${campo.id}`);
  campo.setAttribute("aria-invalid", "true");
  campo.closest(".campo")?.classList.add("campo--erro");
  if (erro) erro.textContent = mensagem;
}

function limparErroCampo(campo) {
  const erro = document.getElementById(`erro-${campo.id}`);
  campo.removeAttribute("aria-invalid");
  campo.closest(".campo")?.classList.remove("campo--erro");
  if (erro) erro.textContent = "";
}

/* Retorna true se o campo é válido. */
function validarCampo(campo, validadores) {
  const validador = validadores[campo.id];
  if (!validador) return true;
  const mensagem = validador(campo.value, campo);
  if (mensagem) {
    mostrarErroCampo(campo, mensagem);
    return false;
  }
  limparErroCampo(campo);
  return true;
}

function mostrarMensagemFormulario(elemento, tipo, texto) {
  elemento.className = `mensagem-form mensagem-form--${tipo}`;
  elemento.textContent = texto;
  elemento.hidden = false;
}

/**
 * Liga a validação a um formulário.
 * @param {HTMLFormElement} formulario
 * @param {Object} validadores  id do campo -> função que devolve a mensagem de erro ou ""
 * @param {Function} aoEnviarComSucesso  chamada quando todos os campos estão válidos
 */
function configurarValidacao(formulario, validadores, aoEnviarComSucesso) {
  const campos = Object.keys(validadores).map((id) => document.getElementById(id)).filter(Boolean);
  const mensagem = formulario.querySelector("[data-mensagem-form]");

  campos.forEach((campo) => {
    /* Valida ao sair do campo e, depois do primeiro erro, a cada digitação. */
    campo.addEventListener("blur", () => {
      if (campo.value.trim() !== "" || campo.hasAttribute("aria-invalid")) validarCampo(campo, validadores);
    });
    campo.addEventListener("input", () => {
      if (campo.hasAttribute("aria-invalid")) validarCampo(campo, validadores);
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !validarCampo(campo, validadores));

    if (invalidos.length > 0) {
      mostrarMensagemFormulario(
        mensagem,
        "erro",
        invalidos.length === 1
          ? "Há 1 campo com problema. Confira a mensagem destacada."
          : `Há ${invalidos.length} campos com problema. Confira as mensagens destacadas.`
      );
      invalidos[0].focus();
      return;
    }
    aoEnviarComSucesso(mensagem);
  });
}
