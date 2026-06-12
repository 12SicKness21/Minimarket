import { useState, useEffect, useRef } from 'react';

// Viewbox vertical tipo móvil (proporción 9:16)
const W = 390;
const H = 844;

function star5(x, y, r) {
    let d = '';
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const b = a + Math.PI / 5;
        d += (i === 0 ? 'M' : 'L') + (x + Math.cos(a) * r) + ',' + (y + Math.sin(a) * r) + ' ';
        d += 'L' + (x + Math.cos(b) * r * 0.4) + ',' + (y + Math.sin(b) * r * 0.4) + ' ';
    }
    return d + 'Z';
}

function FlagPeru() {
    return (
        <g>
            <rect x={0} y={0} width={W / 3} height={H} fill="#D91023" />
            <rect x={W / 3} y={0} width={W / 3} height={H} fill="#FFFFFF" />
            <rect x={W * 2 / 3} y={0} width={W / 3} height={H} fill="#D91023" />
        </g>
    );
}

function FlagRepDominicana() {
    const cw = W * 0.12; // ancho de la cruz blanca
    const ch = H * 0.055; // alto de la cruz blanca
    return (
        <g>
            {/* Cuadrantes: azul / rojo arriba, rojo / azul abajo */}
            <rect x={0} y={0} width={W / 2} height={H / 2} fill="#002D62" />
            <rect x={W / 2} y={0} width={W / 2} height={H / 2} fill="#CE1126" />
            <rect x={0} y={H / 2} width={W / 2} height={H / 2} fill="#CE1126" />
            <rect x={W / 2} y={H / 2} width={W / 2} height={H / 2} fill="#002D62" />
            {/* Cruz blanca central */}
            <rect x={(W - cw) / 2} y={0} width={cw} height={H} fill="#FFFFFF" />
            <rect x={0} y={(H - ch) / 2} width={W} height={ch} fill="#FFFFFF" />
        </g>
    );
}

function FlagColombia() {
    return (
        <g>
            <rect x={0} y={0} width={W} height={H / 2} fill="#FCD116" />
            <rect x={0} y={H / 2} width={W} height={H / 4} fill="#003087" />
            <rect x={0} y={H * 0.75} width={W} height={H / 4} fill="#CE1126" />
        </g>
    );
}

function FlagArgentina() {
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

function FlagVenezuela() {
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

function FlagElSalvador() {
    const cx = W / 2, cy = H / 2;
    return (
        <g>
            <rect x={0} y={0} width={W} height={H / 3} fill="#0F47AF" />
            <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
            <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#0F47AF" />
            {/* Emblema simplificado: triángulo con franja azul-blanco-azul */}
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

function FlagHonduras() {
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

function FlagEcuador() {
    return (
        <g>
            <rect x={0} y={0} width={W} height={H / 2} fill="#FFD100" />
            <rect x={0} y={H / 2} width={W} height={H / 4} fill="#034EA2" />
            <rect x={0} y={H * 0.75} width={W} height={H / 4} fill="#EF3340" />
        </g>
    );
}

function FlagBolivia() {
    return (
        <g>
            <rect x={0} y={0} width={W} height={H / 3} fill="#D52B1E" />
            <rect x={0} y={H / 3} width={W} height={H / 3} fill="#F4E400" />
            <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#007A33" />
        </g>
    );
}

function FlagParaguay() {
    return (
        <g>
            <rect x={0} y={0} width={W} height={H / 3} fill="#D52B1E" />
            <rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
            <rect x={0} y={H * 2 / 3} width={W} height={H / 3} fill="#0038A8" />
        </g>
    );
}

const FLAGS = [
    { name: 'Perú', emoji: '🇵🇪', Component: FlagPeru },
    { name: 'Rep. Dominicana', emoji: '🇩🇴', Component: FlagRepDominicana },
    { name: 'Colombia', emoji: '🇨🇴', Component: FlagColombia },
    { name: 'Argentina', emoji: '🇦🇷', Component: FlagArgentina },
    { name: 'Venezuela', emoji: '🇻🇪', Component: FlagVenezuela },
    { name: 'El Salvador', emoji: '🇸🇻', Component: FlagElSalvador },
    { name: 'Ecuador', emoji: '🇪🇨', Component: FlagEcuador },
    { name: 'Bolivia', emoji: '🇧🇴', Component: FlagBolivia },
    { name: 'Honduras', emoji: '🇭🇳', Component: FlagHonduras },
    { name: 'Paraguay', emoji: '🇵🇾', Component: FlagParaguay },
];

export default function HeroBanderas() {
    const [cur, setCur] = useState(0);
    const [visible, setVisible] = useState(true);
    const timerRef = useRef(null);

    const fadeTo = (to) => {
        if (to === cur) return;
        setVisible(false);
        setTimeout(() => { setCur(to); setVisible(true); }, 500);
    };

    const startAutoplay = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCur(c => {
                const next = (c + 1) % FLAGS.length;
                setVisible(false);
                setTimeout(() => { setCur(next); setVisible(true); }, 500);
                return c;
            });
        }, 4500);
    };

    useEffect(() => {
        startAutoplay();
        return () => clearInterval(timerRef.current);
    }, []);

    const CurFlag = FLAGS[cur].Component;

    return (
        <>
            {/* Fondo fijo cubre toda la pantalla */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
            }}>
                {/* Bandera — viewBox vertical para móvil */}
                <svg
                    viewBox={'0 0 ' + W + ' ' + H}
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: visible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                    }}
                >
                    <CurFlag />
                </svg>

                {/* Gradiente perimetral — oscurece solo los bordes, centro vivo */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: [
                        'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.18) 100%)',
                    ].join(','),
                    pointerEvents: 'none',
                }} />

                {/* Overlay muy sutil solo para legibilidad del texto */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.55)',
                    pointerEvents: 'none',
                }} />
            </div>

            {/* Indicador país — esquina inferior izquierda, detrás de botones de la app */}
            <div style={{
                position: 'fixed',
                bottom: 20,
                left: 16,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 6,
                pointerEvents: 'none',
            }}>
                <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.3)',
                    fontFamily: 'sans-serif',
                    userSelect: 'none',
                }}>
                    {FLAGS[cur].emoji} {FLAGS[cur].name}
                </span>
                <div style={{ display: 'flex', gap: 5, pointerEvents: 'auto' }}>
                    {FLAGS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { clearInterval(timerRef.current); fadeTo(i); startAutoplay(); }}
                            style={{
                                width: i === cur ? 16 : 5,
                                height: 5,
                                borderRadius: 9999,
                                background: i === cur ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}