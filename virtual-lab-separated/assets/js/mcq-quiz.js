function stopWorkshopSpeech() {
        stopWorkshopAudio();
    }


(function(){
  let index=0, score=0, locked=false, mcqStartedAt=0;
  let questions=[];
  const fallbackImage = obj => obj && (obj.image || (obj.images && obj.images.front));
  const allTools = () => Object.values(window.rackData || {}).flatMap(r => (r.tools || []).map(t => ({...t, rack:r.name})));
  function makeQuestions(){
    const pool = allTools().filter(t => fallbackImage(t) && t.name);
    const unique = pool.filter((t,i,a)=>a.findIndex(x=>x.name.toLowerCase()===t.name.toLowerCase())===i);
    return unique.sort(()=>Math.random()-.5).slice(0,20).map((tool,i)=>{
      const distractors = unique.filter(x=>x.name!==tool.name).sort(()=>Math.random()-.5).slice(0,3).map(x=>x.name);
      const answers = [tool.name,...distractors].sort(()=>Math.random()-.5);
      const showImage = i % 2 === 0;
      return { q:showImage ? `Alat apakah yang ditunjukkan pada gambar ini?` : `Manakah nama alat yang tepat berdasarkan materi workshop?`, image:showImage ? fallbackImage(tool) : null, a:answers, c:answers.indexOf(tool.name), tool:tool.name };
    });
  }
  window.speakToolName = function(name){
    if(!name) return;
    //playWorkshopAudio(name);
  };
  window.speakToolNameIndonesian = window.speakToolName;
  window.showSceneInstruction = function(title, text) {
    const scene = document.getElementById("scene");

    if (!scene) {
        return;
    }

    let box = document.getElementById("sceneInstruction");

    if (!box) {
        box = document.createElement("div");
        box.id = "sceneInstruction";
        box.className = "scene-instruction";
        scene.appendChild(box);
    }

    box.innerHTML = `
        <button
            type="button"
            class="scene-instruction-close"
            aria-label="Tutup instruksi">
            ×
        </button>

        <strong>📌 ${title}</strong>
        ${text}
    `;

    const closeButton = box.querySelector(".scene-instruction-close");

    closeButton.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        box.remove();
    };
};

  window.openMCQ=function(){ stopWorkshopEducation(); index=0; score=0; locked=false; mcqStartedAt=Date.now(); questions=makeQuestions(); document.getElementById('mcqModal').classList.add('show'); renderMCQ(); };
  window.closeMCQ=function(){ document.getElementById('mcqModal').classList.remove('show'); locked=false; };
  function renderMCQ(){
    const item=questions[index]; document.getElementById('mcqProgress').textContent='Pertanyaan '+(index+1)+' dari '+questions.length+' • Skor '+score;
    document.getElementById('mcqQuestion').textContent=item.q; const imageWrap=document.getElementById('mcqImageWrap'); const image=document.getElementById('mcqImage'); imageWrap.hidden=!item.image; if(item.image){image.src=item.image; image.alt=item.tool;}
    const wrap=document.getElementById('mcqOptions'); wrap.innerHTML=''; item.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='mcq-option';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.onclick=()=>answerMCQ(i,b);wrap.appendChild(b);}); document.getElementById('mcqFeedback').textContent='Pilih satu jawaban yang paling tepat.';
  }
  function answerMCQ(choice,button){ if(locked)return; locked=true; const item=questions[index]; document.querySelectorAll('.mcq-option').forEach((b,i)=>{b.disabled=true;if(i===item.c)b.classList.add('correct');}); if(choice===item.c){score++;document.getElementById('mcqFeedback').textContent='Benar!';}else{button.classList.add('wrong');document.getElementById('mcqFeedback').textContent='Belum tepat. Jawaban benar: '+item.a[item.c];} setTimeout(()=>{index++;locked=false;if(index<questions.length)renderMCQ();else finishMCQ();},900); }
  function finishMCQ(){ document.getElementById('mcqModal').classList.remove('show'); window.quizResult={benar:score,salah:questions.length-score,total:questions.length,nilai:Math.round(score/questions.length*100),jenis:'pilihan-ganda',durasi_detik:Math.round((Date.now()-mcqStartedAt)/1000)}; document.getElementById('summaryCorrect').textContent=score;document.getElementById('summaryWrong').textContent=questions.length-score;document.getElementById('summaryTotal').textContent=questions.length;document.getElementById('summaryPercentage').textContent=window.quizResult.nilai+'%'; document.getElementById('quizSummaryModal').classList.add('show'); setupRatingDnD(); }
  function setupRatingDnD(){ document.querySelectorAll('.rating-emoji').forEach(b=>{b.draggable=true;b.ondragstart=e=>{e.dataTransfer.setData('rating',b.dataset.rating);b.classList.add('dragging');};b.ondragend=()=>b.classList.remove('dragging');b.onclick=()=>selectRating(b.dataset.rating);}); const zone=document.getElementById('ratingDropZone'); zone.ondragover=e=>{e.preventDefault();zone.classList.add('active');};zone.ondragleave=()=>zone.classList.remove('active');zone.ondrop=e=>{e.preventDefault();zone.classList.remove('active');selectRating(e.dataTransfer.getData('rating'));}; }
  function selectRating(value){ if(!value)return; selectedQuizRating=Number(value); const b=document.querySelector(`.rating-emoji[data-rating="${value}"]`);document.querySelectorAll('.rating-emoji').forEach(x=>x.classList.remove('selected'));if(b)b.classList.add('selected');const zone=document.getElementById('ratingDropZone');zone.classList.add('filled');zone.textContent='Emoticon dipilih: '+b.textContent;document.getElementById('ratingText').textContent=({1:'Sangat tidak puas',2:'Kurang puas',3:'Cukup',4:'Puas',5:'Sangat puas'})[value]; }
  window.saveQuizResult = async function(){ if(!window.quizResult){alert('Hasil kuis belum tersedia.');return;} const rating=document.querySelector('.rating-emoji.selected')?.dataset.rating||''; const payload={...window.quizResult,rating,refleksi:document.getElementById('ratingText')?.textContent||'',timestamp:new Date().toISOString()}; try{await fetch(typeof GOOGLE_SHEET_URL!=='undefined'?GOOGLE_SHEET_URL:'',{method:'POST',mode:'no-cors',body:JSON.stringify(payload)});alert('Hasil kuis berhasil dikirim ke spreadsheet.');document.getElementById('quizSummaryModal').classList.remove('show');}catch(e){console.error(e);alert('Gagal mengirim hasil ke spreadsheet.');} };
  

    window.goHome = function(){

        // KELUAR menghapus hasil REFLEKSI yang tersimpan di browser.
        try {
            localStorage.removeItem("k3ReflectionResult");
            sessionStorage.removeItem("k3ReflectionResult");
        } catch (error) {
            console.warn("Data REFLEKSI tidak dapat dihapus:", error);
        }
        if (window.clearReflectionResult) window.clearReflectionResult();

        if (typeof stopWorkshopAudio === "function") stopWorkshopAudio();

        // Tutup semua modal
        document
            .querySelectorAll('.modal,.mcq-modal,#quizModal,#quizSummaryModal,#k3QuizModal')
            .forEach(m => m.classList.remove('show'));

        // Sembunyikan trolley actions
        const actions = document.getElementById('trolleyActions');
        if (actions) {
            actions.classList.remove('show');
        }

        // Hentikan dan reset video pembuka sebelum kembali ke welcome screen.
        if (typeof window.resetIntroVideo === "function") {
            window.resetIntroVideo();
        } else {
            const introVideo = document.getElementById("introVideo");
            if (introVideo) {
                introVideo.pause();
                introVideo.currentTime = 0;
            }
        }

        // Tampilkan kembali Welcome Screen
        const welcome = document.getElementById('welcomeScreen');

        welcome.style.opacity = '1';
        welcome.style.display = 'flex';
        welcome.classList.add('is-visible');

        // PLAY AUDIO WELCOME DARI AWAL
        const welcomeAudio = document.getElementById('welcomeAudio');

        if (welcomeAudio) {
            welcomeAudio.pause();
            welcomeAudio.currentTime = 0;
            welcomeAudio.muted = false;
            welcomeAudio.volume = 1;

            welcomeAudio.play().catch(error => {
                console.warn('Audio welcome tidak dapat diputar:', error);
            });
        }

    };
})();
