import React, { useState } from 'react';
import type { GeneratedContent, ExtraActivity, VerdaderoFalsoItem, CompletarFraseItem, SopaDeLetrasContent, OrdenaFraseItem } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface GeneratedContentProps {
  content: GeneratedContent;
  studentName: string;
  onReset: () => void;
}

// Interactive Component for "Verdadero o Falso"
const VerdaderoFalsoActivity: React.FC<{ content: VerdaderoFalsoItem[] }> = ({ content }) => {
    const questions = content.map(item => item.statement);
    const answers = content.map(item => item.answer ? 'verdadero' : 'falso');
    
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswerChange = (index: number, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [index]: answer }));
    };

    if (!questions.length) return null;

    return (
        <div className="space-y-4">
            {questions.map((q, i) => (
                <div key={i} className={`p-4 rounded-lg border ${showResults ? (userAnswers[i] === answers[i] ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-slate-200 bg-slate-50'}`}>
                    <p className="font-medium text-slate-800 mb-3">{i + 1}. {q}</p>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name={`vf-q-${i}`} value="verdadero" onChange={() => handleAnswerChange(i, 'verdadero')} checked={userAnswers[i] === 'verdadero'} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"/>
                            <span>Verdadero</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name={`vf-q-${i}`} value="falso" onChange={() => handleAnswerChange(i, 'falso')} checked={userAnswers[i] === 'falso'} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"/>
                            <span>Falso</span>
                        </label>
                    </div>
                     {showResults && (
                        <p className={`mt-2 text-sm font-bold ${userAnswers[i] === answers[i] ? 'text-green-700' : 'text-red-700'}`}>
                            {userAnswers[i] === answers[i] ? '¡Correcto!' : `Incorrecto. La respuesta es: ${answers[i]}`}
                        </p>
                    )}
                </div>
            ))}
            <button onClick={() => setShowResults(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Revisar Respuestas
            </button>
        </div>
    );
};


// Interactive Component for "Completar la Frase"
const CompletarFraseActivity: React.FC<{ content: CompletarFraseItem[] }> = ({ content }) => {
    const items = content;
    const answers = content.map(item => item.answer);

    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswerChange = (index: number, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [index]: answer }));
    };

    if (!items.length) return null;

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border ${showResults ? (userAnswers[i] === answers[i] ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-800">{i + 1}. {item.phrase.split('_______________')[0]}</p>
                        <select
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            value={userAnswers[i] || ''}
                            className="px-3 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Selecciona</option>
                            {item.options.map((opt, j) => <option key={j} value={opt}>{opt}</option>)}
                        </select>
                        <p className="font-medium text-slate-800">{item.phrase.split('_______________')[1]}</p>
                    </div>
                     {showResults && (
                        <p className={`mt-2 text-sm font-bold ${userAnswers[i] === answers[i] ? 'text-green-700' : 'text-red-700'}`}>
                            {userAnswers[i] === answers[i] ? '¡Correcto!' : `Incorrecto. La respuesta es: ${answers[i]}`}
                        </p>
                    )}
                </div>
            ))}
            <button onClick={() => setShowResults(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Revisar Respuestas
            </button>
        </div>
    );
};

