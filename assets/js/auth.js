// Sistema de Autenticação CineFlix
// Simula um banco de dados usando localStorage

// Configurações
const AUTH_CONFIG = {
    SESSION_KEY: 'cineflix_session',
    USERS_KEY: 'cineflix_users',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 horas
    MIN_PASSWORD_LENGTH: 6
};

// Classe para gerenciar usuários
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
    }

    // Carregar usuários do localStorage
    loadUsers() {
        const users = localStorage.getItem(AUTH_CONFIG.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Salvar usuários no localStorage
    saveUsers() {
        localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(this.users));
    }

    // Hash simples para senhas (em produção, use bcrypt)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converter para 32bit
        }
        return hash.toString(36);
    }

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar senha
    isValidPassword(password) {
        return password && password.length >= AUTH_CONFIG.MIN_PASSWORD_LENGTH;
    }

    // Verificar se email já existe
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Registrar novo usuário
    register(userData) {
        try {
            // Validações
            if (!userData.firstName || !userData.lastName) {
                throw new Error('Nome e sobrenome são obrigatórios');
            }

            if (!this.isValidEmail(userData.email)) {
                throw new Error('Email inválido');
            }

            if (this.emailExists(userData.email)) {
                throw new Error('Este email já está cadastrado');
            }

            if (!this.isValidPassword(userData.password)) {
                throw new Error(`Senha deve ter pelo menos ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} caracteres`);
            }

            if (userData.password !== userData.confirmPassword) {
                throw new Error('As senhas não coincidem');
            }

            if (!userData.birthDate) {
                throw new Error('Data de nascimento é obrigatória');
            }

            // Verificar idade mínima (13 anos)
            const birthDate = new Date(userData.birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                throw new Error('Você deve ter pelo menos 13 anos para se cadastrar');
            }

            if (!userData.terms) {
                throw new Error('Você deve aceitar os termos de uso');
            }

            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                email: userData.email.toLowerCase().trim(),
                password: this.hashPassword(userData.password),
                birthDate: userData.birthDate,
                newsletter: userData.newsletter || false,
                createdAt: new Date().toISOString(),
                preferences: {
                    favoriteGenres: [],
                    watchHistory: [],
                    favorites: []
                }
            };

            // Adicionar usuário
            this.users.push(newUser);
            this.saveUsers();

            return {
                success: true,
                message: 'Conta criada com sucesso!',
                user: this.sanitizeUser(newUser)
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Login do usuário
    login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            // Buscar usuário
            const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (!user) {
                throw new Error('Email não cadastrado');
            }

            // Verificar senha
            const hashedPassword = this.hashPassword(password);
            if (user.password !== hashedPassword) {
                throw new Error('Senha incorreta');
            }

            // Criar sessão
            const session = {
                userId: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                loginTime: Date.now(),
                expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION
            };

            localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
            this.currentUser = this.sanitizeUser(user);

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                user: this.currentUser
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Logout
    logout() {
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        this.currentUser = null;
        return {
            success: true,
            message: 'Logout realizado com sucesso!'
        };
    }

    // Verificar se usuário está logado
    isLoggedIn() {
        const session = this.getSession();
        return session && session.expiresAt > Date.now();
    }

    // Obter sessão atual
    getSession() {
        const session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }

    // Obter usuário atual
    getCurrentUser() {
        if (!this.isLoggedIn()) return null;
        
        const session = this.getSession();
        const user = this.users.find(u => u.id === session.userId);
        return user ? this.sanitizeUser(user) : null;
    }

    // Remover dados sensíveis do usuário
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    // Atualizar perfil do usuário
    updateProfile(userId, updates) {
        try {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                throw new Error('Usuário não encontrado');
            }

            // Validar atualizações
            if (updates.email && !this.isValidEmail(updates.email)) {
                throw new Error('Email inválido');
            }

            if (updates.email && updates.email !== this.users[userIndex].email) {
                if (this.emailExists(updates.email)) {
                    throw new Error('Este email já está em uso');
                }
            }

            // Aplicar atualizações
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveUsers();

            return {
                success: true,
                message: 'Perfil atualizado com sucesso!',
                user: this.sanitizeUser(this.users[userIndex])
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Alterar senha
    changePassword(userId, currentPassword, newPassword) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Verificar senha atual
            if (this.hashPassword(currentPassword) !== user.password) {
                throw new Error('Senha atual incorreta');
            }

            if (!this.isValidPassword(newPassword)) {
                throw new Error(`Nova senha deve ter pelo menos ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} caracteres`);
            }

            // Atualizar senha
            user.password = this.hashPassword(newPassword);
            this.saveUsers();

            return {
                success: true,
                message: 'Senha alterada com sucesso!'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Recuperar senha (simular envio de email)
    forgotPassword(email) {
        try {
            if (!this.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                throw new Error('Email não encontrado');
            }

            // Em uma aplicação real, aqui enviaria um email
            // Por enquanto, vamos simular
            const resetToken = Math.random().toString(36).substr(2, 9);
            
            // Armazenar token temporariamente (5 minutos)
            const resetData = {
                email: email,
                token: resetToken,
                expiresAt: Date.now() + (5 * 60 * 1000)
            };
            
            localStorage.setItem('cineflix_reset', JSON.stringify(resetData));

            return {
                success: true,
                message: `Email de recuperação enviado! Use o código: ${resetToken}`,
                token: resetToken // Apenas para demonstração
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Instância global do gerenciador de usuários
const userManager = new UserManager();

// Funções para as páginas de autenticação

// Toggle para mostrar/esconder senha
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Mostrar mensagem de erro
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Mostrar mensagem de sucesso
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
}

// Mostrar/esconder loading
function setLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    const submitButton = document.querySelector('.btn-auth');
    
    if (loadingElement && submitButton) {
        if (isLoading) {
            loadingElement.style.display = 'block';
            submitButton.disabled = true;
        } else {
            loadingElement.style.display = 'none';
            submitButton.disabled = false;
        }
    }
}

// Event listeners para formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        setLoading(true);
        
        // Simular delay de rede
        setTimeout(() => {
            const result = userManager.login(email, password);
            
            setLoading(false);
            
            if (result.success) {
                showSuccess(result.message);
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError(result.message);
            }
        }, 1000);
    });
}

// Event listeners para formulário de cadastro
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            birthDate: formData.get('birthDate'),
            terms: formData.get('terms') === 'on',
            newsletter: formData.get('newsletter') === 'on'
        };
        
        setLoading(true);
        
        // Simular delay de rede
        setTimeout(() => {
            const result = userManager.register(userData);
            
            setLoading(false);
            
            if (result.success) {
                showSuccess(result.message);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showError(result.message);
            }
        }, 1500);
    });
}

