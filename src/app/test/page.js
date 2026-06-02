/* ============================================
   TEST SAHIFASI (test/page.js)
   ============================================
   Tinglovchilar uchun test sahifasi.
   
   Oqim:
   1. Ism-familiya kiritib ro'yxatdan o'tish
   2. Faol testlarni ko'rish
   3. Testni boshlash (savollar + taymer)
   4. Natija ko'rish (ball + foiz)
   
   Cheklovlar:
   - 3 marta urinish
   - Keyin 1 soat tanaffus
   ============================================ */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  ClipboardCheck,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Trophy,
  AlertTriangle,
  Loader2,
  RotateCcw,
  ArrowRight,
  Timer,
  BookOpen,
  Star,
  Zap,
  Target,
  Lock,
} from "lucide-react";

export default function TestPage() {
  // ============================================
  // HOLATLAR
  // ============================================
  const [step, setStep] = useState("register"); // "register" | "quizList" | "quiz" | "result"
  const [fullName, setFullName] = useState("");
  const [registering, setRegistering] = useState(false);

  // Faol testlar
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Tanlangan test
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  // Taymer
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Natija
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Urinish cheklovi
  const [participant, setParticipant] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(null);
  const [attemptBlocked, setAttemptBlocked] = useState(false);

  // Xatolik
  const [error, setError] = useState("");

  // ============================================
  // SESSIYA TEKSHIRISH
  // ============================================
  useEffect(() => {
    const savedName = sessionStorage.getItem("test_user_name");
    if (savedName) {
      setFullName(savedName);
      setStep("quizList");
      loadQuizzes();
    }
  }, []);

  // ============================================
  // TAYMER
  // ============================================
  useEffect(() => {
    if (step === "quiz" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timeLeft > 0]);

  // ============================================
  // FUNKSIYALAR
  // ============================================

  // Faol testlarni yuklash
  const loadQuizzes = async () => {
    setLoadingQuizzes(true);
    if (supabase) {
      try {
        const { data, error: err } = await supabase
          .from("quizzes")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!err && data) {
          // Har bir test uchun savollar sonini olish
          const quizzesWithCount = await Promise.all(
            data.map(async (quiz) => {
              const { count } = await supabase
                .from("quiz_questions")
                .select("*", { count: "exact", head: true })
                .eq("quiz_id", quiz.id);
              return { ...quiz, questionCount: count || 0 };
            })
          );
          setQuizzes(quizzesWithCount);
        }
      } catch (e) {
        console.error("Testlarni yuklashda xato:", e);
      }
    }
    setLoadingQuizzes(false);
  };

  // Ro'yxatdan o'tish
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setRegistering(true);
    setError("");

    sessionStorage.setItem("test_user_name", fullName.trim());
    await loadQuizzes();
    setStep("quizList");
    setRegistering(false);
  };

  // Urinish tekshirish va testni boshlash
  const startQuiz = async (quiz) => {
    setError("");
    setSelectedQuiz(quiz);

    if (supabase) {
      try {
        // Ishtirokchini tekshirish
        const { data: parts } = await supabase
          .from("quiz_participants")
          .select("*")
          .eq("quiz_id", quiz.id)
          .eq("full_name", fullName.trim());

        const existing = parts && parts.length > 0 ? parts[0] : null;

        if (existing) {
          setParticipant(existing);

          // 3 urinishdan keyin 1 soat tekshirish
          if (existing.attempt_count >= 3) {
            const lastAttempt = new Date(existing.last_attempt_at);
            const now = new Date();
            const diffMs = now - lastAttempt;
            const oneHour = 60 * 60 * 1000;

            if (diffMs < oneHour) {
              const remainingMs = oneHour - diffMs;
              setCooldownTime(Math.ceil(remainingMs / 1000));
              setAttemptBlocked(true);
              setStep("result");
              return;
            } else {
              // 1 soat o'tgan — urinishlarni qayta boshlash
              await supabase
                .from("quiz_participants")
                .update({ attempt_count: 0 })
                .eq("id", existing.id);
              existing.attempt_count = 0;
            }
          }
        }

        // Savollarni yuklash
        const { data: qData, error: qErr } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", quiz.id)
          .order("order_num", { ascending: true });

        if (qErr || !qData || qData.length === 0) {
          setError("Bu testda savollar topilmadi.");
          return;
        }

        setQuestions(qData);
        setCurrentQuestion(0);
        setAnswers({});
        setSelectedOption(null);
        setTimeLeft(quiz.time_limit * 60);
        setAttemptBlocked(false);
        setCooldownTime(null);
        setStep("quiz");
      } catch (e) {
        console.error("Test boshlashda xato:", e);
        setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    }
  };

  // Javobni tanlash
  const selectAnswer = (questionId, option) => {
    setSelectedOption(option);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Keyingi savol
  const nextQuestion = () => {
    setSelectedOption(answers[questions[currentQuestion + 1]?.id] || null);
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  // Oldingi savol
  const prevQuestion = () => {
    setSelectedOption(answers[questions[currentQuestion - 1]?.id] || null);
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  // Testni yakunlash
  const finishQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    setScore(correctCount);

    if (supabase && selectedQuiz) {
      try {
        // Ishtirokchini yangilash yoki yaratish
        const { data: parts } = await supabase
          .from("quiz_participants")
          .select("*")
          .eq("quiz_id", selectedQuiz.id)
          .eq("full_name", fullName.trim());

        const existing = parts && parts.length > 0 ? parts[0] : null;

        if (existing) {
          const newAttempt = (existing.attempt_count || 0) + 1;
          const bestScore = Math.max(existing.score || 0, correctCount);
          await supabase
            .from("quiz_participants")
            .update({
              score: bestScore,
              total_questions: questions.length,
              attempt_count: newAttempt,
              last_attempt_at: new Date().toISOString(),
              completed: true,
            })
            .eq("id", existing.id);
          setParticipant({ ...existing, attempt_count: newAttempt, score: bestScore });
        } else {
          const { data: newPart } = await supabase
            .from("quiz_participants")
            .insert([
              {
                quiz_id: selectedQuiz.id,
                full_name: fullName.trim(),
                score: correctCount,
                total_questions: questions.length,
                attempt_count: 1,
                last_attempt_at: new Date().toISOString(),
                completed: true,
              },
            ])
            .select()
            .single();
          setParticipant(newPart);
        }
      } catch (e) {
        console.error("Natijani saqlashda xato:", e);
      }
    }

    setAttemptBlocked(false);
    setStep("result");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Qayta urinish
  const retryQuiz = () => {
    if (selectedQuiz) {
      startQuiz(selectedQuiz);
    }
  };

  // Testlar ro'yxatiga qaytish
  const backToList = () => {
    setStep("quizList");
    setSelectedQuiz(null);
    setQuestions([]);
    setAnswers({});
    setScore(0);
    setParticipant(null);
    setAttemptBlocked(false);
    setCooldownTime(null);
    loadQuizzes();
  };

  // Vaqtni formatlash
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Foizni hisoblash
  const getPercentage = () => {
    if (questions.length === 0) return 0;
    return Math.round((score / questions.length) * 100);
  };

  // Natija rangi
  const getScoreColor = () => {
    const pct = getPercentage();
    if (pct >= 80) return "text-emerald-600";
    if (pct >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBg = () => {
    const pct = getPercentage();
    if (pct >= 80) return "from-emerald-500 to-teal-600";
    if (pct >= 60) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-pink-600";
  };

  const getScoreLabel = () => {
    const pct = getPercentage();
    if (pct >= 90) return "A'lo!";
    if (pct >= 80) return "Yaxshi!";
    if (pct >= 60) return "Qoniqarli";
    if (pct >= 40) return "Yetarli emas";
    return "Qayta tayyorlaning";
  };

  // ============================================
  // 1. RO'YXATDAN O'TISH
  // ============================================
  if (step === "register") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 py-12">
        <div className="max-w-md w-full">
          {/* Dekorativ yuqori qism */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl shadow-xl shadow-primary/20 mb-5">
              <ClipboardCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bilim Testlari
            </h1>
            <p className="text-muted text-sm max-w-xs mx-auto">
              Testdan o'tish uchun ismingiz va familiyangizni kiriting
            </p>
          </div>

          <div className="bg-white border border-border/60 rounded-3xl p-8 shadow-xl shadow-primary/5 animate-fade-in-up relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />

            <form onSubmit={handleRegister} className="space-y-6 relative">
              <div>
                <label
                  className="block text-sm font-semibold text-foreground mb-2"
                  htmlFor="test-fullname"
                >
                  Familiyangiz va Ismingiz
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/50" />
                  <input
                    type="text"
                    id="test-fullname"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Abdullayev Anvar"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-rose-600 text-xs font-medium bg-rose-50 p-3 rounded-xl border border-rose-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={registering}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 cursor-pointer text-base"
              >
                {registering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Kirish...
                  </>
                ) : (
                  <>
                    Testlarga kirish
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Xususiyatlar */}
          <div className="grid grid-cols-3 gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-white/80 border border-border/40 rounded-2xl p-4 text-center">
              <Timer className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted font-medium">Vaqt chegarasi</p>
            </div>
            <div className="bg-white/80 border border-border/40 rounded-2xl p-4 text-center">
              <Target className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted font-medium">Ball tizimi</p>
            </div>
            <div className="bg-white/80 border border-border/40 rounded-2xl p-4 text-center">
              <Star className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted font-medium">3 urinish</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 2. FAOL TESTLAR RO'YXATI
  // ============================================
  if (step === "quizList") {
    return (
      <div className="min-h-[85vh] bg-cream py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <User className="w-3.5 h-3.5" />
              {fullName}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Faol Testlar
            </h1>
            <p className="text-muted text-sm">
              Quyidagi testlardan birini tanlang va boshlang
            </p>
          </div>

          {loadingQuizzes ? (
            <div className="bg-white border border-border/40 rounded-3xl p-16 flex flex-col items-center justify-center shadow-sm">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted text-sm font-medium">
                Testlar yuklanmoqda...
              </p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white border border-border/40 rounded-3xl p-16 flex flex-col items-center justify-center shadow-sm animate-fade-in-up">
              <div className="w-16 h-16 bg-muted/10 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Hozircha faol test yo'q
              </h3>
              <p className="text-muted text-sm text-center max-w-xs">
                Admin hali testni faollashtirgani yo'q. Iltimos, keyinroq qayta
                tekshiring.
              </p>
              <button
                onClick={loadQuizzes}
                className="mt-6 inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Yangilash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, idx) => (
                <div
                  key={quiz.id}
                  className="bg-white border border-border/40 rounded-3xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-fade-in-up group cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() => startQuiz(quiz)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-primary-dark transition-all duration-300">
                        <ClipboardCheck className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-muted text-sm mt-1">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted bg-cream-dark px-3 py-1.5 rounded-full">
                            <BookOpen className="w-3.5 h-3.5" />
                            {quiz.questionCount} ta savol
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted bg-cream-dark px-3 py-1.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            {quiz.time_limit} daqiqa
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl animate-fade-in-up">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Chiqish tugmasi */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                sessionStorage.removeItem("test_user_name");
                setFullName("");
                setStep("register");
              }}
              className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Chiqish va qayta ro'yxatdan o'tish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 3. TEST JARAYONI
  // ============================================
  if (step === "quiz" && questions.length > 0) {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isLastQuestion = currentQuestion === questions.length - 1;
    const timeWarning = timeLeft < 60;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-[85vh] bg-cream py-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Yuqori panel — Timer + Progress */}
          <div className="bg-white border border-border/40 rounded-2xl p-4 mb-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted">
                  Savol {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-xs text-muted/60">
                  ({answeredCount} ta javob berildi)
                </span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                  timeWarning
                    ? "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse-slow"
                    : "bg-primary/5 text-primary border border-primary/10"
                }`}
              >
                <Timer className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-cream-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Savol kartochkasi */}
          <div className="bg-white border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm animate-fade-in-up">
            {/* Savol matni */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                Savol #{currentQuestion + 1}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                {q.question_text}
              </h2>
            </div>

            {/* Javob variantlari */}
            <div className="space-y-3 mb-8">
              {[
                { key: "A", text: q.option_a },
                { key: "B", text: q.option_b },
                { key: "C", text: q.option_c },
                { key: "D", text: q.option_d },
              ].map((opt) => {
                const isSelected = answers[q.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => selectAnswer(q.id, opt.key)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/40 hover:border-primary/30 hover:bg-cream/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-cream-dark text-muted group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-foreground" : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {opt.text}
                    </span>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigatsiya tugmalari */}
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-muted hover:text-foreground hover:bg-cream-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Oldingi
              </button>

              {isLastQuestion ? (
                <button
                  onClick={finishQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-200 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Testni yakunlash
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer"
                >
                  Keyingi
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Savollar xaritasi */}
          <div className="bg-white border border-border/40 rounded-2xl p-4 mt-4 shadow-sm">
            <p className="text-xs font-semibold text-muted mb-3">Savollar xaritasi:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestion;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setSelectedOption(answers[q.id] || null);
                    }}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-white shadow-sm"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-cream-dark text-muted hover:bg-cream border border-border/40"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 4. NATIJA SAHIFASI
  // ============================================
  if (step === "result") {
    // Agar urinish bloklangan bo'lsa — tanaffus xabari
    if (attemptBlocked && cooldownTime) {
      const cooldownMin = Math.floor(cooldownTime / 60);
      const cooldownSec = cooldownTime % 60;

      return (
        <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 py-12">
          <div className="max-w-md w-full text-center animate-fade-in-up">
            <div className="bg-white border border-border/60 rounded-3xl p-8 shadow-xl">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Tanaffus vaqti
              </h2>
              <p className="text-muted text-sm mb-6">
                Siz 3 marta urinish ishlatdingiz. Qayta urinish uchun
                kutishingiz kerak.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <p className="text-amber-800 text-sm font-semibold">
                  Qolgan vaqt: ~{cooldownMin} daqiqa {cooldownSec} soniya
                </p>
              </div>
              <button
                onClick={backToList}
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-semibold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Testlar ro'yxatiga qaytish
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Normal natija ko'rsatish
    const percentage = getPercentage();
    const attemptsUsed = participant?.attempt_count || 1;
    const attemptsLeft = Math.max(0, 3 - attemptsUsed);

    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 py-12 relative overflow-hidden">
        {/* Confetti effekt */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: [
                    "#4F46E5",
                    "#F59E0B",
                    "#10B981",
                    "#EF4444",
                    "#8B5CF6",
                    "#EC4899",
                  ][i % 6],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="bg-white border border-border/60 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
            {/* Fon bezak */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

            <div className="relative">
              {/* Natija doirasi */}
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBg()} flex items-center justify-center mx-auto mb-6 shadow-xl`}
              >
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${getScoreColor()}`}>
                    {percentage}%
                  </span>
                  <span className="text-xs text-muted font-medium">ball</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-1">
                {getScoreLabel()}
              </h2>
              <p className="text-muted text-sm mb-6">
                {selectedQuiz?.title || "Test"}
              </p>

              {/* Batafsil natija */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                  <p className="text-lg font-bold text-emerald-600">{score}</p>
                  <p className="text-xs text-emerald-700">To'g'ri</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3">
                  <p className="text-lg font-bold text-rose-600">
                    {questions.length - score}
                  </p>
                  <p className="text-xs text-rose-700">Noto'g'ri</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
                  <p className="text-lg font-bold text-blue-600">
                    {questions.length}
                  </p>
                  <p className="text-xs text-blue-700">Jami</p>
                </div>
              </div>

              {/* Urinishlar ma'lumoti */}
              <div className="bg-cream-dark/50 border border-border/30 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    Urinishlar:
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {attemptsUsed} / 3 ishlatildi
                  </span>
                </div>
                {attemptsLeft > 0 && (
                  <p className="text-xs text-primary mt-2 font-medium">
                    Yana {attemptsLeft} ta urinish qoldi
                  </p>
                )}
                {attemptsLeft === 0 && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">
                    Barcha urinishlar tugadi. 1 soat kutgach qayta urinish
                    mumkin.
                  </p>
                )}
              </div>

              {/* Tugmalar */}
              <div className="flex flex-col gap-3">
                {attemptsLeft > 0 && (
                  <button
                    onClick={retryQuiz}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3.5 px-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Qayta urinish
                  </button>
                )}
                <button
                  onClick={backToList}
                  className="w-full inline-flex items-center justify-center gap-2 border border-border text-muted hover:text-foreground hover:bg-cream-dark font-semibold py-3.5 px-6 rounded-2xl transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Testlar ro'yxatiga qaytish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
