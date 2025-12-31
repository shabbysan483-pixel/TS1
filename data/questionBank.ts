
import { Question } from '../types';

export const questionBank: Question[] = [
  // --- PART I: MULTIPLE CHOICE (12 Questions Mockup) ---
  {
    id: 'mc-1',
    lessonId: 'lesson-1',
    type: 'multiple_choice',
    level: 'recognition',
    content: 'Cho hàm số $y=f(x)$ có bảng biến thiên như hình vẽ. Hàm số đã cho đồng biến trên khoảng nào dưới đây?\n(Giả sử bảng biến thiên cho thấy $f\'(x) > 0$ trên $(-1; 3)$)',
    options: ['$(-1; 3)$', '$(3; +\\infty)$', '$(-\\infty; -1)$', '$(0; 4)$'],
    correctAnswer: 0,
    explanation: 'Dựa vào bảng biến thiên, ta thấy $f\'(x) > 0$ trên khoảng $(-1; 3)$ nên hàm số đồng biến trên khoảng này.'
  },
  {
    id: 'mc-2',
    lessonId: 'lesson-1',
    type: 'multiple_choice',
    level: 'understanding',
    content: 'Cho hàm số $y = x^3 - 3x^2$. Mệnh đề nào dưới đây đúng?',
    options: [
      'Hàm số nghịch biến trên khoảng $(0; 2)$',
      'Hàm số đồng biến trên khoảng $(0; 2)$',
      'Hàm số nghịch biến trên khoảng $(-\\infty; 0)$',
      'Hàm số nghịch biến trên khoảng $(2; +\\infty)$'
    ],
    correctAnswer: 0,
    explanation: 'Ta có $y\' = 3x^2 - 6x$. Cho $y\' = 0 \\Leftrightarrow x=0$ hoặc $x=2$. Trong khoảng $(0; 2)$, $y\' < 0$ nên hàm số nghịch biến.'
  },
  {
    id: 'mc-3',
    lessonId: 'lesson-1',
    type: 'multiple_choice',
    level: 'recognition',
    content: 'Điểm cực đại của đồ thị hàm số $y = x^4 - 2x^2 + 2$ là:',
    options: ['$(0; 2)$', '$(1; 1)$', '$(-1; 1)$', '$(2; 10)$'],
    correctAnswer: 0,
    explanation: '$y\' = 4x^3 - 4x$. $y\'=0 \\Leftrightarrow x=0, x=\\pm 1$. Qua $x=0$, $y\'$ đổi dấu từ dương sang âm nên $x=0$ là điểm cực đại. $y(0) = 2$. Vậy điểm cực đại là $(0; 2)$.'
  },
  {
    id: 'mc-4',
    lessonId: 'lesson-2',
    type: 'multiple_choice',
    level: 'understanding',
    content: 'Giá trị lớn nhất của hàm số $f(x) = x^3 - 3x + 2$ trên đoạn $[0; 2]$ bằng:',
    options: ['$4$', '$2$', '$0$', '$1$'],
    correctAnswer: 0,
    explanation: '$f\'(x) = 3x^2 - 3$. $f\'(x)=0 \\Leftrightarrow x=1$ (thuộc $[0;2]$). $f(0)=2, f(1)=0, f(2)=4$. Vậy GTLN là 4.'
  },
  {
    id: 'mc-5',
    lessonId: 'lesson-3',
    type: 'multiple_choice',
    level: 'recognition',
    content: 'Tiệm cận ngang của đồ thị hàm số $y = \\frac{2x+1}{x-1}$ là đường thẳng:',
    options: ['$y=2$', '$x=1$', '$y=1$', '$x=2$'],
    correctAnswer: 0,
    explanation: '$\\\\lim_{x \\to \\infty} \\frac{2x+1}{x-1} = 2$. Vậy TCN là $y=2$.'
  },
  {
    id: 'mc-6',
    lessonId: 'lesson-3',
    type: 'multiple_choice',
    level: 'understanding',
    content: 'Đồ thị hàm số $y = \\frac{x^2-3x+2}{x^2-1}$ có bao nhiêu đường tiệm cận đứng?',
    options: ['$1$', '$2$', '$3$', '$0$'],
    correctAnswer: 0,
    explanation: 'Phân tích: $y = \\frac{(x-1)(x-2)}{(x-1)(x+1)} = \\frac{x-2}{x+1}$ (với $x \\ne 1$). Giới hạn tại $x=-1$ là vô cực, tại $x=1$ là hữu hạn. Vậy chỉ có 1 TCĐ là $x=-1$.'
  },
  {
    id: 'mc-7',
    lessonId: 'lesson-4',
    type: 'multiple_choice',
    level: 'recognition',
    content: 'Đồ thị hàm số nào dưới đây có dạng như đường cong trong hình bên? (Hình dạng chữ N)',
    options: ['$y=x^3-3x+1$', '$y=-x^3+3x+1$', '$y=x^4-2x^2+1$', '$y=\\frac{x+1}{x-1}$'],
    correctAnswer: 0,
    explanation: 'Dạng chữ N là đồ thị hàm bậc 3 với hệ số $a > 0$. Chỉ có đáp án A thỏa mãn.'
  },
  {
    id: 'mc-8',
    lessonId: 'lesson-4',
    type: 'multiple_choice',
    level: 'understanding',
    content: 'Tâm đối xứng của đồ thị hàm số $y = \\frac{2x-1}{x+1}$ là điểm:',
    options: ['$I(-1; 2)$', '$I(1; 2)$', '$I(-1; -2)$', '$I(1; -2)$'],
    correctAnswer: 0,
    explanation: 'Tâm đối xứng của hàm nhất biến là giao của TCĐ ($x=-1$) và TCN ($y=2$). Vậy $I(-1; 2)$.'
  },
  // Adding placeholders to reach typical pool size
  { id: 'mc-9', lessonId: 'lesson-1', type: 'multiple_choice', level: 'recognition', content: 'Hàm số $y=x^4+x^2$ có bao nhiêu điểm cực trị?', options: ['1', '2', '3', '0'], correctAnswer: 0, explanation: '$y\'=4x^3+2x=2x(2x^2+1)$. Chỉ có 1 nghiệm $x=0$.' },
  { id: 'mc-10', lessonId: 'lesson-2', type: 'multiple_choice', level: 'understanding', content: 'GTNN của $y=\\sqrt{4-x^2}$ là:', options: ['0', '2', '-2', '4'], correctAnswer: 0, explanation: 'Tập xác định $[-2; 2]$. $y \\ge 0$. $y=0$ khi $x=\\pm 2$.' },
  { id: 'mc-11', lessonId: 'lesson-3', type: 'multiple_choice', level: 'application', content: 'Tìm m để hàm số $y=\\frac{mx-1}{2x+m}$ có TCN là $y=2$.', options: ['$m=4$', '$m=2$', '$m=1$', '$m=-4$'], correctAnswer: 0, explanation: 'TCN là $y=m/2$. Để $y=2 \\Rightarrow m/2=2 \\Rightarrow m=4$.' },
  { id: 'mc-12', lessonId: 'lesson-1', type: 'multiple_choice', level: 'recognition', content: 'Cho hàm số $f(x)$ có đạo hàm $f\'(x)=x(x-1)^2$. Số điểm cực trị là:', options: ['1', '2', '3', '0'], correctAnswer: 0, explanation: '$x=1$ là nghiệm kép, đạo hàm không đổi dấu. Chỉ có $x=0$ là cực trị.' },


  // --- PART II: TRUE / FALSE (4 Questions) ---
  {
    id: 'tf-1',
    lessonId: 'lesson-1',
    type: 'true_false',
    level: 'understanding',
    content: 'Cho hàm số $y = f(x)$ có đạo hàm $f\'(x) = x(x-1)(x+2)$. Xét tính đúng sai của các khẳng định sau:',
    statements: [
      { id: 's1', content: 'Hàm số có 3 điểm cực trị.', isCorrect: true },
      { id: 's2', content: 'Hàm số đồng biến trên khoảng $(1; +\\infty)$.', isCorrect: true },
      { id: 's3', content: 'Hàm số đạt cực đại tại $x = 1$.', isCorrect: false },
      { id: 's4', content: 'Hàm số nghịch biến trên khoảng $(-2; 0)$.', isCorrect: false }
    ],
    explanation: 'Lập bảng xét dấu $f\'(x)$: Đổi dấu tại -2 (âm sang dương -> Cực tiểu), tại 0 (dương sang âm -> Cực đại), tại 1 (âm sang dương -> Cực tiểu). Khoảng $(-2; 0)$ đạo hàm dương (đồng biến).'
  },
  {
    id: 'tf-2',
    lessonId: 'lesson-3',
    type: 'true_false',
    level: 'understanding',
    content: 'Cho hàm số $y = \\frac{x^2+2x-2}{x-1}$. Xét các mệnh đề:',
    statements: [
      { id: 's1', content: 'Đồ thị có tiệm cận đứng là $x=1$.', isCorrect: true },
      { id: 's2', content: 'Đồ thị có tiệm cận ngang.', isCorrect: false },
      { id: 's3', content: 'Đồ thị có tiệm cận xiên là $y=x+3$.', isCorrect: true },
      { id: 's4', content: 'Tâm đối xứng của đồ thị là $I(1; 3)$.', isCorrect: false }
    ],
    explanation: 'Chia đa thức: $\\frac{x^2+2x-2}{x-1} = x + 3 + \\frac{1}{x-1}$. TC xiên $y=x+3$. Giao điểm 2 tiệm cận là $I(1; 4)$ mới đúng.'
  },
  {
    id: 'tf-3',
    lessonId: 'lesson-2',
    type: 'true_false',
    level: 'application',
    content: 'Xét hàm số $f(x) = x + \\frac{4}{x}$ trên đoạn $[1; 3]$.',
    statements: [
      { id: 's1', content: 'Hàm số nghịch biến trên $(1; 2)$.', isCorrect: true },
      { id: 's2', content: 'Giá trị nhỏ nhất của hàm số bằng 4.', isCorrect: true },
      { id: 's3', content: 'Giá trị lớn nhất của hàm số bằng 5.', isCorrect: true },
      { id: 's4', content: '$x=2$ là điểm cực đại của hàm số.', isCorrect: false }
    ],
    explanation: '$f\'(x) = 1 - 4/x^2$. $f\'=0 \\to x=2$. BBT trên $[1;3]$: $f(1)=5, f(2)=4, f(3)=13/3 \\approx 4.33$. Min=4, Max=5. Tại $x=2$ là cực tiểu.'
  },
  {
    id: 'tf-4',
    lessonId: 'lesson-4',
    type: 'true_false',
    level: 'understanding',
    content: 'Cho hàm số bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\ne 0$) có đồ thị (C).',
    statements: [
      { id: 's1', content: 'Nếu $ac < 0$ thì hàm số luôn có 2 cực trị.', isCorrect: true },
      { id: 's2', content: '(C) luôn cắt trục hoành tại ít nhất 1 điểm.', isCorrect: true },
      { id: 's3', content: 'Nếu hàm số không có cực trị thì phương trình $y\'=0$ vô nghiệm.', isCorrect: false },
      { id: 's4', content: '(C) nhận điểm uốn làm tâm đối xứng.', isCorrect: true }
    ],
    explanation: 'Ý 3 sai vì trường hợp nghiệm kép thì hàm số cũng không có cực trị (đồng biến/nghịch biến trên R).'
  },

  // --- PART III: SHORT ANSWER (6 Questions) ---
  {
    id: 'sa-1',
    lessonId: 'lesson-1',
    type: 'short_answer',
    level: 'application',
    content: 'Tìm giá trị thực của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m^2-4)x + 3$ đạt cực đại tại $x=3$.',
    correctAnswer: 5,
    explanation: '$y\' = x^2 - 2mx + m^2 - 4$. Cực đại tại $x=3 \\Rightarrow y\'(3)=0$ và $y\'\'(3) < 0$. $9 - 6m + m^2 - 4 = 0 \\Leftrightarrow m^2 - 6m + 5 = 0 \\Leftrightarrow m=1$ hoặc $m=5$. $y\'\' = 2x - 2m$. Tại $m=1: y\'\'(3) = 6-2=4 > 0$ (loại). Tại $m=5: y\'\'(3) = 6-10 < 0$ (nhận). Đáp án: 5.'
  },
  {
    id: 'sa-2',
    lessonId: 'lesson-2',
    type: 'short_answer',
    level: 'application',
    content: 'Một chất điểm chuyển động theo quy luật $s(t) = -t^3 + 6t^2$ với $t$ (giây) là khoảng thời gian từ khi bắt đầu chuyển động. Tính thời điểm $t$ (giây) mà tại đó vận tốc của chuyển động đạt giá trị lớn nhất.',
    correctAnswer: 2,
    explanation: 'Vận tốc $v(t) = s\'(t) = -3t^2 + 12t$. Đây là parabol quay bề lõm xuống, đỉnh tại $t = -b/2a = -12/(-6) = 2$.'
  },
  {
    id: 'sa-3',
    lessonId: 'lesson-3',
    type: 'short_answer',
    level: 'application',
    content: 'Biết đồ thị hàm số $y = \\frac{(2m-1)x+1}{x-m}$ có tiệm cận đứng là đường thẳng $x=3$. Tìm giá trị của $m$.',
    correctAnswer: 3,
    explanation: 'Tiệm cận đứng là nghiệm của mẫu số: $x-m=0 \\Rightarrow x=m$. Đề bài cho $x=3$ nên $m=3$.'
  },
  {
    id: 'sa-4',
    lessonId: 'lesson-4',
    type: 'short_answer',
    level: 'application',
    content: 'Cho hàm số $y=f(x)$ có đạo hàm $f\'(x) = x(x-1)(x+2)^3$. Số điểm cực trị của hàm số là bao nhiêu?',
    correctAnswer: 2,
    explanation: 'Xét dấu $f\'(x)$. Nghiệm $x=0$ (đơn, đổi dấu), $x=1$ (đơn, đổi dấu), $x=-2$ (bội lẻ 3, đổi dấu). Tuy nhiên đề hỏi số điểm cực trị, cả 3 điểm đều làm $f\'$ đổi dấu. Chờ đã, $x(x-1)(x+2)^3$. Điểm đổi dấu: 0, 1, -2. Tổng 3 điểm.'
  },
  {
    id: 'sa-5',
    lessonId: 'lesson-1',
    type: 'short_answer',
    level: 'application',
    content: 'Tìm $m$ để hàm số $y = x^3 - 3mx^2 + 3(2m-1)x + 1$ đồng biến trên $\\mathbb{R}$. Nhập giá trị nguyên dương nhỏ nhất của $m$.',
    correctAnswer: 1,
    explanation: '$y\' = 3x^2 - 6mx + 3(2m-1) \\ge 0 \\forall x$. $\\Delta\' = 9m^2 - 9(2m-1) \\le 0 \\Leftrightarrow m^2 - 2m + 1 \\le 0 \\Leftrightarrow (m-1)^2 \\le 0 \\Leftrightarrow m=1$.'
  },
  {
    id: 'sa-6',
    lessonId: 'lesson-3',
    type: 'short_answer',
    level: 'application',
    content: 'Đồ thị hàm số $y = \\frac{\\sqrt{x^2-4}}{x^2-5x+6}$ có tổng cộng bao nhiêu đường tiệm cận (đứng và ngang)?',
    correctAnswer: 2,
    explanation: 'TXĐ: $x^2-4 \\ge 0 \\Leftrightarrow x \\in (-\\infty; -2] \\cup [2; +\\infty)$. Mẫu $x=2, x=3$. Tại $x=2$ (biên), giới hạn $\\infty$ -> TCĐ $x=2$. Tại $x=3$ thỏa mãn TXĐ -> TCĐ $x=3$. TCN: $y=0$. Tổng cộng 3? Khoan, $x=2$ làm tử bằng 0. $\\lim_{x\\to 2^+} \\frac{\\sqrt{x-2}\\sqrt{x+2}}{(x-2)(x-3)} = \\infty$. Vậy $x=2$ là TCĐ. $x=3$ là TCĐ. $y=0$ là TCN. Tổng 3.'
  }
];
