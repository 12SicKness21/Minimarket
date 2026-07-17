// W,H por defecto = proporción vertical usada por HeroBanderas (9:16 escalado).
// Cada función acepta {w,h} para poder dibujarse también en formato apaisado
// (como en los filtros de país) sin recortar el diseño — todas las medidas
// internas son fracciones de w/h, así que se adaptan a cualquier proporción.
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

export function FlagPeru({ w = W, h = H }) {
  return (
    <g>
      <rect x={0} y={0} width={w / 3} height={h} fill="#D91023" />
      <rect x={w / 3} y={0} width={w / 3} height={h} fill="#FFFFFF" />
      <rect x={w * 2 / 3} y={0} width={w / 3} height={h} fill="#D91023" />
    </g>
  );
}

export function FlagRepDominicana({ w = W, h = H }) {
  const cw = w * 0.12;
  const ch = h * 0.09;
  return (
    <g>
      <rect x={0} y={0} width={w / 2} height={h / 2} fill="#002D62" />
      <rect x={w / 2} y={0} width={w / 2} height={h / 2} fill="#CE1126" />
      <rect x={0} y={h / 2} width={w / 2} height={h / 2} fill="#CE1126" />
      <rect x={w / 2} y={h / 2} width={w / 2} height={h / 2} fill="#002D62" />
      <rect x={(w - cw) / 2} y={0} width={cw} height={h} fill="#FFFFFF" />
      <rect x={0} y={(h - ch) / 2} width={w} height={ch} fill="#FFFFFF" />
    </g>
  );
}

export function FlagColombia({ w = W, h = H }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 2} fill="#FCD116" />
      <rect x={0} y={h / 2} width={w} height={h / 4} fill="#003087" />
      <rect x={0} y={h * 0.75} width={w} height={h / 4} fill="#CE1126" />
    </g>
  );
}

export function FlagArgentina({ w = W, h = H }) {
  const cx = w / 2, cy = h / 2, sr = Math.min(w, h) * 0.2;
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#74ACDF" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#FFFFFF" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#74ACDF" />
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

export function FlagVenezuela({ w = W, h = H }) {
  const cx = w / 2, cy = h / 2, arcR = Math.min(w, h) * 0.28, starR = Math.min(w, h) * 0.07;
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#CF8B00" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#00247D" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#CF0A2C" />
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

export function FlagElSalvador({ w = W, h = H }) {
  const cx = w / 2, cy = h / 2, u = Math.min(w, h);
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#0F47AF" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#FFFFFF" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#0F47AF" />
      <g transform={'translate(' + cx + ',' + cy + ')'}>
        <path d={'M0,' + (-u * 0.22) + ' L' + (u * 0.25) + ',' + (u * 0.16) + ' L' + (-u * 0.25) + ',' + (u * 0.16) + ' Z'}
          fill="none" stroke="#0F47AF" strokeWidth={2} />
        <rect x={-u * 0.19} y={u * 0.06} width={u * 0.38} height={u * 0.03} fill="#0F47AF" />
        <rect x={-u * 0.19} y={u * 0.1} width={u * 0.38} height={u * 0.03} fill="#CE1126" />
        <circle r={u * 0.05} cy={-u * 0.04} fill="#FFD100" stroke="#0F47AF" strokeWidth={1} />
      </g>
    </g>
  );
}

export function FlagHonduras({ w = W, h = H }) {
  const cx = w / 2, cy = h / 2, u = Math.min(w, h), sr = u * 0.06, sp = u * 0.22;
  const estrellas = [
    [cx, cy], [cx - sp, cy - sp], [cx + sp, cy - sp],
    [cx - sp, cy + sp], [cx + sp, cy + sp],
  ];
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#0073CF" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#FFFFFF" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#0073CF" />
      {estrellas.map(([x, y], i) => (
        <path key={i} d={star5(x, y, sr)} fill="#0073CF" />
      ))}
    </g>
  );
}

export function FlagEcuador({ w = W, h = H }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 2} fill="#FFD100" />
      <rect x={0} y={h / 2} width={w} height={h / 4} fill="#034EA2" />
      <rect x={0} y={h * 0.75} width={w} height={h / 4} fill="#EF3340" />
    </g>
  );
}

export function FlagBolivia({ w = W, h = H }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#D52B1E" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#F4E400" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#007A33" />
    </g>
  );
}

export function FlagParaguay({ w = W, h = H }) {
  return (
    <g>
      <rect x={0} y={0} width={w} height={h / 3} fill="#D52B1E" />
      <rect x={0} y={h / 3} width={w} height={h / 3} fill="#FFFFFF" />
      <rect x={0} y={h * 2 / 3} width={w} height={h / 3} fill="#0038A8" />
    </g>
  );
}

export function FlagCuba({ w = W, h = H }) {
  const franja = h / 5;
  const cx = w * 0.18, cy = h / 2, starR = Math.min(w, h) * 0.09;
  return (
    <g>
      <rect x={0} y={0} width={w} height={franja} fill="#002A8F" />
      <rect x={0} y={franja} width={w} height={franja} fill="#FFFFFF" />
      <rect x={0} y={franja * 2} width={w} height={franja} fill="#002A8F" />
      <rect x={0} y={franja * 3} width={w} height={franja} fill="#FFFFFF" />
      <rect x={0} y={franja * 4} width={w} height={franja} fill="#002A8F" />
      <path d={`M0,0 L${w * 0.42},${h / 2} L0,${h} Z`} fill="#CB1515" />
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

// Proporción apaisada estándar de bandera (3:2) para chips/filtros
const W_CHIP = 300;
const H_CHIP = 200;

export default function BanderaPais({ pais, className = 'w-14 h-10' }) {
  const Componente = COMPONENTES_BANDERA[pais.id];

  if (!Componente) {
    return (
      <div className={`${className} rounded-md bg-gray-100 flex items-center justify-center text-xl shrink-0`}>
        {pais.bandera || '🌎'}
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W_CHIP} ${H_CHIP}`} className={`${className} rounded-md shrink-0`}>
      <Componente w={W_CHIP} h={H_CHIP} />
    </svg>
  );
}
