import React, { useState } from 'react';
import { 
  Trophy, 
  FileSpreadsheet, 
  Dices, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  School, 
  Edit2, 
  Check, 
  Menu,
  ChevronDown,
  Zap,
  Users
} from 'lucide-react';
import { MainTabType } from './Sidebar';
import { Team } from '../types';

interface HeaderProps {
  appName?: string;
  className: string;
  topic: string;
  activeTab: MainTabType;
  selectedTeamFilter: string;
  teams: Team[];
  onToggleMobileSidebar: () => void;
  onSelectTab: (tab: MainTabType) => void;
  onSelectTeamFilter: (teamName: string) => void;
  onUpdateAppName?: (name: string) => void;
  onOpenPresentation: () => void;
  onExportExcel: () => void;
  onOpenRandomPicker: () => void;
  onOpenChallenge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appName = 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU',
  className,
  topic,
  activeTab,
  selectedTeamFilter,
  teams,
  onToggleMobileSidebar,
  onSelectTab,
  onSelectTeamFilter,
  onUpdateAppName,
  onOpenPresentation,
  onExportExcel,
  onOpenRandomPicker,
  onOpenChallenge,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(appName);

  const handleSaveName = () => {
    if (tempName.trim() && onUpdateAppName) {
      onUpdateAppName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleQuickDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    if (value === 'chamdiem-all') {
      onSelectTab('chamdiem');
      onSelectTeamFilter('all');
    } else if (value.startsWith('team-')) {
      const teamName = value.replace('team-', '');
      onSelectTab('chamdiem');
      onSelectTeamFilter(teamName);
    } else if (value === 'xephang') {
      onSelectTab('xephang');
    } else if (value === 'lichsu') {
      onSelectTab('lichsu');
    } else if (value === 'tieuchi') {
      onSelectTab('tieuchi');
    } else if (value === 'randomPicker') {
      onOpenRandomPicker();
    } else if (value === 'challenge') {
      onOpenChallenge();
    } else if (value === 'presentation') {
      onOpenPresentation();
    } else if (value === 'excel') {
      onExportExcel();
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-800 text-white shadow-md border-b border-indigo-700/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3 flex flex-wrap justify-between items-center gap-2.5">
        {/* Left: Mobile hamburger & App Name */}
        <div className="flex items-center space-x-3">
          {/* Hamburger toggle button for sidebar */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white transition active:scale-95"
            title="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex bg-gradient-to-br from-amber-400 to-amber-500 p-2 rounded-xl shadow-md text-slate-950 items-center justify-center">
            <GraduationCap className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-white/20 border border-white/40 text-white font-extrabold text-sm sm:text-base rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-amber-300"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md"
                    title="Lưu tên"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2 uppercase">
                    {appName}
                  </h1>

                  {onUpdateAppName && (
                    <button
                      onClick={() => {
                        setTempName(appName);
                        setIsEditingName(true);
                      }}
                      className="opacity-50 group-hover:opacity-100 hover:text-amber-300 p-1 text-xs rounded transition"
                      title="Chỉnh sửa tên ứng dụng"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Phạm Hậu
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs text-indigo-100/90 mt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <School className="w-3 h-3 text-amber-300" />
                <span>Lớp <strong className="text-white">{className}</strong></span>
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-indigo-400"></span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-indigo-200">
                <Layers className="w-3 h-3 text-amber-300" />
                <span className="truncate max-w-[200px]">{topic}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Middle/Right: Chế độ xả xuống nhanh để chọn thành phần + Thao tác nhanh */}
        <div className="flex items-center flex-wrap gap-2 ml-auto">
          {/* Dropdown Menu xả xuống chọn thành phần */}
          <div className="relative">
            <select
              aria-label="Xả xuống chọn thành phần"
              onChange={handleQuickDropdownChange}
              value={
                activeTab === 'chamdiem' && selectedTeamFilter !== 'all'
                  ? `team-${selectedTeamFilter}`
                  : activeTab
              }
              className="bg-indigo-950/80 hover:bg-indigo-950 text-amber-300 text-xs font-bold rounded-xl pl-3 pr-8 py-2 border border-indigo-400/50 focus:border-amber-400 outline-none appearance-none cursor-pointer shadow-xs transition"
            >
              <option value="" disabled>▼ Xả xuống chọn thành phần...</option>
              <optgroup label="✍️ Chấm điểm thi đua">
                <option value="chamdiem-all">📋 Chấm điểm - Toàn bộ các tổ</option>
                {teams.map((t) => (
                  <option key={t.id} value={`team-${t.name}`}>
                    👉 Xem & Chấm: {t.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏆 Bảng vàng & Thống kê">
                <option value="xephang">🏅 Bảng vàng xếp hạng thi đua</option>
              </optgroup>
              <optgroup label="📜 Lịch sử điểm">
                <option value="lichsu">⏱️ Nhật ký & Lịch sử chấm điểm</option>
              </optgroup>
              <optgroup label="⚙️ Quản trị">
                <option value="tieuchi">⚙️ Cấu hình lớp & Tiêu chí</option>
              </optgroup>
              <optgroup label="🛠️ Tiện ích nhanh">
                <option value="randomPicker">🎲 Bốc thăm học sinh</option>
                <option value="challenge">⚡ Thử thách câu hỏi nhanh</option>
                <option value="presentation">📺 Trình chiếu toàn màn hình</option>
                <option value="excel">📊 Xuất file Excel</option>
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-amber-300 pointer-events-none absolute right-2.5 top-2.5" />
          </div>

          {/* Quick Challenge button */}
          <button
            onClick={onOpenChallenge}
            title="Thử thách & câu hỏi nhanh"
            className="hidden sm:flex bg-indigo-900/60 hover:bg-indigo-900 text-amber-300 border border-indigo-500/40 px-2.5 py-1.5 rounded-xl text-xs font-semibold items-center space-x-1 transition shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Khởi động</span>
          </button>

          {/* Random Student Picker */}
          <button
            onClick={onOpenRandomPicker}
            title="Bốc thăm ngẫu nhiên học sinh"
            className="hidden sm:flex bg-indigo-700/80 hover:bg-indigo-600 text-white border border-indigo-500/40 px-2.5 py-1.5 rounded-xl text-xs font-semibold items-center space-x-1 transition shadow-xs active:scale-95"
          >
            <Dices className="w-3.5 h-3.5 text-amber-300" />
            <span>Bốc thăm</span>
          </button>

          {/* Presentation Mode button */}
          <button
            onClick={onOpenPresentation}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition flex items-center space-x-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trình chiếu</span>
            <span className="sm:hidden">Bảng vàng</span>
          </button>

          {/* Export button */}
          <button
            onClick={onExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-xl text-xs shadow transition flex items-center space-x-1 active:scale-95"
            title="Xuất bảng điểm Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
