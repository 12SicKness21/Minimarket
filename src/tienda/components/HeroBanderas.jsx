import { useState, useEffect, useRef } from 'react';
import {
    W, H,
    FlagPeru, FlagRepDominicana, FlagColombia, FlagArgentina, FlagVenezuela,
    FlagElSalvador, FlagHonduras, FlagEcuador, FlagBolivia, FlagParaguay,
} from '../../shared/components/BanderaPais';

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