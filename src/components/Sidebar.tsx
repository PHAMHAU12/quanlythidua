import React, { useState } from 'react';
import { 
  PenTool, 
  Trophy, 
  History as HistoryIcon, 
  Settings2, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Sparkles, 
  Dices, 
  FileSpreadsheet, 
  RotateCcw, 
  Award, 
  GraduationCap, 
  School, 
  CheckCircle2, 
  Layers, 
  X,
  Flame,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Team, UndoAction } from '../types';

export type MainTabType = 'chamdiem' | 'xephang' | 'lichsu' | 'tieuchi';

interface SidebarProps {
  appName: string;
  className: string;
  topic: string;
  activeTab: MainTabType;
  selectedTeamFilter: string; // 'all' or team name
  historyCount: number;
  undoCount: number;
  teams: Team[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSelectTab: (tab: MainTabType) => void;
  onSelectTeamFilter: (teamName: string) => void;
  onUndo: () => void;
  onOpenPresentation: () => void;
  onExportExcel: () => void;
  onOpenRandomPicker: () => void;
  onOpenChallenge: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  appName,
  className,
  topic,
  activeTab,
  selectedTeamFilter,
  historyCount,
  undoCount,
  teams,
  isOpenMobile,
  onCloseMobile,
  onSelectTab,
  onSelectTeamFilter,
  onUndo,
  onOpenPresentation,
  onExportExcel,
  onOpenRandomPicker,
  onOpenChallenge,
}) => {
  // State for collapsible/accordion sections (chế độ xả xuống)
  const [openSections, setOpenSections] = useState<{
    chamdiem: boolean;
    xephang: boolean;
    lichsu: boolean;
    tienich: boolean;
    cauhinh: boolean;
  }>({
    chamdiem: true, // Mặc định mở rộng để thấy các tổ
    xephang: true,
    lichsu: false,
    tienich: true,
    cauhinh: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Quick dropdown selection handler (Chế độ xả xuống nhanh)
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
    } else if (value === 'undo') {
      onUndo();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Left Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding & Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-b from-slate-850 to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-slate-950 font-black">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-tight text-white uppercase leading-snug line-clamp-2">
                  {appName}
                </h1>
                <p className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mt-0.5">
                  <span>GV: PHẠM HẬU</span>
                  <span>•</span>
                  <span>Lớp {className}</span>
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Component Select Dropdown (Menu xả xuống để chọn thành phần nhanh) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-indigo-400">
                <Zap className="w-3 h-3 text-amber-400" />
                Xả xuống chọn thành phần:
              </span>
            </label>
            <div className="relative">
              <select
                aria-label="Xả xuống chọn thành phần"
                onChange={handleQuickDropdownChange}
                value={
                  activeTab === 'chamdiem' && selectedTeamFilter !== 'all'
                    ? `team-${selectedTeamFilter}`
                    : activeTab
                }
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 pr-8 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none appearance-none cursor-pointer transition shadow-inner"
              >
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
                  {undoCount > 0 && <option value="undo">↩️ Hoàn tác lượt chấm gần nhất</option>}
                </optgroup>
                <optgroup label="🛠️ Tiện ích & Trình chiếu">
                  <option value="randomPicker">🎲 Vòng quay bốc thăm học sinh</option>
                  <option value="challenge">⚡ Thử thách câu hỏi nhanh</option>
                  <option value="presentation">📺 Trình chiếu Bảng Vàng (TV/Máy chiếu)</option>
                  <option value="excel">📊 Xuất file danh sách Excel</option>
                </optgroup>
                <optgroup label="⚙️ Quản trị hệ thống">
                  <option value="tieuchi">⚙️ Cấu hình lớp & Tiêu chí</option>
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Navigation Menus with Accordion Dropdowns (Xả xuống từng mục) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 no-scrollbar">
          {/* GROUP 1: CHẤM ĐIỂM THI ĐUA */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-850/50 overflow-hidden">
            <button
              onClick={() => toggleSection('chamdiem')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition ${
                activeTab === 'chamdiem'
                  ? 'text-amber-400 bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${activeTab === 'chamdiem' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-750 text-indigo-400'}`}>
                  <PenTool className="w-3.5 h-3.5" />
                </div>
                <span className="uppercase tracking-wider">1. Chấm điểm thi đua</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                  {teams.length} Tổ
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openSections.chamdiem ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Content xả xuống */}
            {openSections.chamdiem && (
              <div className="px-2 py-1.5 space-y-1 bg-slate-900/60 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    onSelectTab('chamdiem');
                    onSelectTeamFilter('all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    activeTab === 'chamdiem' && selectedTeamFilter === 'all'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Toàn bộ các tổ (Tất cả)</span>
                  </span>
                  {activeTab === 'chamdiem' && selectedTeamFilter === 'all' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>

                {/* Sub-items for each team */}
                {teams.map((team, idx) => {
                  const isSelected = activeTab === 'chamdiem' && selectedTeamFilter === team.name;
                  return (
                    <button
                      key={team.id}
                      onClick={() => {
                        onSelectTab('chamdiem');
                        onSelectTeamFilter(team.name);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition pl-6 ${
                        isSelected
                          ? 'bg-indigo-600/90 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          team.color === 'blue' ? 'bg-blue-400' :
                          team.color === 'indigo' ? 'bg-indigo-400' :
                          team.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span>{team.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {team.students.length} HS
                      </span>
                    </button>
                  );
                })}

                {/* Quick Undo button if available */}
                {undoCount > 0 && (
                  <button
                    onClick={onUndo}
                    className="w-full mt-1 text-left px-3 py-1.5 rounded-lg text-[11px] font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Hoàn tác ({undoCount})</span>
                    </span>
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-400 text-slate-950 font-black rounded">
                      Gần nhất
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* GROUP 2: BẢNG VÀNG & XẾP HẠNG */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-850/50 overflow-hidden">
            <button
              onClick={() => toggleSection('xephang')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition ${
                activeTab === 'xephang'
                  ? 'text-amber-400 bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${activeTab === 'xephang' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-750 text-amber-400'}`}>
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span className="uppercase tracking-wider">2. Bảng vàng & Xếp hạng</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSections.xephang ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Content xả xuống */}
            {openSections.xephang && (
              <div className="px-2 py-1.5 space-y-1 bg-slate-900/60 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectTab('xephang')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    activeTab === 'xephang'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Xếp hạng Tổ & Cá nhân</span>
                  </span>
                  {activeTab === 'xephang' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>

                <button
                  onClick={() => onSelectTab('xephang')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center justify-between pl-6"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Top 5 Vinh danh dẫn đầu</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">★</span>
                </button>

                <button
                  onClick={() => onSelectTab('xephang')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center justify-between pl-6"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Học sinh cần đôn đốc</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* GROUP 3: LỊCH SỬ CHẤM ĐIỂM */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-850/50 overflow-hidden">
            <button
              onClick={() => toggleSection('lichsu')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition ${
                activeTab === 'lichsu'
                  ? 'text-amber-400 bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${activeTab === 'lichsu' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-750 text-emerald-400'}`}>
                  <HistoryIcon className="w-3.5 h-3.5" />
                </div>
                <span className="uppercase tracking-wider">3. Nhật ký & Lịch sử</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                  {historyCount}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openSections.lichsu ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Content xả xuống */}
            {openSections.lichsu && (
              <div className="px-2 py-1.5 space-y-1 bg-slate-900/60 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectTab('lichsu')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    activeTab === 'lichsu'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HistoryIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Toàn bộ nhật ký điểm ({historyCount})</span>
                  </span>
                  {activeTab === 'lichsu' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* GROUP 4: TIỆN ÍCH LỚP HỌC (Dropdown xả xuống chọn công cụ) */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-850/50 overflow-hidden">
            <button
              onClick={() => toggleSection('tienich')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-slate-750 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="uppercase tracking-wider">4. Tiện ích lớp học</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSections.tienich ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Content xả xuống */}
            {openSections.tienich && (
              <div className="px-2 py-1.5 space-y-1 bg-slate-900/60 border-t border-slate-800/60">
                <button
                  onClick={onOpenRandomPicker}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-2.5"
                >
                  <Dices className="w-4 h-4 text-amber-400" />
                  <span>Bốc thăm ngẫu nhiên</span>
                </button>

                <button
                  onClick={onOpenChallenge}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-2.5"
                >
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Thử thách câu hỏi nhanh</span>
                </button>

                <button
                  onClick={onOpenPresentation}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition flex items-center space-x-2.5 border border-amber-500/20"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Trình chiếu TV / Máy chiếu</span>
                </button>

                <button
                  onClick={onExportExcel}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 transition flex items-center space-x-2.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Xuất bảng điểm Excel</span>
                </button>
              </div>
            )}
          </div>

          {/* GROUP 5: CẤU HÌNH & HỆ THỐNG */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-850/50 overflow-hidden">
            <button
              onClick={() => toggleSection('cauhinh')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold transition ${
                activeTab === 'tieuchi'
                  ? 'text-amber-400 bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${activeTab === 'tieuchi' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-750 text-slate-400'}`}>
                  <Settings2 className="w-3.5 h-3.5" />
                </div>
                <span className="uppercase tracking-wider">5. Cấu hình & Tiêu chí</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openSections.cauhinh ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Content xả xuống */}
            {openSections.cauhinh && (
              <div className="px-2 py-1.5 space-y-1 bg-slate-900/60 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectTab('tieuchi')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    activeTab === 'tieuchi'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cấu hình Lớp & Tiêu chí</span>
                  </span>
                  {activeTab === 'tieuchi' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>

                <button
                  onClick={() => onSelectTab('tieuchi')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center space-x-2 pl-6"
                >
                  <School className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Thông tin Lớp & GVCN</span>
                </button>

                <button
                  onClick={() => onSelectTab('tieuchi')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center space-x-2 pl-6"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bộ tiêu chí thi đua</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info in Sidebar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Phạm Hậu</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
              Đang hoạt động
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            Chủ đề: {topic}
          </p>
        </div>
      </aside>
    </>
  );
};
