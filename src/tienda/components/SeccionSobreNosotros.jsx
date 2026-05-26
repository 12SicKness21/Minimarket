export default function SeccionSobreNosotros() {
  return (
    <section
      id="sobre-nosotros"
      className="py-12 px-6"
      style={{
        backgroundColor: '#b5d99c',
        width: '100vw',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="max-w-xl mx-auto text-center">

        <p className="text-xl font-black uppercase tracking-widest mb-2 text-gray-700" style={{ letterSpacing: '0.2em' }}>
          Sobre nosotros
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-lg">🌎</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <p className="text-base sm:text-lg leading-loose text-gray-600">
          Nacimos en Madrid con una misión clara: mantener viva la riqueza culinaria de América Latina.
          Sabemos que la comida es identidad, cultura y un punto de encuentro. Por eso, te acercamos
          los ingredientes más auténticos y las marcas con las que creciste, garantizando un servicio
          online cómodo, rápido y seguro.
        </p>

        <p className="text-base sm:text-lg leading-loose text-gray-600 mt-4">
          Seleccionamos cada producto con el mismo cariño con el que cocinas para los tuyos, ofreciéndote
          variedad, frescura y novedades constantes con la seriedad que te mereces.
        </p>

        <p className="text-sm sm:text-base mt-5 italic font-semibold text-primario">
          Tus marcas de siempre, más cerca de tu hogar.
        </p>

      </div>
    </section>
  );
}
