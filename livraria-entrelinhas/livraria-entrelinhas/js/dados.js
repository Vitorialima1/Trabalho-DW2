/* =========================================================
   Dados dos livros
   Os cards do site são gerados a partir deste array.
   ========================================================= */

const CATEGORIAS = ["Romance", "Fantasia", "Técnicos", "Infantil"];

const LIVROS = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    editora: "Penguin-Companhia",
    ano: 1899,
    paginas: 256,
    preco: 34.9,
    categoria: "Romance",
    destaque: true,
    cor: "#5b2a3c",
    sinopse:
      "Bentinho, já maduro, revisita a juventude e o casamento com Capitu para tentar responder a uma dúvida que o consome: teria sido traído? Narrado por um homem que não é nada confiável, o romance deixa ao leitor a tarefa de decidir onde termina a lembrança e começa o ciúme."
  },
  {
    id: 2,
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    editora: "Martin Claret",
    ano: 1813,
    paginas: 424,
    preco: 39.9,
    categoria: "Romance",
    destaque: false,
    cor: "#3d5a6c",
    sinopse:
      "Elizabeth Bennet tem opiniões firmes e língua afiada; o senhor Darcy é rico, reservado e parece desprezar todos à sua volta. Entre bailes, cartas e mal-entendidos, os dois precisam rever as primeiras impressões que tiveram um do outro."
  },
  {
    id: 3,
    titulo: "A Hora da Estrela",
    autor: "Clarice Lispector",
    editora: "Rocco",
    ano: 1977,
    paginas: 88,
    preco: 32.9,
    categoria: "Romance",
    destaque: false,
    cor: "#8a5a2b",
    sinopse:
      "Um narrador inquieto conta a história de Macabéa, jovem alagoana que vive no Rio de Janeiro quase sem perceber a própria existência. Curto e intenso, o último livro publicado em vida por Clarice fala de solidão, pobreza e do próprio ato de escrever."
  },
  {
    id: 4,
    titulo: "Torto Arado",
    autor: "Itamar Vieira Junior",
    editora: "Todavia",
    ano: 2019,
    paginas: 264,
    preco: 64.9,
    categoria: "Romance",
    destaque: false,
    livroDoMes: true,
    cor: "#6b3b1f",
    sinopse:
      "No sertão da Bahia, as irmãs Bibiana e Belonísia têm a vida marcada por um acidente na infância. Ao longo dos anos, a história das duas se mistura à luta dos trabalhadores da fazenda Água Negra pelo direito à terra em que vivem há gerações."
  },
  {
    id: 5,
    titulo: "O Hobbit",
    autor: "J. R. R. Tolkien",
    editora: "HarperCollins Brasil",
    ano: 1937,
    paginas: 336,
    preco: 54.9,
    categoria: "Fantasia",
    destaque: true,
    cor: "#2f5d3a",
    sinopse:
      "Bilbo Bolseiro gosta de conforto e não tem o menor interesse em aventuras, até que um mago e treze anões batem à sua porta. A jornada para recuperar um tesouro guardado por um dragão vai levá-lo muito além do Condado e de si mesmo."
  },
  {
    id: 6,
    titulo: "O Nome do Vento",
    autor: "Patrick Rothfuss",
    editora: "Arqueiro",
    ano: 2007,
    paginas: 656,
    preco: 69.9,
    categoria: "Fantasia",
    destaque: false,
    cor: "#7a2e1f",
    sinopse:
      "Kvothe, hoje um discreto dono de estalagem, decide contar a verdade sobre a própria lenda: a infância numa trupe de artistas, a tragédia que a interrompeu e os anos na Universidade, onde aprendeu que magia exige mais do que talento."
  },
  {
    id: 7,
    titulo: "Coraline",
    autor: "Neil Gaiman",
    editora: "Intrínseca",
    ano: 2002,
    paginas: 160,
    preco: 44.9,
    categoria: "Fantasia",
    destaque: false,
    cor: "#2c3e66",
    sinopse:
      "Na casa nova, Coraline encontra uma porta que leva a uma versão melhorada da própria vida, com uma outra mãe muito mais atenciosa. O problema é que esse mundo tem botões no lugar dos olhos e não pretende deixá-la ir embora."
  },
  {
    id: 8,
    titulo: "O Último Desejo",
    autor: "Andrzej Sapkowski",
    editora: "WMF Martins Fontes",
    ano: 1993,
    paginas: 288,
    preco: 49.9,
    categoria: "Fantasia",
    destaque: false,
    cor: "#4a4a4a",
    sinopse:
      "Geralt de Rívia é um bruxo, caçador de monstros treinado desde criança. Nesta coletânea de contos, ele descobre que os monstros mais difíceis de enfrentar nem sempre têm garras, e que cada contrato esconde uma escolha moral."
  },
  {
    id: 9,
    titulo: "Código Limpo",
    autor: "Robert C. Martin",
    editora: "Alta Books",
    ano: 2008,
    paginas: 425,
    preco: 89.9,
    categoria: "Técnicos",
    destaque: true,
    cor: "#1f4e5f",
    sinopse:
      "Um guia prático sobre como escrever código que outras pessoas conseguem ler e manter. Com exemplos reais, o livro discute nomes significativos, funções pequenas, tratamento de erros, testes e a disciplina de deixar o código melhor do que você encontrou."
  },
  {
    id: 10,
    titulo: "JavaScript: O Guia Definitivo",
    autor: "David Flanagan",
    editora: "Bookman",
    ano: 2021,
    paginas: 706,
    preco: 149.9,
    categoria: "Técnicos",
    destaque: false,
    cor: "#8a6d1a",
    sinopse:
      "Referência completa da linguagem, do básico às versões modernas do ECMAScript. Cobre tipos, funções, classes, módulos, programação assíncrona com Promises e async/await, além das APIs do navegador e do Node.js."
  },
  {
    id: 11,
    titulo: "Entendendo Algoritmos",
    autor: "Aditya Y. Bhargava",
    editora: "Novatec",
    ano: 2017,
    paginas: 264,
    preco: 79.9,
    categoria: "Técnicos",
    destaque: false,
    cor: "#3c6e47",
    sinopse:
      "Busca binária, recursão, ordenação, grafos e programação dinâmica explicados com ilustrações e exemplos do dia a dia. Uma introdução leve e visual para quem quer entender como os algoritmos funcionam sem se perder em fórmulas."
  },
  {
    id: 12,
    titulo: "O Programador Pragmático",
    autor: "David Thomas e Andrew Hunt",
    editora: "Bookman",
    ano: 2020,
    paginas: 352,
    preco: 119.9,
    categoria: "Técnicos",
    destaque: false,
    cor: "#5a3d6b",
    sinopse:
      "Conselhos diretos para quem quer evoluir na carreira de desenvolvimento: como evitar duplicação, lidar com mudanças, depurar com método, automatizar tarefas e assumir responsabilidade pelo próprio trabalho. Edição comemorativa de 20 anos."
  },
  {
    id: 13,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    editora: "Agir",
    ano: 1943,
    paginas: 96,
    preco: 29.9,
    categoria: "Infantil",
    destaque: true,
    cor: "#2d5f8a",
    sinopse:
      "Um aviador cai no deserto do Saara e conhece um menino vindo de um asteroide minúsculo. Nas conversas entre os dois, surgem uma rosa vaidosa, uma raposa que quer ser cativada e lições sobre amizade que servem para todas as idades."
  },
  {
    id: 14,
    titulo: "Reinações de Narizinho",
    autor: "Monteiro Lobato",
    editora: "Globinho",
    ano: 1931,
    paginas: 248,
    preco: 42.9,
    categoria: "Infantil",
    destaque: false,
    cor: "#a0442a",
    sinopse:
      "No Sítio do Picapau Amarelo, Narizinho, Pedrinho, a boneca Emília e o Visconde de Sabugosa vivem aventuras que vão do Reino das Águas Claras ao mundo das fábulas. O livro que deu início a um dos universos mais queridos da literatura brasileira."
  },
  {
    id: 15,
    titulo: "Menina Bonita do Laço de Fita",
    autor: "Ana Maria Machado",
    editora: "Ática",
    ano: 1986,
    paginas: 24,
    preco: 36.9,
    categoria: "Infantil",
    destaque: false,
    cor: "#7d2f5a",
    sinopse:
      "Um coelho branco fica encantado com a beleza de uma menina e quer, a todo custo, descobrir como ter a pele tão escura quanto a dela. Uma história delicada sobre identidade, herança familiar e o valor das diferenças."
  },
  {
    id: 16,
    titulo: "O Menino Maluquinho",
    autor: "Ziraldo",
    editora: "Melhoramentos",
    ano: 1980,
    paginas: 112,
    preco: 49.9,
    categoria: "Infantil",
    destaque: false,
    cor: "#b5531c",
    sinopse:
      "Ele tinha o olho maior que a barriga, fogo no rabo e vento nos pés. O menino mais famoso de Ziraldo cresce entre travessuras, amigos e descobertas, numa celebração da infância que atravessa gerações de leitores."
  }
];

/* Cupons aceitos no carrinho: código -> percentual de desconto */
const CUPONS = {
  LIVRO10: 10,
  ENTRELINHAS15: 15
};
