
import React, { useState } from 'react';
import { ContentBlock } from '../types';
import MathText from './MathText';
import { Info, CheckCircle, Book, PenTool, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  CubicGraphSummary, 
  RationalLinearGraphSummary, 
  RationalQuadraticGraphSummary,
  OxyzAxesVisual,
  VectorCrossProductVisual,
  VectorOperationsVisual,
  BarycentricVisual,
  SequenceComparisonVisual,
  LogarithmSheet,
  DerivativeSheet,
  IntegralSheet,
  IntegralApplicationVisual,
  LimitSheet,
  StatisticsUngroupedSheet,
  StatisticsGroupedSheet,
  CombinatoricsSheet
} from './Visuals';

interface ContentCardProps {
  block: ContentBlock;
  onLaunchPractice?: (topic: string, count: number) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ block, onLaunchPractice }) => {
  const [showProof, setShowProof] = useState(false);

  const getStyle = () => {
    switch (block.type) {
      case 'definition':
        return {
          wrapper: 'bg-blue-50/50 border-blue-100',
          title: 'text-blue-700',
          icon: <Book className="w-5 h-5 text-blue-600" />
        };
      case 'theorem':
        return {
          wrapper: 'bg-amber-50/50 border-amber-100',
          title: 'text-amber-700',
          icon: <Info className="w-5 h-5 text-amber-600" />
        };
      case 'step':
        return {
          wrapper: 'bg-emerald-50/50 border-emerald-100',
          title: 'text-emerald-700',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />
        };
      case 'example':
        return {
          wrapper: 'bg-white border-slate-200 shadow-sm',
          title: 'text-slate-700',
          icon: <PenTool className="w-5 h-5 text-slate-600" />
        };
      default:
        return {
          wrapper: 'bg-white',
          title: 'text-slate-900',
          icon: null
        };
    }
  };

  const style = getStyle();

  const renderVisual = () => {
    if (!block.visualType) return null;
    
    switch (block.visualType) {
      case 'cubic-summary':
        return <CubicGraphSummary />;
      case 'rational-linear-summary':
        return <RationalLinearGraphSummary />;
      case 'rational-quadratic-summary':
        return <RationalQuadraticGraphSummary />;
      case 'oxyz-axes':
        return <OxyzAxesVisual />;
      case 'vector-cross':
        return <VectorCrossProductVisual />;
      case 'vector-operations':
        return <VectorOperationsVisual />;
      case 'barycentric-visual':
        return <BarycentricVisual />;
      case 'csc-csn-comparison':
        return <SequenceComparisonVisual onLaunchPractice={onLaunchPractice} />;
      case 'logarithm-sheet':
        return <LogarithmSheet />;
      case 'derivative-sheet':
        return <DerivativeSheet />;
      case 'integral-sheet':
        return <IntegralSheet />;
      case 'integral-applications':
        return <IntegralApplicationVisual />;
      case 'limit-sheet':
        return <LimitSheet />;
      case 'statistics-ungrouped':
        return <StatisticsUngroupedSheet />;
      case 'statistics-grouped':
        return <StatisticsGroupedSheet />;
      case 'combinatorics-sheet':
        return <CombinatoricsSheet onLaunchPractice={onLaunchPractice} />;
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl border p-5 mb-4 ${style.wrapper}`}>
      {block.title && (
        <div className="flex items-center gap-2 mb-3">
          {style.icon}
          {/* Render title with MathText to support LaTeX formulas in titles */}
          <MathText 
            content={block.title} 
            Component="h3"
            className={`font-bold text-lg ${style.title}`}
          />
        </div>
      )}
      
      {block.content && (
        <div className="prose prose-slate max-w-none">
          <MathText content={block.content} />
        </div>
      )}

      {/* Render embedded custom visual if present */}
      {renderVisual()}
      
      {block.imageUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
            <img src={block.imageUrl} alt={block.title} className="w-full h-auto object-cover" />
        </div>
      )}

      {/* PROOF SECTION */}
      {block.proof && (
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <button 
            onClick={() => setShowProof(!showProof)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors focus:outline-none group"
          >
            <Lightbulb className={`w-4 h-4 ${showProof ? 'text-amber-500 fill-amber-500' : 'text-slate-400 group-hover:text-amber-500'}`} />
            <span>{showProof ? 'Ẩn chứng minh' : 'Xem chứng minh công thức'}</span>
            {showProof ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {showProof && (
            <div className="mt-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 animate-in fade-in slide-in-from-top-1">
              <div className="font-serif italic mb-2 text-slate-500">Chứng minh:</div>
              <MathText content={block.proof} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;