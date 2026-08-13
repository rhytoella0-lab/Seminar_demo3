import * as pdfjsLib from
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";
const menuItems = document.querySelectorAll("#mainMenu li");
const commandWindow =
  document.querySelector(".command-window");
const menu = document.querySelector("#mainMenu");
const startMessage = document.getElementById("startMessage");
const mainMenu = document.getElementById("mainMenu");
const modeSelect = document.getElementById("modeSelect");
const modeMenuItems = document.querySelectorAll("#modeMenu li");
console.log("モード数:", modeMenuItems.length);
const modeMenu = document.getElementById("modeMenu");
const beginnerIcon =
  document.getElementById("beginnerIcon");
const advancedIcon =
  document.getElementById("advancedIcon");
const gameScreen =
  document.querySelector(".game-screen");

document.addEventListener("pointerdown", () => {
  gameScreen.focus();
});
const pageContent =
  document.getElementById("pageContent");

let current = 0;
let isSelected = false;
let gameState = "start";
let currentMode = "";
let currentModeImage = "";
let scrollData = [];
let currentTab = 0;
// =====================
// BGM（Web Audio API）
// =====================

const bgm = new Audio("./sounds/bgm.mp3");

bgm.loop = true;

const audioContext = new AudioContext();

const bgmSource =
  audioContext.createMediaElementSource(bgm);

const bgmGain =
  audioContext.createGain();

bgmSource.connect(bgmGain);

bgmGain.connect(audioContext.destination);

bgmGain.gain.value = 0;


// 端末によるBGM音量調整
let bgmMaxVolume = 0.07;

if (/iPhone|iPod/.test(navigator.userAgent)) {
  
  bgmMaxVolume = 0.07;
  
}
// =====================
// SE読み込み
// =====================
const selectSE = new Audio("./sounds/decision.mp3");
selectSE.volume = 0.5;
const modeSelectSE = new Audio("./sounds/book_decision.mp3");
modeSelectSE.volume = 0.5;
const textSE = new Audio("./sounds/text.mp3");
textSE.volume = 0.7;

const moveSE = new Audio("./sounds/text.mp3");
moveSE.volume = 0.3;

const textLoopSE = new Audio("./sounds/text_loop.mp3");

textLoopSE.loop = true;

textLoopSE.preload = "auto";

textLoopSE.volume = 0.9;

function playMoveSE() {
  
  const se = moveSE.cloneNode();
  
  se.volume = 0.7;
  
  se.play()
    .catch(() => {});
  
}

function playSelectSE() {
  
  selectSE.currentTime = 0;
  
  selectSE.play()
    .catch(() => {});
  
}


function playModeSelectSE() {
  
  modeSelectSE.currentTime = 0;
  
  modeSelectSE.play()
    .catch(() => {});
  
}
function keepFocus() {
  
  gameScreen.focus();
  
}

function playTextSE() {
  
  const se = textSE.cloneNode();
  
  se.volume = 0.7;
  
  se.play()
    .catch(() => {});
  
}

function startBGM() {
  
  audioContext.resume();
  
  bgmGain.gain.value = 0;
  
  bgm.play()
    .then(() => {
      
      console.log("BGM再生OK");
      
      
      let volume = 0;
      
      
      const fadeIn = setInterval(() => {
        
        
        volume += 0.005;
        
        
        if (volume >= bgmMaxVolume) {
  
  volume = bgmMaxVolume;
  
  clearInterval(fadeIn);
  
}

        bgmGain.gain.value = volume;
        
      }, 100);
      
    })
    .catch((error) => {
      
      console.log("BGM再生失敗");
      console.log(error);
      
    });
  
}

// =====================
// 初期カーソル
// =====================

if (menuItems.length > 0) {

  menuItems[current]
    .classList.add("selected");

}



