
import React, { useState } from 'react';
import { BarChart3, BookCopy, BrainCircuit, Check, ChevronDown, ClipboardList, FlaskConical, Gauge, Grid3X3, Target, Telescope, TrendingUp, Sigma, Shapes, Globe, ListChecks, ArrowDownRight, Waypoints, Variable } from 'lucide-react';
import MathText from './MathText'; // Import MathText for rendering LaTeX

// --- GRAPHICAL COMPONENTS (SVG/HTML) ---

const PyramidShape = () => (
    <div className="my-6 flex justify-center">
        <svg width="240" height="200" viewBox="0 0 240 200" className="overflow-visible">
            <defs>
                <marker id="dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
                    <circle cx="2" cy="2" r="2" fill="black" />
                </marker>
            </defs>
            {/* Base ABCD - Parallelogram */}
            {/* D(40, 80), C(160, 80), B(200, 140), A(80, 140) */}
            
            {/* Hidden Lines (Dashed) */}
            <path d="M 40 80 L 160 80" stroke="black" strokeWidth="1" strokeDasharray="4,4" /> {/* DC */}
            <path d="M 40 80 L 80 140" stroke="black" strokeWidth="1" strokeDasharray="4,4" /> {/* DA */}
            <path d="M 40 80 L 120 20" stroke="black" strokeWidth="1" strokeDasharray="4,4" /> {/* SD */}
            
            {/* Height SO (Hidden) */}
            {/* Intersection O approx at (120, 110) */}
            <path d="M 120 20 L 120 110" stroke="black" strokeWidth="1" strokeDasharray="4,4" /> {/* SO */}
            <path d="M 40 80 L 200 140" stroke="gray" strokeWidth="0.5" strokeDasharray="2,2" /> {/* DB */}
            <path d="M 80 140 L 160 80" stroke="gray" strokeWidth="0.5" strokeDasharray="2,2" /> {/* AC */}

            {/* Visible Lines */}
            <path d="M 80 140 L 200 140 L 160 80" stroke="black" strokeWidth="1.5" fill="none" /> {/* AB, BC */}
            <path d="M 120 20 L 80 140" stroke="black" strokeWidth="1.5" /> {/* SA */}
            <path d="M 120 20 L 200 140" stroke="black" strokeWidth="1.5" /> {/* SB */}
            <path d="M 120 20 L 160 80" stroke="black" strokeWidth="1.5" /> {/* SC */}

            {/* Labels */}
            <text x="120" y="15" textAnchor="middle" fontSize="12" fontWeight="bold">S</text>
            <text x="70" y="150" fontSize="12" fontWeight="bold">A</text>
            <text x="210" y="150" fontSize="12" fontWeight="bold">B</text>
            <text x="170" y="80" fontSize="12" fontWeight="bold">C</text>
            <text x="25" y="80" fontSize="12" fontWeight="bold">D</text>
            <text x="125" y="115" fontSize="10">O</text>
        </svg>
    </div>
);

const PrismShape = () => (
    <div className="my-6 flex justify-center">
        <svg width="200" height="220" viewBox="0 0 200 220" className="overflow-visible">
            {/* Top Triangle A'B'C' */}
            {/* A'(40, 40), B'(100, 20), C'(140, 60) */}
            <path d="M 40 40 L 100 20 L 140 60 Z" stroke="black" strokeWidth="1.5" fill="none" />
            
            {/* Bottom Triangle ABC */}
            {/* A(40, 160), B(100, 140), C(140, 180) */}
            <path d="M 40 160 L 140 180" stroke="black" strokeWidth="1.5" fill="none" /> {/* AC */}
            <path d="M 140 180 L 100 140" stroke="black" strokeWidth="1.5" fill="none" /> {/* CB */}
            <path d="M 40 160 L 100 140" stroke="black" strokeWidth="1" strokeDasharray="4,4" fill="none" /> {/* AB (Hidden) */}

            {/* Vertical Edges */}
            <line x1="40" y1="40" x2="40" y2="160" stroke="black" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="140" stroke="black" strokeWidth="1" strokeDasharray="4,4" /> {/* BB' Hidden usually if viewed from front left? Let's make B back */}
            {/* Actually let's adjust visibility: If A is front-left, C is front-right, B is back. Then B edges are hidden. */}
            <line x1="140" y1="60" x2="140" y2="180" stroke="black" strokeWidth="1.5" />

            {/* Labels */}
            <text x="30" y="40" fontSize="12" fontWeight="bold">A'</text>
            <text x="100" y="15" fontSize="12" fontWeight="bold">B'</text>
            <text x="150" y="60" fontSize="12" fontWeight="bold">C'</text>
            
            <text x="30" y="170" fontSize="12" fontWeight="bold">A</text>
            <text x="100" y="135" fontSize="12" fontWeight="bold">B</text>
            <text x="150" y="190" fontSize="12" fontWeight="bold">C</text>
        </svg>
    </div>
);

const VariationTable = () => (
    <div className="my-6 flex justify-center">
        <div className="border border-slate-800 bg-white text-sm select-none">
            {/* Row 1: x */}
            <div className="flex border-b border-slate-800">
                <div className="w-12 p-2 border-r border-slate-800 font-serif italic flex items-center justify-center bg-slate-50">x</div>
                <div className="w-64 flex justify-between items-center px-4 py-1">
                    <span>-∞</span>
                    <span className="text-slate-800 font-bold">-2</span>
                    <span>+∞</span>
                </div>
            </div>
            
            {/* Row 2: y' */}
            <div className="flex border-b border-slate-800">
                <div className="w-12 p-2 border-r border-slate-800 font-serif italic flex items-center justify-center bg-slate-50">y'</div>
                <div className="w-64 flex relative h-8 items-center">
                    <div className="flex-1 text-center font-bold text-lg text-slate-700">+</div>
                    {/* Double Bar for Undefined */}
                    <div className="h-full w-px bg-slate-800 mx-[1px]"></div>
                    <div className="h-full w-px bg-slate-800 mx-[1px]"></div>
                    <div className="flex-1 text-center font-bold text-lg text-slate-700">+</div>
                </div>
            </div>

            {/* Row 3: y */}
            <div className="flex">
                <div className="w-12 p-2 border-r border-slate-800 font-serif italic flex items-center justify-center bg-slate-50 h-20">y</div>
                <div className="w-64 flex relative h-20">
                    {/* Left Column */}
                    <div className="flex-1 border-r border-transparent flex flex-col justify-between p-1">
                        <div className="flex justify-end pr-2 text-xs">+∞</div>
                        <div className="flex justify-start pl-2 text-xs">2</div>
                        {/* Arrow Up */}
                        <svg className="absolute top-0 left-0 w-[50%] h-full pointer-events-none">
                             <line x1="20" y1="65" x2="110" y2="15" stroke="black" strokeWidth="1" markerEnd="url(#arrowhead)" />
                        </svg>
                    </div>

                    {/* Double Bar Area */}
                    <div className="h-full w-px bg-slate-800 mx-[1px]"></div>
                    <div className="h-full w-px bg-slate-800 mx-[1px]"></div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col justify-between p-1">
                        <div className="flex justify-end pr-2 text-xs">2</div>
                        <div className="flex justify-start pl-2 text-xs">-∞</div>
                        {/* Arrow Up */}
                        <svg className="absolute top-0 right-0 w-[50%] h-full pointer-events-none">
                             <line x1="20" y1="65" x2="110" y2="15" stroke="black" strokeWidth="1" markerEnd="url(#arrowhead)" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* SVG Defs for Arrowhead */}
            <svg style={{display:'none'}}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                    </marker>
                </defs>
            </svg>
        </div>
    </div>
);

