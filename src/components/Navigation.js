import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Rocket, Home } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    // 辅助函数：判断当前是不是在这个页面，如果是，按钮高亮
    const isActive = (path) => location.pathname === path
        ? "bg-blue-600 text-white shadow-lg scale-105"
        : "bg-slate-700 text-slate-300 hover:bg-slate-600";

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold text-yellow-400 tracking-wider flex items-center gap-2">
                    🌌 星际实验室
                </div>
                <div className="flex gap-4">
                    <Link to="/" className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${isActive('/')}`}>
                        <Home size={18} /> 首页
                    </Link>
                    <Link to="/moon" className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${isActive('/moon')}`}>
                        <Moon size={18} /> 月相奥秘
                    </Link>
                    <Link to="/escape" className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${isActive('/escape')}`}>
                        <Rocket size={18} /> 逃逸速度
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