// =====================
// マウス操作
// =====================
menuItems.forEach((item, index) => {
  
  
  // カーソル移動
  
  item.addEventListener(
    "mouseenter",
    () => {
      
      changeCursor(index);
      
    }
  );
  // 決定
  
  item.addEventListener(
  "click",
  () => {
    
    selectItem(index);
    
  }
);
});
/*menuItems.forEach((item, index) => {
  
  item.addEventListener("pointerdown", () => {
    
    changeCursor(index);
    
  });
  
});*/
menuItems.forEach((item, index) => {
  
  item.addEventListener("pointerenter", () => {
    
    changeCursor(index);
    
  });
  
});

menu.addEventListener("pointermove", (event) => {
  
  const target = document.elementFromPoint(
    event.clientX,
    event.clientY
  );
  
  const item = target.closest(".menu li");
  
  if (!item) {
    return;
  }
  
  const index = Array.from(menuItems).indexOf(item);
  
  changeCursor(index);
  
});

function selectItem(index) {
  
  console.log("メニュー選択:", index);
  
  if (isSelected) {
    return;
  }
  
  
  isSelected = true;
  
  
  const item = menuItems[index];
  
  
  item.classList.add("pressed");
  
  
  playSelectSE();
const page = item.dataset.page;

setTimeout(() => {
  
  openPage(page);
  
  isSelected = false;
  
}, 1000);
  
}
/*window.addEventListener(
    "keydown",
    (event) => {
      
      console.log("押されたキー:", event.key);
      
      
      // ページ中は無視
      if (gameState === "page") {
        return;
      }
    
    if (event.key === "ArrowDown" ||
  event.key === "ArrowRight") {
  
  
  let next = current + 1;
  
  
  if (next >= menuItems.length) {
    next = 0;
  }
  
  
  changeCursor(next);
  
}
if (event.key === "ArrowUp" ||
  event.key === "ArrowLeft") {
  
  
  let next = current - 1;
  
  
  if (next < 0) {
    next = menuItems.length - 1;
  }
  
  
  changeCursor(next);
  
}
    
    
    
    
    if (event.key === "Enter") {
  
  
  // まだスタート前なら
 if (gameState === "start") {
  
  selectSE.currentTime = 0;
  selectSE.play();
  
  startBGM();
 startMessage.style.display = "none";

mainMenu.classList.add("show");

gameState = "menu";

current = 0;

menuItems.forEach(item => {
  item.classList.remove("selected");
});

menuItems[0].classList.add("selected");

keepFocus();

return;
  
}
  
  
  // スタート後なら決定
  selectItem(current);
  
  
}
    
    
  }
);*/


// =====================
// カーソル変更
// =====================
function changeCursor(index) {
  
  
  if (!menuItems[index]) {
    return;
  }
    if (current === index) {
    return;
  }
  
  // 前の選択を消す
  
  menuItems.forEach((item) => {
    
    item.classList.remove("selected");
    
  });
  
  
  // 新しい選択を付ける
  
  current = index;
  
  menuItems[current]
    .classList.add("selected");
  
  
  playMoveSE();
  
}

function typeWriter(element, text, speed, callback) {
  
  element.textContent = "";
  
  let i = 0;
  
  
  textLoopSE.currentTime = 0;
  
  textLoopSE.play()
    .catch(() => {});
  
  
  setTimeout(() => {
    
    
    const timer = setInterval(() => {
      
      element.textContent += text.charAt(i);
      
      i++;
      
      
      if (i >= text.length) {
        
        clearInterval(timer);
        
        textLoopSE.pause();
        
        textLoopSE.currentTime = 0;
        
        if (callback) {
          callback();
        }
        
      }
      
      
    }, speed);
    
    
  }, 80);
  
}

function hideModeImagesOnly() {
  
  beginnerIcon.style.display = "none";
  advancedIcon.style.display = "none";
  
  document.querySelectorAll(".mode-card")
    .forEach(card => {
      card.classList.remove("image-selected");
    });
  
}
function hideModeImage() {
  
  const modeImage = document.querySelector(".mode-image");
  
  if (!modeImage) return;
  
  modeImage.style.display = "none";
  
}

function showModeSelect() {
  
  mainMenu.style.display = "none";
  
  pageContent.style.display = "none";
  
  modeSelect.style.display = "block";
  
  document.querySelector(".mode-image").style.display = "flex";
  
  modeMenu.style.display = "block";
  
  document.querySelector(".game-screen")
    .classList.add("mode-select-active");
  
}

