// Proporción vertical compartida con HeroBanderas (9:16 escalado)
export const W = 390;
export const H = 844;

export function star5(x, y, r) {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const b = a + Math.PI / 5;
    d += (i === 0 ? 'M' : 'L') + (x + Math.cos(a) * r) + ',' + (y + Math.sin(a) * r) + ' ';
    d += 'L' + (x + Math.cos(b) * r * 0.4) + ',' + (y + Math.sin(b) * r * 0.4) + ' ';
  }
  return d + 'Z';
}

export function FlagPeru() {
  return (
    <g>
      <rect x={0} y={0} width={W / 3} height={H} fill="#D91023" />
      <rect x={W / 3} y={0} width={W / 3} height={H} fill="#FFFFFF" />
      <rect x={W * 2 / 3} y={0} width={W / 3} height={H} fill="#D91023" />
    </g>
  );
}

export function FlagRepDominicana() {
  const cw = W * 0.12;
  const ch = H * 0.055;
  return (
    <g>
      <rect x={0} y={0} width={W / 2} height={H / 2} fill="#002D62" />
      <rect x={W / 2} y={0} width={W / 2} height={H / 2} fill="#CE1126" />
      <rect x={0} y={H / 2} width={W / 2} height={H / 2} fill="#CE1126" />
      <rect x={W / 2} y={H / 2} width={W / 2} height={H / 2} fill="#002D62" />
      <rect x={(W - cw) / 2} y={0} width={cw} height={H} fill="#FFFFFF" />
      <rect x={0} y={(H - ch) / 2} width={W} height={ch} fill="#FFFFFF" />
    </g>
  );
}

export function FlagColombia() {
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 2} fill="#FCD116" />
      <rect x={0} y={H / 2} width={W} height={H / 4} fill="#003087" />
      <rect x={0} y={H * 0.75} width={W} height={H / 4} fill="#CE1126" />
    </g>
  );
}

export function FlagArgentina() {
  const cx = W / 2, cy = H / 2, sr = W * 0.12;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#74ACDF" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#74ACDF" />
      <g transform={'translate(' + cx + ',' + cy + ')'}>
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={-sr * 0.08} y={-sr * 1.05}
            width={sr * 0.16} height={sr * 0.3}
            rx={sr * 0.04} fill="#F6B40E"
            transform={'rotate(' + (i * 22.5) + ')'}
          />
        ))}
        <circle r={sr * 0.65} fill="#F6B40E" stroke="#85560A" strokeWidth={sr * 0.06} />
        <circle cx={-sr * 0.22} cy={-sr * 0.18} r={sr * 0.13} fill="#85560A" />
        <circle cx={sr * 0.22} cy={-sr * 0.18} r={sr * 0.13} fill="#85560A" />
        <path
          d={'M' + (-sr * 0.3) + ',' + (sr * 0.15) + ' Q0,' + (sr * 0.42) + ' ' + (sr * 0.3) + ',' + (sr * 0.15)}
          fill="none" stroke="#85560A" strokeWidth={sr * 0.09} strokeLinecap="round"
        />
      </g>
    </g>
  );
}

export function FlagVenezuela() {
  const cx = W / 2, cy = H / 2, arcR = W * 0.18, starR = W * 0.045;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#CF8B00" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#00247D" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#CF0A2C" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <path
            key={i}
            d={star5(cx + Math.cos(a) * arcR, cy + Math.sin(a) * arcR, starR)}
            fill="#FFFFFF"
          />
        );
      })}
    </g>
  );
}

export function FlagElSalvador() {
  const cx = W / 2, cy = H / 2;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#0F47AF" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#0F47AF" />
      <g transform={'translate(' + cx + ',' + cy + ')'}>
        <path d={'M0,' + (-W * 0.13) + ' L' + (W * 0.15) + ',' + (W * 0.1) + ' L' + (-W * 0.15) + ',' + (W * 0.1) + ' Z'}
          fill="none" stroke="#0F47AF" strokeWidth={3} />
        <rect x={-W * 0.115} y={W * 0.04} width={W * 0.23} height={W * 0.018} fill="#0F47AF" />
        <rect x={-W * 0.115} y={W * 0.06} width={W * 0.23} height={W * 0.018} fill="#CE1126" />
        <circle r={W * 0.03} cy={-W * 0.02} fill="#FFD100" stroke="#0F47AF" strokeWidth={1.5} />
      </g>
    </g>
  );
}

export function FlagHonduras() {
  const cx = W / 2, cy = H / 2, sr = W * 0.035, sp = W * 0.13;
  const estrellas = [
    [cx, cy], [cx - sp, cy - sp], [cx + sp, cy - sp],
    [cx - sp, cy + sp], [cx + sp, cy + sp],
  ];
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#0073CF" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#0073CF" />
      {estrellas.map(([x, y], i) => (
        <path key={i} d={star5(x, y, sr)} fill="#0073CF" />
      ))}
    </g>
  );
}

export function FlagEcuador() {
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 2} fill="#FFD100" />
      <rect x={0} y={H / 2} width={W} height={H / 4} fill="#034EA2" />
      <rect x={0} y={H * 0.75} width={W} height={H / 4} fill="#EF3340" />
    </g>
  );
}

export function FlagBolivia() {
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#D52B1E" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#F4E400" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#007A33" />
    </g>
  );
}

export function FlagParaguay() {
  return (
    <g>
      <rect x={0} y={0} width={W} height={H / 3} fill="#D52B1E" />
      <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
      <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#0038A8" />
    </g>
  );
}

export function FlagCuba() {
  const franja = H / 5;
  const cx = W * 0.18, cy = H / 2, starR = W * 0.055;
  return (
    <g>
      <rect x={0} y={0} width={W} height={franja} fill="#002A8F" />
      <rect x={0} y={franja} width={W} height={franja} fill="#FFFFFF" />
      <rect x={0} y={franja * 2} width={W} height={franja} fill="#002A8F" />
      <rect x={0} y={franja * 3} width={W} height={franja} fill="#FFFFFF" />
      <rect x={0} y={franja * 4} width={W} height={franja} fill="#002A8F" />
      <path d={`M0,0 L${W * 0.42},${H / 2} L0,${H} Z`} fill="#CB1515" />
      <path d={star5(cx, cy, starR)} fill="#FFFFFF" />
    </g>
  );
}

export const COMPONENTES_BANDERA = {
  peru: FlagPeru,
  republica_dominicana: FlagRepDominicana,
  colombia: FlagColombia,
  argentina: FlagArgentina,
  venezuela: FlagVenezuela,
  el_salvador: FlagElSalvador,
  ecuador: FlagEcuador,
  bolivia: FlagBolivia,
  honduras: FlagHonduras,
  paraguay: FlagParaguay,
  cuba: FlagCuba,
};

export default function BanderaPais({ pais, className = 'w-10 h-14' }) {
  const Componente = COMPONENTES_BANDERA[pais.id];

  if (!Componente) {
    return (
      <div className={`${className} rounded-md bg-gray-100 flex items-center justify-center text-xl shrink-0`}>
        {pais.bandera || '🌎'}
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${className} rounded-md shrink-0`}>
      <Componente />
    </svg>
  );
}
