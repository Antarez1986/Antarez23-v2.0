import React, { useState, useEffect, useMemo } from 'react';

interface ElaborateLoadingProps {
  studentName: string;
}

const ElaborateLoading: React.FC<ElaborateLoadingProps> = ({ studentName }) => {
  const messages = useMemo(() => [
    "Buscando ideas en el cosmos de la creatividad...",
    "Dando vida a personajes fantásticos...",
    `Construyendo un mundo para ${studentName}...`,
    "Diseñando actividades divertidas y educativas...",
    "¡Casi listo! El taller está a punto de materializarse."
  ], [studentName]);

  const [messageIndex, setMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let charIndex = 0;
    
    let timeoutId: ReturnType<typeof setTimeout>;

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setTypedText((prev) => prev + currentMessage.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        timeoutId = setTimeout(() => {
          setTypedText('');
          setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000); // Pausa antes del siguiente mensaje
      }
    }, 50); // Velocidad de escritura

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timeoutId);
    };
  }, [messageIndex, messages]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-500 mb-6">
            {/* Portada del libro */}
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 19.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Páginas */}
            <g transform="translate(12, 3)">
                <path className="page-turn page-turn-3" d="M0 0V14L8 14V0L0 0Z" fill="#f8fafc" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path className="page-turn page-turn-2" d="M0 0V14L8 14V0L0 0Z" fill="#f1f5f9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path className="page-turn" d="M0 0V14L8 14V0L0 0Z" fill="#e2e8f0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
        </svg>

        <p className="text-xl font-semibold text-slate-700 min-h-[56px] w-full max-w-md">
            {typedText}
            <span className="blinking-cursor">|</span>
        </p>
        <p className="text-slate-500 mt-2">Creando una aventura de aprendizaje única...</p>
    </div>
  );
};

export default ElaborateLoading;
