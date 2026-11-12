import React from 'react';
import { Team, HistoryItem } from '../types';
import { 
  Trophy, 
  Medal, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Users, 
  Sparkles,
  Flame
} from 'lucide-react';

interface LeaderboardTabProps {
  teams: Team[];
  scores: Record<string, number>;
  history: HistoryItem[];
  className: string;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  teams,
  scores,
  history,
  className,
}) => {
  // Team scores
  const teamScores = teams.map((team) => {
    const total = team.students.reduce((sum, st) => sum + (scores[st] || 0), 0);
    const avg = team.students.length ? (total / team.students.length).toFixed(1) : '0';
    return {
      team,
      name: team.name,
      total,
      avg: parseFloat(avg),
      studentsCount: team.students.length,
    };
  });

  teamScores.sort((a, b) => b.total - a.total);

  const maxTeamScore = Math.max(...teamScores.map((t) => t.total), 20);

  // All students flat list sorted
  const allStudents = teams.flatMap((team) =>
    team.students.map((st) => ({
      name: st,
      teamName: team.name,
      points: scores[st] || 0,
    }))
  );

  allStudents.sort((a, b) => b.points - a.points);

  const topPositive = allStudents.slice(0, 5);
  const topNeedSupport = [...allStudents].reverse().slice(0, 4);

  // Statistics
  const totalClassPoints = Object.values(scores).reduce((a, b) => a + b, 0);
  const totalStudents = allStudents.length;
  const classAvg = totalStudents ? (totalClassPoints / totalStudents).toFixed(1) : '0';

  const barColors = [
    'bg-gradient-to-r from-amber-400 to-amber-500',
    'bg-gradient-to-r from-blue-400 to-blue-500',
    'bg-gradient-to-r from-indigo-400 to-indigo-500',
    'bg-gradient-to-r from-emerald-400 to-emerald-500',
  ];

  const medals = ['🥇 Hạng 1', '🥈 Hạng 2', '🥉 Hạng 3', '🏅 Hạng 4'];

  return (
    <div className="space-y-6">
      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Đội dẫn đầu</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 truncate">
            {teamScores[0]?.name || 'Chưa có'}
          </p>
          <span className="text-xs text-slate-500">
            {teamScores[0]?.total || 0} điểm tích lũy
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Học sinh tiêu biểu tuần</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 truncate">
            {topPositive[0]?.name || 'Chưa có'}
          </p>
          <span className="text-xs text-slate-500">
            +{topPositive[0]?.points || 0} điểm thi đua
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Điểm trung bình lớp</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {classAvg} <span className="text-xs font-medium text-slate-500">đ/bạn</span>
          </p>
          <span className="text-xs text-slate-500">Sĩ số: {totalStudents} học sinh</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Tổng lượt chấm</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900">{history.length}</p>
          <span className="text-xs text-slate-500">Ghi nhận trong tuần</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Xếp hạng Tổ Tuần này */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Bảng xếp hạng Tổ - Lớp {className} (Tuần này)</span>
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Cập nhật tức thời theo điểm số
            </span>
          </div>

          {/* Ranking bars */}
          <div className="space-y-4">
            {teamScores.map((t, idx) => {
              const percent = Math.min(Math.max((t.total / maxTeamScore) * 100, 15), 100);
              const colorClass = barColors[idx] || barColors[3];

              return (
                <div key={t.name} className="space-y-1.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                        {medals[idx]}
                      </span>
                      <span className="text-slate-800 text-base">{t.name}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({t.studentsCount} học sinh)
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-indigo-700 font-black text-lg">{t.total}</span>
                      <span className="text-xs text-slate-500">điểm</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className={`${colorClass} h-full rounded-full transition-all duration-700 shadow-sm`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 px-1">
                    <span>Trung bình mỗi học sinh: {t.avg} điểm</span>
                    <span>Tỉ lệ điểm: {Math.round(percent)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphical comparison block */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Biểu đồ so sánh trực quan điểm số các tổ</span>
            </h4>

            {/* Custom SVG Bar Graph */}
            <div className="h-44 w-full flex items-end justify-around gap-4 pt-6 px-4 bg-slate-50 rounded-2xl border border-slate-200">
              {teamScores.map((t, idx) => {
                const heightPercent = Math.max((t.total / maxTeamScore) * 100, 10);
                const colorClass = barColors[idx] || barColors[3];

                return (
                  <div key={t.name} className="flex flex-col items-center flex-1 max-w-[80px] h-full justify-end group">
                    <span className="text-xs font-black text-indigo-700 mb-1 group-hover:scale-110 transition-transform">
                      {t.total}đ
                    </span>
                    <div
                      className={`w-full ${colorClass} rounded-t-xl transition-all duration-700 shadow-md group-hover:opacity-90`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-xs font-bold text-slate-700 mt-2 truncate w-full text-center">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Top Positive & Need Support */}
        <div className="space-y-6">
          {/* Cá nhân tích cực nhất */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-emerald-800">
              <Medal className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                Cá nhân tích cực &amp; gương mẫu nhất
              </h3>
            </div>

            <ul className="divide-y divide-slate-100 text-sm">
              {topPositive.map((st, i) => (
                <li key={st.name} className="py-2.5 flex justify-between items-center group hover:bg-slate-50/80 px-1 rounded-lg transition">
                  <div className="flex items-center space-x-2.5 truncate pr-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-800' :
                      i === 1 ? 'bg-slate-100 text-slate-800' :
                      i === 2 ? 'bg-amber-50 text-amber-700' : 'text-slate-400'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                        {st.name}
                      </p>
                      <span className="text-[11px] text-slate-400">{st.teamName}</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 text-xs shrink-0">
                    +{st.points} đ
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cần kèm cặp / cố gắng */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                Cần cố gắng (Cần nhắc nhở &amp; rèn luyện)
              </h3>
            </div>

            <p className="text-[11px] text-slate-500">
              Học sinh cần giáo viên chủ nhiệm &amp; cán bộ lớp hỗ trợ, theo dõi sát nề nếp và học tập
            </p>

            <ul className="divide-y divide-slate-100 text-sm">
              {topNeedSupport.map((st, i) => (
                <li key={st.name} className="py-2.5 flex justify-between items-center group hover:bg-slate-50/80 px-1 rounded-lg transition">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                        {st.name}
                      </p>
                      <span className="text-[11px] text-slate-400">{st.teamName}</span>
                    </div>
                  </div>
                  <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 text-xs shrink-0">
                    {st.points} đ
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
