const movies = [
    { title: 'Kafir: Bersekutu dengan Setan', poster: 'https://via.placeholder.com/300x400/ff0000/000?text=Kafir', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Ratu Ilmu Hitam', poster: 'https://via.placeholder.com/300x400/ff0000/000?text=Ratu+Hitam', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Asih', poster: 'https://via.placeholder.com/300x400/ff0000/000?text=Asih', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { title: 'Sunyi', poster: 'https://via.placeholder.com/300x400/ff0000/000?text=Sunyi', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    // Tambah film lain di sini
];

const moviesGrid = document.getElementById('movies');
const searchInput = document.getElementById('search');
const modal = document.querySelector('.player-modal');
const player = document.getElementById('player');
const closeBtn = document.querySelector('.close-btn');

// Render film
function renderMovies(films) {
    moviesGrid.innerHTML = '';
    films.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
            </div>
        `;
        card.onclick = () => playMovie(movie.video);
        moviesGrid.appendChild(card);
    });
}

// Cari film
searchInput.oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = movies.filter(m => m.title.toLowerCase().includes(query));
    renderMovies(filtered);
};

// Player modal
function playMovie(url) {
    player.src = url;
    modal.classList.add('active');
}

closeBtn.onclick = () => {
    modal.classList.remove('active');
    player.src = '';
};

// Inisialisasi
renderMovies(movies);
