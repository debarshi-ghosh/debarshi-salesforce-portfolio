(() => {
  const base = '/debarshi-salesforce-portfolio/';
  const links = [
    ['Home',''],['Projects','projects/'],['Services','services/'],['Architecture','architecture/'],
    ['Expertise','expertise/'],['Learning Hub','blog/'],['About','about/'],['Hire Me','hire-me/'],['Contact','contact/']
  ];
  const current = location.pathname.replace(base,'').replace(/index\\.html$/,'');
  const nav = links.map(([label,path]) => {
    const active = current === path || (path && current.startsWith(path));
    return '<a href="'+base+path+'" class="'+(active?'active ':'')+(label==='Hire Me'?'hire-link':'')+'">'+label+'</a>';
  }).join('');
  const header = '<header class="site-header"><div class="wrap nav"><a class="brand" href="'+base+'">DEBARSHI GHOSH<span>.</span></a><nav class="navlinks">'+nav+'</nav></div></header>';
  const footer = '<footer class="site-footer"><div class="wrap footer-row"><span>© 2026 Debarshi Ghosh · Salesforce Technical Lead</span><div class="footer-links"><a href="'+base+'blog/">Learning Hub</a><a href="'+base+'projects/">Projects</a><a href="'+base+'contact/">Contact</a><a href="https://www.linkedin.com/in/debarshi-ghosh1995">LinkedIn</a></div></div></footer>';
  document.querySelector('#shared-header')?.replaceWith(document.createRange().createContextualFragment(header));
  document.querySelector('#shared-footer')?.replaceWith(document.createRange().createContextualFragment(footer));
})();