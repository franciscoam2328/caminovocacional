import React from 'react';

export default function HollandPrintReport({ data }) {
  if (!data || !data.puntajes_riasec) return null;

  const labels = ['Realista', 'Investigador', 'Artístico', 'Social', 'Emprendedor', 'Convencional'];
  const labelsMap = {
    'Realista': 'R',
    'Investigador': 'I',
    'Artístico': 'A',
    'Social': 'S',
    'Emprendedor': 'E',
    'Convencional': 'C'
  };

  // Ensure we have scores for all dimensions
  const scores = labels.map(label => data.puntajes_riasec[label] || 0);
  const maxScore = 50;
  
  // Calculate differentiation (max - min) or standard deviation
  const maxVal = Math.max(...scores);
  const minVal = Math.min(...scores);
  const diff = (maxVal - minVal).toFixed(2);

  // Sorted dimensions for the bars
  const sortedScores = Object.entries(data.puntajes_riasec)
    .sort((a, b) => b[1] - a[1])
    .map(([area, score]) => ({ area, score, percentage: Math.round((score / maxScore) * 100) }));

  // Radar Chart Math
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / maxScore) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  const dataPoints = scores.map((val, idx) => getPoint(val, idx, 6));
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid polygons
  const gridLevels = 5;
  const grids = Array.from({ length: gridLevels }).map((_, levelIdx) => {
    const val = (maxScore / gridLevels) * (levelIdx + 1);
    const pts = scores.map((_, idx) => getPoint(val, idx, 6));
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  });

  return (
    <div className="hidden print:block mb-8 break-inside-avoid">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-black text-primary">Reporte Detallado: Código Holland</h1>
        <div className="text-right">
          <p className="text-sm text-slate-500">Estudiante: <strong className="text-slate-800">{data.estudiante || 'Aroni'}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Radar Chart */}
        <div className="border rounded-2xl p-6 bg-slate-50 flex flex-col items-center">
          <div className="text-center mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tu Código Holland:</p>
            <div className="bg-blue-600 text-white text-4xl font-black py-2 px-8 rounded-full inline-block tracking-widest">
              {data.codigo_holland || 'RIA'}
            </div>
          </div>

          <div className="relative w-[300px] h-[300px]">
            <svg width="300" height="300" className="overflow-visible">
              {/* Draw Web Grids */}
              {grids.map((points, i) => (
                <polygon key={`grid-${i}`} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" />
              ))}
              
              {/* Draw Axes */}
              {scores.map((_, i) => {
                const endPt = getPoint(maxScore, i, 6);
                return (
                  <line key={`axis-${i}`} x1={centerX} y1={centerY} x2={endPt.x} y2={endPt.y} stroke="#e2e8f0" strokeWidth="1" />
                );
              })}

              {/* Draw Data Polygon */}
              <polygon points={polygonPoints} fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" strokeWidth="2" />
              
              {/* Draw Data Points */}
              {dataPoints.map((pt, i) => (
                <circle key={`pt-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#2563eb" />
              ))}

              {/* Draw Axis Labels */}
              {scores.map((_, i) => {
                const labelPt = getPoint(maxScore + 15, i, 6);
                return (
                  <text key={`label-${i}`} x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold fill-slate-500">
                    {labelsMap[labels[i]]}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100 w-full">
            <h4 className="font-bold text-yellow-800 text-sm mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span> Diferenciación: {diff}
            </h4>
            <p className="text-xs text-yellow-700 leading-tight">
              {diff > 15 ? 'Tienes intereses muy definidos y claros. Tu perfil vocacional es altamente diferenciado.' : 'Tus intereses están equilibrados; esto indica versatilidad para adaptarte a distintos entornos.'}
            </p>
          </div>
        </div>

        {/* Right Column: Bar Charts */}
        <div className="border rounded-2xl p-6 bg-white">
          <h3 className="font-black text-primary text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">bar_chart</span> Puntajes por Dimensión
          </h3>
          
          <div className="flex flex-col gap-5">
            {sortedScores.map((item, index) => {
              const isDominant = index < 3;
              return (
                <div key={item.area} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.area}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${isDominant ? 'bg-primary' : 'bg-slate-400'}`}>
                        {isDominant ? 'Dominante' : 'Latente'}
                      </span>
                    </div>
                    <div className="text-right leading-none">
                      <span className={`font-black ${isDominant ? 'text-primary' : 'text-slate-500'}`}>{item.score} pts</span>
                      <div className="text-[10px] text-slate-400">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${isDominant ? 'bg-primary' : 'bg-slate-400'} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            * Los perfiles <strong>Dominantes</strong> indican tus principales áreas de interés. Los <strong>Latentes</strong> son áreas complementarias.
          </div>
        </div>
      </div>
      
      {/* Page break after Holland Report to separate from Universities */}
      <div className="break-after-page"></div>
    </div>
  );
}
