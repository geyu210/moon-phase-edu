import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';

const MoonPhaseEdu = () => {
    const [day, setDay] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(0.5);
    const requestRef = useRef();

    const ORBIT_EARTH_R = 140;
    const ORBIT_MOON_R = 40;
    const SUN_SIZE = 50;
    const EARTH_SIZE = 20;
    const MOON_SIZE = 12;
    const EARTH_YEAR = 365.25;
    const MOON_ZK = 29.53;

    const animate = () => {
        setDay(prevDay => {
            const nextDay = prevDay + speed;
            return nextDay > EARTH_YEAR ? 0 : nextDay;
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, speed]);

    const earthAngleRad = (day / EARTH_YEAR) * 2 * Math.PI;
    const earthX = Math.cos(earthAngleRad) * ORBIT_EARTH_R;
    const earthY = Math.sin(earthAngleRad) * ORBIT_EARTH_R;

    const moonAngleRelative = (day / MOON_ZK) * 2 * Math.PI;
    const moonX = earthX + Math.cos(moonAngleRelative + earthAngleRad) * ORBIT_MOON_R;
    const moonY = earthY + Math.sin(moonAngleRelative + earthAngleRad) * ORBIT_MOON_R;

    let phaseAngle = (moonAngleRelative * 180 / Math.PI) % 360;
    if (phaseAngle < 0) phaseAngle += 360;

    const getPhaseInfo = (angle) => {
        if (angle < 20 || angle > 340) return { name: "新月 (New Moon)", desc: "月亮躲在太阳和地球中间，在这个角度我们看不见它。农历初一。" };
        if (angle >= 20 && angle < 80) return { name: "娥眉月 (Waxing Crescent)", desc: "太阳下山后，能在西方天空看到像眉毛一样的月亮。" };
        if (angle >= 80 && angle < 100) return { name: "上弦月 (First Quarter)", desc: "月亮变成半圆形啦！这是农历初七或初八。" };
        if (angle >= 100 && angle < 170) return { name: "盈凸月 (Waxing Gibbous)", desc: "月亮像个驼背，越来越胖，马上要圆了！" };
        if (angle >= 170 && angle < 190) return { name: "满月 (Full Moon)", desc: "地球在太阳和月亮之间，月亮最圆最亮！农历十五或十六。" };
        if (angle >= 190 && angle < 260) return { name: "亏凸月 (Waning Gibbous)", desc: "月亮开始慢慢变瘦了。" };
        if (angle >= 260 && angle < 280) return { name: "下弦月 (Last Quarter)", desc: "又是半个月亮，不过这次亮面在左边哦。农历二十二左右。" };
        return { name: "残月 (Waning Crescent)", desc: "天快亮时出现在东方，像个细细的字母 C。" };
    };

    const phaseInfo = getPhaseInfo(phaseAngle);

    // SVG 路径计算月相 (准确算法)
    function calculateMoonPath(angle) {
        const r = 49;
        const cx = 50;
        const cy = 50;
        const theta = angle % 360;

        if (theta < 0.1 || theta > 359.9) return "";
        if (Math.abs(theta - 180) < 0.1) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;

        const x = -Math.cos(theta * Math.PI / 180);
        const sweep = theta <= 180 ? 1 : 0;
        const rx = Math.abs(x * r);
        const sweepEll = theta < 90 || theta > 270 ? (sweep ? 0 : 1) : (sweep ? 1 : 0);

        let d = `M ${cx} ${cy - r} `;
        d += `A ${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} `;
        d += `A ${rx} ${r} 0 0 ${sweepEll} ${cx} ${cy - r}`;
        return d;
    }

    const MoonPhaseVisual = ({ angle }) => (
        <div className="w-32 h-32 rounded-full bg-gray-900 relative overflow-hidden border-2 border-gray-700 shadow-lg">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <circle cx="50" cy="50" r="49" fill="#1a1a1a" />
                <path d={calculateMoonPath(angle)} fill="#FDF6E3" stroke="none" />
            </svg>
        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white p-4 font-sans select-none">
            <header className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 tracking-wider">
                    🚀 月球探索行动
                </h1>
                <p className="text-slate-300 text-sm md:text-base">
                    你是小小宇航员，快来观察太阳、地球和月亮是怎么跳舞的吧！
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
                <div className="flex-1 bg-slate-800/50 rounded-3xl p-6 border border-slate-700 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-4 left-4 bg-black/30 px-3 py-1 rounded-full text-xs text-yellow-200 border border-yellow-500/30">
                        🔭 上帝视角 (从太空往下看)
                    </div>
                    <div className="w-full aspect-square relative flex items-center justify-center">
                        <div className="absolute z-10" style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-50 animate-pulse"></div>
                                <div style={{ width: SUN_SIZE, height: SUN_SIZE }} className="bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full shadow-[0_0_50px_rgba(255,200,0,0.6)] flex items-center justify-center">
                                    <span className="text-yellow-900 font-bold text-xs">太阳</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute w-full h-0 border-t border-dashed border-yellow-500/20 top-1/2 left-0 pointer-events-none"></div>
                        <div className="absolute rounded-full border border-slate-600/50" style={{ width: ORBIT_EARTH_R * 2, height: ORBIT_EARTH_R * 2 }}></div>
                        <div className="absolute" style={{ left: '50%', top: '50%', transform: `translate(${earthX}px, ${earthY}px)`, width: 0, height: 0 }}>
                            <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20">
                                <div style={{ width: EARTH_SIZE, height: EARTH_SIZE }} className="bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/60" style={{ transform: `rotate(${earthAngleRad}rad)`, transformOrigin: 'center', clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                                </div>
                                <div className="absolute top-full mt-1 text-[10px] text-blue-300 w-20 text-center -left-8">地球</div>
                            </div>
                            <div className="absolute rounded-full border border-slate-500/30 -translate-x-1/2 -translate-y-1/2" style={{ width: ORBIT_MOON_R * 2, height: ORBIT_MOON_R * 2 }}></div>
                            <div className="absolute z-30" style={{ transform: `translate(${Math.cos(moonAngleRelative) * ORBIT_MOON_R}px, ${Math.sin(moonAngleRelative) * ORBIT_MOON_R}px)` }}>
                                <div className="relative -translate-x-1/2 -translate-y-1/2">
                                    <div style={{ width: MOON_SIZE, height: MOON_SIZE }} className="bg-gray-300 rounded-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/80" style={{ transform: `rotate(${earthAngleRad + moonAngleRelative}rad)`, transformOrigin: 'center' }}></div>
                                        <div className="absolute inset-0 w-full h-full bg-black/70" style={{ transform: `rotate(${Math.atan2(moonY, moonX)}rad) rotate(90deg)`, transformOrigin: 'center', clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                        <div>🟡 太阳</div>
                        <div>🔵 地球 (我们的家)</div>
                        <div>⚪️ 月亮 (围着地球转)</div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-4 bg-indigo-800/50 px-4 py-1 rounded-full border border-indigo-400/30">
                                <span className="text-xl">👀</span>
                                <span className="text-sm font-bold text-indigo-100">从地球看月亮</span>
                            </div>
                            <div className="mb-6 scale-125 transform transition-transform duration-300 hover:scale-135 cursor-pointer">
                                <MoonPhaseVisual angle={phaseAngle} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-yellow-300 mb-2">{phaseInfo.name}</h2>
                                <p className="text-indigo-200 text-sm leading-relaxed px-4">{phaseInfo.desc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <RotateCcw size={18} /> 时间控制器
                        </h3>
                        <div className="mb-6">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>第 0 天</span>
                                <span>第 {Math.floor(day)} 天</span>
                                <span>1 年</span>
                            </div>
                            <input type="range" min="0" max={EARTH_YEAR} step="0.1" value={day} onChange={(e) => { setIsPlaying(false); setDay(parseFloat(e.target.value)); }} className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-400 hover:accent-yellow-300 transition-all" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg active:scale-95`}>
                                {isPlaying ? <><Pause fill="currentColor" /> 暂停时间</> : <><Play fill="currentColor" /> 开始运行</>}
                            </button>
                            <div className="flex items-center gap-2 bg-slate-700 px-3 py-3 rounded-xl">
                                <span className="text-xs text-slate-400 whitespace-nowrap">速度:</span>
                                <button onClick={() => setSpeed(0.2)} className={`w-8 h-8 rounded text-xs font-bold ${speed === 0.2 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>慢</button>
                                <button onClick={() => setSpeed(0.5)} className={`w-8 h-8 rounded text-xs font-bold ${speed === 0.5 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>中</button>
                                <button onClick={() => setSpeed(1.5)} className={`w-8 h-8 rounded text-xs font-bold ${speed === 1.5 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>快</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
                        <Info className="text-yellow-500 shrink-0 mt-1" size={20} />
                        <div className="text-sm text-yellow-100/80">
                            <strong>你知道吗？</strong> <br />
                            月亮其实不会发光，它像一面镜子，反射太阳的光。因为月亮围着地球转，我们看到亮亮的部分（被太阳照到的部分）形状就在不停变化！
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonPhaseEdu;