let introClosed = false;
        const introVideo = document.getElementById("introVideo");
        const soundButton = document.getElementById("soundButton");

        let isMuted = false;

        function updateSoundButton(){
            if(introVideo.muted){
                soundButton.textContent = "🔇";
                soundButton.setAttribute("aria-label", "Aktifkan suara");
                soundButton.setAttribute("title", "Aktifkan suara");
            }else{
                soundButton.textContent = "🔊";
                soundButton.setAttribute("aria-label", "Matikan suara");
                soundButton.setAttribute("title", "Matikan suara");
            }
        }

        // Video baru dimulai setelah tombol START pada splash screen diklik.
        introVideo.muted = false;
        introVideo.volume = 1;
        updateSoundButton();

        // Tombol speaker
        soundButton.addEventListener("click", function(){

            if(introVideo.muted){

                // AKTIFKAN SUARA
                introVideo.muted = false;
                introVideo.volume = 1;
                isMuted = false;

            }else{

                // MATIKAN SUARA
                introVideo.muted = true;
                introVideo.volume = 0;
                isMuted = true;

            }

            updateSoundButton();

            if(introVideo.paused){
                introVideo.play();
            }
        });

        updateSoundButton();

        introVideo.addEventListener("play", function(){
            setBackgroundMusicDucked(true);
        });
        introVideo.addEventListener("pause", function(){
            setBackgroundMusicDucked(false);
        });
