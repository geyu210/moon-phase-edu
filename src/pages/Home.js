// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                欢迎来到天文实验室
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                <Link to="/moon" className="group relative overflow-hidden bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-500/20">
                    <h2 className="text-2xl font-bold text-yellow-300 mb-2 group-hover:scale-105 transition-transform">🌕 月相变化</h2>
                    <p className="text-slate-400">探索为什么月亮会有阴晴圆缺？太阳和地球在其中扮演了什么角色？</p>
                </Link>
                <Link to="/escape" className="group relative overflow-hidden bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-blue-400 transition-all hover:shadow-2xl hover:shadow-blue-500/20">
                    <h2 className="text-2xl font-bold text-blue-400 mb-2 group-hover:scale-105 transition-transform">🚀 逃逸速度</h2>
                    <p className="text-slate-400">想要飞出地球需要多大的力气？模拟火箭发射，挑战引力束缚！</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;
