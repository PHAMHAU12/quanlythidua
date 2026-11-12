import React, { useState } from 'react';
import { Criteria } from '../types';
import { X, Award, AlertCircle, PlusCircle, MinusCircle, MessageSquare, Check, Sparkles } from 'lucide-react';

interface ScoringModalProps {
  isOpen: boolean;
  studentName: string;
  teamName: string;
  currentPoints: number;
  criteriaList: Criteria[];
  onClose: () => void;
  onApplyScore: (points: number, criteriaText: string) => void;
}

export const ScoringModal: React.FC<ScoringModalProps> = ({
  isOpen,
  studentName,
  teamName,
  currentPoints,
  criteriaList,
  onClose,
  onApplyScore,
}) => {
  const [note, setNote] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customPoints, setCustomPoints] = useState<number | null>(null);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  // Extract unique categories from current criteria list dynamically
  const uniqueCategories = Array.from(
    new Set(criteriaList.map((c) => c.category).filter(Boolean))
  ) as string[];

  const categories = ['all', ...uniqueCategories];

  const filteredCriteria = activeCategory === 'all'
    ? criteriaList
    : criteriaList.filter(c => c.category === activeCategory);

  const handleSelectCriteria = (crit: Criteria) => {
    const finalReason = note.trim() ? `${crit.text} (${note.trim()})` : crit.text;
    onApplyScore(crit.points, finalReason);
    setNote('');
  };

  const handleApplyCustom = () => {
    if (customPoints === null || isNaN(customPoints) || customPoints === 0) return;
    const reason = customReason.trim() || 'Điểm điều chỉnh trực tiếp';
    const finalReason = note.trim() ? `${reason} (${note.trim()})` : reason;
    onApplyScore(customPoints, finalReason);
    setCustomPoints(null);
    setCustomReason('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Student Name & Team */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-black text-xl text-amber-300">
              {studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white leading-tight">{studentName}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-indigo-100">
                  {teamName}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1.5">
                <span>Điểm tích lũy hiện tại:</span>
                <span className="font-extrabold text-amber-300 bg-indigo-900/40 px-2 py-0.5 rounded-md">
                  {currentPoints} điểm
                </span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả tiêu chí' : cat}
            </button>
          ))}
        </div>

        {/* Modal Body - Criteria List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chọn tiêu chí đánh giá:
              </span>
              <span className="text-[11px] text-slate-400">Nhấp chọn để cộng / trừ điểm ngay</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredCriteria.map((crit) => {
                const isBonus = crit.points > 0;
                return (
                  <button
                    key={crit.id}
                    onClick={() => handleSelectCriteria(crit)}
                    className={`group flex justify-between items-center p-3 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs ${
                      isBonus
                        ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5 pr-2">
                      {isBonus ? (
                        <PlusCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <MinusCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold leading-snug">{crit.text}</p>
                        {crit.category && (
                          <span className="text-[10px] font-medium text-slate-500 uppercase">
                            {crit.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-black text-sm px-2.5 py-1 rounded-xl shadow-xs shrink-0 ${
                        isBonus
                          ? 'bg-white text-emerald-600 border border-emerald-200'
                          : 'bg-white text-rose-600 border border-rose-200'
                      }`}
                    >
                      {isBonus ? `+${crit.points}` : crit.points} đ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Custom Points Input */}
          <div className="pt-2 border-t border-slate-100">
            <details className="text-xs group">
              <summary className="font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer flex items-center gap-1.5 py-1 select-none">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Nhập điểm tùy chỉnh khác (+ / - điểm tự chọn)</span>
              </summary>
              <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Số điểm (ví dụ: 2 hoặc -1)"
                    value={customPoints ?? ''}
                    onChange={(e) => setCustomPoints(e.target.value === '' ? null : parseInt(e.target.value))}
                    className="w-1/3 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Lý do (ví dụ: Giải đề phát triển VDC)"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-2/3 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleApplyCustom}
                  disabled={customPoints === null || isNaN(customPoints) || customPoints === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-1.5 rounded-lg text-xs transition"
                >
                  Xác nhận cộng / trừ điểm này
                </button>
              </div>
            </details>
          </div>

          {/* Additional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              Ghi chú thêm chi tiết bài giải / thái độ (Tùy chọn)
            </label>
            <input
              type="text"
              id="modal-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Kiểm tra 15 phút đạt điểm 10, trực nhật sạch sẽ, giúp bạn học..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Lịch sử sẽ được ghi nhận tức thì
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
