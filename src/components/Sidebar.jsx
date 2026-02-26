import React from 'react';
import { SparklesIcon, MessageCircleIcon, BookOpenIcon, CardsIcon, PencilIcon } from './icons';

export default function Sidebar({
    language, setLanguage,
    level, setLevel,
    activeTab, setActiveTab
}) {
    const handleLanguageChange = (newLang) => {
        if (newLang === language) return;
        if (newLang === 'Japanese') {
            const levelMapToJLPT = { 'A1': 'N5', 'A2': 'N4', 'B1': 'N3', 'B2': 'N2', 'C1': 'N1' };
            setLevel(levelMapToJLPT[level] || 'N5');
        } else {
            const levelMapToCEFR = { 'N5': 'A1', 'N4': 'A2', 'N3': 'B1', 'N2': 'B2', 'N1': 'C1' };
            setLevel(levelMapToCEFR[level] || 'A1');
        }
        setLanguage(newLang);
    };

    return (
        <aside className="w-full md:w-80 bg-white/80 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col shadow-lg shadow-slate-200/20 z-10 flex-shrink-0 transition-all duration-300">
            <div className="p-6 border-b border-indigo-500/10 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative flex items-center gap-2 mb-2">
                    <SparklesIcon />
                    <h1 className="text-2xl font-black tracking-tight drop-shadow-sm">LingoTutor AI</h1>
                </div>
                <p className="relative text-indigo-100/90 text-sm font-medium">Tu viaje hacia la fluidez comienza aquí.</p>
            </div>

            <div className="p-6 flex-grow flex flex-col gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Idioma a estudiar</label>
                        <div className="flex bg-slate-100/50 p-1 rounded-xl">
                            <button
                                onClick={() => handleLanguageChange('English')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${language === 'English' ? 'bg-white text-indigo-700 font-bold shadow-sm ring-1 ring-slate-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'}`}
                            >
                                🇬🇧 Inglés
                            </button>
                            <button
                                onClick={() => handleLanguageChange('Japanese')}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${language === 'Japanese' ? 'bg-white text-rose-700 font-bold shadow-sm ring-1 ring-slate-200/50' : 'text-slate-600 hover:text-slate-900 font-medium'}`}
                            >
                                🇯🇵 Japonés
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tu Nivel Actual</label>
                        <div className="relative">
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200/60 text-slate-700 font-medium rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm hover:border-slate-300"
                            >
                                {language === 'English' ? (
                                    <>
                                        <option value="A1">A1 - Principiante (MCER)</option>
                                        <option value="A2">A2 - Básico (MCER)</option>
                                        <option value="B1">B1 - Intermedio (MCER)</option>
                                        <option value="B2">B2 - Intermedio Alto (MCER)</option>
                                        <option value="C1">C1 - Avanzado (MCER)</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="N5">N5 - Principiante (JLPT)</option>
                                        <option value="N4">N4 - Básico (JLPT)</option>
                                        <option value="N3">N3 - Intermedio (JLPT)</option>
                                        <option value="N2">N2 - Intermedio Alto (JLPT)</option>
                                        <option value="N1">N1 - Avanzado (JLPT)</option>
                                    </>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="mt-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        <div className={`transition-transform duration-200 ${activeTab === 'chat' ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-indigo-500'}`}><MessageCircleIcon /></div>
                        <span className="font-semibold text-sm">Tutor Virtual</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('guides')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'guides' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        <div className={`transition-transform duration-200 ${activeTab === 'guides' ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-indigo-500'}`}><BookOpenIcon /></div>
                        <span className="font-semibold text-sm">Guías y Ejercicios</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('flashcards')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        <div className={`transition-transform duration-200 ${activeTab === 'flashcards' ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-indigo-500'}`}><CardsIcon /></div>
                        <span className="font-semibold text-sm">Vocabulario Top</span>
                    </button>

                    {language === 'Japanese' && (
                        <button
                            onClick={() => setActiveTab('drawing')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group mt-2 border border-dashed ${activeTab === 'drawing' ? 'bg-rose-600 text-white shadow-md shadow-rose-200 border-transparent' : 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700'}`}
                        >
                            <div className={`transition-transform duration-200 ${activeTab === 'drawing' ? 'scale-110' : 'group-hover:scale-110 text-rose-400 group-hover:text-rose-600'}`}><PencilIcon /></div>
                            <span className="font-semibold text-sm">Práctica de Trazos</span>
                        </button>
                    )}
                </nav>
            </div>
        </aside>
    );
}
