/* ============================================
   BO'LIM SARLAVHASI (SectionTitle.js)
   ============================================
   Bu komponent qayta ishlatiluvchi (reusable) bo'lim
   sarlavhasi. Har bir bo'limning yuqorisida ko'rinadi.
   
   Props (parametrlar):
   - title: Asosiy sarlavha matni
   - subtitle: Qo'shimcha izoh matni (ixtiyoriy)
   ============================================ */

export default function SectionTitle({ title, subtitle }) {
  return (
    /* Bo'lim sarlavhasi konteyner — markazda joylashgan */
    <div className="text-center mb-12">
      {/* Asosiy sarlavha */}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>

      {/* Subtitle mavjud bo'lsagina ko'rsatish */}
      {subtitle && (
        <p className="text-muted text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

      {/* Dekorativ chiziq — sarlavha ostida chiroyli ko'rinish uchun */}
      <div className="mt-6 flex justify-center">
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
      </div>
    </div>
  );
}
