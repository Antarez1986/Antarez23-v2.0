
import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';
import { Difficulty } from '../types';
import { SCHOOL_GRADES, TEXT_TYPES, PREFERENCES, DIFFICULTIES, EXTRA_ACTIVITIES } from '../constants';

interface StudentFormProps {
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
}

const LOCAL_STORAGE_KEY = 'creativeWorkshopFormData';

const StudentForm: React.FC<StudentFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error al leer los datos del formulario desde localStorage", error);
    }
    return {
      studentName: '',
      grade: SCHOOL_GRADES[0],
      topic: '',
      textType: TEXT_TYPES[0],
      difficulty: Difficulty.Medio,
      additionalDetails: '',
      preferences: [],
      characterCount: 1500,
      saberQuestionCount: 5,
      extraActivities: [],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error al guardar los datos del formulario en localStorage", error);
    }
  }, [formData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';
    setFormData(prev => ({ ...prev, [name]: isNumberInput ? Number(value) : value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'preferences' | 'extraActivities') => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(p => p !== value);
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentName.trim() && formData.topic.trim()) {
      onGenerate(formData);
    } else {
      alert("Por favor, completa el nombre del estudiante y el tema escolar.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Generador de Talleres Creativos</h1>
      <p className="text-slate-600 mb-8">Completa los datos para crear una experiencia de aprendizaje única y personalizada.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fila 1: Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-1">Nombre del estudiante</label>
            <input type="text" name="studentName" id="studentName" value={formData.studentName} onChange={handleInputChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">Grado escolar</label>
            <select name="grade" id="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              {SCHOOL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Tema escolar</label>
            <input type="text" name="topic" id="topic" value={formData.topic} onChange={handleInputChange} required placeholder="Ej: El Sistema Solar" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div>
            <label htmlFor="textType" className="block text-sm font-medium text-slate-700 mb-1">Tipo de texto a generar</label>
            <select name="textType" id="textType" value={formData.textType} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              {TEXT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        
        {/* Fila 2: Configuración de Contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nivel de dificultad</label>
              <div className="flex items-center space-x-4">
                {DIFFICULTIES.map(d => (
                  <label key={d} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="difficulty" value={d} checked={formData.difficulty === d} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                    <span className="text-slate-700">{d}</span>
                  </label>
                ))}
              </div>
            </div>
             <div>
                <label htmlFor="saberQuestionCount" className="block text-sm font-medium text-slate-700 mb-1">Nº de Preguntas SABER</label>
                <input type="number" name="saberQuestionCount" id="saberQuestionCount" min="3" max="10" value={formData.saberQuestionCount} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="characterCount" className="block text-sm font-medium text-slate-700 mb-1">Número de caracteres (~{formData.characterCount})</label>
                <input type="range" name="characterCount" id="characterCount" min="500" max="3000" step="100" value={formData.characterCount} onChange={handleInputChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>

        {/* Fila 3: Personalización */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label htmlFor="additionalDetails" className="block text-sm font-medium text-slate-700 mb-1">Detalles adicionales del estudiante</label>
              <textarea name="additionalDetails" id="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} rows={5} placeholder="Ej: Le gusta la tecnología" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferencias personales</label>
              <div className="grid grid-cols-2 gap-2">
                {PREFERENCES.map(p => (
                  <label key={p} className="flex items-center space-x-2 cursor-pointer bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">
                    <input type="checkbox" value={p} checked={formData.preferences.includes(p)} onChange={(e) => handleCheckboxChange(e, 'preferences')} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-slate-700 text-sm">{p}</span>
                  </label>
                ))}
              </div>
            </div>
        </div>

        {/* Fila 4: Actividades Extras */}
        <div className="border-t pt-6">
            <label className="block text-lg font-medium text-slate-800 mb-3">Actividades Extras (Opcional)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EXTRA_ACTIVITIES.map(activity => (
                    <label key={activity} className="flex items-center space-x-2 cursor-pointer bg-slate-100 p-3 rounded-lg hover:bg-slate-200 transition">
                        <input type="checkbox" value={activity} checked={formData.extraActivities.includes(activity)} onChange={(e) => handleCheckboxChange(e, 'extraActivities')} className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500" />
                        <span className="text-slate-700 text-sm font-medium">{activity}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="pt-4 text-center">
          <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105">
            {isLoading ? 'Generando...' : 'Generar Taller'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
