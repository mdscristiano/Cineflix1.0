// Base de dados de filmes (será substituída pela API)
let moviesDatabase = [];
let currentMovies = [];
let currentGenre = 'all';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
let isLoading = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthentication();
    setupEventListeners();
    updateFavoritesFromStorage();
    loadMoviesFromAPI();
});

// Carregar filmes da API
async function loadMoviesFromAPI() {
    try {
        showLoading();
        
        // Carregar filmes populares inicialmente
        const response = await window.tmdbService.getPopularMovies(currentPage);
        
        if (response && response.results) {
            moviesDatabase = response.results.map(movie => window.tmdbService.formatMovieData(movie));
            currentMovies = [...moviesDatabase];
            loadMovies();
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        hideLoading();
        showNotification('Erro ao carregar filmes. Usando dados de demonstração.');
    }
}

// Inicializar sistema de autenticação
function initializeAuthentication() {
    if (window.userManager && userManager.isLoggedIn()) {
        showUserMenu();
        loadUserData();
    } else {
        showAuthButtons();
    }
}

// Mostrar menu do usuário
function showUserMenu() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    
    const user = userManager.getCurrentUser();
    if (user && userName) {
        userName.textContent = user.firstName;
    }
}

// Mostrar botões de autenticação
function showAuthButtons() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
}

// Carregar dados do usuário
function loadUserData() {
    const user = userManager.getCurrentUser();
    if (user && user.preferences) {
        // Carregar favoritos do usuário
        if (user.preferences.favorites) {
            favorites = user.preferences.favorites;
            updateMovieCards();
        }
    }
}

// Toggle dropdown do usuário
function toggleUserDropdown() {
    const userAvatar = document.querySelector('.user-avatar');
    const dropdown = document.getElementById('userDropdown');
    
    userAvatar.classList.toggle('active');
    dropdown.classList.toggle('show');
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userMenu && !userMenu.contains(event.target)) {
        if (dropdown) dropdown.classList.remove('show');
        if (userAvatar) userAvatar.classList.remove('active');
    }
});

// Funções do menu do usuário
function showProfile() {
    window.location.href = 'pages/perfil.html';
}

function showHistory() {
    alert('Funcionalidade de histórico em desenvolvimento!');
}

function showSettings() {
    window.location.href = 'pages/perfil.html';
}

// Logout
function logout() {
    if (window.userManager) {
        const result = userManager.logout();
        if (result.success) {
            showNotification('Logout realizado com sucesso!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Busca
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Filtros de gênero
    const genreButtons = document.querySelectorAll('.genre-btn');
    genreButtons.forEach(btn => {
        btn.addEventListener('click', () => handleGenreFilter(btn));
    });

    // Navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(link);
        });
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Fechar modal clicando fora
    document.getElementById('videoModal').addEventListener('click', (e) => {
        if (e.target.id === 'videoModal') {
            closeModal();
        }
    });
}

// Carregar filmes na grade
function loadMovies(movies = currentMovies) {
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p class="no-results">Nenhum filme encontrado.</p>';
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="openMovieModal(${movie.id})">
            <div class="movie-poster">
                ${movie.poster ? 
                    `<img src="${movie.poster}" alt="${movie.title}" onerror="this.style.display='none'">` :
                    `<div class="poster-placeholder"><i class="fas fa-film"></i></div>`
                }
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-genre">${movie.genre || 'Gênero não especificado'}</p>
                <p class="movie-year">${movie.year} ${movie.duration ? '• ' + movie.duration : ''}</p>
                <p class="movie-description">${movie.description}</p>
                <div class="movie-rating">
                    ${'★'.repeat(Math.floor(movie.rating / 2))} ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                    ${movie.voteCount ? `(${movie.voteCount} votos)` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Buscar filmes
async function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Se busca vazia, carregar filmes populares
        await loadMoviesFromAPI();
        return;
    }

    if (searchTerm.length < 2) {
        return; // Aguardar pelo menos 2 caracteres
    }

    try {
        showLoading();
        
        // Buscar via API
        const response = await window.tmdbService.searchMovies(searchTerm);
        
        if (response && response.results) {
            currentMovies = response.results.map(movie => window.tmdbService.formatMovieData(movie));
            loadMovies(currentMovies);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro na busca:', error);
        
        // Fallback: busca local
        currentMovies = moviesDatabase.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm)
        );
        
        loadMovies(currentMovies);
        hideLoading();
    }
}

