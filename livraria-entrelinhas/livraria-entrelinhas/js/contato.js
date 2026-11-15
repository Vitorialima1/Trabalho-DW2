/* Formulário de contato com validação na tela. */

function configurarFormularioContato() {
  const formulario = document.querySelector("[data-form-contato]");

  configurarValidacao(
    formulario,
    {
      nome: (valor) =>
        !valor.trim() ? "Informe seu nome." : valor.trim().length < 3 ? "O nome precisa ter pelo menos 3 letras." : "",
      email: (valor) =>
        !valor.trim() ? "Informe seu e-mail." : !validarEmail(valor) ? "Digite um e-mail válido, como nome@exemplo.com." : "",
      assunto: (valor) => (valor ? "" : "Escolha um assunto."),
      mensagem: (valor) =>
        !valor.trim()
          ? "Escreva sua mensagem."
          : valor.trim().length < 10
          ? "A mensagem precisa ter pelo menos 10 caracteres."
          : ""
    },
    (mensagem) => {
      const nome = document.getElementById("nome").value.trim().split(" ")[0];
      formulario.reset();
      atualizarContadorCaracteres();
      mostrarMensagemFormulario(
        mensagem,
        "sucesso",
        `Obrigado, ${nome}! Recebemos sua mensagem e responderemos em até 2 dias úteis.`
      );
      mensagem.focus();
    }
  );
}

function atualizarContadorCaracteres() {
  const campo = document.getElementById("mensagem");
  const contador = document.querySelector("[data-contador-caracteres]");
  contador.textContent = `${campo.value.length}/500 caracteres`;
}

document.addEventListener("DOMContentLoaded", () => {
  configurarFormularioContato();
  document.getElementById("mensagem").addEventListener("input", atualizarContadorCaracteres);
  atualizarContadorCaracteres();
});
