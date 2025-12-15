# Nico Ads Skip - ニコ動広告スキップ

ニコニコ動画の動画広告を自動スキップし、バナー広告を非表示にするChrome拡張機能です。

## 機能

- 動画広告の自動スキップ（2番目のvideo要素のsrcをクリア）
- バナー広告・サイドバー広告の非表示（CSS）
- スキップボタンの自動クリック

## インストール

### 開発版（手動インストール）

1. このリポジトリをクローン
2. `python scripts/build.py` でビルド
3. Chromeで `chrome://extensions` を開く
4. 「デベロッパーモード」を有効化
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. `nico_ads_skip` フォルダを選択

## 仕組み

### 動画広告スキップ

ニコニコ動画では広告が2番目のvideo要素として読み込まれます。
この拡張機能は100msごとに2番目のvideo要素をチェックし、
srcがある場合はそれをクリアして広告をスキップします。

```javascript
const videos = document.getElementsByTagName('video');
if (videos[1] && videos[1].src !== '') {
  videos[1].src = '';
}
```

### バナー広告非表示

CSSで広告関連のクラス・IDを持つ要素を非表示にします。

## 開発

```bash
# アイコン生成
python scripts/generate_icons.py

# ビルド
python scripts/build.py
```

## 注意事項

- この拡張機能はニコニコ動画の利用規約に違反する可能性があります
- 自己責任でご利用ください
- コンテンツクリエイターを支援するため、可能であれば広告視聴やプレミアム会員登録をご検討ください

## ライセンス

MIT License
