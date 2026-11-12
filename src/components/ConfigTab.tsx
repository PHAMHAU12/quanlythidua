import React, { useState } from 'react';
import { Team, Criteria } from '../types';
import { 
  School, 
  Users, 
  Plus, 
  Trash2, 
  BookOpen, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Calculator,
  Filter
} from 'lucide-react';

interface ConfigTabProps {
  appName?: string;
  className: string;
  topic: string;
  teams: Team[];
  criteria: Criteria[];
  onUpdateAppName?: (name: string) => void;
  onUpdateClassName: (name: string) => void;
  onUpdateTopic: (topic: string) => void;
  onAddStudent: (teamName: string, studentName: string) => void;
  onRemoveStudent: (teamName: string, studentIndex: number) => void;
  onAddCriteria: (criteria: Omit<Criteria, 'id'>) => void;
  onDeleteCriteria: (index: number) => void;
  onResetDefaults: () => void;
  onApplyHomeroomPreset: () => void;
  onApplyMathPreset: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({
  appName = 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU',
  className,
  topic,
  teams,
  criteria,
  onUpdateAppName,
  onUpdateClassName,
  onUpdateTopic,
  onAddStudent,
  onRemoveStudent,
  onAddCriteria,
  onDeleteCriteria,
  onResetDefaults,
  onApplyHomeroomPreset,
  onApplyMathPreset,
  onExportBackup,
  onImportBackup,
}) => {
  const [inputAppName, setInputAppName] = useState(appName);
  const [inputClass, setInputClass] = useState(className);
  const [inputTopic, setInputTopic] = useState(topic);

  // Add student state
  const [selectedTeamForStudent, setSelectedTeamForStudent] = useState(teams[0]?.name || 'Tổ 1');
  const [newStudentName, setNewStudentName] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchNames, setBatchNames] = useState('');

  // Add criteria state
  const [showAddCriteria, setShowAddCriteria] = useState(false);
  const [critText, setCritText] = useState('');
  const [critPoints, setCritPoints] = useState(2);
  const [critCategory, setCritCategory] = useState<string>('Học tập');
  const [critTarget, setCritTarget] = useState<'Cá nhân' | 'Tổ'>('Cá nhân');

