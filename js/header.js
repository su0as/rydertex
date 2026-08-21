// Shared site header. Ported from project/Site Header.dc.html.
// Below the mobile breakpoint (see .nav-toggle / .nav-panel in styles.css)
// nav + lang switch + CTA become a slide-over drawer behind a hamburger
// button. Above it, .nav-panel is `display:contents` so this markup has
// zero effect on the original desktop layout.
//
// Clean URLs: every page lives at /pagename/ except Home at the site
// root, so this shared component needs to know how deep the current page
// sits to link correctly. The mount element carries a data-base attribute
// ("../" for nested pages, absent/"" for the root) set per-page in HTML.
(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const base = mount.dataset.base || '';

  mount.innerHTML = `
    <header class="site-header" data-header>
      <a href="${base}" class="logo" aria-label="Ryder Textiles — home">
        <span>Ryder</span>
        <span>Textiles</span>
      </a>
      <button type="button" class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false" aria-controls="nav-panel">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-scrim" data-nav-scrim></div>
      <div class="nav-panel" id="nav-panel">
        <nav class="site-nav">
          <a href="${base}capabilities/">Capabilities</a>
          <a href="${base}fabrics/">Fabrics</a>
          <a href="${base}facilities/">Facilities</a>
          <a href="${base}sustainability/">Sustainability</a>
          <a href="${base}global/">Global</a>
          <a href="${base}company/">Company</a>
        </nav>
        <div class="header-right">
          <div class="lang-switch">
            <span class="lang-active">EN</span>
          </div>
          <a href="${base}contact/" class="header-cta">Request a sample</a>
        </div>
      </div>
    </header>
  `;

  const header = mount.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 90);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark the current page's nav link (desktop + drawer share the same markup).
  const currentPath = location.pathname.replace(/index\.html$/, '');
  mount.querySelectorAll('.site-nav a').forEach((a) => {
    const linkPath = new URL(a.getAttribute('href'), location.href).pathname;
    if (linkPath === currentPath) a.classList.add('is-active');
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
