// ========================================
// CONFIGURAÇÃO DA API TMDB
// ========================================

// IMPORTANTE: Para usar em produção, obtenha sua própria chave em:
// https://www.themoviedb.org/settings/api

const TMDB_CONFIG = {
    // SUBSTITUA pela sua chave da API TMDB
    // Obtenha em: https://www.themoviedb.org/settings/api
    API_KEY: 'SUA_CHAVE_AQUI',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    
    // Tamanhos de imagem disponíveis
    IMAGE_SIZES: {
        poster: {
            small: 'w342',
            medium: 'w500',
            large: 'w780'
        },
        backdrop: {
            small: 'w780',
            medium: 'w1280',
            large: 'original'
        }
    },
    
    // Endpoints da API
    ENDPOINTS: {
        POPULAR: '/movie/popular',
        TOP_RATED: '/movie/top_rated',
        NOW_PLAYING: '/movie/now_playing',
        UPCOMING: '/movie/upcoming',
        SEARCH: '/search/movie',
        MOVIE_DETAILS: '/movie',
        MOVIE_VIDEOS: '/movie/{id}/videos',
        GENRES: '/genre/movie/list'
    }
};

// ========================================
// SERVIÇO DA API TMDB
// ========================================

class TMDBService {
    constructor() {
        this.apiKey = TMDB_CONFIG.API_KEY;
        this.baseUrl = TMDB_CONFIG.BASE_URL;
        this.imageBaseUrl = TMDB_CONFIG.IMAGE_BASE_URL;
        this.genres = [];
        this.loadGenres();
    }

    // Fazer requisição para a API
    async makeRequest(endpoint, params = {}) {
        try {
            // Para demonstração, vou usar dados mockados se a API key não estiver configurada
            if (this.apiKey === 'demo_key_replace_with_your_own') {
                return this.getMockData(endpoint, params);
            }

            const url = new URL(`${this.baseUrl}${endpoint}`);
            url.searchParams.append('api_key', this.apiKey);
            url.searchParams.append('language', 'pt-BR');
            
            // Adicionar parâmetros extras
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição TMDB:', error);
            // Retornar dados mockados em caso de erro
            return this.getMockData(endpoint, params);
        }
    }

    // Dados mockados para demonstração
    getMockData(endpoint, params) {
        const mockMovies = [
            {
                id: 1,
                title: "Vingadores: Ultimato",
                original_title: "Avengers: Endgame",
                overview: "Os Vingadores restantes devem encontrar uma maneira de recuperar seus aliados para um confronto épico com Thanos.",
                poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
                release_date: "2019-04-24",
                vote_average: 8.4,
                vote_count: 20000,
                genre_ids: [28, 12, 878],
                adult: false,
                video: false,
                popularity: 100.0
            },
            {
                id: 2,
                title: "Parasita",
                original_title: "기생충",
                overview: "Uma família pobre se infiltra na vida de uma família rica, mas um evento inesperado ameaça expor sua farsa.",
                poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                backdrop_path: "/TU9NIjwzjoKPwQHoHshkBcQCPWA.jpg",
                release_date: "2019-05-30",
                vote_average: 8.6,
                vote_count: 15000,
                genre_ids: [35, 18, 53],
                adult: false,
                video: false,
                popularity: 95.0
            },
            {
                id: 3,
                title: "Coringa",
                original_title: "Joker",
                overview: "Um comediante fracassado é levado à loucura e se torna um psicopata assassino em Gotham City.",
                poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                backdrop_path: "/a4BfxRK8dBgbQqbRxPs8kmLd8LG.jpg",
                release_date: "2019-10-02",
                vote_average: 8.4,
                vote_count: 18000,
                genre_ids: [80, 18, 53],
                adult: false,
                video: false,
                popularity: 90.0
            },
            {
                id: 4,
                title: "Toy Story 4",
                original_title: "Toy Story 4",
                overview: "Woody sempre foi confiante sobre seu lugar no mundo e que sua prioridade é cuidar de sua criança.",
                poster_path: "/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
                backdrop_path: "/4GCrZSwqzk2rCMKDIhz9r8R7AuC.jpg",
                release_date: "2019-06-13",
                vote_average: 7.7,
                vote_count: 12000,
                genre_ids: [16, 35, 10751],
                adult: false,
                video: false,
                popularity: 85.0
            },
            {
                id: 5,
                title: "A Freira",
                original_title: "The Nun",
                overview: "Um padre e uma noviça investigam a morte misteriosa de uma freira em um convento na Romênia.",
                poster_path: "/sFC1ElvoKGdHJIWRpNB3xWJ9lJA.jpg",
                backdrop_path: "/fS3DnRVWc7TsLVivv0p88YtJ7bY.jpg",
                release_date: "2018-09-05",
                vote_average: 5.3,
                vote_count: 8000,
                genre_ids: [27, 9648, 53],
                adult: false,
                video: false,
                popularity: 80.0
            },
            {
                id: 6,
                title: "Blade Runner 2049",
                original_title: "Blade Runner 2049",
                overview: "Um jovem blade runner descobre um segredo que pode mergulhar o que resta da sociedade no caos.",
                poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                backdrop_path: "/ilKxNr9yHzWVGcrIvPctCCPTNkS.jpg",
                release_date: "2017-10-04",
                vote_average: 8.0,
                vote_count: 16000,
                genre_ids: [878, 18],
                adult: false,
                video: false,
                popularity: 75.0
            },
            {
                id: 7,
                title: "John Wick 3: Parabellum",
                original_title: "John Wick: Chapter 3 – Parabellum",
                overview: "John Wick está em fuga após matar um membro do Alto Conselho Internacional de Assassinos.",
                poster_path: "/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg",
                backdrop_path: "/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
                release_date: "2019-05-15",
                vote_average: 7.4,
                vote_count: 14000,
                genre_ids: [28, 80, 53],
                adult: false,
                video: false,
                popularity: 70.0
            },
            {
                id: 8,
                title: "Capitã Marvel",
                original_title: "Captain Marvel",
                overview: "Carol Danvers se torna uma das heroínas mais poderosas do universo quando a Terra fica no meio de uma guerra galáctica.",
                poster_path: "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
                backdrop_path: "/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg",
                release_date: "2019-03-06",
                vote_average: 6.8,
                vote_count: 11000,
                genre_ids: [28, 12, 878],
                adult: false,
                video: false,
                popularity: 65.0
            }
        ];

        // Simular diferentes endpoints
        if (endpoint.includes('/search/movie')) {
            const query = params.query?.toLowerCase() || '';
            const filtered = mockMovies.filter(movie => 
                movie.title.toLowerCase().includes(query) ||
                movie.overview.toLowerCase().includes(query)
            );
            return { results: filtered, total_results: filtered.length };
        }

        return { results: mockMovies, total_results: mockMovies.length };
    }

