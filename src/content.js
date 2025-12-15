/**
 * Nico Ads Skip - ニコニコ動画広告スキップ
 */

console.log('[NicoAdsSkip] 拡張機能が読み込まれました');

let adSkip = null;

/**
 * 広告スキップ処理（ユーザー提供のロジック）
 */
function skip() {
  const videos = document.getElementsByTagName('video');

  // デバッグ: video要素の数と状態を出力
  console.log('[NicoAdsSkip] video要素数:', videos.length);
  for (let i = 0; i < videos.length; i++) {
    console.log(`[NicoAdsSkip] video[${i}] src:`, videos[i].src ? videos[i].src.substring(0, 50) + '...' : '(empty)');
  }

  // 2番目のvideo要素（広告）をチェック
  if (videos[1] == null) {
    // 広告なし
  } else if (videos[1].src != "") {
    console.log('[NicoAdsSkip] 広告検出！スキップします');
    videos[1].src = "";
    videos[1].pause();
    clearInterval(adSkip);
    adSkip = null;
    console.log('[NicoAdsSkip] 広告スキップ完了');
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
