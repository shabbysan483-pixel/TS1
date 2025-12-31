
import React, { useEffect } from 'react';
import { Lesson } from '../types';
import ContentCard from '../components/ContentCard';
import MathText from '../components/MathText';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  onNext?: () => void;
  onPrev?: () => void;
  onLaunchPractice?: (topic: string, count: number) => void;
  isExpanded?: boolean;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onNext, onPrev, onLaunchPractice, isExpanded = false }) => {
  
  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  return (
    <div className={`mx-auto pb-20 transition-all duration-300 ${isExpanded ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <div className="mb-8">
        <h1 className={`font-extrabold text-slate-900 mb-4 tracking-tight ${isExpanded ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
          {lesson.title}
        </h1>
        <p className={`text-slate-600 leading-relaxed ${isExpanded ? 'text-xl' : 'text-lg'}`}>
          {lesson.description}
        </p>
      </div>

      <div className="space-y-10">
        {lesson.sections.map((section, index) => (
          <div key={index} className="animate-fade-in">
            {/* Render section title with MathText to support LaTeX formulas */}
            <MathText 
              content={section.title} 
              Component="h2"
              className={`font-bold text-slate-800 mb-5 pb-2 border-b border-slate-200 ${isExpanded ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}
            />
            <div className={`space-y-6 ${isExpanded ? 'text-lg' : ''}`}>
              {section.blocks.map((block, bIndex) => (
                <ContentCard key={bIndex} block={block} onLaunchPractice={onLaunchPractice} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
        {onPrev ? (
          <button 
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Bài trước
          </button>
        ) : <div />}
        
        {onNext ? (
          <button 
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white bg-primary hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 font-medium"
          >
            Bài tiếp theo <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};

export default LessonView;
