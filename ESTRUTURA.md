# 🎬 CineFlix - Estrutura do Projeto

## 📁 Organização de Arquivos

```
filmes/
├── 📄 index.html              # Página principal
├── 📁 assets/                 # Recursos do projeto
│   ├── 📁 css/               # Arquivos de estilo
│   │   ├── styles.css        # Estilos principais e importações
│   │   ├── components.css    # Componentes reutilizáveis
│   │   ├── auth.css         # Estilos de autenticação
│   │   └── responsive.css   # Media queries e responsividade
│   ├── 📁 js/               # Scripts JavaScript
│   │   ├── main.js          # Funcionalidades principais
│   │   └── auth.js          # Sistema de autenticação
│   └── 📁 images/           # Imagens e assets visuais
├── 📁 pages/                # Páginas secundárias
│   ├── login.html           # Página de login
│   ├── cadastro.html        # Página de cadastro
│   └── perfil.html          # Página de perfil do usuário
└── 📁 docs/                 # Documentação
    └── README.md            # Documentação principal
```

## 🔗 Referências de Caminhos

### No arquivo raiz (index.html):
- CSS: `assets/css/styles.css`
- JS: `assets/js/main.js`, `assets/js/auth.js`
- Páginas: `pages/login.html`, `pages/cadastro.html`

### Nas páginas da pasta pages/:
- CSS: `../assets/css/styles.css`
- JS: `../assets/js/auth.js`
- Voltar: `../index.html`

## 📋 Lista de Arquivos

### 🎨 Arquivos de Estilo (CSS)
1. **styles.css** - Arquivo principal com importações
2. **components.css** - Componentes reutilizáveis
3. **auth.css** - Estilos específicos de autenticação
4. **responsive.css** - Media queries e responsividade

### 🎯 Arquivos JavaScript
1. **main.js** - Funcionalidades principais do site
2. **auth.js** - Sistema completo de autenticação

### 📄 Páginas HTML
1. **index.html** - Página principal (raiz)
2. **login.html** - Página de login (pages/)
3. **cadastro.html** - Página de cadastro (pages/)
4. **perfil.html** - Página de perfil (pages/)

### 📚 Documentação
1. **README.md** - Documentação completa (docs/)

## 🎯 Vantagens da Organização

### ✅ Benefícios:
- **Estrutura Clara**: Fácil localização de arquivos
- **Manutenibilidade**: Código organizado por função
- **Escalabilidade**: Estrutura preparada para crescimento
- **Performance**: CSS modular com importações
- **Padrão Profissional**: Segue convenções da indústria

### 🔧 CSS Modular:
- Separação por responsabilidade
- Facilita manutenção
- Melhora legibilidade
- Permite reutilização

### 📱 JavaScript Organizado:
- Funcionalidades separadas
- Código mais limpo
- Fácil debugging
- Melhor estrutura

## 🚀 Como Usar

1. **Desenvolvimento**: Edite arquivos na estrutura organizada
2. **Deploy**: Toda a pasta pode ser enviada ao servidor
3. **Manutenção**: Cada tipo de arquivo tem sua pasta específica
4. **Expansão**: Adicione novos arquivos nas pastas apropriadas