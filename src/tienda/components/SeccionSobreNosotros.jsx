// Banderas decorativas flotantes — posiciones fijas para que no salten en cada render
const DECO = [
  { emoji: '🇻🇪', top: '8%',  left: '4%',  size: '2.8rem', opacity: 0.18, rotate: '-12deg' },
  { emoji: '🇨🇴', top: '18%', left: '88%', size: '2.2rem', opacity: 0.14, rotate: '8deg'  },
  { emoji: '🇵🇪', top: '55%', left: '6%',  size: '1.9rem', opacity: 0.13, rotate: '15deg' },
  { emoji: '🇦🇷', top: '70%', left: '82%', size: '2.5rem', opacity: 0.16, rotate: '-6deg' },
  { emoji: '🇪🇨', top: '38%', left: '92%', size: '1.7rem', opacity: 0.12, rotate: '20deg' },
  { emoji: '🇲🇽', top: '82%', left: '22%', size: '2rem',   opacity: 0.15, rotate: '-18deg'},
  { emoji: '🇨🇱', top: '12%', left: '52%', size: '1.6rem', opacity: 0.10, rotate: '5deg'  },
  { emoji: '🇧🇴', top: '62%', left: '48%', size: '1.5rem', opacity: 0.10, rotate: '-22deg'},
  { emoji: '🇩🇴', top: '88%', left: '68%', size: '1.8rem', opacity: 0.12, rotate: '12deg' },
  { emoji: '🇨🇺', top: '30%', left: '18%', size: '1.6rem', opacity: 0.11, rotate: '-8deg' },
];

// Ticker inferior con los países
const TICKER_ITEMS = [
  '🇻🇪 Venezuela', '🇨🇴 Colombia', '🇵🇪 Perú', '🇦🇷 Argentina',
  '🇲🇽 México', '🇪🇨 Ecuador', '🇨🇱 Chile', '🇧🇴 Bolivia',
  '🇩🇴 República Dominicana', '🇨🇺 Cuba', '🇺🇾 Uruguay', '🇵🇾 Paraguay',
];

export default function SeccionSobreNosotros() {
  return (
    <section className="relative mt-12 mb-6 rounded-3xl overflow-hidden shadow-xl">

      {/* Fondo animado con colores de banderas */}
      <div className="absolute inset-0 animate-flags-bg" />

      {/* Oscurecimiento para legibilidad */}
      <div className="absolute inset-0 bg-black/52" />

      {/* Banderas flotantes decorativas */}
      {DECO.map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute select-none pointer-events-none"
          style={{
            top: d.top, left: d.left,
            fontSize: d.size,
            opacity: d.opacity,
            transform: `rotate(${d.rotate})`,
            lineHeight: 1,
          }}
        >
          {d.emoji}
        </span>
      ))}

      {/* Contenido */}
      <div className="relative z-10 px-6 pt-10 pb-6">
        <div className="max-w-xl mx-auto text-center">

          {/* Tagline */}
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
            Sobre nosotros
          </p>

          {/* Título */}
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-snug mb-5">
            Pasión por la<br />
            <span className="text-yellow-300">gastronomía latina</span>
          </h2>

          {/* Separador */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-lg">🌎</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          {/* Texto */}
          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            Nacimos en Madrid con una misión clara: mantener viva la riqueza culinaria de América Latina.
            Sabemos que la comida es identidad, cultura y un punto de encuentro. Por eso, te acercamos
            los ingredientes más auténticos y las marcas con las que creciste, garantizando un servicio
            online cómodo, rápido y seguro.
          </p>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed mt-4">
            Seleccionamos cada producto con el mismo cariño con el que cocinas para los tuyos, ofreciéndote
            variedad, frescura y novedades constantes con la seriedad que te mereces.
          </p>

          <p className="text-yellow-200 font-semibold text-sm sm:text-base mt-5 italic">
            ¡Te llevamos el sabor de casa a tu mesa!
          </p>

        </div>
      </div>

      {/* Ticker de países */}
      <div className="relative z-10 overflow-hidden border-t border-white/10 bg-black/30 py-2.5">
        <div className="flex gap-6 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-white/60 uppercase tracking-wide shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
