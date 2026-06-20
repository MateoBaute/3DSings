'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FQSYRESP {
    id: number
    nombre: string
    whatsapp: string
    correo: string
    descripcion: string
    respuesta: string | null
}

export default function MostrarFaqs() {
    const [fqs, setFqs] = useState<FQSYRESP[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [isLogged, setIsLogged] = useState<boolean>(false)

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedFaq, setSelectedFaq] = useState<FQSYRESP | null>(null)
    const [nuevaRespuesta, setNuevaRespuesta] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    async function getFqs() {
        try {
            setLoading(true)

            const { data, error } = await supabase
                .from('faqs_clientes')
                .select(`
                    id,
                    nombre,
                    whatsapp,
                    correo,
                    descripcion,
                    respuestas (
                        respuesta
                    )
                `)

            if (error) throw error

            if (data) {
                // Mapeamos el resultado para aplanar el objeto y cumplir con tu interfaz FQSYRESP
                const datosCombinados: FQSYRESP[] = data.map((item: any) => ({
                    id: item.id,
                    nombre: item.nombre,
                    whatsapp: item.whatsapp,
                    correo: item.correo,
                    descripcion: item.descripcion,
                    respuesta: item.respuestas && item.respuestas.length > 0
                        ? item.respuestas[0].respuesta
                        : null
                }))

                setFqs(datosCombinados)
            }
        } catch (error: any) {
            console.error('Error cargando FAQs:', error.message)
            setErrorMsg('Hubo un problema al cargar las preguntas. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const responderFaq = (faq: FQSYRESP) => {
        if (isLogged) {
            setSelectedFaq(faq)
            setNuevaRespuesta(faq.respuesta || '')
            setIsModalOpen(true)
        }
    }

    const guardarRespuesta = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFaq) return

        try {
            setIsSubmitting(true)

            if (selectedFaq.respuesta) {
                const { error } = await supabase
                    .from('respuestas')
                    .update({ respuesta: nuevaRespuesta })
                    .eq('id_faqs', selectedFaq.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('respuestas')
                    .insert([{ respuesta: nuevaRespuesta, id_faqs: selectedFaq.id }])

                if (error) throw error
            }

            setIsModalOpen(false)
            setSelectedFaq(null)
            setNuevaRespuesta('')
            await getFqs()

        } catch (error: any) {
            console.error('Error al guardar respuesta:', error.message)
            alert('No se pudo guardar la respuesta.')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        getFqs();

        const verificarAutenticacion = async () => {
            try {
                const response = await fetch('/api/auth/status', {
                    method: 'GET',
                });

                if (response.ok) {
                    setIsLogged(true);
                    console.log('Sesión válida confirmada por el servidor');
                } else {
                    setIsLogged(false);
                    console.log('El servidor no detectó la cookie de sesión');
                }
            } catch (error) {
                console.error('Error de red al validar sesión:', error);
                setIsLogged(false);
            }
        };

        verificarAutenticacion();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-zinc-400 text-sm font-medium tracking-wide uppercase">
                <span className="animate-pulse">Cargando preguntas frecuentes...</span>
            </div>
        )
    }

    if (errorMsg) {
        return (
            <div className="max-w-xl mx-auto px-6 py-4 text-center text-sm font-medium text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20">
                {errorMsg}
            </div>
        )
    }

    return (
        <section id="faqs" className="max-w-[80%] mx-auto py-20 px-6 text-zinc-50">
            <div className="text-center mb-10">
                <span className="text-sm font-semibold tracking-wider uppercase text-amber-500 block mb-2">
                    Soporte & Contacto
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Preguntas Frecuentes
                </h2>
                <p className="text-zinc-400 mt-2 text-sm">
                    Revisa las dudas comunes o comunícate directamente con nuestro equipo.
                </p>
            </div>

            {fqs.length === 0 ? (
                <p className="text-center text-zinc-500 text-sm">No hay FAQs disponibles en este momento.</p>
            ) : (
                <div className="space-y-4 grid">
                    {fqs.map((faq, index) => (
                        <div
                            onClick={() => responderFaq(faq)}
                            key={faq.id || index}
                            className={`bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-2xl transition-all duration-300 ${isLogged ? 'hover:border-amber-500/50 cursor-pointer' : 'hover:border-zinc-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-base font-bold tracking-tight text-zinc-100">
                                    {faq.nombre}
                                </h3>
                                {isLogged && (
                                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-medium border border-amber-500/20">
                                        {faq.respuesta ? 'Editar Resp.' : 'Responder'}
                                    </span>
                                )}
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                <span className="font-semibold text-zinc-300 block mb-1 text-xs uppercase tracking-wider">Pregunta / Descripción:</span>
                                {faq.descripcion}
                            </p>

                            {/* Mostrar la respuesta si existe en la base de datos */}
                            {faq.respuesta && (
                                <div className="mb-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                                    <span className="font-semibold text-amber-500 block mb-1 text-xs uppercase tracking-wider">Respuesta Oficial:</span>
                                    <p className="text-zinc-200 text-sm italic">"{faq.respuesta}"</p>
                                </div>
                            )}

                            <div className="border-t border-zinc-900/50 pt-4 flex flex-wrap gap-x-6 gap-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                                        WhatsApp:
                                    </span>
                                    <span className="text-sm font-medium text-amber-500 hover:underline">
                                        {faq.whatsapp}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                                        Correo:
                                    </span>
                                    <span className="text-sm font-medium text-zinc-300">
                                        {faq.correo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE TAILWIND */}
            {isModalOpen && selectedFaq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-100">Responder a: {selectedFaq.nombre}</h3>
                            <p className="text-xs text-zinc-400 mt-1">ID Pregunta: {selectedFaq.id}</p>
                        </div>

                        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-sm text-zinc-400">
                            <span className="block font-bold text-zinc-300 text-xs uppercase mb-1">Consulta original:</span>
                            "{selectedFaq.descripcion}"
                        </div>

                        <form onSubmit={guardarRespuesta} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                                    Tu Respuesta
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={nuevaRespuesta}
                                    onChange={(e) => setNuevaRespuesta(e.target.value)}
                                    placeholder="Escribe la solución o respuesta oficial aquí..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 placeholder-zinc-600 resize-none transition-colors"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setSelectedFaq(null); }}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Respuesta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
