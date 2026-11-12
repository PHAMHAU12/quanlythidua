export type TeamColor = 'blue' | 'indigo' | 'amber' | 'emerald' | 'purple' | 'rose';

export interface Student {
  id: string;
  name: string;
  teamId: number;
  points: number;
  badge?: string;
}

export interface Team {
  id: number;
  name: string;
  color: TeamColor;
  students: string[]; // names or ids
}

export interface Criteria {
  id: number | string;
  text: string;
  points: number;
  target: 'Cá nhân' | 'Tổ';
  category?: 'Học tập' | 'Kỷ luật & Tác phong' | 'Chuyên cần' | 'Vệ sinh' | 'Phong trào' | 'Toán học' | string;
}

export interface HistoryItem {
  id: string;
  time: string;
  student: string;
  team: string;
  reason: string;
  points: number;
  timestamp: number;
}

export interface UndoAction {
  type: 'student' | 'team' | 'bulk';
  studentName?: string;
  teamName?: string;
  points: number;
  reason: string;
  time: string;
  historyId?: string;
}

export interface AppData {
  appName?: string;
  className: string;
  topic: string;
  currentWeek: string;
  teams: Team[];
  criteria: Criteria[];
  scores: Record<string, number>; // studentName -> score
  history: HistoryItem[];
  undoStack: UndoAction[];
}
