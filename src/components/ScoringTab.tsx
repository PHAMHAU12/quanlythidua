import React, { useState } from 'react';
import { Team, UndoAction } from '../types';
import { 
  RotateCcw, 
  Search, 
  Users, 
  Plus, 
  Minus, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  Filter
} from 'lucide-react';

interface ScoringTabProps {
  teams: Team[];
  scores: Record<string, number>;
  currentWeek: string;
  undoStack: UndoAction[];
  selectedTeamFilter?: string;
  onSelectTeamFilter?: (teamName: string) => void;
  onChangeWeek: (week: string) => void;
  onUndo: () => void;
  onOpenScoringModal: (studentName: string, teamName: string) => void;
  onQuickStudentScore: (studentName: string, teamName: string, points: number, reason: string) => void;
  onRewardTeam: (teamName: string, points: number) => void;
}

export const ScoringTab: React.FC<ScoringTabProps> = ({
  teams,
  scores,
  currentWeek,
  undoStack,
  selectedTeamFilter = 'all',
  onSelectTeamFilter,
  onChangeWeek,
  onUndo,
  onOpenScoringModal,
  onQuickStudentScore,
  onRewardTeam,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const weekOptions = [
    'Tuần 10 (02/11 - 07/11/2026)',
    'Tuần 11 (09/11 - 14/11/2026)',
    'Tuần 12 (16/11 - 21/11/2026)',
    'Tuần 13 (23/11 - 28/11/2026)',
    'Tuần 14 (30/11 - 05/12/2026)',
  ];

  const teamColorConfig: Record<string, { border: string; header: string; badge: string; text: string }> = {
    blue: {
      border: 'border-t-blue-500',
      header: 'bg-blue-50/90 text-blue-900 border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      text: 'text-blue-600',
    },
    indigo: {
      border: 'border-t-indigo-500',
      header: 'bg-indigo-50/90 text-indigo-900 border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      text: 'text-indigo-600',
    },
    amber: {
      border: 'border-t-amber-500',
      header: 'bg-amber-50/90 text-amber-900 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      text: 'text-amber-600',
    },
    emerald: {
      border: 'border-t-emerald-500',
      header: 'bg-emerald-50/90 text-emerald-900 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      text: 'text-emerald-600',
    },
    purple: {
      border: 'border-t-purple-500',
      header: 'bg-purple-50/90 text-purple-900 border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      text: 'text-purple-600',
    },
    rose: {
      border: 'border-t-rose-500',
      header: 'bg-rose-50/90 text-rose-900 border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      text: 'text-rose-600',
    },
  };

  // Filter teams if a specific team is selected
  const displayedTeams = selectedTeamFilter === 'all'
    ? teams
    : teams.filter((t) => t.name.toLowerCase() === selectedTeamFilter.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Control Bar: Week selection, search, Undo & Sync status */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Week select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Tuần học
            </label>
            <select
              value={currentWeek}
              onChange={(e) => onChangeWeek(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-2xs"
            >
              {weekOptions.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Team Filter Pills */}
          {onSelectTeamFilter && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Lọc tổ hiển thị
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onSelectTeamFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedTeamFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({teams.length})
                </button>
                {teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTeamFilter(t.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      selectedTeamFilter === t.name
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search student */}
          <div className="relative min-w-[180px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Tìm học sinh
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Undo Button */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Thao tác
            </label>
            <button
              onClick={onUndo}
              disabled={undoStack.length === 0}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition flex items-center space-x-1.5 shadow-2xs ${
                undoStack.length > 0
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 active:scale-95'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
              title="Hoàn tác thao tác cộng/trừ điểm vừa thực hiện"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hoàn tác ({undoStack.length})</span>
            </button>
          </div>
        </div>

        {/* Auto-save Status Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 mr-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Tự động lưu vào bộ nhớ
          </span>
        </div>
      </div>

      {/* Teams Grid */}
      <div className={`grid grid-cols-1 ${displayedTeams.length === 1 ? 'max-w-2xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        {displayedTeams.map((team) => {
          const colors = teamColorConfig[team.color] || teamColorConfig.indigo;
          const teamTotal = team.students.reduce((sum, st) => sum + (scores[st] || 0), 0);
          const studentCount = team.students.length;
          const avgScore = studentCount ? (teamTotal / studentCount).toFixed(1) : '0';

          const filteredStudents = team.students.filter((st) =>
            st.toLowerCase().includes(searchTerm.toLowerCase().trim())
          );

          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl shadow-xs border-t-4 ${colors.border} border-x border-b border-slate-200 flex flex-col justify-between transition-all hover:shadow-md`}
            >
              {/* Team Card Header */}
              <div className={`p-4 ${colors.header} flex justify-between items-center border-b rounded-t-xl`}>
                <div className="flex items-center space-x-2">
                  <Users className={`w-4 h-4 ${colors.text}`} />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-none">
                      {team.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      TB: {avgScore} đ / {studentCount} bạn
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white rounded-xl font-black text-sm shadow-xs border border-slate-200 text-slate-900">
                  {teamTotal} đ
                </span>
              </div>

              {/* Student List in Team */}
              <div className="p-4 space-y-2.5 flex-grow">
                {filteredStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Không có học sinh phù hợp
                  </p>
                ) : (
                  filteredStudents.map((student) => {
                    const pts = scores[student] || 0;
                    const isHigh = pts >= 8;
                    const isLow = pts < 5;

                    return (
                      <div
                        key={student}
                        className="group flex justify-between items-center p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs bg-white transition cursor-pointer"
                        onClick={() => onOpenScoringModal(student, team.name)}
                      >
                        <div className="flex items-center space-x-2.5 truncate pr-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                            {student.charAt(0)}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                            {student}
                          </span>
                        </div>

                        {/* Points badge & quick actions */}
                        <div className="flex items-center space-x-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {/* Quick -1 */}
                          <button
                            onClick={() =>
                              onQuickStudentScore(student, team.name, -1, 'Trừ 1 điểm vi phạm nề nếp')
                            }
                            title="Trừ 1 điểm nhanh"
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 flex items-center justify-center transition opacity-60 group-hover:opacity-100 active:scale-90"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          {/* Score Badge */}
                          <button
                            onClick={() => onOpenScoringModal(student, team.name)}
                            title="Nhấp để xem và chọn tiêu chí chấm điểm"
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-black border transition ${
                              isHigh
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : isLow
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {pts >= 0 ? `+${pts}` : pts}
                          </button>

                          {/* Quick +1 */}
                          <button
                            onClick={() =>
                              onQuickStudentScore(student, team.name, 1, 'Thưởng 1 điểm nề nếp / học tập tốt')
                            }
                            title="Thưởng 1 điểm nhanh"
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-500 flex items-center justify-center transition opacity-60 group-hover:opacity-100 active:scale-90"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Team Action Bottom Button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                <button
                  onClick={() => onRewardTeam(team.name, 1)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-300" />
                  <span>Thưởng cả {team.name} (+1đ)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
