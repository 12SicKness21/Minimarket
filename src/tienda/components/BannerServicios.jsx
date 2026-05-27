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
    <div className="w-full overflow-hidden bg-white border-t border-b border-gray-100 py-3">
      <div className="flex animate-marquee">
        {items.map((logo, i) => (
          <div
            key={i}
            className="shrink-0 flex items-center justify-center mx-5"
            style={{ height: 40 }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