// =====================
// メインメニュー追加画像
// =====================

function showMenuOverlayImage() {
  
  gameScreen.classList.add("menu-image-active");
  
}

function hideMenuOverlayImage() {
  
  gameScreen.classList.remove("menu-image-active");
  
}

let modeCurrent = 0;


// 初期カーソル
if (modeMenuItems.length > 0) {
  
  modeMenuItems[0].classList.add("selected");
  
}


// モードカーソル移動
modeMenuItems.forEach((item, index) => {
  
  item.addEventListener("pointerenter", () => {
    
    changeModeCursor(index);
    
  });
  
  
});

function changeModeCursor(index) {
  
  if (!modeMenuItems[index]) {
    return;
  }

  modeMenuItems.forEach((item) => {
    
    item.classList.remove("selected");
    
  });


  modeCurrent = index;


  modeMenuItems[index]
    .classList.add("selected");


  // 画像の上下移動も同期
document.querySelectorAll(".mode-card")
  .forEach(card => {
    card.classList.remove("image-selected");
  });

if (index === 0) {
  beginnerIcon.closest(".mode-card")
    .classList.add("image-selected");
}

if (index === 1) {
  advancedIcon.closest(".mode-card")
    .classList.add("image-selected");
}
  playMoveSE();
  
}

modeMenuItems.forEach((item) => {
  
  item.addEventListener("click", () => {
    
    currentMode = item.dataset.mode;
    
        if (currentMode === "beginner") {
      
      currentModeImage = "images/for_beginner_book.png";
      
    }
    
    if (currentMode === "advanced") {
      
      currentModeImage = "images/for_difficult_book.png";
      
    }
    showCurrentModeIcon();

  playModeSelectSE();
    
    modeSelect.style.display = "none";

hideModeImage();

modeMenu.style.display = "none";
mainMenu.style.display = "block";

mainMenu.classList.add("show");

gameScreen.classList.add("main-menu-active");

showMenuOverlayImage();
    
    keepFocus();
    
  });
  
});
// =====================
// 画像カーソル連動
// =====================

// 入門画像
beginnerIcon.addEventListener("mouseenter", () => {

  changeModeCursor(0);

  beginnerIcon.closest(".mode-card").classList.add("image-selected");

});


// 応用画像
advancedIcon.addEventListener("mouseenter", () => {
  
  changeModeCursor(1);
  
  advancedIcon.closest(".mode-card").classList.add("image-selected");
  
});


// 入門画像から離れた時
beginnerIcon.addEventListener("mouseleave", () => {
  
  beginnerIcon.closest(".mode-card")
    .classList.remove("image-selected");
  
});

// 応用画像から離れた時
advancedIcon.addEventListener("mouseleave", () => {
  
  advancedIcon.closest(".mode-card").classList.remove("image-selected");
  
});

beginnerIcon.addEventListener("click", () => {
  
  currentMode = "beginner";
  
  currentModeImage = "images/for_beginner_book.png";
  
  showCurrentModeIcon();
  
  modeSelectSE.currentTime = 0;
  modeSelectSE.play().catch(() => {});
  
  modeSelect.style.display = "none";
  
  hideModeImage();
  document.querySelector(".mode-image").style.display = "none";
  gameScreen.classList.remove("mode-select-active"); // ←これを追加
  
  modeMenu.style.display = "none";
  
  mainMenu.style.display = "block";
  
  mainMenu.classList.add("show");
  
  gameScreen.classList.add("main-menu-active");
  
  
  
  keepFocus();
  
});
document.getElementById("advancedIcon")
  .addEventListener("click", () => {
    
    currentMode = "advanced";
    
    currentModeImage = "images/for_difficult_book.png";
    
    showCurrentModeIcon();
    
    changeModeCursor(1);
    
    playModeSelectSE();
    
    hideModeImage();
    
    document.querySelector(".mode-image").style.display = "none";
    
    modeSelect.style.display = "none";
    
    gameScreen.classList.remove("mode-select-active");
    
    modeMenu.style.display = "none";
mainMenu.style.display = "block";

mainMenu.classList.add("show");

gameScreen.classList.add("main-menu-active");

showMenuOverlayImage();

keepFocus();
    
  });
