// Shared site header. Ported from project/Site Header.dc.html.
// Nav targets other than Fabrics aren't built yet (out of scope for this pass),
// so they link to "#" rather than a page that doesn't exist.
(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header" data-header>
      <a href="index.html" class="logo" aria-label="Ryder Textiles — home">
        <span>Ryder</span>
        <span>Textiles</span>
      </a>
      <nav class="site-nav">
        <a href="#">Capabilities</a>
        <a href="index.html">Fabrics</a>
        <a href="#">Facilities</a>
        <a href="#">Sustainability</a>
        <a href="#">Global</a>
        <a href="#">Company</a>
      </nav>
      <div class="header-right">
        <div class="lang-switch">
          <span class="lang-active">EN</span>
          <span class="lang-sep">/</span>
          <button type="button" class="lang-zh" title="中文 copy pending" disabled>中文</button>
        </div>
        <a href="#" class="header-cta">Request a sample</a>
      </div>
    </header>
  `;

  const header = mount.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 90);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
