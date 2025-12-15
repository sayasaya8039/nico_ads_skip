/**
 * Nico Ads Skip - ニコニコ動画広告スキップ
 * 参考: https://qiita.com/gmnori/items/68695a5765e1bd68ca8d
 */

let adSkip = null;

/**
 * 広告スキップ処理（シンプル版）
 * videoタグの2つ目のsrcを消すだけ
 */
function skip() {
  const videos = document.getElementsByTagName('video');

  if (videos[1] == null) {
    // 広告なし
  } else if (videos[1].src != "") {
    // 広告検出 → srcを消す
    videos[1].src = "";
    clearInterval(adSkip);
    adSkip = null;
  }
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
