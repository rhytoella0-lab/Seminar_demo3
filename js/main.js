import * as pdfjsLib from
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";
console.log("window.pages:", window.pages);
const pages = window.pages;
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
const otherModeImage =
  document.getElementById("otherModeImage");
const modeImage =
  document.querySelector(".mode-image");

const gameScreen =
  document.querySelector(".game-screen");

gameScreen.classList.add("welcome-active");

  const modeExplanationButton =
  document.getElementById("modeExplanationButton");
  // =====================
// メインメニューのモードアイコンを開く
// =====================

const currentModeIcon =
  document.getElementById("currentModeIcon");

otherModeImage.addEventListener("click", (event) => {
  
  // 親の currentModeIcon へクリックを伝えない
  event.stopPropagation();
  
  console.log("別モード画像がクリックされました");
  
  // 現在のモードを反対のモードへ変更
  if (currentMode === "beginner") {
    
    currentMode = "advanced";
    
    currentModeImage =
      "images/for_difficult_book.png";
    
  } else if (currentMode === "advanced") {
    
    currentMode = "beginner";
    
    currentModeImage =
      "images/for_beginner_book.png";
    
  }
  
  console.log("現在のモード:", currentMode);
  console.log("現在のモード画像:", currentModeImage);
  
  // ゲームスタートの文字を更新
  updateGameStartLabel();
  
  // モード解説の文字を更新
  updateModeExplanationButton();
  
  showCurrentModeIcon();
  
  // 切り替えUIを閉じる
  gameScreen.classList.remove("mode-switch-open");
  
});
document.addEventListener("pointerdown", (event) => {
  
  gameScreen.focus();
  
  // モード切り替えUIが開いている場合
  if (gameScreen.classList.contains("mode-switch-open")) {
    
    // currentModeIconの中をクリックしていない場合
    if (!currentModeIcon.contains(event.target)) {
      
      gameScreen.classList.remove("mode-switch-open");
      
    }
    
  }
  
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
let isModeSwitcherOpen = false;
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
if (page === "beginnerExplanation") {
  
  if (currentMode === "advanced") {
    openPage("advancedExplanation");
    return;
  }
  
}

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
  
  modeImage.style.display = "flex";
  
  modeMenu.style.display = "block";
  
  gameScreen.classList.add("mode-select-active");
  
}

// =====================
// メインメニュー追加画像
// =====================

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
      
      currentModeImage =
        "images/for_beginner_book.png";
      
    }
    
    if (currentMode === "advanced") {
      
      currentModeImage =
        "images/for_difficult_book.png";
      
    }
    
    // ゲームスタートの文字を更新
    updateGameStartLabel();
    
    // モード解説の文字も更新
    updateModeExplanationButton();
    
    showCurrentModeIcon();
    
    playModeSelectSE();
    
    enterMainMenu();
    
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
  
  currentModeImage =
    "images/for_beginner_book.png";
  
  // ゲームスタートの文字を更新
  updateGameStartLabel();
  
  // モード解説の文字を更新
  updateModeExplanationButton();
  
  showCurrentModeIcon();
  
  modeSelectSE.currentTime = 0;
  modeSelectSE.play().catch(() => {});
  
  enterMainMenu();
});

document.getElementById("advancedIcon")
  .addEventListener("click", () => {
    
    currentMode = "advanced";
    
    currentModeImage =
      "images/for_difficult_book.png";
    
    // ゲームスタートの文字を更新
    updateGameStartLabel();
    
    // モード解説の文字を更新
    updateModeExplanationButton();
    
    showCurrentModeIcon();
    
    changeModeCursor(1);
    
    playModeSelectSE();
    
    enterMainMenu();
    
  });
// =====================
// ページ表示
// =====================

