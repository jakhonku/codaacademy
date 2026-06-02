/* ============================================
   ADMIN PANEL SAHIFASI (admin/page.js)
   ============================================
   Bu sahifa administrator (o'qituvchi) uchun mo'ljallangan.
   
   Xususiyatlari:
   1. Parol orqali himoyalangan kirish.
   2. Promptlar boshqaruvi (Qo'shish, Tahrirlash, O'chirish).
   3. Resurslar boshqaruvi (Qo'shish, Tahrirlash, O'chirish).
   4. Bosh sahifadan oflayn darsga ro'yxatdan o'tganlar ro'yxati.
   5. Supabase bilan to'liq bog'langan (agar ulanish bo'lmasa, lokal rejimda ishlaydi).
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import staticPrompts from "@/data/prompts";
import staticResources from "@/data/resources";

// Ikonkalar
import {
  Lock,
  Database,
  Plus,
  Edit2,
  Trash2,
  Users,
  Lightbulb,
  FileText,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ChevronRight,
  Upload,
  UploadCloud,
  X,
  UserCircle,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  Send,
  Mail,
  Clock,
  MapPin
} from "lucide-react";

export default function AdminPage() {
  // Tizim holati
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Ma'lumotlar holati
  const [activeTab, setActiveTab] = useState("prompts"); // "prompts" | "resources" | "registrations" | "users" | "tasks" | "messages" | "lessons"
  const [prompts, setPrompts] = useState([]);
  const [resources, setResources] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);          // Google orqali ro'yxatdan o'tganlar
  const [userTasks, setUserTasks] = useState([]);  // Foydalanuvchi vazifalari
  const [userMessages, setUserMessages] = useState([]); // Foydalanuvchi xabarlari
  const [lessons, setLessons] = useState([]);      // Dars jadvali
  const [loading, setLoading] = useState(true);

  // Modal / Tahrirlash holati
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState({ id: null, title: "", category: "Ta'lim", description: "", promptText: "" });

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState({ id: null, title: "", description: "", type: "pdf", url: "", fileSize: "", parentId: null });

  // Vazifa modali
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ id: null, userId: "", title: "", description: "", dueDate: "" });

  // Xabar modali
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({ id: null, userId: "", subject: "", body: "" });

  // Dars modali
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({ id: null, title: "", description: "", scheduledAt: "", durationMinutes: 60, location: "", meetingLink: "" });

  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }

  // Fayl yuklash holati
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Parolni tekshirish (Local storage yoki state orqali sessiyani saqlash)
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (passwordInput === envPassword) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("Noto'g'ri parol! Iltimos, qayta urinib ko'ring.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Ma'lumotlarni yuklash (Supabase yoki Fallback)
  const loadAllData = async () => {
    setLoading(true);
    if (supabase) {
      try {
        // 1. Promptlarni yuklash
        const { data: pData, error: pErr } = await supabase.from("prompts").select("*").order("created_at", { ascending: true });
        if (!pErr && pData) {
          setPrompts(pData.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            promptText: item.prompt_text || item.promptText
          })));
        } else {
          setPrompts(staticPrompts);
        }

        // 2. Resurslarni yuklash
        const { data: rData, error: rErr } = await supabase.from("resources").select("*").order("created_at", { ascending: true });
        if (!rErr && rData) {
          setResources(rData.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type,
            url: item.url,
            fileSize: item.file_size || item.fileSize,
            parentId: item.parent_id || item.parentId || null
          })));
        } else {
          setResources(staticResources);
        }

        // 3. Ro'yxatdan o'tganlarni yuklash
        const { data: regData, error: regErr } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
        if (!regErr && regData) {
          setRegistrations(regData.map(item => ({
            id: item.id,
            fullName: item.full_name,
            phone: item.phone,
            department: item.department,
            createdAt: item.created_at
          })));
        } else {
          setRegistrations([]);
        }

        // 4. Google orqali ro'yxatdan o'tgan foydalanuvchilar
        //    auth.users dan to'g'ridan-to'g'ri o'qish uchun server API
        //    ishlatamiz (service_role kalit talab qilinadi).
        try {
          const adminPwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
          const res = await fetch("/api/admin/users", {
            headers: { "x-admin-password": adminPwd },
          });
          if (res.ok) {
            const json = await res.json();
            setUsers(json.users || []);
          } else {
            console.error("Foydalanuvchilarni olishda xato:", await res.text());
            setUsers([]);
          }
        } catch (e) {
          console.error("API xatosi:", e);
          setUsers([]);
        }

        // 5. Foydalanuvchi vazifalari
        const { data: tData, error: tErr } = await supabase
          .from("user_tasks")
          .select("*")
          .order("created_at", { ascending: false });
        if (!tErr && tData) {
          setUserTasks(tData.map(t => ({
            id: t.id,
            userId: t.user_id,
            title: t.title,
            description: t.description,
            dueDate: t.due_date,
            isCompleted: t.is_completed,
            createdAt: t.created_at,
          })));
        } else {
          setUserTasks([]);
        }

        // 6. Foydalanuvchi xabarlari
        const { data: mData, error: mErr } = await supabase
          .from("user_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (!mErr && mData) {
          setUserMessages(mData.map(m => ({
            id: m.id,
            userId: m.user_id,
            subject: m.subject,
            body: m.body,
            isRead: m.is_read,
            createdAt: m.created_at,
          })));
        } else {
          setUserMessages([]);
        }

        // 7. Dars jadvali
        const { data: lData, error: lErr } = await supabase
          .from("lessons")
          .select("*")
          .order("scheduled_at", { ascending: true });
        if (!lErr && lData) {
          setLessons(lData.map(l => ({
            id: l.id,
            title: l.title,
            description: l.description,
            scheduledAt: l.scheduled_at,
            durationMinutes: l.duration_minutes,
            location: l.location,
            meetingLink: l.meeting_link,
            createdAt: l.created_at,
          })));
        } else {
          setLessons([]);
        }
      } catch (err) {
        console.error("Supabase ma'lumotlarni yuklashda xatolik:", err);
        // Fallback
        setPrompts(staticPrompts);
        setResources(staticResources);
      }
    } else {
      // Lokal ma'lumotlar
      setPrompts(staticPrompts);
      setResources(staticResources);
      
      try {
        const localRegs = JSON.parse(localStorage.getItem("offline_registrations") || "[]");
        setRegistrations(localRegs.map(item => ({
          id: item.id,
          fullName: item.fullName,
          phone: item.phone,
          department: item.department,
          createdAt: item.created_at
        })).sort((a,b) => b.id - a.id));
      } catch (e) {
        setRegistrations([]);
      }
    }
    setLoading(false);
  };

  // Bildirishnoma ko'rsatish
  const showNotice = (text, type = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ============================================
  // PROMPT AMALLARI (CRUD)
  // ============================================
  const savePrompt = async (e) => {
    e.preventDefault();
    const isEdit = currentPrompt.id !== null;

    if (supabase) {
      try {
        const payload = {
          title: currentPrompt.title,
          category: currentPrompt.category,
          description: currentPrompt.description,
          prompt_text: currentPrompt.promptText,
        };

        if (isEdit) {
          const { error } = await supabase.from("prompts").update(payload).eq("id", currentPrompt.id);
          if (error) throw error;
          showNotice("Prompt muvaffaqiyatli yangilandi.");
        } else {
          const { error } = await supabase.from("prompts").insert([payload]);
          if (error) throw error;
          showNotice("Yangi prompt qo'shildi.");
        }
        loadAllData();
        setIsPromptModalOpen(false);
      } catch (err) {
        console.error("Prompt saqlashda xato:", err);
        showNotice("Xatolik yuz berdi: " + err.message, "error");
      }
    } else {
      // Lokal rejimda
      if (isEdit) {
        setPrompts(prev => prev.map(p => p.id === currentPrompt.id ? currentPrompt : p));
        showNotice("Prompt yangilandi (Lokal)");
      } else {
        const newP = { ...currentPrompt, id: Date.now() };
        setPrompts(prev => [...prev, newP]);
        showNotice("Prompt qo'shildi (Lokal)");
      }
      setIsPromptModalOpen(false);
    }
  };

  const deletePrompt = async (id) => {
    if (!confirm("Haqiqatan ham ushbu promptni o'chirishni xohlaysizmi?")) return;

    if (supabase) {
      try {
        const { error } = await supabase.from("prompts").delete().eq("id", id);
        if (error) throw error;
        showNotice("Prompt o'chirildi.");
        loadAllData();
      } catch (err) {
        showNotice("Xatolik: " + err.message, "error");
      }
    } else {
      setPrompts(prev => prev.filter(p => p.id !== id));
      showNotice("Prompt o'chirildi (Lokal)");
    }
  };

  // ============================================
  // VAZIFA AMALLARI (CRUD)
  // ============================================
  const saveTask = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showNotice("Supabase sozlanmagan", "error");
      return;
    }
    const isEdit = currentTask.id !== null;
    try {
      const payload = {
        user_id: currentTask.userId || null, // bo'sh bo'lsa BARCHA foydalanuvchilarga
        title: currentTask.title,
        description: currentTask.description,
        due_date: currentTask.dueDate || null,
      };
      if (isEdit) {
        const { error } = await supabase.from("user_tasks").update(payload).eq("id", currentTask.id);
        if (error) throw error;
        showNotice("Vazifa yangilandi.");
      } else {
        const { error } = await supabase.from("user_tasks").insert([payload]);
        if (error) throw error;
        showNotice(currentTask.userId ? "Vazifa yuborildi." : "Vazifa barcha foydalanuvchilarga yuborildi.");
      }
      loadAllData();
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error("Vazifa saqlashda xato:", err);
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Haqiqatan ham ushbu vazifani o'chirishni xohlaysizmi?")) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from("user_tasks").delete().eq("id", id);
      if (error) throw error;
      showNotice("Vazifa o'chirildi.");
      loadAllData();
    } catch (err) {
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  // ============================================
  // XABAR AMALLARI (CRUD)
  // ============================================
  const saveMessage = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showNotice("Supabase sozlanmagan", "error");
      return;
    }
    const isEdit = currentMessage.id !== null;
    try {
      const payload = {
        user_id: currentMessage.userId || null,
        subject: currentMessage.subject,
        body: currentMessage.body,
      };
      if (isEdit) {
        const { error } = await supabase.from("user_messages").update(payload).eq("id", currentMessage.id);
        if (error) throw error;
        showNotice("Xabar yangilandi.");
      } else {
        const { error } = await supabase.from("user_messages").insert([payload]);
        if (error) throw error;
        showNotice(currentMessage.userId ? "Xabar yuborildi." : "Xabar barcha foydalanuvchilarga yuborildi.");
      }
      loadAllData();
      setIsMessageModalOpen(false);
    } catch (err) {
      console.error("Xabar saqlashda xato:", err);
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Haqiqatan ham ushbu xabarni o'chirishni xohlaysizmi?")) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from("user_messages").delete().eq("id", id);
      if (error) throw error;
      showNotice("Xabar o'chirildi.");
      loadAllData();
    } catch (err) {
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  // ============================================
  // DARS JADVALI AMALLARI (CRUD)
  // ============================================
  const saveLesson = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showNotice("Supabase sozlanmagan", "error");
      return;
    }
    const isEdit = currentLesson.id !== null;
    try {
      const payload = {
        title: currentLesson.title,
        description: currentLesson.description,
        scheduled_at: currentLesson.scheduledAt,
        duration_minutes: Number(currentLesson.durationMinutes) || 60,
        location: currentLesson.location,
        meeting_link: currentLesson.meetingLink,
      };
      if (isEdit) {
        const { error } = await supabase.from("lessons").update(payload).eq("id", currentLesson.id);
        if (error) throw error;
        showNotice("Dars yangilandi.");
      } else {
        const { error } = await supabase.from("lessons").insert([payload]);
        if (error) throw error;
        showNotice("Dars qo'shildi.");
      }
      loadAllData();
      setIsLessonModalOpen(false);
    } catch (err) {
      console.error("Dars saqlashda xato:", err);
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  const deleteLesson = async (id) => {
    if (!confirm("Haqiqatan ham ushbu darsni o'chirishni xohlaysizmi?")) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
      showNotice("Dars o'chirildi.");
      loadAllData();
    } catch (err) {
      showNotice("Xatolik: " + err.message, "error");
    }
  };

  // Foydalanuvchi nomini ID orqali olish (vazifa/xabarlarda ko'rsatish uchun)
  const getUserName = (userId) => {
    if (!userId) return "Barcha foydalanuvchilar";
    const u = users.find(usr => usr.id === userId);
    return u ? (u.fullName || u.email) : "Noma'lum foydalanuvchi";
  };

  // datetime-local input uchun formatlash
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // ============================================
  // FAYL YUKLASH FUNKSIYASI
  // ============================================
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Ruxsat berilgan turlar
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotice("Bu fayl turi qo'llab-quvvatlanmaydi. Faqat PDF, Word va rasm fayllarini yuklash mumkin.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotice("Fayl hajmi 10MB dan oshmasligi kerak.", "error");
      return;
    }

    setUploadingFile(true);
    setUploadProgress("Fayl yuklanmoqda...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Yuklashda xatolik");
      }

      // Formani avtomatik to'ldirish
      setCurrentResource(prev => ({
        ...prev,
        url: result.url,
        fileSize: result.fileSize,
      }));

      setUploadProgress(`✅ "${result.fileName}" muvaffaqiyatli yuklandi!`);
      showNotice("Fayl muvaffaqiyatli yuklandi!");
    } catch (err) {
      console.error("Fayl yuklash xatosi:", err);
      setUploadProgress("");
      showNotice("Fayl yuklashda xatolik: " + err.message, "error");
    } finally {
      setUploadingFile(false);
    }
  };

  // Drag & Drop hodisalari
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ============================================
  // RESURS AMALLARI (CRUD)
  // ============================================
  const saveResource = async (e) => {
    e.preventDefault();
    const isEdit = currentResource.id !== null;
    
    const isGroup = currentResource.type === "group";
    const finalUrl = isGroup ? "" : (currentResource.url || "");
    const finalFileSize = isGroup ? null : (currentResource.fileSize || null);
    const finalParentId = isGroup ? null : (currentResource.parentId || null);

    if (supabase) {
      try {
        const payload = {
          title: currentResource.title,
          description: currentResource.description,
          type: currentResource.type,
          url: finalUrl,
          file_size: finalFileSize,
          parent_id: finalParentId,
        };

        if (isEdit) {
          const { error } = await supabase.from("resources").update(payload).eq("id", currentResource.id);
          if (error) throw error;
          showNotice("Resurs muvaffaqiyatli yangilandi.");
        } else {
          const { error } = await supabase.from("resources").insert([payload]);
          if (error) throw error;
          showNotice("Yangi resurs qo'shildi.");
        }
        loadAllData();
        setIsResourceModalOpen(false);
        setUploadProgress("");
      } catch (err) {
        console.error("Resurs saqlashda xato:", err);
        showNotice("Xatolik: " + err.message, "error");
      }
    } else {
      // Lokal rejimda
      const updatedResource = {
        ...currentResource,
        url: finalUrl,
        fileSize: finalFileSize,
        parentId: finalParentId,
      };

      if (isEdit) {
        setResources(prev => prev.map(r => r.id === currentResource.id ? updatedResource : r));
        showNotice("Resurs yangilandi (Lokal)");
      } else {
        const newR = { ...updatedResource, id: Date.now() };
        setResources(prev => [...prev, newR]);
        showNotice("Resurs qo'shildi (Lokal)");
      }
      setIsResourceModalOpen(false);
      setUploadProgress("");
    }
  };

  const deleteResource = async (id) => {
    if (!confirm("Haqiqatan ham ushbu resursni o'chirishni xohlaysizmi?")) return;

    if (supabase) {
      try {
        const { error } = await supabase.from("resources").delete().eq("id", id);
        if (error) throw error;
        showNotice("Resurs o'chirildi.");
        loadAllData();
      } catch (err) {
        showNotice("Xatolik: " + err.message, "error");
      }
    } else {
      setResources(prev => prev.filter(r => r.id !== id));
      showNotice("Resurs o'chirildi (Lokal)");
    }
  };

  // Resurslarni ierarxik tartiblash (groups, children, orphans)
  const getStructuredResources = () => {
    const groups = resources.filter(r => r.type === "group");
    const orphans = resources.filter(r => r.type !== "group" && !r.parentId);
    
    const structured = [];
    
    // Har bir guruh va uning bolalarini qo'shamiz
    groups.forEach(group => {
      structured.push({ ...group, isGroupParent: true });
      const children = resources.filter(r => r.parentId === group.id);
      children.forEach(child => {
        structured.push({ ...child, isGroupChild: true, parentTitle: group.title });
      });
    });
    
    // Guruhga kirmaganlarni qo'shamiz
    orphans.forEach(orphan => {
      structured.push(orphan);
    });
    
    return structured;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
        <div className="bg-white border border-border/80 p-8 md:p-12 rounded-3xl max-w-md w-full shadow-2xl shadow-primary/5 relative overflow-hidden">
          {/* Bezaklar */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/5 rounded-full blur-xl" />

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Boshqaruv Tizimi</h1>
            <p className="text-muted text-xs mt-1 text-center">
              Coda Academy boshqaruv paneliga kirish uchun parolni kiriting.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="password">
                Parol
              </label>
              <input
                type="password"
                id="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Parolni kiriting"
                className="w-full px-4 py-3 rounded-2xl border border-border/80 bg-cream/20 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {loginError && (
              <p className="text-rose-600 text-xs font-medium bg-rose-50 p-3 rounded-xl border border-rose-100">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
            >
              Tizimga kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Notification */}
        {notification && (
          <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 p-4 rounded-2xl border shadow-lg animate-fade-in-left ${
            notification.type === 'error' 
              ? 'bg-rose-50 border-rose-200 text-rose-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <CheckCircle className={`w-5 h-5 ${notification.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`} />
            <span className="text-sm font-semibold">{notification.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              Coda Academy Boshqaruv Paneli
            </h1>
            <p className="text-muted text-xs mt-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-primary" />
              {supabase ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  Supabase Ma'lumotlar Bazasi Faol
                </span>
              ) : (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  Lokal demo rejim (.env.local sozlanmagan)
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-border hover:bg-rose-50 hover:text-rose-600 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </div>

        {/* Tab tugmalari */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/60 p-1.5 rounded-2xl border border-border/40 inline-flex">
          <button
            onClick={() => setActiveTab("prompts")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "prompts"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Promptlar
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "resources"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <FileText className="w-4 h-4" />
            Resurslar
          </button>

          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "registrations"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <Users className="w-4 h-4" />
            Oflayn ariza ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <UserCircle className="w-4 h-4" />
            Foydalanuvchilar ({users.length})
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Vazifalar ({userTasks.length})
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "messages"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Xabarlar ({userMessages.length})
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "lessons"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground hover:bg-cream-dark"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Dars jadvali ({lessons.length})
          </button>
        </div>

        {/* Yuklanmoqda... */}
        {loading ? (
          <div className="bg-white border border-border/40 rounded-3xl p-16 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted text-sm font-medium">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="bg-white border border-border/40 rounded-3xl shadow-sm overflow-hidden">
            
            {/* ============================================
                TAB 1: PROMPTLAR boshqaruvi
                ============================================ */}
            {activeTab === "prompts" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Promptlar Ro'yxati</h2>
                    <p className="text-muted text-xs">Saytdagi prompt shablonlarini tahrirlang yoki yangi qo'shing.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPrompt({ id: null, title: "", category: "Ta'lim", description: "", promptText: "" });
                      setIsPromptModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Prompt Qo'shish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Sarlavha</th>
                        <th className="py-4 px-4">Kategoriya</th>
                        <th className="py-4 px-4">Tavsif</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {prompts.map((p) => (
                        <tr key={p.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4 font-bold text-foreground">{p.title}</td>
                          <td className="py-4 px-4">
                            <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-muted text-xs truncate max-w-xs">{p.description}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentPrompt(p);
                                  setIsPromptModalOpen(true);
                                }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePrompt(p.id)}
                                className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {prompts.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-muted">Hech qanday prompt topilmadi.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 2: RESURSLAR boshqaruvi
                ============================================
                ============================================ */}
            {activeTab === "resources" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Resurslar Ro'yxati</h2>
                    <p className="text-muted text-xs">O'qituvchilar yuklab olishi yoki ko'rishi mumkin bo'lgan fayllar.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentResource({ id: null, title: "", description: "", type: "pdf", url: "", fileSize: "", parentId: null });
                      setIsResourceModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Resurs Qo'shish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Nomi</th>
                        <th className="py-4 px-4">Turi</th>
                        <th className="py-4 px-4">Manzil (Havola)</th>
                        <th className="py-4 px-4">Hajmi</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {getStructuredResources().map((r) => (
                        <tr key={r.id} className={`hover:bg-cream/20 ${r.isGroupParent ? 'bg-primary/[0.02] font-semibold' : ''}`}>
                          <td className="py-4 px-4 text-foreground">
                            {r.isGroupChild ? (
                              <div className="flex items-center gap-2 pl-6 font-medium text-muted">
                                <span className="text-muted/40 font-mono">└─</span>
                                <span>{r.title}</span>
                              </div>
                            ) : r.type === 'group' ? (
                              <div className="flex items-center gap-2 text-primary font-bold">
                                <span className="text-lg">📁</span>
                                <span>{r.title}</span>
                              </div>
                            ) : (
                              <span>{r.title}</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              r.type === 'group' ? 'bg-indigo-100 text-indigo-800' :
                              r.type === 'pdf' ? 'bg-rose-100 text-rose-800' :
                              r.type === 'video' ? 'bg-blue-100 text-blue-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {r.type === 'group' ? 'MODUL' : r.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-muted text-xs truncate max-w-xs">
                            {r.url ? (
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                {r.url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">{r.fileSize || "-"}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentResource(r);
                                  setIsResourceModalOpen(true);
                                }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteResource(r.id)}
                                className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {resources.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-muted">Hech qanday resurs topilmadi.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 3: RO'YXATDAN O'TGANLAR
                ============================================ */}
            {activeTab === "registrations" && (
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">Oflayn mashg'ulotga yozilganlar</h2>
                  <p className="text-muted text-xs">Mashg'ulotda ishtirok etish uchun yuborilgan arizalar ro'yxati.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Ism Familiya</th>
                        <th className="py-4 px-4">Telefon</th>
                        <th className="py-4 px-4">Kafedra / Mutaxassislik</th>
                        <th className="py-4 px-4 text-right">Ro'yxatdan o'tgan sana</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4 font-bold text-foreground">{reg.fullName}</td>
                          <td className="py-4 px-4 font-medium text-primary">{reg.phone}</td>
                          <td className="py-4 px-4 text-muted">{reg.department || "-"}</td>
                          <td className="py-4 px-4 text-right text-muted text-xs">
                            {new Date(reg.createdAt).toLocaleString("uz-UZ")}
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-muted">Hozircha hech kim ro'yxatdan o'tmagan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 4: GOOGLE ORQALI RO'YXATDAN O'TGAN FOYDALANUVCHILAR
                ============================================ */}
            {activeTab === "users" && (
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">Google orqali ro'yxatdan o'tganlar</h2>
                  <p className="text-muted text-xs">
                    Saytga Google akkaunti orqali kirgan foydalanuvchilar ro'yxati.
                    Ularga vazifa va xabar yuborishingiz mumkin.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Foydalanuvchi</th>
                        <th className="py-4 px-4">Email</th>
                        <th className="py-4 px-4">Kirgan sana</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt={u.fullName}
                                  className="w-9 h-9 rounded-full object-cover border border-border"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                  {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="font-semibold text-foreground">{u.fullName || "—"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">{u.email}</td>
                          <td className="py-4 px-4 text-muted text-xs">
                            {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentTask({ id: null, userId: u.id, title: "", description: "", dueDate: "" });
                                  setIsTaskModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary hover:text-white text-primary text-xs font-semibold rounded-xl transition-all cursor-pointer"
                                title="Vazifa yuborish"
                              >
                                <ClipboardList className="w-3.5 h-3.5" />
                                Vazifa
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentMessage({ id: null, userId: u.id, subject: "", body: "" });
                                  setIsMessageModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent hover:text-white text-accent text-xs font-semibold rounded-xl transition-all cursor-pointer"
                                title="Xabar yuborish"
                              >
                                <Send className="w-3.5 h-3.5" />
                                Xabar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-muted">
                            Hozircha hech kim Google orqali ro'yxatdan o'tmagan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 5: VAZIFALAR
                ============================================ */}
            {activeTab === "tasks" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Foydalanuvchi vazifalari</h2>
                    <p className="text-muted text-xs">Foydalanuvchilarga yuborilgan vazifalar ro'yxati.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTask({ id: null, userId: "", title: "", description: "", dueDate: "" });
                      setIsTaskModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Vazifa yuborish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Sarlavha</th>
                        <th className="py-4 px-4">Kimga</th>
                        <th className="py-4 px-4">Muddat</th>
                        <th className="py-4 px-4">Holati</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {userTasks.map((t) => (
                        <tr key={t.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4">
                            <div className="font-bold text-foreground">{t.title}</div>
                            {t.description && (
                              <div className="text-xs text-muted mt-1 line-clamp-1">{t.description}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs">
                            {t.userId ? (
                              <span className="text-foreground">{getUserName(t.userId)}</span>
                            ) : (
                              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                                Barchaga
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">
                            {t.dueDate
                              ? new Date(t.dueDate).toLocaleDateString("uz-UZ")
                              : "—"}
                          </td>
                          <td className="py-4 px-4">
                            {t.isCompleted ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Bajarildi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                <Clock className="w-3 h-3" />
                                Kutilmoqda
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentTask({
                                    id: t.id,
                                    userId: t.userId || "",
                                    title: t.title,
                                    description: t.description || "",
                                    dueDate: t.dueDate || "",
                                  });
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTask(t.id)}
                                className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {userTasks.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-muted">Hech qanday vazifa yuborilmagan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 6: XABARLAR
                ============================================ */}
            {activeTab === "messages" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Foydalanuvchi xabarlari</h2>
                    <p className="text-muted text-xs">Foydalanuvchilarga yuborilgan xabarlar ro'yxati.</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentMessage({ id: null, userId: "", subject: "", body: "" });
                      setIsMessageModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Xabar yuborish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Mavzu</th>
                        <th className="py-4 px-4">Kimga</th>
                        <th className="py-4 px-4">Yuborilgan sana</th>
                        <th className="py-4 px-4">Holati</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {userMessages.map((m) => (
                        <tr key={m.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4">
                            <div className="font-bold text-foreground">{m.subject}</div>
                            <div className="text-xs text-muted mt-1 line-clamp-1">{m.body}</div>
                          </td>
                          <td className="py-4 px-4 text-xs">
                            {m.userId ? (
                              <span className="text-foreground">{getUserName(m.userId)}</span>
                            ) : (
                              <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                                Barchaga
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">
                            {new Date(m.createdAt).toLocaleString("uz-UZ")}
                          </td>
                          <td className="py-4 px-4">
                            {m.isRead ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                <CheckCircle className="w-3 h-3" />
                                O'qildi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                <Mail className="w-3 h-3" />
                                Yangi
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentMessage({
                                    id: m.id,
                                    userId: m.userId || "",
                                    subject: m.subject,
                                    body: m.body,
                                  });
                                  setIsMessageModalOpen(true);
                                }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteMessage(m.id)}
                                className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {userMessages.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-muted">Hech qanday xabar yuborilmagan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================
                TAB 7: DARS JADVALI
                ============================================ */}
            {activeTab === "lessons" && (
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Dars jadvali</h2>
                    <p className="text-muted text-xs">
                      Ro'yxatdan o'tgan foydalanuvchilar profilida ko'rinadigan darslar.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentLesson({ id: null, title: "", description: "", scheduledAt: "", durationMinutes: 60, location: "", meetingLink: "" });
                      setIsLessonModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Dars qo'shish
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/80 text-muted font-semibold">
                        <th className="py-4 px-4">Dars nomi</th>
                        <th className="py-4 px-4">Sana va vaqt</th>
                        <th className="py-4 px-4">Davomiyligi</th>
                        <th className="py-4 px-4">Joy / Havola</th>
                        <th className="py-4 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {lessons.map((l) => (
                        <tr key={l.id} className="hover:bg-cream/20">
                          <td className="py-4 px-4">
                            <div className="font-bold text-foreground">{l.title}</div>
                            {l.description && (
                              <div className="text-xs text-muted mt-1 line-clamp-1">{l.description}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">
                            {new Date(l.scheduledAt).toLocaleString("uz-UZ")}
                          </td>
                          <td className="py-4 px-4 text-muted text-xs">{l.durationMinutes} daq.</td>
                          <td className="py-4 px-4 text-muted text-xs">
                            {l.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.location}</div>}
                            {l.meetingLink && (
                              <a href={l.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline mt-1">
                                Havola <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setCurrentLesson({
                                    id: l.id,
                                    title: l.title,
                                    description: l.description || "",
                                    scheduledAt: formatDateTimeLocal(l.scheduledAt),
                                    durationMinutes: l.durationMinutes,
                                    location: l.location || "",
                                    meetingLink: l.meetingLink || "",
                                  });
                                  setIsLessonModalOpen(true);
                                }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteLesson(l.id)}
                                className="p-2 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {lessons.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-muted">Hech qanday dars qo'shilmagan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ============================================
          PROMPT MODAL (Qo'shish / Tahrirlash)
          ============================================ */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative animate-fade-in-up">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {currentPrompt.id ? "Promptni tahrirlash" : "Yangi prompt qo'shish"}
            </h3>

            <form onSubmit={savePrompt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  value={currentPrompt.title}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, title: e.target.value })}
                  placeholder="Masalan: Test savollari tuzish"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Kategoriya *</label>
                  <input
                    type="text"
                    required
                    value={currentPrompt.category}
                    onChange={(e) => setCurrentPrompt({ ...currentPrompt, category: e.target.value })}
                    placeholder="Masalan: Musiqa / Ta'lim"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tavsif</label>
                  <input
                    type="text"
                    value={currentPrompt.description}
                    onChange={(e) => setCurrentPrompt({ ...currentPrompt, description: e.target.value })}
                    placeholder="Qisqacha izoh"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Prompt Matni *</label>
                <textarea
                  required
                  rows="4"
                  value={currentPrompt.promptText}
                  onChange={(e) => setCurrentPrompt({ ...currentPrompt, promptText: e.target.value })}
                  placeholder="AI-ga beriladigan to'liq buyruq matnini kiriting. O'zgaruvchilarni [MAVZU NOMI] kabi yozing."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(false)}
                  className="px-4 py-2.5 border border-border text-muted hover:bg-cream-dark rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          RESURS MODAL (Qo'shish / Tahrirlash)
          ============================================ */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {currentResource.id ? "Resursni tahrirlash" : "Yangi resurs qo'shish"}
            </h3>

            <form onSubmit={saveResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  value={currentResource.title}
                  onChange={(e) => setCurrentResource({ ...currentResource, title: e.target.value })}
                  placeholder="Masalan: ChatGPT Qo'llanmasi"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tavsif</label>
                <input
                  type="text"
                  value={currentResource.description}
                  onChange={(e) => setCurrentResource({ ...currentResource, description: e.target.value })}
                  placeholder="Resurs haqida qisqacha ma'lumot"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Turi *</label>
                  <select
                    value={currentResource.type}
                    onChange={(e) => setCurrentResource({ 
                      ...currentResource, 
                      type: e.target.value, 
                      // Agar guruh bo'lsa parentId ni o'chiramiz
                      parentId: e.target.value === 'group' ? null : currentResource.parentId 
                    })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="pdf">PDF Fayl</option>
                    <option value="video">Video Havola</option>
                    <option value="link">Veb-sayt Havolasi</option>
                    <option value="group">📁 Modul / Guruh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Fayl Hajmi</label>
                  <input
                    type="text"
                    disabled={currentResource.type === 'group'}
                    value={currentResource.fileSize || ""}
                    onChange={(e) => setCurrentResource({ ...currentResource, fileSize: e.target.value })}
                    placeholder={currentResource.type === 'group' ? "Guruhda havola bo'lmaydi" : "Avto-to'ldiriladi"}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Agar fayl bo'lsa, ota guruhni tanlash dropdowni */}
              {currentResource.type !== 'group' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Biriktirilgan Modul / Guruh</label>
                  <select
                    value={currentResource.parentId || ""}
                    onChange={(e) => setCurrentResource({ ...currentResource, parentId: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Modulga biriktirmaslik (Mustaqil resurs) --</option>
                    {resources
                      .filter(r => r.type === 'group' && r.id !== currentResource.id)
                      .map(g => (
                        <option key={g.id} value={g.id}>{g.title}</option>
                      ))
                    }
                  </select>
                  <p className="text-xs text-muted/60 mt-1">Ushbu resurs qaysi modul ichiga joylashishini belgilang.</p>
                </div>
              )}

              {/* ============================================
                  FAYL YUKLASH ZONASI
                  ============================================ */}
              {currentResource.type !== 'group' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Fayl yuklash (PDF, Word, Rasm)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border/60 bg-cream/10 hover:border-primary/40 hover:bg-cream/30"
                    }`}
                    onClick={() => document.getElementById("file-upload-input").click()}
                  >
                    <input
                      type="file"
                      id="file-upload-input"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(file);
                        e.target.value = "";
                      }}
                    />

                    {uploadingFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm text-primary font-medium">Yuklanmoqda...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted/40"}`} />
                        <p className="text-sm text-muted">
                          <span className="text-primary font-semibold">Fayl tanlang</span> yoki shu yerga tashlang
                        </p>
                        <p className="text-xs text-muted/60">PDF, Word, PNG, JPG (max 10MB)</p>
                      </div>
                    )}
                  </div>

                  {/* Yuklangan fayl xabari */}
                  {uploadProgress && (
                    <div className="mt-2 flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs text-emerald-800 font-medium truncate">{uploadProgress}</span>
                      <button
                        type="button"
                        onClick={() => setUploadProgress("")}
                        className="ml-auto text-emerald-400 hover:text-emerald-600 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Yoki qo'lda havola kiritish */}
              {currentResource.type !== 'group' && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Havola (URL) {!currentResource.url && "*"}
                  </label>
                  <input
                    type="text"
                    required
                    value={currentResource.url || ""}
                    onChange={(e) => setCurrentResource({ ...currentResource, url: e.target.value })}
                    placeholder="Fayl yuklasangiz avtomatik to'ldiriladi yoki qo'lda kiriting"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-xs text-muted/60 mt-1">Fayl yuklagan bo'lsangiz, havola avtomatik qo'yiladi</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsResourceModalOpen(false); setUploadProgress(""); }}
                  className="px-4 py-2.5 border border-border text-muted hover:bg-cream-dark rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {uploadingFile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          VAZIFA MODALI (Qo'shish / Tahrirlash)
          ============================================ */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {currentTask.id ? "Vazifani tahrirlash" : "Yangi vazifa yuborish"}
            </h3>

            <form onSubmit={saveTask} className="space-y-4">
              {/* Kimga yuborish */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Kimga yuborish *</label>
                <select
                  value={currentTask.userId}
                  onChange={(e) => setCurrentTask({ ...currentTask, userId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">📢 Barcha foydalanuvchilarga</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.email} ({u.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted/60 mt-1">
                  "Barcha foydalanuvchilarga" tanlasangiz, vazifa hammaga ko'rinadi.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Vazifa sarlavhasi *</label>
                <input
                  type="text"
                  required
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  placeholder="Masalan: 1-modul testini topshirish"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tavsif</label>
                <textarea
                  rows="4"
                  value={currentTask.description}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  placeholder="Vazifani batafsil tushuntiring..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Bajarish muddati</label>
                <input
                  type="date"
                  value={currentTask.dueDate}
                  onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 border border-border text-muted hover:bg-cream-dark rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {currentTask.id ? "Saqlash" : "Yuborish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          XABAR MODALI (Qo'shish / Tahrirlash)
          ============================================ */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {currentMessage.id ? "Xabarni tahrirlash" : "Yangi xabar yuborish"}
            </h3>

            <form onSubmit={saveMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Kimga yuborish *</label>
                <select
                  value={currentMessage.userId}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, userId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">📢 Barcha foydalanuvchilarga</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.email} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Mavzu *</label>
                <input
                  type="text"
                  required
                  value={currentMessage.subject}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, subject: e.target.value })}
                  placeholder="Masalan: Ertangi dars haqida"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Xabar matni *</label>
                <textarea
                  required
                  rows="6"
                  value={currentMessage.body}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, body: e.target.value })}
                  placeholder="Xabar matnini kiriting..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2.5 border border-border text-muted hover:bg-cream-dark rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {currentMessage.id ? "Saqlash" : "Yuborish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          DARS MODALI (Qo'shish / Tahrirlash)
          ============================================ */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-border rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {currentLesson.id ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
            </h3>

            <form onSubmit={saveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Dars nomi *</label>
                <input
                  type="text"
                  required
                  value={currentLesson.title}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                  placeholder="Masalan: ChatGPT'da prompt yozish"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tavsif</label>
                <textarea
                  rows="3"
                  value={currentLesson.description}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                  placeholder="Dars haqida qisqacha ma'lumot..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Sana va vaqt *</label>
                  <input
                    type="datetime-local"
                    required
                    value={currentLesson.scheduledAt}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Davomiyligi (daqiqa)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={currentLesson.durationMinutes}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Manzil (joy)</label>
                <input
                  type="text"
                  value={currentLesson.location}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, location: e.target.value })}
                  placeholder="Masalan: 305-xona, Coda Academy"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Onlayn havola (Google Meet, Zoom)</label>
                <input
                  type="text"
                  value={currentLesson.meetingLink}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/10 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2.5 border border-border text-muted hover:bg-cream-dark rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
