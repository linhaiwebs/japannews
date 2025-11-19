import { TrendingUp, Activity, Shield, BarChart3, Download } from 'lucide-react';
import { useState } from 'react';

interface ReportDownloadIconsProps {
  backtestId?: string;
  stockCode: string;
  stockName: string;
  onDownload: (reportType: string) => Promise<void>;
}

export default function ReportDownloadIcons({
  backtestId,
  stockCode,
  stockName,
  onDownload
}: ReportDownloadIconsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (reportType: string) => {
    setDownloading(reportType);
    try {
      await onDownload(reportType);
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    {
      id: 'strategy',
      name: '戦略レポート',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      description: '売買シグナル、持仓変化、戦略ロジック'
    },
    {
      id: 'indicators',
      name: '技術指標',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      description: '全指標の計算結果、信号時点'
    },
    {
      id: 'risk',
      name: 'リスク管理',
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      description: '止損記録、風険指標、最大ドローダウン'
    },
    {
      id: 'performance',
      name: '性能分析',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      description: '完全性能指標、収益曲線、月次収益'
    }
  ];

  return (
    <div className="mb-4">
      <div className="text-center mb-3">
        <p className="text-sm font-bold text-gray-700">
          詳細レポートをダウンロード
        </p>
        <p className="text-xs text-gray-500 mt-1">
          各アイコンをクリックしてPDF/Excelレポートを取得
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {reports.map((report) => {
          const Icon = report.icon;
          const isDownloading = downloading === report.id;

          return (
            <button
              key={report.id}
              onClick={() => handleDownload(report.id)}
              disabled={isDownloading || !backtestId}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                ${!backtestId
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300'
                  : 'hover:scale-105 hover:shadow-lg active:scale-95 bg-gradient-to-br ' + report.color + ' border-white'
                }
              `}
              title={report.description}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`
                  p-3 rounded-full
                  ${!backtestId ? 'bg-gray-200' : 'bg-white/20'}
                `}>
                  {isDownloading ? (
                    <Download className="w-6 h-6 text-white animate-bounce" />
                  ) : (
                    <Icon className={`w-6 h-6 ${!backtestId ? 'text-gray-400' : 'text-white'}`} />
                  )}
                </div>

                <div className="text-center">
                  <p className={`text-xs font-bold ${!backtestId ? 'text-gray-500' : 'text-white'}`}>
                    {report.name}
                  </p>
                  {isDownloading && (
                    <p className="text-[10px] text-white/80 mt-1">
                      生成中...
                    </p>
                  )}
                </div>
              </div>

              {!backtestId && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 rounded-xl">
                  <p className="text-[10px] text-gray-600 font-semibold">
                    回測完了後
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!backtestId && (
        <p className="text-xs text-center text-gray-500 mt-3">
          ※ バックテスト完了後、レポートをダウンロードできます
        </p>
      )}
    </div>
  );
}
