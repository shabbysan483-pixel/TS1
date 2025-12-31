
import { Course } from '../types';

export const courseData: Course = {
  id: 'math-12-full',
  title: 'Toán 12: Chinh Phục Kỳ Thi',
  chapters: [
    {
      id: 'chapter-1',
      title: 'Chương 1: Ứng Dụng Đạo Hàm & Khảo Sát Hàm Số',
      description: 'Nền tảng giải tích lớp 12',
      lessons: [
        {
          id: 'c1-l1',
          title: 'Bài 1: Tính đơn điệu & Cực trị',
          description: 'Khảo sát sự biến thiên, tính đồng biến, nghịch biến và các điểm cực trị của hàm số.',
          icon: 'TrendingUp',
          sections: [
            {
              title: 'A. Tính đơn điệu của hàm số',
              blocks: [
                {
                  type: 'definition',
                  title: 'Định nghĩa',
                  content: `Giả sử hàm số $y = f(x)$ xác định trên $K$ ($K$ là khoảng, đoạn hoặc nửa khoảng).
                  \n- Hàm số $y = f(x)$ **đồng biến** (tăng) trên $K$ nếu $\\forall x_1, x_2 \\in K, x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.
                  \n- Hàm số $y = f(x)$ **nghịch biến** (giảm) trên $K$ nếu $\\forall x_1, x_2 \\in K, x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$.`
                },
                {
                  type: 'theorem',
                  title: 'Mối quan hệ với đạo hàm',
                  content: `Cho hàm số $y = f(x)$ có đạo hàm trên $K$.
                  \n- Nếu $f'(x) > 0$ với mọi $x \\in K$ thì hàm số **đồng biến** trên $K$.
                  \n- Nếu $f'(x) < 0$ với mọi $x \\in K$ thì hàm số **nghịch biến** trên $K$.
                  \n- Nếu $f'(x) = 0$ với mọi $x \\in K$ thì hàm số không đổi trên $K$.`
                }
              ]
            },
            {
              title: 'B. Cực trị của hàm số',
              blocks: [
                {
                  type: 'definition',
                  title: 'Định nghĩa cực trị',
                  content: `Cho hàm số $y=f(x)$ xác định và liên tục trên khoảng $(a;b)$ chứa điểm $x_0$.
                  \n- Nếu tồn tại $h > 0$ sao cho $f(x) < f(x_0)$ với mọi $x \\in (x_0-h; x_0+h) \\setminus \\{x_0\\}$ thì $x_0$ là điểm **cực đại**.
                  \n- Nếu tồn tại $h > 0$ sao cho $f(x) > f(x_0)$ với mọi $x \\in (x_0-h; x_0+h) \\setminus \\{x_0\\}$ thì $x_0$ là điểm **cực tiểu**.`
                }
              ]
            }
          ]
        },
        {
          id: 'c1-l2',
          title: 'Bài 2: GTLN & GTNN',
          description: 'Tìm Max, Min của hàm số trên một tập hợp xác định.',
          icon: 'Maximize',
          sections: [
            {
              title: 'Định nghĩa',
              blocks: [
                {
                  type: 'definition',
                  title: 'Max - Min',
                  content: `Cho hàm số $y=f(x)$ xác định trên $D$.
                  \n- Số $M$ là **giá trị lớn nhất** (GTLN) của $f(x)$ trên $D$ nếu:
                  $$ \\begin{cases} f(x) \\le M, \\forall x \\in D \\\\ \\exists x_0 \\in D, f(x_0) = M \\end{cases} $$
                  Kí hiệu: $M = \\max_{D} f(x)$.`
                }
              ]
            }
          ]
        },
        {
          id: 'c1-l3',
          title: 'Bài 3: Đường tiệm cận',
          description: 'Tiệm cận đứng, tiệm cận ngang và tiệm cận xiên của đồ thị hàm số.',
          icon: 'ArrowUpRight',
          sections: [
            {
              title: 'Các loại tiệm cận',
              blocks: [
                {
                  type: 'definition',
                  title: '1. Tiệm cận ngang (TCN)',
                  content: `Đường thẳng $y = y_0$ là TCN nếu $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$.`
                },
                {
                  type: 'definition',
                  title: '2. Tiệm cận đứng (TCĐ)',
                  content: `Đường thẳng $x = x_0$ là TCĐ nếu $\\lim_{x \\to x_0^+} f(x) = \\pm\\infty$ hoặc $\\lim_{x \\to x_0^-} f(x) = \\pm\\infty$.`
                },
                {
                  type: 'definition',
                  title: '3. Tiệm cận xiên (TCX)',
                  content: `Đường thẳng $y = ax + b$ ($a \\ne 0$) là TCX nếu $\\lim_{x \\to \\infty} [f(x) - (ax+b)] = 0$.`
                }
              ]
            }
          ]
        },
        {
          id: 'c1-l4',
          title: 'Bài 4: Khảo sát đồ thị hàm số',
          description: 'Nhận dạng và vẽ đồ thị các hàm số bậc ba, hàm phân thức hữu tỉ thường gặp.',
          icon: 'LineChart',
          sections: [
            {
              title: 'I. Đồ thị hàm số bậc ba',
              blocks: [
                {
                  type: 'definition',
                  title: 'Dạng đồ thị',
                  content: 'Tóm tắt hình dạng đồ thị hàm số bậc ba $y=ax^3+bx^2+cx+d$ dựa trên hệ số $a$ và biệt thức $\\Delta\'.',
                  visualType: 'cubic-summary'
                }
              ]
            },
            {
              title: 'II. Đồ thị hàm phân thức',
              blocks: [
                {
                  type: 'definition',
                  title: 'Hàm bậc nhất / bậc nhất',
                  content: 'Tóm tắt hình dạng đồ thị hàm số $y = \\frac{ax+b}{cx+d}$ theo dấu của $ad-bc$.',
                  visualType: 'rational-linear-summary'
                },
                {
                  type: 'definition',
                  title: 'Hàm bậc hai / bậc nhất',
                  content: 'Các dạng đồ thị hàm số $y = \\frac{ax^2+bx+c}{px+q}$ có tiệm cận đứng và tiệm cận xiên.',
                  visualType: 'rational-quadratic-summary'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chapter-2',
      title: 'Chương 2: Vectơ & Hệ Trục Tọa Độ Oxyz',
      description: 'Hình học không gian giải tích',
      lessons: [
        {
          id: 'c2-l1',
          title: 'Bài 1: Hệ trục Oxyz & Các phép toán',
          description: 'Khái niệm cơ bản về tọa độ điểm, vectơ và các phép toán cộng trừ nhân.',
          icon: 'Maximize',
          sections: [
            {
                title: 'I. Hệ trục tọa độ trong không gian',
                blocks: [
                    {
                        type: 'definition',
                        title: 'Hệ trục Oxyz',
                        content: `Hệ gồm 3 trục $Ox, Oy, Oz$ đôi một vuông góc với nhau tại điểm gốc $O$.
                        \n- Vectơ đơn vị: $\\vec{i} \\in Ox, \\vec{j} \\in Oy, \\vec{k} \\in Oz$.
                        \n- $|\\vec{i}| = |\\vec{j}| = |\\vec{k}| = 1$.`,
                        visualType: 'oxyz-axes'
                    },
                    {
                        type: 'theorem',
                        title: 'Tọa độ của vectơ và điểm',
                        content: `\n- $\\vec{u} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\Leftrightarrow \\vec{u} = (x; y; z)$.
                        \n- $\\vec{OM} = x\\vec{i} + y\\vec{j} + z\\vec{k} \\Leftrightarrow M(x; y; z)$.`
                    }
                ]
            },
            {
                title: 'II. Các công thức cần nhớ',
                blocks: [
                    {
                        type: 'definition',
                        title: 'Phép toán vectơ',
                        content: `Cho $\\vec{a} = (x_1; y_1; z_1)$ và $\\vec{b} = (x_2; y_2; z_2)$.
                        \n- $\\vec{a} \\pm \\vec{b} = (x_1 \\pm x_2; y_1 \\pm y_2; z_1 \\pm z_2)$.
                        \n- $k\\vec{a} = (kx_1; ky_1; kz_1)$.
                        \n- $\\vec{a} = \\vec{b} \\Leftrightarrow \\begin{cases} x_1=x_2 \\\\ y_1=y_2 \\\\ z_1=z_2 \\end{cases}$.`,
                        visualType: 'vector-operations'
                    },
                    {
                        type: 'step',
                        title: 'Tọa độ đặc biệt',
                        content: `Cho $A(x_A; y_A; z_A)$ và $B(x_B; y_B; z_B)$.
                        \n- Vectơ $\\vec{AB} = (x_B-x_A; y_B-y_A; z_B-z_A)$.
                        \n- Trung điểm $M$ của $AB$: $M(\\frac{x_A+x_B}{2}; \\frac{y_A+y_B}{2}; \\frac{z_A+z_B}{2})$.
                        \n- Trọng tâm $G$ tam giác $ABC$: $G(\\frac{x_A+x_B+x_C}{3}; \\frac{y_A+y_B+y_C}{3}; \\frac{z_A+z_B+z_C}{3})$.`
                    }
                ]
            }
          ]
        },
        {
          id: 'c2-l2',
          title: 'Bài 2: Tích vô hướng & Biểu thức tọa độ',
          description: 'Công thức tích vô hướng, độ dài, góc và ứng dụng trong không gian.',
          icon: 'ArrowUpRight',
          sections: [
            {
                title: 'I. Tích vô hướng (Dot Product)',
                blocks: [
                    {
                        type: 'definition',
                        title: 'Công thức tọa độ',
                        content: `Cho $\\vec{a} = (x_1; y_1; z_1)$ và $\\vec{b} = (x_2; y_2; z_2)$.
                        \n$$ \\vec{a} \\cdot \\vec{b} = x_1x_2 + y_1y_2 + z_1z_2 $$`
                    },
                    {
                        type: 'step',
                        title: 'Tính chất quan trọng',
                        content: `\n- $\\vec{a}^2 = |\\vec{a}|^2$.
                        \n- $\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0 \\Leftrightarrow x_1x_2 + y_1y_2 + z_1z_2 = 0$.`
                    }
                ]
            },
            {
                title: 'II. Các biểu thức tọa độ (Ứng dụng)',
                blocks: [
                    {
                        type: 'theorem',
                        title: '1. Độ dài vectơ & Khoảng cách',
                        content: `\n- Độ dài vectơ: $|\\vec{a}| = \\sqrt{x_1^2 + y_1^2 + z_1^2}$.
                        \n- Khoảng cách giữa 2 điểm $A, B$:
                        $$ AB = |\\vec{AB}| = \\sqrt{(x_B-x_A)^2 + (y_B-y_A)^2 + (z_B-z_A)^2} $$`
                    },
                    {
                        type: 'theorem',
                        title: '2. Góc giữa hai vectơ',
                        content: `$$ \\cos(\\vec{a}, \\vec{b}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|.|\\vec{b}|} = \\frac{x_1x_2 + y_1y_2 + z_1z_2}{\\sqrt{x_1^2+y_1^2+z_1^2} \\cdot \\sqrt{x_2^2+y_2^2+z_2^2}} $$
                        \n*Lưu ý:* $-1 \\le \\cos(\\vec{a}, \\vec{b}) \\le 1$.`
                    },
                    {
                        type: 'example',
                        title: 'Ví dụ minh họa',
                        content: `Cho $\\vec{a} = (1; 2; 1)$ và $\\vec{b} = (-1; 1; 2)$.
                        \n1. Tính $\\vec{a} \\cdot \\vec{b}$:
                        $$ 1.(-1) + 2.1 + 1.2 = -1 + 2 + 2 = 3 $$
                        \n2. Tính độ dài:
                        $$ |\\vec{a}| = \\sqrt{1^2+2^2+1^2} = \\sqrt{6} $$
                        $$ |\\vec{b}| = \\sqrt{(-1)^2+1^2+2^2} = \\sqrt{6} $$
                        \n3. Tính góc:
                        $$ \\cos(\\vec{a}, \\vec{b}) = \\frac{3}{\\sqrt{6}.\\sqrt{6}} = \\frac{3}{6} = \\frac{1}{2} \\Rightarrow (\\vec{a}, \\vec{b}) = 60^\\circ $$`
                    }
                ]
            }
          ]
        },
        {
          id: 'c2-l3',
          title: 'Bài 3: Tâm tỉ cự (Chuyên đề nâng cao)',
          description: 'Phương pháp giải nhanh các bài toán cực trị hình học Oxyz.',
          icon: 'TrendingUp',
          sections: [
            {
                title: 'I. Khái niệm Tâm tỉ cự',
                blocks: [
                    {
                        type: 'definition',
                        title: 'Định nghĩa',
                        content: `Cho $n$ điểm $A_1, A_2, ..., A_n$ và $n$ số thực $k_1, k_2, ..., k_n$ thỏa mãn $\\sum k_i \\ne 0$.
                        \nĐiểm $I$ được gọi là **tâm tỉ cự** của hệ điểm nếu:
                        $$ k_1\\vec{IA_1} + k_2\\vec{IA_2} + ... + k_n\\vec{IA_n} = \\vec{0} $$`,
                        visualType: 'barycentric-visual'
                    },
                    {
                        type: 'theorem',
                        title: 'Công thức tọa độ (Mẹo giải nhanh)',
                        content: `Tọa độ điểm $I(x_I; y_I; z_I)$ được tính nhanh bằng trung bình cộng có trọng số:
                        $$ \\begin{cases} x_I = \\frac{k_1x_1 + k_2x_2 + ... + k_nx_n}{k_1 + k_2 + ... + k_n} \\\\ y_I = \\frac{k_1y_1 + k_2y_2 + ... + k_ny_n}{k_1 + k_2 + ... + k_n} \\\\ z_I = \\frac{k_1z_1 + k_2z_2 + ... + k_nz_n}{k_1 + k_2 + ... + k_n} \\end{cases} $$
                        \n*Ví dụ:* Tâm tỉ cự của bộ 2 điểm $(A, 1), (B, 2)$ chính là điểm $I$ thỏa $\\vec{IA} + 2\\vec{IB} = \\vec{0} \\Rightarrow x_I = \\frac{x_A + 2x_B}{1+2}$.`
                    }
                ]
            },
            {
                title: 'II. Ứng dụng bài toán Min/Max',
                blocks: [
                    {
                        type: 'step',
                        title: 'Bài toán cơ bản',
                        content: `**Đề bài:** Tìm điểm $M$ thuộc mặt phẳng $(P)$ sao cho biểu thức $T = |k_1\\vec{MA_1} + k_2\\vec{MA_2} + ... + k_n\\vec{MA_n}|$ đạt giá trị nhỏ nhất.
                        \n**Phương pháp:**
                        \n1. Tìm tâm tỉ cự $I$ thỏa mãn $\\sum k_i\\vec{IA_i} = \\vec{0}$.
                        \n2. Biến đổi biểu thức vectơ:
                        $$ \\sum k_i\\vec{MA_i} = \\sum k_i(\\vec{MI} + \\vec{IA_i}) = (\\sum k_i)\\vec{MI} + \\vec{0} $$
                        \n3. Khi đó $T = |(\\sum k_i)\\vec{MI}| = |\\sum k_i| . MI$.
                        \n4. $T$ nhỏ nhất $\\Leftrightarrow MI$ nhỏ nhất $\\Leftrightarrow M$ là hình chiếu vuông góc của $I$ lên $(P)$.`
                    },
                    {
                        type: 'example',
                        title: 'Ví dụ minh họa',
                        content: `Cho $A(1;0;0), B(0;2;0), C(0;0;3)$. Tìm $M \\in (Oxy)$ để $|\\vec{MA} + \\vec{MB} + \\vec{MC}|$ nhỏ nhất.
                        \n*Giải:*
                        \n- Hệ số $k_1=k_2=k_3=1$. Tâm tỉ cự $I$ là trọng tâm $\\triangle ABC$.
                        \n- $I(\\frac{1}{3}; \\frac{2}{3}; 1)$.
                        \n- $M$ là hình chiếu của $I$ lên $(Oxy) \\Rightarrow z_M = 0$.
                        \n- Vậy $M(\\frac{1}{3}; \\frac{2}{3}; 0)$.`
                    }
                ]
            }
          ]
        },
        {
          id: 'c2-l4',
          title: 'Bài 4: Tích có hướng & Ứng dụng',
          description: 'Công thức tích có hướng, diện tích tam giác, thể tích khối đa diện.',
          icon: 'LineChart',
          sections: [
            {
                title: 'I. Định nghĩa Tích có hướng',
                blocks: [
                    {
                        type: 'definition',
                        title: 'Công thức & Kí hiệu',
                        content: `Tích có hướng của $\\vec{u}$ và $\\vec{v}$ là một vectơ, kí hiệu $[\\vec{u}, \\vec{v}]$ hoặc $\\vec{u} \\wedge \\vec{v}$.
                        \nCho $\\vec{u}=(x_1; y_1; z_1)$ và $\\vec{v}=(x_2; y_2; z_2)$.
                        \n$$ [\\vec{u}, \\vec{v}] = \\left( \\begin{vmatrix} y_1 & z_1 \\\\ y_2 & z_2 \\end{vmatrix}; \\begin{vmatrix} z_1 & x_1 \\\\ z_2 & x_2 \\end{vmatrix}; \\begin{vmatrix} x_1 & y_1 \\\\ x_2 & y_2 \\end{vmatrix} \\right) $$
                        \n$$ = (y_1z_2 - z_1y_2; z_1x_2 - x_1z_2; x_1y_2 - y_1x_2) $$`,
                        visualType: 'vector-cross'
                    },
                    {
                        type: 'step',
                        title: 'Mẹo bấm máy tính (Casio 580VN X)',
                        content: `1. **Nhập vectơ:**
                        \n- Menu -> 5 (Vector) -> 1 (VctA) -> 3 (Kích thước). Nhập $\\vec{u}$.
                        \n- OPTN -> 1 (Tạo vectơ) -> 2 (VctB) -> 3 (Kích thước). Nhập $\\vec{v}$.
                        \n2. **Tính tích có hướng:**
                        \n- AC để ra màn hình tính toán.
                        \n- OPTN -> 3 (VctA) -> x (Dấu nhân) -> OPTN -> 4 (VctB) -> =.
                        \n*Kết quả là vectơ tích có hướng.*`
                    },
                    {
                        type: 'theorem',
                        title: 'Tính chất cơ bản',
                        content: `\n- Vectơ $[\\vec{u}, \\vec{v}]$ vuông góc với cả $\\vec{u}$ và $\\vec{v}$.
                        \n- Độ dài: $|[\\vec{u}, \\vec{v}]| = |\\vec{u}|.|\\vec{v}|.\\sin(\\vec{u}, \\vec{v})$.
                        \n- Hai vectơ cùng phương $\\Leftrightarrow [\\vec{u}, \\vec{v}] = \\vec{0}$.
                        \n- Ba vectơ đồng phẳng $\\Leftrightarrow [\\vec{a}, \\vec{b}] \\cdot \\vec{c} = 0$.`
                    }
                ]
            },
            {
                title: 'II. Ứng dụng Hình học',
                blocks: [
                    {
                        type: 'step',
                        title: '1. Diện tích',
                        content: `**Diện tích tam giác ABC:**
                        $$ S_{ABC} = \\frac{1}{2} |[\\vec{AB}, \\vec{AC}]| $$
                        \n**Diện tích hình bình hành ABCD:**
                        $$ S_{HBH} = |[\\vec{AB}, \\vec{AD}]| $$`
                    },
                    {
                        type: 'step',
                        title: '2. Thể tích',
                        content: `**Thể tích khối hộp ABCD.A'B'C'D':**
                        $$ V = |[\\vec{AB}, \\vec{AD}] \\cdot \\vec{AA'}| $$
                        *(Trị tuyệt đối của Tích hỗn tạp)*
                        \n**Thể tích tứ diện ABCD:**
                        $$ V = \\frac{1}{6} |[\\vec{AB}, \\vec{AC}] \\cdot \\vec{AD}| $$`
                    },
                    {
                        type: 'example',
                        title: 'Ví dụ tính thể tích',
                        content: `Cho $A(1;0;0), B(0;1;0), C(0;0;1), D(1;1;1)$. Tính $V_{ABCD}$.
                        \n*Giải:*
                        \n- $\\vec{AB} = (-1;1;0)$, $\\vec{AC} = (-1;0;1)$, $\\vec{AD} = (0;1;1)$.
                        \n- $[\\vec{AB}, \\vec{AC}] = (1; 1; 1)$.
                        \n- $[\\vec{AB}, \\vec{AC}] \\cdot \\vec{AD} = 1.0 + 1.1 + 1.1 = 2$.
                        \n- $V = \\frac{1}{6}|2| = \\frac{1}{3}$.`
                    }
                ]
            }
          ]
        }
      ]
    }
  ]
};

export const formulaCourseData: Course = {
  id: 'formula-handbook',
  title: 'Sổ Tay Công Thức Toán Học',
  chapters: [
    {
      id: 'chapter-calculus-full',
      title: 'Giải Tích',
      description: 'Tổng hợp công thức Dãy số, Logarit, Giới hạn, Đạo hàm & Nguyên hàm',
      lessons: [
        {
          id: 'formula-l1',
          title: 'Cấp Số Cộng & Cấp Số Nhân',
          description: 'Bảng so sánh chi tiết công thức và tính chất',
          icon: 'TrendingUp',
          sections: [
            {
              title: 'Bảng So Sánh Công Thức',
              blocks: [
                {
                  type: 'definition',
                  title: '',
                  content: '', 
                  visualType: 'csc-csn-comparison'
                }
              ]
            }
          ]
        },
        {
          id: 'formula-log',
          title: 'Mũ & Logarit',
          description: 'Định nghĩa, quy tắc tính và đổi cơ số',
          icon: 'Calculator',
          sections: [
            {
              title: 'Bảng Tóm Tắt Logarit',
              blocks: [
                {
                   type: 'definition',
                   title: '',
                   content: '',
                   visualType: 'logarithm-sheet'
                }
              ]
            }
          ]
        },
        {
          id: 'formula-limits',
          title: 'Giới Hạn (Lim)',
          description: 'Giới hạn dãy số, hàm số và các giới hạn đặc biệt',
          icon: 'LineChart',
          sections: [
             {
                title: 'Bảng Tra Cứu Giới Hạn',
                blocks: [
                   {
                      type: 'definition',
                      title: '',
                      content: '',
                      visualType: 'limit-sheet'
                   }
                ]
             }
          ]
        },
        {
          id: 'formula-derivative',
          title: 'Bảng Đạo Hàm',
          description: 'Đạo hàm cơ bản và quy tắc đạo hàm hàm hợp',
          icon: 'LineChart',
          sections: [
             {
                title: 'Bảng Tra Cứu Đạo Hàm',
                blocks: [
                   {
                      type: 'definition',
                      title: '',
                      content: '',
                      visualType: 'derivative-sheet'
                   }
                ]
             }
          ]
        },
        {
          id: 'formula-integral',
          title: 'Bảng Nguyên Hàm',
          description: 'Nguyên hàm cơ bản và mở rộng',
          icon: 'LineChart',
          sections: [
             {
                title: 'Bảng Tra Cứu Nguyên Hàm',
                blocks: [
                   {
                      type: 'definition',
                      title: '',
                      content: '',
                      visualType: 'integral-sheet'
                   }
                ]
             }
          ]
        },
        {
          id: 'formula-integral-app',
          title: 'Ứng Dụng Tích Phân',
          description: 'Diện tích hình phẳng & Thể tích vật thể tròn xoay',
          icon: 'LineChart',
          sections: [
             {
                title: 'Các Ứng Dụng Tích Phân',
                blocks: [
                   {
                      type: 'definition',
                      title: '',
                      content: '',
                      visualType: 'integral-applications'
                   }
                ]
             }
          ]
        }
      ]
    },
    {
      id: 'chapter-statistics',
      title: 'Mẫu Số Liệu',
      description: 'Công thức thống kê mô tả cho mẫu số liệu',
      lessons: [
        {
            id: 'formula-stat-ungrouped',
            title: 'Mẫu Số Liệu Không Ghép Nhóm',
            description: 'Số trung bình, trung vị, tứ phân vị, phương sai, độ lệch chuẩn',
            icon: 'Grid3X3',
            sections: [
               {
                  title: 'Các số đặc trưng (Mẫu đơn)',
                  blocks: [
                     {
                        type: 'definition',
                        title: '',
                        content: '',
                        visualType: 'statistics-ungrouped'
                     }
                  ]
               }
            ]
        },
        {
            id: 'formula-stat-grouped',
            title: 'Mẫu Số Liệu Ghép Nhóm',
            description: 'Công thức tính các số đặc trưng cho bảng tần số ghép nhóm',
            icon: 'Grid3X3',
            sections: [
               {
                  title: 'Các số đặc trưng (Mẫu ghép nhóm)',
                  blocks: [
                     {
                        type: 'definition',
                        title: '',
                        content: '',
                        visualType: 'statistics-grouped'
                     }
                  ]
               }
            ]
        }
      ]
    },
    {
       id: 'chapter-combinatorics',
       title: 'Đại Số Tổ Hợp & Xác Suất',
       description: 'Quy tắc đếm, Hoán vị, Chỉnh hợp, Tổ hợp và Xác suất',
       lessons: [
         {
            id: 'formula-combinatorics',
            title: 'Tổ Hợp & Xác Suất',
            description: 'Quy tắc cộng, nhân, hoán vị, chỉnh hợp, tổ hợp và công thức xác suất',
            icon: 'Grid3X3',
            sections: [
               {
                  title: 'Công thức & Định nghĩa',
                  blocks: [
                     {
                        type: 'definition',
                        title: '',
                        content: '',
                        visualType: 'combinatorics-sheet'
                     }
                  ]
               }
            ]
         }
       ]
    }
  ]
};