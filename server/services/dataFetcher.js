import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchYahooFinanceData(stockCode, startDate, endDate) {
  try {
    const formattedCode = stockCode.includes('.T') ? stockCode : `${stockCode}.T`;

    const start = Math.floor(new Date(startDate).getTime() / 1000);
    const end = Math.floor(new Date(endDate).getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v7/finance/download/${formattedCode}?period1=${start}&period2=${end}&interval=1d&events=history`;

    console.log(`Fetching Yahoo Finance data for ${formattedCode} from ${startDate} to ${endDate}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
      throw new Error('No data available from Yahoo Finance');
    }

    const prices = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',');

      if (columns.length < 6 || columns[0] === 'null') {
        continue;
      }

      const [date, open, high, low, close, adjClose, volume] = columns;

      if (open === 'null' || close === 'null') {
        continue;
      }

      prices.push({
        stock_code: stockCode,
        trading_date: date,
        open_price: parseFloat(open),
        high_price: parseFloat(high),
        low_price: parseFloat(low),
        close_price: parseFloat(close),
        adjusted_close: parseFloat(adjClose),
        volume: parseInt(volume) || 0
      });
    }

    console.log(`Fetched ${prices.length} price records for ${stockCode}`);
    return prices;

  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    throw error;
  }
}

export async function getHistoricalPrices(stockCode, startDate, endDate) {
  try {
    const { data: existingData, error: queryError } = await supabase
      .from('stock_historical_prices')
      .select('*')
      .eq('stock_code', stockCode)
      .gte('trading_date', startDate)
      .lte('trading_date', endDate)
      .order('trading_date', { ascending: true });

    if (queryError) {
      console.error('Error querying existing data:', queryError);
    }

    const dataPointsNeeded = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

    if (existingData && existingData.length > dataPointsNeeded * 0.8) {
      console.log(`Using ${existingData.length} cached records for ${stockCode}`);
      return existingData;
    }

    console.log(`Fetching fresh data from Yahoo Finance for ${stockCode}`);
    const freshData = await fetchYahooFinanceData(stockCode, startDate, endDate);

    if (freshData.length > 0) {
      const { error: upsertError } = await supabase
        .from('stock_historical_prices')
        .upsert(freshData, {
          onConflict: 'stock_code,trading_date',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Error upserting data to Supabase:', upsertError);
      } else {
        console.log(`Successfully cached ${freshData.length} records to Supabase`);
      }
    }

    return freshData;

  } catch (error) {
    console.error('Error in getHistoricalPrices:', error);

    const { data: fallbackData } = await supabase
      .from('stock_historical_prices')
      .select('*')
      .eq('stock_code', stockCode)
      .gte('trading_date', startDate)
      .lte('trading_date', endDate)
      .order('trading_date', { ascending: true });

    if (fallbackData && fallbackData.length > 0) {
      console.log(`Using ${fallbackData.length} fallback cached records`);
      return fallbackData;
    }

    throw error;
  }
}

export async function validateAndCleanData(prices) {
  const validPrices = prices.filter(price => {
    if (!price.open_price || !price.close_price || price.open_price <= 0 || price.close_price <= 0) {
      return false;
    }

    if (price.high_price < price.low_price) {
      return false;
    }

    if (price.high_price < price.open_price || price.high_price < price.close_price) {
      return false;
    }

    if (price.low_price > price.open_price || price.low_price > price.close_price) {
      return false;
    }

    return true;
  });

  console.log(`Data validation: ${prices.length} total, ${validPrices.length} valid, ${prices.length - validPrices.length} filtered out`);

  return validPrices;
}
