# 🎬 CineFlix - Site de Filmes

Um site moderno e responsivo para assistir filmes online, desenvolvido com HTML, CSS e JavaScript puro.

## ✨ Características

### 🎯 Funcionalidades Principais
- **Sistema de Autenticação**: Login, cadastro e gerenciamento de perfil
- **Catálogo de Filmes**: Visualização em grade com cartões informativos
- **Player de Vídeo**: Modal com player integrado e controles personalizados
- **Sistema de Busca**: Busca em tempo real por título, descrição ou gênero
- **Filtros por Gênero**: Ação, Comédia, Drama, Terror, Romance, Ficção Científica, Suspense
- **Sistema de Favoritos**: Salva filmes favoritos por usuário
- **Compartilhamento**: Compartilhe filmes via Web Share API ou cópia de link
- **Perfil do Usuário**: Gerenciamento completo de dados pessoais
- **Design Responsivo**: Adaptado para desktop, tablet e mobile

### 🔐 Sistema de Autenticação
- **Cadastro de Usuários**: Formulário completo com validações
- **Login Seguro**: Sistema de hash de senhas
- **Sessões Persistentes**: Mantenha-se logado entre sessões
- **Perfil Personalizado**: Gerencie dados pessoais e preferências
- **Recuperação de Senha**: Sistema de reset de senha
- **Validações Avançadas**: Força de senha, idade mínima, email válido

### 🎨 Interface
- **Tema Escuro**: Design moderno inspirado em plataformas de streaming
- **Animações Suaves**: Transições e efeitos hover profissionais
- **Notificações**: Feedback visual para ações do usuário
- **Loading States**: Indicadores de carregamento para melhor UX

### 📱 Tecnologias Utilizadas
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, animações e media queries
- **JavaScript ES6+**: Funcionalidades interativas e manipulação do DOM
- **Font Awesome**: Ícones profissionais
- **Local Storage**: Persistência de dados e sistema de autenticação
- **Sistema de Hash**: Segurança básica para senhas
- **Web APIs**: Intersection Observer, Web Share API

## 🚀 Como Usar

### Instalação
1. Baixe ou clone os arquivos do projeto
2. Coloque todos os arquivos na mesma pasta:
   - `index.html` (página principal)
   - `login.html` (página de login)
   - `cadastro.html` (página de cadastro)
   - `perfil.html` (página de perfil do usuário)
   - `styles.css` (estilos principais)
   - `script.js` (funcionalidades do site)
   - `auth.js` (sistema de autenticação)
   - `README.md` (documentação)

### Execução
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Não é necessário servidor web - funciona localmente

### Navegação
- **Início**: Página principal com hero section
- **Filmes**: Catálogo completo de filmes
- **Gêneros**: Filtros por categoria
- **Favoritos**: Seus filmes salvos
- **Busca**: Digite na barra de pesquisa no header

## 🎮 Funcionalidades Detalhadas

### 🔍 Sistema de Busca
- Busca em tempo real conforme você digita
- Pesquisa por título, descrição ou gênero
- Resultados instantâneos sem recarregar a página

### 🏷️ Filtros de Gênero
- **Todos**: Mostra todos os filmes
- **Ação**: Filmes de aventura e ação
- **Comédia**: Filmes engraçados e familiares
- **Drama**: Filmes dramáticos e emocionantes
- **Terror**: Filmes de suspense e terror
- **Romance**: Filmes românticos
- **Ficção Científica**: Filmes futuristas e sci-fi
- **Suspense**: Thrillers e mistérios

### 🎥 Player de Vídeo
- Modal com player HTML5 personalizado
- Controles completos (play, pause, volume, fullscreen)
- Informações detalhadas do filme
- Botões de favoritar e compartilhar
- Feche com ESC ou clicando fora do modal

### ❤️ Sistema de Favoritos
- Clique no coração para favoritar/desfavoritar
- Dados salvos no navegador (localStorage)
- Acesse seus favoritos via menu "Favoritos"
- Persistência entre sessões

### 📤 Compartilhamento
- Web Share API para dispositivos compatíveis
- Fallback para cópia de link
- Notificação de confirmação

## 🎨 Personalização

### Adicionando Novos Filmes
Edite o array `moviesDatabase` no arquivo `script.js`:

```javascript
{
    id: 9,
    title: "Nome do Filme",
    genre: "action", // action, comedy, drama, horror, romance, sci-fi, thriller
    year: 2024,
    duration: "120 min",
    description: "Descrição do filme...",
    poster: "URL_da_imagem",
    trailer: "URL_do_video",
    rating: 8.5,
    isFavorite: false
}
```

### Modificando Cores
No arquivo `styles.css`, altere as variáveis de cor:
- Cor principal: `#e50914` (vermelho Netflix)
- Fundo: `#0a0a0a` (preto)
- Texto: `#ffffff` (branco)

### Adicionando Novos Gêneros
1. Adicione o botão no HTML (seção genres)
2. Inclua o gênero no objeto `genreNames` do JavaScript
3. Use o novo gênero nos dados dos filmes

## 📊 Base de Dados Incluída

O site vem com 8 filmes pré-configurados:
- Vingadores: Ultimato (Ação)
- Parasita (Suspense)
- Coringa (Drama)
- Toy Story 4 (Comédia)
- A Freira (Terror)
- Sempre Ao Seu Lado (Romance)
- Blade Runner 2049 (Ficção Científica)
- John Wick 3 (Ação)

## 🔧 Requisitos Técnicos

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Recursos Utilizados
- CSS Grid e Flexbox
- JavaScript ES6+ (arrow functions, const/let, template literals)
- Web APIs (localStorage, Intersection Observer, Web Share)
- HTML5 video element

## 📱 Responsividade

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: até 767px
- **Mobile Small**: até 480px

### Adaptações Mobile
- Menu responsivo
- Grid adaptativo
- Player otimizado para telas pequenas
- Botões touch-friendly

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] Sistema de usuários e login
- [ ] Avaliações e comentários
- [ ] Playlists personalizadas
- [ ] Modo cinema (tela cheia)
- [ ] Legendas e múltiplos idiomas
- [ ] Recomendações personalizadas
- [ ] Histórico de visualização
- [ ] Download offline
- [ ] Integração com APIs externas (TMDB, IMDB)

### Melhorias Técnicas
- [ ] Service Worker para cache
- [ ] Progressive Web App (PWA)
- [ ] Lazy loading de imagens
- [ ] Compressão de assets
- [ ] Análises e métricas

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: contato@cineflix.com
- Telefone: (11) 99999-9999

---


## Novidades

- Adicionar API 
- funçoes e execulçoes para novas soluçoes de segurança
- Entregação de novo banco de dados 
- automatização em Pyton sobre novas APIS de  soluções 
- Novo Responsivo, dando um novo ar para o sistema
- Integração de uma nova IA, para ajudar os novos usuarios 
- novo modelo de segurança em modelo de criptografia em Rash.









**Desenvolvido com ❤️ para amantes de cinema!** 🍿