import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { 
  Clock, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface HistoryTabProps {
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string, index: number) => void;
  onClearHistory: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  onDeleteHistoryItem,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [pointFilter, setPointFilter] = useState<'all' | 'bonus' | 'penalty'>('all');

  const filteredHistory = history.filter((item) => {
    const matchSearch =
      item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTeam = teamFilter === 'all' || item.team === teamFilter;
    const matchPoint =
      pointFilter === 'all'
        ? true
        : pointFilter === 'bonus'
        ? item.points > 0
        : item.points < 0;

    return matchSearch && matchTeam && matchPoint;
  });

  const teamsInHistory = Array.from(new Set(history.map((h) => h.team)));

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Nhật ký cộng trừ điểm thời gian thực</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghi nhận toàn bộ thao tác chấm điểm và nội dung đánh giá
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, lý do..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Tất cả các tổ</option>
            {teamsInHistory.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={pointFilter}
            onChange={(e) => setPointFilter(e.target.value as 'all' | 'bonus' | 'penalty')}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Tất cả loại điểm</option>
            <option value="bonus">Chỉ điểm cộng (+)</option>
            <option value="penalty">Chỉ điểm trừ (-)</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium ml-auto">
          Hiển thị: <strong>{filteredHistory.length}</strong> / {history.length} bản ghi
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Tổ</th>
                <th className="py-3 px-4">Nội dung / Tiêu chí đánh giá</th>
                <th className="py-3 px-4 text-center">Điểm</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Chưa có nhật ký chấm điểm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, index) => {
                  const isBonus = item.points > 0;
                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {item.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {item.student}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                          {item.team}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {item.reason}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`font-black px-2 py-0.5 rounded-lg border text-xs sm:text-sm ${
                            isBonus
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {isBonus ? `+${item.points}` : item.points} đ
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteHistoryItem(item.id, index)}
                          title="Xóa bản ghi này và hoàn trả điểm lại cho học sinh"
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
