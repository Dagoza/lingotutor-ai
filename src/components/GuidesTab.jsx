import React, { useState } from 'react';
import { BookOpenIcon, ArrowLeftIcon, SparklesIcon } from './icons';

const FormattedText = ({ text }) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return (
        <span className="leading-relaxed">
            {parts.map((part, index) => {
                if (part === '\n') return <br key={index} />;
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-indigo-900 drop-shadow-sm">{part.slice(2, -2)}</strong>;
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

export default function GuidesTab({ currentGuides, level, requestAIExercise }) {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [exerciseFeedback, setExerciseFeedback] = useState({});

    const handleExerciseOptionClick = (guideId, option, correct) => {
        setExerciseAnswers(prev => ({ ...prev, [guideId]: option }));
        setExerciseFeedback(prev => ({
            ...prev,
            [guideId]: option === correct
                ? "¡Correcto! 🎉 Excelente trabajo."
                : "Esa no es la respuesta correcta, ¡pero no te desanimes! Vuelve a revisar la tabla de arriba."
        }));
    };

    if (!selectedGuide) {
        return (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 w-full max-w-5xl mx-auto custom-scrollbar">
                <div className="animate-fadeIn">
                    <header className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-3">Guías Didácticas <span className="text-indigo-600">Nivel {level}</span></h2>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl">
                            Domina los temas oficiales. Selecciona una tarjeta para ver la explicación, esquemas visuales y realizar ejercicios interactivos.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {currentGuides.length > 0 ? (
                            currentGuides.map((guide, i) => (
                                <div
                                    key={guide.id}
                                    onClick={() => setSelectedGuide(guide)}
                                    className="bg-white p-7 rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] border border-slate-100/60 hover:shadow-[0_8px_30px_-4px_rgba(99,102,241,0.15)] hover:border-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col h-full transform hover:-translate-y-1 animate-fadeIn"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="w-14 h-14 bg-indigo-50/50 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-indigo-600 text-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm border border-indigo-100 group-hover:border-transparent">
                                        <BookOpenIcon />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-900 transition-colors">{guide.title}</h3>
                                    <p className="text-slate-500 text-[15px] flex-grow font-medium leading-relaxed">{guide.shortDescription}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-slate-100/50 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                                    <BookOpenIcon />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Aún no hay guías</h3>
                                <p className="text-slate-500 font-medium">Estamos preparando más contenido para este nivel específico.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto custom-scrollbar">
            <div className="animate-fadeIn max-w-3xl mx-auto pb-10">
                <button
                    onClick={() => setSelectedGuide(null)}
                    className="flex items-center gap-2.5 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-slate-200 w-max"
                >
                    <ArrowLeftIcon /> Volver al temario
                </button>

                <article className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden transform transition-all">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <span className="relative inline-flex items-center gap-2 px-4 py-1.5 bg-white text-indigo-700 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-sm ring-1 ring-inset ring-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Lección • Nivel {level}
                        </span>
                        <h1 className="relative text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">{selectedGuide.title}</h1>
                        <p className="relative text-indigo-900/70 text-lg md:text-xl font-medium max-w-xl">{selectedGuide.shortDescription}</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        <section className="text-slate-600 text-lg md:text-[19px] leading-relaxed font-medium">
                            <FormattedText text={selectedGuide.explanation} />
                        </section>

                        {selectedGuide.table && (
                            <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200 my-8">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse bg-white whitespace-nowrap md:whitespace-normal">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                {selectedGuide.table.headers.map((h, i) => (
                                                    <th key={i} className="py-4 px-6 font-bold text-[13px] uppercase tracking-wider text-slate-500">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedGuide.table.rows.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="py-4 px-6 text-[15px] text-slate-700 font-medium">
                                                            {j === 0 ? <span className="font-bold text-slate-900">{cell}</span> : cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {selectedGuide.learningObjectives && selectedGuide.learningObjectives.length > 0 && (
                            <section className="bg-white rounded-3xl border border-indigo-100 p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">🎯</span>
                                    Objetivos de Aprendizaje
                                </h3>
                                <ul className="space-y-4">
                                    {selectedGuide.learningObjectives.map((obj, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-700 font-medium text-lg">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {selectedGuide.keyPoints && selectedGuide.keyPoints.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm">💡</span>
                                    Puntos Clave
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {selectedGuide.keyPoints.map((kp, i) => (
                                        <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h4 className="font-bold text-slate-800 text-lg mb-4">{kp.title}</h4>
                                            <ul className="space-y-3">
                                                {kp.bullets.map((bullet, j) => (
                                                    <li key={j} className="flex gap-3 text-slate-600 font-medium">
                                                        <span className="text-amber-500 mt-1.5 text-xs">◆</span>
                                                        <span className="leading-relaxed">{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {selectedGuide.exercise && (
                            <section className="mt-12 bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 pointer-events-none">✍️</div>
                                <div className="relative">
                                    <h3 className="text-sm font-bold tracking-widest uppercase text-indigo-500 mb-2">Práctica Rápida</h3>
                                    <p className="text-xl md:text-2xl font-bold text-slate-800 mb-6">{selectedGuide.exercise.question}</p>

                                    <div className="space-y-3">
                                        {selectedGuide.exercise.options.map((opt, i) => {
                                            const isSelected = exerciseAnswers[selectedGuide.id] === opt;
                                            const isCorrect = opt === selectedGuide.exercise.correctAnswer;
                                            const hasAnswered = !!exerciseAnswers[selectedGuide.id];

                                            let btnClass = "w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 font-bold text-[15px] ";
                                            if (!hasAnswered) btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 text-slate-700";
                                            else if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-800 shadow-sm";
                                            else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-500 text-red-800 shadow-sm";
                                            else btnClass += "bg-white border-slate-200/60 text-slate-400 opacity-60";

                                            return (
                                                <button
                                                    key={i} disabled={hasAnswered}
                                                    onClick={() => handleExerciseOptionClick(selectedGuide.id, opt, selectedGuide.exercise.correctAnswer)}
                                                    className={btnClass}
                                                >
                                                    <span className="flex items-center justify-between">
                                                        {opt}
                                                        {hasAnswered && isCorrect && <span className="text-green-600 text-xl">✓</span>}
                                                        {hasAnswered && isSelected && !isCorrect && <span className="text-red-600 text-xl">✗</span>}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {exerciseFeedback[selectedGuide.id] && (
                                        <div className={`mt-5 p-4 rounded-2xl text-[15px] font-bold flex items-center gap-3 animate-fadeIn ${exerciseAnswers[selectedGuide.id] === selectedGuide.exercise.correctAnswer ? 'bg-green-100/50 text-green-800 border fill-green-200/50 border-green-200' : 'bg-red-100/50 text-red-800 border fill-red-200/50 border-red-200'}`}>
                                            {exerciseAnswers[selectedGuide.id] === selectedGuide.exercise.correctAnswer ? (
                                                <span className="text-xl">🎉</span>
                                            ) : (
                                                <span className="text-xl">💡</span>
                                            )}
                                            <span>{exerciseFeedback[selectedGuide.id]}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="bg-slate-900 p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
                        <div className="relative">
                            <h3 className="text-white font-black text-2xl mb-2">¿Quieres llevar esto a la práctica real?</h3>
                            <p className="text-slate-400 font-medium mb-8">Usa al Tutor AI para conversar usando este tema.</p>
                            <button
                                onClick={() => requestAIExercise(`¡Hola Tutor! Acabo de estudiar la guía sobre "${selectedGuide.title}". Por favor, genérame un ejercicio práctico, corto y dinámico en este nivel para poner a prueba lo que aprendí.`)}
                                className="group bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-3 mx-auto transform hover:-translate-y-1"
                            >
                                <SparklesIcon /> <span className="tracking-wide">Practicar con el Tutor AI</span>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