  // Filter criteria by category in table
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleSaveClassAndTopic = () => {
    if (inputAppName.trim() && onUpdateAppName) onUpdateAppName(inputAppName.trim());
    if (inputClass.trim()) onUpdateClassName(inputClass.trim());
    if (inputTopic.trim()) onUpdateTopic(inputTopic.trim());
    alert('Đã cập nhật thông tin Ứng dụng, Lớp học và Chủ đề thi đua thành công!');
  };

  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddStudent(selectedTeamForStudent, newStudentName.trim());
    setNewStudentName('');
  };

  const handleAddBatchStudents = () => {
    if (!batchNames.trim()) return;
    const lines = batchNames.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    lines.forEach((name) => {
      onAddStudent(selectedTeamForStudent, name);
    });
    setBatchNames('');
    setBatchMode(false);
    alert(`Đã thêm ${lines.length} học sinh vào ${selectedTeamForStudent}!`);
  };

  const handleCreateCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!critText.trim()) return;
    onAddCriteria({
      text: critText.trim(),
      points: Number(critPoints),
      target: critTarget,
      category: critCategory,
    });
    setCritText('');
    setCritPoints(2);
    setShowAddCriteria(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  const availableCategories = Array.from(
    new Set(criteria.map((c) => c.category).filter(Boolean))
  ) as string[];

  const filteredCriteriaList = categoryFilter === 'all'
    ? criteria
    : criteria.filter((c) => c.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Banner Khuyên Dùng: Chuyển sang Tiêu chí Lớp Chủ Nhiệm */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Chuẩn Quản Lý Giáo Viên Chủ Nhiệm (GVCN)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Bộ Tiêu Chí Thi Đua &amp; Nề Nếp Lớp Chủ Nhiệm
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
            Bao gồm 5 trụ cột thi đua trường học: <strong>Học tập</strong> (điểm số, phát biểu), <strong>Kỷ luật &amp; Tác phong</strong> (đồng phục, điện thoại, sổ đầu bài), <strong>Chuyên cần</strong> (đi trễ, nghỉ học), <strong>Vệ sinh &amp; Trực nhật</strong> và <strong>Phong trào đoàn thể</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              if (confirm('Áp dụng ngay trọn bộ tiêu chí thi đua toàn diện dành cho Lớp Chủ Nhiệm?')) {
                onApplyHomeroomPreset();
                setInputAppName('ClassMaster');
              }
            }}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Nạp Bộ Tiêu Chí Lớp Chủ Nhiệm</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Chuyển sang bộ tiêu chí chuyên đề Môn Toán 12?')) {
                onApplyMathPreset();
                setInputAppName('Math12 Master');
              }
            }}
            className="bg-white/15 hover:bg-white/25 text-white font-bold border border-white/30 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95"
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            <span>Dùng tiêu chí Môn Toán</span>
          </button>
        </div>
      </div>

      {/* Cấu hình Lớp & Chủ đề */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <School className="w-5 h-5 text-indigo-600" />
          <span>Cấu hình Tên ứng dụng, Lớp học &amp; Chủ đề thi đua</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Tên Ứng Dụng
              </label>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setInputAppName('QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU')}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Phạm Hậu
                </button>
              </div>
            </div>
            <input
              type="text"
              value={inputAppName}
              onChange={(e) => setInputAppName(e.target.value)}
              placeholder="QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Tên lớp học
            </label>
            <input
              type="text"
              value={inputClass}
              onChange={(e) => setInputClass(e.target.value)}
              placeholder="Ví dụ: 12A6, 12 Tin, 12 Chuyên Toán..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Chủ đề / Khẩu hiệu thi đua
            </label>
            <input
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              placeholder="Ví dụ: Nề nếp & Thi đua Toàn diện Lớp Chủ Nhiệm"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveClassAndTopic}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Lưu thay đổi cài đặt ứng dụng</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quản lý thành viên theo Tổ */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Quản lý Danh sách Thành viên 4 Tổ</span>
            </h3>
            <button
              onClick={() => setBatchMode(!batchMode)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {batchMode ? 'Nhập từng em' : 'Nhập danh sách nhanh'}
            </button>
          </div>

          {/* Form thêm học sinh */}
          {!batchMode ? (
            <form onSubmit={handleAddSingleStudent} className="flex gap-2">
              <select
                value={selectedTeamForStudent}
                onChange={(e) => setSelectedTeamForStudent(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Họ và tên học sinh mới..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1 shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">
                  Dán danh sách học sinh vào {selectedTeamForStudent}:
                </span>
                <select
                  value={selectedTeamForStudent}
                  onChange={(e) => setSelectedTeamForStudent(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                placeholder="Mỗi học sinh một dòng hoặc cách nhau bởi dấu phẩy..."
                value={batchNames}
                onChange={(e) => setBatchNames(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddBatchStudents}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 rounded-lg text-xs"
              >
                Thêm toàn bộ danh sách vào {selectedTeamForStudent}
              </button>
            </div>
          )}

          {/* List of Teams & their students */}
          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-indigo-800 flex items-center gap-1.5">
                    <span>{team.name}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      ({team.students.length} bạn)
                    </span>
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {team.students.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Chưa có học sinh</span>
                  ) : (
                    team.students.map((st, idx) => (
                      <span
                        key={st}
                        className="inline-flex items-center bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 shadow-2xs group hover:border-rose-300"
                      >
                        {st}
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa học sinh "${st}" khỏi ${team.name}?`)) {
                              onRemoveStudent(team.name, idx);
                            }
                          }}
                          className="ml-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Xóa học sinh"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bộ tiêu chí thi đua Lớp Chủ Nhiệm */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Tiêu chí thi đua lớp ({criteria.length} tiêu chí)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các mức điểm cộng thưởng và trừ phạt theo nội quy lớp
              </p>
            </div>
            <button
              onClick={() => setShowAddCriteria(!showAddCriteria)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Category Filter Pills for Criteria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Lọc:
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({criteria.length})
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Form thêm tiêu chí mới */}
          {showAddCriteria && (
            <form
              onSubmit={handleCreateCriteria}
              className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3 animate-in fade-in"
            >
              <div className="font-bold text-xs text-indigo-900 uppercase tracking-wider">
                Thêm tiêu chí thi đua mới
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Nội dung tiêu chí (ví dụ: Không trực nhật, Mặc sai đồng phục, Điểm 10...)"
                  value={critText}
                  onChange={(e) => setCritText(e.target.value)}
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Điểm (+ / -)
                  </label>
                  <input
                    type="number"
                    value={critPoints}
                    onChange={(e) => setCritPoints(parseInt(e.target.value))}
                    className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Nhóm tiêu chí
                  </label>
                  <select
                    value={critCategory}
                    onChange={(e) => setCritCategory(e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="Học tập">Học tập</option>
                    <option value="Kỷ luật & Tác phong">Kỷ luật &amp; Tác phong</option>
                    <option value="Chuyên cần">Chuyên cần</option>
                    <option value="Vệ sinh">Vệ sinh &amp; Trực nhật</option>
                    <option value="Phong trào">Phong trào</option>
                    <option value="Toán học">Toán học</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Đối tượng
                  </label>
                  <select
                    value={critTarget}
                    onChange={(e) => setCritTarget(e.target.value as any)}
                    className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="Cá nhân">Cá nhân</option>
                    <option value="Tổ">Cả Tổ</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCriteria(false)}
                  className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 border border-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Lưu tiêu chí
                </button>
              </div>
            </form>
          )}

          {/* Table danh sách tiêu chí */}
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Nội dung tiêu chí</th>
                  <th className="py-2.5 px-3 text-center">Phân loại</th>
                  <th className="py-2.5 px-3 text-center">Điểm</th>
                  <th className="py-2.5 px-3 text-right">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCriteriaList.map((crit) => {
                  const isBonus = crit.points > 0;
                  const originalIndex = criteria.findIndex((c) => c.id === crit.id);

                  return (
                    <tr key={crit.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {crit.text}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {crit.category || 'Nề nếp'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded-md border text-[11px] ${
                            isBonus
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {isBonus ? `+${crit.points}` : crit.points} đ
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Bạn muốn xóa tiêu chí "${crit.text}"?`)) {
                              onDeleteCriteria(originalIndex);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reset to defaults */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
            <button
              onClick={onResetDefaults}
              className="text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục tiêu chí mặc định ban đầu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Restore Data Bar */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs text-slate-600">
          <strong>Sao lưu &amp; Phục hồi dữ liệu:</strong> Xuất file sao lưu đề phòng thay đổi thiết bị hoặc nộp báo cáo cho Ban Giám Hiệu.
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportBackup}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tải file sao lưu (JSON)</span>
          </button>

          <label className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nhập dữ liệu</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
