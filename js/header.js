// Shared site header. Ported from project/Site Header.dc.html.
// Below the mobile breakpoint (see .nav-toggle / .nav-panel in styles.css)
// nav + lang switch + CTA become a slide-over drawer behind a hamburger
// button. Above it, .nav-panel is `display:contents` so this markup has
// zero effect on the original desktop layout.
(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header" data-header>
      <a href="index.html" class="logo" aria-label="Ryder Textiles — home">
        <span>Ryder</span>
        <span>Textiles</span>
      </a>
      <button type="button" class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false" aria-controls="nav-panel">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-scrim" data-nav-scrim></div>
      <div class="nav-panel" id="nav-panel">
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
      </div>
    </header>
  `;

  const header = mount.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 90);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark the current page's nav link (desktop + drawer share the same markup).
  const here = (location.pathname.split('/').pop() || 'index.html');
  mount.querySelectorAll('.site-nav a').forEach((a) => {
    if (a.getAttribute('href') === here) a.classList.add('is-active');
  });

  // Mobile nav drawer.
  const toggle = mount.querySelector('[data-nav-toggle]');
  const panel = mount.querySelector('#nav-panel');
  const scrim = mount.querySelector('[data-nav-scrim]');

  function setOpen(open) {
    panel.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  scrim.addEventListener('click', () => setOpen(false));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();
