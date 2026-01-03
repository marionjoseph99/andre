// Define global callback for Spotify API
window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('spotify-embed');
    const options = {
        uri: 'spotify:playlist:7CspcavoDY3lf7DFLrYwEJ',
        width: '100%',
        height: '352',
        theme: 'light' // Optional, matches the aesthetic better
    };
    
    const callback = (EmbedController) => {
        EmbedController.addListener('playback_update', e => {
            // If Spotify is playing (isPaused is false), pause BGM
            // If Spotify is paused (isPaused is true), play BGM
            if (e.data.isPaused) {
                // Only resume if we are not already playing to avoid loops/errors
                // But playAudio handles state check internally or we can check here
                // We want to "automatically turn on"
                playAudio();
            } else {
                pauseAudio();
            }
        });
    };
    
    IFrameAPI.createController(element, options, callback);
};

// Main script logic
const audio = document.getElementById('bgm-audio');
const toggleBtn = document.getElementById('bgm-toggle');
const icon = toggleBtn.querySelector('i');
const label = toggleBtn.querySelector('span');
let isPlaying = false;

// Set default volume to 50%
audio.volume = 0.5;

const setState = (playing) => {
    isPlaying = playing;
    label.textContent = playing ? 'Music On' : 'Music Off';
    icon.classList.toggle('fa-volume-high', playing);
    icon.classList.toggle('fa-volume-xmark', !playing);
    toggleBtn.classList.toggle('bg-rose-100', playing);
    toggleBtn.classList.toggle('text-rose-600', playing);
};

const playAudio = async () => {
    // If already playing, don't do anything (avoids promise interruption errors)
    if (!audio.paused) {
        setState(true);
        return;
    }
    
    try {
        await audio.play();
        setState(true);
    } catch (err) {
        console.warn('Playback was blocked until user interaction', err);
        setState(false);
    }
};

const pauseAudio = () => {
    audio.pause();
    setState(false);
};

toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
        playAudio();
    } else {
        pauseAudio();
    }
});

// Try to start music on page load
playAudio();

// --- Floating Hearts Effect ---
const effectsContainer = document.getElementById('effects-container');

