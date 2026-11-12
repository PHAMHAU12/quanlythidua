import React, { useState, useEffect } from 'react';
import { AppData, Criteria, HistoryItem, UndoAction } from './types';
import { INITIAL_APP_DATA, INITIAL_CRITERIA, HOMEROOM_CRITERIA, MATH_CRITERIA } from './data/initialData';
import { Header } from './components/Header';
import { Sidebar, MainTabType } from './components/Sidebar';
import { ScoringTab } from './components/ScoringTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { HistoryTab } from './components/HistoryTab';
import { ConfigTab } from './components/ConfigTab';
import { ScoringModal } from './components/ScoringModal';
import { PresentationModal } from './components/PresentationModal';
import { RandomPickerModal } from './components/RandomPickerModal';
import { QuickChallengeModal } from './components/QuickChallengeModal';
import { 
  PenTool, 
  Trophy, 
  History as HistoryIcon, 
  Settings2,
  CheckCircle,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';

const STORAGE_KEY = 'math12_master_data_v2';

export default function App() {
  // Load state from local storage or fallback to initial data
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AppData = JSON.parse(saved);
        // Ensure all students in teams have a score entry
        parsed.teams.forEach((t) => {
          t.students.forEach((st) => {
            if (parsed.scores[st] === undefined) {
              parsed.scores[st] = 5;
            }
          });
        });

        // Ensure modern App Name
        if (!parsed.appName || parsed.appName === 'ClassMaster' || parsed.appName === 'Math12 Master') {
          parsed.appName = 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU';
        }

        // If the stored data is still on the previous pure math criteria, upgrade to Homeroom criteria
        const hasHomeroomCriteria = parsed.criteria?.some((c: any) => 
          c.category === 'Kỷ luật & Tác phong' || c.text?.toLowerCase().includes('đồng phục')
        );

        if (!hasHomeroomCriteria || !parsed.criteria || parsed.criteria.length <= 11) {
          parsed.criteria = HOMEROOM_CRITERIA;
          if (!parsed.topic || parsed.topic.includes('Khảo sát hàm số')) {
            parsed.topic = 'Nề nếp & Thi đua Toàn diện Lớp Chủ Nhiệm';
          }
        }

        return parsed;
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
    return INITIAL_APP_DATA;
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [appData]);

  // Tab State & Sidebar Filter States
  const [activeTab, setActiveTab] = useState<MainTabType>('chamdiem');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [scoringModal, setScoringModal] = useState<{
    isOpen: boolean;
    studentName: string;
    teamName: string;
  }>({
    isOpen: false,
    studentName: '',
    teamName: '',
  });

  const [presentationOpen, setPresentationOpen] = useState(false);
  const [randomPickerOpen, setRandomPickerOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);

  // --- ACTIONS ---

  // Open scoring modal for student
  const handleOpenScoringModal = (studentName: string, teamName: string) => {
    setScoringModal({
      isOpen: true,
      studentName,
      teamName,
    });
  };

  // Apply score from modal
  const handleApplyScore = (points: number, criteriaText: string) => {
    const student = scoringModal.studentName;
    const team = scoringModal.teamName;
    if (!student) return;

    const newHistoryItem: HistoryItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      student,
      team,
      reason: criteriaText,
      points,
      timestamp: Date.now(),
    };

    const newUndoAction: UndoAction = {
      type: 'student',
      studentName: student,
      teamName: team,
      points,
      reason: criteriaText,
      time: newHistoryItem.time,
      historyId: newHistoryItem.id,
    };

    setAppData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [student]: (prev.scores[student] || 0) + points,
      },
      history: [newHistoryItem, ...prev.history],
      undoStack: [newUndoAction, ...prev.undoStack],
    }));

    setScoringModal({ isOpen: false, studentName: '', teamName: '' });
  };

  // Quick single-click score on student card
  const handleQuickStudentScore = (
    studentName: string,
    teamName: string,
    points: number,
    reason: string
  ) => {
    const newHistoryItem: HistoryItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      student: studentName,
      team: teamName,
      reason,
      points,
      timestamp: Date.now(),
    };

    const newUndoAction: UndoAction = {
      type: 'student',
      studentName,
      teamName,
      points,
      reason,
      time: newHistoryItem.time,
      historyId: newHistoryItem.id,
    };

    setAppData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [studentName]: (prev.scores[studentName] || 0) + points,
      },
      history: [newHistoryItem, ...prev.history],
      undoStack: [newUndoAction, ...prev.undoStack],
    }));
  };

  // Reward entire team
  const handleRewardTeam = (teamName: string, points: number) => {
    const team = appData.teams.find((t) => t.name === teamName);
    if (!team) return;

    const newScores = { ...appData.scores };
    team.students.forEach((st) => {
      newScores[st] = (newScores[st] || 0) + points;
    });

    const newHistoryItem: HistoryItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      student: `Cả ${teamName}`,
      team: teamName,
      reason: `Thưởng toàn đội: Hoạt động nhóm tích cực bài toán Toán 12`,
      points,
      timestamp: Date.now(),
    };

    const newUndoAction: UndoAction = {
      type: 'team',
      teamName,
      points,
      reason: `Thưởng toàn đội ${teamName}`,
      time: newHistoryItem.time,
      historyId: newHistoryItem.id,
    };

    setAppData((prev) => ({
      ...prev,
      scores: newScores,
      history: [newHistoryItem, ...prev.history],
      undoStack: [newUndoAction, ...prev.undoStack],
    }));
  };

  // Undo last action
  const handleUndo = () => {
    if (appData.undoStack.length === 0) {
      alert('Không có thao tác nào để hoàn tác!');
      return;
    }

    const last = appData.undoStack[0];
    const newStack = appData.undoStack.slice(1);
    const newHistory = appData.history.filter((h) => h.id !== last.historyId);
    const newScores = { ...appData.scores };

    if (last.type === 'student' && last.studentName) {
      newScores[last.studentName] = (newScores[last.studentName] || 0) - last.points;
      alert(`Đã hoàn tác thao tác điểm của "${last.studentName}"!`);
    } else if (last.type === 'team' && last.teamName) {
      const team = appData.teams.find((t) => t.name === last.teamName);
      if (team) {
        team.students.forEach((st) => {
          newScores[st] = (newScores[st] || 0) - last.points;
        });
      }
      alert(`Đã hoàn tác điểm thưởng của "${last.teamName}"!`);
    }

    setAppData((prev) => ({
      ...prev,
      scores: newScores,
      history: newHistory,
      undoStack: newStack,
    }));
  };

  // Delete history item and revert points
  const handleDeleteHistoryItem = (historyId: string, index: number) => {
    const item = appData.history.find((h) => h.id === historyId) || appData.history[index];
    if (!item) return;

    if (confirm(`Bạn có muốn xóa bản ghi này và hoàn lại điểm cho "${item.student}"?`)) {
      const newScores = { ...appData.scores };
      if (item.student.startsWith('Cả ')) {
        const team = appData.teams.find((t) => t.name === item.team);
        if (team) {
          team.students.forEach((st) => {
            newScores[st] = (newScores[st] || 0) - item.points;
          });
        }
      } else {
        newScores[item.student] = (newScores[item.student] || 0) - item.points;
      }

      setAppData((prev) => ({
        ...prev,
        scores: newScores,
        history: prev.history.filter((h) => h.id !== item.id),
      }));
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chấm điểm trong tuần? (Điểm số hiện tại của học sinh vẫn được giữ nguyên)')) {
      setAppData((prev) => ({
        ...prev,
        history: [],
        undoStack: [],
      }));
    }
  };

  // Export to Excel / CSV with BOM
  const handleExportExcel = () => {
    let csvContent = '\uFEFFSTT,Họ và tên học sinh,Tổ,Điểm tích lũy,Xếp loại thi đua (Lớp ' + appData.className + ')\n';
    let index = 1;

    appData.teams.forEach((team) => {
      team.students.forEach((st) => {
        const pts = appData.scores[st] || 0;
        const rank = pts >= 10 ? 'Xuất sắc' : pts >= 7 ? 'Tốt' : pts >= 5 ? 'Đạt' : 'Cần cố gắng';
        csvContent += `${index++},"${st}","${team.name}",${pts},"${rank}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeAppName = (appData.appName || 'QUAN_LY_THI_DUA_LOP_PHAM_HAU').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute(
      'download',
      `Bang_Thi_Dua_${safeAppName}_Lop_${appData.className}_${appData.currentWeek.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Config handlers
  const handleUpdateAppName = (appName: string) => {
    setAppData((prev) => ({ ...prev, appName }));
  };

  const handleUpdateClassName = (className: string) => {
    setAppData((prev) => ({ ...prev, className }));
  };

  const handleUpdateTopic = (topic: string) => {
    setAppData((prev) => ({ ...prev, topic }));
  };

  const handleAddStudent = (teamName: string, studentName: string) => {
    const trimmed = studentName.trim();
    if (!trimmed) return;

    setAppData((prev) => {
      const teams = prev.teams.map((team) => {
        if (team.name.toLowerCase() === teamName.toLowerCase()) {
          if (!team.students.includes(trimmed)) {
            return {
              ...team,
              students: [...team.students, trimmed],
            };
          }
        }
        return team;
      });

      return {
        ...prev,
        teams,
        scores: {
          ...prev.scores,
          [trimmed]: prev.scores[trimmed] !== undefined ? prev.scores[trimmed] : 5,
        },
      };
    });
  };

  const handleRemoveStudent = (teamName: string, studentIndex: number) => {
    setAppData((prev) => {
      const teams = prev.teams.map((team) => {
        if (team.name === teamName) {
          const students = [...team.students];
          students.splice(studentIndex, 1);
          return { ...team, students };
        }
        return team;
      });
      return { ...prev, teams };
    });
  };

  const handleAddCriteria = (criteriaData: Omit<Criteria, 'id'>) => {
    const newCriteria: Criteria = {
      ...criteriaData,
      id: Date.now(),
    };
    setAppData((prev) => ({
      ...prev,
      criteria: [newCriteria, ...prev.criteria],
    }));
  };

  const handleDeleteCriteria = (index: number) => {
    setAppData((prev) => {
      const newCrit = [...prev.criteria];
      newCrit.splice(index, 1);
      return { ...prev, criteria: newCrit };
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Khôi phục danh sách tiêu chí gốc thi đua Lớp Chủ Nhiệm?')) {
      setAppData((prev) => ({
        ...prev,
        criteria: HOMEROOM_CRITERIA,
        topic: 'Nề nếp & Thi đua Toàn diện Lớp Chủ Nhiệm',
      }));
    }
  };

  const handleApplyHomeroomPreset = () => {
    setAppData((prev) => ({
      ...prev,
      appName: 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU',
      criteria: HOMEROOM_CRITERIA,
      topic: 'Nề nếp & Thi đua Toàn diện Lớp Chủ Nhiệm',
    }));
    alert('Đã nạp trọn bộ 25 tiêu chí thi đua toàn diện dành cho Lớp Chủ Nhiệm - Phạm Hậu!');
  };

  const handleApplyMathPreset = () => {
    setAppData((prev) => ({
      ...prev,
      appName: 'Math12 Master',
      criteria: MATH_CRITERIA,
      topic: 'Khảo sát hàm số & Ứng dụng đạo hàm',
    }));
    alert('Đã chuyển sang bộ tiêu chí chuyên đề Môn Toán 12 (Math12 Master)!');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Math12_Master_Backup_${appData.className}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.teams && parsed.className) {
        setAppData(parsed);
        alert('Phục hồi dữ liệu thành công!');
      } else {
        alert('File dữ liệu không đúng định dạng!');
      }
    } catch (e) {
      alert('Không thể đọc file backup này!');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Left Sidebar Navigation with Collapsible Dropdowns */}
      <Sidebar
        appName={appData.appName || 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU'}
        className={appData.className}
        topic={appData.topic}
        activeTab={activeTab}
        selectedTeamFilter={selectedTeamFilter}
        historyCount={appData.history.length}
        undoCount={appData.undoStack.length}
        teams={appData.teams}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        onSelectTeamFilter={(team) => {
          setSelectedTeamFilter(team);
          setIsMobileSidebarOpen(false);
        }}
        onUndo={handleUndo}
        onOpenPresentation={() => {
          setPresentationOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onExportExcel={() => {
          handleExportExcel();
          setIsMobileSidebarOpen(false);
        }}
        onOpenRandomPicker={() => {
          setRandomPickerOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onOpenChallenge={() => {
          setChallengeOpen(true);
          setIsMobileSidebarOpen(false);
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto bg-slate-50">
        {/* Top Header Bar */}
        <Header
          appName={appData.appName || 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU'}
          className={appData.className}
          topic={appData.topic}
          activeTab={activeTab}
          selectedTeamFilter={selectedTeamFilter}
          teams={appData.teams}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onSelectTab={setActiveTab}
          onSelectTeamFilter={setSelectedTeamFilter}
          onUpdateAppName={handleUpdateAppName}
          onOpenPresentation={() => setPresentationOpen(true)}
          onExportExcel={handleExportExcel}
          onOpenRandomPicker={() => setRandomPickerOpen(true)}
          onOpenChallenge={() => setChallengeOpen(true)}
        />

        {/* Main Tab Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7 flex-grow w-full">
          {activeTab === 'chamdiem' && (
            <ScoringTab
              teams={appData.teams}
              scores={appData.scores}
              currentWeek={appData.currentWeek}
              undoStack={appData.undoStack}
              selectedTeamFilter={selectedTeamFilter}
              onSelectTeamFilter={setSelectedTeamFilter}
              onChangeWeek={(currentWeek) => setAppData((p) => ({ ...p, currentWeek }))}
              onUndo={handleUndo}
              onOpenScoringModal={handleOpenScoringModal}
              onQuickStudentScore={handleQuickStudentScore}
              onRewardTeam={handleRewardTeam}
            />
          )}

          {activeTab === 'xephang' && (
            <LeaderboardTab
              teams={appData.teams}
              scores={appData.scores}
              history={appData.history}
              className={appData.className}
            />
          )}

          {activeTab === 'lichsu' && (
            <HistoryTab
              history={appData.history}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'tieuchi' && (
            <ConfigTab
              appName={appData.appName || 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU'}
              className={appData.className}
              topic={appData.topic}
              teams={appData.teams}
              criteria={appData.criteria}
              onUpdateAppName={handleUpdateAppName}
              onUpdateClassName={handleUpdateClassName}
              onUpdateTopic={handleUpdateTopic}
              onAddStudent={handleAddStudent}
              onRemoveStudent={handleRemoveStudent}
              onAddCriteria={handleAddCriteria}
              onDeleteCriteria={handleDeleteCriteria}
              onResetDefaults={handleResetDefaults}
              onApplyHomeroomPreset={handleApplyHomeroomPreset}
              onApplyMathPreset={handleApplyMathPreset}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 font-medium">
              <HeartHandshake className="w-4 h-4 text-indigo-500" />
              <span>{appData.appName || 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU'} - Phần mềm thi đua &amp; nề nếp Lớp học</span>
            </p>
            <p className="text-slate-400">
              Giáo viên: Phạm Hậu &bull; Lớp {appData.className} &bull; {appData.topic}
            </p>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      <ScoringModal
        isOpen={scoringModal.isOpen}
        studentName={scoringModal.studentName}
        teamName={scoringModal.teamName}
        currentPoints={appData.scores[scoringModal.studentName] || 0}
        criteriaList={appData.criteria}
        onClose={() => setScoringModal({ isOpen: false, studentName: '', teamName: '' })}
        onApplyScore={handleApplyScore}
      />

      <PresentationModal
        isOpen={presentationOpen}
        appName={appData.appName || 'QUẢN LÝ THI ĐUA LỚP - PHẠM HẬU'}
        className={appData.className}
        topic={appData.topic}
        teams={appData.teams}
        scores={appData.scores}
        onClose={() => setPresentationOpen(false)}
      />

      <RandomPickerModal
        isOpen={randomPickerOpen}
        teams={appData.teams}
        scores={appData.scores}
        onClose={() => setRandomPickerOpen(false)}
        onScoreStudent={handleOpenScoringModal}
      />

      <QuickChallengeModal
        isOpen={challengeOpen}
        onClose={() => setChallengeOpen(false)}
        onAwardChallengePoint={(points, reason) => {
          // Open student picker or ask who solved it
          setRandomPickerOpen(true);
        }}
      />
    </div>
  );
}
