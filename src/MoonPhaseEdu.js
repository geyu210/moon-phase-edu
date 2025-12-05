import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Info, HelpCircle, RefreshCw } from 'lucide-react';

const MoonPhaseEdu = () => {
    // 状态管理
    const [day, setDay] = useState(0); // 一年中的第几天 (0-365)
    const [isPlaying, setIsPlaying] = useState(false);

    // ⭐️ 速度调整：默认中速设为 0.05 (原本的慢速)
    const [speed, setSpeed] = useState(0.05);
    const requestRef = useRef();

    // 天文参数
    const ORBIT_EARTH_R = 210;
    const ORBIT_MOON_R = 65;
    const SUN_SIZE = 80;
    const EARTH_SIZE = 30;
    const MOON_SIZE = 18;

    // 核心周期
    const EARTH_YEAR = 365.25;
    const MOON_ZK = 29.53;

    // 动画循环
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

    // --- 数学计算部分 ---

    // 1. 计算地球位置
    const earthAngleRad = (day / EARTH_YEAR) * 2 * Math.PI;
    const earthX = Math.cos(earthAngleRad) * ORBIT_EARTH_R;
    const earthY = Math.sin(earthAngleRad) * ORBIT_EARTH_R;

    // 2. 计算月球位置
    const moonAngleRelative = (day / MOON_ZK) * 2 * Math.PI;
    const moonRelX = Math.cos(moonAngleRelative + earthAngleRad) * ORBIT_MOON_R;
    const moonRelY = Math.sin(moonAngleRelative + earthAngleRad) * ORBIT_MOON_R;
    const moonAbsX = earthX + moonRelX;
    const moonAbsY = earthY + moonRelY;

    // 3. 计算月相角度
    let phaseAngle = ((moonAngleRelative * 180 / Math.PI) + 180) % 360;
    if (phaseAngle < 0) phaseAngle += 360;

    // --- 获取月相名称 ---
    const getPhaseInfo = (angle) => {
        if (angle >= 350 || angle < 10) return { name: "新月 (New Moon)", desc: "月亮躲在太阳和地球中间，背对我们，所以看不见。" };
        if (angle >= 10 && angle < 80) return { name: "娥眉月 (Waxing Crescent)", desc: "太阳下山后，西方天空出现的弯弯眉毛。" };
        if (angle >= 80 && angle < 100) return { name: "上弦月 (First Quarter)", desc: "右半边亮了！这是农历初七或初八。" };
        if (angle >= 100 && angle < 170) return { name: "盈凸月 (Waxing Gibbous)", desc: "月亮越来越胖，马上就要圆啦！" };
        if (angle >= 170 && angle < 190) return { name: "满月 (Full Moon)", desc: "地球在中间，月亮最圆最亮！农历十五。" };
        if (angle >= 190 && angle < 260) return { name: "亏凸月 (Waning Gibbous)", desc: "月亮开始慢慢变瘦了。" };
        if (angle >= 260 && angle < 280) return { name: "下弦月 (Last Quarter)", desc: "左半边亮着，通常在后半夜出现。" };
        return { name: "残月 (Waning Crescent)", desc: "天快亮时出现在东方的细弯钩。" };
    };

    const phaseInfo = getPhaseInfo(phaseAngle);

    // --- 智能知识卡片 ---
    const getDynamicTip = () => {
        if (phaseInfo.name.includes("满月")) {
            return {
                icon: <HelpCircle className="text-yellow-400 shrink-0 mt-1" size={24} />,
                title: "🤔 为什么地球没挡住阳光？",
                content: "虽然月亮在地球背面，但它的轨道其实是歪的（倾斜的）！大多数时候，太阳光会从地球的“头顶”或“脚下”穿过去，直接照亮月亮，所以我们能看到圆圆的满月。",
                bg: "bg-blue-900/40 border-blue-500/30"
            };
        }
        if (phaseInfo.name.includes("新月") || phaseInfo.name.includes("残月")) {
            return {
                icon: <Info className="text-slate-400 shrink-0 mt-1" size={24} />,
                title: "💡 月亮为什么会发光？",
                content: "月亮自己不发光，它像一面大镜子，反射太阳的光。当它跑到太阳和地球中间时，背对我们的一面是亮的，对着我们的一面是黑的，所以我们就看不见它啦！",
                bg: "bg-slate-800 border-slate-700"
            };
        }
        return {
            icon: <RefreshCw className="text-green-400 shrink-0 mt-1" size={24} />,
            title: "🔒 为什么月亮总是一张脸？",
            content: "注意看左图月亮上的红点🔴！它始终盯着地球。这说明月亮在绕地球公转的同时，自己也在慢慢转身（自转）。它公转一圈和自转一圈的时间完全一样，这叫“潮汐锁定”。",
            bg: "bg-green-900/30 border-green-500/30"
        };
    };

    const currentTip = getDynamicTip();

    // 月相渲染组件
    const MoonPhaseVisual = ({ angle }) => {
        const theta = angle % 360;
        const isWaxing = theta <= 180;
        let scaleX = 0;
        if (theta <= 90) scaleX = -1 + (theta / 90);
        else if (theta <= 180) scaleX = (theta - 90) / 90;
        else if (theta <= 270) scaleX = 1 - (theta - 180) / 90;
        else scaleX = -((theta - 270) / 90);

        const isEllipseWhite = (theta > 90 && theta < 270);
        const ellipseColor = isEllipseWhite ? '#FDF6E3' : '#1a1a1a';
        const absScaleX = Math.abs(Math.cos(theta * Math.PI / 180));

        return (
            <div className="w-32 h-32 rounded-full bg-gray-900 relative overflow-hidden border-2 border-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <div className="absolute inset-0 bg-[#FDF6E3]" style={{ clipPath: isWaxing ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-full -translate-x-1/2 rounded-[50%]" style={{ backgroundColor: ellipseColor, transform: `translateX(-50%) scaleX(${absScaleX})`, zIndex: 10 }}></div>
            </div>
        );
    };

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

                {/* 左侧：上帝视角 */}
                <div className="flex-1 bg-slate-800/50 rounded-3xl p-6 border border-slate-700 relative overflow-hidden shadow-2xl min-h-[550px] lg:min-h-[600px]">
                    <div className="absolute top-4 left-4 bg-black/30 px-3 py-1 rounded-full text-xs text-yellow-200 border border-yellow-500/30 z-20">
                        🔭 上帝视角 (从太空往下看)
                    </div>

                    <div className="w-full h-full flex items-center justify-center relative">
                        {/* 太阳 */}
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
                            {/* 地球 */}
                            <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20">
                                <div style={{ width: EARTH_SIZE, height: EARTH_SIZE }} className="bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-black/60"
                                        style={{
                                            transform: `rotate(${earthAngleRad}rad)`,
                                            transformOrigin: 'center',
                                            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                                        }}
                                    ></div>
                                </div>
                                <div className="absolute top-full mt-2 text-xs font-bold text-blue-300 w-24 text-center -left-10 bg-black/30 rounded px-1">地球</div>
                            </div>

                            <div className="absolute rounded-full border border-slate-500/30 -translate-x-1/2 -translate-y-1/2" style={{ width: ORBIT_MOON_R * 2, height: ORBIT_MOON_R * 2 }}></div>

                            {/* 月球 */}
                            <div className="absolute z-30" style={{ transform: `translate(${moonRelX}px, ${moonRelY}px)` }}>
                                <div className="relative -translate-x-1/2 -translate-y-1/2">
                                    <div
                                        className="rounded-full relative overflow-hidden shadow-sm"
                                        style={{
                                            width: MOON_SIZE,
                                            height: MOON_SIZE,
                                            transform: `rotate(${Math.atan2(moonAbsY, moonAbsX)}rad)`
                                        }}
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#F4F6F0] from-50% to-black to-50%"></div>
                                    </div>

                                    {/* ✨ 修复：红点旋转逻辑 ✨ */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        style={{
                                            // 关键修正：加上地球公转角度，完美抵消参考系变化
                                            transform: `rotate(${moonAngleRelative + earthAngleRad}rad)`
                                        }}
                                    >
                                        <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_4px_rgba(239,68,68,0.9)] border-[0.5px] border-white/50" style={{ left: -2 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 flex flex-col gap-2 shadow-lg z-20">
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_orange]"></span> 太阳</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_blue]"></span> 地球</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> 月亮</div>
                        <div className="flex items-center gap-2 text-red-300"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> 月球正面 (永远朝向地球)</div>
                    </div>
                </div>

                {/* 右侧面板 */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-4 bg-indigo-800/50 px-4 py-1 rounded-full border border-indigo-400/30">
                                <span className="text-xl">👀</span>
                                <span className="text-sm font-bold text-indigo-100">从地球看月亮</span>
                            </div>
                            <div className="mb-6 scale-125 transform transition-transform duration-300 hover:scale-135 cursor-pointer" title="这是月亮现在的样子">
                                <MoonPhaseVisual angle={phaseAngle} />
                            </div>
                            <div className="text-center h-20">
                                <h2 className="text-2xl font-bold text-yellow-300 mb-2 transition-all">{phaseInfo.name}</h2>
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
                            <input
                                type="range" min="0" max={EARTH_YEAR} step="0.05" value={day}
                                onChange={(e) => { setIsPlaying(false); setDay(parseFloat(e.target.value)); }}
                                className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-yellow-400 hover:accent-yellow-300 transition-all"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'} shadow-lg active:scale-95`}>
                                {isPlaying ? <><Pause fill="currentColor" /> 暂停时间</> : <><Play fill="currentColor" /> 开始运行</>}
                            </button>
                            <div className="flex items-center gap-2 bg-slate-700 px-3 py-3 rounded-xl">
                                <span className="text-xs text-slate-400 whitespace-nowrap">速度:</span>
                                {/* ⭐️ 速度按钮重新映射：0.01 / 0.05 / 0.2 */}
                                <button onClick={() => setSpeed(0.01)} className={`w-8 h-8 rounded text-xs font-bold transition-colors ${speed === 0.01 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>慢</button>
                                <button onClick={() => setSpeed(0.05)} className={`w-8 h-8 rounded text-xs font-bold transition-colors ${speed === 0.05 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>中</button>
                                <button onClick={() => setSpeed(0.2)} className={`w-8 h-8 rounded text-xs font-bold transition-colors ${speed === 0.2 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'}`}>快</button>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl p-4 flex items-start gap-3 transition-colors duration-500 border min-h-[8rem] ${currentTip.bg}`}>
                        {currentTip.icon}
                        <div className="text-sm text-gray-200">
                            <strong className="text-yellow-200 block mb-1">{currentTip.title}</strong>
                            {currentTip.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonPhaseEdu;