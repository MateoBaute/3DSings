'use client'

import { useState, useEffect } from "react";
import { ReactNode } from "react";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          'auto-rotate'?: boolean | string;
          'camera-controls'?: boolean | string;
          'shadow-intensity'?: string | number;
          'environment-image'?: string;
          exposure?: string | number;
        };
      }
    }
  }
}

interface Modelo {
    id: number;
    titulo: string;
    imagen: string;
    descripcion: string;
    archivo3d: string;
}

export default function Galeria() {
    const [modeloSeleccionado, setModeloSeleccionado] = useState<Modelo | null>(null);

    // Cargar el script de model-viewer solo en el cliente
    useEffect(() => {
        import("@google/model-viewer");
    }, []);

    // NOTA: Para que el visor funcione, tus archivos en 'archivo3d' 
    // deberían ser formatos 3D reales (como .gltf o .glb) en lugar de un .jpg
    const modelos: Modelo[] = [
        {
            id: 1,
            titulo: "Soporte para Auriculares",
            imagen: "/galeria/imagen1.jpg",
            descripcion: "Soporte minimalista y resistente diseñado para todo tipo de auriculares de diadema. Evita deformaciones en las almohadillas.",
            archivo3d: "/modelos/cueva.glb"
        },
        {
            id: 2,
            titulo: "Figura Decorativa",
            imagen: "/galeria/imagen2.jpg",
            descripcion: "Escultura detallada de alta resolución ideal para decoración de interiores o pintura a mano. Impresa con filamento PLA premium.",
            archivo3d: "/galeria/figura.glb"
        },
        {
            id: 3,
            titulo: "Pieza Mecánica",
            imagen: "/galeria/imagen3.jpg",
            descripcion: "Engranaje reforzado diseñado para soportar alta fricción mecánica. Optimizado para impresión en material PETG o ABS.",
            archivo3d: "/galeria/engranaje.glb"
        },
        {
            id: 4,
            titulo: "Organizador",
            imagen: "/galeria/imagen4.jpg",
            descripcion: "Organizador modular de escritorio con múltiples compartimentos para bolígrafos, tarjetas de presentación y tarjetas SD.",
            archivo3d: "/galeria/organizador1.glb"
        },
        {
            id: 5,
            titulo: "Organizador 2",
            imagen: "/galeria/imagen5.jpg",
            descripcion: "Bandeja apilable diseñada para la gestión de cables y pequeños componentes electrónicos en espacios de trabajo reducidos.",
            archivo3d: "/galeria/organizador2.glb"
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

                {/* Grid de Tarjetas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modelos.map((modelo) => (
                        <div
                            key={modelo.id}
                            onClick={() => setModeloSeleccionado(modelo)}
                            className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={modelo.imagen}
                                    alt={modelo.titulo}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-5 flex justify-between items-center">
                                <h3 className="font-bold text-lg group-hover:text-amber-500 transition-colors">
                                    {modelo.titulo}
                                </h3>
                                <span className="text-zinc-500 text-sm group-hover:translate-x-1 transition-transform">
                                    Ver →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ventana Emergente (Modal con Visor 3D) */}
            {modeloSeleccionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setModeloSeleccionado(null)}
                >
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón Cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 text-xl font-bold bg-zinc-800/80 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
                            onClick={() => setModeloSeleccionado(null)}
                        >
                            &times;
                        </button>

                        {/* Reemplazo de Imagen fija por Visor interactivo 3D */}
                        <div className="aspect-video w-full bg-zinc-950 border-b border-zinc-800 relative">
                            <model-viewer
                                src={modeloSeleccionado.archivo3d}
                                poster={modeloSeleccionado.archivo3d}
                                alt={modeloSeleccionado.titulo}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1"
                                environment-image="neutral"
                                exposure="1"
                                style={{ width: '100%', height: '100%', backgroundColor: '#09090b' }}
                            >
                            </model-viewer>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-amber-500">
                                {modeloSeleccionado.titulo}
                            </h2>

                            <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
                                {modeloSeleccionado.descripcion}
                            </p>

                            {/* Botón de descarga */}
                            <div className="mt-6 flex justify-end">
                                <a
                                    href={modeloSeleccionado.archivo3d}
                                    download
                                    className="w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-xl transition-all duration-200 transform active:scale-95"
                                >
                                    Descargar Archivo 3D
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
