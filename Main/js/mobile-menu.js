/* ============================================================ */
/* LUXURY MOBILE NAVIGATION DRAWER — FASHION COMFORT GROUP       */
/* ============================================================ */
(function() {
  function initMobileNav() {
    var nav = document.querySelector('.ds-nav');
    if (!nav) return;
    var inner = nav.querySelector('.ds-nav-inner');
    if (!inner) return;

    // Check if hamburger already exists
    if (inner.querySelector('.ds-hamburger')) return;

    // Determine if we are inside a subfolder
    var isSubfolder = window.location.pathname.includes('/Main/') ||
                      window.location.pathname.includes('/Manufacturing/') ||
                      window.location.pathname.includes('/Our%20History/') ||
                      window.location.pathname.includes('/Our History/') ||
                      window.location.pathname.includes('/Products/') ||
                      window.location.pathname.includes('/Responsibility/') ||
                      window.location.pathname.includes('/LYK%20Project/') ||
                      window.location.pathname.includes('/LYK Project/');
    var prefix = isSubfolder ? '../' : '';

    // Hamburger button
    var hamburger = document.createElement('button');
    hamburger.className = 'ds-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle Navigation Menu');
    hamburger.setAttribute('type', 'button');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(hamburger);

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'ds-mobile-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(11,19,12,0.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:1001;opacity:0;visibility:hidden;transition:opacity 0.3s ease, visibility 0.3s ease;pointer-events:none;';
    document.body.appendChild(overlay);

    // Active page detection
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';

    var links = [
      { href: prefix + 'index.html#about', label: 'About Us', i18nKey: 'nav.about' },
      { href: prefix + 'products.html', label: 'Products', i18nKey: 'nav.products', page: 'products.html' },
      { href: prefix + 'manufacturing.html', label: 'Manufacturing', i18nKey: 'nav.manufacturing', page: 'manufacturing.html' },
      { href: prefix + 'responsibility.html', label: 'Responsibility', i18nKey: 'nav.responsibility', page: 'responsibility.html' },
      { href: prefix + 'our-history.html', label: 'Our History', i18nKey: 'nav.history', page: 'our-history.html' },
      { href: prefix + 'lyk.html', label: 'LYK Project', i18nKey: 'nav.lyk', page: 'lyk.html' },
      { href: prefix + 'index.html#contact', label: 'Contact', i18nKey: 'nav.contact' }
    ];

    // Mobile menu drawer
    var menu = document.createElement('div');
    menu.className = 'ds-mobile-drawer';
    menu.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:100%;max-width:350px;background:rgba(14,24,16,0.97);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border-left:1px solid rgba(201,169,97,0.25);box-shadow:-12px 0 40px rgba(0,0,0,0.5);z-index:1002;transform:translateX(100%);opacity:0;visibility:hidden;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease, visibility 0s linear 0.35s;display:flex;flex-direction:column;padding:36px 28px 28px;overflow-y:auto;';

    var headerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,0.08);">' +
      '<span style="font-family:\'Cormorant Garamond\',serif;font-size:20px;letter-spacing:0.12em;text-transform:uppercase;color:#FFFFFF;font-weight:600;">Fashion Comfort</span>' +
      '<span style="font-family:\'Outfit\',sans-serif;font-size:10px;letter-spacing:0.2em;color:#C9A961;text-transform:uppercase;font-weight:700;">MENU</span>' +
      '</div>';

    var linksHTML = links.map(function(l) {
      var isCurrent = (l.page && currentFile === l.page) || (!l.page && currentFile === 'index.html' && l.href.includes('#about') && window.location.hash === '#about');
      var i18nAttr = l.i18nKey ? ' data-i18n="' + l.i18nKey + '"' : '';
      var activeStyle = isCurrent ? 'color:#C9A961;font-weight:600;' : 'color:rgba(255,255,255,0.75);';
      var indicator = isCurrent ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#C9A961;margin-left:auto;"></span>' : '';
      return '<a href="' + l.href + '"' + i18nAttr + ' style="display:flex;align-items:center;justify-content:space-between;font-family:\'Outfit\',sans-serif;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);transition:color 0.2s ease;' + activeStyle + '">' +
             '<span>' + l.label + '</span>' + indicator + '</a>';
    }).join('');

    var langBtnStyle = 'flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:8px;font-family:\'Outfit\',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.7);cursor:pointer;padding:10px 8px;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.2s ease;';
    var flagStyle = 'width:16px;height:11px;display:inline-block;vertical-align:middle;flex-shrink:0;';
    var flagEN = '<svg style="' + flagStyle + '" viewBox="0 0 60 30"><clipPath id="ms_en"><circle cx="30" cy="15" r="15"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" clip-path="url(#ms_en)"/><path d="M30,0V30 M0,15H60" stroke="#fff" stroke-width="10"/><path d="M30,0V30 M0,15H60" stroke="#C8102E" stroke-width="6"/></svg>';
    var flagES = '<svg style="' + flagStyle + '" viewBox="0 0 6 4"><rect width="6" height="4" fill="#c60b1e"/><rect y="1" width="6" height="2" fill="#ffc400"/></svg>';
    var flagJA = '<svg style="' + flagStyle + '" viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="12" fill="#bc002d"/></svg>';

    var footerHTML = '<div style="margin-top:auto;padding-top:24px;">' +
      '<div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C9A961;font-weight:600;margin-bottom:12px;">SELECT LANGUAGE</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button style="' + langBtnStyle + '" class="ml-btn ds-mobile-lang-btn" data-lang="en" onclick="if(window.i18n) i18n.switchLanguage(\'en\')">' + flagEN + 'EN</button>' +
        '<button style="' + langBtnStyle + '" class="ml-btn ds-mobile-lang-btn" data-lang="es" onclick="if(window.i18n) i18n.switchLanguage(\'es\')">' + flagES + 'ES</button>' +
        '<button style="' + langBtnStyle + '" class="ml-btn ds-mobile-lang-btn" data-lang="ja" onclick="if(window.i18n) i18n.switchLanguage(\'ja\')">' + flagJA + 'JA</button>' +
      '</div>' +
      '<div style="margin-top:24px;font-size:11px;color:rgba(255,255,255,0.4);text-align:center;">© 2026 Fashion Comfort Group</div>' +
    '</div>';

    menu.innerHTML = headerHTML + '<div style="display:flex;flex-direction:column;">' + linksHTML + '</div>' + footerHTML;
    document.body.appendChild(menu);

    function updateActiveLang() {
      var currentLang = (typeof i18n !== 'undefined' && i18n.currentLang) ? i18n.currentLang : (localStorage.getItem('fc-lang') || 'en');
      menu.querySelectorAll('.ml-btn').forEach(function(btn) {
        if (btn.dataset.lang === currentLang) {
          btn.style.color = '#FFFFFF';
          btn.style.borderColor = '#C9A961';
          btn.style.background = 'rgba(201,169,97,0.2)';
        } else {
          btn.style.color = 'rgba(255,255,255,0.7)';
          btn.style.borderColor = 'rgba(255,255,255,0.15)';
          btn.style.background = 'rgba(255,255,255,0.05)';
        }
      });
    }
    updateActiveLang();

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      hamburger.classList.add('open');
      menu.style.transform = 'translateX(0)';
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transition = 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease, visibility 0s linear 0s';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
      updateActiveLang();
    }

    function closeMenu() {
      isOpen = false;
      hamburger.classList.remove('open');
      menu.style.transform = 'translateX(100%)';
      menu.style.opacity = '0';
      menu.style.transition = 'transform 0.3s ease-in, opacity 0.2s ease, visibility 0s linear 0.3s';
      menu.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      overlay.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isOpen) closeMenu(); else openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    menu.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        closeMenu();
      }
      var btn = e.target.closest('.ml-btn');
      if (btn) {
        setTimeout(updateActiveLang, 50);
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    window.closeMobileMenu = closeMenu;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