// Função para recuperação de senha
function forgotPassword() {
    const email = prompt('Digite seu email para recuperar a senha:');
    if (email) {
        const result = userManager.forgotPassword(email);
        if (result.success) {
            alert(result.message);
        } else {
            alert('Erro: ' + result.message);
        }
    }
}

// Função para mostrar termos (simular)
function showTerms() {
    alert('Termos de Uso do CineFlix\n\n1. Você deve ter pelo menos 13 anos para usar este serviço.\n2. É proibido compartilhar sua conta.\n3. Respeite os direitos autorais.\n4. Use o serviço de forma responsável.\n\n(Esta é uma versão simplificada dos termos)');
}

// Função para mostrar política de privacidade (simular)
function showPrivacy() {
    alert('Política de Privacidade do CineFlix\n\n1. Coletamos apenas informações necessárias.\n2. Não compartilhamos seus dados com terceiros.\n3. Você pode solicitar exclusão dos seus dados.\n4. Usamos cookies para melhorar sua experiência.\n\n(Esta é uma versão simplificada da política)');
}

// Verificar autenticação ao carregar páginas
document.addEventListener('DOMContentLoaded', function() {
    // Se estiver na página principal e logado, mostrar dados do usuário
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (userManager.isLoggedIn()) {
            updateUIForLoggedUser();
        }
    }
    
    // Redirecionar se já estiver logado e tentar acessar login/cadastro
    if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('cadastro.html')) && userManager.isLoggedIn()) {
        window.location.href = '../index.html';
    }
});

// Atualizar interface para usuário logado
function updateUIForLoggedUser() {
    const user = userManager.getCurrentUser();
    if (user) {
        // Você pode personalizar a interface aqui
        console.log('Usuário logado:', user.firstName + ' ' + user.lastName);
        
        // Exemplo: mostrar nome do usuário no header
        const headerContainer = document.querySelector('.header .container');
        if (headerContainer) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span>Olá, ${user.firstName}!</span>
                <button onclick="userManager.logout(); window.location.reload();" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            `;
            headerContainer.appendChild(userInfo);
        }
    }
}

// Estilos para informações do usuário logado
const userStyles = `
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #ffffff;
    }
    
    .btn-logout {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-logout:hover {
        background: #e50914;
        border-color: #e50914;
    }
    
    @media (max-width: 768px) {
        .user-info {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;

// Adicionar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = userStyles;
document.head.appendChild(styleSheet);

// Exportar para uso global
window.userManager = userManager;