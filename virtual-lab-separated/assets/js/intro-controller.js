(function(){

    const introScreen = document.getElementById("introVideoScreen");
    const introVideo = document.getElementById("introVideo");
    const skipButton = document.getElementById("skipIntroButton");

    const welcomeScreen = document.getElementById("welcomeScreen");
    const welcomeAudio = document.getElementById("welcomeAudio");

    let introClosed = false;


    // ==========================================
    // VIDEO SELESAI / SKIP -> MASUK WORKSHOP
    // ==========================================

    function finishIntro(){
        if(introClosed) return;
        introClosed = true;

        introVideo.pause();
        setBackgroundMusicDucked(false);
        introScreen.classList.add("is-hidden");
        introScreen.style.display = "none";

        // Masuk ke ruang workshop seperti alur sebelumnya.
        if (typeof window.enterLab === "function") {
            window.enterLab();
        }
    }

    // ==========================================
    // VIDEO SELESAI
    // ==========================================

    introVideo.addEventListener(
        "ended",
        finishIntro
    );


    // ==========================================
    // VIDEO ERROR
    // ==========================================

    introVideo.addEventListener(
        "error",
        finishIntro
    );


    // ==========================================
    // SKIP VIDEO
    // ==========================================

    skipButton.addEventListener(
        "click",
        finishIntro
    );

    // Dipanggil saat tombol KELUAR ditekan agar video tidak melanjutkan dari posisi lama.
    window.resetIntroVideo = function(){
        introClosed = false;
        if (introVideo) {
            introVideo.pause();
            introVideo.currentTime = 0;
            introVideo.muted = false;
            introVideo.volume = 1;
        }
        if (introScreen) {
            introScreen.classList.add("is-hidden");
            introScreen.style.display = "none";
        }
    };

})();
