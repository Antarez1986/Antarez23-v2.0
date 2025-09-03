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
      desempenos: '',
      textType: TEXT_TYPES[0],
      difficulty: Difficulty.Medio,
      additionalDetails: '',
      preferences: [],
      characterCount: 1500,
      saberQuestionCount: 5,
      openQuestionCount: 3,
      extraActivities: [],
      sopaDeLetrasWordCount: 10,
      sopaDeLetrasRows: 15,
      sopaDeLetrasCols: 15,
    };
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'El nombre del estudiante es obligatorio.';
    }
    if (!formData.topic.trim()) {
      newErrors.topic = 'El tema escolar es obligatorio.';
    }
    if (formData.characterCount < 500 || formData.characterCount > 3000) {
      newErrors.characterCount = 'El número de caracteres debe estar entre 500 y 3000.';
    }
    if (formData.saberQuestionCount < 3 || formData.saberQuestionCount > 10) {
      newErrors.saberQuestionCount = 'El número de preguntas SABER debe estar entre 3 y 10.';
    }
    if (formData.extraActivities.includes('Preguntas Abiertas') && (formData.openQuestionCount < 1 || formData.openQuestionCount > 10)) {
        newErrors.openQuestionCount = 'El número de preguntas abiertas debe estar entre 1 y 10.';
    }
    if (formData.extraActivities.includes('Sopa de Letras')) {
        if (formData.sopaDeLetrasWordCount < 5 || formData.sopaDeLetrasWordCount > 15) {
            newErrors.sopaDeLetrasWordCount = 'Debe ser entre 5 y 15 palabras.';
        }
        if (formData.sopaDeLetrasRows < 10 || formData.sopaDeLetrasRows > 25) {
            newErrors.sopaDeLetrasRows = 'Debe ser entre 10 y 25 filas.';
        }
        if (formData.sopaDeLetrasCols < 10 || formData.sopaDeLetrasCols > 25) {
            newErrors.sopaDeLetrasCols = 'Debe ser entre 10 y 25 columnas.';
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(formData);
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
            <input type="text" name="studentName" id="studentName" value={formData.studentName} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.studentName ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">Grado escolar</label>
            <select name="grade" id="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              {SCHOOL_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Tema escolar</label>
            <input type="text" name="topic" id="topic" value={formData.topic} onChange={handleInputChange} placeholder="Ej: El Sistema Solar" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.topic ? 'border-red-500' : 'border-slate-300'}`} />
            {errors.topic && <p className="mt-1 text-sm text-red-600">{errors.topic}</p>}
          </div>
          <div>
            <label htmlFor="textType" className="block text-sm font-medium text-slate-700 mb-1">Tipo de texto a generar</label>
            <select name="textType" id="textType" value={formData.textType} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              {TEXT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        
        {/* Fila 2: Desempeños */}
         <div className="border-t pt-6">
            <label htmlFor="desempenos" className="block text-sm font-medium text-slate-700 mb-1">Desempeños a Evaluar (Opcional)</label>
            <textarea name="desempenos" id="desempenos" value={formData.desempenos} onChange={handleInputChange} rows={3} placeholder="Ej: Identifica las partes de una célula, explica el proceso de la fotosíntesis..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
         </div>


        {/* Fila 3: Configuración de Contenido */}
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
                <label htmlFor="saberQuestionCount" className="block text-sm font-medium text-slate-700 mb-1">Nº de Preguntas SABER (Fijo)</label>
                <input type="number" name="saberQuestionCount" id="saberQuestionCount" min="3" max="10" value={formData.saberQuestionCount} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.saberQuestionCount ? 'border-red-500' : 'border-slate-300'}`} />
                {errors.saberQuestionCount && <p className="mt-1 text-sm text-red-600">{errors.saberQuestionCount}</p>}
            </div>
             <div className="md:col-span-2">
                <label htmlFor="characterCount" className="block text-sm font-medium text-slate-700 mb-1">Número de caracteres (~{formData.characterCount})</label>
                <input type="range" name="characterCount" id="characterCount" min="500" max="3000" step="100" value={formData.characterCount} onChange={handleInputChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                {errors.characterCount && <p className="mt-1 text-sm text-red-600">{errors.characterCount}</p>}
            </div>
        </div>

        {/* Fila 4: Personalización */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label htmlFor="additionalDetails" className="block text-sm font-medium text-slate-700 mb-1">Detalles adicionales del estudiante</label>
              <textarea name="additionalDetails" id="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} rows={5} placeholder="Ej: Le gusta la tecnología" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferencias personales</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {PREFERENCES.map(p => (
                  <label key={p} className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg border transition-all duration-200 ${
                    formData.preferences.includes(p)
                      ? 'bg-blue-100 border-blue-400 font-medium text-blue-800'
                      : 'bg-slate-100 border-transparent hover:bg-slate-200 text-slate-700'
                  }`}>
                    <input type="checkbox" value={p} checked={formData.preferences.includes(p)} onChange={(e) => handleCheckboxChange(e, 'preferences')} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="text-sm">{p}</span>
                  </label>
                ))}
              </div>
            </div>
        </div>

        {/* Fila 5: Actividades Extras */}
        <div className="border-t pt-6">
            <label className="block text-lg font-medium text-slate-800 mb-3">Actividades del Taller (Opcional)</label>
             <p className="text-sm text-slate-500 mb-4">Selecciona las actividades que deseas incluir. Las preguntas tipo SABER siempre se generan.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EXTRA_ACTIVITIES.map(activity => (
                    <div key={activity}>
                        <label className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-200 h-full ${
                            formData.extraActivities.includes(activity)
                                ? 'bg-teal-100 border-teal-400 text-teal-900'
                                : 'bg-slate-100 border-transparent hover:bg-slate-200 text-slate-700'
                        }`}>
                            <input 
                                type="checkbox" 
                                value={activity} 
                                checked={formData.extraActivities.includes(activity)} 
                                onChange={(e) => handleCheckboxChange(e, 'extraActivities')} 
                                className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500" 
                            />
                            <span className="text-sm font-medium">{activity}</span>
                        </label>
                        {activity === 'Preguntas Abiertas' && formData.extraActivities.includes('Preguntas Abiertas') && (
                            <div className="mt-2 ml-2">
                                <label htmlFor="openQuestionCount" className="block text-xs font-medium text-slate-600 mb-1">Nº de Preguntas</label>
                                <input 
                                    type="number" 
                                    name="openQuestionCount" 
                                    id="openQuestionCount" 
                                    min="1" 
                                    max="10" 
                                    value={formData.openQuestionCount} 
                                    onChange={handleInputChange} 
                                    className={`w-20 px-2 py-1 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${errors.openQuestionCount ? 'border-red-500' : 'border-slate-300'}`}
                                />
                                {errors.openQuestionCount && <p className="mt-1 text-xs text-red-600">{errors.openQuestionCount}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        
        {/* Nueva sección para Sopa de Letras */}
        <div className="border-t pt-6">
            <label className="block text-lg font-medium text-slate-800 mb-3">Actividad Especial: Sopa de Letras</label>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="Sopa de Letras" 
                        checked={formData.extraActivities.includes('Sopa de Letras')} 
                        onChange={(e) => handleCheckboxChange(e, 'extraActivities')} 
                        className="h-5 w-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500" 
                    />
                    <span className="font-medium text-slate-700">Incluir Sopa de Letras en el taller</span>
                </label>

                {formData.extraActivities.includes('Sopa de Letras') && (
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="sopaDeLetrasWordCount" className="block text-sm font-medium text-slate-600 mb-1">Nº de Palabras (5-15)</label>
                            <input type="number" name="sopaDeLetrasWordCount" id="sopaDeLetrasWordCount" min="5" max="15" value={formData.sopaDeLetrasWordCount} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.sopaDeLetrasWordCount ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.sopaDeLetrasWordCount && <p className="mt-1 text-xs text-red-600">{errors.sopaDeLetrasWordCount}</p>}
                        </div>
                        <div>
                            <label htmlFor="sopaDeLetrasRows" className="block text-sm font-medium text-slate-600 mb-1">Nº de Filas (10-25)</label>
                            <input type="number" name="sopaDeLetrasRows" id="sopaDeLetrasRows" min="10" max="25" value={formData.sopaDeLetrasRows} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.sopaDeLetrasRows ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.sopaDeLetrasRows && <p className="mt-1 text-xs text-red-600">{errors.sopaDeLetrasRows}</p>}
                        </div>
                        <div>
                            <label htmlFor="sopaDeLetrasCols" className="block text-sm font-medium text-slate-600 mb-1">Nº de Columnas (10-25)</label>
                            <input type="number" name="sopaDeLetrasCols" id="sopaDeLetrasCols" min="10" max="25" value={formData.sopaDeLetrasCols} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.sopaDeLetrasCols ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.sopaDeLetrasCols && <p className="mt-1 text-xs text-red-600">{errors.sopaDeLetrasCols}</p>}
                        </div>
                    </div>
                )}
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