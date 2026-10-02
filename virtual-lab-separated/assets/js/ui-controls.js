const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mainInfoMenu = document.getElementById("mainInfoMenu");

if(mobileMenuToggle && mainInfoMenu){
    mobileMenuToggle.addEventListener("click", function(){
        const isOpen = mainInfoMenu.classList.toggle("menu-open");
        mobileMenuToggle.classList.toggle("menu-open", isOpen);
        mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
        mobileMenuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
        mobileMenuToggle.querySelector(".mobile-menu-label").textContent = isOpen ? "TUTUP" : "MENU";
    });

    mainInfoMenu.addEventListener("click", function(event){
        if(event.target.closest("button:not(#mobileMenuToggle)")){
            mainInfoMenu.classList.remove("menu-open");
            mobileMenuToggle.classList.remove("menu-open");
            mobileMenuToggle.setAttribute("aria-expanded", "false");
            mobileMenuToggle.setAttribute("aria-label", "Buka menu");
            mobileMenuToggle.querySelector(".mobile-menu-label").textContent = "MENU";
        }
    });
}

window.toggleFullscreen = function(){
    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen().catch(error=>{
            console.error("Gagal fullscreen:",error);
        });
    }else{
        document.exitFullscreen();
    }
};

document.addEventListener("fullscreenchange",function(){
    const button = document.getElementById("fullscreenButton");

    if(!button) return;

    if(document.fullscreenElement){
        button.textContent = "✕ KELUAR FULLSCREEN";
    }else{
        button.textContent = "⛶ FULLSCREEN";
    }
});
