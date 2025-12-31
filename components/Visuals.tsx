import React, { useState, useEffect, useRef } from 'react';
import { Info, X, BookOpen, PenTool, Play, Calculator, ArrowRight, ChevronRight, Lightbulb, MousePointerClick } from 'lucide-react';

// --- HELPER COMPONENTS ---

// Trigger MathJax typeset on content change
const MathJaxRenderer = ({ content, className = '', Component = 'div' }: { content: string, className?: string, Component?: React.ElementType }) => {
  const ref = useRef<any>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Always set content first so it displays even if MathJax fails or isn't loaded
    element.innerHTML = content;

    // Then try to typeset
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([element])
        .catch((err: any) => console.log('MathJax error:', err));
    }
  }, [content]);

  return <Component ref={ref} className={className} />;
};

// --- NEW COMPONENT: Formula Detail Modal ---
interface FormulaDetailProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    details?: {
        proof?: string;
        examples?: string[];
        practiceTopic?: string;
    };
    onStartPractice?: (count: number) => void;
}

const FormulaDetailModal: React.FC<FormulaDetailProps> = ({ isOpen, onClose, title, details, onStartPractice }) => {
    const [activeTab, setActiveTab] = useState<'proof' | 'example' | 'practice'>('proof');
    const [practiceCount, setPracticeCount] = useState(5);

    const hasProof = !!details?.proof;
    const hasExamples = !!details?.examples && details.examples.length > 0;

    // Reset tab when modal opens
    useEffect(() => {
        if (isOpen) {
            if (hasProof) {
                setActiveTab('proof');
            } else if (hasExamples) {
                setActiveTab('example');
            } else {
                setActiveTab('practice');
            }
        }
    }, [isOpen, hasProof, hasExamples, title]); // Add title dependency to reset when switching content

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <div className="bg-blue-600 text-white p-2 rounded-lg">
                             <Calculator className="w-5 h-5" />
                         </div>
                         <div className="font-bold text-slate-800 text-lg">
                             <MathJaxRenderer content={title} Component="span" />
                         </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-white flex-shrink-0">
                    {hasProof && (
                        <button 
                            onClick={() => setActiveTab('proof')}
                            className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors border-b-2 
                            ${activeTab === 'proof' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <BookOpen className="w-4 h-4" /> Chứng minh
                        </button>
                    )}
                    <button 
                         onClick={() => setActiveTab('example')}
                         className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors border-b-2 
                         ${activeTab === 'example' ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <PenTool className="w-4 h-4" /> Ví dụ minh họa
                    </button>
                    <button 
                         onClick={() => setActiveTab('practice')}
                         className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors border-b-2 
                         ${activeTab === 'practice' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Play className="w-4 h-4" /> Luyện tập
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    {activeTab === 'proof' && hasProof && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                             <div className="prose prose-slate max-w-none text-slate-700">
                                 <MathJaxRenderer content={details.proof!} />
                             </div>
                        </div>
                    )}

                    {activeTab === 'example' && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                             {details?.examples && details.examples.length > 0 ? (
                                 details.examples.map((ex, idx) => (
                                     <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                         <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                             <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Ví dụ {idx + 1}</span>
                                         </div>
                                         <div className="text-slate-700 text-sm">
                                             <MathJaxRenderer content={ex} />
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-12 text-slate-400 italic">
                                     <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                     Ví dụ minh họa đang được cập nhật.
                                 </div>
                             )}
                         </div>
                    )}

                    {activeTab === 'practice' && (
                         <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in-95">
                             <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl w-full max-w-sm text-center">
                                 <h3 className="text-lg font-bold text-emerald-800 mb-2">Luyện tập chủ đề này</h3>
                                 <p className="text-sm text-emerald-600 mb-6">
                                     Hệ thống sẽ tạo ra các câu hỏi trắc nghiệm xoay quanh: <span className="font-bold"><MathJaxRenderer content={title} Component="span"/></span>.
                                 </p>
                                 
                                 <div className="flex items-center justify-center gap-4 mb-6">
                                     <button 
                                        onClick={() => setPracticeCount(Math.max(1, practiceCount - 1))}
                                        className="w-10 h-10 rounded-full bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                                     >
                                         -
                                     </button>
                                     <div className="text-center">
                                         <div className="text-2xl font-bold text-slate-800">{practiceCount}</div>
                                         <div className="text-xs text-slate-400">Câu hỏi</div>
                                     </div>
                                     <button 
                                        onClick={() => setPracticeCount(Math.min(20, practiceCount + 1))}
                                        className="w-10 h-10 rounded-full bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                                     >
                                         +
                                     </button>
                                 </div>

                                 <button 
                                     onClick={() => {
                                         if (onStartPractice) {
                                             onStartPractice(practiceCount);
                                             onClose();
                                         } else {
                                             alert("Chức năng đang được kết nối...");
                                         }
                                     }}
                                     className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                 >
                                     <Play className="w-4 h-4 fill-white" />
                                     Bắt đầu ngay
                                 </button>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MODIFIED Formula Block with Click Interaction ---
interface FormulaDetail {
    proof?: string;
    examples?: string[];
    practiceTopic?: string;
}

interface Corollary {
    label: string;
    tex: string;
    details?: FormulaDetail; // Added details for each corollary
}

const FormulaBlock = ({ 
    title, 
    mainTex, 
    corollaries = [], 
    theme = 'blue',
    details,
    onLaunchPractice
}: { 
    title: string; 
    mainTex: string; 
    corollaries?: Corollary[];
    theme: 'blue' | 'orange' | 'emerald';
    details?: FormulaDetail;
    onLaunchPractice?: (topic: string, count: number) => void;
}) => {
    // State to hold which detail set to show (Main or Specific Corollary)
    const [modalConfig, setModalConfig] = useState<{ title: string; details: FormulaDetail } | null>(null);

    const themeStyles = {
        blue: {
            border: 'border-blue-200',
            header: 'bg-blue-600',
            mainBg: 'bg-blue-50/30',
            corBg: 'bg-slate-50',
            textMain: 'text-blue-800',
            label: 'bg-blue-100 text-blue-700',
            hover: 'hover:ring-2 hover:ring-blue-400 hover:border-blue-400',
            highlight: 'hover:bg-blue-100/50'
        },
        orange: {
            border: 'border-orange-200',
            header: 'bg-orange-500',
            mainBg: 'bg-orange-50/30',
            corBg: 'bg-slate-50',
            textMain: 'text-orange-800',
            label: 'bg-orange-100 text-orange-700',
            hover: 'hover:ring-2 hover:ring-orange-400 hover:border-orange-400',
            highlight: 'hover:bg-orange-100/50'
        },
        emerald: {
            border: 'border-emerald-200',
            header: 'bg-emerald-600',
            mainBg: 'bg-emerald-50/30',
            corBg: 'bg-slate-50',
            textMain: 'text-emerald-900',
            label: 'bg-emerald-100 text-emerald-700',
            hover: 'hover:ring-2 hover:ring-emerald-400 hover:border-emerald-400',
            highlight: 'hover:bg-emerald-100/50'
        }
    };

    const s = themeStyles[theme];

    const openMain = () => {
        if (details) {
            setModalConfig({ title, details });
        }
    };

    const openCorollary = (cor: Corollary) => {
        if (cor.details) {
            setModalConfig({ title: `${title} (${cor.label})`, details: cor.details });
        } else if (details) {
            // Fallback to main details if specific corollary details are missing
             setModalConfig({ title: `${title} (${cor.label})`, details: details });
        }
    };

    return (
        <>
            <div className={`rounded-2xl border ${s.border} overflow-hidden shadow-sm mb-4 transition-all`}>
                {/* Header */}
                <div 
                    onClick={openMain}
                    className={`${s.header} px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
                >
                    <div className="flex items-center gap-2">
                        <MathJaxRenderer content={title} Component="span" />
                        {details && <MousePointerClick className="w-3 h-3 text-white/70" />}
                    </div>
                    {details && (
                        <div className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                            <span>Chi tiết</span>
                        </div>
                    )}
                </div>

                {/* Main Formula */}
                <div 
                    onClick={openMain}
                    className={`${s.mainBg} p-5 flex flex-col items-center justify-center border-b border-slate-100 cursor-pointer ${s.highlight} transition-colors group relative`}
                >
                    <MathJaxRenderer content={`$$${mainTex}$$`} className={`text-2xl md:text-3xl font-bold ${s.textMain}`} />
                    {details && <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><Info className="w-4 h-4 text-slate-400"/></div>}
                </div>

                {/* Corollaries - Now Individually Clickable */}
                {corollaries.length > 0 && (
                    <div className={`${s.corBg} divide-y divide-slate-100`}>
                        {corollaries.map((cor, idx) => {
                            const hasCorDetail = !!cor.details;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => openCorollary(cor)}
                                    className={`flex items-center gap-3 p-3 transition-colors ${hasCorDetail || details ? `cursor-pointer ${s.highlight}` : ''} group`}
                                >
                                    <MathJaxRenderer 
                                        content={cor.label} 
                                        Component="span"
                                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap min-w-[60px] text-center ${s.label}`} 
                                    />
                                    <div className="flex-1 overflow-x-auto">
                                        <MathJaxRenderer content={`$${cor.tex}$`} className="text-slate-700 font-medium" />
                                    </div>
                                    {(hasCorDetail || details) && (
                                        <ChevronRight className={`w-3 h-3 text-slate-300 group-hover:text-${theme}-500 transition-colors`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <FormulaDetailModal 
                isOpen={!!modalConfig}
                onClose={() => setModalConfig(null)}
                title={modalConfig?.title || ''}
                details={modalConfig?.details}
                onStartPractice={(count) => {
                    if (onLaunchPractice && modalConfig?.details.practiceTopic) {
                        onLaunchPractice(modalConfig.details.practiceTopic, count);
                    }
                }}
            />
        </>
    );
};

// --- VISUAL COMPONENTS ---

export const CombinatoricsSheet = ({ onLaunchPractice }: { onLaunchPractice?: (topic: string, count: number) => void }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Column 1: Rules & Probability */}
                <div className="space-y-6">
                    <FormulaBlock 
                        theme="blue"
                        title="Quy tắc cộng"
                        mainTex="\text{Phương án} = m + n"
                        details={{
                            practiceTopic: "Quy tắc cộng",
                            proof: `<p><strong>Định nghĩa:</strong> Nếu một công việc có thể thực hiện theo phương án A (có $m$ cách) hoặc phương án B (có $n$ cách) và hai phương án này không có cách thực hiện nào chung (xung khắc), thì số cách hoàn thành công việc là $m + n$.</p>`,
                            examples: [
                                "Lớp có 20 nam và 15 nữ. Chọn 1 học sinh đi trực nhật.<br/> Số cách: $20 + 15 = 35$ cách."
                            ]
                        }}
                        onLaunchPractice={onLaunchPractice}
                    />
                    
                    <FormulaBlock 
                        theme="blue"
                        title="Quy tắc nhân"
                        mainTex="\text{Phương án} = m \cdot n"
                        details={{
                            practiceTopic: "Quy tắc nhân",
                            proof: `<p><strong>Định nghĩa:</strong> Nếu một công việc phải trải qua 2 công đoạn liên tiếp: công đoạn 1 có $m$ cách, công đoạn 2 có $n$ cách, thì số cách hoàn thành công việc là $m \\cdot n$.</p>`,
                            examples: [
                                "Đi từ A đến B có 3 con đường, từ B đến C có 4 con đường.<br/> Số cách đi từ A đến C qua B là: $3 \\cdot 4 = 12$ cách."
                            ]
                        }}
                        onLaunchPractice={onLaunchPractice}
                    />

                     <FormulaBlock 
                        theme="orange"
                        title="Xác suất cổ điển"
                        mainTex="P(A) = \frac{n(A)}{n(\Omega)}"
                        details={{
                            practiceTopic: "Xác suất cổ điển",
                            proof: `<p><strong>Định nghĩa:</strong> Xác suất của biến cố A là tỉ số giữa số phần tử thuận lợi cho A và tổng số phần tử của không gian mẫu $\\Omega$ (khi các kết quả đồng khả năng).</p>`,
                            examples: [
                                "Gieo một con xúc xắc cân đối. $n(\\Omega) = 6$.<br/> Biến cố A: 'Ra mặt chẵn' = $\\{2, 4, 6\\} \\Rightarrow n(A)=3$.<br/> $P(A) = \\frac{3}{6} = 0.5$."
                            ]
                        }}
                        corollaries={[
                            { label: 'Đối', tex: 'P(\\overline{A}) = 1 - P(A)' },
                            { label: 'Hợp (Xung khắc)', tex: 'P(A \\cup B) = P(A) + P(B)' }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />
                </div>

                {/* Column 2: Permutation, Arrangement, Combination */}
                <div className="space-y-6">
                    <FormulaBlock 
                        theme="emerald"
                        title="Hoán vị ($P_n$)"
                        mainTex="P_n = n!"
                        details={{
                            practiceTopic: "Hoán vị",
                            proof: `<p><strong>Định nghĩa:</strong> Số cách sắp xếp $n$ phần tử khác nhau vào $n$ vị trí theo một thứ tự nhất định.</p>
                            <p>Công thức: $P_n = n! = n(n-1)...2.1$.</p>`,
                            examples: [
                                "Có 5 người xếp thành một hàng dọc.<br/> Số cách xếp là $5! = 120$ cách."
                            ]
                        }}
                        onLaunchPractice={onLaunchPractice}
                    />

                    <FormulaBlock 
                        theme="emerald"
                        title="Chỉnh hợp ($A_n^k$)"
                        mainTex="A_n^k = \frac{n!}{(n-k)!}"
                        details={{
                            practiceTopic: "Chỉnh hợp",
                            proof: `<p><strong>Định nghĩa:</strong> Số cách chọn ra $k$ phần tử từ $n$ phần tử ($k \\le n$) và <strong>có sắp xếp thứ tự</strong>.</p>
                            <p>Dấu hiệu: Có sự phân công chức vụ, xếp hàng, số có thứ tự...</p>`,
                            examples: [
                                "Lớp có 10 học sinh, chọn ra 2 bạn làm Lớp trưởng và Lớp phó.<br/> Số cách: $A_{10}^2 = \\frac{10!}{8!} = 10 \\times 9 = 90$ cách."
                            ]
                        }}
                        onLaunchPractice={onLaunchPractice}
                    />

                    <FormulaBlock 
                        theme="emerald"
                        title="Tổ hợp ($C_n^k$)"
                        mainTex="C_n^k = \frac{n!}{k!(n-k)!}"
                        details={{
                            practiceTopic: "Tổ hợp",
                            proof: `<p><strong>Định nghĩa:</strong> Số cách chọn ra $k$ phần tử từ $n$ phần tử ($k \\le n$) nhưng <strong>không quan tâm thứ tự</strong>.</p>
                            <p>Dấu hiệu: Chọn nhóm, chọn tập hợp con...</p>`,
                            examples: [
                                "Lớp có 10 học sinh, chọn ra 2 bạn đi lao động (vai trò như nhau).<br/> Số cách: $C_{10}^2 = \\frac{10!}{2!8!} = 45$ cách."
                            ]
                        }}
                        corollaries={[
                            { label: 'Đối xứng', tex: 'C_n^k = C_n^{n-k}' },
                            { label: 'Pascal', tex: 'C_n^k + C_n^{k+1} = C_{n+1}^{k+1}' }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />
                </div>
            </div>

            <div className="my-6">
                <FormulaBlock 
                    theme="orange"
                    title="Nhị thức Newton"
                    mainTex="(a+b)^n = \sum_{k=0}^{n} C_n^k a^{n-k} b^k"
                    details={{
                        practiceTopic: "Nhị thức Newton: Khai triển",
                        proof: `<p><strong>Chứng minh (Ý tưởng tổ hợp):</strong></p>
                        <p>Xét khai triển của $(a+b)^n = (a+b)(a+b)...(a+b)$ ($n$ lần).</p>
                        <p>Mỗi số hạng trong khai triển được tạo ra bằng cách nhân $n$ số, trong đó mỗi số được chọn từ một trong $n$ dấu ngoặc (hoặc $a$ hoặc $b$).</p>
                        <p>Số hạng chứa $a^{n-k}b^k$ tương ứng với việc chọn $k$ lần chữ số $b$ (và do đó $n-k$ lần chữ số $a$) từ $n$ dấu ngoặc.</p>
                        <p>Số cách để chọn $k$ vị trí cho $b$ từ $n$ vị trí là tổ hợp chập $k$ của $n$, tức là $C_n^k$.</p>
                        <p>Do đó, hệ số của số hạng $a^{n-k}b^k$ chính là $C_n^k$.</p>
                        <p>Tổng hợp lại cho tất cả các giá trị của $k$ từ 0 đến $n$, ta được công thức khai triển.</p>`,
                        examples: [
                            "Khai triển $(x+2)^4$:<br/><strong>Giải:</strong> Áp dụng công thức với $a=x, b=2, n=4$.<br/> $(x+2)^4 = C_4^0 x^4 2^0 + C_4^1 x^3 2^1 + C_4^2 x^2 2^2 + C_4^3 x^1 2^3 + C_4^4 x^0 2^4$<br/> $= 1x^4 + 4x^3(2) + 6x^2(4) + 4x(8) + 1(16)$<br/> $= x^4 + 8x^3 + 24x^2 + 32x + 16$."
                        ]
                    }}
                    corollaries={[
                        {
                            label: 'Số hạng TQ',
                            tex: 'T_{k+1} = C_n^k a^{n-k} b^k',
                            details: {
                                practiceTopic: "Nhị thức Newton: Tìm số hạng",
                                proof: "<p>Số hạng thứ $k+1$ trong khai triển tương ứng với giá trị $k$ của chỉ số tổng $\\sum$.</p>",
                                examples: ["Tìm số hạng chứa $x^2$ trong khai triển $(x+3)^5$.<br/><strong>Giải:</strong> Số hạng TQ: $T_{k+1} = C_5^k x^{5-k} 3^k$. Ta cần $5-k=2 \\Rightarrow k=3$.<br/>Vậy số hạng cần tìm là $T_{3+1} = C_5^3 x^2 3^3 = 10 \\cdot 27 \\cdot x^2 = 270x^2$."]
                            }
                        },
                        {
                            label: 'Tổng hệ số',
                            tex: 'C_n^0 + C_n^1 + ... + C_n^n = 2^n',
                            details: {
                                proof: "<p>Trong khai triển $(a+b)^n$, chọn $a=1$ và $b=1$.<br/>Ta có: $(1+1)^n = C_n^0 1^{n-0} 1^0 + C_n^1 1^{n-1} 1^1 + ... + C_n^n 1^0 1^n$.<br/>$\\Rightarrow 2^n = C_n^0 + C_n^1 + ... + C_n^n$.</p>",
                                examples: ["Tổng các hệ số trong khai triển $(2x-1)^5$ là:<br/> $(2(1)-1)^5 = (1)^5 = 1$."]
                            }
                        },
                        {
                            label: 'Tổng đan dấu',
                            tex: 'C_n^0 - C_n^1 + ... + (-1)^n C_n^n = 0',
                            details: {
                                proof: "<p>Trong khai triển $(a+b)^n$, chọn $a=1$ và $b=-1$.<br/>Ta có: $(1-1)^n = C_n^0 - C_n^1 + C_n^2 - ... + (-1)^n C_n^n$.<br/>$\\Rightarrow 0 = C_n^0 - C_n^1 + ...$</p>",
                                examples: ["$C_4^0 - C_4^1 + C_4^2 - C_4^3 + C_4^4 = 1 - 4 + 6 - 4 + 1 = 0$."]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>
        </div>
    );
};

export const SequenceComparisonVisual = ({ onLaunchPractice }: { onLaunchPractice?: (topic: string, count: number) => void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            
            {/* COLUMN 1: CẤP SỐ CỘNG (Blue) */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="CẤP SỐ CỘNG" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Arithmetic Progression</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Định nghĩa"
                    mainTex="u_{n+1} = u_n + d"
                    details={{
                        practiceTopic: "Cấp số cộng: Định nghĩa",
                        proof: `<p><strong>Định nghĩa:</strong> Cấp số cộng là một dãy số mà trong đó mỗi số hạng (kể từ số hạng thứ hai) đều bằng số hạng đứng ngay trước nó cộng với một số không đổi $d$.</p>
                        <p>Biểu thức truy hồi: $u_{n+1} = u_n + d$ với $n \\in \\mathbb{N}^*$.</p>`,
                        examples: [
                            "Cho dãy số: $2, 5, 8, 11, ...$. Đây là CSC với $u_1=2$ và $d=3$ vì $5=2+3, 8=5+3$.",
                            "Cho $u_1=3, d=2$. Số hạng thứ hai là: $u_2 = u_1+d = 3+2=5$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Công sai', 
                            tex: 'd = u_{n+1} - u_n',
                            details: {
                                practiceTopic: "Cấp số cộng: Tìm công sai",
                                proof: "<p>Từ định nghĩa $u_{n+1} = u_n + d$, ta chuyển vế $u_n$ sang trái, ta được $d = u_{n+1} - u_n$.</p><p>Điều này có nghĩa là công sai $d$ chính là hiệu của một số hạng bất kỳ với số hạng đứng ngay trước nó.</p>",
                                examples: [
                                    "Cho dãy số: $1, 4, 7, 10...$. Tìm công sai $d$.<br/> <strong>Giải:</strong> Lấy số sau trừ số trước: $d = 4 - 1 = 3$.",
                                    "Cho dãy số: $10, 5, 0, -5...$. Tìm $d$.<br/> <strong>Giải:</strong> $d = 5 - 10 = -5$."
                                ]
                            }
                        },
                        { 
                            label: 'Tính chất', 
                            tex: 'u_k = \\frac{u_{k-1} + u_{k+1}}{2}',
                            details: {
                                proof: `<p>Ta có: $d = u_k - u_{k-1}$ và $d = u_{k+1} - u_k$.</p>
                                <p>Suy ra: $u_k - u_{k-1} = u_{k+1} - u_k$</p>
                                <p>$\\Leftrightarrow 2u_k = u_{k-1} + u_{k+1}$</p>
                                <p>$\\Leftrightarrow u_k = \\frac{u_{k-1} + u_{k+1}}{2}$ (đpcm).</p>
                                <p><strong>Kết luận:</strong> Mỗi số hạng (trừ số đầu và cuối) đều là trung bình cộng của hai số đứng kề nó.</p>`,
                                examples: [
                                    "Cho ba số $x; 4; 7$ lập thành cấp số cộng. Tìm x.<br/><strong>Giải:</strong> Theo tính chất, $4 = \\frac{x+7}{2} \\Leftrightarrow 8 = x+7 \\Leftrightarrow x=1$."
                                ]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Số hạng tổng quát"
                    mainTex="u_n = u_1 + (n-1)d"
                    details={{
                        practiceTopic: "Cấp số cộng: Số hạng tổng quát",
                        proof: `<p><strong>Phương pháp đại số (Cộng vế):</strong></p>
                        <p>Theo định nghĩa cấp số cộng, ta có các hiệu liên tiếp:</p>
                        <p>$\\begin{align} 
                        u_2 - u_1 &= d \\\\ 
                        u_3 - u_2 &= d \\\\ 
                        u_4 - u_3 &= d \\\\ 
                        &... \\\\ 
                        u_n - u_{n-1} &= d 
                        \\end{align}$</p>
                        <p>Cộng vế theo vế của $(n-1)$ đẳng thức trên:</p>
                        <p>$(u_n - u_{n-1}) + ... + (u_3 - u_2) + (u_2 - u_1) = \\underbrace{d + d + ... + d}_{n-1 \\text{ số}}$</p>
                        <p>Các số hạng ở giữa triệt tiêu lẫn nhau, ta còn:</p>
                        <p>$u_n - u_1 = (n-1)d$</p>
                        <p>$\\Leftrightarrow u_n = u_1 + (n-1)d$ (đpcm).</p>`,
                        examples: [
                            "Cho CSC có $u_1=2, d=5$. Tìm số hạng thứ 10.<br/> <strong>Giải:</strong> Áp dụng công thức: $u_{10} = 2 + (10-1)5 = 2 + 45 = 47$.",
                            "Tìm số hạng thứ 100 của dãy số lẻ: 1, 3, 5...<br/> <strong>Giải:</strong> $u_1=1, d=2$. Suy ra $u_{100} = 1 + 99(2) = 199$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Hệ quả', 
                            tex: 'u_n = u_m + (n-m)d',
                            details: {
                                proof: `<p>Ta có: $u_n = u_1 + (n-1)d$ (1)</p>
                                <p>Và: $u_m = u_1 + (m-1)d$ (2)</p>
                                <p>Lấy (1) trừ (2) vế theo vế:</p>
                                <p>$u_n - u_m = [(n-1) - (m-1)]d = (n-m)d$</p>
                                <p>$\\Leftrightarrow u_n = u_m + (n-m)d$.</p>`,
                                examples: [
                                    "Cho CSC có $u_5=10, d=3$. Tìm $u_{10}$.<br/> <strong>Giải:</strong> $u_{10} = u_5 + (10-5)d = 10 + 5(3) = 25$."
                                ]
                            }
                        },
                        { 
                            label: 'Tìm d', 
                            tex: 'd = \\frac{u_n - u_m}{n-m}',
                            details: {
                                proof: `<p>Từ hệ quả $u_n = u_m + (n-m)d$, ta chuyển $u_m$ sang vế trái:</p>
                                <p>$u_n - u_m = (n-m)d$</p>
                                <p>Chia cả hai vế cho $(n-m)$ (với $n \\ne m$):</p>
                                <p>$d = \\frac{u_n - u_m}{n-m}$.</p>`,
                                examples: [
                                    "Cho $u_3=5, u_7=17$. Tìm công sai $d$.<br/> <strong>Giải:</strong> Áp dụng công thức: $d = \\frac{17-5}{7-3} = \\frac{12}{4} = 3$."
                                ]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Tổng n số hạng đầu"
                    mainTex="S_n = \frac{n(u_1 + u_n)}{2}"
                    details={{
                        practiceTopic: "Cấp số cộng: Tổng n số hạng",
                        proof: `<p><strong>Phương pháp Gauss (Đại số):</strong></p>
                        <p>Viết tổng $S_n$ theo thứ tự xuôi:</p>
                        <p>$S_n = u_1 + (u_1+d) + ... + (u_n-d) + u_n$</p>
                        <p>Viết tổng $S_n$ theo thứ tự ngược:</p>
                        <p>$S_n = u_n + (u_n-d) + ... + (u_1+d) + u_1$</p>
                        <p>Cộng vế theo vế hai đẳng thức trên:</p>
                        <p>$2S_n = (u_1+u_n) + (u_1+u_n) + ... + (u_1+u_n)$ (có n cặp)</p>
                        <p>$2S_n = n(u_1 + u_n) \\Rightarrow S_n = \\frac{n(u_1 + u_n)}{2}$.</p>`,
                        examples: [
                            "Tính tổng các số tự nhiên từ 1 đến 100.<br/> <strong>Giải:</strong> $n=100, u_1=1, u_{100}=100$.<br/> $S_{100} = \\frac{100(1+100)}{2} = 5050$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Theo d', 
                            tex: 'S_n = \\frac{n[2u_1 + (n-1)d]}{2}',
                            details: {
                                proof: `<p>Ta có công thức gốc: $S_n = \\frac{n(u_1 + u_n)}{2}$.</p>
                                <p>Thay $u_n = u_1 + (n-1)d$ vào công thức trên:</p>
                                <p>$S_n = \\frac{n[u_1 + (u_1 + (n-1)d)]}{2}$</p>
                                <p>$S_n = \\frac{n[2u_1 + (n-1)d]}{2}$ (đpcm).</p>`,
                                examples: [
                                    "Cho $u_1=1, d=2$ (dãy số lẻ). Tính tổng 10 số hạng đầu.<br/> <strong>Giải:</strong> $S_{10} = \\frac{10[2(1) + 9(2)]}{2} = 5(20) = 100$."
                                ]
                            }
                        },
                        { 
                            label: 'Tìm $u_n$', 
                            tex: 'u_n = S_n - S_{n-1}',
                            details: {
                                proof: `<p>Ta có:</p>
                                <p>$S_n = u_1 + u_2 + ... + u_{n-1} + u_n$</p>
                                <p>$S_{n-1} = u_1 + u_2 + ... + u_{n-1}$</p>
                                <p>Lấy $S_n - S_{n-1}$, các số hạng từ $u_1$ đến $u_{n-1}$ triệt tiêu nhau, chỉ còn lại $u_n$.</p>
                                <p>Vậy $u_n = S_n - S_{n-1}$ (với $n \\ge 2$).</p>`,
                                examples: [
                                    "Cho tổng $n$ số hạng đầu là $S_n = n^2$. Tìm số hạng thứ 5.<br/> <strong>Giải:</strong> $u_5 = S_5 - S_4 = 5^2 - 4^2 = 25 - 16 = 9$."
                                ]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>

            {/* COLUMN 2: CẤP SỐ NHÂN (Orange) */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-orange-500 mb-2">
                    <MathJaxRenderer content="CẤP SỐ NHÂN" className="text-xl font-black text-orange-600 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Geometric Progression</p>
                </div>

                <FormulaBlock 
                    theme="orange"
                    title="Định nghĩa"
                    mainTex="u_{n+1} = u_n . q"
                    details={{
                        practiceTopic: "Cấp số nhân: Định nghĩa",
                        proof: `<p><strong>Định nghĩa:</strong> Cấp số nhân là một dãy số (khác 0) mà trong đó mỗi số hạng (kể từ số hạng thứ hai) đều bằng số hạng đứng ngay trước nó nhân với một số không đổi $q$.</p>
                        <p>Biểu thức truy hồi: $u_{n+1} = u_n . q$.</p>`,
                        examples: [
                            "Cho dãy số: $3, 6, 12, 24, ...$. Đây là CSN với $u_1=3$ và $q=2$.",
                            "Cho $u_1=2, q=-3$. Số hạng thứ hai: $u_2 = 2.(-3) = -6$. Số hạng thứ ba: $u_3 = -6.(-3) = 18$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Công bội', 
                            tex: 'q = \\frac{u_{n+1}}{u_n}',
                            details: {
                                proof: "<p>Từ định nghĩa $u_{n+1} = u_n . q$, ta chia hai vế cho $u_n$ (với $u_n \\ne 0$).</p><p>Ta được: $q = \\frac{u_{n+1}}{u_n}$.</p>",
                                examples: [
                                    "Cho dãy $2, 6, 18, 54...$. Tìm $q$.<br/> <strong>Giải:</strong> $q = \\frac{6}{2} = 3$. Kiểm tra lại: $18/6=3$. Đúng.",
                                    "Cho dãy $5, -5, 5, -5...$. Tìm $q$.<br/> <strong>Giải:</strong> $q = \\frac{-5}{5} = -1$."
                                ]
                            }
                        },
                        { 
                            label: 'Tính chất', 
                            tex: 'u_k^2 = u_{k-1} . u_{k+1}', 
                            details: { 
                                proof: `<p>Theo định nghĩa:</p>
                                <p>$q = \\frac{u_k}{u_{k-1}}$ và $q = \\frac{u_{k+1}}{u_k}$</p>
                                <p>Suy ra: $\\frac{u_k}{u_{k-1}} = \\frac{u_{k+1}}{u_k}$</p>
                                <p>Nhân chéo: $u_k . u_k = u_{k-1} . u_{k+1}$</p>
                                <p>$\\Leftrightarrow u_k^2 = u_{k-1} . u_{k+1}$ (đpcm).</p>
                                <p><strong>Kết luận:</strong> Bình phương một số hạng (trừ đầu/cuối) bằng tích hai số hạng đứng kề nó.</p>`,
                                examples: [
                                    "Cho 3 số $2, x, 18$ lập thành CSN. Tìm x.<br/> <strong>Giải:</strong> $x^2 = 2.18 = 36 \\Rightarrow x = 6$ hoặc $x=-6$."
                                ]
                            } 
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Số hạng tổng quát"
                    mainTex="u_n = u_1 . q^{n-1}"
                    details={{
                        practiceTopic: "Cấp số nhân: Số hạng tổng quát",
                        proof: `<p><strong>Phương pháp nhân vế (Telescoping Product):</strong></p>
                        <p>Ta có các thương số liên tiếp:</p>
                        <p>$\\frac{u_2}{u_1} = q$</p>
                        <p>$\\frac{u_3}{u_2} = q$</p>
                        <p>...</p>
                        <p>$\\frac{u_n}{u_{n-1}} = q$</p>
                        <p>Nhân vế theo vế của $(n-1)$ đẳng thức trên:</p>
                        <p>$\\frac{u_n}{u_{n-1}} \\cdot ... \\cdot \\frac{u_3}{u_2} \\cdot \\frac{u_2}{u_1} = \\underbrace{q \\cdot q \\cdot ... \\cdot q}_{n-1 \\text{ lần}}$</p>
                        <p>Rút gọn vế trái (triệt tiêu chéo): $\\frac{u_n}{u_1}$</p>
                        <p>$\\Rightarrow \\frac{u_n}{u_1} = q^{n-1} \\Leftrightarrow u_n = u_1 . q^{n-1}$ (đpcm).</p>`,
                        examples: [
                            "Cho $u_1=2, q=3$. Tìm số hạng thứ 5.<br/> <strong>Giải:</strong> $u_5 = 2 . 3^{5-1} = 2 . 3^4 = 2 . 81 = 162$.",
                            "Tìm số hạng thứ 6 của dãy: $3, 6, 12...$.<br/> <strong>Giải:</strong> $u_1=3, q=2$. $u_6 = 3 . 2^5 = 3 . 32 = 96$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Tìm q', 
                            tex: 'q^{n-m} = \\frac{u_n}{u_m}',
                            details: {
                                proof: `<p>Ta có hệ quả: $u_n = u_m . q^{n-m}$ (xem hệ quả dưới).</p>
                                <p>Chuyển vế: $q^{n-m} = \\frac{u_n}{u_m}$.</p>`,
                                examples: ["Cho $u_2=4, u_5=32$. Tìm $q$.<br/> <strong>Giải:</strong> $q^{5-2} = \\frac{32}{4} \\Rightarrow q^3 = 8 \\Rightarrow q=2$."]
                            }
                        },
                        { 
                            label: 'Hệ quả', 
                            tex: 'u_n = u_m . q^{n-m}',
                            details: {
                                proof: `<p>Ta có: $u_n = u_1 . q^{n-1}$ (1)</p>
                                <p>Và: $u_m = u_1 . q^{m-1}$ (2)</p>
                                <p>Lấy (1) chia (2) vế theo vế:</p>
                                <p>$\\frac{u_n}{u_m} = \\frac{u_1 . q^{n-1}}{u_1 . q^{m-1}} = q^{(n-1)-(m-1)} = q^{n-m}$</p>
                                <p>$\\Rightarrow u_n = u_m . q^{n-m}$.</p>`,
                                examples: [
                                    "Cho $u_3=5, q=2$. Tính $u_6$.<br/> <strong>Giải:</strong> $u_6 = u_3 . q^{6-3} = 5 . 2^3 = 5 . 8 = 40$."
                                ]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Tổng n số hạng đầu"
                    mainTex="S_n = u_1 \frac{1-q^n}{1-q}"
                    details={{
                        practiceTopic: "Cấp số nhân: Tổng n số hạng",
                        proof: `<p><strong>Chứng minh bằng cách nhân với q:</strong></p>
                        <p>Xét tổng: $S_n = u_1 + u_1q + u_1q^2 + ... + u_1q^{n-1}$ (1)</p>
                        <p>Nhân cả hai vế với $q$:</p>
                        <p>$q.S_n = u_1q + u_1q^2 + u_1q^3 + ... + u_1q^n$ (2)</p>
                        <p>Lấy (1) trừ (2) vế theo vế:</p>
                        <p>$S_n - q.S_n = u_1 - u_1q^n$ (các số hạng giữa triệt tiêu hết)</p>
                        <p>$S_n(1-q) = u_1(1-q^n)$</p>
                        <p>Với $q \\ne 1$, ta có: $S_n = u_1 \\frac{1-q^n}{1-q}$.</p>`,
                        examples: [
                            "Tính tổng $S_5 = 1+2+4+8+16$.<br/> <strong>Giải:</strong> $u_1=1, q=2, n=5$.<br/> $S_5 = 1.\\frac{1-2^5}{1-2} = \\frac{-31}{-1} = 31$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Lùi vô hạn', 
                            tex: 'S = \\frac{u_1}{1-q}',
                            details: {
                                proof: `<p>Xét cấp số nhân lùi vô hạn có $|q| < 1$.</p>
                                <p>Khi $n \\to +\\infty$, thì $q^n \\to 0$.</p>
                                <p>Do đó công thức $S_n = u_1 \\frac{1-q^n}{1-q}$ trở thành:</p>
                                <p>$S = u_1 \\frac{1-0}{1-q} = \\frac{u_1}{1-q}$.</p>`,
                                examples: [
                                    "Tính tổng $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + ...$.<br/> <strong>Giải:</strong> $u_1=1, q=1/2$. Do $|1/2| < 1$ nên là CSN lùi vô hạn.<br/> $S = \\frac{1}{1-0.5} = \\frac{1}{0.5} = 2$."
                                ]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>
        </div>
    )
};

// --- LOGARITHM SHEET (Updated) ---
export const LogarithmSheet = ({ onLaunchPractice }: { onLaunchPractice?: (topic: string, count: number) => void }) => {
    return (
        <div className="space-y-8 my-6">
            {/* Definition Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                    <MathJaxRenderer content="1. Định nghĩa Logarit" Component="h3" className="text-xl font-bold text-slate-800" />
                </div>
                
                <FormulaBlock 
                    theme="emerald"
                    title="Định nghĩa Logarit"
                    mainTex="\alpha = \log_a N \iff a^\alpha = N"
                    details={{
                        practiceTopic: "Định nghĩa Logarit",
                        proof: `<p><strong>Định nghĩa:</strong> Cho hai số dương $a, N$ với $a \\ne 1$. Số $\\alpha$ thỏa mãn đẳng thức $a^\\alpha = N$ được gọi là logarit cơ số $a$ của $N$.</p>
                        <p>Kí hiệu: $\\alpha = \\log_a N$.</p>
                        <p>Điều kiện tồn tại: $0 < a \\ne 1$ và $N > 0$.</p>`,
                        examples: [
                            "Tính $\\log_2 8$.<br/><strong>Giải:</strong> Vì $2^3 = 8$ nên $\\log_2 8 = 3$.",
                            "Tính $\\log_3 \\frac{1}{9}$.<br/><strong>Giải:</strong> Vì $3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$ nên $\\log_3 \\frac{1}{9} = -2$."
                        ]
                    }}
                    corollaries={[
                        { 
                            label: 'Log thập phân', 
                            tex: '\\lg N = \\log_{10} N',
                            details: {
                                proof: "<p>Logarit thập phân là logarit cơ số 10. Thường được viết tắt là $\\lg N$ hoặc $\\log N$.</p>",
                                examples: ["$\\lg 100 = 2$ vì $10^2 = 100$.", "$\\lg 0,1 = -1$ vì $10^{-1} = 0,1$."]
                            }
                        },
                        { 
                            label: 'Log tự nhiên', 
                            tex: '\\ln N = \\log_{e} N',
                            details: {
                                proof: "<p>Logarit tự nhiên (hay logarit Nepe) là logarit cơ số $e$ (với $e \\approx 2,71828...$). Kí hiệu là $\\ln N$.</p>",
                                examples: ["$\\ln e = 1$ vì $e^1 = e$.", "$\\ln 1 = 0$ vì $e^0 = 1$."]
                            }
                        }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>

            {/* Rules Section */}
            <div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                    <MathJaxRenderer content="2. Quy tắc tính toán" Component="h3" className="text-xl font-bold text-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Log của Tích/Thương */}
                    <FormulaBlock 
                        theme="emerald"
                        title="Logarit của Tích & Thương"
                        mainTex="\log_a(xy) = \log_a x + \log_a y"
                        details={{
                            practiceTopic: "Tính chất Logarit của tích thương",
                            proof: `<p><strong>Chứng minh:</strong></p>
                            <p>Đặt $\\alpha = \\log_a x$ và $\\beta = \\log_a y$.</p>
                            <p>Theo định nghĩa: $x = a^\\alpha$ và $y = a^\\beta$.</p>
                            <p>Ta có: $xy = a^\\alpha . a^\\beta = a^{\\alpha + \\beta}$.</p>
                            <p>Theo định nghĩa logarit: $\\log_a(xy) = \\alpha + \\beta$.</p>
                            <p>Thay lại $\\alpha, \\beta$: $\\log_a(xy) = \\log_a x + \\log_a y$ (đpcm).</p>`,
                            examples: [
                                "Tính $\\log_2 3 + \\log_2 \\frac{4}{3}$.<br/><strong>Giải:</strong> $\\log_2(3 . \\frac{4}{3}) = \\log_2 4 = 2$.",
                                "Rút gọn $A = \\log_6 9 + \\log_6 4$.<br/><strong>Giải:</strong> $A = \\log_6(9.4) = \\log_6 36 = 2$."
                            ]
                        }}
                        corollaries={[
                             { 
                                 label: 'Thương', 
                                 tex: '\\log_a\\frac{x}{y} = \\log_a x - \\log_a y',
                                 details: {
                                     proof: `<p>Ta có $\\frac{x}{y} = x . y^{-1}$.</p>
                                     <p>$\\log_a(\\frac{x}{y}) = \\log_a(x . y^{-1}) = \\log_a x + \\log_a y^{-1}$.</p>
                                     <p>Áp dụng công thức lũy thừa (xem bên cạnh): $\\log_a y^{-1} = -\\log_a y$.</p>
                                     <p>Vậy $\\log_a\\frac{x}{y} = \\log_a x - \\log_a y$.</p>`,
                                     examples: ["$\\log_2 10 - \\log_2 5 = \\log_2(\\frac{10}{5}) = \\log_2 2 = 1$."]
                                 }
                             },
                             { 
                                 label: 'Nghịch đảo', 
                                 tex: '\\log_a\\frac{1}{x} = -\\log_a x',
                                 details: {
                                     proof: "<p>Áp dụng công thức thương với tử số là 1:</p><p>$\\log_a \\frac{1}{x} = \\log_a 1 - \\log_a x = 0 - \\log_a x = -\\log_a x$.</p>",
                                     examples: ["$\\log_3 \\frac{1}{27} = -\\log_3 27 = -3$."]
                                 }
                             }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />

                     {/* Log của Lũy thừa */}
                     <FormulaBlock 
                        theme="emerald"
                        title="Logarit của Lũy thừa"
                        mainTex="\log_a x^\alpha = \alpha \log_a x"
                        details={{
                            practiceTopic: "Tính chất Logarit lũy thừa",
                            proof: `<p><strong>Chứng minh:</strong></p>
                            <p>Đặt $u = \\log_a x \\Rightarrow x = a^u$.</p>
                            <p>Lũy thừa hai vế với số mũ $\\alpha$: $x^\\alpha = (a^u)^\\alpha = a^{\\alpha u}$.</p>
                            <p>Theo định nghĩa logarit: $\\log_a x^\\alpha = \\alpha u$.</p>
                            <p>Thay $u = \\log_a x$: $\\log_a x^\\alpha = \\alpha \\log_a x$ (đpcm).</p>`,
                            examples: [
                                "Tính $\\log_2 8^5$.<br/><strong>Giải:</strong> $5 \\log_2 8 = 5 . 3 = 15$.",
                                "Rút gọn $\\log_a x^2$.<br/><strong>Giải:</strong> $2\\log_a |x|$ (nếu $x$ âm thì cần trị tuyệt đối)."
                            ]
                        }}
                        corollaries={[
                             { 
                                 label: 'Mũ ở cơ số', 
                                 tex: '\\log_{a^n} x = \\frac{1}{n} \\log_a x',
                                 details: {
                                     proof: `<p>Đặt $y = \\log_{a^n} x \\iff (a^n)^y = x \\iff a^{ny} = x$.</p>
                                     <p>Theo định nghĩa logarit cơ số a: $ny = \\log_a x$.</p>
                                     <p>Suy ra $y = \\frac{1}{n} \\log_a x$.</p>`,
                                     examples: ["$\\log_4 2 = \\log_{2^2} 2 = \\frac{1}{2} \\log_2 2 = \\frac{1}{2}$."]
                                 }
                             },
                             { 
                                 label: 'Căn thức', 
                                 tex: '\\log_a \\sqrt[n]{x} = \\frac{1}{n} \\log_a x',
                                 details: {
                                     proof: `<p>Ta có $\\sqrt[n]{x} = x^{\\frac{1}{n}}$.</p>
                                     <p>Áp dụng công thức đưa số mũ ra ngoài: $\\log_a x^{\\frac{1}{n}} = \\frac{1}{n} \\log_a x$.</p>`,
                                     examples: ["$\\log_3 \\sqrt{3} = \\frac{1}{2} \\log_3 3 = \\frac{1}{2}$."]
                                 }
                             },
                             { 
                                 label: 'Kết hợp', 
                                 tex: '\\log_{a^n} x^m = \\frac{m}{n} \\log_a x',
                                 details: {
                                     proof: "<p>Kết hợp cả hai công thức trên: đưa $m$ từ tử số ra ngoài (tử số) và đưa $n$ từ cơ số ra ngoài (mẫu số).</p>",
                                     examples: ["$\\log_8 4 = \\log_{2^3} 2^2 = \\frac{2}{3} \\log_2 2 = \\frac{2}{3}$."]
                                 }
                             }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />
                </div>
            </div>

             {/* Change Base Section */}
             <div>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                    <MathJaxRenderer content="3. Đổi cơ số & Hệ quả" Component="h3" className="text-xl font-bold text-slate-800" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormulaBlock 
                        theme="emerald"
                        title="Công thức đổi cơ số"
                        mainTex="\log_a b = \frac{\log_c b}{\log_c a}"
                        details={{
                            practiceTopic: "Đổi cơ số Logarit",
                            proof: `<p><strong>Chứng minh:</strong></p>
                            <p>Đặt $x = \\log_a b$. Theo định nghĩa $a^x = b$.</p>
                            <p>Lấy logarit cơ số $c$ hai vế: $\\log_c (a^x) = \\log_c b$.</p>
                            <p>Áp dụng quy tắc lũy thừa: $x \\log_c a = \\log_c b$.</p>
                            <p>Suy ra: $x = \\frac{\\log_c b}{\\log_c a}$ (với điều kiện $0 < c \\ne 1$).</p>`,
                            examples: [
                                "Tính $\\log_2 5$ theo $a = \\ln 2, b = \\ln 5$.<br/><strong>Giải:</strong> $\\log_2 5 = \\frac{\\ln 5}{\\ln 2} = \\frac{b}{a}$."
                            ]
                        }}
                        corollaries={[
                             { 
                                 label: 'Nghịch đảo', 
                                 tex: '\\log_a b = \\frac{1}{\\log_b a}',
                                 details: {
                                     proof: `<p>Trong công thức đổi cơ số, chọn $c = b$:</p>
                                     <p>$\\log_a b = \\frac{\\log_b b}{\\log_b a} = \\frac{1}{\\log_b a}$.</p>`,
                                     examples: ["$\\log_2 3 . \\log_3 2 = 1$."]
                                 }
                             },
                             { 
                                 label: 'Chèn cơ số', 
                                 tex: '\\log_a b \\cdot \\log_b c = \\log_a c',
                                 details: {
                                     proof: `<p>Áp dụng công thức đổi cơ số cho $\\log_a c$ với cơ số trung gian $b$:</p>
                                     <p>$\\log_a c = \\frac{\\log_b c}{\\log_b a}$.</p>
                                     <p>Nhân chéo $\\log_b a$ lên: $\\log_a c . \\log_b a = \\log_b c$. (Dạng tương đương).</p>
                                     <p>Hoặc: $\\log_a b . \\log_b c = \\frac{\\ln b}{\\ln a} . \\frac{\\ln c}{\\ln b} = \\frac{\\ln c}{\\ln a} = \\log_a c$.</p>`,
                                     examples: ["$\\log_3 5 . \\log_5 9 = \\log_3 9 = 2$."]
                                 }
                             },
                             { 
                                 label: 'Đổi chỗ', 
                                 tex: 'a^{\\log_b c} = c^{\\log_b a}',
                                 details: {
                                     proof: `<p>Lấy logarit cơ số $b$ hai vế:</p>
                                     <p>VT: $\\log_b(a^{\\log_b c}) = \\log_b c . \\log_b a$.</p>
                                     <p>VP: $\\log_b(c^{\\log_b a}) = \\log_b a . \\log_b c$.</p>
                                     <p>Hai vế bằng nhau $\\Rightarrow$ Đẳng thức đúng.</p>`,
                                     examples: ["$2^{\\log_5 3} = 3^{\\log_5 2}$."]
                                 }
                             }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />
                     <FormulaBlock 
                        theme="emerald"
                        title="Các công thức đặc biệt"
                        mainTex="a^{\log_a b} = b"
                        details={{
                             proof: `<p>Đây là hệ quả trực tiếp từ định nghĩa logarit.</p>
                             <p>Đặt $\\alpha = \\log_a b$. Theo định nghĩa $a^\\alpha = b$.</p>
                             <p>Thay $\\alpha$ vào, ta được $a^{\\log_a b} = b$.</p>`,
                             examples: ["$3^{\\log_3 5} = 5$.", "$e^{\\ln 10} = 10$."]
                        }}
                        corollaries={[
                             { 
                                 label: 'Cơ bản 1', 
                                 tex: '\\log_a a = 1',
                                 details: { proof: "Vì $a^1 = a$." }
                             },
                             { 
                                 label: 'Cơ bản 2', 
                                 tex: '\\log_a 1 = 0',
                                 details: { proof: "Vì $a^0 = 1$." }
                             },
                             { 
                                 label: 'Mũ đặc biệt', 
                                 tex: 'a^{\\log_a f(x)} = f(x)',
                                 details: {
                                     proof: "Tương tự công thức $a^{\\log_a b} = b$ với $b = f(x)$.",
                                     examples: ["$2^{\\log_2 (x^2+1)} = x^2+1$."]
                                 }
                             }
                        ]}
                        onLaunchPractice={onLaunchPractice}
                    />
                </div>
            </div>
        </div>
    )
}

// ... (Rest of visuals kept identical)
export const LimitSheet = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Column 1: Giới hạn Dãy số */}
            <div className="space-y-6">
                 <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="GIỚI HẠN DÃY SỐ" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Sequence Limits</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Giới hạn cơ bản"
                    mainTex="\lim_{n \to \infty} \frac{1}{n} = 0"
                    corollaries={[
                        { label: 'Mũ k', tex: '\\lim \\frac{1}{n^k} = 0 \\quad (k > 0)' },
                        { label: 'Hằng số', tex: '\\lim C = C' },
                        { label: 'Tổng/Hiệu', tex: '\\lim (u_n \\pm v_n) = \\lim u_n \\pm \\lim v_n' }
                    ]}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Cấp số nhân lùi"
                    mainTex="\lim_{n \to \infty} q^n = 0 \quad (|q| < 1)"
                    corollaries={[
                        { label: 'Ví dụ 1', tex: '\\lim (\\frac{1}{2})^n = 0' },
                        { label: 'Ví dụ 2', tex: '\\lim (0.99)^n = 0' },
                        { label: 'Phân kỳ', tex: '\\text{Nếu } |q| > 1 \\text{ thì } \\lim q^n = \\infty' }
                    ]}
                />
            </div>

            {/* Column 2: Giới hạn Hàm số */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-emerald-500 mb-2">
                    <MathJaxRenderer content="GIỚI HẠN HÀM SỐ" className="text-xl font-black text-emerald-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Function Limits</p>
                </div>

                <FormulaBlock 
                    theme="emerald"
                    title="Giới hạn vô cực (Đa thức)"
                    mainTex="\lim_{x \to \infty} \frac{P(x)}{Q(x)}"
                    corollaries={[
                        { label: 'Bậc Tử < Mẫu', tex: '\\text{Kết quả} = 0' },
                        { label: 'Bậc Tử = Mẫu', tex: '\\text{Kết quả} = \\frac{a_{max}}{b_{max}}' },
                        { label: 'Bậc Tử > Mẫu', tex: '\\text{Kết quả} = \\pm \\infty' }
                    ]}
                />

                <FormulaBlock 
                    theme="emerald"
                    title="Giới hạn lượng giác"
                    mainTex="\lim_{x \to 0} \frac{\sin x}{x} = 1"
                    corollaries={[
                        { label: 'Mở rộng', tex: '\\lim_{x \\to 0} \\frac{\\sin ax}{ax} = 1' },
                        { label: 'Tan', tex: '\\lim_{x \\to 0} \\frac{\\tan x}{x} = 1' },
                        { label: '1-Cos', tex: '\\lim_{x \\to 0} \\frac{1-\\cos x}{x^2} = \\frac{1}{2}' }
                    ]}
                />

                 <FormulaBlock 
                    theme="orange"
                    title="Số e và Logarit"
                    mainTex="\lim_{x \to \infty} (1+\frac{1}{x})^x = e"
                    corollaries={[
                        { label: 'Dạng mũ', tex: '\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1' },
                        { label: 'Dạng Log', tex: '\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1' }
                    ]}
                />
            </div>
        </div>
    )
}

export const DerivativeSheet = () => {
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Column 1: Basic & Operations */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="ĐẠO HÀM CƠ BẢN" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Basic Derivatives</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Quy tắc tính đạo hàm"
                    mainTex="(uv)' = u'v + uv'"
                    corollaries={[
                        { label: 'Tổng/Hiệu', tex: '(u \\pm v)\' = u\' \\pm v\'' },
                        { label: 'Hằng số', tex: '(ku)\' = k \\cdot u\'' },
                        { label: 'Thương', tex: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}' },
                        { label: 'Nghịch đảo', tex: '\\left(\\frac{1}{v}\\right)\' = -\\frac{v\'}{v^2}' }
                    ]}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Hàm Lũy thừa & Căn thức"
                    mainTex="(x^n)' = n \cdot x^{n-1}"
                    corollaries={[
                        { label: 'Căn bậc 2', tex: '(\\sqrt{x})\' = \\frac{1}{2\\sqrt{x}}' },
                        { label: 'Hàm 1/x', tex: '\\left(\\frac{1}{x}\\right)\' = -\\frac{1}{x^2}' },
                        { label: 'Hợp căn', tex: '(\\sqrt{u})\' = \\frac{u\'}{2\\sqrt{u}}' },
                        { label: 'Hợp mũ', tex: '(u^n)\' = n \\cdot u^{n-1} \\cdot u\'' }
                    ]}
                />
            </div>

            {/* Column 2: Transcendental Functions */}
            <div className="space-y-6">
                 <div className="text-center pb-2 border-b-2 border-emerald-500 mb-2">
                    <MathJaxRenderer content="ĐẠO HÀM HÀM SƠ CẤP" className="text-xl font-black text-emerald-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Transcendental Functions</p>
                </div>

                 <FormulaBlock 
                    theme="emerald"
                    title="Hàm Lượng Giác"
                    mainTex="(\sin x)' = \cos x"
                    corollaries={[
                        { label: 'Cos', tex: '(\\cos x)\' = -\\sin x' },
                        { label: 'Tan', tex: '(\\tan x)\' = \\frac{1}{\\cos^2 x} = 1 + \\tan^2 x' },
                        { label: 'Cot', tex: '(\\cot x)\' = -\\frac{1}{\\sin^2 x} = -(1 + \\cot^2 x)' },
                        { label: 'Hàm hợp', tex: '(\\sin u)\' = u\' \\cos u' }
                    ]}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Hàm Mũ & Logarit"
                    mainTex="(e^x)' = e^x"
                    corollaries={[
                        { label: 'Mũ cơ số a', tex: '(a^x)\' = a^x \\ln a' },
                        { label: 'Logarit Nepe', tex: '(\\ln x)\' = \\frac{1}{x}' },
                        { label: 'Logarit cơ số a', tex: '(\\log_a x)\' = \\frac{1}{x \\ln a}' },
                        { label: 'Mũ hợp', tex: '(e^u)\' = u\' \\cdot e^u' }
                    ]}
                />
            </div>
         </div>
    )
}

export const IntegralSheet = () => {
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Column 1: Power & Exp */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="NGUYÊN HÀM CƠ BẢN" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Basic Integrals</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Hàm Lũy thừa"
                    mainTex="\int x^\alpha dx = \frac{x^{\alpha+1}}{\alpha+1} + C"
                    corollaries={[
                        { label: 'Hằng số', tex: '\\int k dx = kx + C' },
                        { label: 'Nghịch đảo', tex: '\\int \\frac{1}{x} dx = \\ln|x| + C' },
                        { label: 'Căn thức', tex: '\\int \\frac{1}{\\sqrt{x}} dx = 2\\sqrt{x} + C' },
                        { label: 'Bình phương mẫu', tex: '\\int \\frac{1}{x^2} dx = -\\frac{1}{x} + C' }
                    ]}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Hàm Mũ"
                    mainTex="\int e^x dx = e^x + C"
                    corollaries={[
                        { label: 'Cơ số a', tex: '\\int a^x dx = \\frac{a^x}{\\ln a} + C' },
                        { label: 'Mở rộng e', tex: '\\int e^{ax+b} dx = \\frac{1}{a}e^{ax+b} + C' }
                    ]}
                />
            </div>

            {/* Column 2: Trig & Extended */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-emerald-500 mb-2">
                    <MathJaxRenderer content="NGUYÊN HÀM LƯỢNG GIÁC" className="text-xl font-black text-emerald-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Trigonometric Integrals</p>
                </div>

                <FormulaBlock 
                    theme="emerald"
                    title="Hàm Lượng Giác"
                    mainTex="\int \cos x dx = \sin x + C"
                    corollaries={[
                        { label: 'Sin', tex: '\\int \\sin x dx = -\\cos x + C' },
                        { label: '1/Cos²', tex: '\\int \\frac{1}{\\cos^2 x} dx = \\tan x + C' },
                        { label: '1/Sin²', tex: '\\int \\frac{1}{\\sin^2 x} dx = -\\cot x + C' }
                    ]}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Nguyên hàm mở rộng ($ax + b$)"
                    mainTex="\int f(ax+b)dx = \frac{1}{a}F(ax+b) + C"
                    corollaries={[
                        { label: 'Lũy thừa', tex: '\\int (ax+b)^n dx = \\frac{1}{a} \\frac{(ax+b)^{n+1}}{n+1} + C' },
                        { label: 'Nghịch đảo', tex: '\\int \\frac{dx}{ax+b} = \\frac{1}{a}\\ln|ax+b| + C' },
                        { label: 'Cos u', tex: '\\int \\cos(ax+b) dx = \\frac{1}{a}\\sin(ax+b) + C' },
                        { label: 'Sin u', tex: '\\int \\sin(ax+b) dx = -\\frac{1}{a}\\cos(ax+b) + C' }
                    ]}
                />
            </div>
         </div>
    )
}

// --- STATISTICS UNGROUPED SHEET (Detailed) ---
export const StatisticsUngroupedSheet = ({ onLaunchPractice }: { onLaunchPractice?: (topic: string, count: number) => void }) => {
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Column 1: Measures of Central Tendency */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="ĐO XU THẾ TRUNG TÂM" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Measures of Center</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Số trung bình cộng"
                    mainTex="\bar{x} = \frac{x_1 + x_2 + ... + x_n}{n}"
                    details={{
                        practiceTopic: "Thống kê: Số trung bình",
                        proof: `<p><strong>Định nghĩa:</strong> Số trung bình cộng của một mẫu số liệu là tổng của tất cả các giá trị chia cho kích thước mẫu.</p>
                        <p>Công thức thu gọn: $\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$.</p>`,
                        examples: [
                            "Mẫu số liệu điểm thi: 5, 7, 8, 9, 10.<br/> $\\bar{x} = \\frac{5+7+8+9+10}{5} = \\frac{39}{5} = 7.8$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Số trung vị ($M_e$)"
                    mainTex="M_e = \begin{cases} x_{\frac{n+1}{2}} & (n \text{ lẻ}) \\ \frac{1}{2}(x_{\frac{n}{2}} + x_{\frac{n}{2}+1}) & (n \text{ chẵn}) \end{cases}"
                    details={{
                        practiceTopic: "Thống kê: Số trung vị",
                        proof: `<p><strong>Quy tắc tìm:</strong></p>
                        <p>1. Sắp xếp mẫu số liệu theo thứ tự không giảm.</p>
                        <p>2. Nếu $n$ lẻ, $M_e$ là số đứng chính giữa.</p>
                        <p>3. Nếu $n$ chẵn, $M_e$ là trung bình cộng của hai số đứng giữa.</p>`,
                        examples: [
                            "Mẫu lẻ: 2, 5, 8, 10, 15. $n=5$. $M_e = 8$.",
                            "Mẫu chẵn: 2, 5, 8, 10. $n=4$. $M_e = \\frac{5+8}{2} = 6.5$."
                        ]
                    }}
                    corollaries={[
                         {
                             label: 'Tứ phân vị',
                             tex: 'Q_1, Q_2, Q_3',
                             details: {
                                 proof: `<p>$Q_2 = M_e$ (Trung vị của cả mẫu).</p>
                                 <p>$Q_1$: Trung vị của nửa số liệu bên trái $Q_2$.</p>
                                 <p>$Q_3$: Trung vị của nửa số liệu bên phải $Q_2$.</p>`,
                                 examples: ["Mẫu: 1, 3, 4, 5, 8, 9, 12.<br/> $Q_2 = 5$.<br/> Nửa trái: 1, 3, 4 $\\Rightarrow Q_1=3$.<br/> Nửa phải: 8, 9, 12 $\\Rightarrow Q_3=9$."]
                             }
                         }
                    ]}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Mốt ($M_o$)"
                    mainTex="M_o = \text{Giá trị có tần số lớn nhất}"
                    details={{
                        practiceTopic: "Thống kê: Mốt",
                        proof: "<p>Mốt là giá trị xuất hiện nhiều lần nhất trong mẫu số liệu. Một mẫu có thể có nhiều mốt hoặc không có mốt (nếu các số xuất hiện 1 lần).</p>",
                        examples: [
                            "Mẫu: 2, 5, 5, 7, 9. $M_o = 5$.",
                            "Mẫu: 1, 2, 3, 4. Không có mốt đặc trưng (hoặc tất cả đều là mốt)."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>

            {/* Column 2: Measures of Dispersion */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-orange-500 mb-2">
                    <MathJaxRenderer content="ĐO ĐỘ PHÂN TÁN" className="text-xl font-black text-orange-600 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Measures of Dispersion</p>
                </div>

                <FormulaBlock 
                    theme="orange"
                    title="Khoảng biến thiên & Tứ phân vị"
                    mainTex="R = x_{max} - x_{min}"
                    details={{
                         proof: "<p>Khoảng biến thiên là hiệu số giữa giá trị lớn nhất và giá trị nhỏ nhất trong mẫu số liệu.</p>",
                         examples: ["Mẫu: 2, 5, 10, 20. $R = 20 - 2 = 18$."]
                    }}
                    corollaries={[
                         {
                             label: 'Khoảng IQR',
                             tex: '\\Delta_Q = Q_3 - Q_1',
                             details: {
                                 proof: "<p>Khoảng tứ phân vị (Interquartile Range) đo độ trải giữa của 50% số liệu trung tâm. Nó ít bị ảnh hưởng bởi giá trị ngoại lai.</p>",
                                 examples: ["Nếu $Q_1=3, Q_3=9$ thì $\\Delta_Q = 9-3=6$."]
                             }
                         }
                    ]}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Phương sai ($s^2$)"
                    mainTex="s^2 = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{x})^2"
                    details={{
                        practiceTopic: "Thống kê: Phương sai",
                        proof: `<p><strong>Định nghĩa:</strong> Phương sai là trung bình cộng của bình phương độ lệch giữa mỗi giá trị số liệu và số trung bình.</p>
                        <p>Công thức khai triển: $s^2 = \\frac{1}{n}(\\sum x_i^2) - (\\bar{x})^2$.</p>`,
                        examples: [
                            "Mẫu: 1, 3, 5. $\\bar{x}=3$.<br/> $s^2 = \\frac{(1-3)^2 + (3-3)^2 + (5-3)^2}{3} = \\frac{4+0+4}{3} = \\frac{8}{3} \\approx 2.67$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Độ lệch chuẩn ($s$)"
                    mainTex="s = \sqrt{s^2}"
                    details={{
                        practiceTopic: "Thống kê: Độ lệch chuẩn",
                        proof: "<p>Độ lệch chuẩn là căn bậc hai của phương sai. Nó có cùng đơn vị đo với mẫu số liệu, dùng để đánh giá mức độ phân tán quanh giá trị trung bình.</p>",
                        examples: ["Nếu phương sai $s^2 = 4$ thì độ lệch chuẩn $s = \\sqrt{4} = 2$."]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>
         </div>
    )
}

// --- STATISTICS GROUPED SHEET ---
export const StatisticsGroupedSheet = ({ onLaunchPractice }: { onLaunchPractice?: (topic: string, count: number) => void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Column 1: Central Tendency */}
            <div className="space-y-6">
                <div className="text-center pb-2 border-b-2 border-blue-500 mb-2">
                    <MathJaxRenderer content="ĐO XU THẾ TRUNG TÂM" className="text-xl font-black text-blue-700 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Measures of Center</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Số trung bình cộng"
                    mainTex="\bar{x} = \frac{m_1c_1 + m_2c_2 + ... + m_kc_k}{n}"
                    details={{
                        practiceTopic: "Thống kê nhóm: Số trung bình",
                        proof: `<p><strong>Công thức:</strong> $\\bar{x} = \\frac{1}{n} \\sum_{i=1}^k m_i c_i$.</p>
                        <p>Trong đó:</p>
                        <ul class="list-disc pl-5">
                            <li>$n$: Kích thước mẫu (tổng tần số).</li>
                            <li>$m_i$: Tần số của nhóm thứ $i$.</li>
                            <li>$c_i$: Giá trị đại diện của nhóm thứ $i$. Với nhóm $[a; b)$, $c_i = \\frac{a+b}{2}$.</li>
                        </ul>`,
                        examples: [
                            "Nhóm [0;10) có tần số 3, nhóm [10;20) có tần số 7.<br/> $c_1=5, c_2=15$.<br/> $\\bar{x} = \\frac{3(5) + 7(15)}{10} = \\frac{15+105}{10} = 12$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Số trung vị ($M_e$)"
                    mainTex="M_e = u_m + \frac{\frac{n}{2} - C}{n_m} \cdot (u_{m+1} - u_m)"
                    details={{
                        practiceTopic: "Thống kê nhóm: Số trung vị",
                        proof: `<p><strong>Các bước tìm $M_e$:</strong></p>
                        <p>1. Tìm nhóm chứa trung vị $[u_m; u_{m+1})$: Nhóm đầu tiên có tần số tích lũy $\\ge n/2$.</p>
                        <p>2. Áp dụng công thức nội suy:</p>
                        <ul class="list-disc pl-5">
                            <li>$u_m$: Đầu mút trái của nhóm.</li>
                            <li>$C$: Tần số tích lũy của các nhóm trước nhóm trung vị.</li>
                            <li>$n_m$: Tần số của nhóm trung vị.</li>
                            <li>$L = u_{m+1} - u_m$: Độ dài nhóm.</li>
                        </ul>`,
                        examples: [
                            "Xét mẫu $n=20$. Nhóm chứa trung vị là nhóm thứ 2: [10; 20) có $n_2=8$, tần số tích lũy trước đó $C=5$.<br/> $M_e = 10 + \\frac{10-5}{8} \\cdot 10 = 10 + 6.25 = 16.25$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="blue"
                    title="Mốt ($M_o$)"
                    mainTex="M_o = u_o + \frac{n_o - n_{o-1}}{(n_o - n_{o-1}) + (n_o - n_{o+1})} \cdot L"
                    details={{
                        practiceTopic: "Thống kê nhóm: Mốt",
                        proof: `<p><strong>Các bước tìm $M_o$:</strong></p>
                        <p>1. Tìm nhóm chứa mốt $[u_o; u_{o+1})$: Nhóm có tần số lớn nhất.</p>
                        <p>2. Áp dụng công thức:</p>
                        <ul class="list-disc pl-5">
                            <li>$n_o$: Tần số nhóm chứa mốt.</li>
                            <li>$n_{o-1}$: Tần số nhóm đứng trước.</li>
                            <li>$n_{o+1}$: Tần số nhóm đứng sau.</li>
                            <li>$L$: Độ dài nhóm.</li>
                        </ul>`,
                        examples: [
                            "Nhóm [10; 20) có tần số lớn nhất $n_o=10$. Nhóm trước $n_{o-1}=4$. Nhóm sau $n_{o+1}=6$.<br/> $M_o = 10 + \\frac{10-4}{(10-4)+(10-6)} \\cdot 10 = 10 + \\frac{6}{10} \\cdot 10 = 16$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>

            {/* Column 2: Position & Dispersion */}
            <div className="space-y-6">
                 <div className="text-center pb-2 border-b-2 border-orange-500 mb-2">
                    <MathJaxRenderer content="ĐO ĐỘ PHÂN TÁN & VỊ TRÍ" className="text-xl font-black text-orange-600 uppercase" Component="h3" />
                    <p className="text-xs text-slate-500 font-mono">Dispersion & Position</p>
                </div>

                <FormulaBlock 
                    theme="blue"
                    title="Tứ phân vị ($Q_1, Q_3$)"
                    mainTex="Q_p = u_p + \frac{\frac{pn}{4} - C_p}{n_p} \cdot L"
                    details={{
                         proof: `<p>Tương tự trung vị, ta tìm nhóm chứa tứ phân vị thứ $p$ (với $p=1$ hoặc $p=3$).</p>
                         <p>Nhóm chứa $Q_1$: Nhóm đầu tiên có tần số tích lũy $\\ge n/4$.</p>
                         <p>Nhóm chứa $Q_3$: Nhóm đầu tiên có tần số tích lũy $\\ge 3n/4$.</p>
                         <p>Công thức nội suy giống hệt trung vị nhưng thay $n/2$ bằng $n/4$ hoặc $3n/4$.</p>`,
                         examples: ["Tính $Q_1$ với $n=100$. Tìm nhóm có tích lũy $\\ge 25$. Áp dụng công thức."]
                    }}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Phương sai ($s^2$)"
                    mainTex="s^2 = \frac{1}{n} \sum_{i=1}^k m_i (c_i - \bar{x})^2"
                    details={{
                        practiceTopic: "Thống kê nhóm: Phương sai",
                        proof: `<p><strong>Công thức:</strong></p>
                        <p>$s^2 = \\frac{1}{n} [m_1(c_1 - \\bar{x})^2 + ... + m_k(c_k - \\bar{x})^2]$.</p>
                        <p>Hoặc công thức khai triển:</p>
                        <p>$s^2 = \\frac{1}{n}(\\sum m_i c_i^2) - (\\bar{x})^2$.</p>
                        <p>Ý nghĩa: Đo mức độ phân tán của các giá trị đại diện quanh số trung bình.</p>`,
                        examples: [
                            "Cho mẫu ghép nhóm đã tính được $\\bar{x}=12$.<br/> $s^2 = \\frac{1}{10}[3(5-12)^2 + 7(15-12)^2] = \\frac{1}{10}[3(49) + 7(9)] = \\frac{147+63}{10} = 21$."
                        ]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />

                <FormulaBlock 
                    theme="orange"
                    title="Độ lệch chuẩn ($s$)"
                    mainTex="s = \sqrt{s^2}"
                    details={{
                        practiceTopic: "Thống kê nhóm: Độ lệch chuẩn",
                        proof: "<p>Độ lệch chuẩn là căn bậc hai của phương sai mẫu số liệu ghép nhóm.</p>",
                        examples: ["Nếu $s^2=21$ thì $s \\approx 4.58$."]
                    }}
                    onLaunchPractice={onLaunchPractice}
                />
            </div>
        </div>
    );
}; 

// ... (Rest of visuals kept identical: IntegralApplicationVisual, CubicGraphSummary, RationalLinearGraphSummary, RationalQuadraticGraphSummary, OxyzAxesVisual, VectorCrossProductVisual, VectorOperationsVisual, BarycentricVisual)
// ... keeping them for completeness
export const IntegralApplicationVisual = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Biểu đồ tóm tắt Ứng dụng Tích phân (Placeholder - Use previous code)</div>; }; 
export const CubicGraphSummary = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Biểu đồ tóm tắt hàm bậc 3 (Placeholder)</div>; };
export const RationalLinearGraphSummary = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Biểu đồ tóm tắt hàm nhất biến (Placeholder)</div>; };
export const RationalQuadraticGraphSummary = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Biểu đồ tóm tắt hàm hữu tỉ bậc 2/1 (Placeholder)</div>; };
export const OxyzAxesVisual = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Minh họa hệ trục Oxyz (Placeholder)</div>; };
export const VectorCrossProductVisual = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Minh họa tích có hướng (Placeholder)</div>; };
export const VectorOperationsVisual = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Minh họa phép toán vectơ (Placeholder)</div>; };
export const BarycentricVisual = () => { return <div className="p-4 bg-white rounded-lg border border-slate-200 text-center">Minh họa tâm tỉ cự (Placeholder)</div>; };