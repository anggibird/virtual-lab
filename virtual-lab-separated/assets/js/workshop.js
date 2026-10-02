import * as THREE from "three";

import {
    OrbitControls
}
from
"three/addons/controls/OrbitControls.js";


/* =====================================================
   GLOBAL
===================================================== */

let scene;
let camera;
let renderer;
let controls;
let trolley;
let rack8 = null;
let drawers=[];
let clickableDrawers=[];
let drawerBusy=false;
let activeDrawer=1;
let raycaster=
    new THREE.Raycaster();
let mouse=
    new THREE.Vector2();


/* TOOL VIEWER */

let toolScene;
let toolCamera;
let toolRenderer;
let toolControls;
let toolObject;
let currentTool;

let toolPhotoElement = null;
let photoRotation = 0;
let photoScale = 1;

let currentSpeech = null;
let isSpeaking = false;


/* =====================================================
   RAK DATA
===================================================== */

const rackData = {

    /* =========================================
       RAK 1
    ========================================= */
    1:{
        name: "Hand Tools — Wrench & Socket",
        description:
            "Koleksi berbagai kunci tangan, kunci L, kunci pas, kunci ring, serta perlengkapan socket untuk pekerjaan mekanik, perawatan mesin, dan otomotif.",
        image: "assets/rack-01.jpg",

        tools: [
            {
                name: "Kunci Pas",
                image: "assets/rack-01-pas.png",
                voiceNameLang: "id-ID",
                description:
                    "Kunci dengan kepala terbuka berbentuk U yang digunakan untuk memutar mur dan baut.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan mur atau baut, terutama pada area yang mudah dijangkau dan membutuhkan pemasangan alat secara cepat."
            },
            {
                name: "Kunci Nipel",
                image: "assets/rack-01-nipel.png",
                voiceNameLang: "id-ID",
                description:
                    "Kunci khusus dengan bentuk kepala yang dirancang untuk mencengkeram dan memutar mur nipel pada sambungan pipa.",
                fungsi:
                    "Digunakan untuk memasang dan melepas mur nipel pada sistem rem, saluran hidrolik, pipa bahan bakar, dan sambungan pipa lainnya."
            },
            {
                name: "Kunci Kombinasi Pas Ring",
                image: "assets/rack-01-kombinasiPasRing.png",
                voiceNameLang: "id-ID",
                description:
                    "Kunci dengan dua jenis kepala dalam satu alat, yaitu sisi pas terbuka dan sisi ring tertutup dengan ukuran yang sama.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan mur atau baut. Sisi pas cocok untuk akses cepat, sedangkan sisi ring memberikan cengkeraman yang lebih kuat."
            },
            {
                name: "Kunci Ring",
                image: "assets/rack-01-ring.png",
                voiceNameLang: "id-ID",
                description:
                    "Kunci dengan kepala tertutup berbentuk cincin yang mencengkeram sisi mur atau baut secara menyeluruh.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan mur atau baut dengan cengkeraman yang lebih kuat serta mengurangi risiko selip atau kerusakan pada kepala baut."
            },
            {
                name: "Kunci L Bintang",
                image: "assets/rack-01-L-bintang.png",
                voiceNameLang: "id-ID",
                description:
                    "Kunci berbentuk L dengan ujung kepala bintang atau Torx yang dirancang untuk baut berkepala bintang.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut Torx pada kendaraan, mesin, perangkat elektronik, dan berbagai peralatan mekanik."
            },
            {
                name: "Kunci L Hexagonal",
                image: "assets/rack-01-L-hexa.png",

                voiceNameLang: "id-ID",
                description:
                    "Kunci berbentuk L dengan ujung hexagonal yang digunakan pada baut berkepala segi enam bagian dalam.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut imbus atau baut hexagonal pada furnitur, sepeda, mesin, dan peralatan mekanik."
            },
            {
                name: "Socket Impact Driver",
                image: "assets/rack-01-socket-impact-driver.png",

                voiceNameLang: "id-ID",
                description:
                    "Socket khusus yang dirancang untuk digunakan bersama impact driver atau impact wrench.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut atau mur dengan bantuan tenaga putar dan hentakan dari alat impact."
            },
            {
                name: "Socket Mata Bintang",
                image: "assets/rack-01-socket-mata-bintang.png",

                voiceNameLang: "id-ID",
                description:
                    "Socket dengan ujung mata bintang atau Torx untuk baut berkepala bintang.",
                fungsi:
                    "Digunakan bersama ratchet atau handle socket untuk membuka dan mengencangkan baut Torx pada kendaraan, mesin, dan peralatan lainnya."
            },
            {
                name: "Socket Mata Hexagonal",
                image: "assets/rack-01-socket-mata-hexagonal.png",

                voiceNameLang: "id-ID",
                description:
                    "Socket dengan ujung berbentuk hexagonal yang sesuai untuk mur atau baut berkepala segi enam.",
                fungsi:
                    "Digunakan bersama ratchet atau kunci socket untuk membuka dan mengencangkan mur atau baut dengan lebih cepat dan kuat."
            },
            {
                name: "Socket Mata Hexagonal Panjang",
                image: "assets/rack-01-socket-mata-hexagonal-panjang.png",

                voiceNameLang: "id-ID",
                description:
                    "Socket hexagonal dengan bentuk yang lebih panjang untuk menjangkau mur atau baut yang berada di area cekung atau memiliki ulir panjang.",
                fungsi:
                    "Digunakan untuk membuka dan mengencangkan mur atau baut yang sulit dijangkau menggunakan socket standar."
            },
            {
                name: "Socket Ratchet Handle",
                image: "assets/rack-01-socket-ratchet-handle.png",
                description:
                    "Batang pegangan tangan yang dilengkapi mekanisme roda gigi searah.",
                fungsi:
                    "Digunakan untuk mengencangkan atau mengendurkan mur/baut jauh lebih cepat di ruang terbatas tanpa mengangkat kepala soket dari baut."
            },
            {
                name: "Socket Sambungan Fleksibel Kunci",
                image: "assets/rack-01-socket-sambungan-fleksibel-kunci.png",
                voiceNameLang: "id-ID",
                description:
                    "Sambungan socket fleksibel yang memungkinkan kunci atau ratchet digunakan pada sudut yang tidak lurus.",
                fungsi:
                    "Digunakan untuk menjangkau mur dan baut di area sempit, miring, atau sulit diakses dengan sambungan socket biasa."
            },
            {
                name: "Socket Sambungan Rigid Kunci",
                image: "assets/rack-01-socket-sambungan-rigid-kunci.png",
                voiceNameLang: "id-ID",
                description:
                    "Sambungan socket kaku atau rigid yang berfungsi sebagai perpanjangan antara ratchet dan socket.",
                fungsi:
                    "Digunakan untuk memperpanjang jangkauan kunci socket agar dapat mencapai mur atau baut yang berada lebih dalam atau sulit dijangkau."
            },
            {
                name: "Socket Set Mata Obeng",
                image: "assets/rack-01-socket-set-mata-obeng.png",
                voiceNameLang: "id-ID",
                description:
                    "Set mata obeng berbentuk socket dengan berbagai jenis dan ukuran ujung untuk mengencangkan atau melepas sekrup.",
                fungsi:
                    "Digunakan bersama ratchet, handle socket, atau adaptor untuk membuka dan mengencangkan berbagai jenis sekrup dengan lebih praktis."
            },
            {
                name: "Socket Sliding Handle",
                image: "assets/rack-01-socket-sliding-handle.png",
                description:
                    "Handle socket berbentuk batang geser yang dapat diposisikan sesuai kebutuhan untuk menghasilkan torsi dan jangkauan yang lebih baik.",
                fungsi:
                    "Digunakan bersama socket untuk membuka dan mengencangkan mur atau baut. Posisi batang dapat digeser agar lebih mudah digunakan pada ruang sempit atau saat membutuhkan torsi lebih besar."
            }
        ]
    },

    /* =========================================
       RAK 2
    ========================================= */
    2:{
        name:"Hand Tools — Pliers, Hammer & Screwdriver",
        description:
        "Berbagai peralatan tangan untuk menjepit, memotong, memukul, membuka, dan mengencangkan komponen pada pekerjaan mekanik dan otomotif.",
        image:"assets/rack-02.jpg",

        tools:[

                {
                    name:"Kunci Inggris",
                    image:"assets/rack-02-Kunci-Inggris.png",
                    voiceNameLang: "id-ID",
                    description:
                    "Kunci dengan rahang yang dapat disetel untuk menyesuaikan ukuran mur atau baut.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan berbagai ukuran mur atau baut dengan satu alat yang dapat disesuaikan."
                },

                {
                    name:"Obeng Minus (-)",
                    image:"assets/rack-02-Obeng-Min.png",
                    voiceNameLang: "id-ID",
                    description:
                    "Obeng dengan ujung pipih dan lurus yang dirancang untuk sekrup dengan alur tunggal.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan sekrup berkepala minus pada komponen kendaraan dan peralatan mekanik."
                },

                {
                    name:"Obeng Plus (+)",
                    image:"assets/rack-02-Obeng-Plus.png",
                    voiceNameLang: "id-ID",
                    description:
                    "Obeng dengan ujung berbentuk silang yang dirancang untuk sekrup berkepala Phillips.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan sekrup plus pada berbagai komponen kendaraan dan peralatan mekanik."
                },

                {
                    name:"Palu Cakar",
                    image:"assets/rack-02-Palu-Cakar.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Palu dengan satu sisi kepala untuk memukul dan sisi lainnya berbentuk cakar untuk mencabut atau menarik benda.",
                    fungsi:
                    "Digunakan untuk pekerjaan pemukulan serta membantu mencabut paku atau benda yang tertanam pada material."
                },

                {
                    name:"Palu Godam",
                    image:"assets/rack-02-Palu-Godam.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Palu berukuran besar dengan kepala berat yang dirancang untuk menghasilkan gaya pukulan yang kuat.",
                    fungsi:
                    "Digunakan untuk pekerjaan berat seperti memberikan pukulan kuat pada komponen, pembongkaran, dan pekerjaan mekanik tertentu."
                },

                {
                    name:"Palu Karet",
                    image:"assets/rack-02-Palu-Karet.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Palu dengan kepala berbahan karet yang menghasilkan pukulan lebih lembut dibandingkan palu berbahan logam.",
                    fungsi:
                    "Digunakan untuk memukul atau memasang komponen tanpa mudah merusak, menggores, atau meninggalkan bekas pada permukaannya."
                },

                {
                    name:"Palu Konde",
                    image:"assets/rack-02-Palu-Konde.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Palu dengan satu sisi kepala datar dan sisi lainnya berbentuk bulat seperti bola.",
                    fungsi:
                    "Digunakan untuk membentuk, meratakan, dan memberikan pukulan pada komponen logam dalam pekerjaan mekanik."
                },

                {
                    name:"Palu Tembaga",
                    image:"assets/rack-02-Palu-Tembaga.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Palu dengan kepala berbahan tembaga yang lebih lunak dibandingkan baja sehingga menghasilkan pukulan yang lebih aman pada permukaan logam.",
                    fungsi:
                    "Digunakan untuk memberikan pukulan pada komponen logam yang membutuhkan gaya tetapi harus mengurangi risiko kerusakan atau bekas pukulan."
                },

                {
                    name:"Tang Snap Ring Bengkok Buka",
                    image:"assets/rack-02-SnapRing-Bengkok-Buka.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang snap ring dengan ujung bengkok yang dirancang untuk membuka snap ring atau circlip eksternal.",
                    fungsi:
                    "Digunakan untuk melepas snap ring eksternal pada poros atau komponen dengan posisi yang sulit dijangkau."
                },

                {
                    name:"Tang Snap Ring Bengkok Tutup",
                    image:"assets/rack-02-SnapRing-Bengkok-Tutup.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang snap ring dengan ujung bengkok yang digunakan untuk memasang snap ring dengan mekanisme penjepitan khusus.",
                    fungsi:
                    "Digunakan untuk memasang snap ring pada poros atau komponen yang membutuhkan akses dari sudut tertentu."
                },

                {
                    name:"Tang Snap Ring Lurus Buka",
                    image:"assets/rack-02-SnapRing-Lurus-Buka.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang snap ring dengan ujung lurus yang dirancang untuk membuka snap ring atau circlip eksternal.",
                    fungsi:
                    "Digunakan untuk melepas snap ring eksternal pada poros dan komponen otomotif."
                },

                {
                    name:"Tang Snap Ring Lurus Tutup",
                    image:"assets/rack-02-SnapRing-Lurus-Tutup.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang snap ring dengan ujung lurus yang digunakan untuk memasang snap ring pada komponen dengan akses lurus.",
                    fungsi:
                    "Digunakan untuk memasang snap ring pada poros atau komponen otomotif dengan posisi yang mudah dijangkau."
                },

                {
                    name:"Tang Kombinasi",
                    image:"assets/rack-02-Tang-Kombinasi.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang serbaguna dengan rahang penjepit dan bagian pemotong untuk menangani berbagai pekerjaan mekanik.",
                    fungsi:
                    "Digunakan untuk menjepit, memegang, membengkokkan, dan memotong kabel atau kawat berukuran kecil."
                },

                {
                    name:"Tang Lancip",
                    image:"assets/rack-02-Tang-Lancip.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang dengan rahang panjang dan meruncing yang memungkinkan pekerjaan menjepit pada area sempit dan sulit dijangkau.",
                    fungsi:
                    "Digunakan untuk mengambil, menjepit, membengkokkan, atau memegang komponen kecil di ruang yang sempit."
                },

                {
                    name:"Tang Locking Pliers",
                    image:"assets/rack-02-Tang-LockingPliers.png",
                    description:
                    "Tang penjepit dengan mekanisme pengunci yang dapat mempertahankan tekanan pada benda kerja tanpa harus terus ditekan.",
                    fungsi:
                    "Digunakan untuk menjepit dan menahan benda kerja dengan kuat serta membantu membuka atau memutar baut dan komponen tertentu."
                },

                {
                    name:"Tang Potong",
                    image:"assets/rack-02-Tang-Potong.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang dengan rahang pemotong tajam yang dirancang khusus untuk memotong kabel, kawat, dan material kecil.",
                    fungsi:
                    "Digunakan untuk memotong kabel, kawat, dan komponen logam kecil dalam pekerjaan mekanik maupun kelistrikan."
                },

                {
                    name:"Tang Slip Joint",
                    image:"assets/rack-02-Tang-SlipJoin.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Tang dengan posisi engsel yang dapat dipindahkan sehingga lebar rahangnya dapat disesuaikan dengan ukuran benda kerja.",
                    fungsi:
                    "Digunakan untuk menjepit, memegang, dan memutar berbagai ukuran benda atau komponen dengan menyesuaikan bukaan rahangnya."
                }

            ]
    },


    /* =========================================
       RAK 3
    ========================================= */
    3:{
        name:"Power Tools",
        description:
        "Peralatan bertenaga listrik dan baterai yang digunakan untuk mempercepat pekerjaan pembongkaran, pengencangan, pengeboran, dan pekerjaan mekanik lainnya.",
        image:"assets/rack-03.jpg",

        tools:[

                {
                    name:"Mesin Bor Tangan Electric AC",
                    image:"assets/rack-03-hand-drill-elektrik-AC.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Mesin bor tangan dengan sumber tenaga listrik AC yang digunakan untuk melakukan pengeboran pada berbagai jenis material.",
                    fungsi:
                    "Digunakan untuk membuat lubang pada logam, plastik, kayu, dan material lainnya dalam pekerjaan bengkel atau perawatan kendaraan."
                },

                {
                    name:"Mesin Bor Tangan Electric DC",
                    image:"assets/rack-03-hand-drill-elektrik-DC.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Mesin bor tangan bertenaga listrik DC atau baterai yang memberikan mobilitas tinggi tanpa bergantung pada sumber listrik langsung.",
                    fungsi:
                    "Digunakan untuk melakukan pengeboran dan pekerjaan mekanik di area yang membutuhkan alat yang mudah dipindahkan dan digunakan."
                },

                {
                    name:"Impact Wrench Electric",
                    image:"assets/rack-03-impact-wrech-elektrik.png",
                    description:
                    "Impact wrench bertenaga listrik atau baterai yang menghasilkan hentakan torsi tinggi untuk membuka dan mengencangkan baut.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut roda serta baut dengan torsi tinggi pada pekerjaan servis kendaraan."
                },

                {
                    name:"Impact Wrench Pneumatic",
                    image:"assets/rack-03-impact-wrech-pneumatik.png",
                    description:
                    "Impact wrench yang menggunakan tenaga udara bertekanan dari kompresor untuk menghasilkan hentakan torsi tinggi.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut dengan cepat, terutama baut roda dan baut yang membutuhkan torsi besar."
                },

                {
                    name:"Ratchet Electric",
                    image:"assets/rack-03-ratchet-elektrik.png",
                    description:
                    "Kunci ratchet bertenaga listrik atau baterai dengan mekanisme putar otomatis untuk mempercepat proses pelepasan dan pemasangan baut.",
                    fungsi:
                    "Digunakan untuk membuka dan mengencangkan baut pada area yang sempit dengan lebih cepat dan praktis dibandingkan ratchet manual."
                }

            ]
    },

    /* =========================================
       RAK 4
       SPECIAL SERVICE TOOLS
    ========================================= */
    4:{
        name:"Special Service Tools / SST",
        description:
        "Peralatan khusus yang dirancang untuk membantu pembongkaran, pemasangan, penekanan, penarikan, dan penyetelan berbagai komponen otomotif.",
        image:"assets/rack-04.jpg",

        tools:[

                    {
                        name:"Adjustable Hook Spanner Wrench",
                        image:"assets/rack-04-adjustable-hook-spanner-wrench.png",
                        description:
                        "Kunci khusus dengan ujung kait yang dapat disesuaikan untuk memutar mur, retaining ring, atau komponen berbentuk cincin.",
                        fungsi:
                        "Digunakan untuk membuka dan mengencangkan mur penyetel, bearing, serta komponen berbentuk cincin yang membutuhkan kunci kait."
                    },
                    {
                        name:"Bearing Separator and Puller Set",
                        image:"assets/rack-04-bearing-separator-and-puller-set.png",
                        description:
                        "Perangkat khusus yang terdiri dari bearing separator dan puller untuk mencengkeram, memisahkan, dan menarik bearing, pulley, gear, atau komponen yang terpasang rapat pada shaft.",
                        fungsi:
                        "Digunakan untuk melepas bearing, pulley, gear, dan komponen lain dari shaft dengan gaya tarik yang terkontrol tanpa merusak komponen di sekitarnya."
                    },
                    {
                        name:"Disc Brake Caliper Piston Rewind Tool",
                        image:"assets/rack-04-disc-brake caliper-piston-rewind-tool.png",
                        description:
                        "Alat khusus untuk menekan dan memutar kembali piston kaliper rem cakram ke posisi yang sesuai saat melakukan servis rem.",
                        fungsi:
                        "Digunakan untuk mengembalikan posisi piston kaliper saat penggantian brake pad atau perawatan sistem rem cakram."
                    },

                    {
                        name:"Oil Filter Wrench",
                        image:"assets/rack-04-oil-filter-wrench.png",
                        description:
                        "Kunci khusus yang dirancang untuk mencengkeram dan memutar filter oli saat proses pelepasan.",
                        fungsi:
                        "Digunakan untuk melepas filter oli yang terpasang terlalu kuat atau sulit dilepas menggunakan tangan."
                    },

                    {
                        name:"Piston Ring Compressor",
                        image:"assets/rack-04-piston-ring-compressor.png",
                        description:
                        "Alat berbentuk silinder yang digunakan untuk menekan piston ring agar tetap masuk ke dalam alur piston saat piston dipasang ke cylinder.",
                        fungsi:
                        "Digunakan untuk membantu memasukkan piston ke dalam cylinder dengan menjaga piston ring tetap terkompresi dan tidak keluar dari alurnya."
                    },

                    {
                        name:"Piston Ring Expanders",
                        image:"assets/rack-04-Piston-Ring-Expanders.png",
                        description:
                        "Alat khusus untuk membuka atau melebarkan piston ring secara terkontrol saat pemasangan atau pelepasan dari piston.",
                        fungsi:
                        "Digunakan untuk memasang dan melepas piston ring tanpa memberikan tekanan berlebihan yang dapat menyebabkan ring bengkok atau patah."
                    },
                    {
                        name:"Slide Hammer",
                        image:"assets/rack-04-slide-hammer.png",
                        description:
                        "Alat penarik dengan batang geser dan pemberat yang digunakan untuk menghasilkan gaya tarik atau hentakan saat melepas komponen yang sulit dijangkau atau terpasang kuat.",
                        fungsi:
                        "Digunakan untuk menarik bearing, hub, seal, axle, dan komponen lainnya dengan memanfaatkan gaya hentakan dari pemberat geser."
                    },
                    {
                        name:"Tie Rod End Remover",
                        image:"assets/rack-04-TieRodEnd-Remover.png",
                        description:
                        "Alat khusus untuk memisahkan tie rod end dari steering knuckle atau dudukannya dengan gaya tekan yang terkontrol.",
                        fungsi:
                        "Digunakan untuk melepas tie rod end pada pekerjaan servis sistem steering dan suspensi kendaraan tanpa harus memukul langsung komponen."
                    },

                    {
                        name:"Universal Clutch Alignment Tool Kit",
                        image:"assets/rack-04-universal-clutch-alignment-tool-kit.png",
                        description:
                        "Perangkat dengan berbagai ukuran adaptor yang digunakan untuk memusatkan posisi clutch disc terhadap flywheel sebelum pemasangan transmisi.",
                        fungsi:
                        "Digunakan untuk memastikan clutch disc berada tepat di tengah sehingga poros input transmisi dapat masuk dengan mudah saat pemasangan."
                    },

                    {
                        name:"Valve Spring Compressor",
                        image:"assets/rack-04-valve-spring-compressor.png",
                        description:
                        "Alat khusus untuk menekan valve spring sehingga valve retainer dan pengunci katup dapat dilepas atau dipasang dengan aman.",
                        fungsi:
                        "Digunakan saat pembongkaran dan pemasangan katup pada cylinder head, terutama dalam pekerjaan servis dan overhaul mesin."
                    }

                ]
    },


    /* =========================================
       RAK 5
    ========================================= */
    5:{
        name:"Measuring Tools",
        description:
        "Peralatan ukur untuk memeriksa dimensi, celah, diameter, ketebalan, kelurusan, serta memastikan ukuran dan torsi komponen sesuai standar pekerjaan mekanik.",
        image:"assets/rack-05.jpg",

        tools:[

                {
                    name:"Dial Bore Gauge",
                    image:"assets/rack-05-dial-bore-gauge.png",
                    description:
                    "Alat ukur presisi dengan indikator dial yang digunakan untuk mengukur diameter bagian dalam dan mendeteksi perubahan ukuran pada lubang.",
                    fungsi:
                    "Digunakan untuk mengukur diameter dalam cylinder serta memeriksa keausan, ovalitas, dan perubahan ukuran pada komponen mesin."
                },

                {
                    name:"Dial Indicator Stand",
                    image:"assets/rack-05-dial-indikator-stand.png",
                    description:
                    "Dudukan yang digunakan untuk memasang dan menahan dial indicator agar tetap stabil selama proses pengukuran.",
                    fungsi:
                    "Digunakan sebagai penyangga dial indicator untuk memeriksa kerataan, keolengan, run-out, dan pergerakan suatu komponen."
                },

                {
                    name:"Digital Multimeter",
                    image:"assets/rack-05-digital-multimeter.png",
                    description:
                    "Alat ukur elektronik digital yang digunakan untuk mengukur berbagai besaran listrik seperti tegangan, arus, dan resistansi.",
                    fungsi:
                    "Digunakan untuk memeriksa tegangan, hambatan, kontinuitas kabel, serta kondisi rangkaian kelistrikan kendaraan."
                },

                {
                    name:"Feeler Gauge",
                    image:"assets/rack-05-feeler-gauge.png",
                    description:
                    "Sekumpulan bilah logam tipis dengan ketebalan berbeda yang digunakan untuk mengukur celah atau clearance secara presisi.",
                    fungsi:
                    "Digunakan untuk mengukur dan menyetel celah katup, celah busi, serta berbagai celah mekanis pada komponen kendaraan."
                },

                {
                    name:"Kunci Torsi Analog",
                    image:"assets/rack-05-kunci-torsi-analog.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Kunci torsi dengan mekanisme pengaturan dan pembacaan torsi secara analog untuk mengontrol kekuatan pengencangan.",
                    fungsi:
                    "Digunakan untuk mengencangkan baut dan mur sesuai nilai torsi yang ditentukan agar tidak terlalu kencang atau terlalu longgar."
                },

                {
                    name:"Kunci Torsi Analog Dial",
                    image:"assets/rack-05-kunci-torsi-analog-dial.png",
                    voiceNameLang: "id-ID",
                    description:
                    "Kunci torsi yang dilengkapi indikator dial untuk menampilkan besarnya torsi yang diberikan secara langsung saat pengencangan.",
                    fungsi:
                    "Digunakan untuk mengukur dan mengontrol torsi pengencangan baut dan mur sesuai spesifikasi yang diperlukan."
                },

                {
                    name:"Kunci Torsi Digital",
                    image:"assets/rack-05-kunci-torsi-digital.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Kunci torsi elektronik yang dilengkapi layar digital untuk menampilkan nilai torsi dengan pembacaan yang presisi.",
                    fungsi:
                    "Digunakan untuk mengencangkan baut dan mur dengan nilai torsi yang akurat sesuai spesifikasi pabrikan."
                },

                {
                    name:"Micrometer",
                    image:"assets/rack-05-micrometer.png",
                    
                    voiceNameLang: "id-ID",
                    description:
                    "Alat ukur presisi dengan mekanisme spindle dan thimble yang digunakan untuk mengukur dimensi kecil dengan tingkat ketelitian tinggi.",
                    fungsi:
                    "Digunakan untuk mengukur diameter poros, ketebalan komponen, dan dimensi kecil lainnya pada pemeriksaan komponen mesin."
                },

                {
                    name:"Vernier Caliper Analog",
                    image:"assets/rack-05-vernier-caliper-analog.png",
                    description:
                    "Jangka sorong dengan skala utama dan skala nonius yang digunakan untuk mengukur dimensi luar, dimensi dalam, dan kedalaman.",
                    fungsi:
                    "Digunakan untuk mengukur panjang, diameter luar, diameter dalam, ketebalan, dan kedalaman berbagai komponen mekanik."
                },

                {
                    name:"Vernier Caliper Analog Dial",
                    image:"assets/rack-05-vernier-caliper-analog-dial.png",
                    description:
                    "Jangka sorong yang dilengkapi indikator dial untuk menampilkan hasil pengukuran dengan pembacaan yang mudah dan cepat.",
                    fungsi:
                    "Digunakan untuk mengukur diameter luar, diameter dalam, ketebalan, panjang, dan kedalaman berbagai komponen mekanik."
                },

                {
                    name:"Vernier Caliper Digital",
                    image:"assets/rack-05-vernier-caliper-digital.png",
                    
                    description:
                    "Jangka sorong elektronik yang menampilkan hasil pengukuran secara digital pada layar untuk memudahkan pembacaan.",
                    fungsi:
                    "Digunakan untuk mengukur diameter luar, diameter dalam, ketebalan, panjang, dan kedalaman komponen dengan pembacaan yang praktis."
                }

            ]
    },


    /* =========================================
       RAK 6
    ========================================= */
    6:{
        name:"Diagnostic Tools",
        description:
        "Peralatan diagnostik untuk memeriksa kondisi kelistrikan, sistem elektronik, baterai, dan berbagai gangguan pada kendaraan.",
        image:"assets/rack-06.jpg",

        tools:[

                {
                    name:"Battery Tester",
                    image:"assets/rack-06-battery-tester.png",
                    description:
                    "Alat penguji baterai yang digunakan untuk memeriksa kondisi, tegangan, kemampuan starter, dan performa baterai kendaraan.",
                    fungsi:
                    "Digunakan untuk mengetahui kondisi baterai, mendeteksi baterai yang lemah, serta membantu menentukan apakah baterai masih layak digunakan atau perlu diganti."
                },

                {
                    name:"Clamp Ampere",
                    image:"assets/rack-06-clamp-ampere.png",
                    
                    description:
                    "Alat ukur arus listrik yang dilengkapi rahang penjepit untuk mengukur arus pada kabel tanpa harus memutus rangkaian.",
                    fungsi:
                    "Digunakan untuk mengukur konsumsi arus listrik kendaraan, memeriksa beban kelistrikan, dan membantu menemukan gangguan pada sistem kelistrikan."
                },

                {
                    name:"Leak Detector",
                    image:"assets/rack-06-leak-detector.png",
                    
                    description:
                    "Alat pendeteksi kebocoran yang digunakan untuk menemukan adanya kebocoran pada sistem atau komponen kendaraan.",
                    fungsi:
                    "Digunakan untuk membantu menemukan lokasi kebocoran pada sistem AC, vacuum, atau sistem fluida kendaraan sesuai jenis detektor yang digunakan."
                },

                {
                    name:"OBD II Engine Diagnostic Scan Tool",
                    image:"assets/rack-06-OBDII-engine-diagnostic-scan-tools.png",
                    description:
                    "Alat scanner diagnostik yang terhubung ke konektor OBD II kendaraan untuk membaca data dan informasi dari sistem kontrol elektronik.",
                    fungsi:
                    "Digunakan untuk membaca dan menghapus kode kerusakan (DTC), melihat data sensor, serta membantu mendiagnosis gangguan pada sistem elektronik dan mesin kendaraan."
                },

                {
                    name:"Tespen Digital",
                    image:"assets/rack-06-tespen-digital.png",
                    
                    description:
                    "Alat pemeriksa kelistrikan berbentuk pena digital yang digunakan untuk mendeteksi dan memeriksa tegangan listrik pada rangkaian.",
                    fungsi:
                    "Digunakan untuk memeriksa keberadaan tegangan pada kabel, terminal, konektor, atau rangkaian kelistrikan kendaraan."
                }

            ]
    },


    /* =========================================
       RAK 7
    ========================================= */
    7:{
        name:"Exhaust Gas Analyzer",
        description:
        "Peralatan diagnostik untuk mengukur dan menganalisis kandungan gas buang kendaraan sebagai bagian dari pemeriksaan emisi dan kondisi pembakaran mesin.",
        image:"assets/rack-07.jpg",

        tools:[

            {
                name:"Diesel Engine",
                image:"assets/rack-07-exhaust-gas-analyzer-diesel-engine.png",
                description:
                "Alat analisis gas buang yang digunakan untuk mengukur dan memeriksa kandungan emisi dari mesin diesel.",
                fungsi:
                "Digunakan untuk menganalisis gas buang mesin diesel guna membantu memeriksa kualitas pembakaran, kondisi mesin, dan tingkat emisi kendaraan."
            },

            {
                name:"Gasoline Engine",
                image:"assets/rack-07-exhaust-gas-analyzer-gasoline-engine.png",
                description:
                "Alat analisis gas buang yang digunakan untuk mengukur dan memeriksa kandungan emisi dari mesin bensin.",
                fungsi:
                "Digunakan untuk menganalisis gas buang mesin bensin guna membantu memeriksa kualitas pembakaran, sistem bahan bakar, dan tingkat emisi kendaraan."
            }

        ]
    },



    /* =========================================
       RAK 8
    ========================================= */
    8:{
    name:"Pneumatic & Tire Service Tools",
    description:
    "Peralatan untuk pekerjaan servis ban, pengisian udara, pengukuran tekanan ban, dan pekerjaan mekanik yang membutuhkan alat bantu khusus.",
    image:"assets/rack-8-berdiri.jpg",

    tools:[

        {
            name:"Air Gun",
            image:"assets/rack-8-berdiri-air-gun.png",
            description:
            "Alat yang menggunakan udara bertekanan untuk menghasilkan hembusan udara dengan tekanan tinggi.",
            fungsi:
            "Digunakan untuk membersihkan debu, kotoran, serpihan, dan sisa material dari komponen atau area kerja kendaraan."
        },

        {
            name:"Kunci T",
            image:"assets/rack-8-berdiri-kunci-T.png",
            voiceNameLang: "id-ID",
            description:
            "Kunci berbentuk T yang memberikan pegangan dan torsi yang lebih nyaman saat membuka atau mengencangkan baut.",
            fungsi:
            "Digunakan untuk membuka dan mengencangkan baut atau mur dengan lebih cepat dan mudah, terutama pada pekerjaan servis kendaraan."
        },

        {
            name:"Tire Pressure Gauge",
            image:"assets/rack-8-berdiri-tire-pressure-gauge.png",
            description:
            "Alat ukur yang digunakan untuk mengetahui tekanan udara di dalam ban kendaraan.",
            fungsi:
            "Digunakan untuk memeriksa tekanan ban dan memastikan tekanan udara sesuai dengan spesifikasi kendaraan."
        }

    ]
},

};