const spawnHeart = () => {
    if (!effectsContainer) return;

    const heart = document.createElement('i');
    // Using FontAwesome heart icon
    heart.className = 'fa-solid fa-heart floating-heart';
    
    // Randomize appearance
    const size = 10 + Math.random() * 20; // 10px - 30px
    const startLeft = Math.random() * 100; // 0-100vw
    const duration = 10 + Math.random() * 15; // 10s - 25s (slow and gentle)
    
    // Randomize color (various shades of pink/red)
    const colors = ['text-rose-300', 'text-rose-400', 'text-pink-300', 'text-pink-400', 'text-red-300'];
    heart.classList.add(colors[Math.floor(Math.random() * colors.length)]);

    heart.style.left = `${startLeft}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    
    effectsContainer.appendChild(heart);

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
};

// Spawn hearts periodically
setInterval(spawnHeart, 800);
// Start with some hearts
for(let i=0; i<15; i++) {
    setTimeout(spawnHeart, i * 200);
}

// Inject Spotify IFrame API script
const script = document.createElement('script');
script.src = "https://open.spotify.com/embed/iframe-api/v1";
script.async = true;
document.body.appendChild(script);

// --- 25 Reasons Generator ---
const reasonsGrid = document.getElementById('reasons-grid');
// EDIT HERE: Add your own 25 reasons!
const reasons = [
    "Your kindness",
    "The way you make me laugh",
    "Your warm hugs",
    "How you support my dreams",
    "Your beautiful smile",
    "The way you listen",
    "Your patience",
    "Our late night talks",
    "Your sense of humor",
    "How safe I feel with you",
    "Your passion",
    "The way you look at me",
    "Your cooking (especially nuggets!)",
    "How hard you work",
    "Your gentle heart",
    "The way you hold my hand",
    "Your honesty",
    "How you cheer me up",
    "Your intelligence",
    "Our inside jokes",
    "Your adventurous spirit",
    "How much you care",
    "Your voice",
    "The memories we share",
    "Just being you"
];

let revealedCount = 0;

if (reasonsGrid) {
    reasons.forEach((reason, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white/60 p-4 rounded-xl border border-rose-200 text-center hover:bg-rose-50 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] cursor-pointer shadow-sm hover:shadow-md select-none';
        
        // Initial content
        card.innerHTML = `
            <div class="transition-all duration-300 transform">
                <span class="font-handwriting text-4xl text-rose-400 block mb-2">#${index + 1}</span>
                <span class="text-xs text-rose-300 uppercase tracking-widest font-bold">Tap to Reveal</span>
            </div>
        `;

        card.addEventListener('click', function() {
            // If already revealed, do nothing
            if (this.classList.contains('revealed')) return;
            
            this.classList.add('revealed');
            revealedCount++;
            
            // Visual change for the card background
            this.classList.remove('bg-white/60', 'hover:bg-rose-50');
            this.classList.add('bg-rose-100', 'border-rose-300', 'scale-105');
            
            // Change content with a fade effect
            this.innerHTML = `
                <div class="fade-in">
                    <p class="text-gray-800 font-medium text-sm leading-relaxed">${reason}</p>
                </div>
            `;
            
            // Remove scale effect after a moment so it settles
            setTimeout(() => {
                this.classList.remove('scale-105');
            }, 200);

            // Spawn mini hearts burst
            const rect = this.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            
            for(let i=0; i<8; i++) {
                const heart = document.createElement('i');
                heart.className = 'fa-solid fa-heart fixed text-rose-500 z-50 pointer-events-none';
                heart.style.left = center.x + 'px';
                heart.style.top = center.y + 'px';
                heart.style.fontSize = (12 + Math.random() * 12) + 'px';
                heart.style.transform = `translate(-50%, -50%)`;
                
                document.body.appendChild(heart);
                
                // Random direction
                const angle = Math.random() * Math.PI * 2;
                const velocity = 60 + Math.random() * 60;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity - 60; // Tend upwards
                
                const animation = heart.animate([
                    { transform: `translate(-50%, -50%) scale(0)`, opacity: 0 },
                    { transform: `translate(calc(-50% + ${tx * 0.5}px), calc(-50% + ${ty * 0.5}px)) scale(1.2)`, opacity: 1, offset: 0.4 },
                    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 800 + Math.random() * 400,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                });
                
                animation.onfinish = () => heart.remove();
            }

            // Check if all cards are revealed
            if (revealedCount === reasons.length) {
                setTimeout(showBirthdaySurprise, 800);
            }
        });

        reasonsGrid.appendChild(card);
    });
}

function showBirthdaySurprise() {
    const container = reasonsGrid.parentElement;
    
    // Fade out grid
    reasonsGrid.style.transition = 'opacity 0.5s ease-out';
    reasonsGrid.style.opacity = '0';
    
    setTimeout(() => {
        reasonsGrid.style.display = 'none';
        
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = 'text-center fade-in p-8';
        messageDiv.innerHTML = `
            <div class="mb-6 animate-bounce">
                <i class="fa-solid fa-cake-candles text-6xl text-rose-500"></i>
            </div>
            <h2 class="font-handwriting text-5xl text-rose-600 mb-6">Happy 25th Birthday, Andre!</h2>
            <p class="text-xl text-gray-700 leading-relaxed font-body mb-8">
                You've unlocked all the reasons why I love you, but the truth is, 
                there are infinite reasons. Here's to 25 years of you, and to all 
                the beautiful years ahead of us. I love you so much!
            </p>
            <div class="flex justify-center gap-4">
                <i class="fa-solid fa-heart text-rose-400 text-2xl animate-pulse"></i>
                <i class="fa-solid fa-heart text-rose-400 text-2xl animate-pulse" style="animation-delay: 0.2s"></i>
                <i class="fa-solid fa-heart text-rose-400 text-2xl animate-pulse" style="animation-delay: 0.4s"></i>
            </div>
        `;
        
        container.appendChild(messageDiv);
    }, 500);
}