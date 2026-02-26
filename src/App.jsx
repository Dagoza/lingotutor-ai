import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatTab from './components/ChatTab';
import GuidesTab from './components/GuidesTab';
import FlashcardsTab from './components/FlashcardsTab';
import JapaneseCanvasTab from './components/JapaneseCanvasTab';
import { DIDACTIC_GUIDES } from './data/guides';
import vocabularyData from './data/vocabulary.json';

export default function App() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('A1');
  const [activeTab, setActiveTab] = useState('chat');
  const [initialMessageToSend, setInitialMessageToSend] = useState(null);

  const requestAIExercise = (messageInput) => {
    setInitialMessageToSend(messageInput);
    setActiveTab('chat');
  };

  // Ensure active tab drops 'drawing' if language changes to English
  useEffect(() => {
    if (language !== 'Japanese' && activeTab === 'drawing') {
      setActiveTab('guides');
    }
  }, [language, activeTab]);

  const currentGuides = DIDACTIC_GUIDES[language]?.[level] || [];
  const currentVocab = vocabularyData[language]?.[level] || [];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col md:flex-row bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      <Sidebar
        language={language}
        setLanguage={setLanguage}
        level={level}
        setLevel={setLevel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col h-[calc(100vh-auto)] md:h-screen overflow-hidden relative">
        {activeTab === 'chat' && (
          <ChatTab
            language={language}
            level={level}
            apiKey={apiKey}
            initialMessageToSend={initialMessageToSend}
            onClearInitialMessage={() => setInitialMessageToSend(null)}
          />
        )}

        {activeTab === 'guides' && (
          <GuidesTab
            currentGuides={currentGuides}
            level={level}
            requestAIExercise={requestAIExercise}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsTab
            currentVocab={currentVocab}
            language={language}
            level={level}
            requestAIExercise={requestAIExercise}
          />
        )}

        {activeTab === 'drawing' && language === 'Japanese' && (
          <JapaneseCanvasTab />
        )}
      </main>
    </div>
  );
}
