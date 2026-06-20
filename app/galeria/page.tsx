'use client'

import { useState } from "react";

export default function Galeria() {
    // 1. Estado para almacenar el modelo seleccionado (null significa modal cerrado)
    const [modeloSeleccionado, setModeloSeleccionado] =  useState<Modelo | null>(null);

    // Actualicé tu array con campos para la descripción y la ruta del archivo 3D

    interface Modelo {
        id: number;
        titulo: string;
        imagen: string;
        descripcion: string;
        archivo3d: string;
    }
    const modelos:Modelo[] = [
        {
            id: 1,
            titulo: "Soporte para Auriculares",
            imagen: "/galeria/imagen1.jpg",
            descripcion: "Soporte minimalista y resistente diseñado para todo tipo de auriculares de diadema. Evita deformaciones en las almohadillas.",
            archivo3d: "/galeria/imagen1.jpg"
        },
        {
            id: 2,
            titulo: "Figura Decorativa",
            imagen: "/galeria/imagen2.jpg",
            descripcion: "Escultura detallada de alta resolución ideal para decoración de interiores o pintura a mano. Impresa con filamento PLA premium.",
            archivo3d: "/galeria/imagen2.jpg"
        },
        {
            id: 3,
            titulo: "Pieza Mecánica",
            imagen: "/galeria/imagen3.jpg",
            descripcion: "Engranaje reforzado diseñado para soportar alta fricción mecánica. Optimizado para impresión en material PETG o ABS.",
            archivo3d: "/galeria/imagen3.jpg"
        },
        {
            id: 4,
            titulo: "Organizador",
            imagen: "/galeria/imagen4.jpg",
            descripcion: "Organizador modular de escritorio con múltiples compartimentos para bolígrafos, tarjetas de presentación y tarjetas SD.",
            archivo3d: "/galeria/imagen4.jpg"
        },
        {
            id: 5,
            titulo: "Organizador 2",
            imagen: "/galeria/imagen5.jpg",
            descripcion: "Bandeja apilable diseñada para la gestión de cables y pequeños componentes electrónicos en espacios de trabajo reducidos.",
            archivo3d: "/galeria/imagen5.jpg"
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

            {/* 3. Ventana Emergente (Modal) */}
            {modeloSeleccionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setModeloSeleccionado(null)} // Cierra al hacer clic en el fondo negro
                >
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
                    >
                        {/* Botón Cerrar (X) */}
                        <button
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 text-xl font-bold bg-zinc-800/50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            onClick={() => setModeloSeleccionado(null)}
                        >
                            &times;
                        </button>

                        {/* Contenido */}
                        <div className="aspect-video w-full overflow-hidden">
                            <img
                                src={modeloSeleccionado.imagen}
                                alt={modeloSeleccionado.titulo}
                                className="w-full h-full object-cover"
                            />
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