function openPage(page) {
  
  gameState = "page";
  
  console.log("openPage実行:", page);
  
// =====================
// ゲーム画面の状態をリセット
// =====================

gameScreen.classList.remove("welcome-active");
gameScreen.classList.remove("game-start-active");
gameScreen.classList.remove("game-start-fade");
gameScreen.classList.remove("main-menu-active");
gameScreen.classList.remove("mode-select-active");
gameScreen.classList.remove("picture-scroll-active");
gameScreen.classList.remove("mode-switch-open");

isModeSwitcherOpen = false;

  // =====================
  // モードアイコンをいったん消す
  // =====================
  
  currentModeIcon.style.display = "none";
  otherModeImage.style.display = "none";
  
  
  // =====================
  // モード選択・メインメニューを隠す
  // =====================
  
  modeSelect.style.display = "none";
  mainMenu.style.display = "none";
  
// ==================================================
// ゲームスタート
// ==================================================
if (page === "try") {
  
  // ゲームスタート演出を完全にリセット
  gameScreen.classList.remove("game-start-active");
  gameScreen.classList.remove("game-start-fade");
  
  // アニメーションを強制的にリセット
  void gameScreen.offsetWidth;
  
  // ゲームスタート背景にする
  gameScreen.classList.add("game-start-active");
  
  // 背景フェード開始
  gameScreen.classList.add("game-start-fade");
  
  // ウィンドウの中身を作る
  pageContent.innerHTML = `
    <h1></h1>
    <p></p>
    <button class="back">戻る</button>
  `;
  
  
  pageContent.style.display = "block";
  pageContent.classList.remove("active");
  
  
  const title =
    pageContent.querySelector("h1");
  
  const text =
    pageContent.querySelector("p");
  
  const back =
    pageContent.querySelector(".back");
  
  
  // ========================================
  // 最終的な文章を先に入れて
  // ウィンドウの最終サイズを確定させる
  // ========================================
  
  title.textContent = pages[page].title;
  text.textContent = pages[page].text;
  
  title.style.visibility = "hidden";
  text.style.visibility = "hidden";
  
  
  // 戻るボタン
  back.addEventListener("click", () => {
    
    enterMainMenu();
    
  });
  
  
  // ========================================
  // 2秒後に文字表示開始
  // ========================================
  
  setTimeout(() => {
    
    pageContent.classList.add("active");
    
    keepFocus();
    
    // タイトルを表示
    title.style.visibility = "visible";
    
    // 本文をいったん空にしてから
    // 文字打ち込み開始
    text.style.visibility = "visible";
    
    typeWriter(
      text,
      pages[page].text,
      50
    );
    
  }, 2000);
  
  
  return;
  
}
  // ==================================================
  // 絵まきページ
  // ==================================================
  
  if (page === "pictureScroll") {
    
    openPictureScroll();
    
    return;
    
  }
  
  
  // ==================================================
  // モード解説
  // ==================================================
  
  if (page === "modeExplanation") {
    
    pageContent.classList.add("active");
    
    pageContent.style.display = "block";
    
    mainMenu.style.display = "none";
    
    pageContent.innerHTML = `
      <h1></h1>
      <p></p>
      <button class="back">戻る</button>
    `;
    
    
    const title =
      pageContent.querySelector("h1");
    
    const text =
      pageContent.querySelector("p");
    
    
    title.textContent = "モード解説";
    
    
    if (currentMode === "beginner") {
      
      text.textContent = "コクヨ版の細かい解説です";
      
    } else if (currentMode === "advanced") {
      
      text.textContent = "その他版の細かい解説です";
      
    }
    
    
    const back =
      pageContent.querySelector(".back");
    
    
    back.addEventListener("click", () => {
      
      enterMainMenu();
      
    });
    
    
    return;
    
  }
  
  
  // ==================================================
  // 通常ページ
  // ==================================================
  
  pageContent.classList.add("active");
  
  pageContent.style.display = "block";
  
  
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
    
    enterMainMenu();
    
  });
  
}

keepFocus();

// =====================
// メインメニューへ戻る
// =====================

