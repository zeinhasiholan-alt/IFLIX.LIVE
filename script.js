// API Configuration
const API_BASE = 'https://moverse-api.vercel.app/api';
let allMovies = [];
let currentMovies = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const moviesGrid = document.getElementById('moviesGrid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const loading = document.getElementById('loading');
const noResult = document.getElementById('noResult');
const tabs = document.querySelectorAll('.tab');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadHorrorMovies();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 400));
    
    // Category Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.dataset.category);
        });
    });
    
    // Modal Close
    document.querySelector('.close').addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });
}

// Load Horror Movies from API
async function loadHorrorMovies() {
    try {
        loading.style.display = 'block';
        moviesGrid.innerHTML = '';
        
        // Fetch multiple endpoints
        const [horrorRes, popularRes, dramaRes] = await Promise.all([
            fetch(`${API_BASE}/movie-horror`),
            fetch(`${API_BASE}/movie-popular`),
            fetch(`${API_BASE}/movie-drama`)
        ]);
        
        const horrorData = await horrorRes.json();
        const popularData = await popularRes.json();
        const dramaData = await dramaRes.json();
        
        // Combine and filter Indonesian horror focus
        allMovies = [
            ...(horrorData.data || []),
            ...(popularData.data || []).slice(0, 10),
            ...(dramaData.data || []).slice(0, 5)
        ].filter(movie => movie.title && movie.poster);
        
        currentMovies = allMovies.slice(0, 20);
        renderMovies(currentMovies);
        
    } catch (error) {
        console.error('API Error:', error);
        showFallbackMovies();
    } finally {
        loading.style.display = 'none';
    }
}

// Render Movies Grid
function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    noResult.style.display = 'none';
    
    if (!movies.length) {
        noResult.style.display = 'block';
        return;
    }
    
    movies.slice(0, 24).forEach(movie => {
        const card = createMovieCard(movie);
        moviesGrid.appendChild(card);
    });
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
        <img src="${movie.poster || getPosterFallback()}" 
             alt="${movie.title}" 
             class="movie-poster"
             onerror="this.src='${getPosterFallback()}'"
             loading="lazy">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title || 'Unknown'}</h3>
            <div class="movie-meta">
                ${movie.year ? `${movie.year} | ` : ''}
                <span style="color: #ff6666;">${getGenres(movie)}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => playMovie(movie));
    return card;
}

// Play Movie in Modal
async function playMovie(movie) {
    try {
        // Try to get detailed streaming URL
        const response = await fetch(`${API_BASE}/movie-details/${movie.slug || movie.id}`);
        const details = await response.json();
        
        const videoUrl = details.streaming_url || 
                        details.trailer_url ||
                        `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;
        
        videoPlayer.src = videoUrl;
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        // Fallback to YouTube placeholder
        videoPlayer.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal
function closeModal() {
    videoModal.style.display = 'none';
    videoPlayer.src = '';
    document.body.style.overflow = 'auto';
}

// Search Handler
async function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        renderMovies(currentMovies);
        return;
    }
    
    try {
        loading.style.display = 'block';
        const response = await fetch(`${API_BASE}/movie-search/${encodeURIComponent(query)}`);
        const searchData = await response.json();
        
        renderMovies(searchData.data || []);
    } catch (error) {
        renderMovies(allMovies.filter(m => 
            m.title.toLowerCase().includes(query)
        ));
    } finally {
        loading.style.display = 'none';
    }
}

// Filter by Category
function filterByCategory(category) {
    let filtered = [];
    
    switch(category) {
        case 'horror':
            filtered = allMovies.filter(m => 
                m.genre?.some(g => g.toLowerCase().includes('horror')) ||
                m.title.toLowerCase().includes('horor')
            );
            break;
        case 'popular':
            filtered = allMovies.slice(0, 20);
            break;
        case 'indonesia':
            filtered = allMovies.filter(m => 
                m.title.includes('Indo') || 
                m.country?.includes('Indonesia') ||
                m.title.match(/kafir|pengabdi|asih|sunyi|ratu/i)
            );
            break;
        default:
            filtered = allMovies;
    }
    
    renderMovies(filtered);
}

// Utility Functions
function getPosterFallback() {
    return 'https://via.placeholder.com/300x400/1a0000/ff0000?text=HOROR+ID';
}

function getGenres(movie) {
    return movie.genre?.slice(0, 2).join(', ') || 'Horor';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showFallbackMovies() {
    const fallback = [
        { title: 'Kafir 2025', year: '2025', genre: ['Horor'] },
        { title: 'Pengabdi Setan 2', year: '2022', genre: ['Horor'] },
        { title: 'Ratu Ilmu Hitam', year: '2019', genre: ['Horor'] }
    ];
    renderMovies(fallback);
}
