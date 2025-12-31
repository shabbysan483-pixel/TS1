
import React, { useState, useEffect } from 'react';
import MathApp from './MathApp';
import EnglishApp from './EnglishApp';
import LoginScreen from './components/LoginScreen';
import { Calculator, Globe, ArrowRight, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { auth, handleLogout } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type Subject = 'home' | 'math' | 'english';

const App: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not logged in, show Login Screen
  if (!user) {
    return <LoginScreen />;
  }

  // Render Subject Apps
  if (currentSubject === 'math') {
    return <MathApp onSwitchSubject={() => setCurrentSubject('home')} />;
  }

  if (currentSubject === 'english') {
    return <EnglishApp onSwitchSubject={() => setCurrentSubject('home')} />;
  }

  // Welcome / Home Screen
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* User Header */}
      <header className="flex justify-between items-center z-20 mb-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <Sparkles className="w-5 h-5 text-yellow-500" />
           <span className="font-bold text-slate-700 text-lg tracking-tight">LearningHub</span>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-slate-200">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-100" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon className="w-4 h-4" />
                    </div>
                )}
                <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-700 leading-none">{user.displayName || 'Học viên'}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-0.5">Free Plan</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="p-2.5 bg-white text-red-500 rounded-full hover:bg-red-50 hover:shadow-md transition-all border border-slate-200"
                title="Đăng xuất"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tight">
            Chào mừng trở lại,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {user.displayName?.split(' ')[0] || 'Bạn'}!
            </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Hôm nay bạn muốn chinh phục kiến thức nào?
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Math Card */}
            <button
            onClick={() => setCurrentSubject('math')}
            className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-100 text-left overflow-hidden"
            >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Calculator className="w-40 h-40 text-blue-600" />
            </div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Calculator className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">Toán Học</h2>
                <p className="text-slate-500 mb-8 font-medium">MathMaster 12</p>
                
                <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Khảo sát hàm số & Tích phân</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Hình học Oxyz</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span>Luyện đề thi thử 2025</span>
                </div>
                </div>

                <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                Bắt đầu học <ArrowRight className="w-5 h-5" />
                </div>
            </div>
            </button>

            {/* English Card */}
            <button
            onClick={() => setCurrentSubject('english')}
            className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-100 text-left overflow-hidden"
            >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Globe className="w-40 h-40 text-orange-600" />
            </div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                <Globe className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2 group-hover:text-orange-700 transition-colors">Tiếng Anh</h2>
                <p className="text-slate-500 mb-8 font-medium">EnglishMaster</p>
                
                <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                    <span>Từ vựng & Flashcards</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                    <span>Ngữ pháp chuyên sâu</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                    <span>Luyện viết & Dịch AI</span>
                </div>
                </div>

                <div className="flex items-center gap-2 text-orange-600 font-bold group-hover:gap-4 transition-all">
                Bắt đầu học <ArrowRight className="w-5 h-5" />
                </div>
            </div>
            </button>
        </div>
      </div>

      <footer className="mt-8 text-center text-slate-400 text-sm font-medium">
        © 2025 AI Learning Platform
      </footer>
    </div>
  );
};

export default App;
