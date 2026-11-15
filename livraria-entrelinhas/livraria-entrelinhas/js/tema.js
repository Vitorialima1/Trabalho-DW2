/* Carregado no <head> para aplicar o tema antes da página aparecer
   (evita o "piscar" de tela clara quando o usuário prefere o modo escuro). */
(function aplicarTemaInicial() {
  let tema = null;
  try {
    tema = localStorage.getItem("entrelinhas:tema");
  } catch (erro) {
    tema = null;
  }
  if (!tema) {
    const prefereEscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    tema = prefereEscuro ? "escuro" : "claro";
  }
  document.documentElement.setAttribute("data-tema", tema);
})();
