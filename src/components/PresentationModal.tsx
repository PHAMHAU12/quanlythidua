import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Team } from '../types';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  X, 
  PartyPopper, 
  Flame, 
  Star, 
  Award,
  Maximize2
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  appName?: string;
  className: string;
  topic: string;
  teams: Team[];
  scores: Record<string, number>;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  appName = 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU',
  className,
  topic,
  teams,
  scores,
  onClose,
}) => {
  const fireConfetti = () => {
    // Left & right cannons
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.1 },
      colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
    });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.9 },
      colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
    });
  };

  useEffect(() => {
    if (isOpen) {
      fireConfetti();
      const timer = setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 },
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate team scores & sort
  const teamScores = teams.map((team) => {
    const total = team.students.reduce((sum, st) => sum + (scores[st] || 0), 0);
    const avg = team.students.length ? (total / team.students.length).toFixed(1) : '0';
    // Find MVP in team
    let mvp = team.students[0] || '';
    let maxPt = -999;
    team.students.forEach((st) => {
      if ((scores[st] || 0) > maxPt) {
        maxPt = scores[st] || 0;
        mvp = st;
      }
    });
    return {
      team,
      total,
      avg,
      mvp,
      mvpPoints: maxPt,
    };
  });

  teamScores.sort((a, b) => b.total - a.total);

  // Overall Top Students
  const allStudents = teams.flatMap((t) =>
    t.students.map((st) => ({
      name: st,
      teamName: t.name,
      points: scores[st] || 0,
    }))
  );
  allStudents.sort((a, b) => b.points - a.points);
  const topStudents = allStudents.slice(0, 3);

  const rankStyles = [
    {
      badge: 'QUÁN QUÂN 🥇',
      border: 'border-amber-400',
      bg: 'bg-gradient-to-b from-amber-500/25 to-amber-950/40',
      glow: 'shadow-amber-500/30',
      accent: 'text-amber-300',
      tagBg: 'bg-amber-400 text-slate-950',
    },
    {
      badge: 'Á QUÂN 🥈',
      border: 'border-slate-300',
      bg: 'bg-gradient-to-b from-slate-400/20 to-slate-900/40',
      glow: 'shadow-slate-400/20',
      accent: 'text-slate-200',
      tagBg: 'bg-slate-300 text-slate-950',
    },
    {
      badge: 'HẠNG BA 🥉',
      border: 'border-amber-700',
      bg: 'bg-gradient-to-b from-amber-700/20 to-amber-950/40',
      glow: 'shadow-amber-700/20',
      accent: 'text-amber-500',
      tagBg: 'bg-amber-700 text-white',
    },
    {
      badge: 'HẠNG TƯ 🏅',
      border: 'border-indigo-600',
      bg: 'bg-gradient-to-b from-indigo-700/20 to-indigo-950/40',
      glow: 'shadow-indigo-600/20',
      accent: 'text-indigo-300',
      tagBg: 'bg-indigo-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-8 text-white select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Top Floating Controls */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4">
        <button
          onClick={fireConfetti}
          className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition shadow-sm active:scale-95"
        >
          <PartyPopper className="w-4 h-4" />
          <span>Bắn pháo hoa chúc mừng</span>
        </button>

        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-2xl border border-slate-700 transition"
          title="Đóng trình chiếu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Presentation Content */}
      <div className="w-full max-w-6xl space-y-8 my-auto py-4">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/40 text-amber-300 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>BẢNG VÀNG THI ĐUA - {appName.toUpperCase()}</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-100 bg-clip-text text-transparent drop-shadow-md">
            VINH DANH TỔ XUẤT SẮC - LỚP {className}
          </h2>

          <p className="text-sm sm:text-base text-indigo-200/90 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>{topic}</span>
          </p>
        </div>

        {/* 4 Teams Podiums / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamScores.map((item, idx) => {
            const style = rankStyles[idx] || rankStyles[3];
            const isFirst = idx === 0;

            return (
              <div
                key={item.team.id}
                className={`relative rounded-3xl border-2 ${style.border} ${style.bg} p-6 flex flex-col justify-between items-center text-center shadow-2xl ${style.glow} transform transition hover:scale-[1.02] backdrop-blur-md`}
              >
                {isFirst && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 p-2 rounded-2xl shadow-xl shadow-amber-400/50 animate-bounce">
                    <Crown className="w-6 h-6 fill-slate-950" />
                  </div>
                )}

                <div className="w-full space-y-3">
                  <div className="flex justify-center">
                    <span
                      className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${style.tagBg} shadow-sm`}
                    >
                      {style.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">{item.team.name}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {item.team.students.length} học sinh
                    </p>
                  </div>
                </div>

                {/* Score Number Display */}
                <div className="my-5">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className={`text-5xl sm:text-6xl font-black tracking-tight ${style.accent}`}>
                      {item.total}
                    </span>
                    <span className="text-sm text-slate-300 font-bold uppercase">điểm</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Trung bình: <span className="text-white font-semibold">{item.avg} đ/bạn</span>
                  </div>
                </div>

                {/* Team MVP / Star */}
                <div className="w-full pt-4 border-t border-white/10 text-left bg-black/20 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold uppercase">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>Chiến thần của đội:</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {item.mvp}
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      +{item.mvpPoints}đ
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top 3 Outstanding Individual Students of Class */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-200">
                Top 3 Cá nhân tích cực &amp; gương mẫu nhất (Toàn lớp {className})
              </h4>
            </div>
            <span className="text-xs text-slate-400">Tuyên dương tuần này</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topStudents.map((st, i) => {
              const med = ['🥇', '🥈', '🥉'][i];
              return (
                <div
                  key={st.name}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{med}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{st.name}</p>
                      <p className="text-xs text-slate-400">{st.teamName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-300">+{st.points}</span>
                    <span className="text-[11px] text-slate-400 block">điểm</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-6xl flex justify-center pt-4">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Trở về giao diện quản lý
        </button>
      </div>
    </div>
  );
};
