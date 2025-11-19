import express from 'express';
import dotenv from 'dotenv';
import { getCachedDiagnosis, saveDiagnosisToCache } from '../utils/cache.js';
import { getRateLimitStatus } from '../utils/rateLimiter.js';
import { recordUsageStats } from '../utils/stats.js';

dotenv.config();

const router = express.Router();

router.post('/diagnosis', async (req, res) => {
  const startTime = Date.now();

  try {
    const { code, stockData } = req.body;

    console.log('Diagnosis request received for stock:', code);

    if (!code || !stockData) {
      console.error('Missing required parameters:', { code, hasStockData: !!stockData });
      await recordUsageStats({ cacheHit: false, apiCall: false, error: true, responseTime: Date.now() - startTime });
      return res.status(400).json({ error: 'Stock code and data are required' });
    }

    const cachedResult = await getCachedDiagnosis(code);
    if (cachedResult) {
      console.log(`Returning cached result for ${code}`);
      const responseTime = Date.now() - startTime;
      await recordUsageStats({ cacheHit: true, apiCall: false, error: false, responseTime });
      return res.json({
        analysis: cachedResult.diagnosis_result,
        cached: true,
        cachedAt: cachedResult.created_at,
        expiresAt: cachedResult.expires_at
      });
    }

    const apiKeysString = process.env.SILICONFLOW_API_KEY || process.env.SILICONFLOW_API_KEYS;
    const siliconflowApiUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    const siliconflowModel = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

    if (!apiKeysString) {
      console.warn('SILICONFLOW_API_KEY not configured, using mock response');

      const mockAnalysis = `【${stockData.name}（コード: ${code}）の過去データ検証結果】\n\n現在の株価は ${stockData.price} 円、前日比 ${stockData.change} 円（${stockData.changePercent}）\n\n過去5年間の市場データと比較した客観的分析：\n- PER ${stockData.per}倍は、同業種の過去平均と比較して標準的な水準です\n- PBR ${stockData.pbr}倍は、歴史的データから見て適正範囲内にあります\n- 配当利回り${stockData.dividend}%は、過去のトレンドと整合性があります\n- ${stockData.industry}セクターにおける時価総額${stockData.marketCap}億円は、過去データと照合して妥当な評価です\n\nこの結果を生んだ完全な投資戦略（売買ルール、リスク指標、詳細なシステム評価）は、LINE限定の【AI検証レポート】でのみ公開されています。\n\nLINEアカウントを追加して、銘柄コード「${code}」を送信すると、詳細な歴史回溯テストレポートが即座に届きます。\n\n重要:\n- 本情報は過去データに基づく統計分析であり、投資助言・推奨ではありません\n- 将来の投資成果を保証するものではありません`;

      await saveDiagnosisToCache(code, stockData, mockAnalysis, 'mock');
      const responseTime = Date.now() - startTime;
      await recordUsageStats({ cacheHit: false, apiCall: false, error: false, responseTime });
      return res.json({ analysis: mockAnalysis, cached: false, mock: true });
    }

    const apiKeys = apiKeysString.split(',').map(k => k.trim()).filter(k => k);
    const selectedApiKey = apiKeys[0];

    console.log('SiliconFlow API Key selected, making streaming API request...');
    console.log('Using model:', siliconflowModel);

    const prompt = `あなたは客観的な株式データ分析システムです。以下の株式データに基づいて、過去データとの比較分析を日本語で作成してください。

株式情報：
銘柄名: ${stockData.name}
コード: ${code}
現在株価: ${stockData.price}円
前日比: ${stockData.change}円 (${stockData.changePercent})
PER: ${stockData.per}倍
PBR: ${stockData.pbr}倍
配当利回り: ${stockData.dividend}%
業種: ${stockData.industry}
時価総額: ${stockData.marketCap}億円

必ず以下のフォーマットで出力してください：

【${stockData.name}（コード: ${code}）の過去データ検証結果】

現在の株価は ${stockData.price} 円、前日比 ${stockData.change} 円（${stockData.changePercent}）

過去5年間の市場データと比較した客観的分析：
- PER ${stockData.per}倍は、同業種の過去平均と比較して標準的な水準です
- PBR ${stockData.pbr}倍は、歴史的データから見て適正範囲内にあります
- 配当利回り${stockData.dividend}%は、過去のトレンドと整合性があります

この結果を生んだ完全な投資戦略（売買ルール、リスク指標、詳細なシステム評価）は、LINE限定の【AI検証レポート】でのみ公開されています。

LINEアカウントを追加して、銘柄コード「${code}」を送信すると、詳細な歴史回溯テストレポートが即座に届きます。

重要:
- 本情報は過去データに基づく統計分析であり、投資助言・推奨ではありません
- 将来の投資成果を保証するものではありません
- このフォーマットを厳密に守り、買い推奨や売り推奨などの助言表現は一切使用しないでください`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    let siliconflowResponse;
    try {
      siliconflowResponse = await fetch(
        siliconflowApiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${selectedApiKey}`,
          },
          body: JSON.stringify({
            model: siliconflowModel,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 0.7,
            top_k: 50,
            frequency_penalty: 0.5,
            stream: true,
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout after 45 seconds');
        const responseTime = Date.now() - startTime;
        await recordUsageStats({ cacheHit: false, apiCall: true, error: true, responseTime });
        res.write(`data: ${JSON.stringify({ error: 'リクエストがタイムアウトしました。もう一度お試しください。' })}\n\n`);
        res.end();
        return;
      }
      throw fetchError;
    }

    console.log('SiliconFlow API response status:', siliconflowResponse.status);

    if (!siliconflowResponse.ok) {
      const errorBody = await siliconflowResponse.text();
      console.error('SiliconFlow API error response:', errorBody);
      const responseTime = Date.now() - startTime;
      await recordUsageStats({ cacheHit: false, apiCall: true, error: true, responseTime });
      res.write(`data: ${JSON.stringify({ error: `SiliconFlow API error: ${siliconflowResponse.status}` })}\n\n`);
      res.end();
      return;
    }

    let fullAnalysis = '';
    const reader = siliconflowResponse.body;
    const decoder = new TextDecoder();
    let buffer = '';

    for await (const chunk of reader) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim();

          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              fullAnalysis += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (e) {
            if (data.length > 0) {
              console.error('Error parsing streaming chunk. Data length:', data.length, 'First 200 chars:', data.substring(0, 200));
            }
          }
        }
      }
    }

    decoder.decode();

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    console.log('Successfully generated streaming analysis, length:', fullAnalysis.length);

    if (fullAnalysis.trim().length > 0) {
      await saveDiagnosisToCache(code, stockData, fullAnalysis, 'qwen2.5-7b-instruct');
    } else {
      console.warn('Empty analysis result, not caching');
    }

    const responseTime = Date.now() - startTime;
    await recordUsageStats({ cacheHit: false, apiCall: true, error: false, responseTime });

  } catch (error) {
    console.error('Error in diagnosis function:', error);
    console.error('Error stack:', error.stack);

    const responseTime = Date.now() - startTime;
    await recordUsageStats({ cacheHit: false, apiCall: false, error: true, responseTime });

    if (!res.headersSent) {
      res.status(500).json({
        error: '診断中にエラーが発生しました',
        details: error.message,
        type: error.name,
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: '診断中にエラーが発生しました', details: error.message })}\n\n`);
      res.end();
    }
  }
});

router.get('/stats', async (req, res) => {
  try {
    const rateLimitStatus = getRateLimitStatus();
    const { getTodayStats } = await import('../utils/stats.js');
    const todayStats = await getTodayStats();

    res.json({
      rateLimit: rateLimitStatus,
      today: todayStats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
