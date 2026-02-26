import React, { useState, useEffect, useRef } from 'react';
import { SendIcon } from './icons';

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

export default function ChatTab({
    language,
    level,
    apiKey,
    initialMessageToSend,
    onClearInitialMessage
}) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        const greeting = language === 'English'
            ? `Hello there! 🌟 Soy tu Tutor Personal de Inglés. Veo que estamos trabajando en el nivel **${level}**. ¿De qué te gustaría hablar hoy o qué dudas tienes? ¡Estoy aquí para ayudarte a brillar! ✨`
            : `こんにちは (Konnichiwa)! 🌟 Soy tu Tutor Personal de Japonés. Veo que estás en el nivel **${level}**. ¿Qué te gustaría practicar hoy? ¡No tengas miedo a equivocarte, aprenderemos juntos! 🎌`;

        setMessages([{ role: 'model', text: greeting }]);
        setError(null);
    }, [language, level]);

    const initialProcessed = useRef(false);

    useEffect(() => {
        if (initialMessageToSend && !initialProcessed.current) {
            initialProcessed.current = true;
            sendMessage(initialMessageToSend);
            onClearInitialMessage();
        }
    }, [initialMessageToSend]);

    // Reset ref when initialMessageToSend is cleared parent-side
    useEffect(() => {
        if (!initialMessageToSend) {
            initialProcessed.current = false;
        }
    }, [initialMessageToSend]);

    const getSystemPrompt = () => `
    Tu Tutor Personal de ${language} (Nivel actual del estudiante: ${level})
    
    1. Identidad y Misión: Eres un Tutor de ${language} de élite, experto en la enseñanza.
    2. Personalidad y Tono: Amigable, motivador y usas emojis moderadamente.
    3. Evaluación y Progreso: Evalúa sutilmente el nivel.
    4. Reglas de Feedback y Corrección (EL MÉTODO SÁNDWICH):
      - Corrección Proactiva: Si hay un error, corrígelo constructivamente.
      - 1. Reconoce lo que se entendió bien.
      - 2. Muestra la corrección (usa **negritas** para resaltar los cambios).
      - 3. Explica brevemente el "porqué" en español.
      - Contexto Real: Ofrece una alternativa de cómo lo diría un nativo (Natural Sounding).
    5. Estructura de Respuesta Sugerida:
      - Respuesta natural en ${language}.
      - Sección de "Friendly Corrections 🛠️" o "Mejoras sugeridas" (Solo si hubo errores).
      - Explicación en Español.
      - Cierre Motivador.
    6. Restricciones: Sé natural.
  `;

    const fetchWithRetry = async (url, options, retries = 3) => {
        const delays = [1000, 2000, 4000];
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                return await response.json();
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(res => setTimeout(res, delays[i]));
            }
        }
    };

    const sendMessage = async (textToSend) => {
        const text = typeof textToSend === 'string' ? textToSend : inputValue;
        if (!text.trim() || isLoading) return;

        if (!apiKey) {
            setError("Falta la API Key. Por favor, configúrala en el archivo .env.");
            return;
        }

        const newMessages = [...messages, { role: 'user', text }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const contents = newMessages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
        const payload = { contents, systemInstruction: { parts: [{ text: getSystemPrompt() }] } };

        try {
            const data = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (botReply) {
                setMessages(prev => [...prev, { role: 'model', text: botReply }]);
            } else {
                throw new Error("Respuesta inválida de la API.");
            }
        } catch (err) {
            console.error(err);
            setError("Ups, hubo un problema al contactar con el Tutor.");
            setMessages(prev => prev.slice(0, -1));
            setInputValue(text);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-6 md:px-8">
            <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-3 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`} style={{ animationDelay: '50ms' }}>
                        <div className={`max-w-[90%] md:max-w-[75%] rounded-3xl p-5 shadow-sm transform transition-all ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200/60 text-slate-700 font-medium rounded-bl-sm shadow-slate-200/40'
                            }`}>
                            {msg.role === 'model' && (
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center text-[15px] shadow-sm ring-1 ring-inset ring-indigo-200/50">🤖</div>
                                    <span className="font-bold text-[13px] tracking-wide uppercase text-slate-800">Tutor de {language}</span>
                                </div>
                            )}
                            <div className={`text-[15px] md:text-base ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                                <FormattedText text={msg.text} />
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="bg-white border border-slate-200/60 rounded-3xl rounded-bl-sm p-5 shadow-sm flex items-center gap-4">
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                            <span className="text-[13px] uppercase tracking-wide text-slate-400 font-bold">Generando respuesta...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-semibold tracking-wide border border-red-200 shadow-sm animate-fadeIn">
                        ⚠️ {error}
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="pt-4 mt-2 mb-2 relative">
                <div className="absolute -top-12 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                <div className="relative flex items-center bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] focus-within:shadow-[0_8px_30px_-4px_rgba(99,102,241,0.15)] focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={`Escribe aquí tu mensaje en ${language} o Español...`}
                        className="w-full bg-transparent py-4 pl-6 pr-16 focus:outline-none resize-none text-slate-700 font-medium placeholder-slate-400"
                        rows="1"
                        style={{ minHeight: '60px', maxHeight: '140px' }}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2.5 top-2.5 bottom-2.5 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-sm"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}
