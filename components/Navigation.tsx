
import React, { useState } from 'react';
import { BookOpen, TrendingUp, Maximize, ArrowUpRight, Menu, X, LineChart, PenTool, BookOpenCheck, ChevronDown, ChevronRight, Calculator, Grid3X3, GraduationCap, Book, Sigma, ChevronUp, History, PanelLeftClose, LogOut } from 'lucide-react';
import { Course, EducationLevel } from '../types';

interface NavigationProps {
  course: Course;
  activeLessonId: string | null;
  onSelectLesson: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onStartExam: () => void;
  onStartReview: () => void;
  onViewHistory: () => void;
  currentMode: 'learn' | 'exam' | 'review' | 'history';
  currentLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSwitchSubject?: () => void; // New prop
}

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Maximize,
  ArrowUpRight,
  LineChart,
};

const Navigation: React.FC<NavigationProps> = ({ 
  course, 
  activeLessonId, 
  onSelectLesson, 
  isOpen, 
  setIsOpen,
  onStartExam,
  onStartReview,
  onViewHistory,
  currentMode,
  currentLevel,
  onSelectLevel,
  isCollapsed = false,
  onToggleCollapse,
  onSwitchSubject
}) => {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(course.chapters.map(c => c.id));
  const [showLevelMenu, setShowLevelMenu] = useState(false);

  const toggleChapter = (chapterId: string) => {
    if (expandedChapters.includes(chapterId)) {
      setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
    } else {
      setExpandedChapters([...expandedChapters, chapterId]);
    }
  };

  const getLevelInfo = (level: EducationLevel) => {
    switch (level) {
      case '10': return { title: 'Lớp 10', subtitle: 'THPT', color: 'bg-emerald-500' };
      case '11': return { title: 'Lớp 11', subtitle: 'THPT', color: 'bg-orange-500' };
      case '12': return { title: 'Lớp 12', subtitle: 'THPT', color: 'bg-blue-600' };
      case 'formula': return { title: 'Công Thức', subtitle: 'Sổ tay toán học', color: 'bg-purple-600' };
      case 'exam-matrix': return { title: 'Ma Trận Đề Thi', subtitle: 'Phân tích cấu trúc 2025', color: 'bg-indigo-600' };
    }
  };

  const currentLevelInfo = getLevelInfo(currentLevel);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:hidden' : 'md:translate-x-0 md:static md:h-screen md:sticky md:top-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            <span>MathMaster</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
          <button 
            onClick={onToggleCollapse} 
            className="hidden md:block text-slate-400 hover:text-slate-700 transition-colors"
            title="Thu gọn menu"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Action Buttons */}
          <div className="p-4 space-y-2 border-b border-slate-100">
            <button
              onClick={() => {
                onStartReview();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${currentMode === 'review' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${currentMode === 'review' ? 'bg-white/20' : 'bg-white'}`}>
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">Ôn Tập Tùy Chọn</span>
            </button>

            <button
              onClick={() => {
                onStartExam();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${currentMode === 'exam' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${currentMode === 'exam' ? 'bg-white/20' : 'bg-white'}`}>
                <PenTool className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">Làm Đề Kiểm Tra</span>
            </button>

            <button
              onClick={() => {
                onViewHistory();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${currentMode === 'history' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${currentMode === 'history' ? 'bg-white/20' : 'bg-white'}`}>
                <History className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">Lịch Sử Kiểm Tra</span>
            </button>
          </div>

          {/* Chapter & Lesson List */}
          <div className="p-2">
             {(currentLevel === '12' || currentLevel === 'formula') ? (
                course.chapters.map(chapter => (
                    <div key={chapter.id} className="mb-2">
                        <button 
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                {chapter.id.includes('calculus') || chapter.id.includes('chapter-1') ? <Calculator className="w-5 h-5 text-blue-500"/> : <Grid3X3 className="w-5 h-5 text-purple-500"/>}
                                <span className="text-left">{chapter.title.split(':')[0]}</span>
                            </div>
                            {expandedChapters.includes(chapter.id) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            )}
                        </button>

                        {expandedChapters.includes(chapter.id) && (
                            <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
                                {chapter.lessons.map(lesson => {
                                    const Icon = iconMap[lesson.icon] || BookOpen;
                                    const isActive = activeLessonId === lesson.id && currentMode === 'learn';
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => {
                                                onSelectLesson(lesson.id);
                                                setIsOpen(false);
                                            }}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left text-sm
                                                ${isActive 
                                                ? 'bg-blue-50 text-primary font-medium' 
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <span className="truncate">{lesson.title.split(':')[0]}</span> 
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))
             ) : (
                 <div className="p-6 text-center text-slate-500">
                    <p className="text-sm italic">Nội dung cho mục này đang được hiển thị ở màn hình chính.</p>
                </div>
             )}
          </div>
        </div>

        {/* Footer Level Selection */}
        <div className="relative border-t border-slate-100 bg-white p-4 flex-shrink-0">
          {showLevelMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in slide-in-from-bottom-2 fade-in">
                <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Chọn mục</div>
                {[
                    { id: '12', label: 'Lớp 12', icon: GraduationCap },
                    { id: 'formula', label: 'Công Thức', icon: Sigma },
                    { id: 'exam-matrix', label: 'Ma Trận Đề Thi', icon: Grid3X3 },
                    { id: '11', label: 'Lớp 11', icon: GraduationCap },
                    { id: '10', label: 'Lớp 10', icon: GraduationCap },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            onSelectLevel(item.id as EducationLevel);
                            setShowLevelMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${currentLevel === item.id 
                                ? 'bg-slate-100 text-slate-900' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 ${currentLevel === item.id ? 'text-primary' : 'text-slate-400'}`} />
                        {item.label}
                        {currentLevel === item.id && <div className="w-1.5 h-1.5 bg-primary rounded-full ml-auto" />}
                    </button>
                ))}
            </div>
          )}

          <div className="flex gap-2">
            <button 
                onClick={() => setShowLevelMenu(!showLevelMenu)}
                className="flex-1 flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
                <div className={`w-10 h-10 rounded-full ${currentLevelInfo.color} flex items-center justify-center text-white font-bold shadow-md`}>
                {
                    currentLevel === 'formula' ? <Sigma className="w-5 h-5"/> : 
                    currentLevel === 'exam-matrix' ? <Grid3X3 className="w-5 h-5" /> : 
                    currentLevel
                }
                </div>
                <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                        {currentLevelInfo.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{currentLevelInfo.subtitle}</p>
                </div>
                <div className={`text-slate-400 transition-transform duration-200 ${showLevelMenu ? 'rotate-180' : ''}`}>
                    <ChevronUp className="w-5 h-5" />
                </div>
            </button>
            
            {onSwitchSubject && (
                <button 
                    onClick={onSwitchSubject}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    title="Đổi môn học"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
