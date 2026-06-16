export default function Galeria() {
    const modelos = [
        {
            id: 1,
            titulo: "Soporte para Auriculares",
            imagen: "/galeria/imagen1.jpg",
        },
        {
            id: 2,
            titulo: "Figura Decorativa",
            imagen: "/galeria/imagen2.jpg",
        },
        {
            id: 3,
            titulo: "Pieza Mecánica",
            imagen: "/galeria/imagen3.jpg",
        },
        {
            id: 4,
            titulo: "Organizador",
            imagen: "/galeria/imagen4.jpg",
        },
        {
            id: 5,
            titulo: "Organizador",
            imagen: "/galeria/imagen5.jpg",
        },
    ];

    return (
        <section className="min-h-screen bg-black text-zinc-50 py-20 px-6">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-14">
                    <span className="text-sm font-semibold tracking-wider uppercase text-amber-500">
                        Nuestros Trabajos
                    </span>

                    <h1 className="text-4xl md:text-5xl font-extrabold mt-3">
                        Galería de Impresiones 3D
                    </h1>

                    <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                        Algunos de los modelos y proyectos realizados para nuestros clientes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modelos.map((modelo) => (
                        <div
                            key={modelo.id}
                            className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/50 transition-all duration-300"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={modelo.imagen}
                                    alt={modelo.titulo}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-lg">
                                    {modelo.titulo}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}