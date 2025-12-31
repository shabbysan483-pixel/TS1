
import React from 'react';
import { ExamHistoryItem } from '../types';
import { Calendar, Award, ArrowRight, Clock, Trash2, PenTool, BookOpenCheck } from 'lucide-react';

interface HistoryViewProps {
  history: ExamHistoryItem[];
  onSelectExam: (item: ExamHistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectExam, onClearHistory }) => {
  
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chưa có lịch sử</h2>
        <p className="text-slate-500 max-w-md">
          Bạn chưa thực hiện bài kiểm tra nào. Hãy bắt đầu làm bài kiểm tra hoặc ôn tập để lưu lại kết quả tại đây.
        </p>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <Clock className="w-8 h-8 text-indigo-600" />
             Lịch Sử Kiểm Tra
           </h1>
           <p className="text-slate-500 mt-1">Xem lại kết quả các bài thi đã làm</p>
        </div>
        <button 
          onClick={() => {
             if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
               onClearHistory();
             }
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Xóa lịch sử
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectExam(item)}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
          >
            {/* Icon & Mode */}
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 
               ${item.mode === 'exam' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}
            >
               {item.mode === 'exam' ? <PenTool className="w-7 h-7" /> : <BookOpenCheck className="w-7 h-7" />}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.mode === 'exam' ? 'Đề thi thử (Chuẩn)' : 'Bài ôn tập tùy chọn'}
                  </h3>
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded md:ml-2">
                    {formatDate(item.date)}
                  </span>
               </div>
               <div className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.questions.length} câu hỏi
                  </span>
                  {item.feedback && (
                      <span className="flex items-center gap-1 text-indigo-500">
                          <Award className="w-3 h-3" /> Đã có nhận xét AI
                      </span>
                  )}
               </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center w-24">
                <div className="text-2xl font-black text-slate-800">
                    {item.score.toFixed(1)}<span className="text-sm text-slate-400 font-normal">/{item.maxScore}</span>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Điểm số</div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
