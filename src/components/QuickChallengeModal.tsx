import React, { useState } from 'react';
import { QUICK_MATH_CHALLENGES } from '../data/initialData';
import { Sparkles, X, Eye, EyeOff, Shuffle, Award, CheckCircle } from 'lucide-react';

interface QuickChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardChallengePoint: (points: number, reason: string) => void;
}

export const QuickChallengeModal: React.FC<QuickChallengeModalProps> = ({
  isOpen,
  onClose,
  onAwardChallengePoint,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!isOpen) return null;

  const currentChallenge = QUICK_MATH_CHALLENGES[currentIndex] || QUICK_MATH_CHALLENGES[0];

  const handleNextChallenge = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % QUICK_MATH_CHALLENGES.length);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/30 rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Thử Thách Nhanh 1 Phút</h3>
              <p className="text-xs text-amber-950/80 font-medium">Nội quy lớp học &amp; Kiến thức tổng hợp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-950 hover:bg-black/10 p-1.5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
              Chủ đề: {currentChallenge.topic}
            </span>
            <span className="font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Thưởng +{currentChallenge.points} điểm
            </span>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Câu hỏi thi đua:
            </p>
            <p className="text-base font-bold text-slate-900 leading-relaxed">
              {currentChallenge.question}
            </p>
          </div>

          {/* Answer Box (toggleable) */}
          <div className="space-y-2">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1.5"
            >
              {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showAnswer ? 'Ẩn đáp án & gợi ý' : 'Hiển thị đáp án & hướng dẫn'}</span>
            </button>

            {showAnswer && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs sm:text-sm animate-in fade-in">
                <span className="font-bold text-emerald-800 block mb-1">Đáp án chính xác:</span>
                <p className="font-mono font-medium">{currentChallenge.answer}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={handleNextChallenge}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-1.5"
            >
              <Shuffle className="w-4 h-4 text-slate-500" />
              <span>Đổi câu hỏi khác</span>
            </button>

            <button
              onClick={() => {
                onAwardChallengePoint(
                  currentChallenge.points,
                  `Giải đúng thử thách nhanh: ${currentChallenge.topic}`
                );
                onClose();
              }}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <Award className="w-4 h-4" />
              <span>Chấm điểm câu này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
