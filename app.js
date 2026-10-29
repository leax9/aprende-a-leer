// Base de datos de palabras. Usa emojis temporalmente, pero puedes cambiar el 'img' por 'gato.png' en el futuro
const wordData = [
  { id: 1, img: "🐱", es: { word: "gato", syllables: ["ga", "to"] }, ca: { word: "gat", syllables: ["gat"] } },
  { id: 2, img: "🐶", es: { word: "perro", syllables: ["pe", "rro"] }, ca: { word: "gos", syllables: ["gos"] } },
  { id: 3, img: "🦆", es: { word: "pato", syllables: ["pa", "to"] }, ca: { word: "ànec", syllables: ["à", "nec"] } },
  { id: 4, img: "🐮", es: { word: "vaca", syllables: ["va", "ca"] }, ca: { word: "vaca", syllables: ["va", "ca"] } },
  { id: 5, img: "🐸", es: { word: "rana", syllables: ["ra", "na"] }, ca: { word: "granota", syllables: ["gra", "no", "ta"] } },
  { id: 6, img: "🐒", es: { word: "mono", syllables: ["mo", "no"] }, ca: { word: "mico", syllables: ["mi", "co"] } },
  { id: 7, img: "🦁", es: { word: "león", syllables: ["le", "ón"] }, ca: { word: "lleó", syllables: ["lle", "ó"] } },
  { id: 8, img: "🐻", es: { word: "oso", syllables: ["o", "so"] }, ca: { word: "ós", syllables: ["ós"] } },
  { id: 9, img: "🐷", es: { word: "cerdo", syllables: ["cer", "do"] }, ca: { word: "porc", syllables: ["porc"] } },
  { id: 10, img: "🦊", es: { word: "zorro", syllables: ["zo", "rro"] }, ca: { word: "guineu", syllables: ["gui", "neu"] } },
  { id: 11, img: "🐭", es: { word: "ratón", syllables: ["ra", "tón"] }, ca: { word: "ratolí", syllables: ["ra", "to", "lí"] } },
  { id: 12, img: "🦉", es: { word: "búho", syllables: ["bú", "ho"] }, ca: { word: "mussol", syllables: ["mus", "sol"] } },
  { id: 13, img: "🍎", es: { word: "manzana", syllables: ["man", "za", "na"] }, ca: { word: "poma", syllables: ["po", "ma"] } },
  { id: 14, img: "🌙", es: { word: "luna", syllables: ["lu", "na"] }, ca: { word: "lluna", syllables: ["llu", "na"] } },
  { id: 15, img: "☀️", es: { word: "sol", syllables: ["sol"] }, ca: { word: "sol", syllables: ["sol"] } }
];

let currentSessionWords = [];
let currentWordIndex = 0;
let currentLang = 'es';
let totalStars = parseInt(localStorage.getItem('nil_reading_stars')) || 0;
let expectedSyllables = [];
let placedSyllables = [];

// DOM Elements
const screens = {
    setup: document.getElementById('setup-screen'),
    game: document.getElementById('game-screen'),
    reward: document.getElementById('reward-screen')
};

const ui = {
    totalStars: document.getElementById('total-stars-display'),
    lang: document.getElementById('lang-select'),
    wordCount: document.getElementById('word-count'),
    startBtn: document.getElementById('start-btn'),
    backBtn: document.getElementById('back-btn'),
    homeBtn: document.getElementById('home-btn'),
    progressBar: document.getElementById('progress-bar'),
    currentIdxTxt: document.getElementById('current-word-idx'),
    totalIdxTxt: document.getElementById('total-words-idx'),
    imageBox: document.getElementById('image-container'),
    slotsContainer: document.getElementById('target-slots'),
    syllablesContainer: document.getElementById('available-syllables'),
    playAudioBtn: document.getElementById('play-audio-btn'),
    earnedStars: document.getElementById('earned-stars')
};

// Initialize
ui.totalStars.innerText = totalStars;

// Helper: Barajar array sin repetidos (Fisher-Yates)
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Reproducción de voz (Web Speech API)
function speak(text, langCode) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode === 'es' ? 'es-ES' : 'ca-ES';
        utterance.rate = 0.85; // Velocidad amigable para niños
        window.speechSynthesis.speak(utterance);
    }
}

