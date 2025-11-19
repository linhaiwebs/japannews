/*
  # 戦略テンプレートのシードデータ
  
  ## 新規データ追加
  
  ### strategy_templates - 5つの基本的な取引戦略
  
  1. **SMA Golden Cross（移動平均線ゴールデンクロス）**
     - 短期移動平均線が長期移動平均線を上抜けた時に買い
     - 短期移動平均線が長期移動平均線を下抜けた時に売り
     - デフォルトパラメータ: 20日線と50日線
  
  2. **RSI Oversold/Overbought（RSI過熱・過冷却）**
     - RSIが30以下（売られ過ぎ）で買い
     - RSIが70以上（買われ過ぎ）で売り
     - デフォルトパラメータ: RSI期間14日
  
  3. **Bollinger Bands Breakout（ボリンジャーバンド突破）**
     - 価格が下限バンドを下回った時に買い
     - 価格が上限バンドを上回った時に売り
     - デフォルトパラメータ: 20日期間、2標準偏差
  
  4. **MACD Signal Cross（MACDシグナルクロス）**
     - MACDラインがシグナルラインを上抜けた時に買い
     - MACDラインがシグナルラインを下抜けた時に売り
     - デフォルトパラメータ: 12, 26, 9
  
  5. **Multi-Indicator Combo（複合インジケーター）**
     - 複数の指標（SMA、RSI、MACD）を組み合わせ
     - 2つ以上の指標が買いシグナルを示した時に買い
     - 2つ以上の指標が売りシグナルを示した時に売り
*/

INSERT INTO strategy_templates (strategy_name, strategy_description, strategy_logic, default_params, is_active)
VALUES
  (
    'SMA Golden Cross',
    '短期移動平均線と長期移動平均線のクロスオーバーを利用した古典的な戦略。短期線が長期線を上抜ける（ゴールデンクロス）時に買い、下抜ける（デッドクロス）時に売ります。',
    '{"type": "sma_cross", "indicators": ["sma_short", "sma_long"], "entry_condition": "sma_short > sma_long", "exit_condition": "sma_short < sma_long"}',
    '{"sma_short_period": 20, "sma_long_period": 50, "position_size": 0.2}'::jsonb,
    true
  ),
  (
    'RSI Oversold/Overbought',
    'RSI（相対力指数）を使用して過熱・過冷却状態を検出する戦略。RSIが30以下で買い、70以上で売ります。逆張り戦略の代表例です。',
    '{"type": "rsi", "indicators": ["rsi"], "entry_condition": "rsi < oversold_threshold", "exit_condition": "rsi > overbought_threshold"}',
    '{"rsi_period": 14, "oversold_threshold": 30, "overbought_threshold": 70, "position_size": 0.2}'::jsonb,
    true
  ),
  (
    'Bollinger Bands Breakout',
    'ボリンジャーバンドを使用した逆張り戦略。価格が下限バンドを下回った時に買い、上限バンドを上回った時に売ります。',
    '{"type": "bollinger", "indicators": ["bollinger_bands"], "entry_condition": "price < lower_band", "exit_condition": "price > upper_band"}',
    '{"bb_period": 20, "bb_std_dev": 2, "position_size": 0.2}'::jsonb,
    true
  ),
  (
    'MACD Signal Cross',
    'MACD（移動平均収束拡散法）を使用したトレンドフォロー戦略。MACDラインがシグナルラインを上抜けた時に買い、下抜けた時に売ります。',
    '{"type": "macd", "indicators": ["macd", "signal"], "entry_condition": "macd > signal", "exit_condition": "macd < signal"}',
    '{"macd_fast": 12, "macd_slow": 26, "macd_signal": 9, "position_size": 0.2}'::jsonb,
    true
  ),
  (
    'Multi-Indicator Combo',
    '複数の技術指標（SMA、RSI、MACD）を組み合わせた総合戦略。複数の指標が同じ方向のシグナルを示した時にのみエントリーします。',
    '{"type": "multi_indicator", "indicators": ["sma_20", "sma_50", "rsi", "macd"], "entry_condition": "consensus >= 2", "exit_condition": "consensus >= 2"}',
    '{"sma_short_period": 20, "sma_long_period": 50, "rsi_period": 14, "macd_fast": 12, "macd_slow": 26, "macd_signal": 9, "position_size": 0.2}'::jsonb,
    true
  )
ON CONFLICT (strategy_name) DO NOTHING;
