import RotatingNotableBadge from './RotatingNotableBadge';
import ReportCard from './ReportCard';

interface AIReportSectionProps {
  onDiagnose?: () => void;
}

export default function AIReportSection({ onDiagnose }: AIReportSectionProps) {
  const featuredReport = {
    title: '総合情報表示',
    description: '市場データを多角的に表示し、参考情報として総合的にまとめました。テクニカル情報、ファンダメンタル情報、市場心理情報を統合した包括的なデータです。',
    tags: ['総合情報', '参考データ', '情報表示'],
    imageSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230059a4;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%2300a4bb;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad1)"/%3E%3Cg fill="white" opacity="0.9"%3E%3Ccircle cx="200" cy="150" r="60" fill="none" stroke="white" stroke-width="3"%3E%3Canimate attributeName="r" values="40;60;40" dur="3s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="200" cy="150" r="40" fill="none" stroke="white" stroke-width="2"%3E%3Canimate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ctext x="200" y="160" font-size="32" font-weight="bold" text-anchor="middle" fill="white"%3EAI%3C/text%3E%3C/g%3E%3C/svg%3E'
  };

  const reports = [
    {
      title: 'テクニカル情報',
      description: 'チャートパターン、移動平均線、RSI、MACDなどの指標データを表示します。',
      tags: ['チャート', '指標データ'],
      imageSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f4f8"/%3E%3Cg stroke="%230059a4" stroke-width="3" fill="none"%3E%3Cpath d="M50 250 L100 200 L150 220 L200 150 L250 180 L300 100 L350 120"%3E%3Canimate attributeName="d" values="M50 250 L100 200 L150 220 L200 150 L250 180 L300 100 L350 120;M50 250 L100 220 L150 200 L200 170 L250 160 L300 120 L350 100;M50 250 L100 200 L150 220 L200 150 L250 180 L300 100 L350 120" dur="4s" repeatCount="indefinite"/%3E%3C/path%3E%3C/g%3E%3Cg fill="%230059a4"%3E%3Ccircle cx="200" cy="150" r="6"%3E%3Canimate attributeName="cy" values="150;170;150" dur="3s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="300" cy="100" r="6"%3E%3Canimate attributeName="cy" values="100;120;100" dur="2.5s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E'
    },
    {
      title: 'ファンダメンタル情報',
      description: '企業の財務状況、業績、成長性などの公開情報を表示します。',
      tags: ['財務情報', '企業データ'],
      imageSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e8f5f7"/%3E%3Cg fill="%230059a4" opacity="0.8"%3E%3Crect x="80" y="180" width="60" height="70"%3E%3Canimate attributeName="height" values="70;90;70" dur="3s" repeatCount="indefinite"/%3E%3Canimate attributeName="y" values="180;160;180" dur="3s" repeatCount="indefinite"/%3E%3C/rect%3E%3Crect x="170" y="140" width="60" height="110"%3E%3Canimate attributeName="height" values="110;130;110" dur="2.5s" repeatCount="indefinite"/%3E%3Canimate attributeName="y" values="140;120;140" dur="2.5s" repeatCount="indefinite"/%3E%3C/rect%3E%3Crect x="260" y="100" width="60" height="150"%3E%3Canimate attributeName="height" values="150;170;150" dur="3.5s" repeatCount="indefinite"/%3E%3Canimate attributeName="y" values="100;80;100" dur="3.5s" repeatCount="indefinite"/%3E%3C/rect%3E%3C/g%3E%3Cpath d="M80 180 L170 140 L260 100" stroke="%2300a4bb" stroke-width="3" fill="none" stroke-dasharray="5,5"%3E%3Canimate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite"/%3E%3C/path%3E%3C/svg%3E'
    },
    {
      title: '市場心理情報',
      description: '投資家心理、市場センチメント、ニュース影響などの参考情報を表示します。',
      tags: ['センチメント', '市場情報'],
      imageSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23fff3e6"/%3E%3Cg fill="none" stroke="%230059a4" stroke-width="2"%3E%3Ccircle cx="200" cy="150" r="80" opacity="0.3"%3E%3Canimate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="200" cy="150" r="60" opacity="0.5"%3E%3Canimate attributeName="r" values="40;60;40" dur="3s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="200" cy="150" r="40" opacity="0.7"%3E%3Canimate attributeName="r" values="20;40;20" dur="2s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/g%3E%3Cg fill="%2300a4bb"%3E%3Ccircle cx="140" cy="120" r="8"%3E%3Canimate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="260" cy="120" r="8"%3E%3Canimate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/%3E%3C/circle%3E%3Ccircle cx="200" cy="180" r="12"%3E%3Canimate attributeName="cy" values="180;185;180" dur="1.5s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E'
    },
    {
      title: 'リスク情報',
      description: 'ボラティリティ、下落リスクなどのリスク関連情報を表示します。',
      tags: ['リスクデータ', 'ボラティリティ'],
      imageSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23ffe6e6"/%3E%3Cg fill="none" stroke="%23c41e3a" stroke-width="3"%3E%3Cpath d="M200 80 L200 220" stroke-dasharray="5,5"%3E%3Canimate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite"/%3E%3C/path%3E%3Cpath d="M100 150 L300 150" stroke-dasharray="5,5"%3E%3Canimate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite"/%3E%3C/path%3E%3C/g%3E%3Cg fill="%230059a4" opacity="0.7"%3E%3Cpolygon points="200,80 260,150 200,150"%3E%3Canimate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/%3E%3C/polygon%3E%3Cpolygon points="200,150 140,220 200,220"%3E%3Canimate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"/%3E%3C/polygon%3E%3C/g%3E%3Ccircle cx="200" cy="150" r="15" fill="%2300a4bb"%3E%3Canimate attributeName="r" values="10;15;10" dur="1.5s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/svg%3E'
    }
  ];

  const handleDiagnosisClick = () => {
    if (onDiagnose) {
      onDiagnose();
    }
  };

  return (
    <div
      className="relative py-12"
      style={{
        backgroundImage: 'url(/images/class_bg_sp.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y',
        minHeight: '1200px'
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-wide">
            情報表示無料
          </h2>
          <div className="mx-auto" style={{ width: '200px', height: '4px', background: 'white' }}></div>
        </div>

        <div
          className="relative bg-white rounded-2xl p-6 md:p-8 mb-8"
          style={{
            boxShadow: '8px 8px 0px 0px #0059a4'
          }}
        >
          <RotatingNotableBadge />

          <div className="mb-4">
            <h3 className="text-sm font-bold text-mizuho-blue mb-4">総合情報表示</h3>
          </div>

          <ReportCard
            title={featuredReport.title}
            description={featuredReport.description}
            tags={featuredReport.tags}
            imageSrc={featuredReport.imageSrc}
            layout="horizontal"
            imageWidth="40%"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-black text-white text-center mb-6">情報一覧</h3>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6"
                style={{
                  boxShadow: '4px 4px 0px 0px #0059a4'
                }}
              >
                <ReportCard
                  title={report.title}
                  description={report.description}
                  tags={report.tags}
                  imageSrc={report.imageSrc}
                  layout="vertical"
                />
              </div>
            ))}
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, transparent 20%, rgba(0, 156, 173, 0.75))'
            }}
          >
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="relative inline-block">
                <div
                  className="absolute inset-0 rounded-xl translate-y-1.5"
                  style={{
                    backgroundColor: '#140078',
                    zIndex: 0
                  }}
                ></div>
                <button
                  onClick={handleDiagnosisClick}
                  className="relative font-bold py-4 px-12 rounded-xl text-white transition-all duration-200 hover:translate-y-0.5 active:translate-y-1 text-lg"
                  style={{
                    backgroundColor: '#4A90E2',
                    zIndex: 1
                  }}
                >
                  参考情報を表示
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