const FrequencyTable = () => (
    <div className="my-6 flex justify-center">
        <table className="border-collapse border border-slate-800 bg-white text-sm shadow-sm">
            <thead>
                <tr className="bg-slate-100">
                    <th className="border border-slate-600 px-6 py-2 text-slate-800 font-bold">Thời lượng (giây)</th>
                    <th className="border border-slate-600 px-6 py-2 text-slate-800 font-bold">Số cuộc gọi</th>
                </tr>
            </thead>
            <tbody className="text-slate-700">
                <tr><td className="border border-slate-300 px-6 py-1.5 text-center">[60; 90)</td><td className="border border-slate-300 px-6 py-1.5 text-center">6</td></tr>
                <tr><td className="border border-slate-300 px-6 py-1.5 text-center">[90; 120)</td><td className="border border-slate-300 px-6 py-1.5 text-center">14</td></tr>
                <tr><td className="border border-slate-300 px-6 py-1.5 text-center bg-blue-50 font-bold">[120; 150)</td><td className="border border-slate-300 px-6 py-1.5 text-center bg-blue-50 font-bold">25</td></tr>
                <tr><td className="border border-slate-300 px-6 py-1.5 text-center">[150; 180)</td><td className="border border-slate-300 px-6 py-1.5 text-center">10</td></tr>
                <tr><td className="border border-slate-300 px-6 py-1.5 text-center">[180; 210)</td><td className="border border-slate-300 px-6 py-1.5 text-center">5</td></tr>
                <tr className="bg-slate-50 font-bold"><td className="border border-slate-300 px-6 py-1.5 text-center">Tổng</td><td className="border border-slate-300 px-6 py-1.5 text-center">60</td></tr>
            </tbody>
        </table>
    </div>
);

// --- SUB-COMPONENTS for ExamMatrixView ---

const Section = ({ title, icon, children, id }: { title: string, icon: React.ReactNode, children?: React.ReactNode, id: string }) => (
    <section id={id} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-3">
            {icon}
            {title}
        </h2>
        {children}
    </section>
);

const StatCard = ({ title, value, description, icon, color }: { title: string, value: string, description: string, icon: React.ReactNode, color: string }) => (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4`}>
        <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <div className="text-sm font-bold uppercase text-slate-500">{title}</div>
            <div className="text-3xl font-extrabold text-slate-800">{value}</div>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const LevelTag = ({ level }: { level: 'Nhận biết' | 'Vận dụng' | 'Vận dụng cao' }) => {
    const styles = {
        'Nhận biết': 'bg-emerald-100 text-emerald-800',
        'Vận dụng': 'bg-amber-100 text-amber-800',
        'Vận dụng cao': 'bg-rose-100 text-rose-800',
    };
    return <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${styles[level]}`}>{level}</span>
}

// --- DATA for ExamMatrixView ---
const distributionData = [
  { name: 'Nguyên hàm – Tích phân', value: 17.5, color: 'bg-emerald-500', text_color: 'text-emerald-500' },
  { name: 'Đường thẳng – Mặt phẳng – Mặt cầu', value: 17.5, color: 'bg-violet-500', text_color: 'text-violet-500' },
  { name: 'Lượng giác', value: 10, color: 'bg-sky-500', text_color: 'text-sky-500' },
  { name: 'Ứng dụng đạo hàm', value: 7.5, color: 'bg-blue-500', text_color: 'text-blue-500' },
  { name: 'Xác suất có điều kiện (L12)', value: 7.5, color: 'bg-rose-500', text_color: 'text-rose-500' },
  { name: 'Mũ – Lôgarit', value: 5, color: 'bg-lime-500', text_color: 'text-lime-500' },
  { name: 'Xác suất cổ điển', value: 5, color: 'bg-pink-500', text_color: 'text-pink-500' },
  { name: 'Vectơ và hệ tọa độ', value: 3.8, color: 'bg-indigo-500', text_color: 'text-indigo-500' },
  { name: 'Thống kê', value: 3.7, color: 'bg-amber-500', text_color: 'text-amber-500' },
  { name: 'Dãy số, Cấp số', value: 2.5, color: 'bg-slate-500', text_color: 'text-slate-500' },
  { name: 'Lý thuyết đồ thị', value: 2.5, color: 'bg-gray-500', text_color: 'text-gray-500' },
  { name: 'Kiến thức khác & VDC Tổng hợp', value: 17.5, color: 'bg-orange-400', text_color: 'text-orange-400' }
];

