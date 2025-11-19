import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface BacktestData {
  backtest: any;
  trades: any[];
  metrics: any;
  stockName: string;
}

export async function generateStrategyReport(data: BacktestData): Promise<void> {
  const { backtest, trades, stockName } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: '戦略レポート',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `銘柄: ${stockName} (${backtest.stock_code})`, bold: true })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `検証期間: ${backtest.start_date} 〜 ${backtest.end_date}` })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: '取引履歴',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),

        ...trades.map((trade: any, index: number) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${trade.trade_date} - ${trade.trade_type === 'buy' ? '買い' : '売り'}: `,
                bold: true
              }),
              new TextRun({
                text: `¥${trade.price.toFixed(2)} × ${trade.quantity}株 (${trade.signal_reason})`
              })
            ],
            spacing: { after: 100 }
          })
        ),

        new Paragraph({
          text: '免責事項: 本レポートは過去データに基づく統計分析であり、投資助言ではありません。',
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const blob = await doc.toBlob();
  saveAs(blob, `戦略レポート_${backtest.stock_code}_${new Date().getTime()}.docx`);
}

export async function generateIndicatorsReport(data: BacktestData): Promise<void> {
  const { backtest, stockName } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: '技術指標レポート',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `銘柄: ${stockName} (${backtest.stock_code})`, bold: true })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '使用された技術指標',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: '• 移動平均線 (SMA): 20日、50日',
          bullet: { level: 0 },
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: '• 相対力指数 (RSI): 14日',
          bullet: { level: 0 },
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: '• MACD: 12日EMA、26日EMA、9日シグナル',
          bullet: { level: 0 },
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: '• ボリンジャーバンド: 20日、2標準偏差',
          bullet: { level: 0 },
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '免責事項: 本レポートは過去データに基づく統計分析であり、投資助言ではありません。',
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const blob = await doc.toBlob();
  saveAs(blob, `技術指標レポート_${backtest.stock_code}_${new Date().getTime()}.docx`);
}

export async function generateRiskReport(data: BacktestData): Promise<void> {
  const { backtest, metrics, stockName } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'リスク管理レポート',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `銘柄: ${stockName} (${backtest.stock_code})`, bold: true })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: 'リスク指標',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '最大ドローダウン: ', bold: true }),
            new TextRun({ text: `${metrics?.max_drawdown?.toFixed(2)}%` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '最大連続損失: ', bold: true }),
            new TextRun({ text: `${metrics?.max_consecutive_losses || 0}回` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '平均損失額: ', bold: true }),
            new TextRun({ text: `¥${metrics?.avg_loss?.toFixed(2) || 0}` })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '免責事項: 本レポートは過去データに基づく統計分析であり、投資助言ではありません。',
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const blob = await doc.toBlob();
  saveAs(blob, `リスク管理レポート_${backtest.stock_code}_${new Date().getTime()}.docx`);
}

export async function generatePerformanceReport(data: BacktestData): Promise<void> {
  const { backtest, metrics, stockName } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: '性能分析レポート',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `銘柄: ${stockName} (${backtest.stock_code})`, bold: true })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: 'パフォーマンス指標',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '総収益率: ', bold: true }),
            new TextRun({ text: `${backtest.total_return?.toFixed(2)}%` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'シャープレシオ: ', bold: true }),
            new TextRun({ text: `${metrics?.sharpe_ratio?.toFixed(4) || 'N/A'}` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '勝率: ', bold: true }),
            new TextRun({ text: `${((metrics?.win_rate || 0) * 100).toFixed(2)}%` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'プロフィットファクター: ', bold: true }),
            new TextRun({ text: `${metrics?.profit_factor?.toFixed(2) || 'N/A'}` })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: '取引回数: ', bold: true }),
            new TextRun({ text: `${backtest.trade_count}回` })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: '免責事項: 本レポートは過去データに基づく統計分析であり、投資助言ではありません。',
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER
        })
      ]
    }]
  });

  const blob = await doc.toBlob();
  saveAs(blob, `性能分析レポート_${backtest.stock_code}_${new Date().getTime()}.docx`);
}

export async function generateExcelReport(data: BacktestData, reportType: string): Promise<void> {
  const { backtest, trades, metrics } = data;

  const workbook = XLSX.utils.book_new();

  const summaryData = [
    ['項目', '値'],
    ['銘柄コード', backtest.stock_code],
    ['検証期間', `${backtest.start_date} 〜 ${backtest.end_date}`],
    ['初期資本', `¥${backtest.initial_capital.toLocaleString()}`],
    ['最終資本', `¥${backtest.final_capital.toLocaleString()}`],
    ['総収益率', `${backtest.total_return.toFixed(2)}%`],
    ['取引回数', backtest.trade_count],
    ['シャープレシオ', metrics?.sharpe_ratio?.toFixed(4) || 'N/A'],
    ['最大ドローダウン', `${metrics?.max_drawdown?.toFixed(2)}%`],
    ['勝率', `${((metrics?.win_rate || 0) * 100).toFixed(2)}%`]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'サマリー');

  if (trades && trades.length > 0) {
    const tradesData = [
      ['日付', 'タイプ', '価格', '数量', '手数料', '理由'],
      ...trades.map((trade: any) => [
        trade.trade_date,
        trade.trade_type === 'buy' ? '買い' : '売り',
        trade.price,
        trade.quantity,
        trade.commission,
        trade.signal_reason
      ])
    ];

    const tradesSheet = XLSX.utils.aoa_to_sheet(tradesData);
    XLSX.utils.book_append_sheet(workbook, tradesSheet, '取引履歴');
  }

  XLSX.writeFile(workbook, `${reportType}_${backtest.stock_code}_${new Date().getTime()}.xlsx`);
}
