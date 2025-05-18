(function() {
  const items = Array.from(document.querySelectorAll('#theme-list li'));
  const toggle = document.getElementById('theme-toggle');
  const list = document.getElementById('theme-list');
  const link = document.getElementById('theme-link');
  let index = 0;

  function parseColor(c) {
    const el = document.createElement('div');
    el.style.color = c;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    document.body.removeChild(el);
    return rgb ? rgb.slice(1,4).map(n=>+n) : [0,0,0];
  }
  function luminance(r,g,b){
    const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
    return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
  }
  function contrastRatio(f,b){
    const L1=luminance(...f);const L2=luminance(...b);
    return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
  }
  function contrastCheck(){
    const style=getComputedStyle(document.body);
    const fg=parseColor(style.getPropertyValue('--c-fg'));
    const bg=parseColor(style.getPropertyValue('--c-bg'));
    console.warn('contrast ratio', contrastRatio(fg,bg).toFixed(2));
  }

  function applyTheme(id){
    link.href = `themes/${id}.css`;
    document.body.dataset.theme = id;
    localStorage.setItem('theme', id);
    contrastCheck();
  }

  toggle.addEventListener('click', () => {
    const open=!list.hidden;
    list.hidden=open;
    toggle.setAttribute('aria-expanded', String(!open));
    if(!open){items[index].focus();}
  });

  list.addEventListener('click', e => {
    const li=e.target.closest('li[data-theme]');
    if(li){ index=items.indexOf(li); applyTheme(li.dataset.theme); list.hidden=true; toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
  });

  list.addEventListener('keydown', e => {
    const len=items.length;
    if(e.key==='ArrowDown'){ index=(index+1)%len; items[index].focus(); e.preventDefault(); }
    if(e.key==='ArrowUp'){ index=(index-1+len)%len; items[index].focus(); e.preventDefault(); }
    if(e.key==='Enter' || e.key===' '){ applyTheme(items[index].dataset.theme); list.hidden=true; toggle.setAttribute('aria-expanded','false'); toggle.focus(); }
  });

  const stored=localStorage.getItem('theme');
  if(stored){ applyTheme(stored); }
  else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
    applyTheme('dark-highcontrast');
  } else {
    applyTheme('minimal-light');
  }
})();
