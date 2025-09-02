
import React from 'react';
import type { GeneratedContent, ExtraActivity } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface GeneratedContentProps {
  content: GeneratedContent;
  studentName: string;
  onReset: () => void;
}

const SectionCard: React.FC<{ title: string; emoji: string; children: React.ReactNode }> = ({ title, emoji, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-4"><span className="mr-3">{emoji}</span>{title}</h3>
        <div className="space-y-4 text-slate-700">{children}</div>
    </div>
);


const GeneratedContentDisplay: React.FC<GeneratedContentProps> = ({ content, studentName, onReset }) => {
    
    // Divide el texto por los placeholders de las viñetas y renderiza el texto e imágenes.
    const renderNarrativeWithVignettes = () => {
        const parts = content.narrative.text.split(/(\[VIGNETTE_\d+\])/g);
        let vignetteIndex = 0;
        
        return parts.map((part, index) => {
            if (part.match(/\[VIGNETTE_\d+\]/)) {
                const imageUrl = `data:image/png;base64,${content.narrative.vignetteImages[vignetteIndex]}`;
                vignetteIndex++;
                return (
                    <div key={index} className="my-6 flex justify-center">
                        <img src={imageUrl} alt={`Viñeta de la historia ${vignetteIndex}`} className="rounded-lg border-4 border-white shadow-lg max-w-full md:max-w-md" />
                    </div>
                );
            }
            return <MarkdownRenderer key={index} text={part} />;
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{content.narrative.title}</h1>
                <p className="mt-2 text-lg text-slate-600">Una aventura de aprendizaje para {studentName}</p>
            </div>

            {/* Portada para colorear */}
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">¡Portada para Colorear!</h3>
                <img src={`data:image/png;base64,${content.narrative.coverImage}`} alt="Portada para colorear" className="rounded-lg mx-auto border" />
            </div>

            {/* Narrativa con viñetas */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-lg">
                {renderNarrativeWithVignettes()}
            </div>
            
            <h2 className="text-3xl font-bold text-center text-slate-800 pt-8">Taller de Comprensión</h2>
            <div className="space-y-6">
                <SectionCard title="Preguntas tipo SABER" emoji="1️⃣">
                    {content.workshop.saberQuestions.map((q, i) => (
                        <div key={i} className="border-t border-slate-200 pt-4 first:border-t-0">
                            <p className="italic text-slate-600 mb-2">{q.context}</p>
                            <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
                            <ul className="space-y-1 list-disc list-inside">
                                {q.options.map((opt, j) => (
                                    <li key={j} className={opt === q.correctAnswer ? 'font-bold text-blue-700' : ''}>
                                        {String.fromCharCode(97 + j)}) {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </SectionCard>

                <SectionCard title="Ejercicio de Unir Columnas" emoji="2️⃣">
                    <p>Relaciona los conceptos de la Columna A con las descripciones de la Columna B.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Columna A</h4>
                            <ul className="space-y-2">
                                {content.workshop.matchingExercise.columnA.map((item, i) => (
                                    <li key={i} className="bg-slate-100 p-3 rounded-md">{i + 1}. {item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Columna B</h4>
                             <ul className="space-y-2">
                                {content.workshop.matchingExercise.columnB.map((item, i) => (
                                    <li key={i} className="bg-slate-100 p-3 rounded-md">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </SectionCard>
                
                <SectionCard title="Preguntas Abiertas" emoji="3️⃣">
                    {content.workshop.openQuestions.map((q, i) => (
                        <p key={i} className="font-semibold">{i + 1}. {q}</p>
                    ))}
                </SectionCard>

                <SectionCard title="Actividad Creativa" emoji="4️⃣">
                    <h4 className="font-bold text-lg">{content.workshop.creativeActivity.title}</h4>
                    <p>{content.workshop.creativeActivity.description}</p>
                </SectionCard>

                <SectionCard title="Mapa Conceptual o Línea de Tiempo" emoji="5️⃣">
                    <p>Usa los siguientes 5 hechos clave de la historia para crear un mapa conceptual o una línea de tiempo. ¡Puedes organizarlos como prefieras!</p>
                    <ul className="list-disc list-inside bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        {content.workshop.conceptMapFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                    </ul>
                </SectionCard>

                {content.workshop.extraActivities && content.workshop.extraActivities.length > 0 && (
                    <SectionCard title="Actividades Extras" emoji="🧩">
                        {content.workshop.extraActivities.map((activity, i) => (
                            <div key={i} className="border-t border-slate-200 pt-4 first:border-t-0">
                                <h4 className="font-bold text-lg">{activity.title}</h4>
                                <MarkdownRenderer text={activity.content} />
                            </div>
                        ))}
                    </SectionCard>
                )}
            </div>
            
            <div className="text-center py-8">
                <button onClick={onReset} className="bg-slate-700 text-white font-bold py-3 px-12 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all">
                    Crear para Otro Estudiante
                </button>
            </div>
        </div>
    );
};

export default GeneratedContentDisplay;
