/**
 * Nico Ads Skip - ニコニコ動画広告スキップ
 */

console.log('[NicoAdsSkip] 拡張機能が読み込まれました');

let adSkipInterval = null;
let adSkipped = false;

/**
 * 動画広告をスキップ
 * 広告は2番目のvideo要素として読み込まれる
 */
function skipVideoAd() {
  const videos = document.getElementsByTagName('video');

  // 2番目のvideo要素（広告）が存在し、srcがある場合
  if (videos[1] && videos[1].src !== '') {
    console.log('[NicoAdsSkip] 動画広告を検出、スキップします');
    videos[1].src = '';
    videos[1].pause();
    adSkipped = true;

    // インターバルを停止
    if (adSkipInterval) {
      clearInterval(adSkipInterval);
      adSkipInterval = null;
      console.log('[NicoAdsSkip] 広告スキップ完了');
    }
  }
}

/**
 * 広告スキップを開始
 */
function startAdSkip() {
  if (adSkipInterval) return;

  adSkipped = false;
  adSkipInterval = setInterval(skipVideoAd, 100);
  console.log('[NicoAdsSkip] 広告監視を開始');

  // 30秒後に自動停止（広告がない場合）
  setTimeout(() => {
    if (adSkipInterval && !adSkipped) {
      clearInterval(adSkipInterval);
      adSkipInterval = null;
      console.log('[NicoAdsSkip] 広告監視をタイムアウトで停止');
    }
  }, 30000);
}

/**
 * スキップボタンがあればクリック
 */
function clickSkipButton() {
  // スキップボタンのセレクター（ニコニコ動画の広告スキップボタン）
  const skipSelectors = [
    '[class*="SkipButton"]',
    '[class*="skip"]',
    '[data-name="skip"]',
    '.AdSkipButton',
    '.SkipAdButton'
  ];

  for (const selector of skipSelectors) {
    const btn = document.querySelector(selector);
    if (btn && btn.offsetParent !== null) {
      console.log('[NicoAdsSkip] スキップボタンをクリック');
      btn.click();
      return true;
    }
  }
  return false;
}

/**
 * 広告関連要素を非表示
 */
function hideAdElements() {
  // 広告コンテナのセレクター
  const adSelectors = [
    '[class*="AdContainer"]',
    '[class*="ad-"]',
    '[class*="Ad-"]',
    '[id*="ad-"]',
    '[class*="Billboard"]',
    '[class*="Promotion"]',
    '.nicoadVideoItem',
    '[class*="InStreamAd"]'
  ];

  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.style.display !== 'none') {
        el.style.display = 'none';
        console.log('[NicoAdsSkip] 広告要素を非表示:', selector);
      }
    });
  });
}

// DOM変更を監視して動的に追加される広告にも対応
const observer = new MutationObserver((mutations) => {
  // スキップボタンを探してクリック
  clickSkipButton();

  // 広告要素を非表示
  hideAdElements();

  // video要素が追加されたら広告チェック
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      const hasVideo = Array.from(mutation.addedNodes).some(
        node => node.nodeName === 'VIDEO' ||
                (node.getElementsByTagName && node.getElementsByTagName('video').length > 0)
      );
      if (hasVideo && !adSkipInterval) {
        startAdSkip();
      }
    }
  }
});

// ページ読み込み完了後に開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    startAdSkip();
    hideAdElements();
  });
} else {
  observer.observe(document.body, { childList: true, subtree: true });
  startAdSkip();
  hideAdElements();
}

// ページ遷移時（SPA対応）
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('[NicoAdsSkip] ページ遷移検出');
    adSkipped = false;
    startAdSkip();
  }
}, 1000);
