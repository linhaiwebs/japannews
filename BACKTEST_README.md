# バックテストシステム（Backtesting System）

## 概要

このバックテストシステムは、過去の株価データを使用して投資戦略のパフォーマンスを検証するためのフルスタックアプリケーションです。

## 主な機能

### 1. データ取得とキャッシング
- Yahoo Finance APIから過去の株価データを取得
- Supabaseデータベースにデータをキャッシュして高速化
- 自動的にデータの検証とクリーニングを実施

### 2. 技術指標の計算
- 単純移動平均線（SMA）
- 相対力指数（RSI）
- ボリンジャーバンド
- MACD（移動平均収束拡散法）

### 3. 戦略テンプレート
事前定義された5つの取引戦略：
1. **SMA Golden Cross** - 移動平均線のゴールデンクロス戦略
2. **RSI Oversold/Overbought** - RSIの過熱・過冷却戦略
3. **Bollinger Bands Breakout** - ボリンジャーバンド突破戦略
4. **MACD Signal Cross** - MACDシグナルクロス戦略
5. **Multi-Indicator Combo** - 複合インジケーター戦略

### 4. パフォーマンス指標
- シャープレシオ
- 最大ドローダウン
- 勝率
- プロフィットファクター
- 平均利益/損失
- 連続勝利/損失回数

## アーキテクチャ

### フロントエンド
- **React + TypeScript** - UI開発
- **Recharts** - データビジュアライゼーション
- **Tailwind CSS** - スタイリング

### バックエンド
- **Express.js** - APIサーバー
- **Supabase** - データベースとキャッシング
- **Yahoo Finance API** - 株価データ取得

### データベーススキーマ

#### stock_historical_prices
過去の株価データを保存。Yahoo Financeから取得したデータをキャッシュ。

#### technical_indicators_cache
計算済みの技術指標をキャッシュして再計算を避ける。

#### strategy_templates
戦略のロジックとデフォルトパラメータを定義。

#### backtest_results
各バックテスト実行の結果を保存。

#### backtest_trades
バックテスト中の個別取引記録。

#### backtest_performance_metrics
詳細なパフォーマンス指標。

#### user_backtest_history
ユーザーのバックテスト実行履歴。

## API エンドポイント

### POST /api/backtest/execute
バックテストを実行します。

**リクエスト:**
```json
{
  "stockCode": "7203",
  "strategyId": "uuid",
  "strategyParams": {},
  "startDate": "2019-01-01",
  "endDate": "2024-01-01"
}
```

**レスポンス:**
```json
{
  "success": true,
  "backtest_id": "uuid",
  "results": {
    "initial_capital": 1000000,
    "final_capital": 1250000,
    "total_return": 25.0,
    "trade_count": 45,
    "performance_metrics": {...},
    "monthly_returns": [...],
    "trades": [...],
    "portfolio_value": [...]
  }
}
```

### GET /api/backtest/strategies
利用可能な戦略テンプレートを取得します。

### GET /api/backtest/result/:backtestId
特定のバックテスト結果を取得します。

## バックテストエンジンの仕組み

### 1. データ準備
```javascript
const prices = await getHistoricalPrices(stockCode, startDate, endDate);
const validPrices = await validateAndCleanData(prices);
```

### 2. 技術指標の計算
```javascript
const indicators = calculateAllIndicators(prices, strategyParams);
```

### 3. シグナル生成
各日の価格データと技術指標に基づいて、買い/売り/ホールドシグナルを生成。

### 4. 取引実行
- ポジションサイズ: デフォルト20%の資金
- 手数料: 0.1%
- スリッページ: 0.1%

### 5. パフォーマンス計算
- 日次リターンの計算
- シャープレシオの算出
- ドローダウンの追跡
- 取引統計の集計

## 使用方法

### フロントエンド

1. `/backtest`ページにアクセス
2. 銘柄コードを入力（例: 7203）
3. 戦略テンプレートを選択
4. 日付範囲を設定（デフォルト: 過去5年）
5. 「バックテストを実行」ボタンをクリック

### プログラマティック使用

```typescript
import { executeBacktest } from './lib/backtestClient';

const results = await executeBacktest({
  stockCode: '7203',
  strategyId: 'strategy-uuid',
  startDate: '2019-01-01',
  endDate: '2024-01-01'
});

console.log('Total Return:', results.results.total_return);
```

## パフォーマンスの最適化

### キャッシング戦略
1. 株価データはSupabaseにキャッシュ
2. 同じ日付範囲のリクエストは自動的にキャッシュから取得
3. 80%以上のデータがキャッシュにある場合、APIコールをスキップ

### データベースインデックス
- `(stock_code, trading_date)` の複合インデックス
- 日付範囲クエリの最適化

## 制限事項

### データ取得
- Yahoo Finance APIのレート制限に注意
- 一部の銘柄では古いデータが利用できない場合がある
- 市場休場日はデータなし

### バックテスト精度
- 実際の取引では価格変動が大きい場合がある
- 流動性やマーケットインパクトは考慮されていない
- ルックアヘッドバイアスに注意が必要

## 重要な注意事項

⚠️ **免責事項**
- バックテスト結果は過去のデータに基づく統計的検証です
- 過去のパフォーマンスは将来の結果を保証しません
- 実際の投資判断は必ずご自身の責任で行ってください
- 本システムは投資助言や推奨ではありません

## 今後の拡張予定

- [ ] より多くの戦略テンプレート
- [ ] カスタム戦略の作成機能
- [ ] ポートフォリオ最適化
- [ ] リスク管理機能の強化
- [ ] リアルタイムデータの統合
- [ ] PDF/Excelレポート生成
