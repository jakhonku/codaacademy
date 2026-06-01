import React from "react";

// ============================================
// Coda Academy Premium SVG Stickers
// ============================================

// 1. Calendar Sticker (Mashg'ulotlar Dasturi uchun)
export function CalendarSticker({ className = "w-16 h-16" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-md hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="calBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="calHeader" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="calRing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Calendar Base */}
      <rect x="15" y="25" width="70" height="60" rx="16" fill="url(#calBg)" stroke="#BFDBFE" strokeWidth="2" />
      
      {/* Calendar Header */}
      <path d="M15 41C15 32.1634 22.1634 25 31 25H69C77.8366 25 85 32.1634 85 41V45H15V41Z" fill="url(#calHeader)" />
      
      {/* Rings/Holes for Binder */}
      <rect x="28" y="15" width="8" height="16" rx="4" fill="url(#calRing)" />
      <rect x="64" y="15" width="8" height="16" rx="4" fill="url(#calRing)" />
      
      {/* Grid Pattern inside calendar (representing days) */}
      <rect x="25" y="55" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      <rect x="40" y="55" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      <rect x="55" y="55" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      <rect x="70" y="55" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      
      <rect x="25" y="70" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      <rect x="40" y="70" width="10" height="10" rx="3" fill="#2563EB" filter="url(#glow)" /> {/* Highlighted Day */}
      <rect x="55" y="70" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
      <rect x="70" y="70" width="10" height="10" rx="3" fill="#93C5FD" fillOpacity="0.6" />
    </svg>
  );
}

// 2. MapPin Sticker (Mashg'ulot Joyi uchun)
export function MapPinSticker({ className = "w-16 h-16" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-md hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="pinRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Radar rings under the pin */}
      <ellipse cx="50" cy="80" rx="20" ry="8" fill="#D1FAE5" opacity="0.8" />
      <ellipse cx="50" cy="80" rx="12" ry="5" fill="#A7F3D0" />
      
      {/* Pin Shape */}
      <path
        d="M50 15C32.8782 15 19 28.8782 19 46C19 69.25 50 85 50 85C50 85 81 69.25 81 46C81 28.8782 67.1218 15 50 15Z"
        fill="url(#pinGrad)"
        stroke="#A7F3D0"
        strokeWidth="2"
      />
      
      {/* Inner White Circle */}
      <circle cx="50" cy="45" r="14" fill="white" />
      {/* Inner Pin Logo / Detail */}
      <circle cx="50" cy="45" r="8" fill="url(#pinRing)" />
    </svg>
  );
}

// 3. Clock Sticker (Vaqti va Sharoit uchun)
export function ClockSticker({ className = "w-16 h-16" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-md hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clockBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="clockBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
      {/* Clock Base */}
      <circle cx="50" cy="50" r="38" fill="url(#clockBg)" stroke="url(#clockBorder)" strokeWidth="4" />
      
      {/* Clock Face Details */}
      <circle cx="50" cy="50" r="30" fill="white" />
      
      {/* Hour ticks */}
      <line x1="50" y1="24" x2="50" y2="28" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="50" y2="76" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="50" x2="28" y2="50" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <line x1="72" y1="50" x2="76" y2="50" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      
      {/* Hands */}
      <line x1="50" y1="50" x2="50" y2="35" stroke="#4C1D95" strokeWidth="3.5" strokeLinecap="round" /> {/* Minute hand */}
      <line x1="50" y1="50" x2="63" y2="50" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" /> {/* Hour hand */}
      
      {/* Center cap */}
      <circle cx="50" cy="50" r="5" fill="#4C1D95" />
      <circle cx="50" cy="50" r="2.5" fill="white" />
    </svg>
  );
}

// 4. Users Sticker (Oflayn Guruhlar uchun)
export function UsersSticker({ className = "w-12 h-12" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-sm hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="userGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="userGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      {/* Left User */}
      <circle cx="35" cy="40" r="14" fill="url(#userGrad1)" />
      <path d="M15 75C15 62.8497 23.9543 53 35 53C40.0963 53 44.7571 54.8967 48.3344 58.0267C46.2166 62.8315 45 68.271 45 74V75H15Z" fill="url(#userGrad1)" />

      {/* Right/Front User */}
      <circle cx="65" cy="45" r="14" fill="url(#userGrad2)" />
      <path d="M45 75C45 62.8497 53.9543 53 65 53C76.0457 53 85 62.8497 85 75H45Z" fill="url(#userGrad2)" stroke="#FFF" strokeWidth="2" />
    </svg>
  );
}

// 5. Lightbulb Sticker (Tayyor Promptlar uchun)
export function LightbulbSticker({ className = "w-12 h-12" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-sm hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="bulbGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Rays */}
      <path d="M50 10V18" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 22L28 28" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M78 22L72 28" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 50H18" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <path d="M90 50H82" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      
      {/* Bulb Body */}
      <path
        d="M34 70C34 75.5228 38.4772 80 44 80H56C61.5228 80 66 75.5228 66 70V65H34V70Z"
        fill="#9CA3AF"
      />
      <rect x="40" y="80" width="20" height="6" rx="3" fill="#6B7280" />
      
      {/* Glass part */}
      <path
        d="M50 25C36.1929 25 25 36.1929 25 50C25 58.7454 29.501 66.4385 36.313 70.835C36.4253 70.9074 36.5 71.0336 36.5 71.168V72H63.5V71.168C63.5 71.0336 63.5747 70.9074 63.687 70.835C70.499 66.4385 75 58.7454 75 50C75 36.1929 63.8071 25 50 25Z"
        fill="url(#bulbGrad)"
        filter="url(#bulbGlow)"
      />
      
      {/* Filament inside */}
      <path d="M42 55L47 45H53L58 55" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 6. Music/Guides Sticker (AI Qo'llanmalar uchun)
export function MusicSticker({ className = "w-12 h-12" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-sm hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="musicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="35" fill="url(#musicGrad)" />
      
      {/* CD grooves */}
      <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      <circle cx="50" cy="50" r="18" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      
      {/* Music Note */}
      <path d="M45 32V58C43.1 56.7 40.6 56 38 56C32.5 56 28 59.6 28 64C28 68.4 32.5 72 38 72C43.5 72 48 68.4 48 64V40H66V48C64.1 46.7 61.6 46 59 46C53.5 46 49 49.6 49 54C49 58.4 53.5 62 59 62C64.5 62 69 58.4 69 54V32H45Z" fill="white" />
    </svg>
  );
}

// 7. BookOpen/Document Sticker
export function BookOpenSticker({ className = "w-12 h-12" }) {
  return (
    <svg
      className={`${className} filter drop-shadow-sm hover:scale-110 transition-transform duration-300`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Book Cover */}
      <path d="M15 25C15 20.0294 19.0294 16 24 16H76C80.9706 16 85 20.0294 85 25V75C85 79.9706 80.9706 84 76 84H24C19.0294 84 15 79.9706 15 75V25Z" fill="url(#bookGrad)" />
      
      {/* Book Pages */}
      <path d="M22 22H78V78H22V22Z" fill="white" />
      
      {/* Lines representing writing */}
      <line x1="30" y1="34" x2="70" y2="34" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="44" x2="70" y2="44" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="54" x2="70" y2="54" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" /> {/* Highlight line */}
      <line x1="30" y1="64" x2="55" y2="64" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
      
      {/* Sparkles */}
      <path d="M73 60L75 65L80 67L75 69L73 74L71 69L66 67L71 65L73 60Z" fill="#F59E0B" />
    </svg>
  );
}
