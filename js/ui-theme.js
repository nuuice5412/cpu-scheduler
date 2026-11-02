/* ==========================================================================
   ui-theme.js
   สลับธีมสว่าง/มืด
   แยกออกจาก index.html — โหลดด้วย <script src> ตามลำดับใน index.html
   ========================================================================== */

      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('simulator-theme', theme); } catch (e) {}
        const radio = document.querySelector(`.theme-radio[value="${theme}"]`);
        if (radio) radio.checked = true;
      }