    // Carregar gêneros
    async loadGenres() {
        try {
            const response = await this.makeRequest(TMDB_CONFIG.ENDPOINTS.GENRES);
            this.genres = response.genres || [
                { id: 28, name: "Ação" },
                { id: 12, name: "Aventura" },
                { id: 16, name: "Animação" },
                { id: 35, name: "Comédia" },
                { id: 80, name: "Crime" },
                { id: 99, name: "Documentário" },
                { id: 18, name: "Drama" },
                { id: 10751, name: "Família" },
                { id: 14, name: "Fantasia" },
                { id: 36, name: "História" },
                { id: 27, name: "Terror" },
                { id: 10402, name: "Música" },
                { id: 9648, name: "Mistério" },
                { id: 10749, name: "Romance" },
                { id: 878, name: "Ficção Científica" },
                { id: 10770, name: "Cinema TV" },
                { id: 53, name: "Thriller" },
                { id: 10752, name: "Guerra" },
                { id: 37, name: "Faroeste" }
            ];
        } catch (error) {
            console.error('Erro ao carregar gêneros:', error);
        }
    }

    // Buscar filmes populares
    async getPopularMovies(page = 1) {
        return await this.makeRequest(TMDB_CONFIG.ENDPOINTS.POPULAR, { page });
    }

    // Buscar filmes mais bem avaliados
    async getTopRatedMovies(page = 1) {
        return await this.makeRequest(TMDB_CONFIG.ENDPOINTS.TOP_RATED, { page });
    }

    // Buscar filmes em cartaz
    async getNowPlayingMovies(page = 1) {
        return await this.makeRequest(TMDB_CONFIG.ENDPOINTS.NOW_PLAYING, { page });
    }

    // Buscar filmes em breve
    async getUpcomingMovies(page = 1) {
        return await this.makeRequest(TMDB_CONFIG.ENDPOINTS.UPCOMING, { page });
    }

    // Buscar filmes por query
    async searchMovies(query, page = 1) {
        return await this.makeRequest(TMDB_CONFIG.ENDPOINTS.SEARCH, { query, page });
    }

    // Buscar detalhes de um filme
    async getMovieDetails(movieId) {
        return await this.makeRequest(`${TMDB_CONFIG.ENDPOINTS.MOVIE_DETAILS}/${movieId}`);
    }

    // Buscar vídeos/trailers de um filme
    async getMovieVideos(movieId) {
        const endpoint = TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS.replace('{id}', movieId);
        return await this.makeRequest(endpoint);
    }

    // Gerar URL de imagem
    getImageUrl(path, size = 'medium', type = 'poster') {
        if (!path) return null;
        
        const sizeKey = TMDB_CONFIG.IMAGE_SIZES[type]?.[size] || 'w500';
        return `${this.imageBaseUrl}/${sizeKey}${path}`;
    }

    // Obter gênero por ID
    getGenreById(genreId) {
        const genre = this.genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Desconhecido';
    }

    // Obter múltiplos gêneros por IDs
    getGenresByIds(genreIds) {
        return genreIds.map(id => this.getGenreById(id)).join(', ');
    }

    // Filtrar filmes por gênero
    async getMoviesByGenre(genreId, page = 1) {
        return await this.makeRequest('/discover/movie', { 
            with_genres: genreId,
            page,
            sort_by: 'popularity.desc'
        });
    }

    // Formatar dados do filme para o padrão do site
    formatMovieData(movie) {
        return {
            id: movie.id,
            title: movie.title,
            genre: this.getGenresByIds(movie.genre_ids || []),
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
            duration: 'N/A', // TMDB não fornece duração na listagem, apenas em detalhes
            description: movie.overview || 'Descrição não disponível',
            poster: this.getImageUrl(movie.poster_path, 'medium', 'poster'),
            backdrop: this.getImageUrl(movie.backdrop_path, 'large', 'backdrop'),
            rating: movie.vote_average || 0,
            voteCount: movie.vote_count || 0,
            releaseDate: movie.release_date,
            trailer: null, // Será carregado separadamente
            isFavorite: false
        };
    }
}

// Instância global do serviço
window.tmdbService = new TMDBService();

// Exportar para compatibilidade
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TMDBService, TMDB_CONFIG };
}