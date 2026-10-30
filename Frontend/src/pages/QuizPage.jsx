import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { quizService } from '../services/quizService';
import { fadeInUp, staggerContainer } from '../utils/animations';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export const QuizPage = () => {
  const subjects = quizService.getSubjects();

  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
  const [selectedUnit, setSelectedUnit] = useState(subjects[0].units[2]); // Graph Algorithms
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);

  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'active' | 'completed'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = async () => {
    const data = await quizService.generateQuiz({
      subjectId: selectedSubject,
      unit: selectedUnit,
      difficulty,
      count: questionCount,
    });
    setCurrentQuestions(data.questions);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizState('active');
  };

  const handleSelectOption = (optionIndex) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers[currentIndex] === undefined) {
      toast.error('Please pick an answer option first!');
      return;
    }

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswers[currentIndex] === currentQuestions[currentIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz complete
      setQuizState('completed');
      if (score >= currentQuestions.length * 0.7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const currentQ = currentQuestions[currentIndex];

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.05)}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            AI MCQ Engine
          </Badge>
          <Badge variant="emerald" size="sm">
            Adaptive Knowledge Verification
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Question Generator & Diagnostic Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Synthesize university exam-level multiple choice questions on any specific unit, practice with instant explanations, and target your weak topics.
        </p>
      </motion.div>

      {/* State 1: Setup Configuration */}
      {quizState === 'setup' && (
        <motion.div variants={fadeInUp}>
          <Card className="p-6 sm:p-8 space-y-6 border-primary-500/30">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-white/10">
              Configure Your Practice Quiz
            </h3>

            {/* Subject Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Select Course / Subject
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subjects.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => {
                      setSelectedSubject(subj.name);
                      setSelectedUnit(subj.units[0]);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedSubject === subj.name
                        ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 mb-1.5 opacity-70" />
                    <div className="text-sm font-bold">{subj.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Select Syllabus Unit
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                {subjects
                  .find((s) => s.name === selectedSubject)
                  ?.units.map((unit) => (
                    <option key={unit} value={unit} className="bg-slate-100 dark:bg-dark-surface">
                      {unit}
                    </option>
                  ))}
              </select>
            </div>

            {/* Difficulty & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard', 'Exam-Level'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        difficulty === diff
                          ? 'bg-primary-600 text-white border-primary-500 shadow-sm'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                  Number of Questions
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        questionCount === num
                          ? 'bg-secondary-600 text-white border-secondary-500 shadow-sm'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartQuiz}
              rightIcon={Sparkles}
              className="w-full mt-4 shadow-glow"
            >
              Generate AI Quiz on {selectedUnit}
            </Button>
          </Card>
        </motion.div>
      )}

      {/* State 2: Active Quiz */}
      {quizState === 'active' && currentQ && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {currentQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                {selectedUnit}
              </Badge>
              <Badge variant="amber" size="sm">
                Score: {score}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isCorrect = currentQ.correctIndex === optIdx;

                let stateStyle = 'border-slate-200 dark:border-white/10 hover:border-primary-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/50';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    stateStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    stateStyle = 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400';
                  }
                } else if (isSelected) {
                  stateStyle = 'border-primary-500 bg-primary-500/15 text-primary-600 dark:text-primary-300 font-semibold';
                }

                return (
                  <motion.button
                    key={optIdx}
                    type="button"
                    whileTap={!isAnswerSubmitted ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm transition-all ${stateStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation box after answer confirmation */}
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Reasoning & Explanation:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizState('setup')}
              >
                Exit Quiz
              </Button>

              {!isAnswerSubmitted ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmAnswer}
                >
                  Confirm Answer
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextQuestion}
                  rightIcon={ArrowRight}
                >
                  {currentIndex === currentQuestions.length - 1 ? 'View Performance' : 'Next Question'}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* State 3: Final Scorecard */}
      {quizState === 'completed' && (
        <motion.div variants={fadeInUp}>
          <Card className="p-8 sm:p-10 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto shadow-glow-sm">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <Badge variant="indigo" size="md">
                Quiz Complete
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                You Scored {score} / {currentQuestions.length}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {Math.round((score / currentQuestions.length) * 100)}% Accuracy on {selectedUnit}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-semibold">{selectedSubject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unit:</span>
                <span className="font-semibold">{selectedUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Readiness Assessment:</span>
                <span className="font-bold text-emerald-500">
                  {score >= 4 ? 'Exam Ready' : 'Recommend Revision'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setQuizState('setup')}
                leftIcon={RotateCcw}
                className="flex-1"
              >
                Change Topic
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleStartQuiz}
                rightIcon={Sparkles}
                className="flex-1"
              >
                Retake Quiz
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizPage;