// Dipakai oleh modul kuis pilihan ganda untuk mengambil nama dan gambar alat.
window.rackData = rackData;

window.enterLab = function(){

    // Menu mobile tidak boleh muncul di video atau welcome screen.
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mainInfoMenu = document.getElementById("mainInfoMenu");
    if(mobileMenuToggle && mainInfoMenu){
        mainInfoMenu.classList.remove("menu-open");
        mobileMenuToggle.classList.remove("menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.setAttribute("aria-label", "Buka menu");
        const label = mobileMenuToggle.querySelector(".mobile-menu-label");
        if(label) label.textContent = "MENU";
    }

    // STOP AUDIO WELCOME
    const welcomeAudio = document.getElementById("welcomeAudio");

    if (welcomeAudio) {
        welcomeAudio.pause();
        welcomeAudio.currentTime = 0;
        welcomeAudio.muted = true;
        welcomeAudio.volume = 0;
    }

    // HILANGKAN WELCOME SCREEN
    const welcome = document.getElementById("welcomeScreen");

    // Hapus status welcome agar menu workshop boleh tampil.
    welcome.classList.remove("is-visible");
    welcome.style.transition = "opacity .5s ease";
    welcome.style.opacity = "0";

    setTimeout(() => {
        welcome.style.display = "none";
    }, 500);

};




/* =====================================================
   GLOBAL
===================================================== */

let trolleyCreated = false;
let workshopInteractionDisabled = false;
const objects = [
     {
        name: "Engine Crane",

        images: {
            top:   "assets/engine_crane_tampak_atas.png",
            front: "assets/engine_crane_tampak_depan.png",
            left:  "assets/engine_crane_tampak_kiri.png",
            right: "assets/engine_crane_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "top",

        description: "Alat angkat portabel yang digunakan di bengkel otomotif untuk melepas, mengangkat, dan memasang kembali mesin kendaraan dengan aman",

        x: 3,
        y: 59,
        width: 8,
        height: 25
    },
    {
        name: "Two Post Lift",

        images: {
            top:   "assets/two_post_lift_tampak_atas.png",
            front: "assets/two_post_lift_tampak_depan.png",
            left:  "assets/two_post_lift_tampak_kiri.png",
            right: "assets/two_post_lift_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "top",
        description: "Alat pengangkat kendaraan yang menggunakan dua tiang vertikal untuk memudahkan mekanik bekerja di bagian kolong mobil",
        x: 8,
        y: 33,
        width: 14,
        height: 12
    },
    {
        name: "Tools Trolley",
        description: "Lemari beroda untuk menyimpan dan mengorganisir berbagai peralatan mekanik agar mudah dibawa dan digunakan saat bekerja.",
        x: 10,
        y: 64,
        width: 7,
        height: 17
    },
    {
        name: "Scissor Lift",
        images: {
            top:   "assets/scissor_lift_tampak_atas.png",
            front: "assets/scissor_lift_tampak_depan.png",
            left:  "assets/scissor_lift_tampak_kiri.png",
            right: "assets/scissor_lift_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "top",

        description: "Mengangkat pekerja, peralatan, atau barang secara vertikal ke ketinggian tertentu menggunakan mekanisme rangka silang menyerupai gunting",
        x: 25,
        y: 60,
        width: 4,
        height: 18
    },
    {
        name: "Tools Trolley",
        description: "Lemari beroda untuk menyimpan dan mengorganisir berbagai peralatan mekanik agar mudah dibawa dan digunakan saat bekerja.",
        x: 29,
        y: 64,
        width: 5,
        height: 21
    },
    {
        name: "Scissor Lift FWA",
        images: {
            top:   "assets/scissor_lift_FWA_tampak_atas.png",
            front: "assets/scissor_lift_FWA_tampak_depan.png",
            left:  "assets/scissor_lift_FWA_tampak_kiri.png",
            right: "assets/scissor_lift_FWA_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "top",
        description: "Untuk mengangkat kendaraan mobil secara vertikal di bengkel guna melakukan penyetelan kesejajaran roda (spooring atau wheel alignment)",
        x: 36,
        y: 72,
        width: 15,
        height: 13
    },
    {
        name: "Spooring FWA",
        images: {
            top:   "assets/fwa_front_wheel_alighment_spooring_atas.png",
            front: "assets/fwa_front_wheel_alighment_spooring_depan.png",
            left:  "assets/fwa_front_wheel_alighment_spooring_kiri.png",
            right: "assets/fwa_front_wheel_alighment_spooring_kanan.png"
        },

        // DEFAULT
        defaultView: "top",

        description: "Spooring FWA (Front Wheel Alignment) adalah menyetel kembali sudut geometri roda depan mobil agar posisinya sejajar dan sesuai dengan standar pabrik",
        x: 42.5,
        y: 38,
        width: 8.7,
        height: 15
    },
    

    {
        name: "AC recycle machine",


        images: {
            top:   "assets/ac_recycle_tampak_atas.png",
            front: "assets/ac_recycle_tampak_depan.png",
            left:  "assets/ac_recycle_tampak_kiri.png",
            right: "assets/ac_recycle_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",

        description: "mengambil, mendaur ulang, dan mengisi kembali refrigerant (freon) pada sistem pendingin AC secara aman dan otomatis",
        x: 53,
        y: 68,
        width: 5,
        height: 16
    },
    {
        name: "Tire Changer Machine",
        images: {
            top:   "assets/tire_changer_tampak_atas.png",
            front: "assets/tire_changer_tampak_depan.png",
            left:  "assets/tire_changer_tampak_kiri.png",
            right: "assets/tire_changer_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "melepas dan memasang ban kendaraan dari velg secara cepat, aman, dan efisien",
        x: 68,
        y: 54,
        width: 6,
        height: 15
    },
    {
        name: "Wheel Balancer Machine",
        images: {
            top:   "assets/wheel_balancer_tampak_atas.png",
            front: "assets/wheel_balancer_tampak_depan.png",
            left:  "assets/wheel_balancer_tampak_kiri.png",
            right: "assets/wheel_balancer_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "membersihkan endapan kotoran, kerak, dan sisa karbon pada lubang serta komponen injektor bahan bakar kendaraan",
        x: 76,
        y: 57,
        width: 6,
        height: 15
    },
    {
        name: "Tools Trolley",
        description: "Lemari beroda untuk menyimpan dan mengorganisir berbagai peralatan mekanik agar mudah dibawa dan digunakan saat bekerja.",
        x: 66,
        y: 68,
        width: 4,
        height: 16
    },
    {
        name: "Injector cleaner machine",
        images: {
            top:   "assets/injector_cleaner_tampak_atas.png",
            front: "assets/injector_cleaner_tampak_depan.png",
            left:  "assets/injector_cleaner_tampak_kiri.png",
            right: "assets/injector_cleaner_tampak_kanan.png"
        },
        description: "membersihkan endapan kotoran, kerak, dan sisa karbon pada lubang serta komponen injektor bahan bakar kendaraan",
        x: 72,
        y: 69,
        width: 4,
        height: 15
    },
    {
        name: "Battery Charger Machine",

        images: {
            top:   "assets/battery_charger_tampak_atas.png",
            front: "assets/battery_charger_tampak_depan.png",
            left:  "assets/battery_charger_tampak_kiri.png",
            right: "assets/battery_charger_tampak_kanan.png"
        },
        description: "mengisi ulang daya baterai atau aki yang kosong dengan cara mengubah arus listrik AC menjadi DC serta mengalirkan arus yang aman dan terkontrol hingga penuh",
        x: 81,
        y: 69,
        width: 4,
        height: 15
    },
    {
        name: "Press Hydraulic Machine",

        images: {
            top:   "assets/hydraulic_pressure_machine_tampak_atas.png",
            front: "assets/hydraulic_pressure_machine_tampak_depan.png",
            left:  "assets/hydraulic_pressure_machine_tampak_kiri.png",
            right: "assets/hydraulic_pressure_machine_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "menghasilkan gaya tekan yang sangat besar untuk membengkokkan, membentuk, meluruskan, atau memadatkan suatu material",
        x: 96,
        y: 60,
        width: 4,
        height: 25
    },
    {
        name: "ATF Changer Machine",

        images: {
            top:   "assets/ac_recycle_tampak_atas.png",
            front: "assets/ac_recycle_tampak_depan.png",
            left:  "assets/ac_recycle_tampak_kiri.png",
            right: "assets/ac_recycle_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "mengganti mata potong atau perkakas secara otomatis tanpa bantuan manual dari operator",
        x: 92,
        y: 65,
        width: 4,
        height: 16
    },
    {
        name: "Tools Trolley",
        description: "Lemari beroda untuk menyimpan dan mengorganisir berbagai peralatan mekanik agar mudah dibawa dan digunakan saat bekerja.",
        x: 89,
        y: 61,
        width: 3,
        height: 15
    },
    {
        name: "Air Compressor Machine",
        images: {
            top:   "assets/air_compressor_tampak_atas.png",
            front: "assets/air_compressor_tampak_depan.png",
            left:  "assets/air_compressor_tampak_kiri.png",
            right: "assets/air_compressor_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "menghasilkan dan menyuplai sumber daya udara bertekanan tinggi untuk berbagai keperluan",
        x: 82,
        y: 60,
        width: 5,
        height: 10
    },
    {
        name: "Dongkrak Hidrolik Jack",
        images: {
            top:   "assets/hydraulic_jack_tampak_atas.png",
            front: "assets/hydraulic_jack_tampak_depan.png",
            left:  "assets/hydraulic_jack_tampak_kiri.png",
            right: "assets/hydraulic_jack_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description:
            "Peralatan pengangkat hidrolik yang digunakan untuk mengangkat kendaraan dari permukaan lantai sehingga bagian bawah kendaraan dapat diakses untuk pemeriksaan, perawatan, atau perbaikan.",

        x: 85,
        y: 70,
        width: 3,
        height: 6
    },    
    {
        name: "Air Hose Reels",

        images: {
            top:   "assets/air_hose_reel_tampak_atas.png",
            front: "assets/air_hose_reel_tampak_depan.png",
            left:  "assets/air_hose_reel_tampak_kiri.png",
            right: "assets/air_hose_reel_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",


        image: "assets/workshop-air-hose-reel.jpg",
        description: "menyimpan, merapikan, dan memudahkan penggunaan selang angin atau air bertekanan agar tidak kusut dan mudah ditarik maupun digulung kembali",
        x: 25,
        y: 30,
        width: 3,
        height: 6
    },
    {
        name: "Air Hose Reels",

        images: {
            top:   "assets/air_hose_reel_tampak_atas.png",
            front: "assets/air_hose_reel_tampak_depan.png",
            left:  "assets/air_hose_reel_tampak_kiri.png",
            right: "assets/air_hose_reel_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "menyimpan, merapikan, dan memudahkan penggunaan selang angin atau air bertekanan agar tidak kusut dan mudah ditarik maupun digulung kembali",
        x: 37.5,
        y: 30,
        width: 3,
        height: 6
    },
    {
        name: "Air Hose Reels",

        images: {
            top:   "assets/air_hose_reel_tampak_atas.png",
            front: "assets/air_hose_reel_tampak_depan.png",
            left:  "assets/air_hose_reel_tampak_kiri.png",
            right: "assets/air_hose_reel_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "menyimpan, merapikan, dan memudahkan penggunaan selang angin atau air bertekanan agar tidak kusut dan mudah ditarik maupun digulung kembali",
        x: 50.5,
        y: 30,
        width: 3,
        height: 6
    },
    {
        name: "Air Hose Reels",

        images: {
            top:   "assets/air_hose_reel_tampak_atas.png",
            front: "assets/air_hose_reel_tampak_depan.png",
            left:  "assets/air_hose_reel_tampak_kiri.png",
            right: "assets/air_hose_reel_tampak_kanan.png"
        },

        // DEFAULT
        defaultView: "front",
        description: "menyimpan, merapikan, dan memudahkan penggunaan selang angin atau air bertekanan agar tidak kusut dan mudah ditarik maupun digulung kembali",
        x: 63.5,
        y: 30,
        width: 3,
        height: 6
    }
];

/* =====================================================
   QUIZ
===================================================== */

const QUIZ_LIMIT = 10;

const GOOGLE_SHEET_URL =
    "https://script.google.com/macros/s/AKfycbxHjYBncWqrPThnXu876D-IOSPWO3GMmiLcWZDZ_f49MntbIezkFLybs5sM0qp1d4auCA/exec";

let quizScore = 0;
let quizWrongCount = 0;
let quizCompleted = 0;
let quizStarted = false;


let quizObjects = [];

function normalizeQuizName(name){
    return (name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

const quizState = {
    answered: new Set()
};

let selectedQuizRating = 0;

document
    .querySelectorAll(".rating-emoji")
    .forEach(button => {

        button.addEventListener(
            "click",
            function(){

                selectedQuizRating =
                    Number(
                        this.dataset.rating
                    );


                document
                    .querySelectorAll(
                        ".rating-emoji"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                const labels = {

                    1: "Sangat tidak puas 😡",

                    2: "Kurang puas 😕",

                    3: "Cukup 😐",

                    4: "Puas 🙂",

                    5: "Sangat puas 😍"

                };


                const ratingText =
                    document.getElementById(
                        "ratingText"
                    );


                if(ratingText){

                    ratingText.textContent =
                        labels[
                            selectedQuizRating
                        ];

                }

            }
        );

    });




/* =========================================
   START QUIZ
========================================= */

window.startQuiz = function(){
    stopWorkshopEducation();

    if(!objects || !objects.length){
        alert("Object quiz belum tersedia.");
        return;
    }

    const trolleyActions =
        document.getElementById("trolleyActions");

    if(trolleyActions){
        trolleyActions.classList.remove("show");
    }

    /* ==============================
       RESET QUIZ
    ============================== */

    quizScore = 0;
    quizWrongCount = 0;
    quizCompleted = 0;

    quizState.answered.clear();

    quizStarted = true;

    /* ==============================
       RESET RATING
    ============================== */

    selectedQuizRating = 0;

    document
        .querySelectorAll(".rating-emoji")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    const ratingText =
        document.getElementById("ratingText");

    if(ratingText){
        ratingText.textContent =
            "Pilih salah satu";
    }

    /* ==============================
       UPDATE SCORE
    ============================== */

    updateQuizScore();

    /* ==============================
       TAMPILKAN QUIZ
    ============================== */

    const quizModal =
        document.getElementById("quizModal");

    if(quizModal){
        quizModal.classList.add("show");
    }

    createQuiz();

};

function stopWorkshopEducation() {

    /* STOP SPEECH */
    if (typeof stopWorkshopAudio === "function") stopWorkshopAudio();

    /* STOP EDUKASI BERURUTAN */
    sequentialRunning = false;

    /* STOP TIMER */
    if (sequentialTimer) {
        clearTimeout(sequentialTimer);
        sequentialTimer = null;
    }

    /* HAPUS CAPTION EDUKASI */
    if (activeEducationCaption) {
        activeEducationCaption.remove();
        activeEducationCaption = null;
    }

    /* HAPUS HIGHLIGHT */
    if (activeHighlight) {
        activeHighlight.remove();
        activeHighlight = null;
    }

    /* HAPUS GARIS */
    if (activeEducationLine) {
        activeEducationLine.remove();
        activeEducationLine = null;
    }
}

// Script kuis berada di luar module dan memanggil fungsi ini dari onclick HTML.
window.stopWorkshopEducation = stopWorkshopEducation;

window.startPengenalan = function(){

    stopWorkshopEducation();

    if (workshopInteractionDisabled) {
        return;
    }


    showSceneInstruction(
        "PENGENALAN ALAT",
        "Amati kotak putih yang muncul. Dengarkan nama dan fungsi alat, lalu tunggu sampai penjelasan berpindah ke alat berikutnya."
    );

    sequentialRunning = true;
    currentObjectIndex = 0;

    showObjectsSequentially();
};

window.startIdentifikasi = function(){

    if (workshopInteractionDisabled) {
        return;
    }

    showSceneInstruction(
        "IDENTIFIKASI ALAT",
        "Klik bagian alat yang ingin dipelajari. Baca fungsi dan gunakan tombol tampilan untuk melihat objek dari beberapa arah."
    );

    /* STOP EDUKASI OTOMATIS */
    sequentialRunning = false;

    /* STOP SUARA */
    if (typeof stopWorkshopAudio === "function") stopWorkshopAudio();

    /* Hentikan timer */
    if (sequentialTimer) {
        clearTimeout(sequentialTimer);
        sequentialTimer = null;
    }

    /* Hapus caption otomatis yang sedang tampil */
    if (activeEducationCaption) {
        activeEducationCaption.remove();
        activeEducationCaption = null;
    }

    /* Hapus kotak highlight otomatis */
    if (activeHighlight) {
        activeHighlight.remove();
        activeHighlight = null;
    }

    /* Hapus garis otomatis */
    if (activeEducationLine) {
        activeEducationLine.remove();
        activeEducationLine = null;
    }

    /* Aktifkan kembali hotspot */
    document.querySelectorAll(".workshop-hotspot").forEach(hotspot => {
        hotspot.style.pointerEvents = "auto";
    });
};

window.startQuiz = function(){

    if(!objects || !objects.length){
        alert("Object quiz belum tersedia.");
        return;
    }

    const trolleyActions =
        document.getElementById("trolleyActions");

    if(trolleyActions){
        trolleyActions.classList.remove("show");
    }

    /* ==============================
       RESET QUIZ
    ============================== */

    quizScore = 0;
    quizWrongCount = 0;
    quizCompleted = 0;

    quizState.answered.clear();

    quizStarted = true;

    /* ==============================
       RESET RATING
    ============================== */

    selectedQuizRating = 0;

    document
        .querySelectorAll(".rating-emoji")
        .forEach(btn => {
            btn.classList.remove("selected");
        });

    const ratingText =
        document.getElementById("ratingText");

    if(ratingText){
        ratingText.textContent =
            "Pilih salah satu";
    }

    /* ==============================
       UPDATE SCORE
    ============================== */

    updateQuizScore();

    /* ==============================
       TAMPILKAN QUIZ
    ============================== */

    const quizModal =
        document.getElementById("quizModal");

    if(quizModal){
        quizModal.classList.add("show");
    }

    createQuiz();

};


/* =========================================
   CREATE QUIZ
========================================= */

function createQuiz(){

    const scene =
        document.getElementById("quizScene");

    const items =
        document.getElementById("quizItems");

    items.innerHTML = "";

    // Tampilkan satu nama saja pada daftar drag meskipun objeknya ada di
    // beberapa lokasi. Area drop tetap dibuat untuk semua objek.
    quizObjects = objects.filter((obj, index, array) => {
        const name = normalizeQuizName(obj.name);

        return array.findIndex(item => {
            return normalizeQuizName(item.name) === name;
        }) === index;
    });

    document
        .querySelectorAll(".quiz-drop")
        .forEach(el => el.remove());


    /* =====================================
       DROP AREA
       SEMUA OBJECT
    ===================================== */

    objects.forEach((obj, index) => {

        const drop =
            document.createElement("div");

        drop.className = "quiz-drop";

        drop.dataset.index = index;

        Object.assign(drop.style, {
            left: obj.x + "%",
            top: obj.y + "%",
            width: obj.width + "%",
            height: obj.height + "%"
        });


        /* ==============================
           DRAG OVER
        ============================== */

        drop.addEventListener(
            "dragover",
            function(event){

                event.preventDefault();

                drop.classList.add("active");

            }
        );


        /* ==============================
           DRAG LEAVE
        ============================== */

        drop.addEventListener(
            "dragleave",
            function(){

                drop.classList.remove("active");

            }
        );


        /* ==============================
           DROP
        ============================== */

        drop.addEventListener(
            "drop",
            function(event){

                event.preventDefault();

                drop.classList.remove("active");


                const draggedIndex =
                    Number(
                        event.dataTransfer
                            .getData("text/plain")
                    );


                checkQuizAnswer(
                    draggedIndex,
                    index,
                    drop
                );

            }
        );

        drop.addEventListener("click", function(event){
            const selectedIndex = window.__quizSelectedIndex;
            if(selectedIndex === undefined || selectedIndex === null) return;

            checkQuizAnswer(
                Number(selectedIndex),
                index,
                drop
            );

            const selectedItem = document.querySelector(
                `.quiz-item[data-index="${selectedIndex}"]`
            );
            selectedItem?.classList.remove("touch-selected");
            window.__quizSelectedIndex = null;
            event.stopPropagation();
        });


        scene.appendChild(drop);

    });


    /* =====================================
       DRAG ITEMS
       SEMUA OBJECT
    ===================================== */

    quizObjects
        .map((obj, index) => ({
            ...obj,
            originalIndex: objects.indexOf(obj)
        }))
        .sort(() => Math.random() - 0.5)
        .forEach(obj => {

            const item =
                document.createElement("div");

            item.className =
                "quiz-item";

            item.draggable = true;

            item.dataset.index =
                obj.originalIndex;

            item.textContent =
                obj.name;


            /* ==============================
               DRAG START
            ============================== */

            item.addEventListener(
                "dragstart",
                function(event){

                    /*
                     * SUDAH DONE
                     * TIDAK BOLEH DRAG
                     */

                    if(
                        item.classList.contains("done")
                    ){

                        event.preventDefault();

                        return;

                    }


                    item.classList.add(
                        "dragging"
                    );


                    event.dataTransfer.setData(
                        "text/plain",
                        obj.originalIndex
                    );

                }
            );


            /* ==============================
               DRAG END
            ============================== */

            item.addEventListener(
                "dragend",
                function(){

                    item.classList.remove(
                        "dragging"
                    );

                }
            );

            /* =========================================
               TOUCH / POINTER DRAG UNTUK HP DAN TABLET
               HTML5 dragstart tidak konsisten pada Safari iOS
               dan beberapa browser Android, jadi gunakan Pointer Events.
            ========================================= */
            let pointerStartX = 0;
            let pointerStartY = 0;
            let pointerMoved = false;

            item.addEventListener("pointerdown", function(event){
                if(item.classList.contains("done")) return;

                pointerStartX = event.clientX;
                pointerStartY = event.clientY;
                pointerMoved = false;

                window.__quizTouchDrag = {
                    index: obj.originalIndex,
                    item,
                    sourceEvent: event
                };

                item.classList.add("dragging", "touch-selected");
                item.setPointerCapture?.(event.pointerId);
                event.preventDefault();
            }, {passive:false});

            item.addEventListener("pointermove", function(event){
                const drag = window.__quizTouchDrag;
                if(!drag || drag.item !== item) return;

                if(Math.hypot(
                    event.clientX - pointerStartX,
                    event.clientY - pointerStartY
                ) > 8){
                    pointerMoved = true;
                }

                document.querySelectorAll(".quiz-drop").forEach(drop => {
                    const rect = drop.getBoundingClientRect();
                    const inside = event.clientX >= rect.left &&
                        event.clientX <= rect.right &&
                        event.clientY >= rect.top &&
                        event.clientY <= rect.bottom;
                    drop.classList.toggle("active", inside);
                });

                if(pointerMoved) event.preventDefault();
            }, {passive:false});

            item.addEventListener("pointerup", function(event){
                const drag = window.__quizTouchDrag;
                if(!drag || drag.item !== item) return;

                const target = document.elementFromPoint(
                    event.clientX,
                    event.clientY
                )?.closest(".quiz-drop");

                document.querySelectorAll(".quiz-drop").forEach(drop => {
                    drop.classList.remove("active");
                });

                item.classList.remove("dragging", "touch-selected");
                window.__quizTouchDrag = null;

                if(target && pointerMoved){
                    checkQuizAnswer(
                        obj.originalIndex,
                        Number(target.dataset.index),
                        target
                    );
                    event.preventDefault();
                }
            }, {passive:false});

            item.addEventListener("pointercancel", function(){
                item.classList.remove("dragging", "touch-selected");
                window.__quizTouchDrag = null;
                document.querySelectorAll(".quiz-drop").forEach(drop => {
                    drop.classList.remove("active");
                });
            });

            /* Fallback paling sederhana: tap item lalu tap area alat. */
            item.addEventListener("click", function(event){
                if(pointerMoved) return;

                document.querySelectorAll(".quiz-item.touch-selected")
                    .forEach(selected => selected.classList.remove("touch-selected"));

                item.classList.add("touch-selected");
                window.__quizSelectedIndex = obj.originalIndex;
                event.stopPropagation();
            });


            items.appendChild(item);

        });

}

/* =====================================================
   CLOSE QUIZ
===================================================== */

window.closeQuiz = function(){

    const quizModal =
        document.getElementById("quizModal");

    if(quizModal){
        quizModal.classList.remove("show");
    }

    /* Hapus area quiz */
    document
        .querySelectorAll(".quiz-drop")
        .forEach(el => el.remove());

    /* Bersihkan daftar item */
    const quizItems =
        document.getElementById("quizItems");

    if(quizItems){
        quizItems.innerHTML = "";
    }

    /* Bersihkan feedback */
    const feedback =
        document.getElementById("quizFeedback");

    if(feedback){
        feedback.className = "";
        feedback.textContent = "";
    }

    /* Reset status quiz */
    quizScore = 0;
    quizCompleted = 0;
    quizStarted = false;

    if(quizState && quizState.answered){
        quizState.answered.clear();
    }

    /* Tampilkan kembali tombol trolley */
    const trolleyActions =
        document.getElementById("trolleyActions");

    if(trolleyActions){
        trolleyActions.classList.add("show");
    }

};
/* =========================================
   CHECK ANSWER
========================================= */

function checkQuizAnswer(
    draggedIndex,
    targetIndex,
    drop
){

    if(quizCompleted >= QUIZ_LIMIT){
        return;
    }

    if(quizState.answered.has(draggedIndex)){
        return;
    }

    const item =
        document.querySelector(
            `.quiz-item[data-index="${draggedIndex}"]`
        );

    quizState.answered.add(draggedIndex);

    // SETIAP DROP = 1 ATTEMPT
    quizCompleted++;

    drop.classList.remove(
        "active",
        "correct",
        "wrong"
    );

    const draggedObject = objects[draggedIndex];
    const targetObject = objects[targetIndex];

    const isSameName = draggedObject && targetObject &&
        normalizeQuizName(draggedObject.name) ===
        normalizeQuizName(targetObject.name);

    if(isSameName){

    quizScore++;

    if(item){
        item.classList.add("done");
        item.draggable = false;
    }

    drop.classList.add("correct");

    showQuizFeedback(
        "✓ BENAR!",
        true
    );

    speakQuizFeedback("Benar!");

}else{

    quizWrongCount++;

    if(item){
        item.classList.add("done");
        item.draggable = false;
    }

    showQuizFeedback(
        "✕ SALAH!",
        false
    );

    speakQuizFeedback("Salah!");
}

    updateQuizScore();

    // ⬇️ TARUH DI SINI
    if(quizCompleted >= QUIZ_LIMIT){

        setTimeout(function(){

            finishQuiz();

        }, 800);

    }

}

function speakQuizFeedback(text){
    // Feedback kuis juga menggunakan MP3; tidak ada lagi SpeechSynthesis.
    playWorkshopAudio({ name: text, audioFile: text.replace(/[!?.]+$/g, "") + ".mp3" });
}


/* =========================================
   SCORE
========================================= */

function updateQuizScore(){

    const correctElement =
        document.getElementById("quizCorrect");

    const wrongElement =
        document.getElementById("quizWrong");

    const totalElement =
        document.getElementById("quizTotal");

    const progressElement =
        document.getElementById("quizProgress");

    if(correctElement){
        correctElement.textContent = quizScore;
    }

    if(wrongElement){
        wrongElement.textContent = quizWrongCount;
    }

    if(totalElement){
        totalElement.textContent =
            quizScore + quizWrongCount;
    }

    if(progressElement){
        progressElement.textContent =
            `${quizScore + quizWrongCount} / ${QUIZ_LIMIT}`;
    }
}


/* =========================================
   FINISH
========================================= */


function finishQuiz(){

    const total =
        quizScore + quizWrongCount;

    const percentage =
        total > 0
            ? Math.round(
                quizScore / total * 100
            )
            : 0;

    window.quizResult = {
        benar: quizScore,
        salah: quizWrongCount,
        total: total,
        nilai: percentage
    };

    document.getElementById("summaryCorrect").textContent =
        quizScore;

    document.getElementById("summaryWrong").textContent =
        quizWrongCount;

    document.getElementById("summaryTotal").textContent =
        total;

    document.getElementById("summaryPercentage").textContent =
        percentage + "%";

    const modal =
        document.getElementById("quizSummaryModal");

    if(modal){
        modal.classList.add("show");
    }

    // Buka modal emote / reflection
    openReflection();
}


/* =========================================
   FEEDBACK
========================================= */

function showQuizFeedback(message, correct){

    const feedback = document.getElementById("quizFeedback");

    if(!feedback) return;

    feedback.textContent = message;

    feedback.className =
        "quiz-feedback " +
        (correct ? "correct" : "wrong");

    requestAnimationFrame(()=>{
        feedback.classList.add("show");
    });

    clearTimeout(window.quizFeedbackTimer);

    window.quizFeedbackTimer = setTimeout(()=>{
        feedback.classList.remove("show");
    },1200);
}


function showQuizSummary(){

    const result = window.quizResult;

    document.getElementById(
        "summaryCorrect"
    ).textContent = result.benar;

    document.getElementById(
        "summaryWrong"
    ).textContent = result.salah;

    document.getElementById(
        "summaryTotal"
    ).textContent = result.total;

    document.getElementById(
        "summaryPercentage"
    ).textContent =
        result.nilai + "%";

    document.getElementById(
        "quizSummaryModal"
    ).classList.add("show");

}

window.saveQuizResult = function(){

    if(!window.quizResult){
        alert("Hasil quiz belum tersedia.");
        return;
    }

    const ratingElement =
        document.querySelector(".rating-emoji.selected");

    const rating =
        ratingElement
            ? ratingElement.dataset.rating
            : "";

    if(!rating){
        alert("Seret dan pilih emoticon terlebih dahulu.");
        return;
    }

    const reflection =
        document.getElementById("ratingText")?.textContent || "";

    const data = {
        benar: window.quizResult.benar,
        salah: window.quizResult.salah,
        total: window.quizResult.total,
        nilai: window.quizResult.nilai,
        rating: rating,
        refleksi: reflection,
        jenis: window.quizResult.jenis || "kuis",
        timestamp: new Date().toISOString()
    };

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors"
    })
    .then(() => {
        alert("Hasil quiz berhasil disimpan.");

        document.getElementById("quizSummaryModal").classList.remove("show");
        document.getElementById("quizModal").classList.remove("show");

        document.querySelector(".controls").style.display = "none";

        if(trolley){
            scene.remove(trolley);
            trolley = null;
        }

        drawers = [];
        clickableDrawers = [];
        trolleyCreated = false;

        document.getElementById("scene").classList.remove("trolley-active");

        document.getElementById("trolleyActions").classList.remove("show");
        document.getElementById("trolleyActions").style.display = "none";

        camera.position.set(9,6,14);
        controls.target.set(0,4.7,0);
        controls.update();
    })
    .catch(error => {

        console.error(
            "Gagal menyimpan hasil:",
            error
        );

        alert("Gagal menyimpan hasil quiz.");

    });
};




let currentObjectIndex = 0;
let sequentialRunning = false;
let sequentialTimer = null;

// Mode pengenalan hanya menampilkan satu objek untuk setiap nama.
// Data objects asli tetap dipertahankan untuk hotspot dan fungsi lainnya.
const introductionObjects = objects.filter((obj, index, array) => {
    const objectName = (obj.name || "").trim().toLowerCase();

    return array.findIndex(item => {
        return (item.name || "").trim().toLowerCase() === objectName;
    }) === index;
});

let activeHighlight = null;
let activeEducationCaption = null;
let activeEducationLine = null;
let activeEducationFadeTimer = null;

function showObjectsSequentially() {

    
    sequentialRunning = true;
    currentObjectIndex = 0;

    showNextObject();

}
/* =====================================================
   AUDIO MP3 SERAGAM
===================================================== */
let workshopAudio = null;
let currentAudioFile = "";

function audioFileCandidates(itemOrName){
    const item = typeof itemOrName === "string" ? { name: itemOrName } : (itemOrName || {});
    const name = String(item.name || "").trim();

    // Nama MP3 harus sama persis dengan nilai `name`.
    // Contoh: name "Engine Crane" -> "./assets/Engine Crane.mp3"
    return name ? ["./assets/voice-workshop/" + name + ".mp3"] : [];
}

function ensureWorkshopAudio(){
    if (!workshopAudio) {
        workshopAudio = document.createElement("audio");
        workshopAudio.id = "workshopMp3Audio";
        workshopAudio.preload = "auto";
        workshopAudio.setAttribute("aria-hidden", "true");
        workshopAudio.style.display = "none";
        document.body.appendChild(workshopAudio);
    }
    return workshopAudio;
}

function stopWorkshopAudio(){
    const audio = ensureWorkshopAudio();
    setBackgroundMusicDucked(false);
    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
    audio.onerror = null;
    currentAudioFile = "";
}

function playWorkshopAudio(itemOrName){
    const candidates = audioFileCandidates(itemOrName);
    if (!candidates.length) return null;

    const audio = ensureWorkshopAudio();
    stopWorkshopAudio();
    setBackgroundMusicDucked(true);
    let candidateIndex = 0;
    const tryNext = () => {
        if (candidateIndex >= candidates.length) {
            console.warn("MP3 tidak ditemukan untuk:", itemOrName?.name || itemOrName, candidates);
            setBackgroundMusicDucked(false);
            audio.onerror = null;
            return;
        }
        const src = candidates[candidateIndex++];
        currentAudioFile = src;
        audio.src = src;
        audio.load();
        audio.play().catch(error => {
            console.warn("MP3 belum dapat diputar:", src, error);
        });
    };
    audio.onerror = tryNext;
    audio.addEventListener("ended", function restoreWorkshopBacksound(){
        setBackgroundMusicDucked(false);
        audio.removeEventListener("ended", restoreWorkshopBacksound);
    });
    tryNext();
    return audio;
}

function speakObjectDescription(obj){
    if(!obj) return null;
    return { audio: playWorkshopAudio(obj), text: obj.description };
}

function showNextObject(){
     if (!sequentialRunning) {
        return;
    }
    if(currentObjectIndex>=introductionObjects.length){
        console.log("Edukasi selesai");
        return;
    }

    const obj=introductionObjects[currentObjectIndex];
    const container=document.querySelector("#scene");

    if(!container){
        console.warn("#scene tidak ditemukan");
        return;
    }

    // Narasi selalu mengambil nama dan deskripsi dari object yang sedang aktif.
    const narration = speakObjectDescription(obj);

    const highlight=document.createElement("div");
    highlight.className="object-highlight";

    Object.assign(highlight.style,{
        position:"absolute",
        left:obj.x+"%",
        top:obj.y+"%",
        width:obj.width+"%",
        height:obj.height+"%",
        border:"2px solid #ffffff",
        borderRadius:"6px",
        boxShadow:"0 0 5px #ffffff,0 0 10px #ffffff,0 0 20px #ffffff,inset 0 0 10px rgba(255,255,255,.6)",
        pointerEvents:"none",
        zIndex:"90",
        opacity:"0",
        transition:"opacity .6s ease"
    });

    const caption=document.createElement("div");
    caption.className="education-caption";
    caption.innerHTML=`
        <div class="caption-title">${obj.name}</div>
        <div class="caption-description">${obj.description}</div>
    `;

    Object.assign(caption.style,{
        position:"absolute",
        left:(obj.x+obj.width/2)+"%",
        top:(obj.y-2)+"%",
        width:"250px",
        padding:"10px 13px",
        color:"#000000",
        background:"#00d9ff",
        border:"2px solid #ffffff",
        borderRadius:"8px",
        boxShadow:"0 0 5px #ffffff,0 0 10px #ffffff,0 0 20px rgba(255,255,255,.9)",
        fontFamily:"Arial,sans-serif",
        fontSize:"12px",
        lineHeight:"1.5",
        pointerEvents:"none",
        zIndex:"100",
        opacity:"0",
        transform:"translate(-50%,-100%) scale(.9)",
        transition:"opacity .6s ease,transform .6s ease"
    });

    const line=document.createElementNS("http://www.w3.org/2000/svg","svg");

    Object.assign(line.style,{
        position:"absolute",
        inset:"0",
        width:"100%",
        height:"100%",
        pointerEvents:"none",
        zIndex:"95",
        overflow:"visible"
    });

    const linePath=document.createElementNS("http://www.w3.org/2000/svg","line");

    linePath.setAttribute("stroke","#ffffff");
    linePath.setAttribute("stroke-width","2");
    linePath.setAttribute("stroke-dasharray","6 5");
    linePath.setAttribute("opacity","0");

    line.appendChild(linePath);

    container.appendChild(highlight);
    container.appendChild(line);
    container.appendChild(caption);
    activeHighlight = highlight;
    activeEducationCaption = caption;
    activeEducationLine = line;


    function updateCaptionLine(){
        const rect=container.getBoundingClientRect();

        const startX=(obj.x+obj.width/2)/100*rect.width;
        const startY=(obj.y+obj.height/2)/100*rect.height;

        const endX=(obj.x+obj.width/2)/100*rect.width;
        const endY=(obj.y-2)/100*rect.height;

        linePath.setAttribute("x1",startX);
        linePath.setAttribute("y1",startY);
        linePath.setAttribute("x2",endX);
        linePath.setAttribute("y2",endY);
    }

    requestAnimationFrame(()=>{
        highlight.style.opacity="1";
        caption.style.opacity="1";
        caption.style.transform="translate(-50%,-100%) scale(1)";
        updateCaptionLine();
        linePath.setAttribute("opacity","1");
    });

    let objectFinished = false;

    const finishObject = () => {
        if(objectFinished) return;
        objectFinished = true;

        if (!sequentialRunning) {
            return;
        }

        highlight.style.opacity="0";
        caption.style.opacity="0";
        linePath.setAttribute("opacity","0");
        caption.style.transform="translate(-50%,-100%) scale(.9)";

        setTimeout(()=>{
            highlight.remove();
            caption.remove();
            line.remove();

            currentObjectIndex++;
            showNextObject();
        },600);
    };

    if(narration && narration.audio){
        // Jangan pindah sebelum MP3 objek selesai diputar.
        narration.audio.onended = () => {
            setTimeout(finishObject, 700);
        };
    }else{
        setTimeout(finishObject, 3000);
    }
}
/* =====================================================
   HOTSPOT WORKSHOP
===================================================== */

function initWorkshopObjectHotspots() {
    const sceneContainer = document.getElementById("scene");

    if (!sceneContainer) {
        console.error("Elemen #scene tidak ditemukan.");
        return;
    }

    sceneContainer.style.position = "relative";

    const annotationLayer = document.createElement("div");
    annotationLayer.id = "annotationLayer";

    Object.assign(annotationLayer.style, {
        position: "absolute",
        inset: "0",
        zIndex: "20",
        pointerEvents: "none"
    });

    sceneContainer.appendChild(annotationLayer);

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
     );

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    Object.assign(svg.style, {
        position: "absolute",
        inset: "0",
        overflow: "visible",
        pointerEvents: "none"
    });

    annotationLayer.appendChild(svg);

    const caption = document.createElement("div");
    caption.id = "workshopCaption";

    Object.assign(caption.style, {
        position: "fixed",
        display: "none",
        zIndex: "100",
        width: "620px",
        maxWidth: "92vw",
        padding: "12px 15px",
        color: "#F1F5F9",
        background: "rgba(8, 20, 35, 0.95)",
        border: "2px solid #35C2FF",
        borderRadius: "12px",
        boxShadow: `0 0 8px rgba(53, 194, 255, 0.35), 0 0 20px rgba(53, 194, 255, 0.18), 0 8px 25px rgba(0, 0, 0, 0.45)`,
        backdropFilter: "blur(8px)",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.5",
        pointerEvents: "auto",
        transform: "translate(-50%, 0)"
    });

    document.body.appendChild(caption);

    objects.forEach((object) => {
        const hotspot = document.createElement("button");

        hotspot.type = "button";
        hotspot.className = "workshop-hotspot";
        hotspot.setAttribute("aria-label", object.name);

        Object.assign(hotspot.style, {
            position: "absolute",
            left: `${object.x}%`,
            top: `${object.y}%`,
            width: `${object.width}%`,
            height: `${object.height}%`,
            padding: "0",
            border: "2px solid transparent",
            borderRadius: "8px",
            background: "transparent",
            cursor: "pointer",
            pointerEvents: "auto",
            outline: "none"
        });

        hotspot.addEventListener("mouseenter", () => {
            hotspot.style.border = "2px solid rgba(53, 194, 255, 0.95)";
            hotspot.style.boxShadow = "0 0 0 2px rgba(53, 194, 255, 0.25)";
        });

        hotspot.addEventListener("mouseleave", () => {
            hotspot.style.border = "2px solid transparent";
            hotspot.style.boxShadow = "none";
        });

        hotspot.addEventListener("click", (event) => {
            hotspot.blur();

            /* =========================================
               WORKSHOP SUDAH DINONAKTIFKAN
               ========================================= */
            if (workshopInteractionDisabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            event.stopPropagation();

            // Nama objek dibaca dengan logat Inggris, lalu deskripsi
            // dibaca dengan logat Indonesia menggunakan voice pria.
            speakObjectDescription(object);

            // STOP edukasi otomatis
            sequentialRunning = false;

            // Hentikan timer
            if (sequentialTimer) {
                clearTimeout(sequentialTimer);
                sequentialTimer = null;
            }

            // Hapus caption otomatis yang sedang tampil
            if (activeEducationCaption) {
                activeEducationCaption.remove();
                activeEducationCaption = null;
            }

            // Hapus kotak highlight otomatis
            if (activeHighlight) {
                activeHighlight.remove();
                activeHighlight = null;
            }

            // Hapus garis otomatis
            if (activeEducationLine) {
                activeEducationLine.remove();
                activeEducationLine = null;
            }


            /* createTrolley hanya berjalan saat Tool Trolley diklik */
            if (
                object.name.toLowerCase().includes("tools trolley") &&
                !trolleyCreated
            ) {
                /* HIDE CAPTION */
                caption.style.display = "none";

                /* HIDE GARIS */
                svg.innerHTML = "";

                /* STOP EDUKASI OTOMATIS */
                sequentialRunning = false;

                if (sequentialTimer) {
                    clearTimeout(sequentialTimer);
                    sequentialTimer = null;
                }

                /* HAPUS ELEMEN EDUKASI */
                if (activeEducationCaption) {
                    activeEducationCaption.remove();
                    activeEducationCaption = null;
                }

                if (activeHighlight) {
                    activeHighlight.remove();
                    activeHighlight = null;
                }

                if (activeEducationLine) {
                    activeEducationLine.remove();
                    activeEducationLine = null;
                }

                /* DISABLE SEMUA INTERAKSI WORKSHOP */
                workshopInteractionDisabled = true;

                document.querySelectorAll(".workshop-hotspot").forEach(hotspot => {
                    hotspot.style.pointerEvents = "none";
                });

                /* BUAT TROLLEY */
                createTrolley();
                trolleyCreated = true;

                /* JANGAN LANJUT KE KODE CAPTION */
                return;
            }

            const sceneRect = sceneContainer.getBoundingClientRect();
            const hotspotRect = hotspot.getBoundingClientRect();

            const startX =
                hotspotRect.left - sceneRect.left + hotspotRect.width / 2;

            const startY =
                hotspotRect.top - sceneRect.top + hotspotRect.height / 2;

            const captionX = window.innerWidth / 2;
            const captionY = 20;

            caption.innerHTML = `
                ${
                    object.image || object.images
                        ? `
                            <div class="object-view-image-frame">
                                <img
                                    src="${
                                        object.images?.[object.defaultView || "top"] ||
                                        object.image || ""
                                    }"
                                    data-object-view-image
                                    alt="${object.name}"
                                >
                            </div>
                        `
                        : ""
                }

                ${
                    object.images
                        ? `
                            <div class="object-view-buttons" aria-label="Pilih tampilan objek" style="display:block !important;text-align: center;">
                                ${[
                                    ["top", "Atas"],
                                    ["front", "Depan"],
                                    ["left", "Kiri"],
                                    ["right", "Kanan"]
                                ].map(([view, label]) => object.images[view]
                                    ? `<button type="button" class="object-view-button" data-object-view="${view}">${label}</button>`
                                    : "").join("")}
                            </div>
                        `
                        : ""
                }

                <strong style="
                    display:block;
                    color:#ffffff;
                    font-size:22px;
                    margin:50px 0px 10px 0px;
                ">
                    ${object.name}
                </strong>

                <span style="font-size:18px;">${object.description}</span>
            `;

            if (object.image || object.images) {
                const image = caption.querySelector("[data-object-view-image]");
                const defaultView = object.defaultView || "top";
                let imageScale = 1;
                let imageRotation = 0;

                const updateObjectImageTransform = () => {
                    if (image) {
                        image.style.transform =
                            `rotate(${imageRotation}deg) scale(${imageScale})`;
                    }
                };

                if (image) {
                    image.style.transformOrigin = "center center";
                    image.style.transition = "transform .2s ease";
                    image.style.cursor = "zoom-in";
                    image.title = "Klik gambar untuk memperbesar; klik lagi untuk mengecilkan";
                    image.setAttribute("role", "button");
                    image.setAttribute("tabindex", "0");

                    const openImageLightbox = event => {
                        event.preventDefault();
                        event.stopPropagation();

                        let lightbox = document.getElementById("objectImageLightbox");
                        if (!lightbox) {
                            lightbox = document.createElement("div");
                            lightbox.id = "objectImageLightbox";
                            lightbox.setAttribute("role", "dialog");
                            lightbox.setAttribute("aria-modal", "true");
                            lightbox.setAttribute("aria-label", "Tampilan gambar diperbesar");
                            lightbox.innerHTML = `
                                <button id="objectImageLightboxClose" type="button" aria-label="Tutup gambar">×</button>
                                <img alt="">
                            `;
                            document.body.appendChild(lightbox);

                            const closeLightbox = () => {
                                lightbox.classList.remove("show");
                                lightbox.querySelector("img").classList.remove("is-zoomed");
                                document.body.style.overflow = "";
                            };

                            lightbox.addEventListener("click", event => {
                                if (event.target === lightbox) closeLightbox();
                            });
                            lightbox.querySelector("#objectImageLightboxClose")
                                .addEventListener("click", closeLightbox);
                            lightbox.querySelector("img").addEventListener("click", event => {
                                event.stopPropagation();
                                event.currentTarget.classList.toggle("is-zoomed");
                            });
                            lightbox._close = closeLightbox;
                            document.addEventListener("keydown", event => {
                                if (event.key === "Escape" && lightbox.classList.contains("show")) {
                                    closeLightbox();
                                }
                            });
                        }

                        const lightboxImage = lightbox.querySelector("img");
                        lightboxImage.src = image.currentSrc || image.src;
                        lightboxImage.alt = image.alt || "Gambar objek workshop";
                        lightboxImage.classList.remove("is-zoomed");
                        lightbox.classList.add("show");
                        document.body.style.overflow = "hidden";
                    };

                    image.addEventListener("click", openImageLightbox);
                    image.addEventListener("keydown", event => {
                        if (event.key === "Enter" || event.key === " ") openImageLightbox(event);
                    });
                }

                caption.querySelectorAll("[data-object-zoom]").forEach(button => {
                    button.addEventListener("click", event => {
                        event.stopPropagation();

                        imageScale += button.dataset.objectZoom === "in"
                            ? .15
                            : -.15;

                        imageScale = Math.min(2.5, Math.max(.6, imageScale));

                        updateObjectImageTransform();
                    });
                });

                caption.querySelectorAll("[data-object-rotate]").forEach(button => {
                    button.addEventListener("click", event => {
                        event.stopPropagation();

                        imageRotation += button.dataset.objectRotate === "left"
                            ? -15
                            : 15;

                        updateObjectImageTransform();
                    });
                });

                caption.querySelectorAll("[data-object-reset]").forEach(button => {
                    button.addEventListener("click", event => {
                        event.stopPropagation();
                        imageScale = 1;
                        imageRotation = 0;
                        updateObjectImageTransform();
                    });
                });

                caption.querySelectorAll("[data-object-view]").forEach(button => {
                    button.classList.toggle(
                        "active",
                        button.dataset.objectView === defaultView
                    );

                    button.addEventListener("click", event => {
                        event.stopPropagation();

                        const view = button.dataset.objectView;
                        const imagePath = object.images[view];
                        if (!image || !imagePath) return;

                        image.src = imagePath;
                        caption.querySelectorAll("[data-object-view]").forEach(item => {
                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        });
                    });
                });
            }

            caption.style.top = `${captionY}px`;
            caption.style.display = "block";

            const captionRect = caption.getBoundingClientRect();
            const captionHalfWidth = captionRect.width / 2;
            const captionMargin = 16;
            const safeCaptionX = Math.min(
                window.innerWidth - captionHalfWidth - captionMargin,
                Math.max(captionHalfWidth + captionMargin, captionX)
            );
            caption.style.left = `${safeCaptionX}px`;

            const lineEndX =
                safeCaptionX - sceneRect.left;

            const lineEndY =
                captionY - sceneRect.top;

            svg.innerHTML = `
                <line
                    x1="${startX}"
                    y1="${startY}"
                    x2="${lineEndX}"
                    y2="${lineEndY}"
                    stroke="yellow"
                    stroke-width="4"
                    stroke-dasharray="6 4"
                    stroke-linecap="round"
                />
                <circle
                    cx="${startX}"
                    cy="${startY}"
                    r="4"
                    fill="#ffffff"
                />
            `;
        });

        annotationLayer.appendChild(hotspot);
    });

    sceneContainer.addEventListener("click", (event) => {
        if (event.target.closest("#workshopCaption")) {
            return;
        }

        if (!event.target.closest(".workshop-hotspot")) {

            /* STOP SUARA SAAT POPUP DITUTUP */
            if (typeof stopWorkshopAudio === "function") stopWorkshopAudio();

            caption.style.display = "none";
            svg.innerHTML = "";
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {

            /* STOP SUARA */
            if (typeof stopWorkshopAudio === "function") stopWorkshopAudio();

            caption.style.display = "none";
            svg.innerHTML = "";
        }
    });
}


/* =====================================================
   INIT
===================================================== */

init();

animate();
//showObjectsSequentially();

function init(){

     /* SCENE */
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07111d, 0.018);

    /* BACKGROUND IMAGE */
    const sceneContainer = document.getElementById("scene");
    initWorkshopObjectHotspots();
    sceneContainer.style.backgroundImage =
        'url("assets/Scene3-workshop.jpg")';

    sceneContainer.style.backgroundSize = "contain";
    sceneContainer.style.backgroundPosition = "center";
    sceneContainer.style.backgroundRepeat = "no-repeat";




    /* CAMERA */
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        .1,
        100
    );

    camera.position.set(
        9,
        6,
        14
    );

    /* RENDERER */
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        alpha:true
    });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    document
        .getElementById("scene")
        .appendChild(renderer.domElement);

    /* CONTROLS */
    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = .08;
    controls.minDistance = 7;
    controls.maxDistance = 25;

    controls.target.set(
        0,
        4.7,
        0
    );

    /* LIGHT */
const ambient =
        new THREE.HemisphereLight(
            0xbdefff,
            0x07111d,
            2.2
        );

    scene.add(ambient);

    const light =
new THREE.DirectionalLight(
            0xdff8ff,
            4.2
        );

    light.position.set(
        8,
        15,
        10
    );

    light.castShadow = true;

    scene.add(light);

    /* CEILING LIGHT 1 */
    const workshopLight1 =
new THREE.PointLight(
            0xb8f3ff,
            24,
            18
        );

    workshopLight1.position.set(
        -5,
        11,
        3
    );

    scene.add(workshopLight1);

    /* CEILING LIGHT 2 */
    const workshopLight2 =
new THREE.PointLight(
            0xffd27a,
            19,
            18
        );

    workshopLight2.position.set(
        5,
        11,
        -3
    );

    scene.add(workshopLight2);

    /* ORANGE ACCENT LIGHT */
    const orangeLight =
new THREE.PointLight(
            0x00d9ff,
            12,
            30
        );

    orangeLight.position.set(
        -5,
        5,
        8
    );

    scene.add(orangeLight);

    /* PREMIUM ROOM FLOOR + RIM LIGHT 
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({
            color:0x071421,
            metalness:.35,
            roughness:.7,
            transparent:true,
            opacity:.86
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.52;
    floor.receiveShadow = true;
    scene.add(floor);

    const floorGrid = new THREE.GridHelper(40, 40, 0x1b6075, 0x123043);
    floorGrid.position.y = -1.49;
    floorGrid.material.transparent = true;
    floorGrid.material.opacity = .28;
    scene.add(floorGrid);

    const rimLight = new THREE.PointLight(0x4d7cff, 10, 22);
    rimLight.position.set(6, 6, -8);
    scene.add(rimLight);*/


    /* =========================================
       TROLLEY
    ========================================= */

    //createTrolley();


    /* CLICK */
    renderer
        .domElement
        .addEventListener(
            "click",
            onClick
        );


    /* RESIZE */
    window.addEventListener(
        "resize",
        resize
    );
}

function getToolSpeechText(tool) {
    return tool?.description || "";
}

function speakTool(tool = currentTool) {
    if (!tool) return;
    const audio = playWorkshopAudio(tool);
    if (!audio) return;

    audio.onplay = function () {
        isSpeaking = true;
        const button = document.getElementById("voiceButton");
        if (button) {
            button.textContent = "⏸ Sedang Memutar...";
            button.classList.add("speaking");
        }
    };
    audio.onended = function () {
        isSpeaking = false;
        const button = document.getElementById("voiceButton");
        if (button) {
            button.textContent = "🔊 Dengarkan Penjelasan";
            button.classList.remove("speaking");
        }
    };
}

function toggleToolVoice() {
    if (!currentTool) return;
    const audio = ensureWorkshopAudio();
    if (audio.src && !audio.paused) {
        audio.pause();
        isSpeaking = false;
        return;
    }
    if (audio.src && audio.currentTime > 0 && audio.currentTime < audio.duration) {
        audio.play().catch(() => {});
        return;
    }
    speakTool(currentTool);
}

function stopToolVoice() {
    stopWorkshopAudio();
    isSpeaking = false;
    const button = document.getElementById("voiceButton");
    if (button) {
        button.textContent = "🔊 Dengarkan Penjelasan";
        button.classList.remove("speaking");
    }
}

/* =====================================================
   TROLLEY
===================================================== */

function createTrolley(){
    trolley = new THREE.Group();
    scene.add(trolley);

    document.querySelector('.controls').style.display = 'flex';
    document.getElementById("scene").classList.add("trolley-active");

    const trolleyActions = document.getElementById("trolleyActions");
    trolleyActions.classList.add("show");
    trolleyActions.style.display = "block";

    const black = new THREE.MeshStandardMaterial({
        color:0x111417,
        metalness:.82,
        roughness:.2
    });

    const black2 = new THREE.MeshStandardMaterial({
        color:0x050608,
        metalness:.72,
        roughness:.24
    });

    const orange = new THREE.MeshStandardMaterial({
        color:0xf57c00,
        metalness:.48,
        roughness:.25
    });

    const silver = new THREE.MeshStandardMaterial({
        color:0xb7bdc1,
        metalness:.96,
        roughness:.12
    });

    const topSteel = new THREE.MeshStandardMaterial({
        color:0x8d969a,
        metalness:.92,
        roughness:.18
    });

    /* SIZE */
    const W = 6;
    const H = 9;
    const D = 3.4;

    /* PEMBAGIAN DEPAN
   70% DRAWER + 10% SPACE + 20% RAK 8
    */
    const drawerW = W * .70;
    const spaceW = W * .10;
    const rack8W = W * .20;

    const drawerCenterX =
        -W/2 + drawerW/2;

    const rack8CenterX =
        W/2 - rack8W/2;

    /* TOP */
    box(W+.4,.38,D+.4,0,H+.15,0,black,trolley);

    /* RECESSED STEEL TOP TRAY */
    box(5.15,.12,2.65,0,H+.39,0,topSteel,trolley);
    box(5.45,.08,.18,0,H+.47,-1.22,black2,trolley);
    box(5.45,.08,.18,0,H+.47,1.22,black2,trolley);
    box(.18,.08,2.3,-2.55,H+.47,0,black2,trolley);
    box(.18,.08,2.3,2.55,H+.47,0,black2,trolley);

    /* LEFT SIDE */
    box(.35,H,D,-W/2,H/2,0,black,trolley);

    /* RIGHT SIDE */
    box(.35,H,D,W/2,H/2,0,black,trolley);

    /* BACK */
    box(W,H,.25,0,H/2,-.95,black2,trolley);

    /* ORANGE SIDE PANELS */
    box(.16,H-.7,D-.35,-W/2-.01,H/2-.05,0,orange,trolley);
    box(.16,H-.7,D-.35,W/2+.01,H/2-.05,0,orange,trolley);

    /* BLACK FRONT CORNERS */
    box(.32,H-.4,.3,-W/2+.18,H/2-.12,1.48,black2,trolley);

    /* DRAWERS 1-7 */
    for(let i=0;i<7;i++){
        createDrawer(
            i,
            orange,
            black,
            black2,
            silver,
            drawerW,
            drawerCenterX
        );
    }

/* RAK 8 */
/* RAK 8 */
rack8 = new THREE.Group();

rack8.userData.type = "rack";
rack8.userData.drawer = 8;
rack8.userData.rackIndex = 8;
rack8.userData.closed = 0;
rack8.userData.open = .8;
rack8.userData.target = 0;

/* BACK RAK 8 */
box(
    rack8W,
    H,
    .25,
    rack8CenterX,
    H/2,
    -.95,
    black2,
    rack8
);

/* FRAME KIRI */
box(
    .14,
    H-.7,
    D-.35,
    rack8CenterX-rack8W/2,
    H/2-.05,
    0,
    orange,
    rack8
);

/* FRAME KANAN */
box(
    .14,
    H-.7,
    D-.35,
    rack8CenterX+rack8W/2,
    H/2-.05,
    0,
    orange,
    rack8
);

/* TOP */
box(
    rack8W+.2,
    .32,
    D+.2,
    rack8CenterX,
    H+.15,
    0,
    black,
    rack8
);

/* SHELF */
for(let y of [2.2,4.4,6.6,8]){
    box(
        rack8W-.2,
        .12,
        D-.35,
        rack8CenterX,
        y,
        0,
        black,
        rack8
    );
}

trolley.add(rack8);
/* TITLE RAK 8 */
const titleCanvas = document.createElement("canvas");
titleCanvas.width = 700;
titleCanvas.height = 180;

const ctx = titleCanvas.getContext("2d");

ctx.clearRect(0,0,700,180);

/* BACKGROUND */
ctx.fillStyle = "rgba(5,10,16,.92)";
ctx.fillRect(20,20,660,140);

/* BORDER */
ctx.strokeStyle = "#00d9ff";
ctx.lineWidth = 6;
ctx.strokeRect(20,20,660,140);

/* TITLE */
ctx.fillStyle = "#ffffff";
ctx.font = "bold 82px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("RAK 8",350,90);

const titleTexture = new THREE.CanvasTexture(titleCanvas);
titleTexture.needsUpdate = true;

const titleMaterial = new THREE.SpriteMaterial({
    map:titleTexture,
    transparent:true,
    depthTest:false
});

const titleSprite = new THREE.Sprite(titleMaterial);

titleSprite.scale.set(1.25,.32,1);

titleSprite.position.set(
    rack8CenterX,
    5.35,
    1.72
);

rack8.add(titleSprite);


clickableDrawers.push(rack8);


    /* FRONT LOCK / UTILITY */
    box(
        .68,
        7.25,
        .18,
        rack8CenterX,
        4.55,
        1.48,
        orange,
        trolley
    );

    

    /* HANDLE RAK 8 — SEPERTI HANDLE PINTU MOBIL */
const rack8Handle = new THREE.Group();

box(
    .75,
    .12,
    .12,
    0,
    0,
    0,
    black2,
    rack8Handle
);

box(
    .10,
    .28,
    .12,
    -.34,
    -.14,
    0,
    black2,
    rack8Handle
);

box(
    .10,
    .28,
    .12,
    .34,
    -.14,
    0,
    black2,
    rack8Handle
);

rack8Handle.position.set(
    rack8CenterX,
    4.7,
    1.68
);

rack8.add(rack8Handle);




    /* SIDE HANDLE */
    const sideHandle = new THREE.Group();

    box(.22,1.45,.22,0,0,0,black2,sideHandle);
    box(.25,.2,.18,0,.65,0,black2,sideHandle);
    box(.25,.2,.18,0,-.65,0,black2,sideHandle);

    sideHandle.position.set(
        W/2+.3,
        5.5,
        .8
    );

    trolley.add(sideHandle);


    /* PANEL PENUTUP BAWAH */
box(
    W-.7,
    .6,
    D-.25,
    0,
    .6,
    0,
    black,
    trolley
);


    /* WHEELS */
    createWheel(-2.3,-1.5);
    createWheel(2.3,-1.5);
    createWheel(-2.3,1.5);
    createWheel(2.3,1.5);
}

window.closeTrolley = function(){

    /* Tutup quiz kalau masih terbuka */
    document
        .getElementById("quizModal")
        .classList.remove("show");
    document
    .getElementById("scene")
    .classList.remove("trolley-active");


    document
    .querySelector(".controls")
    .style.display = "none";


    /* Hapus trolley 3D */
    if(trolley){

        scene.remove(trolley);

        trolley.traverse(
            function(object){

                if(object.geometry){
                    object.geometry.dispose();
                }

                if(object.material){

                    if(
                        Array.isArray(
                            object.material
                        )
                    ){

                        object.material.forEach(
                            m => m.dispose()
                        );

                    }else{

                        object.material.dispose();

                    }

                }

            }
        );

        trolley = null;rack8 = null;
    }


    /* Reset */
    drawers = [];
    clickableDrawers = [];

    trolleyCreated = false;
    workshopInteractionDisabled = false;


    /* Tampilkan kembali hotspot workshop */
    const hotspots =
        document.querySelectorAll(
            ".workshop-hotspot"
        );

    hotspots.forEach(
        hotspot => {
            hotspot.style.pointerEvents = "auto";
        }
    );
    /* Sembunyikan tombol CLOSE */
    document
        .getElementById("trolleyActions")
        .classList.remove("show");

    document
        .getElementById("trolleyActions")
        .style.display = "none";



    /* Reset camera */

    camera.position.set(
        9,
        6,
        14
    );

    controls.target.set(
        0,
        4.7,
        0
    );

    controls.update();

};

/* =====================================================
   DRAWER
===================================================== */

function createDrawer(index,orange,black,black2,silver){
    const drawer = new THREE.Group();
    const drawerH = index<5 ? 1 : 1.25;
    const y = 8.1-index*1.15;

    drawer.position.set(0,y,.05);
    drawer.userData = {
        number:index+1,
        closed:.05,
        open:1.65,
        target:.05
    };

    /* DRAWER BODY */
    box(4.78,drawerH,2.7,-.35,0,0,black,drawer);

    /* ORANGE FRONT */
    box(4.68,drawerH-.12,.17,-.35,0,1.4,orange,drawer);

    /* BLACK FRONT CENTER */
    box(4.1,.34,.1,-.35,-.05,1.52,black2,drawer);

    /* HANDLE */
    box(3.5,.13,.17,-.35,-.13,1.6,black2,drawer);

    /* HANDLE ORANGE STRIP */
    box(2.95,.05,.04,-.35,-.04,1.69,orange,drawer);

    /* DRAWER NUMBER */
    createLabel(drawer,index+1);

    /* MINI TOOLS INSIDE */
    if(index===0){
        createMiniTools(drawer);
    }

    /* CLICK AREA */
    const click = new THREE.Mesh(
        new THREE.BoxGeometry(5.05,drawerH,.35),
        new THREE.MeshBasicMaterial({
            transparent:true,
            opacity:0
        })
    );

    click.position.set(-.35,0,1.62);
    click.userData.drawer = index+1;

    drawer.add(click);
    clickableDrawers.push(click);
    drawers.push(drawer);
    trolley.add(drawer);
}


/* =====================================================
   MINI TOOLS Rak 1
===================================================== */

function createMiniTools(drawer){
    const steel = new THREE.MeshStandardMaterial({color:0xbcc3c8,metalness:.9,roughness:.2});
    const dark = new THREE.MeshStandardMaterial({color:0x202326,metalness:.6,roughness:.3});

    /* WRENCH 1 */
    for(let i=0;i<4;i++){
        const tool = new THREE.Group();

        const shaft = new THREE.Mesh(
            new THREE.BoxGeometry(.85,.12,.16),
            steel
        );
        tool.add(shaft);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(.18,.055,10,20),
            steel
        );

        ring.position.x = -.38;
        tool.add(ring);

        tool.position.set(-1.7+i*1.05,.02,.35);
        tool.rotation.y = i*.15;
        drawer.add(tool);
    }

    /* SOCKETS */
    for(let i=0;i<5;i++){
        const socket = new THREE.Mesh(
            new THREE.CylinderGeometry(.12,.12,.3,6),
            dark
        );

        socket.position.set(-1.4+i*.7,-.18,.75);
        drawer.add(socket);
    }
}


/* =====================================================
   LABEL
===================================================== */

function createLabel(parent,number){
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#050b14";
    ctx.fillRect(0,0,200,100);

    ctx.strokeStyle = "#d9a441";
    ctx.lineWidth = 5;
    ctx.strokeRect(5,5,190,90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 45px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RAK "+number,100,50);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({map:texture})
    );

    sprite.scale.set(.8,.4,1);
    sprite.position.set(-2.25,.18,1.7);

    parent.add(sprite);
}


/* =====================================================
   WHEEL
===================================================== */

function createWheel(x,z){
    const group = new THREE.Group();

    const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(.54,.54,.34,32),
        new THREE.MeshStandardMaterial({
            color:0x111111,
            roughness:.7
        })
    );

    tire.rotation.z = Math.PI/2;
    group.add(tire);

    const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(.32,.32,.36,32),
        new THREE.MeshStandardMaterial({
            color:0xf5b400,
            metalness:.7,
            roughness:.25
        })
    );

    rim.rotation.z = Math.PI/2;
    group.add(rim);

    const fork = new THREE.Mesh(
        new THREE.BoxGeometry(.18,.6,.18),
        new THREE.MeshStandardMaterial({
            color:0x888888,
            metalness:.8
        })
    );

    fork.position.y = .5;
    group.add(fork);

    group.position.set(x,-.05,z);
    trolley.add(group);
}


/* =====================================================
   BOX
===================================================== */

function box(w,h,d,x,y,z,material,parent){
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w,h,d),
        material
    );

    mesh.position.set(x,y,z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);
    return mesh;
}


/* =====================================================
   CLICK Rak
===================================================== */

function onClick(event){
    if(drawerBusy) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX-rect.left)/rect.width)*2-1;
    mouse.y = -((event.clientY-rect.top)/rect.height)*2+1;

    raycaster.setFromCamera(mouse,camera);

    const hits = raycaster.intersectObjects(clickableDrawers,true);
    if(!hits.length) return;

    let target = hits[0].object;

    while(target && target !== trolley){
        if(target.userData && target.userData.drawer){
            break;
        }
        target = target.parent;
    }

    if(!target || !target.userData || !target.userData.drawer) return;

    const number = target.userData.drawer;

    openDrawer(number);
}


/* =====================================================
   OPEN DRAWER
===================================================== */

function openDrawer(number){
    drawerBusy = true;
    activeDrawer = number;

    drawers.forEach((drawer,index)=>{
        if(index === number-1){
            drawer.userData.target = drawer.userData.open;
        }else{
            drawer.userData.target = drawer.userData.closed;
        }
    });

    if(rack8){
        rack8.userData.target = number === 8
            ? rack8.userData.open
            : rack8.userData.closed;
    }

    animateDrawers();
}


/* =====================================================
   DRAWER ANIMATION
===================================================== */

function animateDrawers(){
    let moving = false;

    drawers.forEach(drawer=>{
        const target = drawer.userData.target;

        drawer.position.z += (target-drawer.position.z)*.18;

        if(Math.abs(target-drawer.position.z)>.01){
            moving = true;
        }
    });

    if(rack8){
        const target = rack8.userData.target ?? 0;

        rack8.position.z += (target-rack8.position.z)*.18;

        if(Math.abs(target-rack8.position.z)>.01){
            moving = true;
        }
    }

    if(moving){
        requestAnimationFrame(animateDrawers);
        return;
    }

    drawers.forEach(drawer=>{
        drawer.position.z = drawer.userData.target;
    });

    if(rack8){
        rack8.position.z = rack8.userData.target ?? 0;
    }

    drawerBusy = false;

    setTimeout(()=>{
        showRack(activeDrawer);
    },150);
}

/* =====================================================
   SHOW RACK
===================================================== */

window.showRack = function(number){
    const data = rackData[number];

    document.getElementById("rackTitle").textContent =
        "Rak " + number + " — " + data.name;

    document.querySelector(".modal-subtitle").textContent =
        data.description;

    const grid = document.getElementById("toolsGrid");
    grid.innerHTML = "";

    /* GAMBAR RAK */
    const preview = document.createElement("div");
    preview.className = "rack-preview";
    preview.style.position = "relative";
    preview.style.overflow = "hidden";

    if(data.image){
        const img = document.createElement("img");

        img.src = data.image;
        img.alt = data.name;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";

        img.onload = () => {
            updateHotspotAreas(
                preview,
                data.tools,
                img,
                number
            );
        };

        img.onerror = function(){
            preview.innerHTML = `
                <div class="rack-preview empty">
                    Gambar keseluruhan rak tidak ditemukan
                </div>
            `;
        };

        preview.appendChild(img);
    }else{
        preview.classList.add("empty");
        preview.innerHTML = "Belum ada gambar keseluruhan rak";
    }

    grid.appendChild(preview);

    /* DAFTAR TOOL */
    const list = document.createElement("div");
    list.className = "tools-list";

    if(!data.tools.length){
        list.innerHTML = `
            <div style="
                padding:40px 20px;
                text-align:center;
                color:#707b87;
            ">
                <div style="
                    font-size:45px;
                    margin-bottom:15px;
                ">🔧</div>
                Isi alat untuk rak ini belum dimasukkan.
            </div>
        `;
    }else{
        data.tools.forEach(tool => {
            const item = document.createElement("div");
            item.className = "tool-item";

            const imageHtml = tool.image
                ? `<img src="${tool.image}" alt="${tool.name}"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='block';">`
                : "";

            item.innerHTML = `
                <div class="tool-item-image">
                    ${imageHtml}

                    <span class="tool-item-icon"
                        style="${tool.image ? "display:none" : ""}">
                        ${tool.icon || "🔧"}
                    </span>
                </div>

                <div class="tool-item-info">
                    <h3>${tool.name}</h3>

                    <p>${tool.description}</p>

                    <span>
                        🔧 ${tool.fungsi}
                    </span>
                </div>
            `;

            item.onclick = () => { speakToolName(tool.name, tool.voiceNameLang || "en-US"); openTool(tool); };

            list.appendChild(item);
        });
    }
    grid.appendChild(list);

    document.getElementById("rackModal").classList.add("show");
    // Nama rack memakai pelafalan Inggris.
    speakToolName(data.name);
};


/* =====================================================
   HOTSPOT RAK
===================================================== */

function updateHotspotAreas(container,tools,imgEl,rackNumber){

    const hotspotData = {
        1: [
                {
                    name: "Kunci Nipel",
                    x: 26,
                    y: 8,
                    w: 24,
                    h: 10
                },
                {
                    name: "Kunci Pas",
                    x: 3,
                    y: 15,
                    w: 46,
                    h: 32
                },
                {
                    name: "Kunci Kombinasi Pas Ring",
                    voiceNameLang: "id-ID",
                    x: 50,
                    y: 15,
                    w: 35,
                    h: 30
                },
                {
                    name: "Kunci L Bintang",
                    image: "assets/rack-01-L-bintang.png",
                    voiceNameLang: "id-ID",
                    x: 86,
                    y: 11,
                    w: 10,
                    h: 38
                },
                {
                    name: "Kunci Ring",
                    x: 4,
                    y: 50,
                    w: 40,
                    h: 39
                },
                {
                    name: "Kunci L Hexagonal",
                    image: "assets/rack-01-L-hexa.png",
                    x: 87,
                    y: 55,
                    w: 8,
                    h: 35
                },
                {
                    name: "Socket Impact Driver",
                    image: "assets/rack-01-socket-impact-driver.png",
                    x: 58,
                    y: 79,
                    w: 20,
                    h: 5
                },
                {
                    name: "Socket Mata Bintang",
                    image: "assets/rack-01-socket-mata-bintang.png",
                    x: 45,
                    y: 85,
                    w: 15,
                    h: 5
                },
                {
                    name: "Socket Mata Hexagonal",
                    image: "assets/rack-01-socket-mata-hexagonal.png",
                    x: 50,
                    y: 51,
                    w: 32,
                    h: 6
                },
                {
                    name: "Socket Mata Hexagonal Panjang",
                    image: "assets/rack-01-socket-mata-hexagonal-panjang.png",
                    x: 51,
                    y: 74,
                    w: 8,
                    h: 10
                },
                {
                    name: "Socket Ratchet Handle",
                    image: "assets/rack-01-socket-ratchet-handle.png",
                    x: 51,
                    y: 66,
                    w: 30,
                    h: 7
                },
                {
                    name: "Socket Ratchet Handle",
                    image: "assets/rack-01-socket-ratchet-handle.png",
                    x: 60,
                    y: 74,
                    w: 18,
                    h: 5
                },
                {
                    name: "Socket Sambungan Fleksibel Kunci",
                    image: "assets/rack-01-socket-sambungan-fleksibel-kunci.png",
                    x: 72,
                    y: 85,
                    w: 12,
                    h: 5
                },
                {
                    name: "Socket Sambungan Rigid Kunci",
                    image: "assets/rack-01-socket-sambungan-rigid-kunci.png",
                    x: 52,
                    y: 62,
                    w: 14,
                    h: 5
                },
                {
                    name: "Socket Set Mata Obeng",
                    image: "assets/rack-01-socket-set-mata-obeng.png",
                    x: 80,
                    y: 56,
                    w: 4,
                    h: 16
                },
                {
                    name: "Socket Sliding Handle",
                    image: "assets/rack-01-socket-sliding-handle.png",
                    x: 52,
                    y: 58,
                    w: 28,
                    h: 5
                }
            ],



        2:[
            {name:"Kunci Inggris",                  x:45,  y:10,  w:6, h:38},
            {name:"Obeng Minus (-)",                 x:35, y:52,  w:15, h:7},
            {name:"Obeng Minus (-)",                 x:35, y:60,  w:15, h:7},
            {name:"Obeng Minus (-)",                 x:35, y:70,  w:15, h:7},
            {name:"Obeng Minus (-)",                 x:35, y:79,  w:15, h:7},
            {name:"Obeng Plus (+)",                 x:5, y:55,  w:15, h:7},
            {name:"Obeng Plus (+)",                 x:5, y:63,  w:15, h:7},
            {name:"Obeng Plus (+)",                 x:5, y:73,  w:15, h:7},
            {name:"Obeng Plus (+)",                 x:5, y:81,  w:15, h:7},
            {name:"Palu Cakar",                     x:60,  y:9,  w:10, h:40},
            {name:"Palu Godam",                     x:79,  y:9,  w:8, h:40},
            {name:"Palu Karet",                     x:88,  y:9,  w:8, h:40},
            {name:"Palu Konde",                     x:71,  y:9,  w:8, h:40},
            {name:"Palu Tembaga",                   x:52,  y:9,  w:8, h:40},
            {name:"Tang Snap Ring Bengkok Buka",                     x:70,  y:56,  w:19, h:11},
            {name:"Tang Snap Ring Bengkok Tutup",                     x:54,  y:56,  w:15, h:10},
            {name:"Tang Snap Ring Lurus Buka",                     x:70,  y:70,  w:19, h:12},
            {name:"Tang Snap Ring Lurus Tutup",                     x:54,  y:70,  w:15, h:12},
            {name:"Tang Kombinasi",                  x:4,  y:10,  w:7, h:38},
            {name:"Tang Lancip",                  x:20,  y:10,  w:7, h:38},
            {name:"Tang Locking Pliers",                  x:35,  y:10,  w:7, h:38},
            {name:"Tang Potong",                     x:12, y:10, w:7, h:38},
            {name:"Tang Slip Joint",                 x:27, y:10, w:7, h:38}
        ],
        3:[
            {name:"Mesin Bor Tangan Electric AC",               x:65, y:51, w:28, h:42},
            {name:"Mesin Bor Tangan Electric DC",   x:63, y:7, w:31, h:42},
            {name:"Impact Wrench Electric",         x:4, y:5,  w:27, h:40},
            {name:"Impact Wrench Pneumatic",        x:4, y:52, w:28, h:40},
            {name:"Ratchet Electric",               x:52,  y:6,  w:10, h:85}
        ],

        4:[
            {name:"Adjustable Hook Spanner Wrench",          x:46,  y:40,  w:12, h:14},
            {name:"Bearing Separator and Puller Set",           x:5, y:7,  w:50, h:32},
            {name:"Disc Brake Caliper Piston Rewind Tool",          x:29,  y:40,  w:18, h:20},
            {name:"Oil Filter Wrench",          x:67,  y:6,  w:10, h:55},
            {name:"Piston Ring Compressor",          x:5,  y:40,  w:12, h:20},
            {name:"Piston Ring Expanders",          x:63,  y:60,  w:30, h:30},
            {name:"Slide Hammer",                    x:5, y:62,  w:57, h:30},
            {name:"Tie Rod End Remover",          x:16,  y:40,  w:11, h:20},
            {name:"Universal Clutch Alignment Tool Kit",     x:56,  y:6,  w:10, h:43},
            {name:"Valve Spring Compressor",                x:79,  y:6,  w:15, h:53}
        ],

        5:[
            {name:"Dial Bore Gauge",                  x:71, y:57, w:25, h:16},
            {name:"Dial Indicator Stand",             x:63, y:10,  w:9, h:59},
            {name:"Digital Multimeter",               x:80, y:10,  w:16, h:45},
            {name:"Feeler Gauge",                     x:11,  y:78, w:17, h:8},
            {name:"Kunci Torsi Analog",               x:3, y:10, w:10, h:70},
            {name:"Kunci Torsi Analog Dial",          x:22, y:10, w:7, h:56},
            {name:"Kunci Torsi Digital",              x:12, y:10, w:9, h:68},
            {name:"Micrometer",                       x:29, y:43, w:29, h:32},
            {name:"Vernier Caliper Analog",           x:31, y:24, w:28, h:8},
            {name:"Vernier Caliper Analog Dial",      x:30, y:13, w:32, h:8},
            {name:"Vernier Caliper Digital",          x:35, y:33, w:28, h:7}
        ],

        6:[
            {name:"Battery Tester",                       x:61,  y:7,  w:25, h:53},
            {name:"Clamp Ampere",                         x:33, y:60,  w:62, h:33},
            {name:"Leak Detector",                       x:4, y:60,  w:29, h:33},
            {name:"OBD II Engine Diagnostic Scan Tool",  x:4, y:10, w:57, h:48},
            {name:"Tespen Digital",                      x:86,  y:7,  w:9, h:53},
        ],

        7:[
            {
                name:"Diesel Engine",
                x:4,y:4,w:20,h:60
            },
            {
                name:"Gasoline Engine",
                x:27,y:4,w:68,h:86
            }
        ],
        8: [
            {
                name: "Air Gun",
                x: 48, y: 55, w: 40, h: 35
            },
            {
                name: "Kunci T",
                x: 5, y: 12, w: 85, h: 38
            },
            {
                name: "Tire Pressure Gauge",
                x: 5, y: 53, w: 36, h: 38
            }
        ]

    };

    const spots = hotspotData[rackNumber] || [];

    spots.forEach(spot => {
        const matchedTool = tools.find(t => t.name === spot.name);
        if(!matchedTool) return;

        const area = document.createElement("div");

        area.style.position = "absolute";
        area.style.left = spot.x + "%";
        area.style.top = spot.y + "%";
        area.style.width = spot.w + "%";
        area.style.height = spot.h + "%";
        area.style.background = "rgba(0,217,255,0)";
        area.style.border = "2px solid transparent";
        area.style.borderRadius = "6px";
        area.style.cursor = "pointer";
        area.style.transition = ".2s";
        area.title = "Klik: " + spot.name;

        area.onmouseenter = () => {
            area.style.background = "rgba(0,217,255,.18)";
            area.style.border = "2px solid #00d9ff";
        };

        area.onmouseleave = () => {
            area.style.background = "rgba(0,217,255,0)";
            area.style.border = "2px solid transparent";
        };

        area.onclick = e => {
            e.stopPropagation();
            speakToolName(matchedTool.name, matchedTool.voiceNameLang || spot.voiceNameLang || "en-US");
            openTool(matchedTool);
        };

        container.appendChild(area);
    });
}


/* =====================================================
   CLOSE RACK
===================================================== */

window.closeRack=
function(){
    document
        .getElementById(
            "rackModal"
        )
        .classList
        .remove("show");
};


/* =====================================================
   OPEN TOOL
===================================================== */

window.openTool=function(tool){
    currentTool=tool;

    document.getElementById("detailName").textContent=tool.name;
    document.getElementById("detailDescription").textContent=tool.description;
    document.getElementById("detailUse").textContent=tool.fungsi;

    document.getElementById("rackModal").classList.remove("show");
    document.getElementById("toolModal").classList.add("show");

    setTimeout(initToolViewer,50);
    //setTimeout(function(){
    //    speakTool(tool);
    //},250);
};


/* =====================================================
   TOOL VIEWER
===================================================== */

function initToolViewer() {
    const container = document.getElementById("toolViewer");
    container.innerHTML = "";
    const photo = document.createElement("img");
    photo.id = "activeToolPhoto";
    photo.src = currentTool.image;
    photo.alt = currentTool.name;
    photoRotation = 0;
    photoScale = 1;
    toolPhotoElement = photo;

    photo.style.width = "100%";
    photo.style.height = "100%";
    photo.style.objectFit = "contain";
    photo.style.padding = "30px";
    photo.style.display = "block";
    photo.style.transformOrigin = "center center";

    container.appendChild(photo);


    container.style.position = "relative";

    toolScene = new THREE.Scene();
    toolScene.background = new THREE.Color(0x0c1116);

    toolCamera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        .1,
        100
    );

    toolCamera.position.set(4, 2.5, 6);

    window.toolRotateLeft = function () {
    if (toolPhotoElement) {
        photoRotation -= 15;
        updatePhotoTransform();
    }
};

window.toolRotateRight = function () {
    if (toolPhotoElement) {
        photoRotation += 15;
        updatePhotoTransform();
    }
};

window.toolZoomIn = function () {
    if (toolPhotoElement) {
        photoScale += .1;
        updatePhotoTransform();
    }
};

window.toolZoomOut = function () {
    if (toolPhotoElement) {
        photoScale = Math.max(.4, photoScale - .1);
        updatePhotoTransform();
    }
};

window.toolReset = function () {
    photoRotation = 0;
    photoScale = 1;
    updatePhotoTransform();
};

function updatePhotoTransform() {
    if (!toolPhotoElement) return;

    toolPhotoElement.style.transform =
        `rotate(${photoRotation}deg) scale(${photoScale})`;
}


    toolControls = new OrbitControls(
        toolCamera,
        toolRenderer.domElement
    );

    toolControls.enableDamping = true;
    toolControls.dampingFactor = .08;
    toolControls.minDistance = 2;
    toolControls.maxDistance = 12;

    // Lampu
    toolScene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x202020,
            2.5
        )
    );

    const light = new THREE.DirectionalLight(
        0xffffff,
        5
    );

    light.position.set(5, 8, 6);
    toolScene.add(light);

    // Lantai 3D
    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(3, 64),
        new THREE.MeshStandardMaterial({
            color: 0x171d23,
            roughness: .8
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    toolScene.add(floor);

    // Buat model 3D tool
    toolObject = createToolModel(currentTool);
    toolScene.add(toolObject);

    // Foto tool di pojok kiri atas
    if (currentTool && currentTool.image) {
        const photo = document.createElement("img");

        photo.className = "tool-photo";
        photo.src = currentTool.image;
        photo.alt = currentTool.name;

        photo.onerror = function () {
            this.remove();
        };

        container.appendChild(photo);
    }

    toolReset();
    animateTool();
}



/* =====================================================
   CREATE TOOL MODEL
===================================================== */

function createToolModel(tool){
    const group = new THREE.Group();

    const steel = new THREE.MeshStandardMaterial({
        color:0xbfc5ca,
        metalness:.9,
        roughness:.2
    });

    const dark = new THREE.MeshStandardMaterial({
        color:0x1a1c1e,
        metalness:.6,
        roughness:.25
    });

    const orange = new THREE.MeshStandardMaterial({
        color:0xf47a00,
        metalness:.3,
        roughness:.3
    });

    /* KUNCI PAS */
    if(tool.name==="Kunci Pas"){
        for(let i=0;i<2;i++){
            const shaft = new THREE.Mesh(
                new THREE.BoxGeometry(3.2,.22,.4),
                steel
            );
            shaft.position.x = i*.3;
            group.add(shaft);

            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(.42,.1,16,32),
                steel
            );
            ring.position.x = -1.35;
            group.add(ring);

            const open = new THREE.Mesh(
                new THREE.TorusGeometry(.38,.1,16,24,Math.PI*1.45),
                steel
            );
            open.position.x = 1.35;
            open.rotation.z = -.45;
            group.add(open);

            break;
        }
    }

    /* KUNCI KOMBINASI */
    else if(tool.name==="Kunci Kombinasi"){
        const shaft = new THREE.Mesh(
            new THREE.BoxGeometry(3.5,.25,.4),
            steel
        );
        group.add(shaft);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(.43,.11,16,32),
            steel
        );
        ring.position.x = -1.45;
        group.add(ring);

        const open = new THREE.Mesh(
            new THREE.TorusGeometry(.43,.11,16,24,Math.PI*1.45),
            steel
        );
        open.position.x = 1.45;
        open.rotation.z = -.5;
        group.add(open);
    }
    /* KUNCI RING */
    else if(tool.name==="Kunci Ring"){
        const shaft = new THREE.Mesh(
            new THREE.BoxGeometry(3.3,.25,.35),
            steel
        );
        group.add(shaft);

        for(const x of [-1.35,1.35]){
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(.42,.12,16,32),
                steel
            );
            ring.position.x = x;
            group.add(ring);
        }
    }


    /* SOCKET SET */
    else if(tool.name==="Kunci Socket Set"){
        const ratchet = new THREE.Mesh(
            new THREE.BoxGeometry(3.2,.28,.38),
            steel
        );
        group.add(ratchet);

        const head = new THREE.Mesh(
            new THREE.CylinderGeometry(.35,.35,.5,6),
            steel
        );
        head.rotation.z = Math.PI/2;
        head.position.x = 1.6;
        group.add(head);

        for(let i=0;i<6;i++){
            const socket = new THREE.Mesh(
                new THREE.CylinderGeometry(.22,.22,.4,6),
                dark
            );

            socket.position.set(
                -1.5+(i%3)*.65,
                -.4+Math.floor(i/3)*.7,
                0
            );

            group.add(socket);
        }
    }

    /* DEFAULT */
    else{
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2,.5,.6),
            orange
        );
        group.add(body);

        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(.45,1.8,.45),
            dark
        );
        handle.position.y = -1;
        group.add(handle);
    }

    return group;
}


