import React, { useState } from 'react';
import { Team } from '../types';
import { Dices, X, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RandomPickerModalProps {
  isOpen: boolean;
  teams: Team[];
  scores: Record<string, number>;
  onClose: () => void;
  onScoreStudent: (studentName: string, teamName: string) => void;
}

export const RandomPickerModal: React.FC<RandomPickerModalProps> = ({
  isOpen,
  teams,
  scores,
  onClose,
  onScoreStudent,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; team: string; points: number } | null>(null);
  const [filterTeam, setFilterTeam] = useState<string>('all');

  if (!isOpen) return null;

  const eligibleStudents = teams.flatMap((team) => {
    if (filterTeam !== 'all' && team.name !== filterTeam) return [];
    return team.students.map((st) => ({
      name: st,
      team: team.name,
      points: scores[st] || 0,
    }));
  });

  const handlePickRandom = () => {
    if (eligibleStudents.length === 0 || isSpinning) return;

    setIsSpinning(true);
    let counter = 0;
    const totalSteps = 25;
    const intervalTime = 60;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleStudents.length);
      setSelectedStudent(eligibleStudents[randomIndex]);
      counter++;

      if (counter >= totalSteps) {
        clearInterval(interval);
        setIsSpinning(false);
        // Confetti burst for chosen student
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, intervalTime);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Dices className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Bốc Thăm Học Sinh</h3>
              <p className="text-xs text-indigo-200">Chọn ngẫu nhiên học sinh kiểm tra bài / phát biểu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          {/* Team filter dropdown */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-600">Phạm vi bốc thăm:</span>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">Toàn bộ lớp ({eligibleStudents.length} học sinh)</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>
                  Chỉ trong {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Random Display Card */}
          <div className="min-h-[170px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl border-2 border-dashed border-indigo-300 relative overflow-hidden">
            {selectedStudent ? (
              <div className={`space-y-2 transition-all ${isSpinning ? 'scale-95 opacity-70 blur-[0.5px]' : 'scale-100 opacity-100'}`}>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
                  {selectedStudent.team}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1">
                  {selectedStudent.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Điểm hiện tại: <span className="font-bold text-indigo-700">+{selectedStudent.points} điểm</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto text-indigo-400 animate-pulse" />
                <p className="text-sm font-semibold">Nhấn nút bên dưới để chọn ngẫu nhiên học sinh</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handlePickRandom}
              disabled={isSpinning || eligibleStudents.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Đang quay số...' : 'Quay số chọn học sinh'}</span>
            </button>

            {selectedStudent && !isSpinning && (
              <button
                onClick={() => {
                  onScoreStudent(selectedStudent.name, selectedStudent.team);
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Chấm điểm ngay cho {selectedStudent.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
