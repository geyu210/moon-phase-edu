// src/pages/EscapeVelocity.js
import React from 'react';

const EscapeVelocity = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">🚀 地球逃逸速度实验</h1>
            <p className="text-lg text-slate-300 max-w-2xl text-center">
                如果我把球向上扔得足够快，它还会掉下来吗？<br />
                在这个实验室里，我们将探索：需要多大的速度，才能摆脱地球引力，飞向宇宙深处！
            </p>
            {/* 这里未来放你的物理引擎和动画代码 */}
            <div className="mt-10 w-full max-w-4xl h-96 bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center text-slate-500">
                [ 物理模拟画布区域 ]
            </div>
        </div>
    );
};

export default EscapeVelocity;
