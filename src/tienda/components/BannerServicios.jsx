const LOGOS = [
  { src: '/servicios/Amazon Hub.avif', alt: 'Amazon Hub' },
  { src: '/servicios/CTT.webp',        alt: 'CTT' },
  { src: '/servicios/Correos.png',     alt: 'Correos' },
  { src: '/servicios/ECO.avif',        alt: 'ECO' },
  { src: '/servicios/GLS.avif',        alt: 'GLS' },
  { src: '/servicios/Impresion.avif',  alt: 'Impresión' },
  { src: '/servicios/LEBARA.png',      alt: 'Lebara' },
  { src: '/servicios/MASMOVIL.jpg',    alt: 'MásMóvil' },
  { src: '/servicios/MRW.webp',        alt: 'MRW' },
  { src: '/servicios/ORANGE.png',      alt: 'Orange' },
  { src: '/servicios/RIA.avif',        alt: 'RIA' },
  { src: '/servicios/SEUR.avif',       alt: 'SEUR' },
  { src: '/servicios/TIPSA.png',       alt: 'TIPSA' },
  { src: '/servicios/WU.png',          alt: 'Western Union' },
];

export default function BannerServicios() {
  const items = [...LOGOS, ...LOGOS]; // duplicar para loop infinito

  return (
    <>
      {/* Espaciador para que el contenido no quede tapado por la barra fija */}
      <div style={{ height: 52 }} />

      {/* Barra fija en la parte inferior */}
      <div
        className="fixed bottom-0 left-0 right-0 overflow-hidden bg-white border-t border-gray-200"
        style={{ zIndex: 40, height: 52, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center h-full" style={{ animation: 'marquee 18s linear infinite' }}>
          {items.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center"
              style={{ marginLeft: 20, marginRight: 20 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="h-7 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
