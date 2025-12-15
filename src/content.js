/**
 * Nico Ads Skip - ニコニコ動画広告スキップ
 */

console.log('[NicoAdsSkip] 拡張機能が読み込まれました');

let adSkip = null;

/**
 * 広告スキップ処理
 */
function skip() {
  const videos = document.getElementsByTagName('video');

  // スキップボタンがあればクリック
  clickSkipButton();

  // 2番目以降のvideo要素（広告）をチェック
  for (let i = 1; i < videos.length; i++) {
    const adVideo = videos[i];
    if (adVideo && adVideo.src !== "") {
      console.log('[NicoAdsSkip] 広告検出！スキップします');

      // 広告を最後までスキップ
      if (adVideo.duration) {
        adVideo.currentTime = adVideo.duration;
      }

      // 終了イベントを発火
      adVideo.dispatchEvent(new Event('ended'));

      // 停止・無効化
      adVideo.src = "";
      adVideo.pause();
      adVideo.style.display = "none";

      console.log('[NicoAdsSkip] 広告スキップ完了');
    }
  }

  // メイン動画が一時停止中なら再生
  if (videos[0] && videos[0].paused && videos[0].src) {
    videos[0].play().catch(() => {});
  }
}

/**
 * スキップボタンを探してクリック
 */
function clickSkipButton() {
  // 様々なスキップボタンのセレクタを試す
  const selectors = [
    '[class*="skip"]',
    '[class*="Skip"]',
    '[data-click-action*="skip"]',
    'button[class*="ad"]',
    '.SkipButton',
    '.skip-button',
    '[aria-label*="スキップ"]',
    '[aria-label*="skip"]'
  ];

  for (const selector of selectors) {
    const buttons = document.querySelectorAll(selector);
    for (const btn of buttons) {
      if (btn.offsetParent !== null) {  // 表示されている要素のみ
        console.log('[NicoAdsSkip] スキップボタンをクリック');
        btn.click();
        return true;
      }
    }
  }
  return false;
}

/**
 * 広告監視を開始
 */
function startSkip() {
  if (adSkip) {
    clearInterval(adSkip);
  }
  console.log('[NicoAdsSkip] 広告監視開始');
  adSkip = setInterval(skip, 100);

  // 60秒後にタイムアウト
  setTimeout(() => {
    if (adSkip) {
      clearInterval(adSkip);
      adSkip = null;
      console.log('[NicoAdsSkip] タイムアウトで監視停止');
    }
  }, 60000);
}

// ページ読み込み時に開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startSkip);
} else {
  startSkip();
}

// URL変更検出（SPA対応）
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('[NicoAdsSkip] ページ遷移検出');
    startSkip();
  }
});

// bodyが存在する場合のみ監視開始
function startUrlObserver() {
  if (document.body) {
    urlObserver.observe(document.body, { childList: true, subtree: true });
    console.log('[NicoAdsSkip] URL監視開始');
  }
}

if (document.body) {
  startUrlObserver();
} else {
  document.addEventListener('DOMContentLoaded', startUrlObserver);
}
