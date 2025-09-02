import React, { useState, useCallback } from 'react';
import StudentForm from './components/StudentForm';
import GeneratedContentDisplay from './components/GeneratedContent';
import ElaborateLoading from './components/ElaborateLoading';
import { generateStoryAndWorkshop } from './services/geminiService';
import type { FormData, GeneratedContent } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentStudentName, setCurrentStudentName] = useState<string>('');

  const handleGenerate = useCallback(async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setCurrentStudentName(data.studentName);
    try {
      const content = await generateStoryAndWorkshop(data);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setGeneratedContent(null);
    setError(null);
    setIsLoading(false);
    setCurrentStudentName('');
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <ElaborateLoading studentName={currentStudentName} />
        </div>
      );
    }
    
    if (error) {
      return (
          <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">¡Oh no! Algo salió mal.</h2>
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</p>
              <button onClick={handleReset} className="bg-slate-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-800 transition">
                  Intentar de Nuevo
              </button>
          </div>
      );
    }

    if (generatedContent) {
      return <GeneratedContentDisplay content={generatedContent} studentName={currentStudentName} onReset={handleReset} />;
    }

    return <StudentForm onGenerate={handleGenerate} isLoading={isLoading} />;
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
