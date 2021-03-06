# MiddleRow
O MiddleRow é um PWA simples para o consumo da API do The Movie Database. 
Foi feito como um teste de entrevista para o Agenda Edu.

A aplicação está atualmente hospedada na AWS, nesse link: https://middlerow.xyz/

## Dicas para facilitar o teste
1. A lista de filmes (tanto a popular quanto a de busca) é construída "on demand", como pedia um dos requisitos
bônus do teste.
2. Para testar as notificações e o tratamento de erros no caso do usuário fazer várias requests ao mesmo tempo,
coloquei um "botão escondido" para fazer 41 requests seguidas à API. Basta clicar no título `Filmes populares`
na página principal da aplicação. As requests podem demorar uns segundos para começar a dar erro.
3. A barra de busca faz pequenas buscas de palavra chave quando o usuário vai escrevendo. Ela tem um debounce de
500ms, um dos requisitos do teste. Apertar Enter ou clicar nas palavras chave levam o usuário para a página
de busca.
4. Um pequeno aviso aparece no topo do site quando o usuário fica offline e navega para alguma página. Os resultados
em cache são usados nesses casos.
5. O sistema de cache do Workbox não faz cache das requisições da API na primeira vez que o usuário entra no site.
Isso é esperado, já que inicializar o cache logo depois da instalação pode gerar páginas de caches fantasmas. No
segundo carregamento, todas as requisições são colocadas em cache.
6. Por outro lado, o Workbox cria um cache com todos os arquivos necessários para abrir a aplicação logo na 
instalação do service worker. A partir da segunda vez que o usuário entra, o tempo de First Meaningful Paint
da aplicação fica bem abaixo de 1 segundo.

Primeiro carregamento (testes do Lighthouse usando o Chrome): 
![Primeiro carregamento](https://i.imgur.com/tsFnV7C.png)

Segundo carregamento:
![Segundo carregamento](https://i.imgur.com/mcV4WDq.png)


## Resumo

Abaixo, escrevi um resumo de como produzi a aplicação como um todo. Caso tenham dúvidas, estou à disposição :)

### Aplicação
O MiddleRow foi feito com AngularJS 1.7 com o menor número possível de módulos de terceiros.
Dessa forma, o tamanho total do código de distribuição é pequeno e o tempo de resposta da aplicação é ótimo.

Todo a aplicação foi feita usando Components, uma API do AngularJS introduzida na versão 1.5 para facilitar
a transição entre o AngularJS e o Angular 2+. 

Components tem uma API muito semelhante à mesma API do Angular, e os arquivos do projeto foram organizados 
de forma muito semelhante ao seu guia de estilo. Cada componente tem sua pasta, com seu controlador,
template HTML e CSS dentro dela. Outras diretivas como serviços e factories eventualmente são incluídas.

Boa parte do código é documentada usando JSDoc, exceto nas partes mais simples que documentação não é realmente
necessária. Infelizmente, não tive tempo de produzir testes (ainda), nem de ter começado o projeto utilizando BDD.

### Cache e PWA
A aplicação utiliza o Workbox, ferramenta de cache automatizada via service worker da Google. Todos os arquivos
essenciais da aplicação são baixados na instalação do service worker, o que faz o site ficar disponível offline
desde o primeiro contato com o usuário.

A partir da segunda visita ao site, o Workbox começa salvar todas as requisições à API do TMDB em cache, e elas
ficam disponíveis offline caso sejam necessárias. Algumas imagens também entram no cache, mas com um limite
razoável para não ultrapassar a cota de espaço do service worker.

A aplicação também tem um arquivo manifest, que permite "instalar" ela no dispositivo do usuário. O MiddleRow
roda em tela cheia depois de instalado.

### Design
Todos os estilos da aplicação são escritos em SASS, utilizando várias metodologias de CSS como BEM, ITCSS e OOCSS.
Cada componente do AngularJS tem seu próprio arquivo SCSS. No processo de build, todos são combinados em um só
arquivo, que facilita o processo de cache.

O Bootstrap foi utilizado para acelerar o boilerplate da aplicação. Teoricamente, não é necessário para uma
aplicação, mas facilita bastante quando é preciso criar aplicações não tão simples em pouco tempo.

Todas as imagens (exceto às imagens do TMDB) foram feitas em SVG para diminuir o tamanho total dos arquivos,
melhorar a performance de renderização e permitir que todas sejam facilmente incluídas no cache.

O design é 100% responsivo e feito utilizando um mixin de media query super simples em SASS que facilita muito
na hora de criar estilos diferentes pra cada breakpoint do Bootstrap.

### Build
O build do MiddleRow é completamente automatizado utilizando o Gulp. `gulp` roda dois servidores, um de
desenvolvimento e outro de testes do último build, e observa mudanças nos arquivos SCSS. `gulp build` faz o
build do MiddleRow e armazena os arquivos na pasta `build/`.

O processo de build minifica CSS e JS, unifica esses arquivos em um, adiciona tags de "revisão" para facilitar
o cache, gera uma lista de pré-cache para o Workbox, e copia os assets necessários para o PWA funcionar.

## Instalando localmente
Caso seja necessário, instalar e rodar o MiddleRow localmente é super simples:

1. `git clone` nesse  repositório
2. Entre na pasta middlerow: `cd middlerow`
3. Instale as dependências de desenvolvimento com o NPM: `npm install`
4. Instale as dependências da aplicação com o Bower: `bower install`
5. Rode o servidor de testes localmente: `gulp serve-http`

Para rodar o servidor utilizando `gulp serve`, é preciso ter certificados auto-assinados na pasta `certs/`
do repositório. O caminho do certificado tem que ser `certs/server.crt`, e o da chave privada
`certs/server.key`. Se você não quiser testar com certificados (não é realmente necessário), é só usar
os comandos `gulp serve-http` e `gulp serve-dist-http`.
