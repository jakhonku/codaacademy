/* ============================================
   RESURS KARTOCHKASI (ResourceCard.js)
   ============================================
   Bu komponent bitta resursni (PDF, video, havola)
   kartochka shaklida ko'rsatadi.
   
   Props (parametrlar):
   - resource: Resurs obyekti (id, title, description,
     type, url, fileSize)
   - index: Animatsiya kechikishi uchun tartib raqami
   ============================================ */

import {
  FileText,      // PDF fayl ikonkasi
  Video,         // Video ikonkasi
  ExternalLink,  // Tashqi havola ikonkasi
  Download,      // Yuklab olish ikonkasi
} from "lucide-react";

export default function ResourceCard({ resource, index = 0 }) {
  /* ============================================
     RESURS TURIGA QARAB IKONKA VA RANG TANLASH
     ============================================
     Har bir resurs turi uchun boshqa ikonka va rang
     ishlatiladi: pdf = ko'k, video = qizil, link = yashil.
     ============================================ */
  const getTypeConfig = (type) => {
    const configs = {
      pdf: {
        icon: FileText,
        color: "bg-blue-50 text-blue-600",
        label: "PDF",
        buttonText: "Yuklab olish",
        buttonIcon: Download,
      },
      video: {
        icon: Video,
        color: "bg-red-50 text-red-600",
        label: "Video",
        buttonText: "Ko'rish",
        buttonIcon: ExternalLink,
      },
      link: {
        icon: ExternalLink,
        color: "bg-green-50 text-green-600",
        label: "Havola",
        buttonText: "Ochish",
        buttonIcon: ExternalLink,
      },
    };
    return configs[type] || configs.link;
  };

  /* Hozirgi resurs turining sozlamalarini olish */
  const config = getTypeConfig(resource.type);
  /* Ikonka komponentini o'zgaruvchiga saqlash */
  const IconComponent = config.icon;
  const ButtonIcon = config.buttonIcon;

  return (
    /* Kartochka konteyner */
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/30 p-6 animate-fade-in-up flex flex-col"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      {/* ============================================
          YUQORI QISM — Ikonka va tur belgisi
          ============================================ */}
      <div className="flex items-start gap-4 mb-4">
        {/* Resurs turi ikonkasi — rangli fon bilan */}
        <div className={`p-3 rounded-xl ${config.color}`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="flex-1">
          {/* Resurs sarlavhasi */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {resource.title}
          </h3>

          {/* Resurs turi va hajmi */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-muted bg-cream-dark px-2 py-0.5 rounded-full">
              {config.label}
            </span>
            {/* Fayl hajmi — faqat mavjud bo'lsa ko'rsatish */}
            {resource.fileSize && (
              <span className="text-xs text-muted-light">
                {resource.fileSize}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Qisqacha tavsif */}
      <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
        {resource.description}
      </p>

      {/* ============================================
          YUKLAB OLISH / OCHISH TUGMASI
          ============================================
          Resurs turiga qarab tugma matni o'zgaradi:
          PDF = "Yuklab olish", Video = "Ko'rish", Link = "Ochish"
          ============================================ */}
      <a
        href={resource.url}
        /* Tashqi havolalar yangi tabda ochiladi */
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-300"
      >
        <ButtonIcon className="w-4 h-4" />
        {config.buttonText}
      </a>
    </div>
  );
}