keepFocus();


// =====================
// ページ表示
// =====================

function openPage(page) {
  
  gameState = "page";
  
  console.log("openPage実行", page)
  
  modeSelect.style.display = "none";
  
  mainMenu.style.display = "none";
hideMenuOverlayImage();

pageContent.style.display = "block";
  
  if (page === "pictureScroll") {
  
  openPictureScroll();
  
  return;
  
}
  pageContent.classList.add("active");
  
  pageContent.innerHTML = `
    <h1></h1>
    <p></p>
    <button class="back">戻る</button>
  `;
  
  const title =
    pageContent.querySelector("h1");
  
  const text =
    pageContent.querySelector("p");
  
 // タイトルは最初から表示

title.textContent = pages[page].title;


// 本文だけ一文字ずつ表示

typeWriter(
  text,
  pages[page].text,
  50
);

setTimeout(() => {
  keepFocus();
}, 50);
  
  const back =
    pageContent.querySelector(".back");
  
  back.addEventListener("click", () => {
      gameState = "menu";
      pageContent.style.display = "none";
      
      pageContent.classList.remove("active");
      
      mainMenu.style.display = "block";
      
      showMenuOverlayImage();
  
  menuItems.forEach((item) => {
    
    item.classList.remove("pressed");
    
  });
  
 isSelected = false;

setTimeout(() => {
  keepFocus();
}, 50);
});
}

keepFocus();


// =====================
// 現在モードアイコン表示
// =====================
function showCurrentModeIcon(){

    const icon =
        document.getElementById("currentModeIcon");

    const image =
        document.getElementById("currentModeImage");

icon.style.display = "none";

    image.src = currentModeImage;

    icon.style.display = "block";
}
startMessage.addEventListener("click", () => {
  
  selectSE.currentTime = 0;
  
  selectSE.play();
  
  startBGM();
  
  startMessage.style.display = "none";
  
  showModeSelect();
  
  setTimeout(() => {
    keepFocus();
  }, 50);
  
});
// =====================
// 絵まきページ
// =====================

