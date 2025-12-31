
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LessonView from './pages/LessonView';
import ExamSystem from './pages/ExamSystem';
import HistoryView from './pages/HistoryView';
import ExamMatrixView from './components/ExamMatrixView';
import { courseData, formulaCourseData } from './data/courseContent';
import { Menu, Clock, PanelLeftOpen } from 'lucide-react';
import { Question, UserAnswer, EducationLevel, ExamHistoryItem, ExamState } from './types';

interface MathAppProps {
  onSwitchSubject: () => void;
}

const MathApp: React.FC<MathAppProps> = ({ onSwitchSubject }) => {
  // Navigation State
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('12');
  
  // Dynamic course selection based on Level
  const currentCourse = educationLevel === 'formula' ? formulaCourseData : courseData;

  const firstLessonId = currentCourse.chapters[0]?.lessons[0]?.id;
  const [activeLessonId, setActiveLessonId] = useState<string>(firstLessonId);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'learn' | 'exam' | 'review' | 'history'>('learn');

  // History State
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<ExamHistoryItem | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('math_exam_history');
    if (savedHistory) {
        try {
            setExamHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  // Save history handler
  const saveExamToHistory = (item: ExamHistoryItem) => {
    const updatedHistory = [item, ...examHistory];
    setExamHistory(updatedHistory);
    localStorage.setItem('math_exam_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setExamHistory([]);
    localStorage.removeItem('math_exam_history');
  };

  // Reset active lesson and view when level/course changes
  const handleSelectLevel = (level: EducationLevel) => {
    setEducationLevel(level);
    setViewMode('learn'); 
    
    if (level === '12' || level === 'formula') {
      const newCourse = level === 'formula' ? formulaCourseData : courseData;
      setActiveLessonId(newCourse.chapters[0]?.lessons[0]?.id || '');
    }
    
    setSelectedHistoryItem(null); 
    setExamState(prev => ({...prev, isRunning: false}));
  };
  
  // --- EXAM GLOBAL STATE ---
  const [examState, setExamState] = useState<ExamState>({
    isRunning: false,
    isPaused: false,
    questions: [],
    userAnswers: {},
    timeLeft: 0,
    phase: 'setup',
    mode: 'exam'
  });

  // Helper to find current lesson object
  const findCurrentLesson = () => {
    for (const chapter of currentCourse.chapters) {
      const lesson = chapter.lessons.find(l => l.id === activeLessonId);
      if (lesson) return lesson;
    }
    return currentCourse.chapters[0].lessons[0];
  };

  const activeLesson = findCurrentLesson();
  const allLessons = currentCourse.chapters.flatMap(c => c.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);

  // --- GLOBAL TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (examState.isRunning && examState.phase === 'taking' && examState.timeLeft > 0) {
      interval = setInterval(() => {
        setExamState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, phase: 'result', isRunning: false }; 
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examState.isRunning, examState.phase]);

  // --- EXAM HANDLERS ---
  const handleStartExam = (questions: Question[], mode: 'exam' | 'review', duration: number) => {
    setExamState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      questions,
      userAnswers: {},
      timeLeft: duration,
      phase: 'taking',
      mode,
      setupData: undefined
    }));
    setViewMode(mode); 
    setSelectedHistoryItem(null);
  };

  const handleUpdateAnswer = (questionId: string, answerData: UserAnswer) => {
    setExamState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: answerData
      }
    }));
  };

  const handleSubmitExam = () => {
    setExamState(prev => ({
      ...prev,
      isRunning: false,
      phase: 'result'
    }));
  };

  const handleRetakeExam = () => {
    setExamState(prev => ({
      ...prev,
      isRunning: false,
      phase: 'setup',
      questions: [],
      userAnswers: {},
      timeLeft: 0
    }));
    if (viewMode === 'history') setViewMode('exam'); 
  };

  const handleLaunchPractice = (topic: string, count: number) => {
    setExamState(prev => ({
      ...prev,
      phase: 'setup',
      mode: 'review',
      setupData: { topic, count }
    }));
    setViewMode('review');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
      setViewMode('learn');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
      setViewMode('learn');
    }
  };
  
  const renderMainContent = () => {
    if (educationLevel === 'exam-matrix') {
        return <ExamMatrixView isExpanded={isSidebarCollapsed} />;
    }
    
    switch (viewMode) {
      case 'learn':
        return (
          <LessonView 
            lesson={activeLesson}
            onNext={currentIndex < allLessons.length - 1 ? handleNext : undefined}
            onPrev={currentIndex > 0 ? handlePrev : undefined}
            onLaunchPractice={handleLaunchPractice}
            isExpanded={isSidebarCollapsed}
          />
        );
      case 'exam':
      case 'review':
        return (
          <ExamSystem 
            course={currentCourse}
            mode={viewMode}
            onExit={() => setViewMode('learn')}
            examState={examState}
            onStartExam={handleStartExam}
            onUpdateAnswer={handleUpdateAnswer}
            onSubmitExam={handleSubmitExam}
            onRetakeExam={handleRetakeExam}
            onSetPhase={(p) => setExamState(prev => ({ ...prev, phase: p }))}
            onSaveHistory={saveExamToHistory}
            isExpanded={isSidebarCollapsed}
          />
        );
      case 'history':
        return selectedHistoryItem ? (
          <ExamSystem 
            course={currentCourse}
            mode={selectedHistoryItem.mode}
            onExit={() => setSelectedHistoryItem(null)}
            examState={{
                isRunning: false,
                isPaused: false,
                questions: selectedHistoryItem.questions,
                userAnswers: selectedHistoryItem.userAnswers,
                timeLeft: 0,
                phase: 'result',
                mode: selectedHistoryItem.mode
            }}
            onStartExam={() => {}}
            onUpdateAnswer={() => {}}
            onSubmitExam={() => {}}
            onRetakeExam={() => {
                 setViewMode(selectedHistoryItem.mode);
                 setExamState(prev => ({ ...prev, phase: 'setup', mode: selectedHistoryItem.mode }));
                 setSelectedHistoryItem(null);
            }}
            onSetPhase={() => {}}
            isExpanded={isSidebarCollapsed}
          />
        ) : (
          <HistoryView 
            history={examHistory}
            onSelectExam={setSelectedHistoryItem}
            onClearHistory={clearHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      <Navigation 
        course={currentCourse} 
        activeLessonId={activeLessonId} 
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          setViewMode('learn');
        }}
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
        onStartExam={() => setViewMode('exam')}
        onStartReview={() => setViewMode('review')}
        onViewHistory={() => {
            setViewMode('history');
            setSelectedHistoryItem(null);
        }}
        currentMode={viewMode}
        currentLevel={educationLevel}
        onSelectLevel={handleSelectLevel}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        // Add prop to switch subject
        onSwitchSubject={onSwitchSubject}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="md:hidden flex items-center p-4 bg-white border-b border-slate-200 z-30 sticky top-0">
          <button onClick={() => setIsNavOpen(true)} className="p-2 mr-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-slate-800 truncate">{currentCourse.title}</span>
        </header>
        
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="hidden md:flex fixed top-4 left-4 z-40 bg-white/90 backdrop-blur p-2 rounded-lg shadow-md border border-slate-200 text-slate-500 hover:text-primary transition-all hover:scale-105"
            title="Mở thanh điều hướng"
          >
            <PanelLeftOpen className="w-6 h-6" />
          </button>
        )}

        <div className={`flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth ${isSidebarCollapsed ? 'md:px-16' : ''}`}>
          {renderMainContent()}
        </div>

        {examState.isRunning && viewMode === 'learn' && examState.phase === 'taking' && (
          <div className="absolute bottom-6 right-6 z-50 animate-bounce-slow">
            <button 
              onClick={() => setViewMode(examState.mode)}
              className="bg-white border-2 border-red-500 rounded-2xl shadow-xl p-4 flex items-center gap-4 hover:bg-red-50 transition-all group"
            >
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
                <div className="relative bg-red-500 text-white p-3 rounded-full">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bài thi đang chạy</p>
                <p className="text-xl font-black text-red-600 font-mono">
                  {formatTime(examState.timeLeft)}
                </p>
                <p className="text-xs text-red-500 group-hover:underline mt-1">Bấm để quay lại</p>
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MathApp;