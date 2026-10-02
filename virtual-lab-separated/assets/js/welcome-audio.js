const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeAudio = document.getElementById("welcomeAudio");
const backgroundMusic = document.getElementById("backgroundMusic");

const BACKSOUND_NORMAL_VOLUME = 0.5;
const BACKSOUND_DUCKED_VOLUME = 0.05;
const FOREGROUND_AUDIO_VOLUME = 1;

function setBackgroundMusicDucked(isDucked){
    if (!backgroundMusic) return;
    backgroundMusic.volume = isDucked
        ? BACKSOUND_DUCKED_VOLUME
        : BACKSOUND_NORMAL_VOLUME;
}

function playBackgroundMusic(){
    if (!backgroundMusic) return;
    setBackgroundMusicDucked(false);
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(function(error){
        console.warn("Autoplay backsound diblokir browser:", error);
    });
}

playBackgroundMusic();
document.addEventListener("pointerdown", function(){
    playBackgroundMusic();

    // Browser desktop sering memblokir autoplay audio bersuara.
    // Gesture pertama pengguna menjadi fallback untuk audio welcome.
    if (
        welcomeAudio &&
        welcomeScreen &&
        welcomeScreen.classList.contains("is-visible") &&
        welcomeAudio.paused &&
        welcomeAudio.currentTime === 0
    ) {
        welcomeAudio.muted = false;
        welcomeAudio.volume = FOREGROUND_AUDIO_VOLUME;
        welcomeAudio.play().catch(function(error){
            console.warn("Audio welcome menunggu interaksi pengguna:", error);
        });
    }
}, { once: true, capture: true });

// Coba putar audio splash otomatis saat halaman pertama kali dibuka.
if (welcomeAudio) {
    welcomeAudio.autoplay = true;
    welcomeAudio.muted = false;
    welcomeAudio.volume = FOREGROUND_AUDIO_VOLUME;
    welcomeAudio.addEventListener("play", function(){
        setBackgroundMusicDucked(true);
    });
    welcomeAudio.addEventListener("pause", function(){
        setBackgroundMusicDucked(false);
    });
    welcomeAudio.addEventListener("ended", function(){
        setBackgroundMusicDucked(false);
    });
    welcomeAudio.play().catch(function(error){
        console.warn("Autoplay audio splash diblokir browser:", error);
    });
}

window.startIntroVideo = function(){
    const welcome = document.getElementById("welcomeScreen");
    const introScreen = document.getElementById("introVideoScreen");
    const introVideo = document.getElementById("introVideo");

    if (!welcome || !introScreen || !introVideo) return;

    // Saat START diklik, suara welcome dimatikan dan tidak diputar ulang.
    if (welcomeAudio) {
        welcomeAudio.pause();
        welcomeAudio.currentTime = 0;
        welcomeAudio.muted = true;
        welcomeAudio.volume = 0;
    }

    // Backsound mengecil selama video pembuka berjalan.
    setBackgroundMusicDucked(true);

    welcome.classList.remove("is-visible");
    welcome.style.display = "none";
    introScreen.style.display = "flex";
    introScreen.classList.remove("is-hidden");
    introVideo.currentTime = 0;
    introVideo.muted = false;
    introVideo.volume = FOREGROUND_AUDIO_VOLUME;
    introVideo.volume = 1;
    introVideo.play().catch(function(error){
        console.warn("Video menunggu interaksi pengguna:", error);
    });
};

async function showWelcomeScreen(playAudio = true) {

    // tampilkan welcome
    welcomeScreen.classList.add("show");

    if (!playAudio) {
        return;
    }

    try {

        welcomeAudio.pause();
        welcomeAudio.currentTime = 0;
        welcomeAudio.volume = FOREGROUND_AUDIO_VOLUME;
        welcomeAudio.volume = 1;
        welcomeAudio.muted = false;

        await welcomeAudio.play();

        console.log("✅ AUDIO WELCOME BERHASIL DIPUTAR");

    } catch (error) {

        console.warn("⚠️ Audio autoplay diblokir:", error);

    }
}


/*
|--------------------------------------------------------------------------
| Saat tombol Mulai Eksplorasi diklik
|--------------------------------------------------------------------------
*/