// Flow Control
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

ui.startBtn.addEventListener('click', () => {
    currentLang = ui.lang.value;
    const count = parseInt(ui.wordCount.value);
    
    // Filtramos para asegurar que tengamos palabras y las barajamos
    let availableWords = wordData.filter(item => item[currentLang] !== undefined);
    currentSessionWords = shuffleArray(availableWords).slice(0, count);
    currentWordIndex = 0;
    
    ui.totalIdxTxt.innerText = currentSessionWords.length;
    showScreen('game');
    loadWord();
});

ui.backBtn.addEventListener('click', () => {
    showScreen('setup');
    ui.totalStars.innerText = totalStars;
});

ui.homeBtn.addEventListener('click', () => {
    showScreen('setup');
    ui.totalStars.innerText = totalStars;
});

ui.playAudioBtn.addEventListener('click', () => {
    const wordObj = currentSessionWords[currentWordIndex][currentLang];
    speak(wordObj.word, currentLang);
});

function loadWord() {
    placedSyllables = [];
    const currentData = currentSessionWords[currentWordIndex];
    const wordObj = currentData[currentLang];
    expectedSyllables = wordObj.syllables;

    ui.currentIdxTxt.innerText = currentWordIndex + 1;
    ui.progressBar.style.width = `${(currentWordIndex / currentSessionWords.length) * 100}%`;
    
    // Si usas imágenes reales: ui.imageBox.innerHTML = `<img src="${currentData.img}" width="150" />`;
    ui.imageBox.innerText = currentData.img; 

    // Crear Slots (espacios vacíos)
    ui.slotsContainer.innerHTML = '';
    expectedSyllables.forEach(() => {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        ui.slotsContainer.appendChild(slot);
    });

    // Crear Sílabas desordenadas
    ui.syllablesContainer.innerHTML = '';
    const shuffledSyllables = shuffleArray(expectedSyllables);
    
    shuffledSyllables.forEach(syl => {
        const btn = document.createElement('div');
        btn.classList.add('syllable');
        btn.innerText = syl;
        btn.addEventListener('click', () => handleSyllableClick(btn, syl));
        ui.syllablesContainer.appendChild(btn);
    });

    // Leer la palabra al cargar la pantalla (opcional)
    setTimeout(() => speak(wordObj.word, currentLang), 500);
}

function handleSyllableClick(btn, syl) {
    if (btn.classList.contains('hidden')) return;
    
    // Reproducir sonido de la sílaba al tocarla
    speak(syl, currentLang);

    const currentSlotIndex = placedSyllables.length;
    if (currentSlotIndex >= expectedSyllables.length) return;

    // Verificar si ha tocado la sílaba correcta para ese espacio
    if (syl === expectedSyllables[currentSlotIndex]) {
        // Acierto
        btn.classList.add('hidden');
        placedSyllables.push(syl);
        
        const slots = document.querySelectorAll('.slot');
        slots[currentSlotIndex].innerText = syl;
        slots[currentSlotIndex].classList.add('filled');

        // ¿Palabra terminada?
        if (placedSyllables.length === expectedSyllables.length) {
            setTimeout(wordCompleted, 800);
        }
    } else {
        // Fallo: animamos rojo y vibramos levemente
        btn.style.transform = 'scale(0.9)';
        btn.style.backgroundColor = '#f44336';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 400);
    }
}

function wordCompleted() {
    // Refuerzo positivo leyendo la palabra entera
    const wordObj = currentSessionWords[currentWordIndex][currentLang];
    speak(wordObj.word, currentLang);

    currentWordIndex++;
    ui.progressBar.style.width = `${(currentWordIndex / currentSessionWords.length) * 100}%`;
    
    if (currentWordIndex >= currentSessionWords.length) {
        setTimeout(endSession, 1500);
    } else {
        setTimeout(loadWord, 1500);
    }
}

function endSession() {
    const earned = currentSessionWords.length;
    totalStars += earned;
    localStorage.setItem('nil_reading_stars', totalStars);
    
    ui.earnedStars.innerText = earned;
    ui.progressBar.style.width = '100%';
    
    showScreen('reward');
}

// Registrar Service Worker para PWA (Offline)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Error en Service Worker', err);
        });
    });
}
