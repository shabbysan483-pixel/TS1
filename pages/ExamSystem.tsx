
import React, { useState, useEffect, useRef } from 'react';
import { Course, Question, UserAnswer, MultipleChoiceQuestion, TrueFalseQuestion, ShortAnswerQuestion, ExamHistoryItem, ExamState } from '../types';
import MathText from '../components/MathText';
import { Check, X, Clock, AlertCircle, Award, CheckCircle, Sparkles, Brain, Loader2, Minus, Plus, BookOpenCheck, ArrowRight, RefreshCw, Calculator, Grid3X3, PenTool, HelpCircle, LogOut } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExamState as MathAppExamState } from '../types'; // This line is redundant as we already import ExamState, but keeping it to ensure no conflict or errors if the user meant a different one. However, the plan is to use shared ExamState.

interface ExamSystemProps {
  course: Course;
  mode: 'exam' | 'review';
  onExit: () => void;
  examState: ExamState;
  onStartExam: (questions: Question[], mode: 'exam' | 'review', duration: number) => void;
  onUpdateAnswer: (qId: string, answer: UserAnswer) => void;
  onSubmitExam: () => void;
  onRetakeExam: () => void;
  onSetPhase: (phase: 'setup' | 'generating' | 'taking' | 'result') => void;
  onSaveHistory?: (item: ExamHistoryItem) => void;
  isExpanded?: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuestionCounts {
  part1: number;
  part2: number;
  part3: number;
}

// --- HELPER: FLEXIBLE ANSWER CHECKER ---
const normalizeStringForCheck = (str: string) => {
  if (!str) return "";
  return str.toString()
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
    .replace(/\$/g, "") // Remove LaTeX delimiters
    .replace(/(tcn|tcd|tiemcan|tiem can|dung|ngang|va|and|[:])/g, " ") // Remove common labels
    .replace(/\s*=\s*/g, "=") // Normalize spacing around equals
    .replace(/\s+/g, ""); // Remove all whitespace for stricter check
};

const checkShortAnswer = (user: string | number | undefined, correct: string | number): boolean => {
  if (user === undefined || user === null || String(user).trim() === '') return false;

  const cleanUser = normalizeStringForCheck(String(user));
  const cleanCorrect = normalizeStringForCheck(String(correct));
  
  // Attempt numeric comparison first if they look like single numbers
  const userNum = parseFloat(cleanUser);
  const correctNum = parseFloat(cleanCorrect);
  if (!isNaN(userNum) && !isNaN(correctNum) && !cleanUser.includes(',') && !cleanCorrect.includes(',')) {
    if (Math.abs(userNum - correctNum) < 0.001) return true;
  }
  
  // Compare as sets of parts for multi-part answers (e.g., "x=1, y=2") or text answers
  // Revert aggressive whitespace removal for splitting
  const userParts = String(user).toLowerCase().replace(/[\$\s]/g, '').split(/[,;]+/).filter(p => p !== "").sort();
  const correctParts = String(correct).toLowerCase().replace(/[\$\s]/g, '').split(/[,;]+/).filter(p => p !== "").sort();

  if (userParts.length === 0 && correctParts.length === 0) return true; // both empty is a match
  if (userParts.length !== correctParts.length) return false;

  return userParts.every((part, i) => part === correctParts[i]);
};


// --- MAIN COMPONENT ---
const ExamSystem: React.FC<ExamSystemProps> = ({ 
  course, mode, onExit, 
  examState, onStartExam, onUpdateAnswer, onSubmitExam, onRetakeExam, onSetPhase, onSaveHistory, isExpanded = false
}) => {
  
  // Local setup state (only needed during setup phase)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [inputType, setInputType] = useState<'chapter' | 'custom'>('chapter');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(course.chapters[0].id);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [questionCounts, setQuestionCounts] = useState<QuestionCounts>({
    part1: 5,
    part2: 2,
    part3: 2
  });

  useEffect(() => {
    if (!examState.isRunning) {
        if (mode === 'exam') {
            setQuestionCounts({ part1: 12, part2: 4, part3: 6 });
        } else {
            setQuestionCounts({ part1: 5, part2: 2, part3: 2 });
        }
    }
  }, [mode, examState.isRunning]);

  useEffect(() => {
     setSelectedLessons([]);
  }, [selectedChapterId]);


  // --- API GENERATION LOGIC ---
  const handleGenerateExam = async () => {
    if (!process.env.API_KEY) {
      alert("API Key không tìm thấy. Vui lòng kiểm tra cấu hình.");
      return;
    }

    onSetPhase('generating');

    let topicPrompt = "";
    if (inputType === 'chapter') {
      if (selectedLessons.length === 0) {
        alert("Vui lòng chọn ít nhất một bài học.");
        onSetPhase('setup');
        return;
      }
      const activeChapter = course.chapters.find(c => c.id === selectedChapterId);
      const lessonTitles = activeChapter?.lessons
        .filter(l => selectedLessons.includes(l.id))
        .map(l => l.title)
        .join(", ");
      
      const chapterTitle = activeChapter?.title || "";
      topicPrompt = `Chương: ${chapterTitle}. Các bài học cụ thể: ${lessonTitles} (Thuộc chương trình Toán 12)`;
    } else {
      if (!customTopic.trim()) {
        alert("Vui lòng nhập chủ đề.");
        onSetPhase('setup');
        return;
      }
      topicPrompt = `Chủ đề: ${customTopic}`;
    }

    const counts = mode === 'exam' 
        ? { part1: 12, part2: 4, part3: 6 } 
        : questionCounts;

    const totalQuestions = counts.part1 + counts.part2 + counts.part3;
    if (totalQuestions === 0) {
        alert("Vui lòng chọn ít nhất 1 câu hỏi để tạo đề.");
        onSetPhase('setup');
        return;
    }

    // --- DIFFICULTY RULES ---
    let difficultyInstruction = "";
    if (difficulty === 'easy') {
        difficultyInstruction = `
        MỨC ĐỘ: CƠ BẢN (EASY)
        - Phân bổ: 60% Nhận biết, 40% Thông hiểu.
        - Yêu cầu: 
          + Các câu hỏi phải ngắn gọn, trực diện, bám sát SGK Toán THPT.
          + Chỉ yêu cầu áp dụng công thức trực tiếp hoặc kiểm tra định nghĩa.
          + Tuyệt đối KHÔNG ra các bài toán có tham số m phức tạp hoặc bài toán thực tế nhiều bước.
          + Tính toán đơn giản, có thể nhẩm hoặc bấm máy 1 bước.
        `;
    } else if (difficulty === 'medium') {
        difficultyInstruction = `
        MỨC ĐỘ: TRUNG BÌNH (MEDIUM)
        - Phân bổ: 40% Thông hiểu, 60% Vận dụng.
        - Yêu cầu:
          + Các bài toán chuẩn mực trong đề thi Tốt nghiệp THPT.
          + Cần 2-3 bước biến đổi để ra kết quả.
          + Có thể chứa tham số m ở mức độ cơ bản (tìm m để hàm đồng biến trên R, v.v.).
          + Không quá dễ (nhìn là thấy đáp án) nhưng chưa đến mức Vận dụng cao (đánh đố).
        `;
    } else {
        difficultyInstruction = `
        MỨC ĐỘ: NÂNG CAO (HARD)
        - Phân bổ: 40% Vận dụng, 60% Vận dụng cao.
        - Yêu cầu:
          + Tập trung vào các câu điểm 8, 9, 10 trong đề thi Tốt nghiệp THPT.
          + Bài toán chứa tham số m phức tạp, cực trị hàm hợp, hình học không gian kết hợp giải tích.
          + Bài toán thực tế tối ưu hóa, bài toán liên môn.
          + Đòi hỏi học sinh phải tư duy tổng hợp nhiều kiến thức.
          + LƯU Ý: "Vận dụng cao" nghĩa là bài toán khó trong chương trình phổ thông, KHÔNG PHẢI là dùng kiến thức Toán cao cấp.
        `;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `Bạn là một chuyên gia ra đề thi Tốt nghiệp THPT môn Toán tại Việt Nam.
      
      QUY TẮC TUYỆT ĐỐI VỀ PHẠM VI KIẾN THỨC (SCOPE):
      1. CHỈ được phép sử dụng kiến thức nằm trong Sách Giáo Khoa Toán 10, 11, 12 (Chương trình GDPT 2018 hiện hành của Bộ GD&ĐT Việt Nam).
      2. TUYỆT ĐỐI KHÔNG (BANNED) đưa vào các kiến thức Toán Cao Cấp (Đại học) hoặc ngoài chương trình như:
         - Ma trận (nghịch đảo, hạng, chéo hóa...), Định thức (Determinant).
         - Chuỗi số (Series), Chuỗi Taylor, Maclaurin.
         - Tích phân suy rộng, Tích phân đường, Tích phân mặt.
         - Vi phân toàn phần, Đạo hàm riêng (Partial derivative).
         - Các hàm Hyperbolic (sinh, cosh, tanh).
         - Số phức (nếu chương trình mới 2025 không còn chú trọng thì hạn chế, tập trung vào Giải tích và Hình Oxyz).
      3. Phong cách ra đề: Bám sát cấu trúc đề minh họa và đề chính thức của Bộ GD&ĐT các năm gần đây.

      CẤU TRÚC ĐỀ BÀI YÊU CẦU:
      1. Phần I: ${counts.part1} câu trắc nghiệm lựa chọn (4 phương án A,B,C,D).
      2. Phần II: ${counts.part2} câu trắc nghiệm đúng/sai. Mỗi câu có 4 ý nhỏ.
      3. Phần III: ${counts.part3} câu trắc nghiệm trả lời ngắn.
          - QUAN TRỌNG: Đối với câu trả lời ngắn, trường 'correctAnswerText' PHẢI CHỈ chứa KẾT QUẢ SỐ HỌC.
          - Ví dụ: Nếu đáp án là 'y=3', chỉ trả về '3'. Nếu đáp án là 'm=5', chỉ trả về '5'. Nếu đáp án là 'x=1 và x=2', trả về '1,2'.
          - TUYỆT ĐỐI KHÔNG bao gồm tên biến (như 'x=', 'y=') hoặc các ký tự LaTeX ($) trong 'correctAnswerText'.

      Tổng cộng: ${totalQuestions} câu hỏi lớn.

      YÊU CẦU NỘI DUNG:
      - Chủ đề: ${topicPrompt}
      ${difficultyInstruction}
      
      QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
      - BẮT BUỘC: Mọi công thức toán học (phân số, mũ, tích phân, ký hiệu...) PHẢI được đặt trong cặp dấu $.
      - Ví dụ SAI: "\\frac{1}{2}" (sẽ bị lỗi hiển thị).
      - Ví dụ ĐÚNG: "$\\frac{1}{2}$" hoặc "$\\int f(x)dx$".
      - JSON ESCAPE: Vì kết quả là chuỗi JSON, dấu gạch chéo ngược phải được escape. Ví dụ: Để có công thức $\\frac{1}{2}$, bạn phải viết trong JSON là "$\\frac{1}{2}$".
      - OXYZ: Dùng tọa độ (x; y; z) hoặc (x, y, z).
      
      QUY TẮC RIÊNG CHO CHỦ ĐỀ XÁC SUẤT/TỔ HỢP (Nếu có):
      - Xác định rõ không gian mẫu n(Omega) và biến cố n(A).
      - Sử dụng đúng ký hiệu C_n^k (tổ hợp) và A_n^k (chỉnh hợp).
      - Tính toán phân số cẩn thận, tối giản kết quả.
      
      Hãy tạo chính xác số lượng câu hỏi yêu cầu bên trên và trả về dưới dạng JSON thuần túy.`;

      const schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["multiple_choice", "true_false", "short_answer"] },
            content: { type: Type.STRING },
            explanation: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            statements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN }
                }
              }
            },
            correctAnswerText: { type: Type.STRING }
          },
          required: ["type", "content", "explanation"]
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: "Hãy tạo đề ngay bây giờ." }] }],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7
        }
      });

      const text = response.text || "[]";
      let rawQuestions;
      
      // Improved JSON Parsing Logic
      try {
        rawQuestions = JSON.parse(text);
      } catch (parseError) {
        console.error("Direct JSON Parse Error:", parseError);
        // Attempt to clean markdown code blocks if present
        let cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        // Attempt to extract array from text
        const arrayStart = cleanedText.indexOf('[');
        const arrayEnd = cleanedText.lastIndexOf(']');
        if (arrayStart !== -1 && arrayEnd !== -1) {
            cleanedText = cleanedText.substring(arrayStart, arrayEnd + 1);
        }
        try {
            rawQuestions = JSON.parse(cleanedText);
        } catch (retryError) {
             console.error("Retry JSON Parse Error:", retryError);
             throw new Error("Không thể đọc dữ liệu đề thi từ AI. Vui lòng thử lại.");
        }
      }
      
      const mappedQuestions: Question[] = rawQuestions.map((q: any, index: number) => {
        const base = {
          id: `q-${index}-${Date.now()}`,
          lessonId: 'generated',
          content: q.content,
          explanation: q.explanation,
          level: difficulty === 'easy' ? 'recognition' : difficulty === 'medium' ? 'understanding' : 'application'
        };

        if (q.type === 'multiple_choice') {
          let correctIdx = 0;
          // Strategy 1: Trust explicit numerical index from schema
          if (typeof q.correctAnswerIndex === 'number') {
            correctIdx = q.correctAnswerIndex;
          } 
          // Strategy 2: Check for String letters "A", "B", "C", "D" or numeric strings
          else if (['A', '0'].includes(String(q.correctAnswerIndex))) correctIdx = 0;
          else if (['B', '1'].includes(String(q.correctAnswerIndex))) correctIdx = 1;
          else if (['C', '2'].includes(String(q.correctAnswerIndex))) correctIdx = 2;
          else if (['D', '3'].includes(String(q.correctAnswerIndex))) correctIdx = 3;
          
          // Strategy 3: Fix for when AI returns the *Content* of the answer instead of the Index
          if (q.correctAnswer && typeof q.correctAnswer === 'string') {
             const char = q.correctAnswer.trim().toUpperCase();
             if (['A', 'B', 'C', 'D'].includes(char)) {
                 if (char === 'B') correctIdx = 1;
                 if (char === 'C') correctIdx = 2;
                 if (char === 'D') correctIdx = 3;
             } else {
                 // The AI returned the actual text (e.g., "2/9") as the answer.
                 // We need to find which option this text corresponds to.
                 // Normalize both strings to ensure matching (remove LaTeX $ and spaces)
                 const normalize = (s: string) => s.replace(/\$/g, '').replace(/\s/g, '').toLowerCase();
                 const target = normalize(q.correctAnswer);
                 
                 const foundIndex = (q.options || []).findIndex((opt: string) => normalize(opt) === target);
                 if (foundIndex !== -1) {
                     correctIdx = foundIndex;
                 }
             }
          }

          return {
            ...base,
            type: 'multiple_choice',
            options: q.options || ["A", "B", "C", "D"],
            correctAnswer: correctIdx
          } as MultipleChoiceQuestion;
        } else if (q.type === 'true_false') {
          return {
            ...base,
            type: 'true_false',
            statements: (q.statements || []).map((s: any, i: number) => ({
              id: `s-${index}-${i}`,
              content: s.content,
              isCorrect: s.isCorrect
            }))
          } as TrueFalseQuestion;
        } else {
          return {
            ...base,
            type: 'short_answer',
            correctAnswer: q.correctAnswerText || "0"
          } as ShortAnswerQuestion;
        }
      });

      const duration = mode === 'exam' ? 5400 : 3600; 
      onStartExam(mappedQuestions, mode, duration);

    } catch (error: any) {
      console.error("Error generating exam:", error);
      let msg = "Có lỗi khi tạo đề.";
      if (error.message?.includes("403")) {
        msg += " (Lỗi quyền truy cập API - 403. Vui lòng kiểm tra API Key).";
      } else if (error.message?.includes("JSON") || error.message?.includes("đọc dữ liệu")) {
        msg += " (Lỗi xử lý dữ liệu từ AI. Hãy thử lại chủ đề khác hoặc giảm số lượng câu hỏi).";
      } else {
        msg += ` (${error.message})`;
      }
      alert(msg);
      onSetPhase('setup');
    }
  };

  if (examState.phase === 'setup') {
    return (
      <ExamSetup 
        course={course} 
        mode={mode}
        selectedChapterId={selectedChapterId}
        setSelectedChapterId={setSelectedChapterId}
        selectedLessons={selectedLessons} 
        setSelectedLessons={setSelectedLessons}
        inputType={inputType}
        setInputType={setInputType}
        customTopic={customTopic}
        setCustomTopic={setCustomTopic}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        questionCounts={questionCounts}
        setQuestionCounts={setQuestionCounts}
        onStart={handleGenerateExam}
      />
    );
  }

  if (examState.phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white p-4 rounded-full shadow-lg">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-slate-800">
            {mode === 'exam' ? 'Đang Tạo Đề Thi Chuẩn...' : 'Đang Tạo Bài Ôn Tập...'}
        </h2>
        <p className="mt-2 text-slate-500 max-w-md">
          Hệ thống đang phân tích chủ đề và tạo ra các câu hỏi phù hợp với mức độ <span className="font-semibold text-primary">{difficulty === 'easy' ? 'Cơ bản (Nhận biết/Thông hiểu)' : difficulty === 'medium' ? 'Trung bình (Thông hiểu/Vận dụng)' : 'Nâng cao (Vận dụng cao)'}</span>.
        </p>
        <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
           <Loader2 className="w-4 h-4 animate-spin" />
           <span>Đang kết nối với Gemini AI...</span>
        </div>
      </div>
    );
  }

  if (examState.phase === 'result') {
    return (
      <ExamResult 
        questions={examState.questions} 
        userAnswers={examState.userAnswers} 
        onRetake={onRetakeExam}
        onExit={onExit}
        mode={mode}
        onSaveHistory={onSaveHistory}
        isExpanded={isExpanded}
      />
    );
  }

  if (mode === 'review') {
    return (
        <ReviewSession 
            questions={examState.questions}
            userAnswers={examState.userAnswers}
            onUpdateAnswer={onUpdateAnswer}
            onExit={onExit}
            onRetake={onRetakeExam}
            onSubmit={onSubmitExam}
            isExpanded={isExpanded}
        />
    )
  }

  return (
    <ExamSession 
      questions={examState.questions}
      userAnswers={examState.userAnswers}
      onUpdateAnswer={onUpdateAnswer}
      timeLeft={examState.timeLeft}
      onSubmit={onSubmitExam}
      isExpanded={isExpanded}
    />
  );
};

