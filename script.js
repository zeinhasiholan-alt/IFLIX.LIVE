const CATS = {
    horror: { label: 'Horror', emoji: '👻', color: '#e63946', bg: 'rgba(230,57,70,0.18)' },
    drakor: { label: 'Drakor', emoji: '🎭', color: '#a855f7', bg: 'rgba(168,85,247,0.18)' },
    romantis: { label: 'Romantis', emoji: '💕', color: '#ec4899', bg: 'rgba(236,72,153,0.18)' },
    sinema: { label: 'Sinema Spesial', emoji: '🏆', color: '#f4a261', bg: 'rgba(244,162,97,0.18)' },
    kartun: { label: 'Kartun Anak', emoji: '🧸', color: '#2ec4b6', bg: 'rgba(46,196,182,0.18)' },
    bollywood: { label: 'Bollywood', emoji: '💃', color: '#f59e0b', bg: 'rgba(245,158,11,0.18)' },
};

const DEVS = { 'admin': 'Sv@2024!xZ', 'streamdev': 'Dev#9981@ok' };

const SAMPLE = [
    { id: 1, title: 'Rumah Kosong', cat: 'horror', desc: 'Horror karya Iman Firman', dur: '1j 42m', views: 15420, file: null },
    { id: 3, title: 'Crash Landing on You', cat: 'drakor', desc: 'Kisah romantis', dur: '1j 15m', views: 88540, file: null }
];

let videos = [...SAMPLE];
let nextId = 100;
let isDev = false, devName = '';
let currentFilter = 'all';
let selectedFile = null;

// --- Auth Functions ---
function doLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    if (DEVS[u] && DEVS[u] === p) {
        isDev = true; devName = u;
        document.getElementById('devBar').classList.add('show');
        document.getElementById('devUser').textContent = u;
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('uploadBtn').style.display = 'flex';
        closeModal('loginModal');
        showToast('✅ Selamat datang, ' + u, 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logoutDev() {
    isDev = false;
    document.getElementById('devBar').classList.remove('show');
    document.getElementById('loginBtn').style.display = 'flex';
    document.getElementById('uploadBtn').style.display = 'none';
    showToast('👋 Berhasil keluar', '');
}

// --- UI Controls ---
function openLogin() { document.getElementById('loginModal').classList.add('open'); }
function openUpload() { document.getElementById('uploadModal').classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// --- Render Logic ---
function renderContent() {
    const cont = document.getElementById('mainContent');
    let list = videos;
    if (currentFilter !== 'all') list = list.filter(v => v.cat === currentFilter);
    
    let html = `<div class="video-grid">`;
    html += list.map(v => {
        const info = CATS[v.cat] || {};
        return `
            <div class="video-card" onclick="playVideo(${v.id})">
                <div class="thumb">
                    <span class="cat-badge" style="background:${info.bg};color:${info.color};">${info.label}</span>
                </div>
                <div style="padding:10px">
                    <div style="font-size:0.8rem; font-weight:bold">${v.title}</div>
                    <div style="font-size:0.7rem; color:gray">👁️ ${v.views.toLocaleString()}</div>
                </div>
            </div>`;
    }).join('');
    cont.innerHTML = html + `</div>`;
}

function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast show ' + type;
    setTimeout(() => t.className = 'toast', 3000);
}

// Init
renderContent();
