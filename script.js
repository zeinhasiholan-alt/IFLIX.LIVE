// ============================================
// HORORID - SCRIPT.JS LENGKAP VERCEL READY
// API Movie + Debug Movies + Error Handling
// ============================================

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
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    console.log('🩸 HororID Loaded! Starting...');
    
    // Show loading first
    showLoading();
    
    // Test API availability
    const apiStatus = await testAPI();
    console.log('API Status:', apiStatus ? '✅ OK' : '❌ DOWN');
    
    if (apiStatus) {
        await loadHorrorMovies();
    } else {
        console.log('Using DEBUG movies...');
        showDebugMovies();
    }
    
    setupEventListeners();
}

// Test API Connection
async function testAPI() {
    try {
        const response = await fetch(`${API_BASE}/movie-horror`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.ok;
    } catch (error) {
        console.log('API Test Failed:', error.message);
        return false;
    }
}

// Show Loading Screen
function showLoading() {
    moviesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #ff6666;">
            <div style="width: 50px; height: 50px; border: 3px solid #ff000033; border-top: 3px solid #ff0000; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 2rem;"></div>
            <h2>🔍 Memuat film horor...</h2>
            <p>Menghubungkan ke database 1000+ film...</p>
        </div>
    `;
}

// Load Horror Movies from API
async function loadHorrorMovies() {
    try {
        showLoading();
        
        // Multiple API calls
        const [horrorRes, popularRes] = await Promise.all([
            fetch(`${API_BASE}/movie-horror`, { mode: 'cors' }),
            fetch(`${API_BASE}/movie-popular`, { mode: 'cors' })
        ]);
        
        const horrorData = await horrorRes.json();
        const popularData = await popularRes.json();
        
        // Filter valid movies
        allMovies = [
            ...(horrorData.data || []),
            ...(popularData.data || [])
        ].filter(movie => movie && movie.title && (movie.poster || movie.image))
         .map(movie => ({
            id: movie.id || movie.slug || movie.title,
            title: movie.title,
            poster: movie.poster || movie.image || getPosterFallback(),
            year: movie.year || movie.release_date || new Date().getFullYear(),
            genre: movie.genre || ['Horor']
        }));
        
        currentMovies = allMovies.slice(0, 24);
        renderMovies(currentMovies);
        console.log(`✅ Loaded ${allMovies.length} movies from API`);
        
    } catch (error) {
        console.error('API Load Error:', error);
        showDebugMovies();
    }
}

// DEBUG MOVIES - PASTI MUNcul untuk Testing Vercel
function showDebugMovies() {
    const debugMovies = [
        {
            id: 'kafir-2025',
            title: '🩸 KAFIR (2025)',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=KAFIR+2025',
            year: '2025',
            genre: ['Horor', 'Thriller']
        },
        {
            id: 'pengabdi-setan',
            title: '👻 PENGABDI SETAN 2',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=PENGABDI+SETAN',
            year: '2022',
            genre: ['Horor', 'Supernatural']
        },
        {
            id: 'ratu-ilmu-hitam',
            title: '💀 RATU ILMU HITAM',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=RATU+HITAM',
            year: '2019',
            genre: ['Horor', 'Mistik']
        },
        {
            id: 'asih',
            title: '😱 ASIH',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=ASIH',
            year: '2018',
            genre: ['Horor', 'Ghost']
        },
        {
            id: 'sunyi',
            title: '🌙 SUNYI',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=SUNYI',
            year: '2020',
            genre: ['Horor', 'Psychological']
        },
        {
            id: 'impetigore',
            title: '🩸 IMPETIGOORE',
            poster: 'https://via.placeholder.com/300x400/1a0000/ff0000?text=IMPETIGOORE',
            year: '2019',
            genre: ['Horor', 'Folk']
        }
    ];
    
    allMovies = debugMovies;
    currentMovies = debugMovies;
    renderMovies(debugMovies);
    console.log('✅ DEBUG Movies loaded (6 Indonesian horror films)');
}

// Render Movies Grid
function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    noResult.style.display = 'none';
    
    if (!movies || movies.length === 0) {
        noResult.innerHTML = `
            <h2>😱 Film tidak ditemukan</h2>
            <p>Coba cari film horor Indonesia lainnya...</p>
        `;
        noResult.style.display = 'block';
        return;
    }
    
    movies.slice(0, 24).forEach(movie => {
        const card = createMovieCard(movie);
        moviesGrid.appendChild(card);
    });
    
    console.log(`✅ Rendered ${movies.length} movie cards`);
}

// Create Movie Card Element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
        <img src="${movie.poster}" 
             alt="${movie.title}" 
             class="movie-poster"
             loading="lazy"
             onerror="this.src='${getPosterFallback(movie.title)}'"
             style="background: linear-gradient(45deg, #1a0000, #000);">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span>${movie.year}</span>
                <span style="color: #ff6666;">• ${movie.genre.slice(0, 2).join(', ')}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => playMovie(movie));
    return card;
}

// Play Movie in Modal
async function playMovie(movie) {
    console.log('🎥 Playing:', movie.title);
    
    try {
        // Try API first
        const response = await fetch(`${API_BASE}/movie-details/${movie.id}`, {
            mode: 'cors'
        });
        
        if (response.ok) {
            const details = await response.json();
            const videoUrl = details.streaming_url || details.trailer_url || 
                           `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;
            videoPlayer.src = videoUrl;
        } else {
            // Fallback YouTube
            videoPlayer.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
        }
    } catch (error) {
        console.log('Using fallback player');
        videoPlayer.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
    }
    
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    videoModal.style.display = 'none';
    videoPlayer.src = '';
    videoPlayer.pause();
    document.body.style.overflow = 'auto';
}

// Event Listeners Setup
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 400));
    
    // Category Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Modal Controls
    document.querySelector('.close').addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });
    
    // Keyboard ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.style.display === 'block') {
            closeModal();
        }
    });
    
    console.log('✅ Event listeners attached');
}

// Search Handler
async function handleSearch(e) {
    const query = e.target.value.trim();
    loading.style.display = query.length >= 2 ? 'block' : 'none';
    
    if (query.length < 2) {
        renderMovies(currentMovies);
        return;
    }
    
    // API Search
    try {
        const response = await fetch(`${API_BASE}/movie-search/${encodeURIComponent(query)}`, {
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            renderMovies(data.data || []);
        } else {
            // Local search fallback
            const filtered = allMovies.filter(movie =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
            renderMovies(filtered);
        }
    } catch (error) {
        // Local search
        const filtered = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        renderMovies(filtered);
    }
    
    loading.style.display = 'none';
}

// Filter by Category
function filterByCategory(category) {
    let filtered = [];
    
    switch(category.toLowerCase()) {
        case 'horror':
            filtered = allMovies.filter(m => 
                m.genre.some(g => g.toLowerCase().includes('horor') || g.toLowerCase().includes('horror'))
            );
            break;
        case 'popular':
            filtered = allMovies.slice(0, 20);
            break;
        case 'indonesia':
            filtered = allMovies.filter(m => 
                m.title.match(/kafir|pengabdi|asih|sunyi|ratu|impetigore/i) ||
                m.title.includes('Indo')
            );
            break;
        default:
            filtered = allMovies;
    }
    
    currentMovies = filtered;
    renderMovies(filtered);
}

// Utility Functions
function getPosterFallback(title = 'HOROR') {
    return `https://via.placeholder.com/300x400/1a0000/ff0000?text=${encodeURIComponent(title).slice(0,10)}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Loading Animation CSS (embedded)
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('🩸 HororID JavaScript fully loaded! 🎥👻');
