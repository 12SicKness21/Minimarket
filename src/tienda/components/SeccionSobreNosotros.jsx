export default function SeccionSobreNosotros() {
  return (
    <section className="mt-12 mb-6 px-6 py-10">
      <div className="max-w-xl mx-auto text-center">

        <p className="text-base font-black uppercase tracking-widest text-red-600 mb-3">
          Sobre nosotros
        </p>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-800 leading-snug mb-5">
          Pasión por la gastronomía latina
        </h2>

        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-lg">🌎</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="text-gray-800 font-bold text-sm sm:text-base leading-relaxed">
          Nacimos en Madrid con una misión clara: mantener viva la riqueza culinaria de América Latina.
          Sabemos que la comida es identidad, cultura y un punto de encuentro. Por eso, te acercamos
          los ingredientes más auténticos y las marcas con las que creciste, garantizando un servicio
          online cómodo, rápido y seguro.
        </p>

        <p className="text-gray-800 font-bold text-sm sm:text-base leading-relaxed mt-4">
          Seleccionamos cada producto con el mismo cariño con el que cocinas para los tuyos, ofreciéndote
          variedad, frescura y novedades constantes con la seriedad que te mereces.
        </p>

        <p className="text-primario font-semibold text-sm sm:text-base mt-5 italic">
          ¡Te llevamos el sabor de casa a tu mesa!
        </p>

      </div>
    </section>
  );
}
