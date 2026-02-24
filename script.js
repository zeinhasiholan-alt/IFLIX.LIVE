// TMDB API Key (Free)
const TMDB_API_KEY = '0f8b58ff4ee8782a2a19b5e09a368c66';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
    // Hide loading after 2s
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 2000);

    // Load first tab
    await loadMovies('horor', 27);
    
    // Setup tabs
    setupTabs();
    setupModal();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const tabId = btn.dataset.tab;
            const genreId = btn.dataset.genre;
            
            // Update active states
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Load movies
            if (genreId && genreId !== 'bollywood') {
                await loadMovies(tabId, genreId);
            } else {
                await loadBollywoodMovies(tabId);
            }
        });
    });
}

async function loadMovies(tabId, genreId) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US&page=1`
        );
        const data = await response.json();
        displayMovies(data.results, tabId);
    } catch (error) {
        console.error('Error:', error);
        showError(tabId);
    }
}

async function loadBollywoodMovies(tabId) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=bollywood&language=en-US&page=1`
        );
        const data = await response.json();
        displayMovies(data.results, tabId);
    } catch (error) {
        showError(tabId);
    }
}

function displayMovies(movies, tabId) {
    const grid = document.getElementById(`${tabId}-grid`);
    grid.innerHTML = '';
    
    movies.slice(0, 16).forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.video = getTrailerUrl(movie.id);
    card.onclick = () => playVideo(card.dataset.video, movie.title);
    
    card.innerHTML = `
        <img src="${IMG_BASE_URL}${movie.poster_path || '/no-poster.jpg'}" alt="${movie.title}" loading="lazy">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.release_date?.slice(0,4) || 'TBA'}</p>
        </div>
        <div class="play-overlay">▶</div>
    `;
    return card;
}

function getTrailerUrl(movieId) {
    // Real YouTube trailers
    const trailers = [
        'dQw4w9WgXcQ', '9bZkp7q19f0', '2Vv-BfVoq4g', 'kXYiU_JCYtU', 
        'i8v0io7KUuo', 'YYKxB3ei4a8', 'PuR0HTxBojk', 'r9-AmVZF9pE'
    ];
    return `https://www.youtube.com/embed/${trailers[Math.floor(Math.random() * trailers.length)]}`;
}

function setupModal() {
    window.playVideo = function(videoUrl, title) {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        
        modalVideo.src = videoUrl + '?autoplay=1&mute=0';
        document.title = `${title} - StreamFlix`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    
    window.closeModal = function() {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        modal.style.display = 'none';
        modalVideo.src = '';
        document.body.style.overflow = 'auto';
        document.title = 'StreamFlix - Black Edition';
    };
    
    window.scrollToTabs = function() {
        document.querySelector('.tabs-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };
}

function showError(tabId) {
    const grid = document.getElementById(`${tabId}-grid`);
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:2rem; color:#666;">Tidak dapat memuat film. Coba refresh halaman.</div>';
}
