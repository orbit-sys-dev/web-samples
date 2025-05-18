(function() {
  const themes = {
    light: 'Minimal Light',
    dark: 'Elegant Dark',
    green: 'Nature Green',
    coral: 'Sunset Coral',
    neon: 'Retro Neon'
  };

  const loaded = {};

  function applyTheme(key) {
    document.body.dataset.theme = key;
    if (!loaded[key]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `theme-${key}.css`;
      document.head.appendChild(link);
      loaded[key] = link;
    }
  }

  const toggle = document.getElementById('theme-toggle');
  const options = document.getElementById('theme-options');

  toggle.addEventListener('click', () => {
    const isOpen = !options.hidden;
    options.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  options.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (li && li.dataset.theme) {
      applyTheme(li.dataset.theme);
      options.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }
})();
