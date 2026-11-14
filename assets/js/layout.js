(() => {
  const base = '/debarshi-salesforce-portfolio/';
  const email = 'debarshi.ghosh009@gmail.com';
  const mobile = '+91 7076652995';
  const mobileHref = '+917076652995';
  const linkedin = 'https://www.linkedin.com/in/debarshi-ghosh1995';
  const links = [
    ['Home',''],['Projects','projects/'],['Services','services/'],['Architecture','architecture/'],
    ['Expertise','expertise/'],['Learning Hub','blog/'],['About','about/'],['Hire Me','hire-me/'],['Contact','contact/']
  ];
  const current = location.pathname.replace(base,'').replace(/index\\.html$/,'');
  const nav = links.map(([label,path]) => {
    const active = current === path || (path && current.startsWith(path));
    return '<a href="'+base+path+'" class="'+(active?'active ':'')+(label==='Hire Me'?'hire-link':'')+'">'+label+'</a>';
  }).join('');
  const header = '<header class="site-header"><div class="wrap nav"><a class="brand" href="'+base+'">DEBARSHI GHOSH<span>.</span></a><nav class="navlinks" aria-label="Main navigation">'+nav+'</nav></div></header>';
  const footer = '<footer class="site-footer"><div class="wrap footer-layout">'+
    '<div class="footer-brand"><a class="footer-logo" href="'+base+'">DEBARSHI GHOSH<span>.</span></a><p>Salesforce Technical Lead · Remote from India</p></div>'+
    '<div class="footer-section"><strong>Connect</strong>'+
    '<a class="footer-contact-link" href="mailto:'+email+'"><span class="footer-icon" aria-hidden="true">✉</span><span>'+email+'</span></a>'+
    '<a class="footer-contact-link" href="tel:'+mobileHref+'"><span class="footer-icon" aria-hidden="true">📞</span><span>'+mobile+'</span></a>'+
    '<a class="footer-contact-link" href="'+linkedin+'" target="_blank" rel="noopener noreferrer"><span class="footer-icon linkedin-brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" class="footer-svg"><path fill="#0A66C2" d="M3 3h18v18H3z"/><path fill="#fff" d="M7.1 9.2H4.8v7.5h2.3V9.2ZM5.9 8.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Zm11.2 1c-1.2 0-2 .7-2.3 1.2V9.2h-2.3v7.5h2.3v-4c0-1.1.2-2.1 1.5-2.1 1.2 0 1.2 1.1 1.2 2.1v4h2.3v-4.5c0-2.2-.5-3.9-2.7-3.9Z"/></svg></span><span>LinkedIn</span><span class="footer-external">↗</span></a>'+
    '<a class="footer-contact-link" href="https://github.com/debarshi-ghosh" target="_blank" rel="noopener noreferrer"><span class="footer-icon github-footer-icon" aria-hidden="true">⌘</span><span>GitHub</span><span class="footer-external">↗</span></a>'+
    '</div></div><div class="wrap footer-bottom"><span>© '+new Date().getFullYear()+' Debarshi Ghosh. All rights reserved.</span><a href="'+base+'contact/">Contact ↗</a></div></footer>'
  document.querySelector('#shared-header')?.replaceWith(document.createRange().createContextualFragment(header));
  document.querySelector('#shared-footer')?.replaceWith(document.createRange().createContextualFragment(footer));
})();