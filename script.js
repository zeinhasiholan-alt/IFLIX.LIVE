// TMDB API Configuration
const TMDB_API_KEY = window.TMDB_API_KEY || '0f8b58ff4ee8782a2a19b5e09a368c66';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Genre TMDB IDs
const genreMap = {
    horor: 27,
    komedi: 35,
    romantis: 10749,
    drama: 18
};

document.addEventListener('DOMContentLoaded', async () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Load default tab (Horor)
    await loadMovies('horor', 27);
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const tabId = btn.dataset.tab;
            const genreId = btn.dataset.genre;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Load movies for this genre
            if (genreId !== 'bollywood') {
                await loadMovies(tabId, genreId);
            } else {
                await loadBollywoodMovies();
            }
        });
    });

    // Video modal
    setupModal();
});

// Load movies by genre from TMDB
async function loadMovies(tabId, genreId) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=id-ID&page=1`
        );
        const data = await response.json();
        
        displayMovies(data.results, tabId);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Special Bollywood search
async function loadBollywoodMovies() {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=bollywood&language=en-US&page=1`
        );
        const data = await response.json();
        displayMovies(data.results, 'bollywood');
    } catch (error) {
        console.error('Error loading Bollywood:', error);
    }
}

// Display movies in grid
function displayMovies(movies, tabId) {
    const grid = document.getElementById(`${tabId}-grid`);
    grid.innerHTML = '';
    
    movies.slice(0, 12).forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

// Create movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.video = getTrailerUrl(movie.id);
    card.innerHTML = `
        <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" loading="lazy">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.release_date?.slice(0,4) || 'N/A'}</p>
        </div>
        <div class="play-overlay">▶</div>
    `;
    return card;
}

// Get YouTube trailer (placeholder - bisa diupgrade ke YouTube API)
function getTrailerUrl(movieId) {
    // Contoh trailer ID - ganti dengan YouTube Data API untuk real trailer
    const trailerIds = ['dQw4w9WgXcQ', '9bZkp7q19f0', '2Vv-BfVoq4g'];
    return `https://www.youtube.com/embed/${trailerIds[Math.floor(Math.random() * trailerIds.length)]}`;
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.querySelector('.close');
    const cards = document.querySelectorAll('.movie-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            modalVideo.src = card.dataset.video;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.style.display = 'none';
        modalVideo.src = '';
        document.body.style.overflow = 'auto';
    }
}