const detailedTopics = [
    // Lớp 12
    {
        grade: 12, title: 'Ứng dụng đạo hàm – Khảo sát hàm số', percentage: '7-8%', examPart: 'Chủ yếu ở Phần I & các ý đầu Phần II', icon: <TrendingUp className="w-5 h-5"/>, color: 'blue',
        subTopics: [
            { title: 'Bài 1, 2 (Đơn điệu, cực trị)', content: [
                { level: 'Nhận biết', text: 'Xét tính đơn điệu và xác định cực đại/cực tiểu của hàm số đã cho (dựa trên đạo hàm hoặc bảng biến thiên). Ví dụ: cho bảng biến thiên, xác định khoảng đồng biến, cực trị.'},
                { level: 'Vận dụng', text: 'Bài toán tối ưu hóa thực tế (tìm max/min của hàm trong ngữ cảnh), hoặc khảo sát hàm phức hơn (hàm chứa căn, lũy thừa).'},
                { level: 'Vận dụng cao', text: 'Hiếm, có thể là bài xây dựng hàm số tối ưu hóa từ bài toán thực tiễn, đòi hỏi lập luận liên kết nhiều bước.'},
            ]},
            { title: 'Bài 3 (Đường tiệm cận)', content: [
                { level: 'Nhận biết', text: 'Xác định phương trình tiệm cận đứng/ngang của đồ thị hàm số (ví dụ từ bảng biến thiên hoặc tính giới hạn tại vô cực). Ví dụ minh họa đề thi có câu “Tổng số tiệm cận…” yêu cầu đếm và viết phương trình tiệm cận của hàm số.'},
                { level: 'Vận dụng', text: 'Tính tiệm cận của hàm phức (phân thức, chứa mũ, căn…) bằng cách lấy giới hạn thích hợp.'},
                { level: 'Vận dụng cao', text: 'Có thể là bài toán hàm số kết hợp với thực tiễn (phân tích xu hướng tăng/giảm gần tiệm cận, mô hình hóa vấn đề…).'},
            ]},
             { title: 'Bài 4 (Vẽ đồ thị)', content: [
                { level: 'Nhận biết', text: 'Cho hàm số đơn giản, yêu cầu vẽ đồ thị (cần tính đạo hàm, giá trị lớn/nhỏ, tiệm cận trước). Đôi khi dùng phần mềm hỗ trợ.'},
                { level: 'Vận dụng cao', text: 'Hiếm, có thể là yêu cầu phân tích đồ thị hàm đã cho thực tế (mô tả hình học).'},
            ]},
        ]
    },
    {
        grade: 12, title: 'Nguyên hàm – Tích phân', percentage: '17-18%', examPart: 'Tập trung ở Phần II & III (Vận dụng)', icon: <Sigma className="w-5 h-5"/>, color: 'emerald',
        subTopics: [
            { title: 'Bài 11 (Nguyên hàm) & Bài 12 (Tích phân)', content: [
                { level: 'Nhận biết', text: 'Tính nguyên hàm cơ bản của các hàm đa thức, lượng giác, mũ – logarit đã học. Ví dụ: tìm ∫x^n dx, ∫ sin x dx, ∫ e^x dx…'},
                { level: 'Vận dụng', text: 'Tính tích phân xác định cơ bản, dùng tích phân để tính diện tích hình phẳng, hoặc tính xấp xỉ tích phân (phương pháp Simpson, Hình thang). Các bài tích phân nhiều bước hoặc kết hợp biến đổi. Ví dụ: ∫ từ a đến b của hàm phân thức, diện tích hình phẳng.'},
                { level: 'Vận dụng cao', text: 'Tính thể tích khối xoay bằng tích phân, giải bài toán thực tế phức tạp yêu cầu thiết lập tích phân (ví dụ tối ưu hóa diện tích-tiết diện vật).'},
            ]},
            { title: 'Bài 13 (Ứng dụng tích phân)', content: [
                { level: 'Vận dụng', text: 'Chủ yếu vận dụng, liên kết với hình học để tính diện tích hoặc thể tích.'},
            ]},
        ]
    },
    {
        grade: 12, title: 'Vectơ và hệ tọa độ trong không gian', percentage: '2.5–5%', examPart: 'Xuất hiện trong Phần I & II (Cơ bản)', icon: <Shapes className="w-5 h-5"/>, color: 'indigo',
        subTopics: [
            { title: 'Bài 1, 2 (Vectơ & tọa độ)', content: [
                { level: 'Nhận biết', text: 'Kiến thức cơ bản về vectơ: định nghĩa, tính chất, phép toán cơ bản (cộng/trừ, nhân vô hướng). Ví dụ: cho hai vectơ, xác định trung điểm, viết vectơ giữa hai điểm. Toạ độ điểm/vectơ trong hệ Oxyz.'},
                { level: 'Vận dụng', text: 'Phương trình đường thẳng, mặt phẳng trong không gian (dạng tham số và chính tắc). Tính toán giao điểm, góc giữa vectơ, khoảng cách. Ví dụ: xét vị trí tương đối của đường thẳng – mặt phẳng, tính góc giữa hai đường thẳng hoặc mặt.'},
                { level: 'Vận dụng cao', text: 'Bài hình học không gian phức hợp: kết hợp vectơ với tọa độ để giải bài toán nhiều bước (ví dụ tìm giao tuyến đường thẳng/mặt phẳng hoặc chứng minh quan hệ trong hình học 3D).'},
            ]},
        ]
    },
     {
        grade: 12, title: 'Đường thẳng – Mặt phẳng – Mặt cầu', percentage: '17–18%', examPart: 'Phần lớn ở Phần I/II, VDC ở Phần III', icon: <Globe className="w-5 h-5"/>, color: 'violet',
        subTopics: [
            { title: 'Bài 14-17 (Mặt phẳng, Đường thẳng, Góc, Mặt cầu)', content: [
                { level: 'Nhận biết', text: 'Phương trình tham số/chính tắc của đường thẳng, mặt phẳng; định nghĩa mặt cầu. Công thức khoảng cách từ điểm đến đường thẳng/mặt phẳng, góc giữa đường thẳng – mặt phẳng. Ví dụ: tính khoảng cách, góc số giữa hai hình.'},
                { level: 'Vận dụng', text: 'Giải bài toán hình học không gian: tìm giao tuyến giữa đường thẳng và mặt phẳng, tính khoảng cách trong không gian, viết phương trình mặt phẳng đi qua 3 điểm, mặt cầu qua điểm/véc tơ.'},
                { level: 'Vận dụng cao', text: 'Bài hình học 3D phức tạp nhiều bước, tích hợp với các phần khác (ví dụ chứng minh quan hệ vuông góc trong không gian, hay ghép với phẳng toạ độ), yêu cầu sáng tạo.'},
            ]},
        ]
    },
    {
        grade: 12, title: 'Thống kê – Xử lý số liệu nhóm', percentage: '2–5%', examPart: 'Thường ở mức Nhận biết (Phần I/II)', icon: <BarChart3 className="w-5 h-5"/>, color: 'amber',
         subTopics: [
            { title: 'Bài 1, 2 (Các số đặc trưng)', content: [
                { level: 'Nhận biết', text: 'Tính trung bình, phương sai, độ lệch chuẩn mẫu từ bảng tần số ghép nhóm. Ví dụ: cho bảng tần số, tính các chỉ số trung tâm và phân tán.'},
                { level: 'Vận dụng', text: 'Ghép hai hay nhiều mẫu để tính chung (trung bình ghép, phương sai ghép), so sánh biến động của các tập số liệu.'},
                { level: 'Vận dụng cao', text: 'Bài toán thực tế cần phân tích số liệu phức tạp (ít xuất hiện trong đề chính thức, chủ yếu ở mức cơ bản).'},
            ]},
        ]
    },
    {
        grade: 12, title: 'Xác suất có điều kiện', percentage: '7-8%', examPart: 'Các câu vận dụng, thường ở Phần III', icon: <FlaskConical className="w-5 h-5"/>, color: 'rose',
        subTopics: [
            { title: 'Bài 18, 19 (Xác suất có điều kiện, Bayes)', content: [
                { level: 'Nhận biết', text: 'Định nghĩa và công thức cơ bản: P(A|B), công thức xác suất toàn phần, định lý Bayes. Cho bài toán đơn giản tính xác suất có điều kiện.'},
                { level: 'Vận dụng', text: 'Bài toán xác suất thực tiễn: kết hợp nhiều biến cố, sử dụng Bayes để tìm xác suất ngược lại, tính xác suất sự kiện phức tạp (ví dụ trong quảng cáo, y tế).'},
                { level: 'Vận dụng cao', text: 'Xây dựng mô hình xác suất phức hợp trong tình huống mới, hoặc các bài toán tổ hợp xác suất khó. Thường nằm ở cuối đề (Phần III).'},
            ]},
        ]
    },
    // Lớp 11
    {
        grade: 11, title: 'Lượng giác', percentage: '~10%', examPart: 'Chủ yếu ở mức Nhận biết (Phần I/II)', icon: <Waypoints className="w-5 h-5"/>, color: 'sky',
        subTopics: [
            { title: 'Công thức & Phương trình', content: [
                 { level: 'Nhận biết', text: 'Áp dụng công thức lượng giác đơn giản, biến đổi biểu thức lượng giác, tính giá trị lượng giác.'},
                 { level: 'Vận dụng', text: 'Chứng minh đẳng thức lượng giác, giải phương trình phức tạp, bài toán hình học có bổ trợ lượng giác cơ bản.'},
            ]}
        ]
    },
    {
        grade: 11, title: 'Dãy số – Cấp số cộng, Cấp số nhân', percentage: '2.5%', examPart: 'Mức Nhận biết (Phần I hoặc Đúng/Sai)', icon: <ListChecks className="w-5 h-5"/>, color: 'slate',
        subTopics: [
            { title: 'CSC - CSN', content: [
                 { level: 'Nhận biết', text: 'Tính tổng các số hạng, số hạng bất kỳ.'},
                 { level: 'Vận dụng', text: 'Bài toán xác suất kết hợp với cấp số (ví dụ đề minh họa có câu “cấp số cộng kết hợp xác suất”), tối ưu dãy số, mô hình toán học về dãy.'},
            ]}
        ]
    },
    {
        grade: 11, title: 'Mũ – Lôgarit', percentage: '~5%', examPart: 'Mức Nhận biết (Phần I)', icon: <Variable className="w-5 h-5"/>, color: 'lime',
        subTopics: [
            { title: 'Tính chất & Phương trình', content: [
                 { level: 'Nhận biết', text: 'Tính giá trị log, mũ đơn giản, biến đổi tương ứng.'},
                 { level: 'Vận dụng', text: 'Giải phương trình/lôgarit phức hợp kết hợp đa thức, biến đổi lôgarit để tính tích phân đơn giản.'},
            ]}
        ]
    },
    {
        grade: 11, title: 'Xác suất cổ điển', percentage: '~5%', examPart: 'Mức Nhận biết (Phần I hoặc Đúng/Sai)', icon: <FlaskConical className="w-5 h-5"/>, color: 'pink',
         subTopics: [
            { title: 'Biến cố & Tổ hợp', content: [
                 { level: 'Nhận biết', text: 'Tính xác suất cơ bản (ví dụ thí dụ rút bóng, quay vòng).'},
                 { level: 'Vận dụng', text: 'Kết hợp với tổ hợp để tính xác suất sự kiện phức tạp, hoặc tiền đề cho xác suất có điều kiện.'},
            ]}
        ]
    },
     {
        grade: 11, title: 'Lý thuyết đồ thị', percentage: '~2.5%', examPart: 'Mức Nhận biết (thường là ý Đúng/Sai)', icon: <ArrowDownRight className="w-5 h-5"/>, color: 'gray',
         subTopics: [
            { title: 'Khái niệm cơ bản', content: [
                 { level: 'Nhận biết', text: 'Giải thích khái niệm, tính số cạnh, bậc đỉnh. Ví dụ đề mẫu có 1 câu nhỏ ở Phần III (đúng/sai) liên quan đồ thị.'},
                 { level: 'Vận dụng', text: 'Ít xuất hiện. Có thể liên hệ đồ thị vào bài toán xác suất (đường đi ngẫu nhiên) hoặc giải thuật đếm.'},
            ]}
        ]
    },
];