// --- SETUP COMPONENT ---
const ExamSetup: React.FC<{
  course: Course;
  mode: 'exam' | 'review';
  selectedChapterId: string;
  setSelectedChapterId: (id: string) => void;
  selectedLessons: string[];
  setSelectedLessons: (ids: string[]) => void;
  inputType: 'chapter' | 'custom';
  setInputType: (type: 'chapter' | 'custom') => void;
  customTopic: string;
  setCustomTopic: (s: string) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  questionCounts: QuestionCounts;
  setQuestionCounts: React.Dispatch<React.SetStateAction<QuestionCounts>>;
  onStart: () => void;
}> = ({ 
  course, mode, 
  selectedChapterId, setSelectedChapterId,
  selectedLessons, setSelectedLessons, 
  inputType, setInputType, customTopic, setCustomTopic,
  difficulty, setDifficulty, questionCounts, setQuestionCounts, onStart 
}) => {
  
  const activeChapter = course.chapters.find(c => c.id === selectedChapterId) || course.chapters[0];

  const toggleLesson = (id: string) => {
    if (selectedLessons.includes(id)) {
      setSelectedLessons(selectedLessons.filter(l => l !== id));
    } else {
      setSelectedLessons([...selectedLessons, id]);
    }
  };

  const selectAll = () => {
    if (selectedLessons.length === activeChapter.lessons.length) setSelectedLessons([]);
    else setSelectedLessons(activeChapter.lessons.map(l => l.id));
  };

  const isReview = mode === 'review';
  const themeColor = isReview ? 'emerald' : 'blue';
  const MainIcon = isReview ? BookOpenCheck : Brain;
  const title = isReview ? "Ôn Tập Tùy Chọn" : "Luyện Thi Chuẩn";
  const desc = isReview ? "Tùy chỉnh số lượng câu hỏi để ôn tập theo ý muốn." : "Tạo đề thi tự động với AI theo cấu trúc chuẩn Bộ GD&ĐT.";

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className={`bg-${themeColor}-500/10 p-3 rounded-xl`}>
           <MainIcon className={`w-8 h-8 text-${themeColor}-600`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-600">{desc}</p>
        </div>
      </div>

      <div className="grid gap-8">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
            Chọn độ khó
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'easy', label: 'Cơ bản', desc: 'Nhận biết & Thông hiểu' },
              { id: 'medium', label: 'Trung bình', desc: 'Thông hiểu & Vận dụng' },
              { id: 'hard', label: 'Nâng cao', desc: 'Vận dụng cao' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDifficulty(opt.id as Difficulty)}
                className={`p-4 rounded-xl border-2 text-left transition-all
                  ${difficulty === opt.id 
                    ? `border-${themeColor}-500 bg-${themeColor}-50 ring-1 ring-${themeColor}-500` 
                    : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className={`font-bold ${difficulty === opt.id ? `text-${themeColor}-600` : 'text-slate-700'}`}>{opt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">2</span>
            Chọn nội dung
          </h3>
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6 w-fit">
            <button 
              onClick={() => setInputType('chapter')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'chapter' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Từ chương trình học
            </button>
            <button 
              onClick={() => setInputType('custom')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'custom' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Chủ đề tự chọn
            </button>
          </div>

          {inputType === 'chapter' ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
                {course.chapters.map(chapter => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapterId(chapter.id)}
                    className={`px-4 py-3 text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-colors
                      ${selectedChapterId === chapter.id 
                        ? `text-${themeColor}-600 bg-white border-b-2 border-${themeColor}-600` 
                        : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     {chapter.id.includes('1') ? <Calculator className="w-4 h-4"/> : <Grid3X3 className="w-4 h-4"/>}
                     {chapter.title.split(':')[0]}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-white border-b border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-700 text-sm">{activeChapter.title}</span>
                <button onClick={selectAll} className={`text-xs text-${themeColor}-600 font-bold hover:underline`}>
                  {selectedLessons.length === activeChapter.lessons.length ? 'Bỏ chọn' : 'Chọn tất cả'}
                </button>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {activeChapter.lessons.map(lesson => (
                  <label key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedLessons.includes(lesson.id)}
                      onChange={() => toggleLesson(lesson.id)}
                      className={`w-4 h-4 rounded border-slate-300 text-${themeColor}-600 focus:ring-${themeColor}-500`}
                    />
                    <span className="text-slate-700 text-sm font-medium">{lesson.title}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nhập chủ đề bạn muốn ôn luyện:</label>
              <div className="relative">
                <input 
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ví dụ: Nguyên hàm, Tích phân, Hình Oxyz..."
                  className={`w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 outline-none transition-shadow`}
                />
                <PenTool className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          )}
        </section>

        {isReview && (
             <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">3</span>
                    Cấu trúc bài ôn tập
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="font-medium text-slate-700 text-sm">Trắc nghiệm lựa chọn (Câu)</label>
                             <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{questionCounts.part1}</span>
                        </div>
                        <input 
                            type="range" min="0" max="40" step="1"
                            value={questionCounts.part1}
                            onChange={(e) => setQuestionCounts({...questionCounts, part1: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="font-medium text-slate-700 text-sm">Trắc nghiệm Đúng/Sai (Câu)</label>
                             <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{questionCounts.part2}</span>
                        </div>
                        <input 
                            type="range" min="0" max="10" step="1"
                            value={questionCounts.part2}
                            onChange={(e) => setQuestionCounts({...questionCounts, part2: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="font-medium text-slate-700 text-sm">Trả lời ngắn (Câu)</label>
                             <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{questionCounts.part3}</span>
                        </div>
                        <input 
                            type="range" min="0" max="20" step="1"
                            value={questionCounts.part3}
                            onChange={(e) => setQuestionCounts({...questionCounts, part3: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>
             </section>
        )}

        <button 
          onClick={onStart}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 
            ${isReview 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'} 
            text-white shadow-lg hover:-translate-y-1 transition-all`}
        >
          <Sparkles className="w-5 h-5" />
          {isReview ? "Tạo Bài Ôn Tập" : "Bắt Đầu Làm Đề"}
        </button>
      </div>
    </div>
  );
};

// ... (Rest of components: QuestionCard, ReviewSession, ExamSession, ExamResult remain unchanged)
const QuestionCard: React.FC<{
  question: Question;
  index: number;
  userAnswer: UserAnswer;
  onAnswerChange: (val: any) => void;
  showFeedback: boolean; 
  onCheck?: () => void;
  isExpanded?: boolean;
}> = ({ question: q, index, userAnswer, onAnswerChange, showFeedback, onCheck, isExpanded }) => {

  const isChecked = showFeedback;
  // Check if answered at all (for "Unanswered" label)
  const isUnanswered = userAnswer === undefined || userAnswer.answer === undefined || (Array.isArray(userAnswer.answer) && userAnswer.answer.every(x => x === undefined)) || (typeof userAnswer.answer === 'string' && userAnswer.answer.trim() === '');

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md ${isExpanded ? 'p-8' : 'p-6'}`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`bg-slate-800 text-white px-3 py-1 rounded-md font-bold shadow-sm ${isExpanded ? 'text-lg' : 'text-sm'}`}>
          Câu {index}
        </span>
        {isChecked && (
          <div className="flex gap-2">
            {isUnanswered ? (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200">
                    <HelpCircle className="w-3 h-3" /> Chưa làm
                </span>
            ) : (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Đã chấm
                </span>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <MathText content={q.content} className={`text-slate-800 font-medium ${isExpanded ? 'text-xl' : 'text-lg'}`} />
      </div>

      {q.type === 'multiple_choice' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(q as MultipleChoiceQuestion).options.map((opt, i) => {
            const isSelected = userAnswer?.answer === i;
            const isCorrect = (q as MultipleChoiceQuestion).correctAnswer === i;
            let bgClass = "bg-white border-slate-200 hover:bg-slate-50";
            let icon = null;
            
            if (isChecked) {
              if (isCorrect) {
                  if (isSelected) {
                      bgClass = "bg-green-50 border-green-600 text-green-800 ring-1 ring-green-600 shadow-inner";
                      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                  } else {
                      bgClass = "bg-green-50 border-green-500 text-green-700 border-dashed ring-1 ring-green-400 opacity-100";
                      icon = <Check className="w-5 h-5 text-green-600" />;
                  }
              } else if (isSelected) {
                  bgClass = "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500 shadow-inner";
                  icon = <X className="w-5 h-5 text-red-600" />;
              } else {
                  bgClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
              }
            } else if (isSelected) {
              bgClass = "bg-blue-50 border-primary text-primary ring-1 ring-primary";
            }

            return (
              <button 
                key={i}
                onClick={() => !isChecked && onAnswerChange(i)}
                disabled={isChecked}
                className={`p-4 rounded-lg border text-left transition-all flex items-start gap-3 ${bgClass} ${isExpanded ? 'text-lg' : ''}`}
              >
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                   ${isSelected || (isChecked && isCorrect) ? 'border-current bg-current text-white' : 'border-slate-300 text-slate-500'}`}>
                   {String.fromCharCode(65 + i)}
                 </div>
                 <div className="flex-1 pt-0.5">
                    <MathText content={opt} />
                 </div>
                 {icon}
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'true_false' && (
        <div className="space-y-3">
           <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>Mệnh đề</div>
              <div className="text-center">Đúng</div>
              <div className="text-center">Sai</div>
           </div>
           {(q as TrueFalseQuestion).statements.map((stmt, idx) => {
             const currentAns = userAnswer?.answer?.[idx]; 
             const correctVal = stmt.isCorrect; 
             
             return (
               <div key={stmt.id} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="flex items-start gap-2">
                   <span className="font-bold text-slate-500 text-sm">{String.fromCharCode(97 + idx)})</span>
                   <MathText content={stmt.content} Component="span" className={`text-sm ${isExpanded ? 'text-base' : ''}`} />
                 </div>
                 
                 {[true, false].map((val) => {
                   const label = val ? 'Đ' : 'S';
                   const isSelected = currentAns === val;
                   const isCorrectBtn = val === correctVal;
                   
                   let btnClass = "h-8 rounded font-bold text-sm border transition-all flex items-center justify-center";
                   
                   if (isChecked) {
                     if (isCorrectBtn) {
                        if (isSelected) {
                            btnClass = "bg-green-600 border-green-700 text-white shadow-md";
                        } else {
                            btnClass = "bg-white border-green-500 text-green-600 border-2 border-dashed";
                        }
                     } else if (isSelected) {
                        btnClass = "bg-red-500 border-red-600 text-white shadow-md opacity-50";
                     } else {
                        btnClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-30";
                     }
                   } else {
                     if (isSelected) btnClass = val ? "bg-blue-500 border-blue-600 text-white shadow-sm" : "bg-blue-500 border-blue-600 text-white shadow-sm";
                     else btnClass = "bg-white border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600";
                   }

                   return (
                     <button
                       key={String(val)}
                       disabled={isChecked}
                       onClick={() => {
                         const newAns = [...(userAnswer?.answer || [undefined, undefined, undefined, undefined])];
                         newAns[idx] = val;
                         onAnswerChange(newAns);
                       }}
                       className={btnClass}
                     >
                       {label}
                     </button>
                   )
                 })}
               </div>
             )
           })}
        </div>
      )}

      {q.type === 'short_answer' && (
         <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
           <label className="block text-sm font-bold text-slate-700 mb-2">Nhập đáp án:</label>
           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
             <input 
               type="text"
               disabled={isChecked}
               value={userAnswer?.answer || ''}
               onChange={(e) => onAnswerChange(e.target.value)}
               placeholder="Nhập đáp án (chỉ số)"
               className={`w-full max-w-sm px-4 py-3 border rounded-xl font-mono outline-none transition-all ${isExpanded ? 'text-xl' : 'text-lg'}
                ${isChecked 
                  ? (checkShortAnswer(userAnswer?.answer, (q as ShortAnswerQuestion).correctAnswer)
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800') 
                  : 'border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary'}`}
             />
             {isChecked && (
               <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-xl font-bold border border-green-200 text-sm">
                 <Check className="w-4 h-4" />
                 <span>Đáp án: {(q as ShortAnswerQuestion).correctAnswer}</span>
               </div>
             )}
           </div>
           {!isChecked && (
              <p className="text-xs text-slate-500 mt-2 italic">
                 Chỉ nhập kết quả là số. Nếu có nhiều đáp án, phân cách bằng dấu phẩy. Ví dụ: -1, 3.
              </p>
           )}
         </div>
      )}

      {isChecked && (
         <div className="mt-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <h5 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Lời giải chi tiết
                </h5>
                <div className={`text-slate-700 text-sm leading-relaxed ${isExpanded ? 'text-lg' : ''}`}>
                    <MathText content={q.explanation} />
                </div>
            </div>
         </div>
      )}
      
      {!isChecked && onCheck && (
         <div className="mt-6 pt-4 border-t border-slate-100">
           <button 
            onClick={onCheck}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors group bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg"
           >
             <CheckCircle className="w-5 h-5" />
             Kiểm tra đáp án ngay
           </button>
         </div>
      )}
    </div>
  );
};

const ReviewSession: React.FC<{
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  onUpdateAnswer: (qId: string, answer: UserAnswer) => void;
  onExit: () => void;
  onRetake: () => void;
  onSubmit: () => void;
  isExpanded?: boolean;
}> = ({ questions, userAnswers, onUpdateAnswer, onExit, onRetake, onSubmit, isExpanded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit();
    }
  };

  const updateAnswer = (val: any) => {
    const q = questions[currentIndex];
    onUpdateAnswer(q.id, {
        questionId: q.id,
        answer: val,
        isChecked: false
    });
  };

  const checkCurrentQuestion = () => {
     const q = questions[currentIndex];
     const existing = userAnswers[q.id] || { questionId: q.id, answer: undefined, isChecked: false };
     onUpdateAnswer(q.id, { ...existing, isChecked: true });
  };

  const currentQ = questions[currentIndex];
  const currentAns = userAnswers[currentQ.id];
  const isChecked = currentAns?.isChecked || false;
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className={`mx-auto pb-20 transition-all duration-300 ${isExpanded ? 'max-w-6xl' : 'max-w-3xl'}`}>
       <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm sticky top-4 z-20">
         <div className="flex justify-between items-center mb-2">
           <h2 className="font-bold text-slate-700">Ôn tập kiến thức</h2>
           <span className="text-sm font-mono text-slate-500">{currentIndex + 1} / {questions.length}</span>
         </div>
         <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div 
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
            ></div>
         </div>
       </div>

       <div className="animate-fade-in">
           <QuestionCard 
             question={currentQ}
             index={currentIndex + 1}
             userAnswer={currentAns}
             onAnswerChange={updateAnswer}
             showFeedback={isChecked}
             onCheck={checkCurrentQuestion}
             isExpanded={isExpanded}
           />
       </div>

       <div className="mt-6 flex justify-end gap-3">
         <button 
             onClick={onSubmit}
             className="px-6 py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
         >
             Kết thúc ôn tập
         </button>
         
         {isChecked && (
             <button 
               onClick={handleNext}
               className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
             >
               {currentIndex === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
               <ArrowRight className="w-5 h-5" />
             </button>
         )}
       </div>
    </div>
  );
}

const ExamSession: React.FC<{
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  onUpdateAnswer: (qId: string, answer: UserAnswer) => void;
  timeLeft: number;
  onSubmit: () => void;
  isExpanded?: boolean;
}> = ({ questions, userAnswers, onUpdateAnswer, timeLeft, onSubmit, isExpanded }) => {
  const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const part1Questions = questions.filter(q => q.type === 'multiple_choice');
  const part2Questions = questions.filter(q => q.type === 'true_false');
  const part3Questions = questions.filter(q => q.type === 'short_answer');

  useEffect(() => {
    if (part1Questions.length > 0) setActivePart(1);
    else if (part2Questions.length > 0) setActivePart(2);
    else if (part3Questions.length > 0) setActivePart(3);
  }, [questions.length]);

  const updateAnswer = (qId: string, value: any) => {
    onUpdateAnswer(qId, { questionId: qId, answer: value, isChecked: false });
  };

  const renderCurrentPart = () => {
    const list = activePart === 1 ? part1Questions : activePart === 2 ? part2Questions : part3Questions;
    
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
           <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
           <p>Không có câu hỏi nào cho phần này.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-fade-in">
        {list.map((q, index) => (
             <QuestionCard 
               key={q.id}
               question={q}
               index={questions.indexOf(q) + 1} 
               userAnswer={userAnswers[q.id]}
               onAnswerChange={(val) => updateAnswer(q.id, val)}
               showFeedback={false}
               isExpanded={isExpanded}
             />
        ))}
      </div>
    );
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = questions.length;

  return (
    <div className="pb-20 relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 font-mono text-xl font-bold px-3 py-1.5 rounded-lg border
             ${timeLeft < 300 ? 'text-red-500 border-red-200 bg-red-50 animate-pulse' : 'text-slate-700 border-slate-200 bg-slate-50'}`}>
             <Clock className="w-5 h-5" />
             {formatTime(timeLeft)}
           </div>
        </div>
        <button 
          onClick={() => setIsConfirming(true)}
          className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg transform hover:-translate-y-0.5 text-white bg-primary hover:bg-blue-700 shadow-blue-500/20"
        >
          Nộp bài
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      {isConfirming && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform scale-100 animate-in zoom-in-95">
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Xác nhận nộp bài?</h3>
                        <p className="text-slate-500 mt-1">
                            Bạn đã làm được <strong className="text-blue-600">{answeredCount}/{totalCount}</strong> câu hỏi.
                            {answeredCount < totalCount && (
                                <span className="block mt-1 text-red-500 font-medium">Lưu ý: Các câu chưa làm sẽ bị tính là sai (0 điểm).</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <button 
                        onClick={() => setIsConfirming(false)}
                        className="px-5 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Làm tiếp
                    </button>
                    <button 
                        onClick={() => {
                            setIsConfirming(false);
                            onSubmit();
                        }}
                        className="px-5 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                    >
                        Nộp bài ngay
                    </button>
                </div>
             </div>
          </div>
      )}

      {/* Navigation Tabs */}
      <div className="sticky top-[68px] z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 py-3 px-4">
        <div className={`mx-auto flex gap-2 overflow-x-auto scrollbar-hide transition-all duration-300 ${isExpanded ? 'max-w-7xl' : 'max-w-4xl'}`}>
          {[
            { id: 1, label: 'Phần I: Trắc nghiệm', count: part1Questions.length },
            { id: 2, label: 'Phần II: Đúng/Sai', count: part2Questions.length },
            { id: 3, label: 'Phần III: Trả lời ngắn', count: part3Questions.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePart(tab.id as any)}
              disabled={tab.count === 0}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all flex-shrink-0 flex items-center gap-2
                ${tab.count === 0 ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400' : ''}
                ${activePart === tab.id && tab.count > 0
                  ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                  : tab.count > 0 ? 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-700' : ''}`}
            >
              {tab.label}
              {tab.count > 0 && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={`mx-auto mt-6 px-4 transition-all duration-300 ${isExpanded ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {renderCurrentPart()}
      </div>
    </div>
  );
};

const ExamResult: React.FC<{
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  onRetake: () => void;
  onExit: () => void;
  mode: 'exam' | 'review';
  onSaveHistory?: (item: ExamHistoryItem) => void;
  isExpanded?: boolean;
}> = ({ questions, userAnswers, onRetake, onExit, mode, onSaveHistory, isExpanded }) => {
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const saveTriggeredRef = useRef(false);
  
  let scorePart1 = 0;
  let scorePart2 = 0;
  let scorePart3 = 0;
  let maxScorePart1 = 0;
  let maxScorePart2 = 0;
  let maxScorePart3 = 0;
  
  const incorrectQuestions: Question[] = [];

  const part1 = questions.filter(q => q.type === 'multiple_choice');
  const part2 = questions.filter(q => q.type === 'true_false');
  const part3 = questions.filter(q => q.type === 'short_answer');

  part1.forEach(q => {
    maxScorePart1 += 0.25;
    const qMC = q as MultipleChoiceQuestion;
    const isCorrect = userAnswers[q.id]?.answer === qMC.correctAnswer;
    if (isCorrect) scorePart1 += 0.25;
    else incorrectQuestions.push(q);
  });

  part2.forEach(q => {
    maxScorePart2 += 1.0;
    const qTF = q as TrueFalseQuestion;
    const userAnsArray = userAnswers[q.id]?.answer as boolean[] || [];
    let correctLines = 0;
    qTF.statements.forEach((stmt, idx) => {
      if (userAnsArray[idx] === stmt.isCorrect) correctLines++;
    });

    if (correctLines === 1) scorePart2 += 0.1;
    else if (correctLines === 2) scorePart2 += 0.25;
    else if (correctLines === 3) scorePart2 += 0.5;
    else if (correctLines === 4) scorePart2 += 1.0;

    if (correctLines < 4) incorrectQuestions.push(q);
  });

  part3.forEach(q => {
    maxScorePart3 += 0.5;
    const qSA = q as ShortAnswerQuestion;
    const isCorrect = checkShortAnswer(userAnswers[q.id]?.answer, qSA.correctAnswer);
    if (isCorrect) scorePart3 += 0.5;
    else incorrectQuestions.push(q);
  });

  const rawTotal = scorePart1 + scorePart2 + scorePart3;
  const maxTotal = maxScorePart1 + maxScorePart2 + maxScorePart3;
  const displayScore = mode === 'exam' ? Math.min(10, rawTotal).toFixed(2) : rawTotal.toFixed(2);
  const displayMax = mode === 'exam' ? 10 : maxTotal;

  // AI Feedback Generation
  useEffect(() => {
    if (mode === 'exam' && !aiFeedback && !loadingFeedback) {
      const generateAssessment = async () => {
        setLoadingFeedback(true);
        try {
           const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
           const incorrectSummary = incorrectQuestions.slice(0, 5).map(q => q.content).join(" || "); 
           
           const prompt = `
             Học sinh vừa hoàn thành bài kiểm tra Toán.
             Điểm số: ${displayScore}/${displayMax}.
             Số câu sai: ${incorrectQuestions.length}/${questions.length}.
             Nội dung một số câu làm sai: ${incorrectSummary}
             
             Hãy đưa ra một đoạn nhận xét ngắn gọn (khoảng 100 từ), giọng điệu khích lệ.
             Chỉ ra học sinh đang yếu phần nào dựa trên nội dung câu sai và đưa ra 2 lời khuyên cụ thể để ôn tập.
           `;

           const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: prompt
           });
           
           const feedbackText = response.text;
           setAiFeedback(feedbackText);
        } catch (e) {
          console.error(e);
          setAiFeedback("Không thể tải đánh giá chi tiết lúc này.");
        } finally {
          setLoadingFeedback(false);
        }
      };
      generateAssessment();
    }
  }, []);

  // Save history only once
  useEffect(() => {
     if (onSaveHistory && !saveTriggeredRef.current) {
         saveTriggeredRef.current = true;
         onSaveHistory({
             id: `exam-${Date.now()}`,
             date: new Date().toISOString(),
             mode,
             score: parseFloat(displayScore),
             maxScore: typeof displayMax === 'number' ? displayMax : parseFloat(displayMax),
             questions: questions,
             userAnswers: userAnswers,
             duration: 0, // Not tracking exact duration in this simple version yet
             feedback: null 
         });
     }
  }, []);

  return (
    <div className={`mx-auto py-12 px-4 text-center animate-fade-in transition-all duration-300 ${isExpanded ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-200 text-white animate-bounce-slow">
        <Award className="w-14 h-14" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Kết quả đánh giá</h2>
      <p className="text-slate-500 mb-8">Dưới đây là tổng kết bài làm của bạn.</p>
      
      <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-10 tracking-tighter">
        {displayScore}<span className="text-3xl text-slate-300 font-medium">/{displayMax}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">Phần I (Trắc nghiệm)</div>
          <div className="text-2xl font-bold text-slate-800">{scorePart1.toFixed(2)} đ</div>
          <div className="text-xs text-slate-400 mt-1">trên {maxScorePart1.toFixed(1)} điểm</div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100">
           <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">Phần II (Đúng/Sai)</div>
          <div className="text-2xl font-bold text-slate-800">{scorePart2.toFixed(2)} đ</div>
          <div className="text-xs text-slate-400 mt-1">trên {maxScorePart2.toFixed(1)} điểm</div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100">
           <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">Phần III (Trả lời ngắn)</div>
          <div className="text-2xl font-bold text-slate-800">{scorePart3.toFixed(2)} đ</div>
          <div className="text-xs text-slate-400 mt-1">trên {maxScorePart3.toFixed(1)} điểm</div>
        </div>
      </div>

      {mode === 'exam' && (
        <div className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 text-left relative overflow-hidden">
           <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-indigo-800">Góc tư vấn AI</h3>
           </div>
           {loadingFeedback ? (
             <div className="flex items-center gap-2 text-indigo-400">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span className="text-sm">Đang phân tích kết quả làm bài...</span>
             </div>
           ) : (
             <div className="prose prose-sm text-indigo-900 max-w-none">
               <MathText content={aiFeedback || "Chưa có đánh giá."} />
             </div>
           )}
        </div>
      )}

      {incorrectQuestions.length > 0 && (
         <div className="text-left mb-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              Chi tiết các câu chưa đạt điểm tối đa ({incorrectQuestions.length})
            </h3>
            <div className="space-y-6">
              {incorrectQuestions.map((q) => (
                <QuestionCard 
                  key={q.id}
                  question={q}
                  index={questions.indexOf(q) + 1}
                  userAnswer={userAnswers[q.id]}
                  onAnswerChange={() => {}}
                  showFeedback={true}
                  isExpanded={isExpanded}
                />
              ))}
            </div>
         </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <button onClick={onExit} className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors">
          Quay về bài học
        </button>
        <button onClick={onRetake} className={`px-8 py-3 rounded-xl text-white font-bold transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
            ${mode === 'review' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' : 'bg-primary hover:bg-blue-700 shadow-blue-500/30'}
        `}>
          <RefreshCw className="w-5 h-5" />
          {mode === 'review' ? "Làm lại bài khác" : "Thi đề mới"}
        </button>
      </div>
    </div>
  );
};

export default ExamSystem;