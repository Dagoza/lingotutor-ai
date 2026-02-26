import React, { useRef, useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, UndoIcon, BookOpenIcon } from './icons'; // Ensure we have/add these

export default function JapaneseCanvasTab() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);

    // Initialize canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        // Make canvas fill the container width and be perfectly square
        const resizeCanvas = () => {
            const width = container.offsetWidth;
            canvas.width = width;
            canvas.height = width;

            // Re-draw background grid if we resize
            drawGrid();
        };

        // Initial resize
        if (container) resizeCanvas();

        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const drawGrid = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Clear before grid
        ctx.clearRect(0, 0, w, h);

        // Background color
        ctx.fillStyle = '#f8fafc'; // slate-50
        ctx.fillRect(0, 0, w, h);

        // Draw Cuadricula (Cross-hair guidelines)
        ctx.beginPath();
        ctx.setLineDash([10, 10]); // Dashed line
        ctx.strokeStyle = '#cbd5e1'; // slate-300
        ctx.lineWidth = 2;

        // Vertical line
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);

        // Horizontal line
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);

        // Diagonal lines (optional but good for Kanji)
        // ctx.moveTo(0, 0);
        // ctx.lineTo(w, h);
        // ctx.moveTo(w, 0);
        // ctx.lineTo(0, h);

        ctx.stroke();
        ctx.setLineDash([]); // Reset dashed for actual drawing
    };

    // Whenever history changes, redraw canvas based on history
    useEffect(() => {
        const drawSavedState = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Redraw base grid first
            drawGrid();

            // If we have history up to the current step, draw it
            if (historyStep >= 0 && history[historyStep]) {
                const img = new Image();
                img.src = history[historyStep];
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                };
            }
        };
        drawSavedState();
    }, [historyStep, history]);


    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // Supports Touch and Mouse
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        // Prevent scrolling when drawing on touch devices
        if (e.cancelable) e.preventDefault();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.strokeStyle = '#0f172a'; // slate-900 (ink color)
        ctx.lineWidth = 12; // Thick brush
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Save state to history for undo
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();

        // If we undo'd and then draw a new line, truncate the future history
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(dataUrl);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyStep > -1) {
            setHistoryStep(historyStep - 1);
        }
    };

    const handleClear = () => {
        setHistory([]);
        setHistoryStep(-1);
        drawGrid();
    };


    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar">
            <div className="animate-fadeIn pb-10">

                <header className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-3">
                        Práctica de <span className="text-rose-600">Trazos</span> (Hiragana & Katakana)
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl">
                        Utiliza la tabla de referencia a la izquierda y practica escribiendo los caracteres en el lienzo interactivo de la derecha. Intenta respetar las proporciones de la cuadrícula.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-8">

                    {/* Reference Image Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <BookOpenIcon />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Tabla de Referencia</h3>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 overflow-hidden border border-slate-200/60 flex-1 flex items-center justify-center min-h-[400px]">
                            {/* Embedded image based on user specifications */}
                            <img
                                src="/src/assets/japanese-abc.png"
                                alt="Alfabeto Japonés (Hiragana y Katakana)"
                                className="w-full h-auto object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
                            />
                        </div>
                    </div>

                    {/* Interactive Canvas Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-rose-200/30 border border-rose-100 p-6 flex flex-col h-full ring-2 ring-rose-50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Lienzo Mágico</h3>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUndo}
                                    disabled={historyStep <= -1}
                                    className={`p-2.5 rounded-xl border transition-all ${historyStep > -1 ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
                                    title="Deshacer trazo"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="p-2.5 rounded-xl border bg-white border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-sm transition-all flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    <span className="font-bold text-sm hidden sm:inline">Limpiar</span>
                                </button>
                            </div>
                        </div>

                        {/* Canvas Container */}
                        <div
                            ref={containerRef}
                            className="w-full relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner bg-slate-50 touch-none flex-1 flex flex-col justify-center"
                            style={{ minHeight: '400px' }}
                        >
                            <p className="absolute top-4 left-4 text-slate-400 font-medium text-sm pointer-events-none select-none z-10 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                                Área de dibujo
                            </p>

                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={endDrawing}
                                onMouseOut={endDrawing}

                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={endDrawing}
                                onTouchCancel={endDrawing}
                                className="cursor-crosshair w-full rounded-2xl shadow-sm"
                                style={{ display: 'block' }} // Important to avoid bottom margin gap
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
