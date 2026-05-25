export default function SeccionSobreNosotros() {
  return (
    <section
      className="mt-12 mb-6 px-6 py-10 rounded-3xl overflow-hidden relative"
      style={{
        backgroundImage: 'url(/fondo_nosotros.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="relative z-10 max-w-xl mx-auto text-center text-white"
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}
      >

        <p className="text-xl font-black uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
          Sobre nosotros
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-lg">🌎</span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        <p className="text-base sm:text-lg leading-loose font-semibold">
          Nacimos en Madrid con una misión clara: mantener viva la riqueza culinaria de América Latina.
          Sabemos que la comida es identidad, cultura y un punto de encuentro. Por eso, te acercamos
          los ingredientes más auténticos y las marcas con las que creciste, garantizando un servicio
          online cómodo, rápido y seguro.
        </p>

        <p className="text-base sm:text-lg leading-loose font-semibold mt-4">
          Seleccionamos cada producto con el mismo cariño con el que cocinas para los tuyos, ofreciéndote
          variedad, frescura y novedades constantes con la seriedad que te mereces.
        </p>

        <p className="text-primario text-sm sm:text-base mt-5 italic font-semibold">
          ¡Te llevamos el sabor de casa a tu mesa!
        </p>

      </div>
    </section>
  );
}