function enterMainMenu() {
  
  console.log("メインメニューへ戻ります");
  
  // ---------------------
  // 表示状態
  // ---------------------
  
  modeSelect.style.display = "none";
  
  hideModeImage();
  
  modeMenu.style.display = "none";
  
  pageContent.style.display = "none";
  
  mainMenu.style.display = "block";
  
  mainMenu.classList.add("show");
  
  
  // ---------------------
  // ゲーム画面の状態を完全にリセット
  // ---------------------
  
  gameState = "menu";
  
  gameScreen.classList.remove("welcome-active");

gameScreen.classList.remove("game-start-active");
gameScreen.classList.remove("game-start-fade");

gameScreen.classList.remove("mode-select-active");
  
  gameScreen.classList.remove("picture-scroll-active");
  
  gameScreen.classList.remove("mode-switch-open");
  
  
  // ---------------------
  // メインメニュー用の背景
  // ---------------------
  
  gameScreen.classList.add("main-menu-active");
  
  // メインメニューに戻ったらモードアイコンを表示
currentModeIcon.style.display = "block";
otherModeImage.style.display = "";
  
  // ---------------------
  // 選択状態をリセット
  // ---------------------
  
  menuItems.forEach((item) => {
    
    item.classList.remove("pressed");
    
  });
  
  isSelected = false;
  
  
  // ---------------------
  // フォーカス
  // ---------------------
  
  setTimeout(() => {
    
    keepFocus();
    
  }, 50);
  
}
// =====================
// 現在モードアイコン表示
// =====================
function showCurrentModeIcon() {
  
  const icon =
    document.getElementById("currentModeIcon");
  
  const image =
    document.getElementById("currentModeImage");
  
  icon.style.display = "none";
  
  image.src = currentModeImage;
  
  // 選ばれていない方の画像を設定
  if (currentMode === "beginner") {
    
    otherModeImage.src =
      "images/for_difficult_book.png";
    
  }
  
  if (currentMode === "advanced") {
    
    otherModeImage.src =
      "images/for_beginner_book.png";
    
  }
  
  // 最初は閉じた状態にする
  gameScreen.classList.remove(
    "mode-switch-open"
  );
  
  icon.style.display = "block";
}
function updateModeExplanationButton() {
  
  if (currentMode === "beginner") {
    
    modeExplanationButton.textContent =
      "コクヨ版実際のやり方";
    
  }
  
  if (currentMode === "advanced") {
    
    modeExplanationButton.textContent =
      "その他版実際のやり方";
    
  }
  
}

// =====================
// ゲームスタートの文字をモードに合わせて変更
// =====================

function updateGameStartLabel() {
  
  const gameStartItem =
    document.querySelector('#mainMenu li[data-page="try"]');
  
  if (!gameStartItem) {
    return;
  }
  
  if (currentMode === "beginner") {
    
    gameStartItem.textContent =
      "コクヨ版RPG風";
    
  }
  
  if (currentMode === "advanced") {
    
    gameStartItem.textContent =
      "その他版RPG風";
    
  }
  
}

currentModeIcon.addEventListener("click", () => {
  
  // 開いている場合
  if (isModeSwitcherOpen) {
    
    // 左へ戻す
    gameScreen.classList.remove("mode-switch-open");
    
    isModeSwitcherOpen = false;
    
    console.log("モード切替UI: 閉じる");
    
    return;
  }
  
  
  // 閉じている場合
  gameScreen.classList.add("mode-switch-open");
  
  isModeSwitcherOpen = true;
  
  console.log("モード切替UI: 開く");
  
});
startMessage.addEventListener("click", () => {
  
  selectSE.currentTime = 0;
  
  selectSE.play();
  
  startBGM();
  
  startMessage.style.display = "none";

gameScreen.classList.remove("welcome-active");

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

        <!-- 左側：社会連携・熱意など -->

        <div class="picture-scroll-title">

          <img
            src="images/tab_bg.png"
            alt="作品"
          >

          <span>
            社会連携・熱意など
          </span>

        </div>


        <!-- 右側：タブ -->

        <div class="picture-scroll-tab-buttons">

          <button
            class="picture-scroll-tab active"
            data-tab="pictureTab1"
          >
            社会連携
          </button>

          <button
            class="picture-scroll-tab"
            data-tab="pictureTab2"
          >
            熱意
          </button>

          <button
            class="picture-scroll-tab"
            data-tab="pictureTab3"
          >
            その他？
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
  
  enterMainMenu();
  
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
