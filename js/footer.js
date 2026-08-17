// Shared site footer. Ported from project/Site Footer.dc.html.
// See js/header.js for the data-base convention (clean-URL nesting).
(function () {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const base = mount.dataset.base || '';

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <circle cx="26" cy="26" r="24.5" stroke="#2F53E0" stroke-width="1.2"></circle>
            <circle cx="26" cy="26" r="1.6" fill="#2F53E0"></circle>
          </svg>
          <img src="${base}assets/rydertex-assets/07-derived/logo-rydertex-paper.png" alt="RyderTex — Changshu Ryder Textile Co., Ltd." width="1158" height="329" loading="lazy" class="footer-logo">
          <p class="footer-sub">A subsidiary of<br>Landsun Textile Group</p>
        </div>
        <div class="footer-col">
          <span class="footer-label">Address</span>
          <span>Building #21, Huanhu Hiongshun<br>#78 Xin'an Jiang Road<br>Southeast Development Zone<br>Changshu, Jiangsu, China 215500</span>
        </div>
        <div class="footer-col">
          <span class="footer-label">Contact</span>
          <a href="mailto:info@rydertex.com.cn" class="footer-link-bright">info@rydertex.com.cn</a>
          <a href="https://rydertextiles.com" class="footer-link-dim">rydertextiles.com</a>
          <span class="footer-label" style="margin-top:8px">Language</span>
          <span><span class="lang-active">EN</span> <span class="lang-sep">/</span> <span class="lang-zh-pending">中文 pending</span></span>
        </div>
        <div class="footer-col">
          <span class="footer-label">WeChat</span>
          <div class="footer-qr">[[NEEDS INPUT: WeChat QR]]</div>
          <div class="draft-fallback footer-qr-fallback">QR code available on request — email us.</div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Changshu Ryder Textile Co., Ltd.</span><span>GRS</span><span>OEKO-TEX Standard 100</span><span>RCS</span><span>BCI</span><span>FSC</span><span>TENCEL™</span>
      </div>
      <div class="footer-watermark" aria-hidden="true">RYDERTEX</div>
    </footer>
  `;
})();
