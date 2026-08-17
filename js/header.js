// Shared site header. Ported from project/Site Header.dc.html.
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
        <a href="capabilities.html">Capabilities</a>
        <a href="fabrics.html">Fabrics</a>
        <a href="facilities.html">Facilities</a>
        <a href="sustainability.html">Sustainability</a>
        <a href="global.html">Global</a>
        <a href="company.html">Company</a>
      </nav>
      <div class="header-right">
        <div class="lang-switch">
          <span class="lang-active">EN</span>
          <span class="lang-sep">/</span>
          <button type="button" class="lang-zh" title="中文 copy pending" disabled>中文</button>
        </div>
        <a href="contact.html" class="header-cta">Request a sample</a>
      </div>
    </header>
  `;

  const header = mount.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 90);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
