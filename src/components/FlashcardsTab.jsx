import React, { useState, useEffect, useMemo } from 'react';
import { CardsIcon, ArrowLeftIcon, SparklesIcon } from './icons';

export const StarIcon = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export const CheckCircleIcon = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const WORDS_PER_PAGE = 50;

export default function FlashcardsTab({ currentVocab, level, language, requestAIExercise }) {
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all'); // 'all', 'favorites', 'learned'

    // Persistent States
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem(`lingotutor_favs_${language}_${level}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [learned, setLearned] = useState(() => {
        const saved = localStorage.getItem(`lingotutor_learned_${language}_${level}`);
        return saved ? JSON.parse(saved) : [];
    });

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem(`lingotutor_favs_${language}_${level}`, JSON.stringify(favorites));
    }, [favorites, language, level]);

    useEffect(() => {
        localStorage.setItem(`lingotutor_learned_${language}_${level}`, JSON.stringify(learned));
    }, [learned, language, level]);

    // Reset states when language or level changes
    useEffect(() => {
        setFlashcardIndex(0);
        setIsFlipped(false);
        setCurrentPage(1);
        setFilter('all');
    }, [currentVocab, level, language]);

    // Handle Filtering
    const filteredVocab = useMemo(() => {
        let filtered = currentVocab;
        if (filter === 'favorites') {
            filtered = currentVocab.filter(v => favorites.includes(v.id || v.word));
        } else if (filter === 'learned') {
            filtered = currentVocab.filter(v => learned.includes(v.id || v.word));
        }
        return filtered;
    }, [currentVocab, filter, favorites, learned]);

    // Handle Pagination
    const totalPages = Math.ceil(filteredVocab.length / WORDS_PER_PAGE) || 1;

    const currentPaginatedVocab = useMemo(() => {
        const start = (currentPage - 1) * WORDS_PER_PAGE;
        return filteredVocab.slice(start, start + WORDS_PER_PAGE);
    }, [filteredVocab, currentPage]);

    const toggleFavorite = (wordId, e) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
        );
    };

    const toggleLearned = (wordId, e) => {
        e.stopPropagation();
        setLearned(prev =>
            prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
        );
    };

    if (currentVocab.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 w-full max-w-4xl mx-auto flex items-center justify-center h-full">
                <div className="bg-slate-100/50 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                        <CardsIcon />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Aún no hay vocabulario</h3>
                    <p className="text-slate-500 font-medium">Estamos preparando las tarjetas para este nivel.</p>
                </div>
            </div>
        );
    }

    const currentCard = currentPaginatedVocab[flashcardIndex];

    const nextCard = () => {
        if (currentPaginatedVocab.length === 0) return;
        setIsFlipped(false);
        setTimeout(() => {
            setFlashcardIndex((prev) => (prev + 1) % currentPaginatedVocab.length);
        }, 150);
    };

    const prevCard = () => {
        if (currentPaginatedVocab.length === 0) return;
        setIsFlipped(false);
        setTimeout(() => {
            setFlashcardIndex((prev) => (prev - 1 + currentPaginatedVocab.length) % currentPaginatedVocab.length);
        }, 150);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 w-full max-w-5xl mx-auto custom-scrollbar flex flex-col items-center">
            <header className="mb-8 w-full text-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-3">Vocabulario Top 1000</h2>
                <p className="text-slate-500 font-medium text-lg">Nivel {level} • Total general: {currentVocab.length}</p>
            </header>

            {/* Filter Tabs */}
            <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1 mb-8 w-full max-w-md">
                <button
                    onClick={() => { setFilter('all'); setFlashcardIndex(0); setCurrentPage(1); }}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Todas
                </button>
                <button
                    onClick={() => { setFilter('favorites'); setFlashcardIndex(0); setCurrentPage(1); }}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${filter === 'favorites' ? 'bg-yellow-50 text-yellow-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    ⭐️ Favoritas ({favorites.length})
                </button>
                <button
                    onClick={() => { setFilter('learned'); setFlashcardIndex(0); setCurrentPage(1); }}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${filter === 'learned' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    ✅ Aprendidas ({learned.length})
                </button>
            </div>

            {currentPaginatedVocab.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4"><CardsIcon /></div>
                    <p className="text-slate-500 font-medium text-lg">No hay tarjetas en esta categoría.</p>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center animate-fadeIn pb-10 flex-grow">

                    <div className="flex justify-between w-full max-w-lg mb-6 items-center px-4">
                        <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                            Página {currentPage} de {totalPages}
                        </span>
                        <span className="text-[11px] font-black text-indigo-500 tracking-widest uppercase bg-indigo-50/80 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                            Tarjeta {flashcardIndex + 1} de {currentPaginatedVocab.length}
                        </span>
                    </div>

                    <div className="relative w-full max-w-lg h-[24rem] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                        <div className={`w-full h-full transition-all duration-700 ease-in-out transform-style-3d rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ${isFlipped ? 'rotate-y-180' : 'group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.2)]'}`}>

                            {/* Front Card */}
                            <div className="absolute w-full h-full backface-hidden bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-white to-white">

                                {/* Actions Top Left */}
                                <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                                    <button
                                        onClick={(e) => toggleFavorite(currentCard.id || currentCard.word, e)}
                                        className={`p-2 rounded-full transition-all ${favorites.includes(currentCard.id || currentCard.word) ? 'text-yellow-400 bg-yellow-50' : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-50'}`}
                                        title="Marcar como favorito"
                                    >
                                        <StarIcon filled={favorites.includes(currentCard.id || currentCard.word)} className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={(e) => toggleLearned(currentCard.id || currentCard.word, e)}
                                        className={`p-2 rounded-full transition-all ${learned.includes(currentCard.id || currentCard.word) ? 'text-green-500 bg-green-50' : 'text-slate-300 hover:text-green-500 hover:bg-slate-50'}`}
                                        title="Marcar como aprendido"
                                    >
                                        <CheckCircleIcon filled={learned.includes(currentCard.id || currentCard.word)} className="w-6 h-6" />
                                    </button>
                                </div>

                                <span className="absolute top-6 right-8 text-indigo-100"><CardsIcon /></span>
                                <h3 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 drop-shadow-sm tracking-tight px-12 leading-tight">{currentCard.word}</h3>
                                {currentCard.phonetic && <p className="text-xl md:text-2xl text-slate-400 font-bold bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100">{currentCard.phonetic}</p>}

                                <div className="absolute bottom-8 text-[13px] text-indigo-400/80 font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                                    <span>Haz clic para voltear</span>
                                    <span className="text-lg">↺</span>
                                </div>
                            </div>

                            {/* Back Card */}
                            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center rotate-y-180 text-white shadow-inner overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                                <h3 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md z-10 px-4 leading-tight">{currentCard.translation}</h3>
                                <div className="w-16 h-1.5 bg-indigo-300/30 rounded-full my-8 z-10"></div>
                                <p className="text-xl md:text-2xl font-medium italic opacity-95 leading-relaxed px-6 z-10">"{currentCard.example}"</p>
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full max-w-lg justify-center sm:justify-between px-2">
                        <button onClick={prevCard} className="w-14 h-14 shrink-0 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105 active:scale-95">
                            <ArrowLeftIcon />
                        </button>
                        <button
                            onClick={() => requestAIExercise(`¡Hola Tutor! Acabo de aprender la palabra "${currentCard.word}". Por favor, genérame un ejercicio práctico, corto y dinámico en este nivel usando esta palabra en un contexto real.`)}
                            className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-slate-800 flex items-center justify-center gap-3 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
                        >
                            <SparklesIcon /> <span>Practicar en Chat</span>
                        </button>
                        <button onClick={nextCard} className="w-14 h-14 shrink-0 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm rotate-180 transition-all hover:scale-105 active:scale-95">
                            <ArrowLeftIcon />
                        </button>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2 mt-10 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
                            <button
                                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setFlashcardIndex(0); }}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                            >
                                <ArrowLeftIcon />
                            </button>

                            <div className="flex items-center gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageInfo = i + 1;
                                    // Show max 5 page indicators to avoid overflow
                                    if (
                                        pageInfo === 1 ||
                                        pageInfo === totalPages ||
                                        (pageInfo >= currentPage - 1 && pageInfo <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => { setCurrentPage(pageInfo); setFlashcardIndex(0); }}
                                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === pageInfo ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                            >
                                                {pageInfo}
                                            </button>
                                        );
                                    } else if (
                                        (pageInfo === currentPage - 2 && currentPage > 3) ||
                                        (pageInfo === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return <span key={i} className="text-slate-300 px-1">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setFlashcardIndex(0); }}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors rotate-180"
                            >
                                <ArrowLeftIcon />
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