// Filtrar por gênero
async function handleGenreFilter(button) {
    // Atualizar botões ativos
    document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    currentGenre = button.dataset.genre;
    
    try {
        showLoading();
        
        if (currentGenre === 'all') {
            // Carregar todos os filmes populares
            await loadMoviesFromAPI();
        } else {
            // Buscar filmes por gênero via API
            const genreId = getGenreIdByName(currentGenre);
            if (genreId) {
                const response = await window.tmdbService.getMoviesByGenre(genreId);
                if (response && response.results) {
                    currentMovies = response.results.map(movie => window.tmdbService.formatMovieData(movie));
                    loadMovies(currentMovies);
                }
            } else {
                // Fallback: filtro local
                applyGenreFilterLocal();
            }
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao filtrar por gênero:', error);
        applyGenreFilterLocal();
        hideLoading();
    }
}

// Aplicar filtro de gênero localmente (fallback)
function applyGenreFilterLocal() {
    let filteredMovies = currentMovies;
    
    if (currentGenre !== 'all') {
        filteredMovies = currentMovies.filter(movie => 
            movie.genre.toLowerCase().includes(getGenreDisplayName(currentGenre).toLowerCase())
        );
    }
    
    loadMovies(filteredMovies);
}

// Mapear nomes de gêneros para IDs da API
function getGenreIdByName(genreName) {
    const genreMap = {
        'action': 28,
        'comedy': 35,
        'drama': 18,
        'horror': 27,
        'romance': 10749,
        'sci-fi': 878,
        'thriller': 53
    };
    
    return genreMap[genreName] || null;
}

// Navegação
function handleNavigation(link) {
    // Atualizar links ativos
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    const target = link.getAttribute('href').substring(1);
    
    switch(target) {
        case 'home':
            scrollToSection('home');
            break;
        case 'movies':
            scrollToSection('movies');
            break;
        case 'favorites':
            showFavorites();
            break;
        default:
            scrollToSection(target);
    }
}

// Rolar para seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Rolar para filmes (botão hero)
function scrollToMovies() {
    scrollToSection('movies');
}

// Abrir modal do filme
async function openMovieModal(movieId) {
    try {
        showLoading();
        
        // Buscar detalhes completos do filme via API
        const movieDetails = await window.tmdbService.getMovieDetails(movieId);
        let movie;
        
        if (movieDetails && movieDetails.id) {
            // Usar dados da API
            movie = {
                ...window.tmdbService.formatMovieData(movieDetails),
                duration: movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A',
                genres: movieDetails.genres ? movieDetails.genres.map(g => g.name).join(', ') : 'N/A'
            };
            
            // Buscar trailer
            try {
                const videosResponse = await window.tmdbService.getMovieVideos(movieId);
                if (videosResponse && videosResponse.results) {
                    const trailer = videosResponse.results.find(video => 
                        video.type === 'Trailer' && video.site === 'YouTube'
                    );
                    if (trailer) {
                        movie.trailer = `https://www.youtube.com/watch?v=${trailer.key}`;
                    }
                }
            } catch (error) {
                console.log('Trailer não encontrado');
            }
        } else {
            // Fallback: usar dados locais
            movie = moviesDatabase.find(m => m.id === movieId);
        }
        
        if (!movie) {
            hideLoading();
            showNotification('Filme não encontrado');
            return;
        }

        // Preencher informações do modal
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('movieDescription').textContent = movie.description;
        document.getElementById('movieYear').textContent = movie.year;
        document.getElementById('movieGenre').textContent = movie.genres || movie.genre;
        document.getElementById('movieDuration').textContent = movie.duration;

        // Configurar player
        const player = document.getElementById('moviePlayer');
        if (movie.trailer) {
            // Se for YouTube, converter para embed
            if (movie.trailer.includes('youtube.com/watch?v=')) {
                const videoId = movie.trailer.split('v=')[1].split('&')[0];
                player.innerHTML = `
                    <iframe width="100%" height="100%" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                `;
            } else {
                player.src = movie.trailer;
            }
        } else {
            // Usar imagem de backdrop como placeholder
            player.innerHTML = movie.backdrop ? 
                `<img src="${movie.backdrop}" alt="${movie.title}" style="width:100%;height:100%;object-fit:cover;">` :
                `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#333;color:#fff;">
                    <div style="text-align:center;">
                        <i class="fas fa-film" style="font-size:3rem;margin-bottom:1rem;"></i>
                        <p>Trailer não disponível</p>
                    </div>
                </div>`;
        }

        // Atualizar botão de favorito
        updateFavoriteButton(movie.id);

        // Mostrar modal
        document.getElementById('videoModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        hideLoading();
        
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        hideLoading();
        showNotification('Erro ao carregar detalhes do filme');
    }
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('moviePlayer');
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Parar vídeo baseado no tipo
    if (player.tagName === 'VIDEO') {
        player.pause();
        player.currentTime = 0;
    } else {
        // Limpar iframe do YouTube
        player.innerHTML = '';
    }
}

// Favoritar filme
function toggleFavorite() {
    const movieTitle = document.getElementById('movieTitle').textContent;
    const movie = moviesDatabase.find(m => m.title === movieTitle);
    
    if (!movie) return;
    
    // Verificar se usuário está logado
    if (!window.userManager || !userManager.isLoggedIn()) {
        showNotification('Faça login para favoritar filmes!');
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 2000);
        return;
    }
    
    const favoriteIndex = favorites.findIndex(f => f.id === movie.id);
    
    if (favoriteIndex === -1) {
        favorites.push(movie);
        movie.isFavorite = true;
        showNotification('Adicionado aos favoritos!');
    } else {
        favorites.splice(favoriteIndex, 1);
        movie.isFavorite = false;
        showNotification('Removido dos favoritos!');
    }
    
    updateFavoriteButton(movie.id);
    saveFavoritesToStorage();
    saveUserFavorites();
}

// Salvar favoritos do usuário no sistema de autenticação
function saveUserFavorites() {
    if (window.userManager && userManager.isLoggedIn()) {
        const user = userManager.getCurrentUser();
        if (user) {
            // Atualizar preferências do usuário
            const updates = {
                preferences: {
                    ...user.preferences,
                    favorites: favorites
                }
            };
            userManager.updateProfile(user.id, updates);
        }
    }
}

// Atualizar cards de filmes
function updateMovieCards() {
    favorites.forEach(fav => {
        const movie = moviesDatabase.find(m => m.id === fav.id);
        if (movie) {
            movie.isFavorite = true;
        }
    });
}

// Atualizar botão de favorito
function updateFavoriteButton(movieId) {
    const favoriteBtn = document.querySelector('.btn-favorite');
    if (!favoriteBtn) return;
    
    const icon = favoriteBtn.querySelector('i');
    const isFavorite = favorites.some(fav => fav.id === movieId);
    
    if (isFavorite) {
        icon.className = 'fas fa-heart';
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favoritado';
    } else {
        icon.className = 'far fa-heart';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Favoritar';
    }
}

// Mostrar favoritos
function showFavorites() {
    if (favorites.length === 0) {
        document.getElementById('moviesGrid').innerHTML = 
            '<p class="no-results">Você ainda não tem filmes favoritos.</p>';
        return;
    }
    
    currentMovies = favorites;
    loadMovies(favorites);
    scrollToSection('movies');
    
    // Atualizar título da seção
    const featuredTitle = document.querySelector('.featured h2');
    featuredTitle.textContent = 'Seus Filmes Favoritos';
    
    // Resetar após 5 segundos
    setTimeout(() => {
        featuredTitle.textContent = 'Filmes em Destaque';
        currentMovies = moviesDatabase;
        loadMovies();
    }, 5000);
}

// Compartilhar filme
function shareMovie() {
    const movieTitle = document.getElementById('movieTitle').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: `Assista ${movieTitle} no CineFlix`,
            text: `Confira este filme incrível: ${movieTitle}`,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(`Assista ${movieTitle} no CineFlix: ${url}`);
        showNotification('Link copiado para a área de transferência!');
    }
}

// Salvar favoritos no localStorage
function saveFavoritesToStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Atualizar favoritos do localStorage (não precisa mais modificar moviesDatabase)
function updateFavoritesFromStorage() {
    // Favoritos agora são mantidos separadamente
    // Não precisamos mais modificar a base de dados dos filmes
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#e50914',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '5px',
        zIndex: '3000',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Obter nome do gênero para exibição
function getGenreDisplayName(genre) {
    const genreNames = {
        'action': 'Ação',
        'comedy': 'Comédia',
        'drama': 'Drama',
        'horror': 'Terror',
        'romance': 'Romance',
        'sci-fi': 'Ficção Científica',
        'thriller': 'Suspense'
    };
    
    return genreNames[genre] || genre;
}

// Mostrar loading
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// Esconder loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Animações CSS adicionais
const additionalStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-results {
        text-align: center;
        font-size: 1.2rem;
        color: #888;
        margin: 2rem 0;
        grid-column: 1 / -1;
    }
    
    .movie-rating {
        color: #ffd700;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
`;

// Adicionar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Funcionalidades extras para melhor experiência
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading para imagens
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});