function openPictureScroll() {
  
  gameState = "page";
  
  gameScreen.classList.add("picture-scroll-active");
  
  pageContent.style.display = "block";
  
  pageContent.classList.add("active");
  
  pageContent.innerHTML = `

    <div id="pictureScrollScreen">

      <!-- =========================
           上部タブ
      ========================== -->

      <div class="picture-scroll-tabs">

        <!-- 左側：制作順序 -->

        <div class="picture-scroll-title">

          <img
            src="images/tab_bg.png"
            alt="作品"
          >

          <span>
            制作順序
          </span>

        </div>


        <!-- 右側：タブ -->

        <div class="picture-scroll-tab-buttons">

          <button
            class="picture-scroll-tab active"
            data-tab="pictureTab1"
          >
            1
          </button>

          <button
            class="picture-scroll-tab"
            data-tab="pictureTab2"
          >
            2
          </button>

          <button
            class="picture-scroll-tab"
            data-tab="pictureTab3"
          >
            3
          </button>

        </div>

      </div>


      <!-- =========================
           内容
      ========================== -->

      <div class="picture-scroll-contents">


        <!-- タブ1 -->

        <div
          id="pictureTab1"
          class="picture-scroll-content active"
        >

          <div id="pictureScrollPDFViewer"></div>

        </div>


        <!-- タブ2 -->

        <div
          id="pictureTab2"
          class="picture-scroll-content"
        >

          <h2>
            ページ2
          </h2>

          <img
            src="images/animation.png"
            class="picture-scroll-page-image"
            alt="アニメーション画像"
          >

          <p>
            ここに2番目の内容を追加できます。
          </p>

        </div>


        <!-- タブ3 -->

        <div
          id="pictureTab3"
          class="picture-scroll-content"
        >

          <h2>
            ページ3
          </h2>

          <p>
            ここに3番目の内容を追加できます。
          </p>

        </div>


      </div>


      <!-- 戻る -->

      <button
        id="pictureScrollBackButton"
      >
        戻る
      </button>

    </div>

  `;
  
  
  // =====================
  // タブ取得
  // =====================
  
  const pictureTabs =
    document.querySelectorAll(
      ".picture-scroll-tab"
    );
  
  
  const pictureContents =
    document.querySelectorAll(
      ".picture-scroll-content"
    );
  
  
  // =====================
  // タブ切り替え
  // =====================
  
  pictureTabs.forEach((tab) => {
    
    tab.addEventListener("click", () => {
      
      pictureTabs.forEach((t) => {
        
        t.classList.remove("active");
        
      });
      
      
      pictureContents.forEach((content) => {
        
        content.classList.remove("active");
        
      });
      
      
      tab.classList.add("active");
      
      
      const target =
        document.getElementById(
          tab.dataset.tab
        );
      
      
      if (target) {
        
        target.classList.add("active");
        
      }
      
      
      // タブ1ならPDFを読み込む
      
      if (
        tab.dataset.tab ===
        "pictureTab1"
      ) {
        
        loadPictureScrollPDF();
        
      }
      
    });
    
  });
  
  
  // =====================
  // 戻るボタン
  // =====================
  
  const back =
    document.getElementById(
      "pictureScrollBackButton"
    );
  
  
  back.addEventListener("click", () => {
    
    gameState = "menu";
    
    gameScreen.classList.remove("picture-scroll-active");
    
    pageContent.style.display =
      "none";
    
    pageContent.classList.remove(
      "active"
    );
    
    mainMenu.style.display =
      "block";
    
    mainMenu.classList.add("show");
    
    showMenuOverlayImage();
    
    menuItems.forEach((item) => {
      
      item.classList.remove(
        "pressed"
      );
      
    });
    
    
    isSelected = false;
    
    
    setTimeout(() => {
      
      keepFocus();
      
    }, 50);
    
  });
  
  
  // =====================
  // 最初にPDFを読み込む
  // =====================
  
  loadPictureScrollPDF();
  
}// =====================
// 絵まきPDF表示
// =====================

async function loadPictureScrollPDF() {

  const pdfViewer =
    document.getElementById(
      "pictureScrollPDFViewer"
    );


  if (!pdfViewer) {
    return;
  }


  pdfViewer.innerHTML = "";


  try {

    const loadingTask =
      pdfjsLib.getDocument({
        url: "sample.pdf"
      });


    const pdf =
      await loadingTask.promise;


    // PDFの全ページを表示

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {

      const page =
        await pdf.getPage(pageNumber);


      // PDF本来のサイズ

      const originalViewport =
        page.getViewport({
          scale: 1
        });


      // 現在の表示幅

      const viewerWidth =
        pdfViewer.clientWidth;


      // 横幅いっぱいになる倍率

      const scale =
        viewerWidth /
        originalViewport.width;


      // 縦横比を維持

      const viewport =
        page.getViewport({
          scale: scale
        });


      // Canvas作成

      const canvas =
        document.createElement(
          "canvas"
        );


      canvas.className =
        "picture-scroll-pdf-page";


      const context =
        canvas.getContext("2d");


      // 高解像度対応

      const devicePixelRatio =
        window.devicePixelRatio || 1;


      canvas.width =
        Math.floor(
          viewport.width *
          devicePixelRatio
        );


      canvas.height =
        Math.floor(
          viewport.height *
          devicePixelRatio
        );


      canvas.style.width =
        viewport.width + "px";


      canvas.style.height =
        viewport.height + "px";


      pdfViewer.appendChild(canvas);


      // PDF描画

      await page.render({

        canvasContext:
          context,

        viewport:
          viewport,

        transform: [
          devicePixelRatio,
          0,
          0,
          devicePixelRatio,
          0,
          0
        ]

      }).promise;

    }

  }

  catch (error) {

    console.error(
      "絵まきPDFの読み込みに失敗しました。",
      error
    );


    pdfViewer.innerHTML =
      "<p>PDFを読み込めませんでした。</p>";

  }

}