interface AccordionItemProps {
    topic: any;
    isOpen: boolean;
    onToggle: () => void;
}
const AccordionItem: React.FC<AccordionItemProps> = ({ topic, isOpen, onToggle }) => {
    const colorClass = `text-${topic.color}-600`;
    const borderClass = `border-${topic.color}-500`;
    const bgClass = `bg-${topic.color}-50`;
    
    return (
        <div className={`border-b border-slate-200 last:border-b-0`}>
            <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>{topic.icon}</div>
                    <div>
                        <h4 className="font-bold text-slate-800">{topic.title}</h4>
                        <div className="flex items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-mono flex-wrap mt-1">
                            <span>Lớp {topic.grade}</span>
                            <span className="text-slate-300">•</span>
                            <span>Chiếm khoảng {topic.percentage}</span>
                            {topic.examPart && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-sans font-semibold text-indigo-600 flex items-center gap-1">
                                        <Target className="w-3 h-3"/>
                                        {topic.examPart}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                 <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className={`p-4 bg-white border-l-4 ${borderClass} ml-4 pl-6 mb-4 animate-in fade-in`}>
                   {topic.subTopics.map((sub: any, index: number) => (
                       <div key={index} className="mb-4 last:mb-0">
                           <h5 className="font-bold text-slate-700">{sub.title}</h5>
                           <ul className="mt-2 space-y-2 text-sm text-slate-600 list-none pl-2">
                               {sub.content.map((item: any, idx: number) => (
                                   <li key={idx} className="flex items-start gap-2">
                                       <LevelTag level={item.level} />
                                       <span>{item.text}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>
                   ))}
                </div>
            )}
        </div>
    );
}

// --- MAIN COMPONENT ---

const ExamMatrixView: React.FC<{ isExpanded?: boolean }> = ({ isExpanded = false }) => {
    const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('analysis');

    const toggleTopic = (title: string) => {
        setExpandedTopics(prev => 
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const AnalysisContent = () => (
        <>
            <Section id="overview" title="Tổng quan cấu trúc đề thi" icon={<ClipboardList className="w-7 h-7 text-blue-600" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Cấu trúc" value="3 Phần" description="Trắc nghiệm 4 lựa chọn, Đúng/Sai, và Trả lời ngắn." icon={<Grid3X3 className="w-6 h-6" />} color="blue" />
                    <StatCard title="Số lượng" value="34 Ý/Bài" description="Tổng số câu hỏi và các ý nhỏ trong toàn bộ đề thi." icon={<Check className="w-6 h-6" />} color="emerald" />
                    <StatCard title="Thời gian" value="90 phút" description="Thời gian làm bài chính thức cho môn Toán." icon={<Gauge className="w-6 h-6" />} color="amber" />
                </div>
            </Section>

            <Section id="scope" title="Sơ đồ phân bố kiến thức (ước tính)" icon={<BookCopy className="w-7 h-7 text-sky-600" />}>
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-full bg-slate-100 rounded-full h-8 flex overflow-hidden mb-6 shadow-inner" title="Sơ đồ phân bố các chuyên đề trong đề thi">
                        {distributionData.map(item => (
                            <div key={item.name} style={{ width: `${item.value}%` }} className={`h-full ${item.color} transition-all duration-500`} />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
                        {distributionData.map(item => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`}></div>
                                <span className="text-slate-600 flex-1">{item.name}</span>
                                <span className={`font-bold font-mono ${item.text_color}`}>{item.value.toFixed(1).replace('.0', '')}%</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </Section>

            <Section id="levels" title="Phân bố theo cấp độ nhận thức" icon={<BrainCircuit className="w-7 h-7 text-amber-600" />}>
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-full bg-slate-100 rounded-full h-8 flex overflow-hidden mb-6 shadow-inner">
                        <div style={{ width: `70%` }} className={`h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold`}>
                            Nhận biết - Thông hiểu (~70%)
                        </div>
                        <div style={{ width: `30%` }} className={`h-full bg-rose-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold`}>
                            Vận dụng & VDC (~30%)
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                            <h4 className="font-bold text-emerald-800">Nhận biết - Thông hiểu (~70-75%)</h4>
                            <p className="text-emerald-700 mt-1">Gồm Phần I và nhiều ý trong Phần II. Yêu cầu nắm vững kiến thức SGK, áp dụng công thức trực tiếp, kỹ năng tính toán cơ bản.</p>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                            <h4 className="font-bold text-rose-800">Vận dụng & Vận dụng cao (~25-30%)</h4>
                            <p className="text-rose-700 mt-1">Gồm Phần III và các ý cuối của Phần II. Đòi hỏi kết hợp kiến thức, phân tích bài toán thực tế, tư duy sáng tạo, không có đáp án gợi ý.</p>
                        </div>
                    </div>
                 </div>
            </Section>

            <Section id="detailed-analysis" title="Phân tích chi tiết theo chuyên đề" icon={<Telescope className="w-7 h-7 text-indigo-600" />}>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {detailedTopics.map(topic => (
                        <AccordionItem 
                            key={topic.title} 
                            topic={topic} 
                            isOpen={expandedTopics.includes(topic.title)}
                            onToggle={() => toggleTopic(topic.title)}
                        />
                    ))}
                </div>
            </Section>
        </>
    );

    const SampleExamContent = () => (
        <div className={`bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm prose prose-slate max-w-none ${isExpanded ? 'prose-lg' : ''}`}>
            <header className="text-center not-prose mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">ĐỀ THI CHÍNH THỨC TỐT NGHIỆP THPT 2025</h1>
                <p className="font-semibold mt-1">Môn thi: TOÁN</p>
                <div className="flex justify-between items-center text-sm mt-4 max-w-sm mx-auto">
                    <span>(Đề thi có 04 trang)</span>
                    <b className="px-3 py-1 bg-slate-100 rounded-md">Mã đề: 0122</b>
                </div>
            </header>
            
            <p className="text-center text-sm"><i>Thời gian làm bài: 90 phút, không kể thời gian phát đề</i></p>
            
            <hr className="my-6"/>
            
            <MathText Component="div" className="space-y-6" content={`
                <h4><b>PHẦN I. Trắc nghiệm nhiều lựa chọn (12 câu)</b></h4>
                <p><b>Câu 1:</b> Trong không gian với hệ tọa độ Oxyz, một vectơ pháp tuyến của mặt phẳng đi qua gốc tọa độ và nhận $\\vec{n}=(-1;0;3)$ làm một vectơ pháp tuyến có phương trình là</p>
                <p><b>A.</b> $-x+3z=0$. &emsp; <b>B.</b> $-x-3y=0$. &emsp; <b>C.</b> $-x+3z=0$. &emsp; <b>D.</b> $-y+3z=0$.</p>
                
                <p><b>Câu 2:</b> Tập nghiệm của phương trình $\\sin x = 1$ là</p>
                <p><b>A.</b> $S=\\{\\frac{\\pi}{2}+k\\pi | k \\in \\mathbb{Z}\\}$. &emsp; <b>B.</b> $S=\\{k2\\pi | k \\in \\mathbb{Z}\\}$.</p>
                <p><b>C.</b> $S=\\{\\frac{\\pi}{2}+k2\\pi | k \\in \\mathbb{Z}\\}$. &emsp; <b>D.</b> $S=\\{-\\frac{\\pi}{2}+k2\\pi | k \\in \\mathbb{Z}\\}$.</p>
                
                <p><b>Câu 3:</b> Trong mặt phẳng với hệ tọa độ Oxy, diện tích S của hình phẳng giới hạn bởi đồ thị hàm số $y=2x+1$, trục hoành và hai đường thẳng $x=1, x=2$ được xác định bằng công thức</p>
                <p><b>A.</b> $S = \\int_{1}^{2}(2x+1)dx$. &emsp; <b>B.</b> $S = \\int_{1}^{2}|2x+1|dx$. &emsp; <b>C.</b> $S = \\pi\\int_{1}^{2}(2x+1)dx$. &emsp; <b>D.</b> $S = \\pi\\int_{1}^{2}(2x+1)^2dx$.</p>

                <p><b>Câu 4:</b> Cho hình chóp tứ giác đều S.ABCD (xem hình dưới). Gọi O là giao điểm của AC và BD. Phát biểu nào sau đây là đúng?</p>
            `}/>

            <PyramidShape />

            <MathText Component="div" className="space-y-6" content={`
                <p><b>A.</b> $SA+SB+SC+SD=4SO$. &emsp; <b>B.</b> $SA+SB+SC+SD=S D$.</p>
                <p><b>C.</b> $SA+SB+SC+SD=2SO$. &emsp; <b>D.</b> $SA+SB+SC+SD=S O$.</p>
                
                <p><b>Câu 5:</b> Nghiệm của phương trình $2^{x+1} = 8$ là</p>
                <p><b>A.</b> $x=2$. &emsp; <b>B.</b> $x=3$. &emsp; <b>C.</b> $x=1$. &emsp; <b>D.</b> $x=\\frac{5}{2}$.</p>
                
                <p><b>Câu 6:</b> Cho hình lăng trụ ABC.A'B'C' (xem hình dưới). Đường thẳng B'C' song song với mặt phẳng nào sau đây?</p>
            `}/>

            <PrismShape />

            <MathText Component="div" className="space-y-6" content={`
                <p><b>A.</b> $(B'BC)$. &emsp; <b>B.</b> $(AB'C')$. &emsp; <b>C.</b> $(ABC)$. &emsp; <b>D.</b> $(A'B'C')$.</p>

                <p><b>Câu 7:</b> Cho cấp số cộng $(u_n)$ với $u_1=2$ và công sai $d=3$. Giá trị của $u_4$ bằng</p>
                <p><b>A.</b> 14. &emsp; <b>B.</b> 12. &emsp; <b>C.</b> 17. &emsp; <b>D.</b> 15.</p>
                
                <p><b>Câu 8:</b> Trong không gian với hệ tọa độ Oxyz, cho mặt phẳng $(P): 2x - 4y + 3z - 9 = 0$. Vectơ nào sau đây là một vectơ pháp tuyến của mặt phẳng $(P)$?</p>
                <p><b>A.</b> $\\vec{n}=(2;4;-3)$. &emsp; <b>B.</b> $\\vec{n}=(2;4;3)$. &emsp; <b>C.</b> $\\vec{n}=(2;-4;3)$. &emsp; <b>D.</b> $\\vec{n}=(-2;4;3)$.</p>

                <p><b>Câu 9:</b> Họ nguyên hàm của hàm số $f(x) = \\sin x + \\cos x$ là</p>
                <p><b>A.</b> $-\\cos x + \\sin x + C$. &emsp; <b>B.</b> $\\cos x + \\sin x + C$. &emsp; <b>C.</b> $\\cos x - \\sin x + C$. &emsp; <b>D.</b> $-\\cos x - \\sin x + C$.</p>

                <p><b>Câu 10:</b> Cho hàm số $y=\\frac{ax+b}{cx+d}$ ($ac \\ne 0, ad-bc \\ne 0$) có bảng biến thiên như dưới đây.</p>
            `}/>
            
            <VariationTable />

            <MathText Component="div" className="space-y-6" content={`
                <p>Đường tiệm cận đứng của đồ thị hàm số đã cho có phương trình là</p>
                <p><b>A.</b> $x=-2$. &emsp; <b>B.</b> $y=-2$. &emsp; <b>C.</b> $x=2$. &emsp; <b>D.</b> $y=1$.</p>

                <p><b>Câu 11:</b> Một người chia thời lượng (đơn vị: giây) thực hiện các cuộc gọi điện thoại của mình trong một tuần thành sáu nhóm và lập bảng tần số ghép nhóm như sau.</p>
            `}/>

            <FrequencyTable />

            <MathText Component="div" className="space-y-6" content={`
                <p>Tứ phân vị thứ ba $Q_3$ (đơn vị: giây) của mẫu số liệu ghép nhóm trên bằng</p>
                <p><b>A.</b> 105. &emsp; <b>B.</b> 100. &emsp; <b>C.</b> 90. &emsp; <b>D.</b> 95.</p>

                <p><b>Câu 12:</b> Cho khối chóp O.ABC có OA vuông góc với mặt phẳng (ABC), tam giác ABC vuông tại A và $OA=2, AB=3, AC=6$. Thể tích của khối chóp O.ABC bằng</p>
                <p><b>A.</b> 18. &emsp; <b>B.</b> 36. &emsp; <b>C.</b> 6. &emsp; <b>D.</b> 12.</p>
                
                <hr class="my-6"/>

                <h4><b>PHẦN II. Trả lời trắc nghiệm Đúng/Sai (4 câu)</b></h4>
                <p><b>Câu 1:</b> Một phần mềm nhận dạng tin nhắn quảng cáo trên điện thoại bằng cách dựa theo từ khóa để đánh dấu một số tin nhắn được gửi đến. Qua một thời gian dài sử dụng, người ta thấy rằng trong số tất cả các tin nhắn gửi đến, có 20% số tin nhắn bị đánh dấu. Trong số các tin nhắn bị đánh dấu, có 10% số tin nhắn không phải là quảng cáo. Trong số các tin nhắn không bị đánh dấu, có 10% số tin nhắn là quảng cáo. Chọn ngẫu nhiên một tin nhắn được gửi đến điện thoại.</p>
                <p><b>a)</b> Xác suất để tin nhắn đó không bị đánh dấu bằng 0,8.</p>
                <p><b>b)</b> Xác suất để tin nhắn đó không phải là quảng cáo, biết rằng nó không bị đánh dấu, bằng 0,95.</p>
                <p><b>c)</b> Xác suất để tin nhắn đó không phải là quảng cáo bằng 0,76.</p>
                <p><b>d)</b> Xác suất để tin nhắn đó không bị đánh dấu, biết rằng nó không phải là quảng cáo, nhỏ hơn 0,95.</p>
                
                <p><b>Câu 2:</b> Cho hàm số $f(x)=x^3-27x+81$.</p>
                <p><b>a)</b> Hàm số đã cho có đạo hàm là $f'(x)=3x^2-27$.</p>
                <p><b>b)</b> Phương trình $f'(x)=0$ có tập nghiệm là $S=\\{-3\\}$.</p>
                
                <p><b>Câu 3:</b> Đối với ngành nuôi trồng thủy sản, việc kiểm soát lượng thuốc tồn dư trong nước là một nhiệm vụ quan trọng nhằm đáp ứng các tiêu chuẩn an toàn về môi trường. Khi nghiên cứu một loại thuốc trị bệnh trong nuôi trồng thủy sản, người ta sử dụng thuốc đó một lần và theo dõi nồng độ thuốc tồn dư trong nước kể từ lúc sử dụng thuốc. Kết quả cho thấy nồng độ thuốc $y(t)$ (đơn vị: mg/lít) tồn dư trong nước tại thời điểm $t$ ngày ($t \\ge 0$) kể từ lúc sử dụng thuốc, thỏa mãn $y'(t) \\ge 0$ và $y'(t)=k \\cdot y(t)$ ($t \\ge 0$), trong đó $k$ là hằng số khác không. Đo nồng độ thuốc tồn dư trong nước tại các thời điểm $t=6$ (ngày); $t=12$ (ngày) nhận được kết quả lần lượt là 2 mg/lít; 1 mg/lít. Cho biết $y(t) = e^{kt}y(0)$.</p>
                <p><b>a)</b> $g(t) = kt+C (t \\ge 0)$ với $C$ là một hằng số xác định.</p>
                <p><b>b)</b> $k = -\\frac{\\ln 2}{6}$.</p>
                <p><b>c)</b> $C=3\\ln 2$.</p>
                <p><b>d)</b> Nồng độ thuốc tồn dư trong nước tại thời điểm $t=20$ (ngày) kể từ lúc sử dụng thuốc lớn hơn 0,4 mg/lít.</p>

                <p><b>Câu 4:</b> Mô hình toán học sau đây được sử dụng trong quan sát chuyển động của một vật. Trong không gian cho hệ tọa độ Oxyz có $\\vec{i}, \\vec{j}, \\vec{k}$ lần lượt là các vectơ đơn vị trên các trục Ox, Oy, Oz và độ dài của mỗi vectơ đơn vị đó bằng 1 mét. Cho hai điểm A và B, trong đó điểm A có tọa độ là $(6;6;0)$. Một vật (coi như là một hạt) chuyển động thẳng với tốc độ phụ thuộc thời gian $t$ (giây) theo công thức $v(t) = \\beta t + 300$ (m/giây), trong đó $\\beta$ là hằng số dương và $0 \\le t \\le 6$. Ở thời điểm ban đầu ($t=0$), vật đi qua A với tốc độ 300 m/giây và hướng tới B. Sau 2 giây kể từ thời điểm ban đầu, vật đi được quãng đường 608 m. Gọi $\\vec{u}=(a;b;c)$ là vectơ cùng hướng với vectơ $\\vec{AB}$. Biết rằng $|\\vec{u}|=1$ và góc giữa vectơ $\\vec{u}$ lần lượt với các vectơ $\\vec{i}, \\vec{j}, \\vec{k}$ có số đo tương ứng bằng $60^\\circ, 60^\\circ, 45^\\circ$.</p>
                <p><b>a)</b> $a = \\cos 60^\\circ$.</p>
                <p><b>b)</b> Phương trình đường thẳng AB là $\\frac{x-6}{1}=\\frac{y-6}{1}=\\frac{z}{2}$.</p>
                <p><b>c)</b> $\\beta = 3$.</p>
                <p><b>d)</b> Giả sử sau 5 giây kể từ thời điểm ban đầu, vật đến điểm $B(x_B; y_B; z_B)$. Khi đó $x_B = 781$.</p>
                
                <hr class="my-6"/>

                <h4><b>PHẦN III. Trả lời ngắn (6 câu)</b></h4>
                <p><b>Câu 1:</b> Cho hình chóp S.ABCD có đáy ABCD là hình vuông với $AB=2$. Biết rằng hình chiếu vuông góc của S trên mặt phẳng (ABCD) là trọng tâm H của tam giác ABC và $SH=\\sqrt{2}$. Khoảng cách giữa hai đường thẳng AC và SD bằng bao nhiêu (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần trăm)?</p>

                <p><b>Câu 2:</b> Nếu một doanh nghiệp sản xuất $x$ sản phẩm trong một tháng ($x \\in \\mathbb{N}^*; 1 \\le x \\le 500$) thì doanh thu nhận được khi bán hết số sản phẩm đó là $F(x) = -0,01x^2 + 400x$ (nghìn đồng), trong khi chi phí sản xuất bình quân cho mỗi sản phẩm là $G(x) = \\frac{30000}{x} + 270$ (nghìn đồng). Giả sử số sản phẩm sản xuất ra luôn được bán hết. Trong một tháng, doanh nghiệp đó cần sản xuất ít nhất bao nhiêu sản phẩm để lợi nhuận thu được lớn hơn 100 triệu đồng?</p>

                <p><b>Câu 3:</b> Để đặt được một vật trang trí trên mặt bàn, người ta thiết kế một chân đế như sau. Lấy một khối gỗ có dạng khối chóp cụt tứ giác đều với độ dài hai cạnh đáy lần lượt bằng 7,4 cm và 10,4 cm, bề dày của khối gỗ bằng 1,5 cm. Sau đó khoét bỏ đi một phần của khối gỗ sao cho phần đó có dạng vật thể H, ở đó H nhận được bằng cách cắt khối cầu bán kính 5,7 cm bởi một mặt phẳng cắt mà mặt cắt là hình tròn bán kính 3,5 cm (xem hình dưới).</p>
                <div class="my-4 p-4 border border-dashed border-slate-300 rounded-md flex flex-col md:flex-row justify-center items-center gap-8 h-auto md:h-56 bg-slate-50">
                    <svg viewBox="0 0 160 120" class="h-32 md:h-full">
                        <polygon points="30,100 130,100 110,80 50,80" fill="#f5deb3" stroke="#8b4513" />
                        <polygon points="50,80 110,80 100,65 60,65" fill="#f5deb3" stroke="#8b4513" stroke-width="0.5"/>
                        <line x1="30" y1="100" x2="50" y2="80" stroke="#8b4513" />
                        <line x1="130" y1="100" x2="110" y2="80" stroke="#8b4513" />
                        <line x1="60" y1="65" x2="50" y2="80" stroke="#8b4513" stroke-dasharray="2,2"/>
                        <line x1="100" y1="65" x2="110" y2="80" stroke="#8b4513" stroke-dasharray="2,2"/>
                        <text x="80" y="110" text-anchor="middle" font-size="8">10,4 cm</text>
                        <text x="80" y="60" text-anchor="middle" font-size="8">7,4 cm</text>
                        <line x1="115" y1="80" x2="125" y2="80" stroke="black"/>
                        <line x1="120" y1="72" x2="120" y2="88" stroke="black"/>
                        <text x="130" y="78" font-size="8">1,5 cm</text>
                    </svg>
                    <svg viewBox="0 0 120 120" class="h-32 md:h-full">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="black"/>
                        <ellipse cx="60" cy="40" rx="30" ry="8" fill="#e0e0e0" stroke="black"/>
                        <line x1="60" y1="60" x2="60" y2="40" stroke="black" stroke-dasharray="2,2"/>
                        <line x1="60" y1="60" x2="95" y2="50" stroke="black"/>
                        <line x1="60" y1="40" x2="90" y2="40" stroke="black"/>
                        <text x="50" y="55" font-size="8">H</text>
                        <text x="65" y="65" font-size="8">O</text>
                        <text x="75" y="45" font-size="8">3,5 cm</text>
                        <text x="80" y="60" font-size="8">5,7 cm</text>
                    </svg>
                </div>

                <p>Thể tích của khối chân đế bằng bao nhiêu centimet khối (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười)?</p>

                <p><b>Câu 4:</b> Để gây quỹ từ thiện, câu lạc bộ thiện nguyện của một trường THPT tổ chức hoạt động bán hàng với hai mặt hàng là nước chanh và khoai chiên. Câu lạc bộ thiết kế hai thực đơn. Thực đơn 1 có giá 35 nghìn đồng, bao gồm hai cốc nước chanh và một túi khoai chiên. Thực đơn 2 có giá 55 nghìn đồng, bao gồm ba cốc nước chanh và hai túi khoai chiên. Biết rằng câu lạc bộ chỉ làm được không quá 105 cốc nước chanh và 100 túi khoai chiên. Số tiền lớn nhất mà câu lạc bộ có thể nhận được sau khi bán hết hàng bằng bao nhiêu nghìn đồng?</p>

                <p><b>Câu 5:</b> Bạn Nam tham gia cuộc thi giải một mật thư. Theo quy tắc của cuộc thi, người chơi cần chọn ra sáu số từ tập $S=\\{21;22;23;24;25;26;27;28;29\\}$ và xếp mỗi số vào đúng một vị trí trong sáu vị trí A,B,C,M,N,P như hình bên sao cho mỗi vị trí chỉ được xếp một số. Mật thư sẽ được giải nếu các bộ ba số xuất hiện ở những bộ ba vị trí (A,M,B);(B,N,C);(C,P,A) tạo thành các cấp số cộng theo thứ tự đó. Bạn Nam chọn ngẫu nhiên sáu số trong tập S và xếp ngẫu nhiên vào các vị trí được yêu cầu. Gọi xác suất để bạn Nam giải được mật thư ở lần chọn và xếp đó là a. Giá trị của $\\frac{2}{a}$ bằng bao nhiêu?</p>
                <div class="my-4 p-2 border border-dashed border-slate-300 rounded-md flex justify-center items-center h-48 bg-slate-50">
                    <svg viewBox="0 0 150 150" class="h-full">
                        <path d="M75 20 L25 110 L125 110 Z" fill="none" stroke="black" stroke-width="2"/>
                        <circle cx="75" cy="20" r="10" fill="white" stroke="black" stroke-width="2"/><text x="71" y="24">A</text>
                        <circle cx="25" cy="110" r="10" fill="white" stroke="black" stroke-width="2"/><text x="21" y="114">B</text>
                        <circle cx="125" cy="110" r="10" fill="white" stroke="black" stroke-width="2"/><text x="121" y="114">C</text>
                        <circle cx="50" cy="65" r="10" fill="white" stroke="black" stroke-width="2"/><text x="46" y="69">M</text>
                        <circle cx="75" cy="110" r="10" fill="white" stroke="black" stroke-width="2"/><text x="71" y="114">N</text>
                        <circle cx="100" cy="65" r="10" fill="white" stroke="black" stroke-width="2"/><text x="97" y="69">P</text>
                    </svg>
                </div>

                <p><b>Câu 6:</b> Có bốn ngăn (trong một giá để sách) được đánh số thứ tự 1,2,3,4 và tám quyển sách khác nhau. Bạn An xếp hết tám quyển sách vào bốn ngăn đó sao cho mỗi ngăn có ít nhất một quyển sách và các quyển sách được xếp thẳng đứng thành một hàng ngang với gáy sách quay ra ngoài ở mỗi ngăn. Khi đã xếp xong tám quyển sách, hai cách xếp của bạn An được gọi là giống nhau nếu chúng thỏa mãn đồng thời hai điều kiện sau đây:</p>
                <p>+ Với từng ngăn, số lượng quyển sách ở ngăn đó là như nhau trong cả hai cách xếp;</p>
                <p>+ Với từng ngăn, thứ tự từ trái sang phải của các quyển sách được xếp là như nhau trong cả hai cách xếp.</p>
                <p>Gọi T là số cách xếp đổi một khác nhau của bạn An. Giá trị của $\\frac{T}{600}$ bằng bao nhiêu?</p>

                <div class="text-center font-bold mt-8">- HẾT -</div>
                <div class="text-sm italic mt-4">
                    <p>- Thí sinh không được sử dụng tài liệu;</p>
                    <p>- Giám thị không giải thích gì thêm.</p>
                </div>
            `}/>
        </div>
    );

    return (
        <div className={`mx-auto py-8 transition-all duration-300 ${isExpanded ? 'max-w-7xl' : 'max-w-5xl'}`}>
            <header className="text-center mb-12">
                <div className="inline-block p-4 bg-indigo-100 rounded-2xl mb-4">
                    <Grid3X3 className="w-10 h-10 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Ma trận kiến thức Toán 12 - Kỳ thi TN THPT 2025</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                    Phân tích chi tiết cấu trúc, phạm vi và mức độ nhận thức của đề thi theo định hướng mới của Bộ GD&ĐT.
                </p>
            </header>

            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 mb-8">
                <div className="flex justify-center bg-slate-100 p-1 rounded-xl w-fit mx-auto shadow-sm">
                    <button 
                        onClick={() => setActiveTab('analysis')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Phân Tích Ma Trận
                    </button>
                    <button 
                        onClick={() => setActiveTab('sample')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sample' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Đề Minh Họa
                    </button>
                </div>
            </div>

            {activeTab === 'analysis' ? <AnalysisContent /> : <SampleExamContent />}

            <footer className="text-center mt-16 border-t border-slate-200 pt-8">
                <p className="text-sm font-bold text-slate-700 mb-2">
                    Tuyên bố miễn trừ trách nhiệm
                </p>
                <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                    Nội dung trên được tổng hợp và phân tích dựa trên ma trận đề thi minh họa và các tài liệu tham khảo công khai từ Bộ GD&ĐT cho kỳ thi TN THPT 2025. Các tỉ lệ và số câu chỉ mang tính chất tham khảo, có thể thay đổi trong đề thi chính thức.
                </p>
                <div className="mt-4 text-xs text-slate-400">
                    <span className="font-bold">Nguồn tham khảo:</span> giaoducthoidai.vn, daibieunhandan.vn, toanmath.com, thuvienphapluat.vn, tuyensinhso.vn, hocmai.vn.
                </div>
            </footer>
        </div>
    );
};

export default ExamMatrixView;
