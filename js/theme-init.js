/* ==========================================================================
   theme-init.js — ตั้งธีมก่อนหน้าจอวาดครั้งแรก (กันจอแวบสีขาว)
   ต้องโหลดใน <head> แบบ blocking (ไม่มี defer)
   ========================================================================== */
(function () {
      try {
        let theme = localStorage.getItem('simulator-theme') ||
          (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (theme !== 'dark') theme = 'light';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
})();
