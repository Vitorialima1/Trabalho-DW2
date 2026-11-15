# Trabalho-DW2
Trabalho final da disciplina DW2
# Livraria Entrelinhas

Site de uma livraria feito para a Atividade Final – Página Web de Livraria.
Página inicial, catálogo, detalhes do livro, carrinho de compras e contato/sobre.

## Integrantes

- Vitoria De Lima Santos
- MARINA KALLY BERNARDO DE OLIVEIRA
- GUSTAVO PEREIRA ROCHA

## Tecnologias usadas e por quê

| Camada | Tecnologia | Motivo |
| --- | --- | --- |
| Estrutura | HTML5 semântico | Sem etapa de build: abre direto no navegador e cada tag tem um papel claro (header, nav, main, section, article, footer). |
| Estilo | CSS puro com variáveis | Paleta e tipografia ficam em:root, o que também facilita o modo escuro (basta trocar as variáveis). Layout com Grid e Flexbox. |
| Interatividade | JavaScript puro (ES6+) | Dá para explicar cada linha sem depender de framework: manipulação do DOM, eventos, localStorage e fetch. |
| Dados | Array em `js/dados.js` | 16 livros em 4 categorias. Os cards são gerados por código a partir desse array. |
| API externa | ViaCEP | Preenche o endereço automaticamente na finalização da compra. |
| Fontes | Google Fonts (Fraunces e Inter) | Se estiver sem internet, o site usa Georgia e a fonte do sistema. |

As capas dos livros são desenhadas em SVG pelo próprio JavaScript (função gerarCapa), então o projeto não depende de imagens externas.

## Estrutura de pastas

```
├── index.html        Página inicial
├── catalogo.html     Catálogo com busca, filtros e ordenação
├── livro.html        Detalhes do livro (livro.html?id=1)
├── carrinho.html     Carrinho e finalização da compra
├── contato.html      Sobre a livraria e formulário de contato
├── css/
│   └── estilo.css    Estilos, variáveis, tema escuro e responsividade
├── img/
│   └── favicon.svg
└── js/
    ├── tema.js       Aplica o tema salvo antes da página aparecer
    ├── dados.js      Array de livros, categorias e cupons
    ├── comum.js      Funções usadas em todas as páginas (carrinho, favoritos, cards, menu, tema)
    ├── validacao.js  Validação de formulários reaproveitada
    ├── inicio.js     Banner, vitrine e categorias da home
    ├── catalogo.js   Busca, filtro, ordenação, favoritos e "Carregar mais"
    ├── livro.js      Detalhes, avaliação por estrelas e livros relacionados
    ├── carrinho.js   Itens, quantidades, cupom, total e checkout com ViaCEP
    └── contato.js    Formulário de contato
```

## Funcionalidades implementadas

### Páginas obrigatórias
- Início: cabeçalho com logotipo, nome e menu; banner com o livro do mês; vitrine com 4 destaques; atalhos por categoria; rodapé com endereço, redes sociais e direitos autorais.
- Catálogo: 16 livros em cards (capa, título, autor, preço e botão "Adicionar ao carrinho"), em 4 categorias: Romance, Fantasia, Técnicos e Infantil.
- Detalhes do livro: capa ampliada, sinopse, autor, editora, ano, número de páginas, preço e categoria, botão de adicionar ao carrinho e link para voltar ao catálogo.
- Carrinho: lista com quantidade, preço unitário e subtotal; botões para alterar a quantidade e remover; valor total.
- Contato/Sobre: texto sobre a livraria e formulário com nome, e-mail, assunto e mensagem.

Todas as páginas compartilham o mesmo cabeçalho, menu e rodapé.

### Requisitos de JavaScript
1. Renderização dinâmica:todos os cards são criados por criarCardLivro() a partir do array LIVROS.
2. Busca: filtra por título ou autor a cada tecla digitada, ignorando acentos e maiúsculas ("codigo" encontra "Código Limpo").
3. Filtro por categoria: botões "Todas", "Romance", "Fantasia", "Técnicos" e "Infantil". Também funciona pela URL (`catalogo.html?categoria=Fantasia`), usada nos atalhos da home.
4. Carrinho funcional: adicionar, remover e alterar quantidade (botões − e + ou digitando), com total recalculado na hora e contador no ícone do carrinho no cabeçalho.
5. Persistência: carrinho salvo no `localStorage`; continua lá ao recarregar ou trocar de página.
6. Validação de formulário: campos obrigatórios, e-mail em formato válido e mensagens de erro e sucesso exibidas na tela, sem `alert`.

### CSS, responsividade e acessibilidade
- Layout com CSS Grid e Flexbox.
- Responsivo em três faixas: até 576px (celular), até 768px (tablet) e 1200px ou mais (desktop).
- Menu hambúrguer no celular e no tablet (fecha também com a tecla Esc).
- Paleta e tipografia definidas em variáveis CSS.
- Hover em cards e botões; animações ao surgir os cards, ao adicionar ao carrinho, ao favoritar e na abertura do menu. As animações são desligadas para quem ativa "reduzir movimento" no sistema.
- Tags semânticas, alt descritivo em todas as capas, um único h1 por página, label associado a cada campo, link "Pular para o conteúdo", foco visível e contraste adequado nos dois temas.

### Extras (bônus)
- Modo claro/escuro, com a preferência salva no localStorage (na primeira visita, segue a configuração do sistema).
- Lista de desejos: coração nos cards e na página do livro, e filtro "Só favoritos" no catálogo.
- Ordenação por relevância, menor preço, maior preço, título (A–Z) e mais recentes.
- Botão "Carregar mais" no catálogo (8 livros por vez).
- Cupom de desconto no carrinho: `LIVRO10` (10%) e `ENTRELINHAS15` (15%).
- Simulação de finalização de compra com formulário de endereço e busca de CEP pela API ViaCEP.
- Avaliação por estrelas na página de detalhes, salva no `localStorage`.

## Como rodar localmente

1. Clone o repositório:
   bash
   git clone https://github.com/Vitorialima1/Trabalho-DW2.git
   cd livraria-entrelinhas
   
2. Abra o index.html no navegador, ou, de preferência, use um servidor local:
   - VS Code: extensão **Live Server** → botão "Go Live"; ou
   - Terminal: python -m http.server 8000 e acesse http://localhost:8000.

A busca de CEP precisa de internet. O resto do site funciona offline.
