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

  // 2番目のvideo要素（広告）をチェック
  if (videos[1] == null) {
    // 広告なし
  } else if (videos[1].src != "") {
    console.log('[NicoAdsSkip] 広告検出！スキップします');

    // 広告動画を停止・無効化
    videos[1].src = "";
    videos[1].pause();
    videos[1].style.display = "none";
    videos[1].remove();  // DOM から削除

    // メイン動画を再生
    if (videos[0]) {
      videos[0].muted = false;
      videos[0].play().catch(() => {});
      console.log('[NicoAdsSkip] メイン動画再生開始');
    }

    clearInterval(adSkip);
    adSkip = null;
    console.log('[NicoAdsSkip] 広告スキップ完了');
  } else if (videos[1]) {
    // srcが空でも広告要素があれば即座に非表示
    videos[1].style.display = "none";
    videos[1].muted = true;
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