/* =====================================================
   TOOL ANIMATION
===================================================== */

function animateTool(){
    requestAnimationFrame(animateTool);

    if(toolControls){
        toolControls.update();
    }

    if(toolRenderer && toolScene && toolCamera){
        toolRenderer.render(toolScene,toolCamera);
    }
}


/* =====================================================
   TOOL CONTROLS
===================================================== */

window.toolRotateLeft=
function(){
    if(toolObject){
        toolObject.rotation.y+=.25;
    }

};


window.toolRotateRight=
function(){
    if(toolObject){
        toolObject.rotation.y-=.25;
    }

};


window.toolZoomIn=
function(){
    if(toolCamera){
        toolCamera.position.multiplyScalar(
            .85
        );
    }

};


window.toolZoomOut=
function(){

    if(toolCamera){

        toolCamera.position.multiplyScalar(
            1.15
        );

    }

};


window.toolReset = function(){
    if(toolObject){
        toolObject.rotation.set(0,0,0);
    }

    if(toolCamera){
        toolCamera.position.set(4,2.5,6);
    }

    if(toolControls){
        toolControls.target.set(0,0,0);
        toolControls.update();
    }
};


/* =====================================================
   BACK
===================================================== */

window.backToRack=
function(){
    document
        .getElementById(
            "toolModal"
        )
        .classList
        .remove("show");
    showRack(
        activeDrawer
    );

};