// Component for "Ordena la Frase"
const OrdenaFraseActivity: React.FC<{ content: OrdenaFraseItem[] }> = ({ content }) => {
    const [showResults, setShowResults] = useState(false);

    if (!content || content.length === 0) return null;

    return (
        <div className="space-y-4">
            {content.map((item, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="font-medium text-slate-800 mb-2">
                        {i + 1}. <span className="italic">{item.scrambledWords.join(' / ')}</span>
                    </p>
                    {showResults && (
                        <p className="mt-2 text-sm font-bold text-green-700">
                            Respuesta: {item.correctSentence}
                        </p>
                    )}
                </div>
            ))}
            {!showResults && (
                <button onClick={() => setShowResults(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    Mostrar Respuestas
                </button>
            )}
        </div>
    );
};


// Component for "Sopa de Letras"
const SopaDeLetrasActivity: React.FC<{ content: SopaDeLetrasContent }> = ({ content }) => {
    const { grid, words } = content;

    if (!grid || grid.length === 0 || !words || words.length === 0) {
        return <p>Contenido de la sopa de letras no es válido.</p>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="overflow-x-auto">
                <table className="border-collapse border-2 border-slate-300 bg-white">
                    <tbody>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`${rowIndex}-${cellIndex}`} className="w-7 h-7 sm:w-8 sm:h-8 border border-slate-200 text-center font-mono font-bold text-slate-700 align-middle">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h5 className="font-bold text-lg mb-2 text-slate-800">Palabras a encontrar:</h5>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {words.map((word, index) => (
                        <li key={index} className="text-slate-600 font-medium">{word}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

interface SectionCardProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  color?: 'blue' | 'teal' | 'purple' | 'amber' | 'rose' | 'indigo';
}

const SectionCard: React.FC<SectionCardProps> = ({ title, emoji, children, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-sky-500',
        teal: 'from-teal-500 to-emerald-500',
        purple: 'from-purple-500 to-violet-500',
        amber: 'from-amber-500 to-orange-500',
        rose: 'from-rose-500 to-pink-500',
        indigo: 'from-indigo-500 to-fuchsia-500',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${colorClasses[color]}`}></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 pt-4"><span className="mr-3 text-3xl">{emoji}</span>{title}</h3>
            <div className="space-y-4 text-slate-700">{children}</div>
        </div>
    );
};

type ActivityStyle = {
    emoji: string;
    color: 'blue' | 'teal' | 'purple' | 'amber' | 'rose' | 'indigo';
};

const activityStyles: Record<string, ActivityStyle> = {
    'sopa de letras': { emoji: '🔎', color: 'indigo' },
    'verdadero o falso': { emoji: '✅', color: 'teal' },
    'completar la frase': { emoji: '✏️', color: 'blue' },
    'ordena la frase': { emoji: '🔄', color: 'purple' },
    'default': { emoji: '🧩', color: 'amber' },
};

const getActivityStyle = (title: string): ActivityStyle => {
    const lowerCaseTitle = title.toLowerCase();
    for (const key in activityStyles) {
        if (key !== 'default' && lowerCaseTitle.includes(key)) {
            return activityStyles[key];
        }
    }
    return activityStyles.default;
};


const GeneratedContentDisplay: React.FC<GeneratedContentProps> = ({ content, studentName, onReset }) => {
    const [downloadingPdf, setDownloadingPdf] = useState<'student' | 'teacher' | null>(null);

    // Divide el texto por los placeholders de las viñetas y renderiza el texto e imágenes.
    const renderNarrativeWithVignettes = () => {
        const parts = content.narrative.text.split(/(\[VIGNETTE_\d+\])/g);
        let vignetteIndex = 0;
        
        return parts.map((part, index) => {
            if (part.match(/\[VIGNETTE_\d+\]/)) {
                if (vignetteIndex < content.narrative.vignetteImages.length) {
                    const imageUrl = `data:image/png;base64,${content.narrative.vignetteImages[vignetteIndex]}`;
                    vignetteIndex++;
                    return (
                        <div key={index} className="my-6 flex justify-center">
                            <img src={imageUrl} alt={`Viñeta de la historia ${vignetteIndex}`} className="rounded-lg border-4 border-white shadow-lg max-w-full md:max-w-md" />
                        </div>
                    );
                }
                return null;
            }
            return <MarkdownRenderer key={index} text={part} />;
        });
    };

    const renderExtraActivity = (activity: ExtraActivity) => {
        const title = activity.title.toLowerCase();

        // Prioritize rendering based on title and available data to prevent content mismatch
        if (title.includes('sopa de letras') && activity.sopaDeLetras) {
            return <SopaDeLetrasActivity content={activity.sopaDeLetras} />;
        }
        if (title.includes('verdadero o falso') && activity.verdaderoFalso) {
            return <VerdaderoFalsoActivity content={activity.verdaderoFalso} />;
        }
        if (title.includes('completar la frase') && activity.completarFrase) {
            return <CompletarFraseActivity content={activity.completarFrase} />;
        }
        if (title.includes('ordena la frase') && activity.ordenaFrase) {
            return <OrdenaFraseActivity content={activity.ordenaFrase} />;
        }
        
        // Fallback for generic content or if model doesn't match title with content field
        if (activity.content) {
            return <MarkdownRenderer text={activity.content} />;
        }
        if (activity.sopaDeLetras) { return <SopaDeLetrasActivity content={activity.sopaDeLetras} />; }
        if (activity.verdaderoFalso) { return <VerdaderoFalsoActivity content={activity.verdaderoFalso} />; }
        if (activity.completarFrase) { return <CompletarFraseActivity content={activity.completarFrase} />; }
        if (activity.ordenaFrase) { return <OrdenaFraseActivity content={activity.ordenaFrase} />; }
        
        return null;
    };
    
    const handleDownloadPDF = async (isForTeacher: boolean) => {
        setDownloadingPdf(isForTeacher ? 'teacher' : 'student');
        try {
            const { jsPDF } = (window as any).jspdf;
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

            // --- PDF STYLING CONSTANTS ---
            const MARGIN = 15;
            const PAGE_WIDTH = doc.internal.pageSize.getWidth();
            const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
            const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;
            
            const FONT_FAMILY = 'helvetica';
            const COLOR_PRIMARY = '#1e40af'; // blue-800
            const COLOR_SECONDARY = '#0d9488'; // teal-600
            const COLOR_TEXT = '#334155'; // slate-700
            const COLOR_MUTED = '#64748b'; // slate-500
            const COLOR_BORDER = '#cbd5e1'; // slate-300

            let y = MARGIN;

            // --- PDF HELPERS ---
            const addPageNumbers = () => {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.setFont(FONT_FAMILY, 'italic');
                doc.setTextColor(COLOR_MUTED);
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.text(`Página ${i} de ${pageCount}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
                }
            };

            const checkPageBreak = (heightNeeded: number) => {
                if (y + heightNeeded > PAGE_HEIGHT - MARGIN) {
                    doc.addPage();
                    y = MARGIN;
                }
            };
            
            const addText = (text: string, options: any = {}) => {
                const {
                    size = 12, font = 'normal', color = COLOR_TEXT, x = MARGIN,
                    align = 'left', spacing = 5, postSpacing = 2
                } = options;
                doc.setFontSize(size);
                doc.setFont(FONT_FAMILY, font);
                doc.setTextColor(color);
                const lines = doc.splitTextToSize(text, USABLE_WIDTH);
                const textHeight = lines.length * spacing;
                checkPageBreak(textHeight);
                doc.text(lines, x, y, { align });
                y += textHeight + postSpacing;
            };

            const stripMarkdown = (text: string) => {
                if (!text) return '';
                return text.replace(/\*\*|\*|_/g, '');
            };

            const stripAnswersFromMarkdown = (markdownContent: string): string => {
                return markdownContent.split('**Respuestas:**')[0].trim();
            };

            // --- PDF CONTENT GENERATION ---
            // 1. Title Page
            addText(content.narrative.title, { size: 24, font: 'bold', color: COLOR_PRIMARY, x: PAGE_WIDTH / 2, align: 'center', spacing: 10 });
            y += 5;
            addText(`Una aventura de aprendizaje para ${studentName}`, { size: 16, font: 'italic', color: COLOR_SECONDARY, x: PAGE_WIDTH / 2, align: 'center' });
            y += 15;

            // 2. Cover Image
            const coverImg = `data:image/png;base64,${content.narrative.coverImage}`;
            const coverImgProps = doc.getImageProperties(coverImg);
            const coverAspectRatio = coverImgProps.width / coverImgProps.height;
            const coverImgWidth = 120;
            const coverImgHeight = coverImgWidth / coverAspectRatio;
            checkPageBreak(coverImgHeight + 5);
            doc.addImage(coverImg, 'PNG', (PAGE_WIDTH - coverImgWidth) / 2, y, coverImgWidth, coverImgHeight);
            y += coverImgHeight + 10;

            // 3. Narrative with Vignettes
            const parts = content.narrative.text.split(/(\[VIGNETTE_\d+\])/g);
            let vignetteIndex = 0;
            for (const part of parts) {
                if (part.match(/\[VIGNETTE_\d+\]/)) {
                    if (vignetteIndex < content.narrative.vignetteImages.length) {
                        const vignetteImg = `data:image/png;base64,${content.narrative.vignetteImages[vignetteIndex]}`;
                        const vImgProps = doc.getImageProperties(vignetteImg);
                        const vAspectRatio = vImgProps.width / vImgProps.height;
                        const vImgWidth = 100;
                        const vImgHeight = vImgWidth / vAspectRatio;
                        checkPageBreak(vImgHeight + 5);
                        doc.addImage(vignetteImg, 'PNG', (PAGE_WIDTH - vImgWidth) / 2, y, vImgWidth, vImgHeight);
                        y += vImgHeight + 5;
                        vignetteIndex++;
                    }
                } else if (part.trim()) {
                    addText(stripMarkdown(part), { spacing: 6 });
                }
            }

            // 4. Workshop
            doc.addPage();
            y = MARGIN;
            addText('Taller de Comprensión', { size: 22, font: 'bold', color: COLOR_PRIMARY, x: PAGE_WIDTH / 2, align: 'center', postSpacing: 10 });

            const addSection = (title: string, contentFn: () => void) => {
                checkPageBreak(20); y += 5;
                doc.setFontSize(18); doc.setFont(FONT_FAMILY, 'bold'); doc.setTextColor(COLOR_SECONDARY);
                doc.text(title, MARGIN, y); y += 8;
                doc.setDrawColor(COLOR_BORDER); doc.line(MARGIN, y - 2, MARGIN + 60, y - 2);
                doc.setFontSize(12); doc.setFont(FONT_FAMILY, 'normal'); doc.setTextColor(COLOR_TEXT);
                contentFn(); y += 10;
            };
            
            // SABER Questions
            addSection('Preguntas tipo SABER', () => {
                content.workshop.saberQuestions.forEach((q, i) => {
                    checkPageBreak(25);
                    if (isForTeacher) {
                        addText(q.context, { font: 'italic', color: COLOR_MUTED, postSpacing: 4});
                    }
                    addText(`${i + 1}. ${q.question}`, {font: 'bold'});
                    q.options.forEach((opt, j) => {
                        const prefix = isForTeacher && opt === q.correctAnswer ? ' (Respuesta Correcta)' : '';
                        addText(`${String.fromCharCode(97 + j)}) ${opt}${prefix}`);
                    }); y += 5;
                });
            });

            // Matching Exercise, Open Questions, etc.
            if (content.workshop.matchingExercise) { /* ... similar logic ... */ }
            if (content.workshop.openQuestions && content.workshop.openQuestions.length > 0) { /* ... */ }
            if (content.workshop.creativeActivity) { /* ... */ }
            if (content.workshop.conceptMapFacts && content.workshop.conceptMapFacts.length > 0) { /* ... */ }

            // Extra Activities
            if (content.workshop.extraActivities && content.workshop.extraActivities.length > 0) {
                content.workshop.extraActivities.forEach(activity => {
                    addSection(activity.title, () => {
                        addText(activity.description, { size: 11, font: 'italic', color: COLOR_MUTED });
                        y += 3;

                        if (activity.sopaDeLetras) {
                            const { grid, words, solution } = activity.sopaDeLetras;
                            if (grid && grid.length > 0 && grid[0].length > 0) {
                                const numCols = grid[0].length;
                                const cellSize = Math.min(USABLE_WIDTH / numCols, 8); // Prevent cells from being too large
                                const tableHeight = grid.length * cellSize;
                                checkPageBreak(tableHeight + 20);
                                const startX = MARGIN, startY = y;

                                // --- Teacher's PDF Solution Highlighting ---
                                if (isForTeacher && solution) {
                                    const highlightColors = [
                                        [255, 228, 196], [173, 216, 230], [144, 238, 144], [255, 255, 224], 
                                        [221, 160, 221], [240, 230, 140], [250, 128, 114], [152, 251, 152], 
                                        [255, 182, 193], [175, 238, 238]
                                    ];
                                    solution.forEach((sol, colorIndex) => {
                                        const color = highlightColors[colorIndex % highlightColors.length];
                                        doc.setFillColor(color[0], color[1], color[2]);
                                        
                                        const dRow = Math.sign(sol.endRow - sol.startRow);
                                        const dCol = Math.sign(sol.endCol - sol.startCol);
                                        const wordLength = Math.max(Math.abs(sol.endRow - sol.startRow), Math.abs(sol.endCol - sol.startCol)) + 1;
                                        
                                        let currRow = sol.startRow;
                                        let currCol = sol.startCol;

                                        for (let i = 0; i < wordLength; i++) {
                                            if (currRow >= 0 && currRow < grid.length && currCol >= 0 && currCol < numCols) {
                                                const cellX = startX + currCol * cellSize;
                                                const cellY = startY + currRow * cellSize;
                                                doc.rect(cellX, cellY, cellSize, cellSize, 'F');
                                            }
                                            currRow += dRow;
                                            currCol += dCol;
                                        }
                                    });
                                }

                                // --- Draw Grid and Letters (for both student and teacher) ---
                                doc.setFontSize(cellSize * 0.7); // Adjust font size based on cell size
                                doc.setFont(FONT_FAMILY, 'normal');
                                doc.setTextColor(COLOR_TEXT);
                                grid.forEach((row, rIdx) => {
                                    row.forEach((cell, cIdx) => {
                                        const cellX = startX + cIdx * cellSize;
                                        const cellY = startY + rIdx * cellSize;
                                        doc.setDrawColor(COLOR_BORDER);
                                        doc.rect(cellX, cellY, cellSize, cellSize); // Cell border
                                        doc.text(cell, cellX + cellSize / 2, cellY + cellSize / 2, { align: 'center', baseline: 'middle' });
                                    });
                                });

                                y += tableHeight + 5;
                                addText("Palabras a encontrar:", { size: 12, font: 'bold' });
                                addText(words.join(', '), { size: 11 });
                            }
                        } else if (activity.verdaderoFalso) {
                            activity.verdaderoFalso.forEach((item, index) => {
                                const answerText = isForTeacher ? ` (Respuesta: ${item.answer ? 'Verdadero' : 'Falso'})` : '';
                                addText(`${index + 1}. ${stripMarkdown(item.statement)} [  ] Verdadero [  ] Falso${answerText}`);
                            });
                        } else if (activity.completarFrase) {
                            activity.completarFrase.forEach((item, index) => {
                                addText(`${index + 1}. ${stripMarkdown(item.phrase)}`);
                                addText(`Opciones: ${item.options.join(', ')}`);
                                if (isForTeacher) {
                                    addText(`Respuesta: ${item.answer}`, { font: 'bold' });
                                }
                                y += 2;
                            });
                        } else if (activity.ordenaFrase) {
                            activity.ordenaFrase.forEach((item, index) => {
                                addText(`${index + 1}. ${item.scrambledWords.join(' / ')}`);
                                if (isForTeacher) {
                                    addText(`Respuesta: ${item.correctSentence}`, { font: 'bold' });
                                }
                                 y += 2;
                            });
                        } else if (activity.content) {
                            const contentToRender = isForTeacher ? activity.content : stripAnswersFromMarkdown(activity.content);
                            addText(stripMarkdown(contentToRender));
                        }
                        y += 5;
                    });
                });
            }

            // Add page numbers and save
            addPageNumbers();
            const fileName = `${content.narrative.title.replace(/ /g, '_')}_Taller_${isForTeacher ? 'Maestro' : 'Estudiante'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un problema al generar el PDF. Revisa la consola para más detalles.");
        } finally {
            setDownloadingPdf(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{content.narrative.title}</h1>
                <p className="mt-2 text-lg text-slate-600">Una aventura de aprendizaje para {studentName}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">¡Portada para Colorear!</h3>
                <img src={`data:image/png;base64,${content.narrative.coverImage}`} alt="Portada para colorear" className="rounded-lg mx-auto border" />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-lg">
                {renderNarrativeWithVignettes()}
            </div>
            
            <h2 className="text-3xl font-bold text-center text-slate-800 pt-8">Taller de Comprensión</h2>
            <div className="space-y-6">
                <SectionCard title="Preguntas tipo SABER" emoji="🧠" color="blue">
                    <p className="text-slate-600 mb-4">Lee atentamente cada contexto y pregunta, luego selecciona la única respuesta correcta entre las opciones.</p>
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

                {content.workshop.matchingExercise && (
                    <SectionCard title="Ejercicio de Unir Columnas" emoji="🔗" color="teal">
                        <p>Relaciona los conceptos de la Columna A con las descripciones de la Columna B. ¡Cuidado, hay un distractor en la Columna B!</p>
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
                )}
                
                {content.workshop.openQuestions && content.workshop.openQuestions.length > 0 && (
                    <SectionCard title="Preguntas Abiertas" emoji="✍️" color="purple">
                        <p className="text-slate-600 mb-4">Estas preguntas están diseñadas para que reflexiones sobre la historia y sus temas. No hay una única respuesta correcta.</p>
                        {content.workshop.openQuestions.map((q, i) => (
                            <p key={i} className="font-semibold pt-2 border-t first:border-t-0">{i + 1}. {q}</p>
                        ))}
                    </SectionCard>
                )}

                {content.workshop.creativeActivity && (
                    <SectionCard title="Actividad Creativa" emoji="🎨" color="rose">
                        <h4 className="font-bold text-lg">{content.workshop.creativeActivity.title}</h4>
                        <p>{content.workshop.creativeActivity.description}</p>
                    </SectionCard>
                )}

                {content.workshop.conceptMapFacts && content.workshop.conceptMapFacts.length > 0 && (
                    <SectionCard title="Mapa Conceptual o Línea de Tiempo" emoji="🗺️" color="amber">
                        <p>Usa los siguientes 5 hechos clave de la historia para crear un mapa conceptual o una línea de tiempo. ¡Puedes organizarlos como prefieras!</p>
                        <ul className="list-disc list-inside bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            {content.workshop.conceptMapFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                        </ul>
                    </SectionCard>
                )}

                {content.workshop.extraActivities && content.workshop.extraActivities.map((activity, i) => {
                    const style = getActivityStyle(activity.title);
                    return (
                        <SectionCard key={i} title={activity.title} emoji={style.emoji} color={style.color}>
                            <p className="italic text-slate-600 mb-3">{activity.description}</p>
                            {renderExtraActivity(activity)}
                        </SectionCard>
                    );
                })}
            </div>
            
            <div className="text-center py-8 flex flex-wrap justify-center items-center gap-4">
                <button
                    onClick={() => handleDownloadPDF(false)}
                    disabled={downloadingPdf !== null}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    aria-live="polite"
                >
                    {downloadingPdf === 'student' ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Generando...</span>
                        </>
                    ) : (
                        <span>Descargar para Estudiante (PDF)</span>
                    )}
                </button>
                <button
                    onClick={() => handleDownloadPDF(true)}
                    disabled={downloadingPdf !== null}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    aria-live="polite"
                >
                    {downloadingPdf === 'teacher' ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Generando...</span>
                        </>
                    ) : (
                        <span>Descargar para Maestro (PDF)</span>
                    )}
                </button>
                <button onClick={onReset} className="bg-slate-700 text-white font-bold py-3 px-12 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all">
                    Crear Otro Taller
                </button>
            </div>
        </div>
    );
};

export default GeneratedContentDisplay;