/* =====================================================
   CLOSE TOOL
===================================================== */

window.closeTool=
function(){
    document
        .getElementById(
            "toolModal"
        )
        .classList
        .remove("show");

};


/* =====================================================
   TROLLEY CONTROLS
===================================================== */

window.rotateLeft=
function(){
    trolley.rotation.y+=.15;
};


window.rotateRight=
function(){
    trolley.rotation.y-=.15;

};


window.rotateUp=
function(){
    trolley.rotation.x-=.08;

};


window.rotateDown=
function(){
    trolley.rotation.x+=.08;

};


window.zoomIn=
function(){
    camera.position.multiplyScalar(
        .9
    );

};


window.zoomOut=
function(){
    camera.position.multiplyScalar(
        1.1
    );

};


window.resetCamera=
function(){
    trolley.rotation.set(
        0,
        0,
        0
    );
    camera.position.set(
        9,
        6,
        14
    );
    controls.target.set(
        0,
        4.7,
        0
    );
    controls.update();

};


/* =====================================================
   MAIN ANIMATION
===================================================== */

function animate(){
    requestAnimationFrame(
        animate
    );
    controls.update();
    renderer.render(
        scene,
        camera
    );

}


/* =====================================================
   RESIZE
===================================================== */

function resize(){
    camera.aspect=
        window.innerWidth/
        window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
    if(
        toolRenderer &&
        toolCamera
    ){

        const container=
            document.getElementById(
                "toolViewer"
            );

        if(container){

            toolCamera.aspect=
                container.clientWidth/
                container.clientHeight;
            toolCamera.updateProjectionMatrix();
            toolRenderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
        }
    }  
}

window.finishQuizSession = function(){
    document.getElementById("quizSummaryModal").classList.remove("show");
    document.getElementById("quizModal").classList.remove("show");
};
